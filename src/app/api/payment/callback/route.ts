import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import crypto from "crypto";
import { z } from "zod";
import qs from "qs";
import Order from "@/lib/models/Order";
import FormationModel from "@/lib/models/Formation";
import { connectToDatabase } from "@/lib/db";
import type {
  OrderItem,
  PaydunyaCallbackData,
  FormationSession,
} from "@/types";

// Zod schemas for validation
const PaydunyaActionsSchema = z.object({
  cancel_url: z.string().optional(),
  return_url: z.string().optional(),
  callback_url: z.string().optional(),
});

const PaydunyaCustomerSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
});

const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  postalCode: z.string(),
  country: z.string(),
  isDefault: z.coerce.boolean().optional(),
});

const CustomDataSchema = z.object({
  userId: z.string(),
  cart: z.array(z.any()),
  address: AddressSchema.optional(),
});

const InvoiceSchema = z
  .object({
    total_amount: z.coerce.number(),
  })
  .passthrough();

const CallbackDataSchema = z
  .object({
    response_code: z.string().optional(),
    response_text: z.string().optional(),
    hash: z.string(),
    invoice: InvoiceSchema,
    custom_data: CustomDataSchema,
    actions: PaydunyaActionsSchema.optional(),
    mode: z.string().optional(),
    status: z.string(),
    customer: PaydunyaCustomerSchema.optional(),
    receipt_url: z.string().optional(),
    fail_reason: z.string().optional(),
    errors: z
      .object({
        message: z.string().optional(),
        description: z.string().optional(),
      })
      .optional(),
  })
  .passthrough();

// Helper function to convert objects with numeric keys to arrays
function objectToArray(obj: unknown): unknown {
  if (typeof obj === "object" && obj !== null && !Array.isArray(obj)) {
    const keys = Object.keys(obj);
    if (keys.every((key) => /^\d+$/.test(key))) {
      const arr: unknown[] = [];
      for (const key of keys.sort((a, b) => parseInt(a) - parseInt(b))) {
        arr[parseInt(key)] = objectToArray(
          (obj as Record<string, unknown>)[key],
        );
      }
      return arr;
    } else {
      const newObj: Record<string, unknown> = {};
      for (const key in obj) {
        newObj[key] = objectToArray((obj as Record<string, unknown>)[key]);
      }
      return newObj;
    }
  }
  return obj;
}

export async function POST(request: NextRequest) {
  console.log("Paydunya callback received");
  try {
    const formData = await request.formData();
    console.log("Form data keys:", Array.from(formData.keys()));

    // Build query string from form data keys starting with 'data['
    const queryString = Array.from(formData.entries())
      .filter(([key]) => key.startsWith("data["))
      .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
      .join("&");

    // Parse the query string into nested object
    const parsed = qs.parse(queryString, { allowDots: true });
    const data = parsed.data as Record<string, unknown>;

    // Convert objects with numeric keys to arrays
    const parsedData = objectToArray(data);

    console.log("Parsed data:", JSON.stringify(parsedData, null, 2));

    // Validate the data with Zod
    let validatedData: PaydunyaCallbackData;
    try {
      validatedData = CallbackDataSchema.parse(parsedData);
    } catch (validationError) {
      console.error("Validation error:", validationError);
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 },
      );
    }

    const { invoice, custom_data, hash, status } = validatedData;

    // Verify the hash
    const masterKey = process.env.PAYDUNYA_MASTER_KEY;
    if (!masterKey) {
      return NextResponse.json(
        { error: "Paydunya master key not configured" },
        { status: 500 },
      );
    }
    const expectedHash = crypto
      .createHash("sha512")
      .update(masterKey)
      .digest("hex");
    if (expectedHash !== hash) {
      console.error("Hash mismatch: expected", expectedHash, "got", hash);
      return NextResponse.json({ error: "Invalid hash" }, { status: 400 });
    }

    // Connect to MongoDB
    await connectToDatabase();

    console.log("Connected to MongoDB");

    // Check payment status
    if (status === "completed") {
      // Payment successful - create order
      const orderItems: OrderItem[] = [];
      for (const item of custom_data.cart) {
        const orderItem = item as OrderItem;
        if (item.title) {
          // It's a formation
          const formation = await FormationModel.findById(item._id || item.id);
          if (formation && formation.type === "presentiel") {
            const openSession = (
              formation.sessions as FormationSession[]
            )?.find((s: FormationSession) => s.status === "open");
            orderItem.sessionId = openSession?.id;
          }
        }
        orderItems.push(orderItem);
      }

      const order = await Order.create({
        userId: custom_data.userId,
        items: orderItems,
        totalAmount: invoice.total_amount,
        paymentStatus: "paid",
        paymentMethod: "paydunya",
        address: custom_data.address,
      });
      console.log("Order created successfully:", order._id);

      // Update user addresses if needed
      const client = new MongoClient(process.env.MONGODB_URI!);
      await client.connect();
      const db = client.db();
      if (custom_data.address) {
        await db.collection("users").updateOne(
          { id: custom_data.userId },
          {
            $addToSet: {
              addresses: custom_data.address,
            },
          },
        );
      }
      await client.close();

      // Clear cart or mark as processed (implement based on your cart logic)
    } else if (status === "failed" || status === "cancelled") {
      // Payment failed - create order with failed status
      const orderItems: OrderItem[] = [];
      for (const item of custom_data.cart) {
        const orderItem = item as OrderItem;
        if (item.title) {
          // It's a formation
          const formation = await FormationModel.findById(item._id || item.id);
          if (formation && formation.type === "presentiel") {
            const openSession = (
              formation.sessions as FormationSession[]
            )?.find((s: FormationSession) => s.status === "open");
            orderItem.sessionId = openSession?.id;
          }
        }
        orderItems.push(orderItem);
      }

      await Order.create({
        userId: custom_data.userId,
        items: orderItems,
        totalAmount: invoice.total_amount,
        paymentStatus: "failed",
        paymentMethod: "paydunya",
        address: custom_data.address,
      });

      const client = new MongoClient(process.env.MONGODB_URI!);
      await client.connect();
      const db = client.db();
      await db.collection("failed_payments").insertOne({
        ...(parsedData as Record<string, unknown>),
        processedAt: new Date(),
      });
      await client.close();
    }

    // Return success response to Paydunya
    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("IPN callback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
