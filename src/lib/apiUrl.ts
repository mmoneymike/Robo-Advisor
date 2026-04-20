/**
 * Builds the API URL for fetch(). In local dev, VITE_API_BASE (see .env.development)
 * points at the Python server so `vercel dev` and `npm run dev` work without relying
 * on the Vite proxy (which `vercel dev` does not apply to /api). In production builds,
 * the base is unset and same-origin `/api` is used.
 */
export function apiUrl(pathWithQuery: string): string {
  const base = import.meta.env.VITE_API_BASE;
  const path = pathWithQuery.startsWith("/")
    ? pathWithQuery
    : `/${pathWithQuery}`;
  if (typeof base === "string" && base.length > 0) {
    return `${base.replace(/\/$/, "")}${path}`;
  }
  return path;
}
