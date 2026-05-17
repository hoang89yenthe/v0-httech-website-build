import { urlFor } from "./client";
import { Product } from "./schema";

const categoryImages: Record<string, string> = {
  "bien-tan": "photo-1558618666-fcd25c85cd64",
  "plc-hmi":  "photo-1518770660439-4636190af475",
  "dong-cat": "photo-1621905252507-b35492cc74b4",
  "cam-bien": "photo-1580983218765-f663bec07b37",
  "vat-tu":   "photo-1504917595217-d4dc5ebe6122",
};

export function getProductImageUrl(product: Product, size = 400): string {
  if (product.image?.asset?._ref) {
    return urlFor(product.image).width(size).height(size).fit("crop").url();
  }
  const photoId = categoryImages[product.category] ?? "photo-1565891741441-64926e3d6d90";
  return `https://images.unsplash.com/${photoId}?w=${size}&h=${size}&fit=crop&q=80`;
}
