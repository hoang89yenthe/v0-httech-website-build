import { getProducts, getProductBySlug } from "./queries";
import { getMockProducts, getMockProductBySlug } from "./mock-data";
import { Product } from "./schema";

export async function fetchProducts(): Promise<Product[]> {
  try {
    const products = await getProducts();
    if (products && products.length > 0) return products;
  } catch {
    console.log("[v0] Sanity not connected, using mock data");
  }
  return getMockProducts();
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const product = await getProductBySlug(slug);
    if (product) return product;
  } catch {
    console.log("[v0] Sanity not connected, using mock data");
  }
  return getMockProductBySlug(slug) ?? null;
}
