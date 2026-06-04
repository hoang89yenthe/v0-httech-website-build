import { MetadataRoute } from "next";
import { getMockProducts } from "@/lib/sanity/mock-data";
import { fetchProducts } from "@/lib/sanity/fetch";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://httechvietnam.vn";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products = getMockProducts();
  try {
    const sanityProducts = await fetchProducts();
    if (sanityProducts.length > 0) products = sanityProducts;
  } catch {}

  const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/san-pham/${product.slug.current}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/san-pham`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    ...productUrls,
  ];
}
