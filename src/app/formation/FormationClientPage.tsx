"use client";

import { useState, useLayoutEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Users,
  Clock,
  Award,
  BookOpen,
  Target,
  Phone,
  ArrowRight,
  Leaf,
  X,
  MapPin,
  Calendar,
  Play,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import type { Formation } from "@/types";

const iconMap = {
  GraduationCap,
  Users,
  Clock,
  Award,
  BookOpen,
  Target,
  Phone,
  ArrowRight,
  Leaf,
  X,
  MapPin,
  Calendar,
  Play,
  CheckCircle,
};

type Benefit = {
  icon: string;
  title: string;
  description: string;
};

type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

interface FormationClientPageProps {
  trainingPrograms: Formation[];
  categories: string[];
  benefits: Benefit[];
  processSteps: ProcessStep[];
  ownedFormationIds: number[];
}

export default function FormationClientPage({
  trainingPrograms,
  categories,
  benefits,
  processSteps,
  ownedFormationIds,
}: FormationClientPageProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [modalProgram, setModalProgram] = useState<Formation | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(
    null,
  );
  const [isProgramExpanded, setIsProgramExpanded] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#faf9f6");

  // Get the actual background color from the body element
  useLayoutEffect(() => {
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBackgroundColor(bodyBg);
  }, []);

  const handleEnroll = (program: Formation) => {
    // Check if user already owns this formation
    if (ownedFormationIds.includes(program.id)) {
      alert("Vous avez déjà acheté cette formation.");
      return;
    }
    // Check if there's an open session for presentiel formations
    if (program.type === "presentiel") {
      const openSessions = program.sessions?.filter(
        (session) => session.status === "open",
      );
      if (!openSessions || openSessions.length === 0) {
        alert("Aucune session ouverte pour cette formation.");
        return;
      }
      // If multiple sessions, check if one is selected
      if (openSessions.length > 1 && !selectedSessionId) {
        alert("Veuillez sélectionner une session.");
        return;
      }
    }
    addToCart(program, selectedSessionId || undefined);
  };

  const openModal = (program: Formation) => {
    setModalProgram(program);
    setIsProgramExpanded(false); // Collapse program by default
    // Auto-select first open session if only one available
    if (program.type === "presentiel") {
      const openSessions = program.sessions?.filter((s) => s.status === "open");
      if (openSessions && openSessions.length === 1) {
        setSelectedSessionId(openSessions[0].id);
      } else {
        setSelectedSessionId(null);
      }
    }
  };

  const closeModal = () => {
    setModalProgram(null);
    setSelectedSessionId(null);
    setIsProgramExpanded(false);
  };

  // Filter programs
  const filteredPrograms = trainingPrograms.filter((program: Formation) => {
    if (activeCategory === "Tout") return true;
    if (activeCategory === "Présentiel") return program.type === "presentiel";
    if (activeCategory === "En ligne") return program.type === "online";
    return program.category === activeCategory;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-28 pb-32 overflow-hidden bg-emerald-900">
        <div className="absolute inset-0 opacity-10">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>

        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(var(--color-brand) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span
                className="inline-block py-2 px-4 rounded text-white text-sm font-medium mb-4 border"
                style={{
                  backgroundColor: "var(--color-secondary-brand)",
                  borderColor: "var(--color-secondary-brand)",
                }}
              >
                Investissez dans votre avenir
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Formations Agricoles
              </h1>
              <p className="text-white/90 text-lg mb-10 max-w-3xl mx-auto">
                Développez vos compétences avec nos formations pratiques animées
                par des experts. Des sessions présentielles au cours en ligne,
                trouvez la formation qui vous convient.
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  size="lg"
                  className="text-white text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                  style={{
                    backgroundColor: "var(--color-cta)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--color-cta-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--color-cta)";
                  }}
                  onClick={() => {
                    document
                      .getElementById("programs-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Voir les Formations
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 text-base font-semibold"
                  onClick={() => router.push("/contact")}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Nous Contacter
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Wave Bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-[calc(100%+1.3px)] h-15"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill={backgroundColor}
            ></path>
          </svg>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 relative">
        {/* Gradient overlay at the top to blend */}
        <div
          className="absolute top-0 left-0 right-0 h-32 pointer-events-none -mt-1"
          style={{
            background: `linear-gradient(to bottom, ${backgroundColor}, transparent)`,
          }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi Choisir Nos Formations ?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Des formations de qualité conçues pour répondre aux besoins réels
              des agriculteurs et entrepreneurs agricoles.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent =
                iconMap[benefit.icon as keyof typeof iconMap] || GraduationCap;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all group"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: "var(--color-brand)" }}
                  >
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs-section" className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Programmes de Formation
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Découvrez nos formations complètes adaptées à tous les niveaux, du
              débutant à l&apos;expert.
            </p>
          </motion.div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeCategory === category
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Programs Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredPrograms.map((program) => {
                const IconComponent =
                  iconMap[program.icon as keyof typeof iconMap] || Leaf;
                return (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden group flex flex-col h-full"
                  >
                    {/* Program Image */}
                    <div className="relative h-64 bg-green-50 overflow-hidden shrink-0">
                      <Image
                        src={program.image}
                        alt={program.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div
                        className="absolute top-3 left-3 text-white text-xs font-semibold px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: "var(--color-secondary-brand)",
                        }}
                      >
                        {program.level}
                      </div>
                    </div>

                    {/* Program Info */}
                    <div className="p-5 flex flex-col flex-1">
                      {/* Category and Icon */}
                      <div className="mb-2">
                        <div className="flex items-center gap-2 mb-2">
                          <IconComponent className="w-4 h-4 text-green-600 shrink-0" />
                          <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {program.category}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <div className="mb-2">
                        <h3 className="font-bold text-gray-900 text-lg mb-1.5 line-clamp-2 min-h-12">
                          {program.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2 min-h-10">
                        {program.description}
                      </p>

                      {/* Meta Info */}
                      <div className="grid grid-cols-3 gap-2 mb-3 text-xs text-gray-600">
                        {program.type === "online" ? (
                          <>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-green-600 shrink-0" />
                              <span className="text-xs">
                                {program.durationDays} jours
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4 text-green-600 shrink-0" />
                              <span className="text-xs">
                                {program.sections?.length || 0} sections
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-green-600 shrink-0" />
                              <span className="text-xs">
                                {program.sessions?.[0]?.startDate
                                  ? new Date(
                                      program.sessions[0].startDate,
                                    ).toLocaleDateString()
                                  : ""}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-green-600 shrink-0" />
                              <span className="text-xs">{program.address}</span>
                            </div>
                          </>
                        )}
                        <div className="flex items-center gap-1 font-semibold text-green-600">
                          <span className="text-xs">
                            {program.price.toLocaleString()} FCFA
                          </span>
                        </div>
                      </div>

                      {/* Spacer to push buttons to bottom */}
                      <div className="flex-1" />

                      {/* Actions */}
                      <div className="border-t pt-4 mt-auto">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => openModal(program)}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            Détails
                          </Button>
                          <Button
                            size="sm"
                            className={`flex-1 shrink-0 ${
                              ownedFormationIds.includes(program.id) ||
                              (program.type === "presentiel" &&
                                !program.sessions?.some(
                                  (session) => session.status === "open",
                                ))
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                            } text-white`}
                            disabled={
                              ownedFormationIds.includes(program.id) ||
                              (program.type === "presentiel" &&
                                !program.sessions?.some(
                                  (session) => session.status === "open",
                                ))
                            }
                            onClick={() => handleEnroll(program)}
                          >
                            {ownedFormationIds.includes(program.id)
                              ? "Déjà acheté"
                              : program.type === "presentiel" &&
                                  !program.sessions?.some(
                                    (session) => session.status === "open",
                                  )
                                ? "Fermé"
                                : "S'inscrire"}
                            {ownedFormationIds.includes(program.id) ||
                            (program.type !== "presentiel" &&
                              !program.sessions?.some(
                                (session) => session.status === "open",
                              )) ? null : (
                              <ArrowRight className="w-4 h-4 ml-1" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comment Ça Marche ?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Un processus simple et transparent pour démarrer votre parcours de
              formation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white"
                    style={{ backgroundColor: "var(--color-brand)" }}
                  >
                    {step.number}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>

                {/* Connector Arrow */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[65%] w-[80%] h-0.5 bg-gray-200">
                    <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Details Modal */}
      <AnimatePresence>
        {modalProgram && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={closeModal}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              >
                {/* Modal Header */}
                <div className="relative h-64 bg-green-50 overflow-hidden">
                  <Image
                    src={modalProgram.image}
                    alt={modalProgram.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all hover:scale-110"
                  >
                    <X className="w-5 h-5 text-gray-700" />
                  </button>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 mb-2">
                      {(() => {
                        const IconComponent =
                          iconMap[modalProgram.icon as keyof typeof iconMap] ||
                          Leaf;
                        return <IconComponent className="w-5 h-5 text-white" />;
                      })()}
                      <span className="text-xs text-white/90 bg-white/20 backdrop-blur-sm px-2 py-1 rounded">
                        {modalProgram.category}
                      </span>
                      <span
                        className="text-xs text-white bg-white/20 backdrop-blur-sm px-2 py-1 rounded"
                        style={{
                          backgroundColor: "var(--color-secondary-brand)",
                        }}
                      >
                        {modalProgram.level}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {modalProgram.title}
                    </h2>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto flex-1">
                  <p className="text-gray-600 mb-6">
                    {modalProgram.description}
                  </p>

                  {/* Program Info Grid */}
                  <div className="grid grid-cols-4 gap-3 mb-6 p-6 bg-linear-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                    {modalProgram.type === "online" ? (
                      <>
                        <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-green-200">
                          <Clock className="w-6 h-6 text-green-600 mx-auto mb-3" />
                          <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                            Durée
                          </p>
                          <p className="font-bold text-gray-900 text-lg">
                            {modalProgram.durationDays} jours
                          </p>
                        </div>
                        <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-green-200">
                          <BookOpen className="w-6 h-6 text-green-600 mx-auto mb-3" />
                          <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                            Sections
                          </p>
                          <p className="font-bold text-gray-900 text-lg">
                            {modalProgram.sections?.length || 0}
                          </p>
                        </div>
                        <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-green-200">
                          <Users className="w-6 h-6 text-green-600 mx-auto mb-3" />
                          <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                            Participants
                          </p>
                          <p className="font-bold text-gray-900 text-lg">
                            {modalProgram.participants}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-green-200">
                          <Calendar className="w-6 h-6 text-green-600 mx-auto mb-3" />
                          <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                            Sessions disponibles
                          </p>
                          <p className="font-bold text-gray-900 text-sm leading-tight">
                            {modalProgram.sessions?.filter(
                              (s) => s.status === "open",
                            ).length || 0}{" "}
                            session(s)
                          </p>
                        </div>
                        <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-green-200">
                          <MapPin className="w-6 h-6 text-green-600 mx-auto mb-3" />
                          <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                            Lieu
                          </p>
                          <p className="font-bold text-gray-900 text-sm leading-tight">
                            {modalProgram.address}
                          </p>
                        </div>
                        <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-green-200">
                          <Users className="w-6 h-6 text-green-600 mx-auto mb-3" />
                          <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                            Places par session
                          </p>
                          <p className="font-bold text-gray-900 text-lg">
                            {modalProgram.sessions?.find(
                              (s) => s.id === selectedSessionId,
                            )?.availableSpots ||
                              modalProgram.sessions?.[0]?.availableSpots ||
                              0}
                          </p>
                        </div>
                      </>
                    )}
                    <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-green-200">
                      <Award className="w-6 h-6 text-green-600 mx-auto mb-3" />
                      <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                        Prix
                      </p>
                      <p className="font-bold text-green-600 text-lg">
                        {modalProgram.price.toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>

                  {/* Program Structure */}
                  <div>
                    {modalProgram.type === "online" ? (
                      <>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                          Structure de la Formation
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Cette formation comprend{" "}
                          {modalProgram.sections?.length || 0} sections pour un
                          total de{" "}
                          {modalProgram.sections?.reduce(
                            (sum, s) => sum + s.lessons.length,
                            0,
                          ) || 0}{" "}
                          leçons.
                        </p>

                        <div className="space-y-3">
                          {modalProgram.sections?.map((section, sIdx) => (
                            <div
                              key={section.id}
                              className="p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-gray-900">
                                  {section.title}
                                </h4>
                                <span className="text-xs text-gray-500">
                                  {section.lessons.length} leçons
                                </span>
                              </div>
                              {sIdx === 0 && (
                                <ul className="grid gap-2">
                                  {section.lessons.map((lesson) => (
                                    <li
                                      key={lesson.id}
                                      className="p-2 bg-white rounded-md border border-gray-100 text-sm text-gray-700"
                                    >
                                      {lesson.title}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Sessions - Main focus */}
                        <div className="space-y-4 mb-6">
                          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-green-600" />
                            Sélectionnez votre session
                          </h3>
                          <p className="text-gray-600 text-sm mb-4">
                            Choisissez la période qui vous convient parmi les{" "}
                            {modalProgram.sessions?.filter(
                              (s) => s.status === "open",
                            ).length || 0}{" "}
                            sessions disponibles.
                          </p>
                          {modalProgram.sessions
                            ?.filter((s) => s.status === "open")
                            .map((session) => (
                              <motion.div
                                key={session.id}
                                onClick={() =>
                                  session.status === "open" &&
                                  setSelectedSessionId(session.id)
                                }
                                className={`rounded-xl overflow-hidden cursor-pointer transition-all ${
                                  selectedSessionId === session.id
                                    ? "bg-green-50 border-2 border-green-600 shadow-lg"
                                    : "bg-white border-2 border-gray-200 hover:border-green-300 shadow-sm hover:shadow-md"
                                }`}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                              >
                                <div className="p-4">
                                  <div className="flex items-start gap-4">
                                    {/* Radio Button */}
                                    <div className="shrink-0 mt-1">
                                      <div
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                          selectedSessionId === session.id
                                            ? "border-green-600 bg-green-600"
                                            : "border-gray-300 bg-white"
                                        }`}
                                      >
                                        {selectedSessionId === session.id && (
                                          <div className="w-3 h-3 bg-white rounded-full"></div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Session Content */}
                                    <div className="flex-1 min-w-0">
                                      {/* Session Title */}
                                      <div className="flex items-center gap-2 mb-3">
                                        <div
                                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            selectedSessionId === session.id
                                              ? "bg-green-600"
                                              : "bg-gray-400"
                                          }`}
                                        >
                                          <span className="text-white text-sm font-bold">
                                            {session.id}
                                          </span>
                                        </div>
                                        <h4
                                          className={`font-bold text-lg ${
                                            selectedSessionId === session.id
                                              ? "text-green-700"
                                              : "text-gray-900"
                                          }`}
                                        >
                                          Session {session.id}
                                        </h4>
                                      </div>

                                      {/* Dates - Highlighted */}
                                      <div
                                        className={`mb-3 p-3 rounded-lg ${
                                          selectedSessionId === session.id
                                            ? "bg-green-100"
                                            : "bg-gray-100"
                                        }`}
                                      >
                                        <div className="flex items-center gap-2 mb-1">
                                          <Calendar
                                            className={`w-5 h-5 ${
                                              selectedSessionId === session.id
                                                ? "text-green-700"
                                                : "text-gray-600"
                                            }`}
                                          />
                                          <span className="text-xs font-medium text-gray-600 uppercase">
                                            Dates de formation
                                          </span>
                                        </div>
                                        <div
                                          className={`text-lg font-bold ${
                                            selectedSessionId === session.id
                                              ? "text-green-700"
                                              : "text-gray-900"
                                          }`}
                                        >
                                          {session.startDate
                                            ? new Date(
                                                session.startDate,
                                              ).toLocaleDateString("fr-FR", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                              })
                                            : ""}
                                        </div>
                                        <div className="text-sm text-gray-600 my-1">
                                          au
                                        </div>
                                        <div
                                          className={`text-lg font-bold ${
                                            selectedSessionId === session.id
                                              ? "text-green-700"
                                              : "text-gray-900"
                                          }`}
                                        >
                                          {session.endDate
                                            ? new Date(
                                                session.endDate,
                                              ).toLocaleDateString("fr-FR", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                              })
                                            : ""}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-2">
                                          ({modalProgram.durationDays} jours •
                                          08:00 - 17:00)
                                        </div>
                                      </div>

                                      {/* Location and Spots */}
                                      <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-1 text-gray-600">
                                          <MapPin className="w-4 h-4" />
                                          <span>{session.location}</span>
                                        </div>
                                        <div
                                          className={`flex items-center gap-1 ${
                                            selectedSessionId === session.id
                                              ? "text-green-700 font-semibold"
                                              : "text-gray-600"
                                          }`}
                                        >
                                          <Users className="w-4 h-4" />
                                          <span>
                                            {session.availableSpots} places
                                            disponibles
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                        </div>

                        {/* Collapsible Program */}
                        {modalProgram.program && (
                          <div className="mb-6">
                            <button
                              onClick={() =>
                                setIsProgramExpanded(!isProgramExpanded)
                              }
                              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                            >
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-green-600" />
                                <h4 className="font-semibold text-gray-900">
                                  Programme détaillé (
                                  {modalProgram.durationDays} jours)
                                </h4>
                              </div>
                              <motion.div
                                animate={{
                                  rotate: isProgramExpanded ? 180 : 0,
                                }}
                                transition={{ duration: 0.2 }}
                              >
                                <ArrowRight className="w-5 h-5 text-gray-600 transform rotate-90" />
                              </motion.div>
                            </button>

                            <AnimatePresence>
                              {isProgramExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="mt-3 space-y-3">
                                    {modalProgram.program.map((day, dayIdx) => (
                                      <div
                                        key={dayIdx}
                                        className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-500"
                                      >
                                        <div className="flex items-center gap-2 mb-3">
                                          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">
                                              {dayIdx + 1}
                                            </span>
                                          </div>
                                          <h5 className="font-semibold text-gray-900">
                                            {day.name}
                                          </h5>
                                        </div>

                                        <div className="space-y-2 ml-8">
                                          {day.timeFrames.map(
                                            (timeFrame, tfIdx) => (
                                              <div
                                                key={tfIdx}
                                                className="flex items-start gap-3 p-2 bg-white rounded-md border border-gray-100"
                                              >
                                                <div className="shrink-0 mt-0.5">
                                                  <Clock className="w-4 h-4 text-green-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                  <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-medium text-gray-900">
                                                      {timeFrame.from} -{" "}
                                                      {timeFrame.to}
                                                    </span>
                                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                      {timeFrame.name}
                                                    </span>
                                                  </div>
                                                  {timeFrame.description && (
                                                    <p className="text-sm text-gray-600">
                                                      {timeFrame.description}
                                                    </p>
                                                  )}
                                                </div>
                                              </div>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="border-t bg-linear-to-r from-gray-50 to-green-50">
                  {modalProgram.type === "presentiel" && (
                    <div className="px-6 pt-4 pb-2">
                      <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4 text-green-600" />
                          <span className="font-medium">
                            {modalProgram.contactPhone}
                          </span>
                        </div>
                        <div className="w-px h-4 bg-gray-300"></div>
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-green-600" />
                          <span>{modalProgram.contactEmail}</span>
                        </div>
                      </div>
                      <p className="text-center text-xs text-gray-500 mt-2">
                        Contactez-nous pour plus d&apos;informations ou pour
                        vous inscrire
                      </p>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex gap-3">
                      <Button
                        onClick={closeModal}
                        variant="outline"
                        className="flex-1 border-gray-300 hover:bg-gray-50"
                      >
                        Fermer
                      </Button>
                      <Button
                        onClick={() => {
                          if (modalProgram.type === "presentiel") {
                            const openSessions = modalProgram.sessions?.filter(
                              (s) => s.status === "open",
                            );
                            if (
                              openSessions &&
                              openSessions.length > 1 &&
                              !selectedSessionId
                            ) {
                              alert("Veuillez sélectionner une session.");
                              return;
                            }
                          }
                          handleEnroll(modalProgram);
                          closeModal();
                        }}
                        disabled={
                          ownedFormationIds.includes(modalProgram.id) ||
                          (modalProgram.type === "presentiel" &&
                            !modalProgram.sessions?.some(
                              (session) => session.status === "open",
                            ))
                        }
                        className={`flex-1 shadow-lg hover:shadow-xl transition-all ${
                          ownedFormationIds.includes(modalProgram.id) ||
                          (modalProgram.type === "presentiel" &&
                            !modalProgram.sessions?.some(
                              (session) => session.status === "open",
                            ))
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                        }`}
                      >
                        {ownedFormationIds.includes(modalProgram.id)
                          ? "Déjà acheté"
                          : modalProgram.type === "presentiel" &&
                              !modalProgram.sessions?.some(
                                (session) => session.status === "open",
                              )
                            ? "Aucune Session Ouverte"
                            : "S'inscrire Maintenant"}
                        {ownedFormationIds.includes(modalProgram.id) ||
                        (modalProgram.type !== "presentiel" &&
                          !modalProgram.sessions?.some(
                            (session) => session.status === "open",
                          )) ? null : (
                          <ArrowRight className="w-4 h-4 ml-2" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
