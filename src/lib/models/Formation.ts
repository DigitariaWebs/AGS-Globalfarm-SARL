import mongoose, { Schema, Document } from "mongoose";

export interface IFormation extends Document {
  id: number;
  title: string;
  description: string;
  image: string;
  durationDays: number;
  level: string;
  participants: string;
  price: number;
  category: string;
  type: "online" | "presentiel";
  sections?: {
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
  program?: {
    name: string;
    timeFrames: {
      from: string;
      to: string;
      name: string;
      description?: string;
    }[];
  }[];
  sessions?: {
    id: number;
    startDate: Date;
    endDate: Date;
    location: string;
    availableSpots: number;
    status: "open" | "ongoing" | "done";
  }[];
  address?: string;
  contactPhone?: string;
  contactEmail?: string;
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

const TimeFrameSchema = new Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
  },
  { _id: false },
);

const DaySchema = new Schema(
  {
    name: { type: String, required: true },
    timeFrames: [TimeFrameSchema],
  },
  { _id: false },
);

const SessionSchema = new Schema(
  {
    id: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: { type: String, required: true },
    availableSpots: { type: Number, required: true },
    status: { type: String, required: true, enum: ["open", "ongoing", "done"] },
  },
  { _id: false },
);

const FormationSchema = new Schema<IFormation>(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    durationDays: { type: Number, required: true },
    level: { type: String, required: true },
    participants: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true, enum: ["online", "presentiel"] },
    sections: [SectionSchema],
    program: [DaySchema],
    sessions: [SessionSchema],
    address: String,
    contactPhone: String,
    contactEmail: String,
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
