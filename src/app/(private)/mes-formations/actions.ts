"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  getFormationProgress,
  updateFormationProgress,
  getFormations,
  getUserOrders,
  saveQuizResult,
  getQuizResult,
  markCertificateSent,
} from "@/lib/db";
import { generateCertificatePdf } from "@/lib/certificate";
import { sendEmail } from "@/lib/email";
import CertificateEmail from "@/emails/CertificateEmail";

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

// Placeholder quiz questions - keep in sync with quiz/page.tsx
// Replace with DB-driven questions per formation when content is ready
const QUIZ_ANSWERS: Record<number, number[]> = {
  // formationId -> array of correct answer indices per question
};

const PLACEHOLDER_CORRECT_ANSWERS = [0]; // matches PLACEHOLDER_QUESTIONS in quiz/page.tsx

const PASSING_THRESHOLD = 0.7;

export async function submitQuiz(
  formationId: number,
  answers: { questionId: number; selectedAnswer: number }[],
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }

    // Verify user owns the formation
    const formations = await getFormations();
    const formation = formations.find((f) => f.id === formationId);
    if (!formation) {
      return { success: false, error: "Formation introuvable" };
    }

    const orders = await getUserOrders(session.user.id);
    const ownsFormation = orders.some((order) =>
      order.items.some((item) => "title" in item && item.id === formation.id),
    );
    if (!ownsFormation) {
      return { success: false, error: "Vous ne possédez pas cette formation" };
    }

    // Verify all lessons are completed
    const progress = await getFormationProgress(session.user.id, formation.id);
    const completedLessons = progress ? progress.completedLessons : [];
    const totalLessons =
      formation.sections?.reduce(
        (acc, section) => acc + section.lessons.length,
        0,
      ) || 0;

    if (completedLessons.length < totalLessons) {
      return {
        success: false,
        error: "Vous devez terminer toutes les leçons avant de passer le quiz",
      };
    }

    // Grade the quiz
    const correctAnswers =
      QUIZ_ANSWERS[formationId] || PLACEHOLDER_CORRECT_ANSWERS;

    const gradedAnswers = answers.map((answer, index) => ({
      questionId: answer.questionId,
      selectedAnswer: answer.selectedAnswer,
      correct: answer.selectedAnswer === (correctAnswers[index] ?? -1),
    }));

    const score = gradedAnswers.filter((a) => a.correct).length;
    const totalQuestions = answers.length;
    const passed = score / totalQuestions >= PASSING_THRESHOLD;

    // Save quiz result
    await saveQuizResult({
      userId: session.user.id,
      formationId,
      score,
      totalQuestions,
      passed,
      answers: gradedAnswers,
    });

    let certificateSent = false;

    // If passed, generate certificate and send email
    if (passed) {
      try {
        const user = session.user as {
          firstName?: string;
          lastName?: string;
          email: string;
        };
        const userName =
          `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email;

        const pdfBytes = await generateCertificatePdf({
          userName,
          formationTitle: formation.title,
          completionDate: new Date(),
        });

        await sendEmail({
          to: user.email,
          subject: `Votre certificat - ${formation.title}`,
          template: CertificateEmail({
            userName,
            formationTitle: formation.title,
            quizScore: score,
            totalQuestions,
          }),
          attachments: [
            {
              filename: `certificat-${formation.title.replace(/\s+/g, "-").toLowerCase()}.pdf`,
              content: pdfBytes,
              contentType: "application/pdf",
            },
          ],
        });

        await markCertificateSent(session.user.id, formationId);
        certificateSent = true;
      } catch (emailError) {
        console.error("Failed to send certificate email:", emailError);
        // Don't fail the whole submission if email fails
      }
    }

    return {
      success: true,
      data: {
        score,
        total: totalQuestions,
        passed,
        certificateSent,
      },
    };
  } catch (error) {
    console.error("Failed to submit quiz", error);
    return { success: false, error: "Erreur lors de la soumission du quiz" };
  }
}

export async function resendCertificate(formationId: number) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }

    const formations = await getFormations();
    const formation = formations.find((f) => f.id === formationId);
    if (!formation) {
      return { success: false, error: "Formation introuvable" };
    }

    const orders = await getUserOrders(session.user.id);
    const ownsFormation = orders.some((order) =>
      order.items.some((item) => "title" in item && item.id === formation.id),
    );
    if (!ownsFormation) {
      return { success: false, error: "Vous ne possédez pas cette formation" };
    }

    const quizResult = await getQuizResult(session.user.id, formationId);
    if (!quizResult?.passed) {
      return {
        success: false,
        error: "Vous devez réussir le quiz pour obtenir le certificat",
      };
    }

    const user = session.user as {
      firstName?: string;
      lastName?: string;
      email: string;
    };
    const userName =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email;

    const pdfBytes = await generateCertificatePdf({
      userName,
      formationTitle: formation.title,
      completionDate: quizResult.completedAt
        ? new Date(quizResult.completedAt)
        : new Date(),
    });

    await sendEmail({
      to: user.email,
      subject: `Votre certificat - ${formation.title}`,
      template: CertificateEmail({
        userName,
        formationTitle: formation.title,
        quizScore: quizResult.score,
        totalQuestions: quizResult.totalQuestions,
      }),
      attachments: [
        {
          filename: `certificat-${formation.title.replace(/\s+/g, "-").toLowerCase()}.pdf`,
          content: pdfBytes,
          contentType: "application/pdf",
        },
      ],
    });

    return { success: true };
  } catch (error) {
    console.error("Certificate resend error:", error);
    return {
      success: false,
      error: "Erreur lors de l'envoi du certificat",
    };
  }
}
