import type { MediaAssetItem, MediaFolderItem, MediaUsageRef } from '../types';
import {
  SUPABASE_STORAGE_BUCKET_LIST,
  SUPABASE_PROJECT_ID,
  SAFE_STORAGE_MIME_TYPES,
  isSupabaseConfigured,
  supabase,
  getBucketConfig,
  getMediaCategory,
  getStoredCustomBuckets,
  saveStoredCustomBucket,
  buildCustomBucketConfig,
  normalizeBucketName,
  isValidBucketName,
  listSupabaseBucketsDirect,
  listSupabaseBucketFilesDirect,
  uploadFileToSupabaseStorageDirect,
  deleteSupabaseBucketFilesDirect,
  testSupabaseStorageConnectionDirect,
  createSupabaseBucketDirect,
  verifySupabaseBucketDirect,
  buildCreateBucketSql,
  type SupabaseBucketId,
  type SupabaseStorageConnectionReport,
} from '../lib/supabase';
import { fetchJsonSafely } from './safeFetch';

export interface LiveBucketSummary {
  id: SupabaseBucketId;
  label: string;
  description: string;
  public: boolean;
  fileSizeLimit: number;
  maxSizeLabel: string;
  allowedMimeTypes: string[];
  defaultFolder: string;
  existsInSupabase: boolean;
  fileCount: number;
  folderCount: number;
  totalSize: number;
  isCustom?: boolean;
}

export interface MediaLibraryResponse {
  connected: boolean;
  mode: 'server' | 'supabase-direct' | 'offline';
  projectId: string | null;
  storageEndpoint: string | null;
  dashboardUrl: string | null;
  supabaseMediaTableSynced: boolean;
  latencyMs: number;
  summary: {
    totalImages: number;
    totalVideos: number;
    totalDocuments: number;
    totalFolders: number;
    totalFiles: number;
    totalBytes: number;
    quotaBytes: number;
  };
  buckets: LiveBucketSummary[];
  folders: MediaFolderItem[];
  files: MediaAssetItem[];
  error?: string;
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  matchType: 'hash' | 'name' | null;
  existing: MediaAssetItem | null;
}

export interface ChunkedUploadParams {
  file: File;
  bucket: SupabaseBucketId;
  folder?: string;
  adminEmail: string;
  sha256Hash?: string;
  replaceOldPath?: string;
  replaceOldUrl?: string;
  onProgress?: (percent: number, stage: 'hashing' | 'uploading' | 'verifying' | 'done') => void;
}

export interface ChunkedUploadResult {
  asset: MediaAssetItem;
  verified: boolean;
  oldUrl?: string | null;
  updatedReferences: MediaUsageRef[];
}

export function getStoredAdminEmail(): string {
  if (typeof window === 'undefined') return 'admin@tiqsey.com';
  try {
    const raw =
      localStorage.getItem('tiqsey_current_user') ||
      sessionStorage.getItem('tiqsey_current_user');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.email && typeof parsed.email === 'string') {
        return parsed.email;
      }
    }
  } catch {
    // Ignore storage read errors
  }
  return 'admin@tiqsey.com';
}

export function formatStorageBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export async function computeFileSha256(file: File): Promise<string | undefined> {
  try {
    if (typeof crypto === 'undefined' || !crypto.subtle) return undefined;
    const buffer = await file.arrayBuffer();
    const digest = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } catch {
    return undefined;
  }
}

