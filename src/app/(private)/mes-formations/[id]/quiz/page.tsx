import { auth } from "@/lib/auth";
import {
  getUserOrders,
  getFormations,
  getFormationProgress,
  getQuizResult,
} from "@/lib/db";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import BackButton from "../BackButton";
import QuizContent from "./QuizContent";
import type { QuizQuestion } from "@/types";

// Placeholder quiz questions - replace with real content per formation
const PLACEHOLDER_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Question 1 - Le contenu du quiz sera bientôt disponible.",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 0,
  },
];

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id: formationId } = await params;

  // Get formation details
  const formations = await getFormations();
  const formation = formations.find((f) => f._id?.valueOf() === formationId);

  if (!formation || formation.type !== "online") {
    redirect("/mes-formations");
  }

  // Check if user owns this formation
  const orders = await getUserOrders(session.user.id);
  const ownsFormation = orders.some((order) =>
    order.items.some((item) => "title" in item && item.id === formation.id),
  );

  if (!ownsFormation) {
    redirect("/mes-formations");
  }

  // Check if user has completed all lessons
  const progress = await getFormationProgress(session.user.id, formation.id);
  const completedLessons = progress ? progress.completedLessons : [];
  const totalLessons =
    formation.sections?.reduce(
      (acc, section) => acc + section.lessons.length,
      0,
    ) || 0;

  if (completedLessons.length < totalLessons) {
    redirect(`/mes-formations/${formationId}`);
  }

  // Check if user already passed
  const existingResult = await getQuizResult(session.user.id, formation.id);

  const user = session.user as { email: string };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="mb-8">
        <BackButton />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quiz - {formation.title}
        </h1>
        <p className="text-gray-600">
          Répondez aux questions suivantes pour obtenir votre certificat de
          formation. Vous devez obtenir au moins 70% de bonnes réponses.
        </p>
      </div>

      <QuizContent
        formationId={formation.id}
        questions={PLACEHOLDER_QUESTIONS}
        userEmail={user.email}
        alreadyPassed={!!existingResult?.passed}
        previousScore={
          existingResult
            ? {
                score: existingResult.score,
                total: existingResult.totalQuestions,
              }
            : undefined
        }
      />
    </div>
  );
}
