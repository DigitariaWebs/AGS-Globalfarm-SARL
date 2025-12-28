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
}

export default function FormationClientPage({
  trainingPrograms,
  categories,
  benefits,
  processSteps,
}: FormationClientPageProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [modalProgram, setModalProgram] = useState<Formation | null>(null);
  const [backgroundColor, setBackgroundColor] = useState("#faf9f6");

  // Get the actual background color from the body element
  useLayoutEffect(() => {
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBackgroundColor(bodyBg);
  }, []);

  const handleEnroll = (program: Formation) => {
    addToCart(program);
  };

  const openModal = (program: Formation) => {
    setModalProgram(program);
  };

  const closeModal = () => {
    setModalProgram(null);
  };

  // Filter programs
  const filteredPrograms = trainingPrograms.filter((program: Formation) => {
    return activeCategory === "Tout" || program.category === activeCategory;
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
                Formations Agricoles Professionnelles
              </h1>
              <p className="text-white/90 text-lg mb-10 max-w-3xl mx-auto">
                Développez vos compétences avec nos formations pratiques animées
                par des experts. De l&apos;agriculture biologique à la gestion
                d&apos;entreprise, trouvez la formation qui vous convient.
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
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-green-600 shrink-0" />
                          <span className="text-xs">{program.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4 text-green-600 shrink-0" />
                          <span className="text-xs">
                            {program.sections.length} sections
                          </span>
                        </div>
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
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white shrink-0"
                            onClick={() => handleEnroll(program)}
                          >
                            S&apos;inscrire
                            <ArrowRight className="w-4 h-4 ml-1" />
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
                  <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                    <div className="text-center">
                      <Clock className="w-5 h-5 text-green-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-500 mb-1">Durée</p>
                      <p className="font-semibold text-gray-900">
                        {modalProgram.duration}
                      </p>
                    </div>
                    <div className="text-center">
                      <BookOpen className="w-5 h-5 text-green-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-500 mb-1">Sections</p>
                      <p className="font-semibold text-gray-900">
                        {modalProgram.sections.length}
                      </p>
                    </div>
                    <div className="text-center">
                      <Award className="w-5 h-5 text-green-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-500 mb-1">Prix</p>
                      <p className="font-semibold text-gray-900">
                        {modalProgram.price.toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>

                  {/* Sections and Lessons */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Structure de la Formation
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Cette formation comprend {modalProgram.sections.length}{" "}
                      sections pour un total de{" "}
                      {modalProgram.sections.reduce(
                        (sum, s) => sum + s.lessons.length,
                        0,
                      )}{" "}
                      leçons.
                    </p>

                    <div className="space-y-3">
                      {modalProgram.sections.map((section, sIdx) => (
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
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="border-t p-6 bg-gray-50">
                  <div className="flex gap-3">
                    <Button
                      onClick={closeModal}
                      variant="outline"
                      className="flex-1"
                    >
                      Fermer
                    </Button>
                    <Button
                      onClick={() => {
                        handleEnroll(modalProgram);
                        closeModal();
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      S&apos;inscrire Maintenant
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
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
