import { Attraction } from "../types";

const USED_IDS_STORAGE_KEY = "tiqsey_used_product_ids";
const NEXT_ID_STORAGE_KEY = "tiqsey_next_product_id";
const DEFAULT_START_ID = 36110868;

/**
 * Reads the set of all used 8-digit product IDs (including deleted products) from localStorage
 */
export function getUsedProductIds(): Set<string> {
  const used = new Set<string>();
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(USED_IDS_STORAGE_KEY);
      if (stored) {
        const arr = JSON.parse(stored);
        if (Array.isArray(arr)) {
          arr.forEach((id: string) => used.add(String(id)));
        }
      }
    } catch (e) {
      console.error("Error reading used product IDs:", e);
    }
  }
  return used;
}

/**
 * Register a product ID as permanently used so it can never be reused, even if deleted
 */
export function registerUsedProductId(id: string) {
  if (typeof window === "undefined" || !id) return;
  const used = getUsedProductIds();
  const displayId = getDisplayProductId({ id });
  used.add(displayId);
  used.add(String(id));
  try {
    localStorage.setItem(USED_IDS_STORAGE_KEY, JSON.stringify(Array.from(used)));
  } catch (e) {
    console.error("Error saving used product IDs:", e);
  }
}

/**
 * Converts any attraction object or ID (including legacy string slugs) to a permanent 8-digit numeric string (e.g., 36110868)
 */
export function getDisplayProductId(attraction: { id: string; productId?: string }): string {
  if (!attraction) return "36110868";
  
  if (attraction.productId && /^\d{8}$/.test(attraction.productId)) {
    return attraction.productId;
  }
  
  if (/^\d{8}$/.test(attraction.id)) {
    return attraction.id;
  }

  // Handle legacy string IDs (e.g. "ams-rijksmuseum") deterministically
  let hash = 0;
  const str = attraction.id || "default";
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const positive = Math.abs(hash);
  const num = 10000000 + (positive % 89999999);
  return num.toString().padStart(8, '0');
}

/**
 * Generates a brand new, unique, permanent 8-digit numeric Product ID in the format 36110868.
 * Guarantees no collisions with existing or previously deleted products.
 */
export function generateUniqueProductId(existingAttractions: Attraction[] = []): string {
  const usedIds = getUsedProductIds();

  // Include IDs from active attractions list
  existingAttractions.forEach((a) => {
    usedIds.add(a.id);
    if (a.productId) usedIds.add(a.productId);
    usedIds.add(getDisplayProductId(a));
  });

  let currentCounter = DEFAULT_START_ID;
  if (typeof window !== "undefined") {
    try {
      const storedCounter = localStorage.getItem(NEXT_ID_STORAGE_KEY);
      if (storedCounter) {
        const parsed = parseInt(storedCounter, 10);
        if (!isNaN(parsed) && parsed >= 10000000) {
          currentCounter = parsed;
        }
      }
    } catch (e) {
      console.error("Error reading next product ID counter:", e);
    }
  }

  // Find next unused 8-digit numeric ID
  let candidate = currentCounter;
  while (usedIds.has(String(candidate))) {
    candidate++;
    if (candidate > 99999999) {
      candidate = 10000000;
    }
  }

  const newId = String(candidate).padStart(8, "0");

  // Permanently record as used
  registerUsedProductId(newId);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(NEXT_ID_STORAGE_KEY, String(candidate + 1));
    } catch (e) {
      console.error("Error updating next product ID counter:", e);
    }
  }

  return newId;
}
