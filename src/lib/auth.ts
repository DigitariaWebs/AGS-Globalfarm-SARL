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
  baseURL: process.env.BETTER_AUTH_BASE_URL || "http://localhost:3000",
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

      // Await the email sending to get actual status
      // This allows the client to know if the email was actually sent
      await sendEmail({
        to: user.email,
        subject: "Réinitialisation de votre mot de passe - AGS Globalfarm",
        template: PasswordResetEmail({
          userName,
          resetUrl: url,
        }),
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
