// ─────────────────────────────────────────────
//  Shared service utilities
//  Used by all resource-specific services
// ─────────────────────────────────────────────

const BASE_URL = process.env.CODETRIBE_PROGRAMMES_API!;

/** Build a full URL with optional query params appended. */
export function buildUrl(path: string, params?: object): string {
  const url = new URL(`${BASE_URL}${path}`);

  if (params) {
    Object.entries(params as Record<string, unknown>).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

/** Execute a fetch and throw a descriptive error if the response is not ok. */
export async function apiFetch<T>(url: string, resource: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${resource}: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<T>;
}