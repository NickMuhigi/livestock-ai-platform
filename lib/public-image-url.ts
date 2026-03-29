// Pure utility for building Supabase public image URLs for the frontend (no server-only imports)
export function getPublicImageUrl(filePath: string): string {
  return `https://wslchdniqgjuuqkpjxhx.supabase.co/storage/v1/object/public/uploads/${filePath}`;
}
