"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  getFormationProgress,
  updateFormationProgress,
  getOwnedFormations,
  saveQuizResult,
  getQuizResult,
  markCertificateSent,
  getQuizAttemptsToday,
} from "@/lib/db";
import { generateCertificatePdf } from "@/lib/certificate";
import { sendEmail } from "@/lib/email";
import CertificateEmail from "@/emails/CertificateEmail";
import OnlineFormationModel from "@/lib/models/OnlineFormation";
import { connectToDatabase } from "@/lib/db";
import type { QuizSection, QuizQuestion } from "@/types";

export async function getProgress(formationId: string) {
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
  formationId: string,
  completedLessons: string[],
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify user owns the formation
    const { online: ownedOnlineFormations } = await getOwnedFormations(
      session.user.id,
    );
    const ownsFormation = ownedOnlineFormations.some(
      (f) => f._id?.valueOf() === formationId,
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

const PASSING_THRESHOLD = 0.7;
const MAX_DAILY_ATTEMPTS = 3;

export async function submitQuiz(
  formationId: string,
  answers: { questionId: number; selectedAnswer: string }[],
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }

    // Verify user owns the formation
    const { online: ownedOnlineFormations } = await getOwnedFormations(
      session.user.id,
    );
    const formation = ownedOnlineFormations.find(
      (f) => f._id?.valueOf() === formationId,
    );
    if (!formation) {
      return { success: false, error: "Formation introuvable" };
    }

    // Check if user has already passed
    const existingPassedResult = await getQuizResult(
      session.user.id,
      formationId,
    );
    if (existingPassedResult?.passed) {
      return {
        success: false,
        error: "Vous avez déjà réussi ce quiz",
      };
    }

    // Check daily attempt limit
    const attemptsToday = await getQuizAttemptsToday(
      session.user.id,
      formationId,
    );
    if (attemptsToday >= MAX_DAILY_ATTEMPTS) {
      return {
        success: false,
        error: `Vous avez atteint la limite de ${MAX_DAILY_ATTEMPTS} tentatives par jour. Réessayez demain.`,
      };
    }

    // Verify all lessons are completed
    const progress = await getFormationProgress(session.user.id, formationId);
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

    // Fetch the actual quiz with correct answers
    await connectToDatabase();
    const formationWithQuiz = await OnlineFormationModel.findById(formationId)
      .select("quiz")
      .lean();

    if (!formationWithQuiz?.quiz?.sections) {
      return { success: false, error: "Quiz introuvable" };
    }

    // Build a map of questionId -> {correctAnswer, sectionId}
    const correctAnswersMap = new Map<
      number,
      { correctAnswer: string; sectionId: number }
    >();
    formationWithQuiz.quiz.sections.forEach((section: QuizSection) => {
      section.questions.forEach((question: QuizQuestion) => {
        correctAnswersMap.set(question.id, {
          correctAnswer: question.correctAnswer,
          sectionId: section.id,
        });
      });
    });

    // Grade the quiz
    const gradedAnswers = answers.map((answer) => {
      const questionData = correctAnswersMap.get(answer.questionId);
      return {
        sectionId: questionData?.sectionId || 0,
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        correct: answer.selectedAnswer === questionData?.correctAnswer,
      };
    });

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
      attemptDate: new Date(),
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

    // Build detailed feedback without revealing correct answers
    const detailedAnswers = gradedAnswers.map((answer) => ({
      sectionId: answer.sectionId,
      questionId: answer.questionId,
      correct: answer.correct,
    }));

    return {
      success: true,
      data: {
        score,
        total: totalQuestions,
        passed,
        certificateSent,
        answers: detailedAnswers,
      },
    };
  } catch (error) {
    console.error("Failed to submit quiz", error);
    return { success: false, error: "Erreur lors de la soumission du quiz" };
  }
}

export async function resendCertificate(formationId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }

    const { online: ownedOnlineFormations } = await getOwnedFormations(
      session.user.id,
    );
    const formation = ownedOnlineFormations.find(
      (f) => f._id?.valueOf() === formationId,
    );
    if (!formation) {
      return { success: false, error: "Formation introuvable" };
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