function getEffectiveMimeType(file: File): string {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const extMap: Record<string, string> = {
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
  const raw = (file.type || extMap[ext] || '').toLowerCase();
  return raw === 'image/jpg' ? 'image/jpeg' : raw;
}

/**
 * Fetches the unified Tiqsey Media Library from the authenticated server API,
 * automatically falling back to direct Supabase Storage queries on static hosting.
 */
export async function fetchMediaLibrary(
  adminEmail: string,
  bucket: SupabaseBucketId | 'all' = 'all'
): Promise<MediaLibraryResponse> {
  const startedAt = Date.now();
  const query = bucket === 'all' ? '?bucket=all' : `?bucket=${encodeURIComponent(bucket)}`;

  const res = await fetchJsonSafely<any>(`/api/admin/storage/library${query}`, {
    credentials: 'include',
    headers: { 'x-admin-email': adminEmail },
  });

  if (res.isJson && res.ok && res.data) {
    return {
      connected: Boolean(res.data.connected),
      mode: res.data.connected ? 'server' : 'offline',
      projectId: res.data.projectId || SUPABASE_PROJECT_ID || null,
      storageEndpoint: res.data.storageEndpoint || null,
      dashboardUrl: res.data.dashboardUrl || null,
      supabaseMediaTableSynced: Boolean(res.data.supabaseMediaTableSynced),
      latencyMs: Number(res.data.latencyMs || Date.now() - startedAt),
      summary: res.data.summary || {
        totalImages: 0,
        totalVideos: 0,
        totalDocuments: 0,
        totalFolders: 0,
        totalFiles: 0,
        totalBytes: 0,
        quotaBytes: 1024 * 1024 * 1024,
      },
      buckets: Array.isArray(res.data.buckets) ? res.data.buckets : [],
      folders: Array.isArray(res.data.folders) ? res.data.folders : [],
      files: Array.isArray(res.data.files) ? res.data.files : [],
      error: res.data.error,
    };
  }

  // Fallback for static deployments without Node backend
  if (isSupabaseConfigured) {
    const allFiles: MediaAssetItem[] = [];
    const folderMap = new Map<string, MediaFolderItem>();
    const discoveredBuckets = await listSupabaseBucketsDirect();

    const bucketSummaries = await Promise.all(
      discoveredBuckets.map(async (b) => {
        const listed = await listSupabaseBucketFilesDirect(b.id);
        let totalSize = 0;
        for (const f of listed.files) {
          if (f.name === '.folder_placeholder.png') continue;
          const slashIdx = f.path.lastIndexOf('/');
          const folder = slashIdx === -1 ? '' : f.path.slice(0, slashIdx);
          const item: MediaAssetItem = {
            id: `direct-${b.id}-${f.path}`,
            bucket: b.id,
            path: f.path,
            folder,
            name: f.name,
            publicUrl: f.publicUrl,
            mimeType: f.mimeType || 'application/octet-stream',
            mediaType: getMediaCategory(f.mimeType, f.name),
            size: f.size,
            createdAt: f.createdAt,
            updatedAt: f.updatedAt,
          };
          allFiles.push(item);
          totalSize += f.size;

          if (folder) {
            const parts = folder.split('/');
            let acc = '';
            for (const part of parts) {
              acc = acc ? `${acc}/${part}` : part;
              const fKey = `${b.id}:${acc}`;
              const existing = folderMap.get(fKey);
              if (existing) {
                existing.fileCount += 1;
              } else {
                const pIdx = acc.lastIndexOf('/');
                folderMap.set(fKey, {
                  bucket: b.id,
                  path: acc,
                  name: part,
                  parentFolder: pIdx === -1 ? '' : acc.slice(0, pIdx),
                  fileCount: 1,
                  createdAt: f.createdAt,
                });
              }
            }
          }
        }

        const bucketFolders = Array.from(folderMap.values()).filter((fld) => fld.bucket === b.id).length;
        return {
          ...b,
          fileSizeLimit: b.maxSizeBytes,
          existsInSupabase: !listed.error,
          fileCount: listed.files.filter((x) => x.name !== '.folder_placeholder.png').length,
          folderCount: bucketFolders,
          totalSize,
        };
      })
    );

    const allFolders = Array.from(folderMap.values()).sort((a, b) => a.path.localeCompare(b.path));
    const scopedFiles = bucket === 'all' ? allFiles : allFiles.filter((f) => f.bucket === bucket);
    const scopedFolders = bucket === 'all' ? allFolders : allFolders.filter((f) => f.bucket === bucket);
    const connected = bucketSummaries.some((b) => b.existsInSupabase);

    return {
      connected,
      mode: connected ? 'supabase-direct' : 'offline',
      projectId: SUPABASE_PROJECT_ID || null,
      storageEndpoint: SUPABASE_PROJECT_ID ? `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1` : null,
      dashboardUrl: SUPABASE_PROJECT_ID
        ? `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/storage/files`
        : null,
      supabaseMediaTableSynced: false,
      latencyMs: Date.now() - startedAt,
      summary: {
        totalImages: allFiles.filter((f) => f.mediaType === 'image').length,
        totalVideos: allFiles.filter((f) => f.mediaType === 'video').length,
        totalDocuments: allFiles.filter((f) => f.mediaType === 'document').length,
        totalFolders: allFolders.length,
        totalFiles: allFiles.length,
        totalBytes: allFiles.reduce((s, f) => s + f.size, 0),
        quotaBytes: 1024 * 1024 * 1024,
      },
      buckets: bucketSummaries,
      folders: scopedFolders,
      files: scopedFiles,
      error: connected ? undefined : 'Unable to reach Supabase Storage.',
    };
  }

  return {
    connected: false,
    mode: 'offline',
    projectId: null,
    storageEndpoint: null,
    dashboardUrl: null,
    supabaseMediaTableSynced: false,
    latencyMs: Date.now() - startedAt,
    summary: {
      totalImages: 0,
      totalVideos: 0,
      totalDocuments: 0,
      totalFolders: 0,
      totalFiles: 0,
      totalBytes: 0,
      quotaBytes: 1024 * 1024 * 1024,
    },
    buckets: [...SUPABASE_STORAGE_BUCKET_LIST, ...getStoredCustomBuckets()].map((b) => ({
      ...b,
      fileSizeLimit: b.maxSizeBytes,
      existsInSupabase: false,
      fileCount: 0,
      folderCount: 0,
      totalSize: 0,
    })),
    folders: [],
    files: [],
    error: res.data?.error || 'Supabase Storage server is unavailable.',
  };
}

export interface CreateStorageBucketParams {
  id: string;
  public?: boolean;
  fileSizeLimit?: number;
  allowedMimeTypes?: string[];
  description?: string;
}

export interface CreateStorageBucketResult {
  ok: boolean;
  bucket?: LiveBucketSummary;
  error?: string;
  rlsBlocked?: boolean;
  alreadyExists?: boolean;
  sqlFix?: string;
}

/**
 * Creates a new Supabase Storage bucket via the authenticated Node server API,
 * automatically falling back to direct browser -> Supabase Storage creation on static hosting.
 */
export async function createStorageBucket(
  adminEmail: string,
  params: CreateStorageBucketParams
): Promise<CreateStorageBucketResult> {
  const safeId = normalizeBucketName(params.id);
  if (!isValidBucketName(safeId)) {
    return {
      ok: false,
      error: 'Bucket name must be 2–63 characters using lowercase letters, numbers, and hyphens only.',
    };
  }

  const isPublic = params.public !== false;
  const fileSizeLimit = Math.min(
    50 * 1024 * 1024,
    Math.max(1024 * 1024, Number(params.fileSizeLimit || 50 * 1024 * 1024))
  );
  const allowedMimeTypes =
    Array.isArray(params.allowedMimeTypes) && params.allowedMimeTypes.length > 0
      ? params.allowedMimeTypes.filter((m) => SAFE_STORAGE_MIME_TYPES.includes(m))
      : [...SAFE_STORAGE_MIME_TYPES];

  const sqlFix = buildCreateBucketSql({
    id: safeId,
    public: isPublic,
    fileSizeLimit,
    allowedMimeTypes,
  });

  const res = await fetchJsonSafely<{
    success?: boolean;
    bucket?: LiveBucketSummary;
    error?: string;
    rlsBlocked?: boolean;
    alreadyExists?: boolean;
  }>('/api/admin/storage/buckets', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-email': adminEmail,
    },
    body: JSON.stringify({
      id: safeId,
      public: isPublic,
      fileSizeLimit,
      allowedMimeTypes,
    }),
  });

  if (res.isJson) {
    if (res.ok && res.data?.bucket) {
      const cfg = buildCustomBucketConfig(safeId, {
        public: res.data.bucket.public,
        maxSizeBytes: res.data.bucket.fileSizeLimit,
        allowedMimeTypes: res.data.bucket.allowedMimeTypes,
        description: params.description,
      });
      saveStoredCustomBucket(cfg);
      return { ok: true, bucket: res.data.bucket };
    }
    if (res.data?.rlsBlocked) {
      return {
        ok: false,
        rlsBlocked: true,
        error: res.data.error || 'Supabase Storage blocked bucket creation due to RLS policy.',
        sqlFix,
      };
    }
    return {
      ok: false,
      alreadyExists: Boolean(res.data?.alreadyExists),
      error: res.data?.error || 'Failed to create storage bucket.',
      sqlFix: res.status === 403 ? sqlFix : undefined,
    };
  }

  // Fallback for static hosting (Direct Browser -> Supabase)
  const direct = await createSupabaseBucketDirect({
    id: safeId,
    public: isPublic,
    fileSizeLimit,
    allowedMimeTypes,
    description: params.description,
  });

  if (direct.ok && direct.bucket) {
    return {
      ok: true,
      bucket: {
        ...direct.bucket,
        fileSizeLimit: direct.bucket.maxSizeBytes,
        existsInSupabase: true,
        fileCount: 0,
        folderCount: 0,
        totalSize: 0,
      },
    };
  }

  return {
    ok: false,
    error: direct.error || 'Failed to create bucket in Supabase Storage.',
    rlsBlocked: direct.rlsBlocked,
    alreadyExists: direct.alreadyExists,
    sqlFix: direct.sqlFix || sqlFix,
  };
}

