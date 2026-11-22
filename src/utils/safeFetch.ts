/**
 * Safe JSON response helpers for dual-hosting (Node.js server + static Hostinger hosting).
 * Prevents "Unexpected token '<', \"<!doctype \"... is not valid JSON" whenever a static
 * host serves index.html or an HTML error page for /api/* routes.
 */

export interface SafeJsonResult<T = any> {
  ok: boolean;
  isJson: boolean;
  status: number;
  data: T | null;
  networkError?: boolean;
}

export function isJsonResponse(resp: Response): boolean {
  const contentType = (resp.headers.get('content-type') || '').toLowerCase();
  return contentType.includes('application/json') || contentType.includes('+json');
}

export async function parseJsonSafely<T = any>(resp: Response): Promise<SafeJsonResult<T>> {
  const isJson = isJsonResponse(resp);
  if (!isJson) {
    return {
      ok: false,
      isJson: false,
      status: resp.status,
      data: null,
    };
  }

  try {
    const data = (await resp.json()) as T;
    return {
      ok: resp.ok,
      isJson: true,
      status: resp.status,
      data,
    };
  } catch {
    return {
      ok: false,
      isJson: false,
      status: resp.status,
      data: null,
    };
  }
}

export async function fetchJsonSafely<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<SafeJsonResult<T>> {
  try {
    const resp = await fetch(input, init);
    return await parseJsonSafely<T>(resp);
  } catch {
    return {
      ok: false,
      isJson: false,
      status: 0,
      data: null,
      networkError: true,
    };
  }
}

/**
 * Validates that a navigation URL uses a safe http/https or relative path scheme.
 */
export function isSafeNavigationUrl(url: string): boolean {
  const trimmed = (url || '').trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return true;
  try {
    const parsed = new URL(trimmed, window.location.origin);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
