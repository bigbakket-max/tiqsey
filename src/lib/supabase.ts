import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_PUBLIC_SUPABASE_URL = 'https://lzjjwsvalvfkgwtzuime.supabase.co';
const DEFAULT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_KxzN2RLPv5Q7nVqDRqPw-w_mi317li6';

export const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || DEFAULT_PUBLIC_SUPABASE_URL).trim();
export const SUPABASE_ANON_KEY = (
  import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
).trim();
export const SUPABASE_STORAGE_BUCKET = (import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'media').trim() || 'media';

export type SupabaseBucketId =
  | 'media'
  | 'admin-media'
  | 'blog'
  | 'attractions'
  | 'avatars'
  | 'cities'
  | 'attraction-photos';

export interface SupabaseBucketConfig {
  id: SupabaseBucketId;
  label: string;
  description: string;
  maxSizeBytes: number;
  maxSizeLabel: string;
  allowedMimeTypes: string[];
  public: boolean;
  defaultFolder: string;
}

export const SUPABASE_STORAGE_BUCKETS: Record<SupabaseBucketId, SupabaseBucketConfig> = {
  media: {
    id: 'media',
    label: 'Media',
    description: 'General media, favicons, brand assets, and promotional videos',
    maxSizeBytes: 50 * 1024 * 1024,
    maxSizeLabel: '50 MB',
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'image/gif',
      'image/svg+xml',
      'video/mp4',
      'video/webm',
      'application/pdf',
    ],
    public: true,
    defaultFolder: 'uploads',
  },
  'admin-media': {
    id: 'admin-media',
    label: 'Admin Media',
    description: 'Admin banners, hero slides, campaign media, and video uploads',
    maxSizeBytes: 50 * 1024 * 1024,
    maxSizeLabel: '50 MB',
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'image/gif',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'application/pdf',
    ],
    public: true,
    defaultFolder: 'banners',
  },
  blog: {
    id: 'blog',
    label: 'Blog',
    description: 'Blog post cover images and inline editorial photography',
    maxSizeBytes: 5 * 1024 * 1024,
    maxSizeLabel: '5 MB',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    public: true,
    defaultFolder: 'posts',
  },
  attractions: {
    id: 'attractions',
    label: 'Attractions',
    description: 'Primary attraction hero and cover imagery',
    maxSizeBytes: 5 * 1024 * 1024,
    maxSizeLabel: '5 MB',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    public: true,
    defaultFolder: 'covers',
  },
  avatars: {
    id: 'avatars',
    label: 'Avatars',
    description: 'User and author profile pictures',
    maxSizeBytes: 2 * 1024 * 1024,
    maxSizeLabel: '2 MB',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    public: true,
    defaultFolder: 'profiles',
  },
  cities: {
    id: 'cities',
    label: 'Cities',
    description: 'Destination and city hero cards',
    maxSizeBytes: 5 * 1024 * 1024,
    maxSizeLabel: '5 MB',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    public: true,
    defaultFolder: 'destinations',
  },
  'attraction-photos': {
    id: 'attraction-photos',
    label: 'Attraction Photos',
    description: 'Activity gallery photos and additional experience media',
    maxSizeBytes: 5 * 1024 * 1024,
    maxSizeLabel: '5 MB',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    public: true,
    defaultFolder: 'gallery',
  },
};

export const SUPABASE_STORAGE_BUCKET_LIST: SupabaseBucketConfig[] = Object.values(SUPABASE_STORAGE_BUCKETS);

export function isValidSupabaseBucket(value: string): value is SupabaseBucketId {
  return Object.prototype.hasOwnProperty.call(SUPABASE_STORAGE_BUCKETS, value);
}

export function getBucketConfig(bucket?: string): SupabaseBucketConfig {
  if (bucket && isValidSupabaseBucket(bucket)) {
    return SUPABASE_STORAGE_BUCKETS[bucket];
  }
  if (isValidSupabaseBucket(SUPABASE_STORAGE_BUCKET)) {
    return SUPABASE_STORAGE_BUCKETS[SUPABASE_STORAGE_BUCKET];
  }
  return SUPABASE_STORAGE_BUCKETS.media;
}

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes('placeholder') &&
  !SUPABASE_URL.includes('your-project') &&
  /^https?:\/\//i.test(SUPABASE_URL)
);

export const SUPABASE_PROJECT_ID = isSupabaseConfigured
  ? (SUPABASE_URL.match(/https?:\/\/([^.]+)\./)?.[1] || '')
  : '';

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
  'application/pdf': 'pdf',
};

