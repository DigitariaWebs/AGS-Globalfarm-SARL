"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Play, CheckCircle } from "lucide-react";
import type { Formation } from "@/types";

interface FormationContentProps {
  formation: Formation;
}

export default function FormationContent({ formation }: FormationContentProps) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    new Set(),
  );
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    const savedProgress = localStorage.getItem(
      `formation-${formation._id}-progress`,
    );
    if (savedProgress) {
      setCompletedLessons(new Set(JSON.parse(savedProgress)));
    }
  }, [formation._id]);

  const toggleSection = (sectionId: number) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const markLessonComplete = (lessonId: string) => {
    setCompletedLessons((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }

      // Save to localStorage
      localStorage.setItem(
        `formation-${formation._id}-progress`,
        JSON.stringify([...newSet]),
      );
      return newSet;
    });
  };

  const totalLessons =
    formation.sections?.reduce(
      (acc, section) => acc + section.lessons.length,
      0,
    ) || 0;
  const completedCount = completedLessons.size;
  const progressPercentage =
    totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  return (
    <>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progression: {completedCount}/{totalLessons} leçons
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {formation.sections?.map((section) => (
          <div
            key={section.id}
            className="bg-white rounded-lg shadow-sm border"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {section.title}
                </h3>
                {section.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {section.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {section.lessons.length} leçons
                </span>
                {expandedSections.has(section.id) ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>

            {expandedSections.has(section.id) && (
              <div className="px-6 pb-4">
                <div className="space-y-3">
                  {section.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            markLessonComplete(`${section.id}-${lesson.id}`)
                          }
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            completedLessons.has(`${section.id}-${lesson.id}`)
                              ? "bg-green-600 border-green-600"
                              : "border-gray-300"
                          }`}
                        >
                          {completedLessons.has(
                            `${section.id}-${lesson.id}`,
                          ) && <CheckCircle className="w-4 h-4 text-white" />}
                        </button>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {lesson.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {lesson.duration}
                          </p>
                        </div>
                      </div>
                      <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        <Play className="w-4 h-4" />
                        Regarder
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Certificate Section */}
      {progressPercentage === 100 && (
        <div className="mt-8 bg-linear-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Félicitations !
            </h3>
            <p className="text-gray-600 mb-4">
              Vous avez terminé cette formation avec succès.
            </p>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
              Télécharger le certificat
            </button>
          </div>
        </div>
      )}
    </>
  );
}
