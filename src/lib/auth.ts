import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { sendEmail } from "./email";
import PasswordResetEmail from "@/emails/PasswordResetEmail";

const mongoClient = new MongoClient(
  process.env.MONGODB_URI || "mongodb://localhost:27017",
);

export const auth = betterAuth({
  database: mongodbAdapter(mongoClient.db()),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      const userRecord = user as {
        firstName?: string;
        lastName?: string;
        email: string;
      };
      const userName = userRecord.firstName
        ? `${userRecord.firstName} ${userRecord.lastName || ""}`.trim()
        : user.email;

      // Send password reset email (don't await to prevent timing attacks)
      void sendEmail({
        to: user.email,
        subject: "Réinitialisation de votre mot de passe - AGS Globalfarm",
        template: PasswordResetEmail({
          userName,
          resetUrl: url,
        }),
      }).catch((error) => {
        console.error("Failed to send password reset email:", error);
      });
    },
  },
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"],
  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: true,
      },
      lastName: {
        type: "string",
        required: true,
      },
      gender: {
        type: ["male", "female", "other"],
        required: false,
      },
    },
    fields: {
      name: "false",
    },
  },
});
