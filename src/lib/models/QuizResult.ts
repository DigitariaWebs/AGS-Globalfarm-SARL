import mongoose, { Schema, Document } from "mongoose";

export interface IQuizResult extends Document {
  userId: string;
  formationId: number;
  score: number;
  totalQuestions: number;
  passed: boolean;
  certificateSent: boolean;
  answers: { questionId: number; selectedAnswer: number; correct: boolean }[];
  completedAt: Date;
}

const QuizResultSchema = new Schema<IQuizResult>(
  {
    userId: { type: String, required: true },
    formationId: { type: Number, required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    certificateSent: { type: Boolean, default: false },
    answers: [
      {
        questionId: { type: Number, required: true },
        selectedAnswer: { type: Number, required: true },
        correct: { type: Boolean, required: true },
      },
    ],
    completedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

QuizResultSchema.index({ userId: 1, formationId: 1 });

const QuizResult =
  mongoose.models.QuizResult ||
  mongoose.model<IQuizResult>("QuizResult", QuizResultSchema);

export default QuizResult;
