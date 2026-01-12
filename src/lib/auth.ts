import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const mongoClient = new MongoClient(
  process.env.MONGODB_URI || "mongodb://localhost:27017",
);

export const auth = betterAuth({
  database: mongodbAdapter(mongoClient.db()),
  emailAndPassword: {
    enabled: true,
  },
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
