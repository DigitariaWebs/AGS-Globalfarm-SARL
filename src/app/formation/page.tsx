import { getFormations } from "@/lib/db";
import FormationClientPage from "./FormationClientPage";

const categories = ["Tout", "Agriculture", "Présentiel"];

const benefits = [
  {
    icon: "GraduationCap",
    title: "Formateurs Experts",
    description:
      "Apprenez auprès de professionnels expérimentés dans le domaine agricole.",
  },
  {
    icon: "Award",
    title: "Certification Reconnue",
    description:
      "Obtenez un certificat validé qui renforce votre crédibilité professionnelle.",
  },
  {
    icon: "Users",
    title: "Apprentissage Pratique",
    description:
      "70% de pratique sur le terrain pour une expérience concrète et applicable.",
  },
  {
    icon: "Target",
    title: "Suivi Personnalisé",
    description:
      "Accompagnement individuel pour garantir votre réussite et progression.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Inscription",
    description:
      "Choisissez votre formation et remplissez le formulaire d'inscription en ligne.",
  },
  {
    number: "02",
    title: "Validation",
    description:
      "Notre équipe valide votre inscription et vous contacte pour confirmer les détails.",
  },
  {
    number: "03",
    title: "Formation",
    description:
      "Participez aux sessions théoriques et pratiques avec nos formateurs experts.",
  },
  {
    number: "04",
    title: "Certification",
    description:
      "Recevez votre certificat officiel après avoir réussi l'évaluation finale.",
  },
];

export default async function FormationPage() {
  // Fetch formations from MongoDB and convert to plain objects
  const formations = await getFormations();
  const trainingPrograms = JSON.parse(JSON.stringify(formations));

  return (
    <FormationClientPage
      trainingPrograms={trainingPrograms}
      categories={categories}
      benefits={benefits}
      processSteps={processSteps}
    />
  );
}
