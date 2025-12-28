import mongoose, { Schema, Document } from "mongoose";
import type { OrderItem } from "@/types";

export interface IOrder extends Document {
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: "paid" | "pending" | "failed";
  paymentMethod?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String },
    title: { type: String },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    unit: { type: String },
    image: { type: String },
    description: { type: String },
    stock: { type: Number },
    organic: { type: Boolean },
    rating: { type: Number },
    reviews: { type: Number },
    isNewProduct: { type: Boolean },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    sessionId: { type: Number },
  },
  { _id: false },
);

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "failed"],
      required: true,
    },
    paymentMethod: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
  },
  {
    timestamps: true,
  },
);

// Prevent re-compilation of model in development
const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
