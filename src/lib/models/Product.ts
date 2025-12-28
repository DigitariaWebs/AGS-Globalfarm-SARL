import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  id: number;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  description: string;
  stock: number;
  organic: boolean;
  rating: number;
  reviews: number;
  isNewProduct?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    stock: { type: Number, required: true },
    organic: { type: Boolean, required: true },
    rating: { type: Number, required: true },
    reviews: { type: Number, required: true },
    isNewProduct: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

// Prevent re-compilation of model in development
const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