/**
 * Verifies that a custom bucket exists in Supabase Storage (e.g., after running SQL or creating in Supabase Dashboard)
 * and registers it in the Admin Panel so it can be browsed and uploaded to immediately.
 */
export async function verifyAndRegisterCustomBucket(
  adminEmail: string,
  params: CreateStorageBucketParams
): Promise<CreateStorageBucketResult> {
  const safeId = normalizeBucketName(params.id);
  if (!isValidBucketName(safeId)) {
    return { ok: false, error: 'Invalid bucket name.' };
  }

  const config = buildCustomBucketConfig(safeId, {
    public: params.public !== false,
    maxSizeBytes: params.fileSizeLimit || 50 * 1024 * 1024,
    allowedMimeTypes: params.allowedMimeTypes,
    description: params.description,
  });

  // Try verifying via Node server first
  const serverRes = await fetchJsonSafely<{ buckets?: LiveBucketSummary[] }>('/api/admin/storage/buckets', {
    credentials: 'include',
    headers: { 'x-admin-email': adminEmail },
  });
  if (serverRes.isJson && serverRes.ok && Array.isArray(serverRes.data?.buckets)) {
    const found = serverRes.data.buckets.find((b) => b.id === safeId && b.existsInSupabase);
    if (found) {
      saveStoredCustomBucket(config);
      return { ok: true, bucket: found };
    }
  }

  // Verify directly via Supabase browser client
  const probe = await verifySupabaseBucketDirect(safeId);
  if (!probe.exists) {
    return {
      ok: false,
      error:
        probe.error ||
        `Bucket "${safeId}" was not found yet in Supabase Storage. Make sure you clicked Run in the Supabase SQL Editor first.`,
    };
  }

  saveStoredCustomBucket(config);
  return {
    ok: true,
    bucket: {
      ...config,
      fileSizeLimit: config.maxSizeBytes,
      existsInSupabase: true,
      fileCount: 0,
      folderCount: 0,
      totalSize: 0,
    },
  };
}

