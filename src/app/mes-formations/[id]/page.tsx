import { auth } from "@/lib/auth";
import { getUserOrders, getFormations } from "@/lib/db";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import FormationContent from "./FormationContent";
import Image from "next/image";
import BackButton from "./BackButton";

export default async function FormationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id: formationId } = await params;

  // Check if user owns this formation
  const orders = await getUserOrders(session.user.id);
  const ownsFormation = orders.some((order) =>
    order.items.some((item) => "title" in item && item._id === formationId),
  );

  if (!ownsFormation) {
    redirect("/mes-formations");
  }

  // Get formation details
  const formations = await getFormations();
  const formation = formations.find((f) => f._id?.valueOf() === formationId);

  if (!formation || formation.type !== "online") {
    redirect("/mes-formations");
  }

  const plainFormation = JSON.parse(JSON.stringify(formation));

  //37
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <BackButton />
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {formation.title}
            </h1>
            <p className="text-gray-600 mb-4">{formation.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>📚 {formation.level}</span>
              <span>⏱️ {formation.durationDays} jours</span>
              <span>
                📹{" "}
                {formation.sections?.reduce(
                  (acc, section) => acc + section.lessons.length,
                  0,
                ) || 0}{" "}
                leçons
              </span>
            </div>
          </div>
          <div className="md:w-80">
            <Image
              src={formation.image}
              alt={formation.title}
              width={320}
              height={180}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Interactive Content */}
      <FormationContent formation={plainFormation} />
    </div>
  );
}
