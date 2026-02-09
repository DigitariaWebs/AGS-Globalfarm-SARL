import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { ReactElement } from "react";

interface EmailOptions {
  to: string;
  subject: string;
  template: ReactElement;
}

// Validate email configuration
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.error("⚠️ Email configuration missing!");
  console.error(
    "Please add EMAIL_USER and EMAIL_PASSWORD to your .env.local file",
  );
  console.error("See docs/QUICKSTART.md for setup instructions");
}

// Create reusable transporter with connection pooling and timeout settings
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_PORT === "465", // true for 465, false for other ports
  auth:
    process.env.EMAIL_USER && process.env.EMAIL_PASSWORD
      ? {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        }
      : undefined,
  pool: true, // Use connection pooling
  maxConnections: 1, // Limit concurrent connections for serverless
  maxMessages: 3, // Max messages per connection before reconnecting
  rateDelta: 1000, // Time window for rate limiting (1 second)
  rateLimit: 5, // Max messages per rateDelta
  socketTimeout: 30000, // 30 seconds socket timeout
  greetingTimeout: 10000, // 10 seconds greeting timeout
  connectionTimeout: 10000, // 10 seconds connection timeout
  tls: {
    rejectUnauthorized: true,
    minVersion: "TLSv1.2",
  },
});

/**
 * Send email using React component template
 */
export async function sendEmail({ to, subject, template }: EmailOptions) {
  // Check if credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    const errorMsg = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  EMAIL CONFIGURATION MISSING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please configure email settings in your .env.local file:

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password

📖 See docs/QUICKSTART.md for detailed setup instructions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;
    console.error(errorMsg);
    throw new Error("Email credentials not configured. Check .env.local file.");
  }

  // Retry logic for connection issues
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Render React component to HTML
      const html = await render(template);

      // Send email
      const info = await transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || "AGS Globalfarm SARL"}" <${
          process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER
        }>`,
        to,
        subject,
        html,
      });

      console.log("✅ Email sent successfully:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      lastError = error as Error;
      console.error(
        `❌ Error sending email (attempt ${attempt}/${maxRetries}):`,
        error,
      );

      // Provide helpful error messages
      if (error instanceof Error) {
        if (error.message.includes("Missing credentials")) {
          console.error(
            "\n💡 Tip: Check that EMAIL_USER and EMAIL_PASSWORD are set in .env.local",
          );
          throw error; // Don't retry for configuration issues
        } else if (error.message.includes("Invalid login")) {
          console.error(
            "\n💡 Tip: For Gmail, use an App Password, not your account password",
          );
          console.error(
            "   Generate one at: https://myaccount.google.com/apppasswords",
          );
          throw error; // Don't retry for auth issues
        } else if (
          error.message.includes("ECONNECTION") ||
          error.message.includes("Connection closed") ||
          error.message.includes("ETIMEDOUT") ||
          error.message.includes("ECONNRESET")
        ) {
          // Connection issues - retry with exponential backoff
          if (attempt < maxRetries) {
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
            console.log(`⏳ Retrying in ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));

            // Close and recreate connection for next attempt
            transporter.close();
            continue;
          }
        }
      }

      // If last attempt, throw the error
      if (attempt === maxRetries) {
        throw lastError;
      }
    }
  }

  throw lastError || new Error("Failed to send email after retries");
}

/**
 * Verify email transporter configuration
 */
export async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log("Email server is ready to send emails");
    return true;
  } catch (error) {
    console.error("Email server verification failed:", error);
    return false;
  }
}
