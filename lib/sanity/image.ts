import { urlFor } from "./client";
import { Product } from "./schema";

// Category-specific Unsplash photo pools — all verified free (Unsplash License)
const categoryImagePools: Record<string, string[]> = {
  // Industrial control panels / automation cabinets — most relevant for VFD/drives
  "bien-tan": [
    "photo-1780034766312-73825064806c",  // open industrial electrical control panel
    "photo-1780034766228-3fd70d9463c3",  // industrial control cabinet interior
    "photo-1780034766295-43db0f2a0fb7",  // PLC/drive control panel wiring
    "photo-1655874837055-7adc909ae602",  // motor/pump/industrial factory floor
  ],
  // PLC modules, circuit boards, control screens
  "plc-hmi": [
    "photo-1780034766295-43db0f2a0fb7",  // PLC control panel wiring
    "photo-1518770660439-4636190af475",  // PCB green circuit board close-up
    "photo-1565891741441-64926e3d6d90",  // industrial control systems
    "photo-1780034766228-3fd70d9463c3",  // control cabinet
  ],
  // Circuit breakers, contactors, switchgear
  "dong-cat": [
    "photo-1566417110090-6b15a06ec800",  // circuit breaker in electrical panel
    "photo-1621905252507-b35492cc74b4",  // electrical panel installation
    "photo-1607631697491-61972eecf928",  // electrical panel wiring prefab
    "photo-1558618666-fcd25c85cd64",     // industrial control panel
  ],
  // Electronic sensors, measurement equipment
  "cam-bien": [
    "photo-1638734255280-8bae834f8297",  // electronic sensor / IoT hardware
    "photo-1597852074816-d933c7d2b988",  // electronics components board
    "photo-1638734254958-4a11c989e9bb",  // industrial sensor close-up
    "photo-1581091226825-a6a2a5aee158",  // automation / measurement lab
  ],
  // Wiring, terminals, cable management
  "vat-tu": [
    "photo-1619249722898-492c571615fe",  // electrical toolkit / wiring connectors
    "photo-1607631697491-61972eecf928",  // electrical wiring prefab
    "photo-1504917595217-d4dc5ebe6122",  // industrial metalwork / fabrication
    "photo-1581092918056-0c4c3acd3789",  // manufacturing / assembly floor
  ],
};

// Tiny 1×1 grey blur placeholder — 40 bytes, works for all product images
export const PRODUCT_BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg==";

export function getProductImageUrl(product: Product, size = 400): string {
  if (product.image?.asset?._ref) {
    return urlFor(product.image).width(size).height(size).fit("crop").url();
  }
  const pool = categoryImagePools[product.category] ?? categoryImagePools["bien-tan"];
  const idNum = parseInt(product._id, 10);
  const photoId = !isNaN(idNum) ? pool[idNum % pool.length] : pool[0];
  return `https://images.unsplash.com/${photoId}?w=${size}&h=${size}&fit=crop&q=80`;
}
