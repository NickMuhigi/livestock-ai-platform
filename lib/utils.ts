// Normalize image URLs for all backend APIs
import { getPublicImageUrl } from "./public-image-url";

export function normalizeImageUrl(imageUrl?: string | null): string | null {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }
  // If it's a Supabase Storage path (no leading slash), use public URL
  if (!imageUrl.startsWith("/")) {
    return getPublicImageUrl(imageUrl);
  }
  // If it starts with /uploads/, strip and use public URL
  if (imageUrl.startsWith("/uploads/")) {
    return getPublicImageUrl(imageUrl.replace(/^\/uploads\//, ""));
  }
  // Otherwise, return as-is (legacy or error)
  return imageUrl;
}
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