export function getMediaCategory(mimeType?: string | null, fileName?: string | null): 'image' | 'video' | 'document' {
  const mime = (mimeType || '').toLowerCase();
  const name = (fileName || '').toLowerCase();
  if (mime.startsWith('video/') || /\.(mp4|webm|mov|m4v|ogg)$/.test(name)) return 'video';
  if (mime.startsWith('image/') || /\.(jpe?g|png|webp|avif|gif|svg|ico)$/.test(name)) return 'image';
  return 'document';
}

export async function uploadDataUrlToSupabaseStorage(
  dataUrl: string,
  filename = 'media',
  folder?: string,
  bucket?: SupabaseBucketId
): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const match = dataUrl.match(/^data:((?:image|video|application)\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (!match) return null;

  let mime = match[1].toLowerCase();
  if (mime === 'image/jpg') mime = 'image/jpeg';
  const base64 = match[2];
  const ext = MIME_TO_EXT[mime] || 'jpg';

  const bucketConfig = getBucketConfig(bucket);
  let targetBucket: SupabaseBucketId = bucketConfig.id;

  // Route to a compatible bucket if the MIME type is unsupported in the requested bucket
  if (!bucketConfig.allowedMimeTypes.includes(mime)) {
    const compatible = SUPABASE_STORAGE_BUCKET_LIST.find((b) => b.allowedMimeTypes.includes(mime));
    if (!compatible) return null;
    targetBucket = compatible.id;
  }

  try {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const activeConfig = SUPABASE_STORAGE_BUCKETS[targetBucket];
    if (bytes.length > activeConfig.maxSizeBytes) {
      console.warn(`[Supabase Storage Client Upload Warning]: File exceeds ${activeConfig.maxSizeLabel} limit for bucket "${targetBucket}"`);
      return null;
    }

    const blob = new Blob([bytes], { type: mime });
    const safeBase = filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30) || 'media';
    const cleanFolder = (folder || activeConfig.defaultFolder).replace(/^\/+|\/+$/g, '') || 'uploads';
    const objectPath = `${cleanFolder}/${safeBase}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

    const { error } = await supabase.storage
      .from(targetBucket)
      .upload(objectPath, blob, {
        contentType: mime,
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.warn(`[Supabase Storage Client Upload Warning] (${targetBucket}):`, error.message);
      return null;
    }

    const { data } = supabase.storage.from(targetBucket).getPublicUrl(objectPath);
    return data?.publicUrl || null;
  } catch (err: any) {
    console.warn('[Supabase Storage Client Upload Error]:', err?.message || err);
    return null;
  }
}

export interface DirectStoredFileItem {
  name: string;
  path: string;
  bucket: SupabaseBucketId;
  publicUrl: string;
  size: number;
  mimeType: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export async function listSupabaseBucketFilesDirect(
  bucket: SupabaseBucketId,
  prefix = '',
  depth = 0
): Promise<{ files: DirectStoredFileItem[]; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { files: [], error: 'Supabase is not configured in browser environment (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).' };
  }

  try {
    const { data, error } = await supabase.storage.from(bucket).list(prefix, {
      limit: 100,
      sortBy: { column: 'updated_at', order: 'desc' },
    });

    if (error) {
      return { files: [], error: error.message };
    }
    if (!Array.isArray(data)) {
      return { files: [] };
    }

    const results: DirectStoredFileItem[] = [];
    for (const item of data) {
      if (!item?.name || item.name === '.emptyFolderPlaceholder') continue;
      const fullPath = prefix ? `${prefix}/${item.name}` : item.name;
      const isFolder = item.id === null || item.metadata === null;
      if (isFolder) {
        if (depth < 4) {
          const nested = await listSupabaseBucketFilesDirect(bucket, fullPath, depth + 1);
          results.push(...nested.files);
        }
      } else {
        const { data: pub } = supabase.storage.from(bucket).getPublicUrl(fullPath);
        results.push({
          name: item.name,
          path: fullPath,
          bucket,
          publicUrl: pub?.publicUrl || '',
          size: Number(item.metadata?.size ?? 0),
          mimeType: String(item.metadata?.mimetype || ''),
          createdAt: item.created_at || null,
          updatedAt: item.updated_at || item.created_at || null,
        });
      }
    }

    return { files: results };
  } catch (err: any) {
    return { files: [], error: err?.message || 'Failed to list files from Supabase Storage' };
  }
}

async function convertImageFileToWebpBlob(
  file: File
): Promise<{ blob: Blob; mime: 'image/webp' | 'image/png'; ext: 'webp' | 'png' } | null> {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null;
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Unable to decode image'));
      el.src = objectUrl;
    });
    const width = img.naturalWidth || img.width;
    const height = img.naturalHeight || img.height;
    if (!width || !height) return null;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, width, height);

    const webpBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/webp', 0.92)
    );
    if (webpBlob && webpBlob.type === 'image/webp') {
      return { blob: webpBlob, mime: 'image/webp', ext: 'webp' };
    }
    const pngBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/png')
    );
    if (pngBlob) {
      return { blob: pngBlob, mime: 'image/png', ext: 'png' };
    }
    return null;
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function uploadBlobDirectWithProgress(
  bucket: SupabaseBucketId,
  objectPath: string,
  payload: Blob | File,
  contentType: string,
  onProgress?: (percent: number) => void
): Promise<{ ok: boolean; error?: string }> {
  return new Promise((resolve) => {
    try {
      const encodedPath = objectPath
        .split('/')
        .map((segment) => encodeURIComponent(segment))
        .join('/');
      const endpoint = `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/${encodeURIComponent(bucket)}/${encodedPath}`;
      const xhr = new XMLHttpRequest();
      xhr.open('POST', endpoint, true);
      xhr.setRequestHeader('apikey', SUPABASE_ANON_KEY);
      xhr.setRequestHeader('Authorization', `Bearer ${SUPABASE_ANON_KEY}`);
      xhr.setRequestHeader('x-upsert', 'true');
      xhr.setRequestHeader('cache-control', '3600');
      if (contentType) {
        xhr.setRequestHeader('Content-Type', contentType);
      }

      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable && ev.total > 0) {
          const pct = Math.min(95, Math.max(8, Math.round((ev.loaded / ev.total) * 90) + 5));
          onProgress?.(pct);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          onProgress?.(98);
          resolve({ ok: true });
        } else {
          let errMsg = `Upload failed (HTTP ${xhr.status})`;
          try {
            const parsed = JSON.parse(xhr.responseText);
            errMsg = parsed?.message || parsed?.error || errMsg;
          } catch {
            // Keep default HTTP status message
          }
          resolve({ ok: false, error: errMsg });
        }
      };

      xhr.onerror = () => resolve({ ok: false, error: 'Network error while uploading to Supabase Storage.' });
      xhr.ontimeout = () => resolve({ ok: false, error: 'Upload timed out. Please retry.' });
      xhr.timeout = 180000;
      xhr.send(payload);
    } catch (err: any) {
      resolve({ ok: false, error: err?.message || 'Direct upload initialization failed' });
    }
  });
}

export async function uploadFileToSupabaseStorageDirect(
  file: File,
  bucket: SupabaseBucketId,
  folder?: string,
  onProgress?: (percent: number) => void
): Promise<{ url?: string; path?: string; error?: string; convertedTo?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { error: 'Supabase is not configured in browser environment (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).' };
  }

  const bucketConfig = getBucketConfig(bucket);
  const EXT_TO_MIME: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    avif: 'image/avif',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    mp4: 'video/mp4',
    webm: 'video/webm',
    mov: 'video/quicktime',
    pdf: 'application/pdf',
  };
  const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
  const rawMime = (file.type || EXT_TO_MIME[fileExt] || '').toLowerCase();
  const normalizedMime = rawMime === 'image/jpg' ? 'image/jpeg' : rawMime;

  if (!bucketConfig.allowedMimeTypes.includes(normalizedMime)) {
    return {
      error: `Type "${normalizedMime || 'unknown'}" is not allowed in "${bucket}". Allowed: ${bucketConfig.allowedMimeTypes.join(', ')}`,
    };
  }
  if (file.size > bucketConfig.maxSizeBytes) {
    return {
      error: `File exceeds the ${bucketConfig.maxSizeLabel} size limit for "${bucket}".`,
    };
  }

  const ext = MIME_TO_EXT[normalizedMime] || file.name.split('.').pop()?.toLowerCase() || 'bin';
  const safeBase = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 35) || 'file';
  const cleanFolder = (folder || bucketConfig.defaultFolder).replace(/^\/+|\/+$/g, '') || 'uploads';
  const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const objectPath = `${cleanFolder}/${safeBase}-${uniqueSuffix}.${ext}`;

  try {
    onProgress?.(8);
    const xhrResult = await uploadBlobDirectWithProgress(bucket, objectPath, file, normalizedMime, onProgress);

    if (!xhrResult.ok) {
      const errMsg = xhrResult.error || '';
      // If Supabase bucket rejects a modern image MIME (e.g. image/avif), auto-convert to WebP and retry
      const isMimeRejected = /mime type .* is not supported/i.test(errMsg);
      if (isMimeRejected && normalizedMime.startsWith('image/') && normalizedMime !== 'image/webp') {
        const converted = await convertImageFileToWebpBlob(file);
        if (converted && converted.blob.size <= bucketConfig.maxSizeBytes) {
          const fallbackPath = `${cleanFolder}/${safeBase}-${uniqueSuffix}.${converted.ext}`;
          const retryXhr = await uploadBlobDirectWithProgress(
            bucket,
            fallbackPath,
            converted.blob,
            converted.mime,
            onProgress
          );
          if (retryXhr.ok) {
            const { data } = supabase.storage.from(bucket).getPublicUrl(fallbackPath);
            return {
              url: data?.publicUrl || '',
              path: fallbackPath,
              convertedTo: converted.mime,
            };
          }
          return { error: retryXhr.error || 'Converted WebP upload failed.' };
        }
      }
      return { error: errMsg || 'Direct Supabase upload failed' };
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
    return { url: data?.publicUrl || '', path: objectPath };
  } catch (err: any) {
    return { error: err?.message || 'Direct Supabase upload failed' };
  }
}

export async function deleteSupabaseBucketFilesDirect(
  bucket: SupabaseBucketId,
  paths: string[]
): Promise<{ ok: boolean; error?: string; rlsBlocked?: boolean }> {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, error: 'Supabase is not configured in browser environment.' };
  }
  try {
    const { data, error } = await supabase.storage.from(bucket).remove(paths);
    if (error) {
      const rlsBlocked = /row-level security|policy|permission|unauthorized|forbidden/i.test(error.message || '');
      return { ok: false, error: error.message, rlsBlocked };
    }
    if (!Array.isArray(data) || data.length === 0) {
      // Confirm whether the file actually still exists in Supabase Storage (vs already removed)
      const firstPath = paths[0];
      if (firstPath) {
        try {
          const { data: pub } = supabase.storage.from(bucket).getPublicUrl(firstPath);
          if (pub?.publicUrl) {
            const check = await fetch(`${pub.publicUrl}?t=${Date.now()}`, { method: 'HEAD', cache: 'no-store' });
            if (check.status === 400 || check.status === 404) {
              return { ok: true };
            }
          }
        } catch {
          // Proceed to RLS message if probe fails
        }
      }
      return {
        ok: false,
        rlsBlocked: true,
        error: `Delete blocked by Supabase row-level security policy on "${bucket}".`,
      };
    }
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to delete file from Supabase Storage' };
  }
}

export interface SupabaseStorageConnectionReport {
  connected: boolean;
  projectId: string | null;
  storageEndpoint: string | null;
  dashboardUrl: string | null;
  latencyMs: number;
  verifiedBuckets: number;
  totalBuckets: number;
  missingBuckets: SupabaseBucketId[];
  checkedAt: string;
  error?: string;
}

export async function testSupabaseStorageConnectionDirect(): Promise<SupabaseStorageConnectionReport> {
  const startedAt = Date.now();
  const projectId = SUPABASE_PROJECT_ID || null;
  const storageEndpoint = projectId ? `https://${projectId}.supabase.co/storage/v1` : null;
  const dashboardUrl = projectId
    ? `https://supabase.com/dashboard/project/${projectId}/storage/files`
    : null;

  if (!isSupabaseConfigured || !supabase) {
    return {
      connected: false,
      projectId,
      storageEndpoint,
      dashboardUrl,
      latencyMs: Date.now() - startedAt,
      verifiedBuckets: 0,
      totalBuckets: SUPABASE_STORAGE_BUCKET_LIST.length,
      missingBuckets: SUPABASE_STORAGE_BUCKET_LIST.map((b) => b.id),
      checkedAt: new Date().toISOString(),
      error: 'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not configured.',
    };
  }

  const probes = await Promise.all(
    SUPABASE_STORAGE_BUCKET_LIST.map(async (b) => {
      try {
        const { error } = await supabase.storage.from(b.id).list('', { limit: 1 });
        return { id: b.id, ok: !error, error: error?.message };
      } catch (err: any) {
        return { id: b.id, ok: false, error: err?.message || 'Probe failed' };
      }
    })
  );

  const missingBuckets = probes.filter((p) => !p.ok).map((p) => p.id);
  const verifiedBuckets = probes.length - missingBuckets.length;
  const firstError = probes.find((p) => !p.ok)?.error;

  return {
    connected: verifiedBuckets > 0,
    projectId,
    storageEndpoint,
    dashboardUrl,
    latencyMs: Date.now() - startedAt,
    verifiedBuckets,
    totalBuckets: SUPABASE_STORAGE_BUCKET_LIST.length,
    missingBuckets,
    checkedAt: new Date().toISOString(),
    error: verifiedBuckets === 0 ? firstError || 'Unable to reach Supabase Storage buckets.' : undefined,
  };
}


