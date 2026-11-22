import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').trim();
export const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();
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
      'image/gif',
      'image/svg+xml',
      'video/mp4',
      'video/webm',
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
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
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
};

export async function uploadDataUrlToSupabaseStorage(
  dataUrl: string,
  filename = 'media',
  folder?: string,
  bucket?: SupabaseBucketId
): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const match = dataUrl.match(/^data:((?:image|video)\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
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

export async function uploadFileToSupabaseStorageDirect(
  file: File,
  bucket: SupabaseBucketId,
  folder?: string
): Promise<{ url?: string; path?: string; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { error: 'Supabase is not configured in browser environment (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).' };
  }

  const bucketConfig = getBucketConfig(bucket);
  const normalizedMime = (file.type || '').toLowerCase() === 'image/jpg' ? 'image/jpeg' : (file.type || '').toLowerCase();

  if (!bucketConfig.allowedMimeTypes.includes(normalizedMime)) {
    return {
      error: `Type "${file.type || 'unknown'}" is not allowed in "${bucket}". Allowed: ${bucketConfig.allowedMimeTypes.join(', ')}`,
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
  const objectPath = `${cleanFolder}/${safeBase}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

  try {
    const { error } = await supabase.storage.from(bucket).upload(objectPath, file, {
      contentType: normalizedMime,
      cacheControl: '3600',
      upsert: true,
    });
    if (error) {
      return { error: error.message };
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
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, error: 'Supabase is not configured in browser environment.' };
  }
  try {
    const { error } = await supabase.storage.from(bucket).remove(paths);
    if (error) return { ok: false, error: error.message };
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


