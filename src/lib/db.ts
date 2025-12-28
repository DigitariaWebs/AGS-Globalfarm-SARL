import mongoose from "mongoose";
import type { Formation, Product } from "@/types";
import FormationModel, { IFormation } from "./models/Formation";
import ProductModel, { IProduct } from "./models/Product";

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

export { mongoose };
