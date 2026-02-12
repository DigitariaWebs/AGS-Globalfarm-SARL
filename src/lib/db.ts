import mongoose from "mongoose";
import type { Formation, Product, Order, FormationProgress } from "@/types";
import FormationModel, { IFormation } from "./models/Formation";
import ProductModel, { IProduct } from "./models/Product";
import OrderModel, { IOrder } from "./models/Order";
import FormationProgressModel from "./models/FormationProgress";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";

export async function connectToDatabase() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri);
      console.log("Connected to MongoDB with Mongoose");
    }
    return mongoose.connection.db;
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
}

export async function getFormations(): Promise<Formation[]> {
  try {
    await connectToDatabase();
    const formations = await FormationModel.find({});
    return formations.map(
      (formation: IFormation) => formation.toObject() as Formation,
    );
  } catch (error) {
    console.error("Failed to fetch formations", error);
    return [];
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    await connectToDatabase();
    const products = await ProductModel.find({});
    return products.map((product: IProduct) => product.toObject() as Product);
  } catch (error) {
    console.error("Failed to fetch products", error);
    return [];
  }
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    await connectToDatabase();
    const orders = await OrderModel.find({ userId });
    return orders.map((order: IOrder) => order.toObject() as Order);
  } catch (error) {
    console.error("Failed to fetch user orders", error);
    return [];
  }
}

export async function getOwnedFormations(userId: string): Promise<number[]> {
  try {
    const orders = await getUserOrders(userId);
    const ownedSet = new Set<number>();
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.id) ownedSet.add(item.id);
      });
    });
    return Array.from(ownedSet);
  } catch (error) {
    console.error("Failed to fetch owned formations", error);
    return [];
  }
}

export async function getFormationProgress(
  userId: string,
  formationId: number,
): Promise<FormationProgress | null> {
  try {
    await connectToDatabase();
    const progress = await FormationProgressModel.findOne({
      userId,
      formationId,
    });
    return progress ? (progress.toObject() as FormationProgress) : null;
  } catch (error) {
    console.error("Failed to fetch formation progress", error);
    return null;
  }
}

export async function updateFormationProgress(
  userId: string,
  formationId: number,
  completedLessons: string[],
): Promise<FormationProgress | null> {
  try {
    await connectToDatabase();
    const progress = await FormationProgressModel.findOneAndUpdate(
      { userId, formationId },
      {
        completedLessons,
        lastAccessedAt: new Date(),
      },
      { upsert: true, new: true },
    );
    return progress.toObject() as FormationProgress;
  } catch (error) {
    console.error("Failed to update formation progress", error);
    return null;
  }
}

export { mongoose };
