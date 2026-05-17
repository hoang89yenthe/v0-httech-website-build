import { client } from "./client";

// GROQ queries for Sanity
export const PRODUCTS_QUERY = `*[_type == "product"] | order(_createdAt desc) {
  _id,
  title,
  slug,
  image,
  category,
  brand,
  price,
  originalPrice,
  specs,
  description,
  tag,
  inStock
}`;

export const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  image,
  category,
  brand,
  price,
  originalPrice,
  specs,
  description,
  tag,
  inStock
}`;

export const PRODUCTS_BY_CATEGORY_QUERY = `*[_type == "product" && category == $category] | order(_createdAt desc) {
  _id,
  title,
  slug,
  image,
  category,
  brand,
  price,
  originalPrice,
  specs,
  description,
  tag,
  inStock
}`;

export const CATEGORIES_QUERY = `*[_type == "product"] {
  category
} | unique`;

// Fetch functions
export async function getProducts() {
  return client.fetch(PRODUCTS_QUERY);
}

export async function getProductBySlug(slug: string) {
  return client.fetch(PRODUCT_BY_SLUG_QUERY, { slug });
}

export async function getProductsByCategory(category: string) {
  return client.fetch(PRODUCTS_BY_CATEGORY_QUERY, { category });
}
