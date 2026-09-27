/**
 * Favicon Management Utility
 * Handles favicon fetching, validation, dynamic DOM application across browser tabs,
 * and persistence sync with backend database.
 */

export interface FaviconDimensions {
  width: number;
  height: number;
}

export interface FaviconConfig {
  url: string;
  appleTouchIconUrl?: string;
  format: 'png' | 'ico' | 'svg' | 'jpg' | 'jpeg' | 'webp';
  mimeType: string;
  fileName: string;
  fileSize: number;
  dimensions: FaviconDimensions;
  updatedAt: string;
  updatedBy: string;
  isDefault: boolean;
}

export const DEFAULT_FAVICON_CONFIG: FaviconConfig = {
  url: '/favicon.png',
  appleTouchIconUrl: '/favicon.png',
  format: 'png',
  mimeType: 'image/png',
  fileName: 'tiqsey-brand-favicon.png',
  fileSize: 43581,
  dimensions: { width: 512, height: 512 },
  updatedAt: '2026-09-27T07:30:10.000Z',
  updatedBy: 'system',
  isDefault: true,
};

export const FAVICON_STORAGE_KEY = 'tiqsey_active_favicon';
export const FAVICON_EVENT_NAME = 'tiqsey_favicon_updated';

// Supported MIME types and extensions
export const ALLOWED_FAVICON_FORMATS = ['png', 'ico', 'svg', 'jpg', 'jpeg', 'webp'] as const;
export const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/x-icon',
  'image/vnd.microsoft.icon',
  'image/svg+xml',
  'image/jpeg',
  'image/webp',
];

export const MAX_FAVICON_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Fetch current active favicon configuration from backend or fallback to cache/default
 */
