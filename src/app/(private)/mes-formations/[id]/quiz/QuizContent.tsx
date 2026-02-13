"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  CheckCircle,
  XCircle,
  Award,
  RotateCcw,
  Mail,
  Loader2,
} from "lucide-react";
import { submitQuiz, resendCertificate } from "../../actions";
import type { QuizSection } from "@/types";

interface QuizContentProps {
  formationId: string;
  sections: QuizSection[];
  userEmail: string;
  alreadyPassed: boolean;
  previousScore?: { score: number; total: number };
  remainingAttempts: number;
  attemptsToday: number;
}

export default function QuizContent({
  formationId,
  sections,
  userEmail,
  alreadyPassed,
  previousScore,
  remainingAttempts,
}: QuizContentProps) {
  // Flatten all questions from sections for state management
  const allQuestions = sections.flatMap((section) =>
    section.questions.map((q) => ({ ...q, sectionId: section.id })),
  );
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    total: number;
    passed: boolean;
    certificateSent: boolean;
    answers: {
      sectionId: number;
      questionId: number;
      correct: boolean;
    }[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const passingThreshold = 0.7;

  const handleSelectAnswer = (questionId: number, answerId: string) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const allAnswered = allQuestions.every(
    (q) => selectedAnswers[q.id] !== undefined,
  );

  const handleSubmit = () => {
    if (!allAnswered) return;

    startTransition(async () => {
      setError(null);
      const answers = allQuestions.map((q) => ({
        questionId: q.id,
        selectedAnswer: selectedAnswers[q.id],
      }));

      const res = await submitQuiz(formationId, answers);

      if (res.success && res.data) {
        setResult(res.data);
        setSubmitted(true);
      } else {
        setError(res.error || "Erreur lors de la soumission du quiz.");
      }
    });
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setResult(null);
    setError(null);
  };

  const handleResendCertificate = async () => {
    setIsResending(true);
    setResendSuccess(false);
    setError(null);
    try {
      const res = await resendCertificate(formationId);
      if (!res.success) {
        throw new Error(res.error || "Erreur lors de l'envoi");
      }
      setResendSuccess(true);
    } catch {
      setError("Erreur lors de l'envoi du certificat.");
    } finally {
      setIsResending(false);
    }
  };

  // Already passed view
  if (alreadyPassed && !submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200 text-center">
          <Award className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Vous avez déjà réussi ce quiz !
          </h2>
          {previousScore && (
            <p className="text-gray-600 mb-4">
              Score: {previousScore.score}/{previousScore.total} (
              {Math.round((previousScore.score / previousScore.total) * 100)}%)
            </p>
          )}
          <p className="text-gray-600 mb-6">
            Votre certificat vous a été envoyé par email à{" "}
            <strong>{userEmail}</strong>.
          </p>
          {resendSuccess && (
            <p className="text-green-700 mb-4">
              ✅ Le certificat a été renvoyé avec succès !
            </p>
          )}
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <button
            onClick={handleResendCertificate}
            disabled={isResending}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
          >
            {isResending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Mail className="w-5 h-5" />
            )}
            {isResending
              ? "Envoi en cours..."
              : "Renvoyer le certificat par email"}
          </button>
        </div>
      </div>
    );
  }

  // Result view after submission
  if (submitted && result) {
    const percentage = Math.round((result.score / result.total) * 100);

    return (
      <div className="max-w-2xl mx-auto">
        <div
          className={`rounded-xl p-8 border text-center ${
            result.passed
              ? "bg-linear-to-r from-green-50 to-emerald-50 border-green-200"
              : "bg-linear-to-r from-red-50 to-orange-50 border-red-200"
          }`}
        >
          {result.passed ? (
            <>
              <Award className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Félicitations ! 🎉
              </h2>
              <p className="text-gray-600 mb-2">
                Vous avez réussi le quiz avec un score de{" "}
                <strong>
                  {result.score}/{result.total}
                </strong>{" "}
                ({percentage}%).
              </p>
              {result.certificateSent ? (
                <p className="text-green-700 mb-6">
                  ✅ Votre certificat a été envoyé à{" "}
                  <strong>{userEmail}</strong>
                </p>
              ) : (
                <>
                  <p className="text-orange-600 mb-4">
                    L&apos;envoi du certificat a échoué.
                  </p>
                  <button
                    onClick={handleResendCertificate}
                    disabled={isResending}
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {isResending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Mail className="w-5 h-5" />
                    )}
                    {isResending
                      ? "Envoi en cours..."
                      : "Renvoyer le certificat par email"}
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Quiz non réussi
              </h2>
              <p className="text-gray-600 mb-2">
                Votre score: {result.score}/{result.total} ({percentage}%).
              </p>
              <p className="text-gray-600 mb-6">
                Vous devez obtenir au moins {Math.round(passingThreshold * 100)}
                % pour recevoir le certificat. Révisez le contenu et réessayez.
              </p>
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors font-medium"
              >
                <RotateCcw className="w-5 h-5" />
                Réessayer
              </button>
            </>
          )}
        </div>

        {/* Show answers review */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Revue des réponses
          </h3>
          {sections.map((section) => (
            <div key={section.id} className="space-y-4">
              <h4 className="text-md font-semibold text-gray-800 mt-6">
                {section.title}
              </h4>
              {section.questions.map((question) => {
                const answerFeedback = result.answers.find(
                  (a) => a.questionId === question.id,
                );
                const selected = selectedAnswers[question.id];
                const isCorrect = answerFeedback?.correct || false;

                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg border ${
                      isCorrect
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {question.question}
                        </p>
                        {question.image && (
                          <div className="mt-2 relative w-full max-w-md">
                            <Image
                              src={question.image}
                              alt="Question illustration"
                              width={500}
                              height={400}
                              className="w-full h-auto rounded-lg border border-gray-200"
                            />
                          </div>
                        )}
                        <div className="mt-2 space-y-1">
                          {question.options.map((option) => {
                            const optionId =
                              typeof option === "string" ? option : option.id;
                            const optionText =
                              typeof option === "string" ? option : option.text;
                            const isSelectedOption = optionId === selected;

                            return (
                              <p
                                key={optionId}
                                className={`text-sm ${
                                  isSelectedOption && isCorrect
                                    ? "text-green-700 font-semibold"
                                    : isSelectedOption && !isCorrect
                                      ? "text-red-600"
                                      : "text-gray-500"
                                }`}
                              >
                                {isSelectedOption && isCorrect && "✓ "}
                                {isSelectedOption && !isCorrect && "✗ "}
                                {optionText}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Quiz form view
  return (
    <div className="max-w-2xl mx-auto">
      {/* Attempts Counter */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 font-medium">
          Tentatives restantes aujourd&apos;hui: {remainingAttempts}/3
        </p>
        {remainingAttempts === 0 && (
          <p className="text-blue-600 text-sm mt-1">
            Vous avez utilisé toutes vos tentatives. Revenez demain.
          </p>
        )}
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-8">
        {sections.map((section, sectionIndex) => {
          const sectionQuestionStart = sections
            .slice(0, sectionIndex)
            .reduce((sum, s) => sum + s.questions.length, 0);

          return (
            <div key={section.id} className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-600">
                <h3 className="text-lg font-bold text-gray-900">
                  {section.title}
                </h3>
              </div>

              {section.questions.map((question, qIndex) => {
                const globalIndex = sectionQuestionStart + qIndex;

                return (
                  <div
                    key={question.id}
                    className="bg-white rounded-lg shadow-sm border p-6"
                  >
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      {globalIndex + 1}. {question.question}
                      {question.points && (
                        <span className="ml-2 text-sm text-gray-500 font-normal">
                          ({question.points} point
                          {question.points > 1 ? "s" : ""})
                        </span>
                      )}
                    </h4>
                    {question.image && (
                      <div className="mb-4 relative w-full max-w-2xl">
                        <Image
                          src={question.image}
                          alt="Question illustration"
                          width={800}
                          height={600}
                          className="w-full h-auto rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                    <div className="space-y-3">
                      {question.options.map((option) => {
                        const optionId =
                          typeof option === "string" ? option : option.id;
                        const optionText =
                          typeof option === "string" ? option : option.text;
                        const isSelected =
                          selectedAnswers[question.id] === optionId;

                        return (
                          <button
                            key={optionId}
                            onClick={() =>
                              handleSelectAnswer(question.id, optionId)
                            }
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                              isSelected
                                ? "border-green-600 bg-green-50 text-green-900"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                  isSelected
                                    ? "border-green-600 bg-green-600"
                                    : "border-gray-300"
                                }`}
                              >
                                {isSelected && (
                                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                                )}
                              </div>
                              <span className="text-gray-800">
                                {optionText}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Progress and Submit */}
      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {Object.keys(selectedAnswers).length}/{allQuestions.length} questions
          répondues
        </p>
        <button
          onClick={handleSubmit}
          disabled={!allAnswered || isPending || remainingAttempts === 0}
          className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Vérification...
            </>
          ) : (
            "Soumettre le quiz"
          )}
        </button>
      </div>
    </div>
  );
}
