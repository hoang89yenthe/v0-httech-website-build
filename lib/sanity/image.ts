import { urlFor } from "./client";
import { Product } from "./schema";

// Pool of varied industrial/electronic equipment photos for mock product display
const imagePool = [
  "photo-1518770660439-4636190af475",  // green PCB circuit board
  "photo-1621905252507-b35492cc74b4",  // electrical panel installation
  "photo-1581092160562-40aa08e78837",  // engineering / industrial work desk
  "photo-1597852074816-d933c7d2b988",  // electronics disk components
  "photo-1504917595217-d4dc5ebe6122",  // metalwork / industrial sparks
  "photo-1581092160607-ee22621dd758",  // industrial automation / robotics
  "photo-1565891741441-64926e3d6d90",  // control systems
  "photo-1581092918056-0c4c3acd3789",  // manufacturing floor
  "photo-1581091226825-a6a2a5aee158",  // automation lab
  "photo-1558618666-fcd25c85cd64",     // industrial control panel
];

export function getProductImageUrl(product: Product, size = 400): string {
  if (product.image?.asset?._ref) {
    return urlFor(product.image).width(size).height(size).fit("crop").url();
  }
  // Use product _id to deterministically pick a unique image from the pool
  const idNum = parseInt(product._id, 10);
  const photoId = !isNaN(idNum)
    ? imagePool[idNum % imagePool.length]
    : imagePool[0];
  return `https://images.unsplash.com/${photoId}?w=${size}&h=${size}&fit=crop&q=80`;
}
