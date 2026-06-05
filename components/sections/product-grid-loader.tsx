import { fetchProducts } from "@/lib/sanity/fetch";
import { ProductGrid } from "./product-grid";

export async function ProductGridLoader({ initialCategory }: { initialCategory?: string }) {
  const products = await fetchProducts();
  return <ProductGrid products={products} initialCategory={initialCategory} isPage />;
}
