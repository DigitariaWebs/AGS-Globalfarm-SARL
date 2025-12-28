import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data } = body;
    const { invoice, custom_data, hash } = data;

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
      return NextResponse.json({ error: "Invalid hash" }, { status: 400 });
    }

    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db();

    // Check payment status
    if (invoice.status === "completed") {
      // Payment successful - create order
      const order = {
        userId: custom_data?.userId,
        items: invoice.items,
        totalAmount: invoice.total_amount,
        paymentToken: invoice.token,
        status: "paid",
        paymentMethod: "paydunya",
        address: custom_data?.address,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection("orders").insertOne(order);

      // Update user addresses if needed
      if (custom_data?.address) {
        await db.collection("users").updateOne(
          { id: custom_data.userId },
          {
            $addToSet: {
              addresses: custom_data.address,
            },
          },
        );
      }

      // Clear cart or mark as processed (implement based on your cart logic)
    } else if (invoice.status === "failed" || invoice.status === "cancelled") {
      // Payment failed - log for manual review
      await db.collection("failed_payments").insertOne({
        ...data,
        processedAt: new Date(),
      });
    }

    await client.close();

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
