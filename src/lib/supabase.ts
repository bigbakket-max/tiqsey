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

const isValidSupabaseUrl = (value: string): boolean => {
  if (!value || value.includes('placeholder') || value.includes('your-project')) return false;
  try {
    const parsed = new URL(value);
    const isLocalDevelopment = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
    return (
      (parsed.protocol === 'https:' || (isLocalDevelopment && parsed.protocol === 'http:')) &&
      (isLocalDevelopment || parsed.hostname.endsWith('.supabase.co'))
    );
  } catch {
    return false;
  }
};

export const isSupabaseConfigured = Boolean(
  isValidSupabaseUrl(SUPABASE_URL) && SUPABASE_ANON_KEY
);

export const SUPABASE_PROJECT_ID = isSupabaseConfigured
  ? (new URL(SUPABASE_URL).hostname.split('.')[0] || '')
  : '';

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

export function getMediaCategory(mimeType?: string | null, fileName?: string | null): 'image' | 'video' | 'document' {
  const mime = (mimeType || '').toLowerCase();
  const name = (fileName || '').toLowerCase();
  if (mime.startsWith('video/') || /\.(mp4|webm|mov|m4v|ogg)$/.test(name)) return 'video';
  if (mime.startsWith('image/') || /\.(jpe?g|png|webp|avif|gif|svg|ico)$/.test(name)) return 'image';
  return 'document';
}

export async function uploadDataUrlToSupabaseStorage(
  _dataUrl: string,
  _filename = 'media',
  _folder?: string,
  _bucket?: SupabaseBucketId
): Promise<string | null> {
  // Browser-side writes using the public anon key are intentionally disabled.
  // Use the authenticated Tiqsey Node API (/api/upload) instead.
  return null;
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
  _file: File,
  _bucket: SupabaseBucketId,
  _folder?: string,
  _onProgress?: (percent: number) => void
): Promise<{ url?: string; path?: string; error?: string; convertedTo?: string }> {
  return { error: 'Direct browser uploads are disabled. Use the authenticated Tiqsey Node API.' };
}

export async function deleteSupabaseBucketFilesDirect(
  _bucket: SupabaseBucketId,
  _paths: string[]
): Promise<{ ok: boolean; error?: string; rlsBlocked?: boolean }> {
  return {
    ok: false,
    error: 'Direct browser deletion is disabled. Use the authenticated Tiqsey Node API.',
  };
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


