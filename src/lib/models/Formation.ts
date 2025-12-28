import mongoose, { Schema, Document } from "mongoose";

export interface IFormation extends Document {
  id: number;
  title: string;
  description: string;
  image: string;
  duration: string;
  level: string;
  participants: string;
  price: number;
  category: string;
  sections: {
    id: number;
    title: string;
    description?: string;
    lessons: {
      id: number;
      title: string;
      content?: string;
      duration?: string;
    }[];
  }[];
  icon: string; // Icon name
}

const LessonSchema = new Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    content: String,
    duration: String,
  },
  { _id: false },
);

const SectionSchema = new Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    description: String,
    lessons: [LessonSchema],
  },
  { _id: false },
);

const FormationSchema = new Schema<IFormation>(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    duration: { type: String, required: true },
    level: { type: String, required: true },
    participants: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    sections: [SectionSchema],
    icon: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

// Prevent re-compilation of model in development
const Formation =
  mongoose.models.Formation ||
  mongoose.model<IFormation>("Formation", FormationSchema);

export default Formation;
