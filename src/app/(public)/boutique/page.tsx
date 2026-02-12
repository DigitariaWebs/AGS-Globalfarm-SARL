import { getProducts } from "@/lib/db";
import BoutiqueClientPage from "./BoutiqueClientPage";

const categories = ["Tout", "Légumes", "Semences", "Plants", "Matériel"];

export default async function BoutiquePage() {
  // Fetch products from MongoDB and convert to plain objects
  const products = await getProducts();
  const productsData = JSON.parse(JSON.stringify(products));

  // Filter to show only cucumber products
  const filteredProducts = productsData.filter((product: any) =>
    product.name.toLowerCase().includes("concombre"),
  );

  return (
    <BoutiqueClientPage products={filteredProducts} categories={categories} />
  );
}
