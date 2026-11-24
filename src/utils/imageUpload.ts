import {
  getBucketConfig,
  isSupabaseConfigured,
  uploadDataUrlToSupabaseStorage,
  type SupabaseBucketId,
} from '../lib/supabase';
import { fetchJsonSafely } from './safeFetch';
import { getStoredAdminEmail, uploadMediaChunked } from './mediaStorageClient';

export interface UploadMediaOptions {
  bucket?: SupabaseBucketId;
  folder?: string;
  onProgress?: (percent: number) => void;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

async function sendToUploadEndpoint(
  dataUrl: string,
  filename: string,
  bucket: SupabaseBucketId,
  folder?: string
): Promise<{ url: string | null; error?: string }> {
  const adminEmail = getStoredAdminEmail();
  const result = await fetchJsonSafely<{ url?: string; error?: string }>('/api/upload', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-email': adminEmail,
    },
    body: JSON.stringify({
      image: dataUrl,
      filename,
      bucket,
      folder,
    }),
  });

  if (result.isJson && result.ok && result.data?.url) {
    return { url: result.data.url };
  }

  const serverError = result.isJson ? result.data?.error : undefined;
  if (serverError) {
    console.warn(`[imageUpload] Upload error (${bucket}):`, serverError);
  }

  // Fallback to direct Supabase Storage upload (e.g. static deployment)
  try {
    const storageUrl = await uploadDataUrlToSupabaseStorage(dataUrl, filename, folder, bucket);
    if (storageUrl) return { url: storageUrl };
  } catch (err: any) {
    return { url: null, error: err?.message || serverError };
  }

  return {
    url: null,
    error: serverError || 'Supabase Storage upload failed. Please check your connection and try again.',
  };
}

/**
 * Optimizes and permanently uploads image files to Supabase Storage via /api/upload
 * (or direct Supabase Storage fallback). Never silently stores temporary browser-only base64 URLs
 * when Supabase Storage is configured.
 */
export async function uploadAndOptimizeImage(
  file: File,
  maxWidth = 1280,
  maxHeight = 850,
  quality = 0.85,
  options?: UploadMediaOptions
): Promise<string> {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Selected file is not an image');
  }

  const bucketConfig = getBucketConfig(options?.bucket);
  const targetBucket = bucketConfig.id;
  const folder = options?.folder || bucketConfig.defaultFolder;

  // Handle SVG and animated GIF without rasterizing
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    const effectiveBucket: SupabaseBucketId = bucketConfig.allowedMimeTypes.includes(file.type)
      ? targetBucket
      : 'media';
    const effectiveConfig = getBucketConfig(effectiveBucket);
    if (file.size > effectiveConfig.maxSizeBytes) {
      throw new Error(`File exceeds maximum size limit of ${effectiveConfig.maxSizeLabel}`);
    }
    const dataUrl = await readFileAsDataUrl(file);
    const uploaded = await sendToUploadEndpoint(dataUrl, file.name, effectiveBucket, folder);
    if (uploaded.url) return uploaded.url;
    if (isSupabaseConfigured) {
      throw new Error(uploaded.error || 'Failed to save image to Supabase Storage.');
    }
    return dataUrl;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Failed to read image file.'));
        return;
      }
      const rawBase64 = reader.result;
      const img = new Image();
      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          let compressed = rawBase64;

          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const tryEncode = (q: number) => {
              try {
                const webp = canvas.toDataURL('image/webp', q);
                if (webp.startsWith('data:image/webp')) return webp;
              } catch {}
              return canvas.toDataURL('image/jpeg', q);
            };

            compressed = tryEncode(quality);

            const estimateBytes = (uri: string) => Math.ceil((uri.length - uri.indexOf(',') - 1) * 0.75);
            if (estimateBytes(compressed) > bucketConfig.maxSizeBytes) {
              for (const nextQuality of [0.75, 0.65, 0.55]) {
                compressed = tryEncode(nextQuality);
                if (estimateBytes(compressed) <= bucketConfig.maxSizeBytes) break;
              }
            }
            if (estimateBytes(compressed) > bucketConfig.maxSizeBytes) {
              reject(new Error(`Image exceeds the ${bucketConfig.maxSizeLabel} limit for ${bucketConfig.label}`));
              return;
            }
          }

          const uploaded = await sendToUploadEndpoint(compressed, file.name, targetBucket, folder);
          if (uploaded.url) {
            resolve(uploaded.url);
            return;
          }
          if (isSupabaseConfigured) {
            reject(new Error(uploaded.error || 'Failed to upload image to Supabase Storage.'));
            return;
          }
          resolve(compressed);
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = async () => {
        try {
          // Fallback for formats like AVIF if canvas decoding fails in an older browser
          if (file.size > bucketConfig.maxSizeBytes) {
            reject(new Error(`File exceeds maximum size limit of ${bucketConfig.maxSizeLabel}`));
            return;
          }
          const uploaded = await sendToUploadEndpoint(rawBase64, file.name, targetBucket, folder);
          if (uploaded.url) {
            resolve(uploaded.url);
            return;
          }
          if (isSupabaseConfigured) {
            reject(new Error(uploaded.error || 'Failed to upload image to Supabase Storage.'));
            return;
          }
          resolve(rawBase64);
        } catch (err) {
          reject(err);
        }
      };

      img.src = rawBase64;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read image file.'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * General media uploader supporting images, videos, and PDF documents across all 7 Supabase Storage buckets.
 * Uses chunked/resumable streaming for videos and large files so uploads remain fast and reliable.
 */