export async function fetchActiveFavicon(): Promise<FaviconConfig> {
  try {
    const res = await fetch('/api/site/favicon', { cache: 'no-cache' });
    if (res.ok) {
      const data = await res.json();
      if (data && data.url) {
        localStorage.setItem(FAVICON_STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    console.warn('[Favicon] Failed to fetch favicon from backend API, checking localStorage:', err);
  }

  try {
    const cached = localStorage.getItem(FAVICON_STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (_) {}

  return DEFAULT_FAVICON_CONFIG;
}

/**
 * Dynamically apply favicon to DOM <head> tags without requiring a page refresh
 */
export function applyFaviconToDocument(config: FaviconConfig): void {
  if (typeof document === 'undefined') return;

  const timestamp = Date.now();
  // If config.url is relative, add cache buster query parameter to force browser tab refresh
  const urlWithCache = config.url.startsWith('data:') 
    ? config.url 
    : `${config.url}${config.url.includes('?') ? '&' : '?'}v=${timestamp}`;

  const appleTouchUrl = config.appleTouchIconUrl 
    ? (config.appleTouchIconUrl.startsWith('data:') ? config.appleTouchIconUrl : `${config.appleTouchIconUrl}${config.appleTouchIconUrl.includes('?') ? '&' : '?'}v=${timestamp}`)
    : urlWithCache;

  // 1. Standard icon links
  const iconSelectors = [
    'link[rel="icon"]',
    'link[rel="shortcut icon"]',
    'link[rel="alternate icon"]'
  ];

  let foundStandardIcon = false;
  iconSelectors.forEach(selector => {
    const elements = document.querySelectorAll<HTMLLinkElement>(selector);
    elements.forEach(el => {
      el.href = urlWithCache;
      if (config.mimeType) {
        el.type = config.mimeType;
      }
      foundStandardIcon = true;
    });
  });

  // If no standard link tag existed, create one
  if (!foundStandardIcon) {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = config.mimeType || 'image/png';
    link.href = urlWithCache;
    document.head.appendChild(link);
  }

  // 2. Apple Touch Icon links
  const appleTouchElements = document.querySelectorAll<HTMLLinkElement>('link[rel="apple-touch-icon"]');
  if (appleTouchElements.length > 0) {
    appleTouchElements.forEach(el => {
      el.href = appleTouchUrl;
    });
  } else {
    const appleLink = document.createElement('link');
    appleLink.rel = 'apple-touch-icon';
    appleLink.sizes = '180x180';
    appleLink.href = appleTouchUrl;
    document.head.appendChild(appleLink);
  }

  // Store in cache
  try {
    localStorage.setItem(FAVICON_STORAGE_KEY, JSON.stringify(config));
  } catch (_) {}

  // Dispatch custom event for reactive UI updates
  window.dispatchEvent(new CustomEvent(FAVICON_EVENT_NAME, { detail: config }));
}

/**
 * Validate an uploaded favicon file
 */
export async function validateFaviconFile(file: File): Promise<{
  valid: boolean;
  error?: string;
  warning?: string;
  format?: 'png' | 'ico' | 'svg' | 'jpg' | 'jpeg' | 'webp';
  mimeType?: string;
  dimensions?: FaviconDimensions;
  dataUrl?: string;
}> {
  // Check file size
  if (file.size > MAX_FAVICON_SIZE_BYTES) {
    return {
      valid: false,
      error: `File is too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Maximum allowed size is 5 MB.`
    };
  }

  // Check extension / MIME type
  const extension = file.name.split('.').pop()?.toLowerCase();
  let detectedFormat: 'png' | 'ico' | 'svg' | 'jpg' | 'jpeg' | 'webp' | undefined;

  if (extension === 'png') detectedFormat = 'png';
  else if (extension === 'ico') detectedFormat = 'ico';
  else if (extension === 'svg') detectedFormat = 'svg';
  else if (extension === 'jpg' || extension === 'jpeg') detectedFormat = 'jpeg';
  else if (extension === 'webp') detectedFormat = 'webp';

  const mime = file.type || '';
  const isMimeAllowed = ALLOWED_MIME_TYPES.some(m => mime.toLowerCase().includes(m)) || !!detectedFormat;

  if (!isMimeAllowed || !detectedFormat) {
    return {
      valid: false,
      error: `Unsupported file format ".${extension || 'unknown'}". Supported formats are PNG, ICO, SVG, JPG, and WebP.`
    };
  }

  // Read data URL and inspect dimensions
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        return resolve({ valid: false, error: 'Could not read file data.' });
      }

      // If SVG, dimensions can be parsed or rendered
      if (detectedFormat === 'svg') {
        const img = new Image();
        img.onload = () => {
          const width = img.naturalWidth || 512;
          const height = img.naturalHeight || 512;
          const warning = width !== height ? `Image is not 1:1 square (${width}×${height}px). Favicons display best when square.` : undefined;
          resolve({
            valid: true,
            format: detectedFormat,
            mimeType: 'image/svg+xml',
            dimensions: { width, height },
            dataUrl,
            warning
          });
        };
        img.onerror = () => {
          // SVGs may not have natural dimensions, default to 512x512
          resolve({
            valid: true,
            format: detectedFormat,
            mimeType: 'image/svg+xml',
            dimensions: { width: 512, height: 512 },
            dataUrl
          });
        };
        img.src = dataUrl;
        return;
      }

      // For raster images (PNG, ICO, JPG, WebP)
      const img = new Image();
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        if (width < 16 || height < 16) {
          return resolve({
            valid: false,
            error: `Image dimensions are too small (${width}×${height}px). Minimum size is 16×16 px.`
          });
        }

        const warning = width !== height 
          ? `Image is not 1:1 square (${width}×${height}px). Favicons look best with a 1:1 square aspect ratio.`
          : undefined;

        resolve({
          valid: true,
          format: detectedFormat,
          mimeType: file.type || `image/${detectedFormat}`,
          dimensions: { width, height },
          dataUrl,
          warning
        });
      };

      img.onerror = () => {
        resolve({
          valid: false,
          error: 'Failed to decode image. Please ensure this is a valid image file.'
        });
      };

      img.src = dataUrl;
    };

    reader.onerror = () => {
      resolve({ valid: false, error: 'Failed to read file from disk.' });
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Save / Replace Favicon to Backend CMS/Database
 */
export async function saveFaviconToBackend(payload: {
  dataUrl: string;
  format: string;
  fileName: string;
  fileSize: number;
  dimensions: FaviconDimensions;
  adminEmail: string;
}): Promise<FaviconConfig> {
  const res = await fetch('/api/admin/favicon', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-email': payload.adminEmail,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to save favicon (status ${res.status})`);
  }

  const result = await res.json();
  const config: FaviconConfig = result.favicon;
  applyFaviconToDocument(config);
  return config;
}

/**
 * Reset Favicon to original default Tiqsey brand favicon
 */
export async function resetFaviconToDefault(adminEmail: string): Promise<FaviconConfig> {
  const res = await fetch('/api/admin/favicon', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-email': adminEmail,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to reset favicon (status ${res.status})`);
  }

  const result = await res.json();
  const config: FaviconConfig = result.favicon || DEFAULT_FAVICON_CONFIG;
  applyFaviconToDocument(config);
  return config;
}
