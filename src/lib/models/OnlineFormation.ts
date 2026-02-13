import mongoose, { Schema, Document } from "mongoose";

export interface IOnlineFormation extends Document {
  title: string;
  description: string;
  image: string;
  duration?: string;
  level: string;
  price: number;
  category: string;
  type: "online";
  sections: {
    id: number;
    title: string;
    lessons: {
      id: number;
      title: string;
      content?: string;
    }[];
  }[];
  icon: string;
  owners?: string[];
}

const LessonSchema = new Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    content: String,
  },
  { _id: false },
);

const SectionSchema = new Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    lessons: [LessonSchema],
  },
  { _id: false },
);

const OnlineFormationSchema = new Schema<IOnlineFormation>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    duration: { type: String, required: false },
    level: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true, default: "online", enum: ["online"] },
    sections: { type: [SectionSchema], required: true },
    icon: { type: String, required: true },
    owners: { type: [String], required: false },
  },
  {
    timestamps: true,
  },
);

const OnlineFormation =
  mongoose.models.OnlineFormation ||
  mongoose.model<IOnlineFormation>("OnlineFormation", OnlineFormationSchema);

export default OnlineFormation;
