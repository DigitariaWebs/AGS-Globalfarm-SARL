import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ActivitiesSection from "@/components/sections/ActivitiesSection";
import TrainingSection from "@/components/sections/TrainingSection";
import EventsSection from "@/components/sections/EventsSection";
import { getFormations } from "@/lib/db";
import type { Formation, FormationSession } from "@/types";

export default async function Home() {
  const allFormations = await getFormations();
  const serializedFormations = JSON.parse(JSON.stringify(allFormations));

  // Filter presentiel formations with sessions
  const presentielFormations = serializedFormations.filter(
    (f: Formation) =>
      f.type === "presentiel" && f.sessions && f.sessions.length > 0,
  );

  // Filter online formations (always available)
  const onlineFormations = serializedFormations.filter(
    (f: Formation) => f.type === "online",
  );

  // Get all upcoming presentiel sessions (open or ongoing)
  const upcomingSessions: {
    formation: Formation;
    session: FormationSession;
  }[] = [];

  presentielFormations.forEach((formation: Formation) => {
    formation.sessions?.forEach((session) => {
      if (session.status === "open" || session.status === "ongoing") {
        upcomingSessions.push({ formation, session });
      }
    });
  });

  // Sort by start date
  upcomingSessions.sort(
    (a, b) =>
      new Date(a.session.startDate).getTime() -
      new Date(b.session.startDate).getTime(),
  );

  // Get featured (first upcoming) and other upcoming sessions
  const [featured, ...upcoming] = upcomingSessions;

  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <ActivitiesSection />
      <TrainingSection />
      <EventsSection
        featuredSession={featured || null}
        upcomingSessions={upcoming}
        onlineFormations={onlineFormations}
      />
    </main>
  );
}
