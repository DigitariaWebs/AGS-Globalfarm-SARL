"use client";

import { useState } from "react";
import Image from "next/image";
import type { Formation, FormationSession, Section, Lesson } from "@/types";

interface MesFormationsClientProps {
  onlineCourses: Formation[];
  previousFormations: { formation: Formation; session: FormationSession }[];
  upcomingFormations: { formation: Formation; session: FormationSession }[];
}

export default function MesFormationsClient({
  onlineCourses,
  previousFormations,
  upcomingFormations,
}: MesFormationsClientProps) {
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Mes Formations</h1>

      {/* Online Courses Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Cours en Ligne</h2>
        {onlineCourses.length === 0 ? (
          <p className="text-gray-600">
            Vous n&apos;avez pas encore acheté de cours en ligne.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {onlineCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-start space-x-4">
                  <Image
                    src={course.image}
                    alt={course.title}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {course.type === "online"
                          ? course.duration || "Illimité"
                          : `${course.durationDays} jours`}
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        {course.level}
                      </span>
                    </div>
                    <a
                      href={`/mes-formations/${course._id}`}
                      className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors inline-block text-center"
                    >
                      Accéder au cours
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Presential Formations */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">
          Formations Présentielles à Venir
        </h2>
        {upcomingFormations.length === 0 ? (
          <p className="text-gray-600">Aucune formation présentiale à venir.</p>
        ) : (
          <div className="space-y-6">
            {upcomingFormations.map(({ formation, session }) => (
              <div
                key={`${formation._id}-${session.id}`}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => {
                  setSelectedFormation(formation);
                  setIsModalOpen(true);
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{formation.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {formation.description}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      session.status === "open"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {session.status === "open"
                      ? "Inscriptions ouvertes"
                      : "En cours"}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Date de début
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(session.startDate).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Date de fin
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(session.endDate).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Lieu</p>
                    <p className="text-sm text-gray-600">{session.location}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Places restantes: {session.availableSpots}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Previous Presential Formations */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">
          Historique des Formations Présentielles
        </h2>
        {previousFormations.length === 0 ? (
          <p className="text-gray-600">
            Aucune formation présentiale terminée.
          </p>
        ) : (
          <div className="space-y-6">
            {previousFormations.map(({ formation, session }) => (
              <div
                key={`${formation._id}-${session.id}`}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => {
                  setSelectedFormation(formation);
                  setIsModalOpen(true);
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{formation.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {formation.description}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded text-sm bg-gray-100 text-gray-800">
                    Terminée
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Date de début
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(session.startDate).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Date de fin
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(session.endDate).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Lieu</p>
                    <p className="text-sm text-gray-600">{session.location}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">Formation complétée</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Simple Modal for Formation Details */}
      {isModalOpen && selectedFormation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {selectedFormation.title}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {selectedFormation.description}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Durée</p>
                    <p>
                      {selectedFormation.type === "presentiel"
                        ? `${selectedFormation.durationDays} jours`
                        : selectedFormation.duration || "Illimité"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Niveau</p>
                    <p>{selectedFormation.level}</p>
                  </div>
                  <div>
                    <p className="font-medium">Participants</p>
                    <p>
                      {selectedFormation.type === "presentiel"
                        ? selectedFormation.sessions?.[0]?.participants
                            ?.length || 0
                        : "Illimité"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Prix</p>
                    <p>
                      {selectedFormation.price.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "XAF",
                      })}
                    </p>
                  </div>
                </div>
                {selectedFormation.type === "presentiel" &&
                  selectedFormation.address && (
                    <div>
                      <p className="font-medium">Adresse</p>
                      <p>{selectedFormation.address}</p>
                    </div>
                  )}
                {selectedFormation.type === "online" &&
                  selectedFormation.sections &&
                  selectedFormation.sections.length > 0 && (
                    <div>
                      <p className="font-medium mb-2">Programme</p>
                      <div className="space-y-2">
                        {selectedFormation.sections.map((section: Section) => (
                          <div key={section.id} className="border rounded p-3">
                            <h4 className="font-medium">{section.title}</h4>
                            <ul className="mt-2 space-y-1">
                              {section.lessons.map((lesson: Lesson) => (
                                <li key={lesson.id} className="text-sm">
                                  • {lesson.title}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
