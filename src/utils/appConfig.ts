/**
 * Runtime host, mode, and URL configuration for separating
 * the customer storefront (https://tiqsey.com) and the dedicated
 * admin portal (https://admin.tiqsey.com).
 */

export type AppMode = 'admin' | 'public' | 'dual';

const rawAppMode = String(import.meta.env.VITE_APP_MODE || 'dual').trim().toLowerCase();
export const APP_MODE: AppMode =
  rawAppMode === 'admin' || rawAppMode === 'public' ? rawAppMode : 'dual';

export const PUBLIC_SITE_URL = (
  import.meta.env.VITE_PUBLIC_SITE_URL || 'https://tiqsey.com'
)
  .trim()
  .replace(/\/+$/, '');

export const ADMIN_SITE_URL = (
  import.meta.env.VITE_ADMIN_SITE_URL || 'https://admin.tiqsey.com'
)
  .trim()
  .replace(/\/+$/, '');

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '')
  .trim()
  .replace(/\/+$/, '');

const CONFIGURED_ADMIN_HOSTS = String(
  import.meta.env.VITE_ADMIN_HOSTS || 'admin.tiqsey.com,admin.localhost'
)
  .split(',')
  .map((h) => h.trim().toLowerCase())
  .filter(Boolean);

const PUBLIC_PRODUCTION_HOSTS = new Set(['tiqsey.com', 'www.tiqsey.com']);

export function isAdminHost(hostname?: string): boolean {
  const host = (
    hostname ?? (typeof window !== 'undefined' ? window.location.hostname : '')
  )
    .trim()
    .toLowerCase();
  if (!host) return false;
  return CONFIGURED_ADMIN_HOSTS.includes(host) || host.startsWith('admin.tiqsey.');
}

export function isPublicProductionHost(hostname?: string): boolean {
  const host = (
    hostname ?? (typeof window !== 'undefined' ? window.location.hostname : '')
  )
    .trim()
    .toLowerCase();
  if (!host) return false;
  return PUBLIC_PRODUCTION_HOSTS.has(host);
}

/**
 * True when running as the standalone admin deployment (VITE_APP_MODE=admin)
 * OR when accessed directly via the dedicated admin subdomain (admin.tiqsey.com).
 */
export function isDedicatedAdminContext(): boolean {
  if (APP_MODE === 'admin') return true;
  if (typeof window === 'undefined') return false;
  return isAdminHost(window.location.hostname);
}

/**
 * Returns the router basename for AdminApp:
 * - '/' on https://admin.tiqsey.com or standalone admin builds
 * - '/secure-panel' in local/preview dual mode
 */
export function getAdminBasePath(): string {
  return isDedicatedAdminContext() ? '/' : '/secure-panel';
}

/**
 * Builds an internal link to a route inside the Admin Panel that works
 * seamlessly both on https://admin.tiqsey.com/* and in local /secure-panel/* preview.
 */
export function buildAdminUrl(routePath: string): string {
  const normalized = routePath.startsWith('/') ? routePath : `/${routePath}`;
  const base = getAdminBasePath();
  if (base === '/') return normalized;
  return `${base}${normalized}`;
}

/**
 * Returns the URL to open the public customer storefront from inside the Admin Panel.
 * On admin.tiqsey.com or standalone admin builds, opens https://tiqsey.com.
 * In local dual-mode preview, opens '/'.
 */
export function getLiveSiteUrl(): string {
  if (isDedicatedAdminContext()) {
    return PUBLIC_SITE_URL;
  }
  return '/';
}

const PUBLIC_STOREFRONT_API_PREFIXES = [
  '/api/site/',
  '/api/bookings',
  '/api/reviews',
  '/api/inventory/',
  '/api/blogs',
  '/api/health',
];

/**
 * Resolves an API path (e.g. '/api/auth/login') against VITE_API_BASE_URL when configured.
 * When running on the static public storefront (https://tiqsey.com) without an explicit
 * VITE_API_BASE_URL, public read/booking endpoints automatically target ADMIN_SITE_URL
 * (https://admin.tiqsey.com) so live changes made in the Admin Panel reflect on tiqsey.com.
 */
export function resolveApiUrl(path: string): string {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (API_BASE_URL) {
    return `${API_BASE_URL}${normalizedPath}`;
  }
  const onPublicStorefront =
    APP_MODE === 'public' ||
    (typeof window !== 'undefined' && isPublicProductionHost(window.location.hostname));
  if (
    onPublicStorefront &&
    PUBLIC_STOREFRONT_API_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix))
  ) {
    return `${ADMIN_SITE_URL}${normalizedPath}`;
  }
  return normalizedPath;
}
