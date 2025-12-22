import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ActivitiesSection from "@/components/sections/ActivitiesSection";
import TrainingSection from "@/components/sections/TrainingSection";
import EventsSection from "@/components/sections/EventsSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <ActivitiesSection />
      <TrainingSection />
      <EventsSection />
    </main>
  );
}