export async function uploadMediaFile(
  file: File,
  options: {
    bucket: SupabaseBucketId;
    folder?: string;
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    onProgress?: (percent: number) => void;
  }
): Promise<string> {
  const bucketConfig = getBucketConfig(options.bucket);
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
  const rawMime = (file.type || extMap[ext] || '').toLowerCase();
  const normalizedMime = rawMime === 'image/jpg' ? 'image/jpeg' : rawMime;

  if (!bucketConfig.allowedMimeTypes.includes(normalizedMime)) {
    throw new Error(
      `Unsupported file type "${normalizedMime || 'unknown'}" for ${bucketConfig.id}. Allowed: ${bucketConfig.allowedMimeTypes.join(', ')}`
    );
  }

  if (file.size > bucketConfig.maxSizeBytes) {
    throw new Error(`File exceeds maximum size limit of ${bucketConfig.maxSizeLabel} for ${bucketConfig.id}`);
  }

  // Videos, PDFs, or large files use the reliable chunked uploader with progress & verification
  if (normalizedMime.startsWith('video/') || normalizedMime === 'application/pdf' || file.size > 3 * 1024 * 1024) {
    const result = await uploadMediaChunked({
      file,
      bucket: options.bucket,
      folder: options.folder || bucketConfig.defaultFolder,
      adminEmail: getStoredAdminEmail(),
      onProgress: (pct) => options.onProgress?.(pct),
    });
    return result.asset.publicUrl;
  }

  if (normalizedMime.startsWith('image/') && normalizedMime !== 'image/avif') {
    options.onProgress?.(20);
    const url = await uploadAndOptimizeImage(
      file,
      options.maxWidth ?? (options.bucket === 'avatars' ? 400 : 1400),
      options.maxHeight ?? (options.bucket === 'avatars' ? 400 : 950),
      options.quality ?? 0.85,
      { bucket: options.bucket, folder: options.folder }
    );
    options.onProgress?.(100);
    return url;
  }

  // AVIF uploaded directly via chunked upload without canvas rasterization
  const result = await uploadMediaChunked({
    file,
    bucket: options.bucket,
    folder: options.folder || bucketConfig.defaultFolder,
    adminEmail: getStoredAdminEmail(),
    onProgress: (pct) => options.onProgress?.(pct),
  });
  return result.asset.publicUrl;
}
