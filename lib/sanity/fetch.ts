import { getProducts, getProductBySlug, getProductsByCategory } from "./queries";
import { getMockProducts, getMockProductBySlug, getRelatedProducts } from "./mock-data";
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

export async function fetchRelatedProducts(
  category: string,
  currentProductId: string,
  limit: number = 4
): Promise<Product[]> {
  try {
    const products = await getProductsByCategory(category);
    if (products && products.length > 0) {
      return products
        .filter((p) => p._id !== currentProductId)
        .slice(0, limit);
    }
  } catch (err) {
    console.error("Lỗi khi fetch sản phẩm liên quan từ Sanity:", err);
  }
  const dummyProduct = { category, _id: currentProductId } as Product;
  return getRelatedProducts(dummyProduct, limit);
}