export async function testStorageConnection(
  adminEmail: string
): Promise<SupabaseStorageConnectionReport> {
  const res = await fetchJsonSafely<SupabaseStorageConnectionReport>('/api/admin/storage/test-connection', {
    method: 'POST',
    credentials: 'include',
    headers: { 'x-admin-email': adminEmail },
  });
  if (res.isJson && res.data) {
    return res.data;
  }
  return testSupabaseStorageConnectionDirect();
}

export async function checkDuplicateMedia(
  adminEmail: string,
  params: { bucket: SupabaseBucketId; filename: string; sha256Hash?: string; folder?: string }
): Promise<DuplicateCheckResult> {
  const res = await fetchJsonSafely<DuplicateCheckResult>('/api/admin/storage/check-duplicate', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-email': adminEmail,
    },
    body: JSON.stringify(params),
  });
  if (res.isJson && res.ok && res.data) {
    return res.data;
  }
  return { isDuplicate: false, matchType: null, existing: null };
}

function uploadChunkWithXhr(
  url: string,
  chunkBlob: Blob,
  chunkIndex: number,
  adminEmail: string,
  onChunkProgress: (loaded: number, total: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    xhr.setRequestHeader('x-chunk-index', String(chunkIndex));
    xhr.setRequestHeader('x-admin-email', adminEmail);

    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) {
        onChunkProgress(ev.loaded, ev.total);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        try {
          const parsed = JSON.parse(xhr.responseText);
          reject(new Error(parsed?.error || `Chunk ${chunkIndex + 1} failed (${xhr.status})`));
        } catch {
          reject(new Error(`Chunk ${chunkIndex + 1} failed (HTTP ${xhr.status})`));
        }
      }
    };

    xhr.onerror = () => reject(new Error('Network error while uploading chunk'));
    xhr.ontimeout = () => reject(new Error('Upload timed out. Please retry.'));
    xhr.timeout = 120000;
    xhr.send(chunkBlob);
  });
}

