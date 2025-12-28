import { getProducts } from "@/lib/db";
import BoutiqueClientPage from "./BoutiqueClientPage";

const categories = ["Tout", "Légumes", "Semences", "Plants", "Matériel"];

export default async function BoutiquePage() {
  // Fetch products from MongoDB and convert to plain objects
  const products = await getProducts();
  const productsData = JSON.parse(JSON.stringify(products));

  return <BoutiqueClientPage products={productsData} categories={categories} />;
}
