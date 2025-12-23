"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, ArrowRight, Calendar } from "lucide-react";
import Image from "next/image";

const featuredEvent = {
  day: "15",
  month: "Oct",
  title: "Initiation à la Culture Hors-sol",
  description:
    "Rejoignez-nous pour une journée complète d'apprentissage pratique sur les techniques de culture moderne. Au programme : hydroponie, gestion des serres intelligentes, et optimisation des rendements.",
  location: "Ferme AGS, Keur Ndiaye Lo",
  time: "09:00 - 16:00",
  image: "/BlackManExplainingTwo.png",
  spots: "8 places restantes",
};

const upcomingEvents = [
  {
    day: "02",
    month: "Nov",
    title: "Masterclass Business Plan Agricole",
    location: "En ligne (Zoom)",
    time: "10:00 - 13:00",
    category: "FORMATION",
  },
  {
    day: "20",
    month: "Nov",
    title: "Journée Portes Ouvertes",
    location: "Ferme AGS",
    time: "09:00 - 17:00",
    category: "ÉVÉNEMENT",
  },
  {
    day: "05",
    month: "Déc",
    title: "Atelier Drone & Surveillance",
    location: "Ferme AGS",
    time: "14:00 - 18:00",
    category: "ATELIER",
  },
];

export default function EventsSection() {
  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-base md:text-lg mb-6"
            style={{
              backgroundColor: "var(--color-secondary-brand, #f59e0b)20",
              color: "var(--color-secondary-brand, #f59e0b)",
            }}
          >
            <Calendar className="w-5 h-5 md:w-6 md:h-6" />
            Prochains Événements
          </div>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold"
            style={{ color: "var(--color-brand, #16a34a)" }}
          >
            Ne manquez rien
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-[1.5fr,1fr] gap-8 mb-12">
          {/* Featured Event - Large Card */}
          <motion.div
            className="relative group"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-xl">
              <Image
                src={featuredEvent.image}
                alt={featuredEvent.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

              {/* Content Overlay */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md"
                    style={{
                      backgroundColor: "var(--color-secondary-brand, #f59e0b)",
                    }}
                  >
                    ÉVÉNEMENT À LA UNE
                  </div>
                  <div className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm">
                    {featuredEvent.spots}
                  </div>
                </div>

                <h3 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  {featuredEvent.title}
                </h3>
                <p className="text-white/90 mb-6 text-sm md:text-base leading-relaxed max-w-xl">
                  {featuredEvent.description}
                </p>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                      {featuredEvent.day} {featuredEvent.month}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{featuredEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{featuredEvent.location}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white shadow-lg transition-all duration-300 w-fit"
                  style={{
                    backgroundColor: "var(--color-brand, #16a34a)",
                  }}
                >
                  Réserver ma place
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Upcoming Events - Timeline Style */}
          <div className="space-y-4">
            <motion.h3
              className="text-2xl font-bold mb-6"
              style={{ color: "var(--color-brand, #16a34a)" }}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              À venir
            </motion.h3>

            {upcomingEvents.map((event, index) => (
              <motion.div
                key={index}
                className="group relative bg-white p-6 rounded-2xl border border-border/50 hover:border-primary/30 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ x: -4 }}
              >
                <div className="flex gap-4">
                  {/* Date Circle */}
                  <div
                    className="shrink-0 w-16 h-16 rounded-full flex flex-col items-center justify-center text-white shadow-md"
                    style={{
                      backgroundColor: "var(--color-brand, #16a34a)",
                    }}
                  >
                    <div className="text-xl font-bold leading-none">{event.day}</div>
                    <div className="text-[10px] font-semibold uppercase mt-0.5">
                      {event.month}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div
                      className="inline-block px-2 py-1 rounded text-[10px] font-bold mb-2"
                      style={{
                        backgroundColor: "var(--color-secondary-brand, #f59e0b)20",
                        color: "var(--color-secondary-brand, #f59e0b)",
                      }}
                    >
                      {event.category}
                    </div>
                    <h4 className="font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                      {event.title}
                    </h4>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 self-center" />
                </div>
              </motion.div>
            ))}

            {/* View All Link */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.a
                href="#calendrier"
                className="group inline-flex items-center gap-2 font-bold text-base transition-all duration-300"
                style={{ color: "var(--color-brand, #16a34a)" }}
                whileHover={{ x: 4 }}
              >
                <span className="border-b-2 border-current pb-0.5">
                  Voir tous les événements
                </span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