/**
 * Reliable chunked/resumable media upload with real-time progress (0–100%),
 * automatic per-chunk retry, post-upload verification, and linked-reference replacement.
 */
export async function uploadMediaChunked(params: ChunkedUploadParams): Promise<ChunkedUploadResult> {
  const { file, bucket, folder, adminEmail, replaceOldPath, replaceOldUrl, onProgress } = params;
  const spec = getBucketConfig(bucket);
  const mimeType = getEffectiveMimeType(file);

  if (!spec.allowedMimeTypes.includes(mimeType)) {
    throw new Error(
      `Unsupported file type "${mimeType || 'unknown'}" for "${bucket}". Allowed: ${spec.allowedMimeTypes.join(', ')}`
    );
  }
  if (file.size <= 0 || file.size > spec.maxSizeBytes) {
    throw new Error(`"${file.name}" exceeds the ${spec.maxSizeLabel} size limit for "${bucket}".`);
  }

  onProgress?.(3, 'hashing');
  const sha256Hash = params.sha256Hash || (await computeFileSha256(file));

  const CHUNK_SIZE = 2 * 1024 * 1024; // 2 MB chunks for reliable video & multi-file transfers
  const totalChunks = Math.max(1, Math.ceil(file.size / CHUNK_SIZE));

  // 1. Initialize server-side upload session
  const initRes = await fetchJsonSafely<{
    success?: boolean;
    uploadId?: string;
    error?: string;
  }>('/api/admin/storage/upload/init', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-email': adminEmail,
    },
    body: JSON.stringify({
      bucket,
      folder: folder ?? spec.defaultFolder,
      filename: file.name,
      mimeType,
      totalSize: file.size,
      totalChunks,
      sha256Hash,
      replaceOldPath,
      replaceOldUrl,
    }),
  });

  // If Node backend is unreachable (static host), fall back to direct Supabase Storage upload with real XHR progress
  if (!initRes.isJson) {
    onProgress?.(8, 'uploading');
    const direct = await uploadFileToSupabaseStorageDirect(
      file,
      bucket,
      folder ?? spec.defaultFolder,
      (pct) => {
        onProgress?.(pct, pct >= 95 ? 'verifying' : 'uploading');
      }
    );
    if (direct.error || !direct.url || !direct.path) {
      throw new Error(direct.error || `Failed to upload "${file.name}" to Supabase Storage.`);
    }
    if (replaceOldPath && replaceOldPath !== direct.path) {
      await deleteSupabaseBucketFilesDirect(bucket, [replaceOldPath]).catch(() => {});
    }
    onProgress?.(100, 'done');
    const slashIdx = direct.path.lastIndexOf('/');
    return {
      verified: true,
      oldUrl: replaceOldUrl || null,
      updatedReferences: [],
      asset: {
        id: `direct-${bucket}-${direct.path}`,
        bucket,
        path: direct.path,
        folder: slashIdx === -1 ? '' : direct.path.slice(0, slashIdx),
        name: slashIdx === -1 ? direct.path : direct.path.slice(slashIdx + 1),
        publicUrl: direct.url,
        mimeType: direct.convertedTo || mimeType,
        mediaType: getMediaCategory(direct.convertedTo || mimeType, file.name),
        size: file.size,
        sha256Hash: sha256Hash || null,
        uploadedBy: adminEmail,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }

  if (!initRes.ok || !initRes.data?.uploadId) {
    throw new Error(initRes.data?.error || 'Could not initialize upload session.');
  }

  const uploadId = initRes.data.uploadId;
  onProgress?.(8, 'uploading');

  // 2. Stream binary chunks with up to 3 automatic retries per chunk
  let uploadedBytesBeforeChunk = 0;
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(file.size, start + CHUNK_SIZE);
    const chunkBlob = file.slice(start, end);

    let lastErr: Error | null = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await uploadChunkWithXhr(
          `/api/admin/storage/upload/chunk/${encodeURIComponent(uploadId)}`,
          chunkBlob,
          i,
          adminEmail,
          (loaded) => {
            const totalUploaded = uploadedBytesBeforeChunk + loaded;
            // Reserve 8%->88% for transfer, 88%->100% for Supabase persistence & verification
            const pct = Math.min(88, Math.round(8 + (totalUploaded / file.size) * 80));
            onProgress?.(pct, 'uploading');
          }
        );
        lastErr = null;
        break;
      } catch (err: any) {
        lastErr = err instanceof Error ? err : new Error(String(err));
        if (attempt < 3) {
          await new Promise((r) => setTimeout(r, attempt * 600));
        }
      }
    }

    if (lastErr) {
      throw lastErr;
    }
    uploadedBytesBeforeChunk += chunkBlob.size;
  }

  // 3. Finalize on server -> upload to Supabase Storage -> verify object exists -> persist DB metadata
  onProgress?.(92, 'verifying');
  const completeRes = await fetchJsonSafely<{
    success?: boolean;
    verified?: boolean;
    asset?: MediaAssetItem;
    oldUrl?: string | null;
    updatedReferences?: MediaUsageRef[];
    error?: string;
  }>(`/api/admin/storage/upload/complete/${encodeURIComponent(uploadId)}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-email': adminEmail,
    },
    body: JSON.stringify({}),
  });

  if (!completeRes.isJson || !completeRes.ok || !completeRes.data?.asset) {
    throw new Error(completeRes.data?.error || 'Failed to persist and verify file in Supabase Storage.');
  }

  onProgress?.(100, 'done');
  return {
    asset: completeRes.data.asset,
    verified: Boolean(completeRes.data.verified),
    oldUrl: completeRes.data.oldUrl,
    updatedReferences: Array.isArray(completeRes.data.updatedReferences)
      ? completeRes.data.updatedReferences
      : [],
  };
}

export async function createStorageFolder(
  adminEmail: string,
  bucket: SupabaseBucketId,
  folderPath: string
): Promise<{ folder?: MediaFolderItem; error?: string }> {
  const res = await fetchJsonSafely<{ success?: boolean; folder?: MediaFolderItem; error?: string }>(
    '/api/admin/storage/folders',
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-email': adminEmail,
      },
      body: JSON.stringify({ bucket, folderPath }),
    }
  );
  if (res.isJson) {
    if (res.ok && res.data?.folder) return { folder: res.data.folder };
    return { error: res.data?.error || 'Failed to create folder.' };
  }

  // Direct Supabase Storage fallback for static hosting
  if (isSupabaseConfigured && supabase) {
    const clean = folderPath.replace(/^\/+|\/+$/g, '').replace(/[^a-zA-Z0-9/_-]/g, '-');
    if (!clean) return { error: 'Please enter a valid folder name.' };
    try {
      const tinyPngBytes = Uint8Array.from(
        atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='),
        (c) => c.charCodeAt(0)
      );
      const { error } = await supabase.storage
        .from(bucket)
        .upload(`${clean}/.folder_placeholder.png`, new Blob([tinyPngBytes], { type: 'image/png' }), {
          contentType: 'image/png',
          upsert: true,
        });
      if (error) return { error: error.message };
      const slashIdx = clean.lastIndexOf('/');
      return {
        folder: {
          bucket,
          path: clean,
          name: slashIdx === -1 ? clean : clean.slice(slashIdx + 1),
          parentFolder: slashIdx === -1 ? '' : clean.slice(0, slashIdx),
          fileCount: 0,
          createdAt: new Date().toISOString(),
        },
      };
    } catch (err: any) {
      return { error: err?.message || 'Failed to create folder in Supabase Storage.' };
    }
  }

  return { error: 'Failed to create folder.' };
}

export async function renameStorageFolder(
  adminEmail: string,
  bucket: SupabaseBucketId,
  oldFolderPath: string,
  newFolderPath: string
): Promise<{
  ok: boolean;
  movedCount?: number;
  urlReplacements?: Array<{ oldUrl: string; newUrl: string }>;
  error?: string;
}> {
  const res = await fetchJsonSafely<{
    success?: boolean;
    movedCount?: number;
    urlReplacements?: Array<{ oldUrl: string; newUrl: string }>;
    error?: string;
  }>('/api/admin/storage/folders/rename', {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-email': adminEmail,
    },
    body: JSON.stringify({ bucket, oldFolderPath, newFolderPath }),
  });

  if (res.isJson) {
    if (res.ok && res.data?.success) {
      return {
        ok: true,
        movedCount: res.data.movedCount ?? 0,
        urlReplacements: res.data.urlReplacements || [],
      };
    }
    return { ok: false, error: res.data?.error || 'Failed to rename folder.' };
  }

  // Direct Supabase Storage fallback for static hosting
  if (isSupabaseConfigured && supabase) {
    try {
      const cleanOld = oldFolderPath.replace(/^\/+|\/+$/g, '');
      const cleanNew = newFolderPath.replace(/^\/+|\/+$/g, '');
      const listed = await listSupabaseBucketFilesDirect(bucket, cleanOld);
      const urlReplacements: Array<{ oldUrl: string; newUrl: string }> = [];
      let movedCount = 0;

      for (const file of listed.files) {
        const suffix = file.path.slice(cleanOld.length);
        const targetPath = `${cleanNew}${suffix}`;
        const { error } = await supabase.storage.from(bucket).move(file.path, targetPath);
        if (error) return { ok: false, error: error.message };
        const { data: pub } = supabase.storage.from(bucket).getPublicUrl(targetPath);
        if (file.publicUrl && pub?.publicUrl) {
          urlReplacements.push({ oldUrl: file.publicUrl, newUrl: pub.publicUrl });
        }
        movedCount += 1;
      }
      return { ok: true, movedCount, urlReplacements };
    } catch (err: any) {
      return { ok: false, error: err?.message || 'Failed to rename folder in Supabase Storage.' };
    }
  }

  return { ok: false, error: 'Failed to rename folder.' };
}

export async function deleteStorageFolder(
  adminEmail: string,
  bucket: SupabaseBucketId,
  folderPath: string,
  force = false
): Promise<{
  ok: boolean;
  requiresConfirmation?: boolean;
  fileCount?: number;
  references?: MediaUsageRef[];
  error?: string;
  rlsBlocked?: boolean;
}> {
  const res = await fetchJsonSafely<{
    success?: boolean;
    requiresConfirmation?: boolean;
    fileCount?: number;
    references?: MediaUsageRef[];
    error?: string;
  }>('/api/admin/storage/folders/delete', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-email': adminEmail,
    },
    body: JSON.stringify({ bucket, folderPath, force }),
  });

  if (res.isJson) {
    if (res.ok && res.data?.success) return { ok: true };
    if (res.status === 409 && res.data?.requiresConfirmation) {
      return {
        ok: false,
        requiresConfirmation: true,
        fileCount: res.data.fileCount,
        references: res.data.references || [],
        error: res.data.error,
      };
    }
    return { ok: false, error: res.data?.error || 'Failed to delete folder.' };
  }

  // Direct Supabase Storage fallback for static hosting
  if (isSupabaseConfigured && supabase) {
    const clean = folderPath.replace(/^\/+|\/+$/g, '');
    const listed = await listSupabaseBucketFilesDirect(bucket, clean);
    const paths = [
      ...listed.files.map((f) => f.path),
      `${clean}/.folder_placeholder.png`,
      `${clean}/.emptyFolderPlaceholder`,
    ];
    return deleteSupabaseBucketFilesDirect(bucket, paths);
  }

  return { ok: false, error: 'Failed to delete folder.' };
}

export async function fetchServerMediaUsage(
  adminEmail: string,
  publicUrl: string,
  objectPath?: string
): Promise<MediaUsageRef[]> {
  const res = await fetchJsonSafely<{ count?: number; references?: MediaUsageRef[] }>(
    '/api/admin/storage/usage',
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-email': adminEmail,
      },
      body: JSON.stringify({ publicUrl, path: objectPath }),
    }
  );
  if (res.isJson && res.ok && Array.isArray(res.data?.references)) {
    return res.data.references;
  }
  return [];
}

export async function deleteMediaFiles(
  adminEmail: string,
  bucket: SupabaseBucketId,
  paths: string[]
): Promise<{ ok: boolean; error?: string; rlsBlocked?: boolean }> {
  // Prefer POST endpoint so reverse proxies / CDNs never strip the JSON body on DELETE
  let res = await fetchJsonSafely<{ success?: boolean; error?: string }>(
    `/api/admin/storage/buckets/${encodeURIComponent(bucket)}/delete`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-email': adminEmail,
      },
      body: JSON.stringify({ paths }),
    }
  );

  // Fallback to DELETE endpoint if older server instance doesn't expose /delete yet
  if (res.isJson && res.status === 404) {
    res = await fetchJsonSafely<{ success?: boolean; error?: string }>(
      `/api/admin/storage/buckets/${encodeURIComponent(bucket)}/files`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': adminEmail,
        },
        body: JSON.stringify({ paths }),
      }
    );
  }

  if (res.isJson) {
    if (res.ok) return { ok: true };
    return { ok: false, error: res.data?.error || 'Failed to delete file.' };
  }

  // Direct Supabase Storage fallback when deployed on static hosting without a Node backend
  const direct = await deleteSupabaseBucketFilesDirect(bucket, paths);
  if (!direct.ok && /row-level security|policy|permission|unauthorized/i.test(direct.error || '')) {
    return { ok: false, error: direct.error, rlsBlocked: true };
  }
  return direct;
}

async function readResponseBlobWithProgress(
  res: Response,
  onProgress?: (percent: number) => void
): Promise<Blob> {
  const contentType = res.headers.get('content-type') || 'application/octet-stream';
  const totalHeader = Number(res.headers.get('content-length') || '0');
  if (!res.body || !res.body.getReader) {
    onProgress?.(55);
    const blob = await res.blob();
    onProgress?.(100);
    return blob;
  }

  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let loaded = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      loaded += value.byteLength;
      if (totalHeader > 0) {
        const pct = Math.min(98, Math.max(8, Math.round((loaded / totalHeader) * 95)));
        onProgress?.(pct);
      } else {
        // Smooth asymptotic progression when server omits Content-Length
        const approx = Math.min(92, Math.round(15 + (1 - Math.exp(-loaded / (512 * 1024))) * 77));
        onProgress?.(approx);
      }
    }
  }

  onProgress?.(100);
  return new Blob(chunks as BlobPart[], { type: contentType });
}

export async function downloadMediaFile(
  adminEmail: string,
  file: Pick<MediaAssetItem, 'bucket' | 'path' | 'name' | 'publicUrl'>,
  onProgress?: (percent: number) => void
): Promise<void> {
  const proxyUrl = `/api/admin/storage/download?bucket=${encodeURIComponent(file.bucket)}&path=${encodeURIComponent(file.path)}`;
  onProgress?.(5);

  try {
    const res = await fetch(proxyUrl, {
      credentials: 'include',
      headers: { 'x-admin-email': adminEmail },
    });
    const contentType = (res.headers.get('content-type') || '').toLowerCase();
    // Ensure static hosts returning index.html on 200/404 are never saved as the file
    if (res.ok && !contentType.includes('text/html')) {
      const blob = await readResponseBlobWithProgress(res, onProgress);
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = file.name || 'media-file';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2500);
      return;
    }
  } catch {
    // Fallback to public URL fetch
  }

  const directRes = await fetch(file.publicUrl);
  if (!directRes.ok) {
    throw new Error('Could not download file from Supabase Storage.');
  }
  const blob = await readResponseBlobWithProgress(directRes, onProgress);
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = file.name || 'media-file';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(blobUrl), 2500);
}
