import { auth } from "@/lib/auth";
import { getUserOrders, getFormations } from "@/lib/db";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import MesFormationsClient from "./MesFormationsClient";
import type { Formation, FormationSession, Section } from "@/types";

export default async function MesFormationsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    redirect("/login");
  }

  const orders = await getUserOrders(session.user.id);
  const allFormations = await getFormations();
  const serializedFormations = JSON.parse(JSON.stringify(allFormations));

  // Extract purchased formations with their session info
  const purchasedOnlineCourses: Formation[] = [];
  const purchasedPresentialSessions: {
    formation: Formation;
    session: FormationSession;
  }[] = [];

  orders.forEach((order) => {
    order.items.forEach((item) => {
      if ("title" in item && item.id) {
        const formation = serializedFormations.find(
          (f: Formation) => f.id === item.id,
        );
        if (formation) {
          if (formation.type === "online") {
            purchasedOnlineCourses.push(formation);
          } else if (formation.type === "presentiel" && item.sessionId) {
            const session = formation.sessions?.find(
              (s: Section) => s.id === item.sessionId,
            );
            if (session) {
              purchasedPresentialSessions.push({ formation, session });
            }
          }
        }
      }
    });
  });

  // Remove duplicates for online courses
  const uniqueOnlineCourses = purchasedOnlineCourses.filter(
    (course, index, self) =>
      self.findIndex((c) => c.id === course.id) === index,
  );

  // Categorize presential sessions by status
  const prevFormations = purchasedPresentialSessions.filter(
    ({ session }) => session.status === "done",
  );
  const upFormations = purchasedPresentialSessions.filter(
    ({ session }) => session.status === "open" || session.status === "ongoing",
  );

  return (
    <MesFormationsClient
      onlineCourses={uniqueOnlineCourses}
      previousFormations={prevFormations}
      upcomingFormations={upFormations}
    />
  );
}
