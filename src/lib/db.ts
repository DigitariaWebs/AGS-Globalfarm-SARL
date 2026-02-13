import mongoose from "mongoose";
import type {
  Product,
  Order,
  FormationProgress,
  QuizResult,
  OnlineFormation,
  PresentialFormation,
  FormationSession,
} from "@/types";
import OnlineFormationModel from "./models/OnlineFormation";
import PresentialFormationModel from "./models/PresentialFormation";
import ProductModel, { IProduct } from "./models/Product";
import OrderModel, { IOrder } from "./models/Order";
import FormationProgressModel from "./models/FormationProgress";
import QuizResultModel from "./models/QuizResult";

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

export async function getOnlineFormations(
  userId?: string,
): Promise<OnlineFormation[]> {
  try {
    await connectToDatabase();

    // Fetch online formations with sections field to calculate stats
    const onlineFormations = await OnlineFormationModel.find({}).lean();

    // If user is logged in, check ownership
    if (userId) {
      return onlineFormations.map((formation: OnlineFormation) => {
        const { owners, sections, ...rest } = formation;
        const totalSections = sections?.length || 0;
        const totalLessons =
          sections?.reduce(
            (sum, section) => sum + (section.lessons?.length || 0),
            0,
          ) || 0;

        return {
          ...rest,
          owned: owners?.includes(userId) || false,
          stats: {
            totalSections,
            totalLessons,
          },
        };
      });
    }

    // If not logged in, just remove sensitive fields but include stats
    return onlineFormations.map((formation: OnlineFormation) => {
      const { sections, ...rest } = formation;
      const totalSections = sections?.length || 0;
      const totalLessons =
        sections?.reduce(
          (sum: number, section) => sum + (section.lessons?.length || 0),
          0,
        ) || 0;

      return {
        ...rest,
        stats: {
          totalSections,
          totalLessons,
        },
      };
    }) as OnlineFormation[];
  } catch (error) {
    console.error("Failed to fetch online formations", error);
    return [];
  }
}

export async function getPresentialFormations(
  userId?: string,
): Promise<PresentialFormation[]> {
  try {
    await connectToDatabase();

    // Fetch presential formations and transform sessions
    const presentialFormations = (await PresentialFormationModel.find(
      {},
    ).lean()) as PresentialFormation[];

    // Transform presential formations to remove participants and add reservedSpots and owned
    const transformedPresential = presentialFormations.map((formation) => {
      const { sessions, ...rest } = formation;

      // Check if user is enrolled in any session
      const isEnrolledInAnySession = userId
        ? sessions?.some((session) => session.participants?.includes(userId)) ||
          false
        : false;

      const transformedSessions = sessions?.map((session) => {
        const { participants, ...sessionRest } = session;
        return {
          ...sessionRest,
          reservedSpots: participants?.length || 0,
          owned: userId ? participants?.includes(userId) || false : false,
        };
      });

      return {
        ...rest,
        owned: isEnrolledInAnySession,
        sessions: transformedSessions,
      };
    });

    return transformedPresential as PresentialFormation[];
  } catch (error) {
    console.error("Failed to fetch presential formations", error);
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

export async function getOwnedFormations(userId: string): Promise<{
  presential: PresentialFormation[];
  online: OnlineFormation[];
}> {
  try {
    await connectToDatabase();

    // Get presential formations where user is in session participants
    const presentialFormations = await PresentialFormationModel.find({
      "sessions.participants": userId,
    }).lean();

    // Get online formations where user is in owners
    const onlineFormations = await OnlineFormationModel.find({
      owners: userId,
    }).lean();

    // Transform presential formations to remove participants and add reservedSpots
    const transformedPresential = presentialFormations.map((formation) => {
      const { sessions, ...rest } = formation;
      return {
        ...rest,
        sessions: sessions?.map((session: FormationSession) => {
          const { participants, ...sessionRest } = session;
          return {
            ...sessionRest,
            owned: participants?.includes(userId) || false,
          };
        }),
      };
    }) as PresentialFormation[];

    // Transform online formations to add stats and owned flag
    const transformedOnline = onlineFormations.map((formation) => {
      const { owners, ...rest } = formation;

      return {
        ...rest,
      };
    }) as OnlineFormation[];

    return {
      presential: transformedPresential,
      online: transformedOnline,
    };
  } catch (error) {
    console.error("Failed to fetch owned formations", error);
    return {
      presential: [],
      online: [],
    };
  }
}

export async function getFormationProgress(
  userId: string,
  formationId: string,
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
  formationId: string,
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

export async function getQuizResult(
  userId: string,
  formationId: string,
): Promise<QuizResult | null> {
  try {
    await connectToDatabase();
    const result = await QuizResultModel.findOne({
      userId,
      formationId,
      passed: true,
    }).sort({ completedAt: -1 });
    return result ? (result.toObject() as QuizResult) : null;
  } catch (error) {
    console.error("Failed to fetch quiz result", error);
    return null;
  }
}

export async function saveQuizResult(data: {
  userId: string;
  formationId: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  answers: { questionId: number; selectedAnswer: number; correct: boolean }[];
}): Promise<QuizResult | null> {
  try {
    await connectToDatabase();
    const result = await QuizResultModel.create({
      ...data,
      completedAt: new Date(),
    });
    return result.toObject() as QuizResult;
  } catch (error) {
    console.error("Failed to save quiz result", error);
    return null;
  }
}

export async function markCertificateSent(
  userId: string,
  formationId: string,
): Promise<boolean> {
  try {
    await connectToDatabase();
    await QuizResultModel.updateOne(
      { userId, formationId, passed: true },
      { $set: { certificateSent: true } },
    );
    return true;
  } catch (error) {
    console.error("Failed to mark certificate sent", error);
    return false;
  }
}

export { mongoose };
