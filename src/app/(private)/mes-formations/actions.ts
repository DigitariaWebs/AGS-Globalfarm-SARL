"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  getFormationProgress,
  updateFormationProgress,
  getFormations,
  getUserOrders,
} from "@/lib/db";

export async function getProgress(formationId: number) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const progress = await getFormationProgress(session.user.id, formationId);
    return {
      success: true,
      data: progress ? progress.completedLessons : [],
    };
  } catch (error) {
    console.error("Failed to get progress", error);
    return { success: false, error: "Failed to get progress" };
  }
}

export async function updateProgress(
  formationId: number,
  completedLessons: string[],
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify user owns the formation
    const formations = await getFormations();
    const formation = formations.find((f) => f.id === formationId);

    if (!formation) {
      return { success: false, error: "Formation not found" };
    }

    const orders = await getUserOrders(session.user.id);
    const ownsFormation = orders.some((order) =>
      order.items.some((item) => "title" in item && item.id === formation.id),
    );

    if (!ownsFormation) {
      return { success: false, error: "You don't own this formation" };
    }

    const progress = await updateFormationProgress(
      session.user.id,
      formationId,
      completedLessons,
    );

    if (!progress) {
      return { success: false, error: "Failed to update progress" };
    }

    return {
      success: true,
      data: progress.completedLessons,
    };
  } catch (error) {
    console.error("Failed to update progress", error);
    return { success: false, error: "Failed to update progress" };
  }
}
