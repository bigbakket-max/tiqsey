import {
  getBucketConfig,
  type SupabaseBucketId,
} from '../lib/supabase';

export interface UploadMediaOptions {
  bucket?: SupabaseBucketId;
  folder?: string;
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
): Promise<string | null> {
  try {
    const resp = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: dataUrl,
        filename,
        bucket,
        folder,
      }),
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data?.url) return data.url;
    } else {
      const errData = await resp.json().catch(() => ({}));
      if (errData?.error) {
        console.warn(`[imageUpload] Upload error (${bucket}):`, errData.error);
      }
    }
  } catch (uploadErr) {
    console.warn('[imageUpload] Server upload unavailable, trying Supabase Storage fallback', uploadErr);
  }

  try {
    const { uploadDataUrlToSupabaseStorage } = await import('../lib/supabase');
    const storageUrl = await uploadDataUrlToSupabaseStorage(dataUrl, filename, folder, bucket);
    if (storageUrl) return storageUrl;
  } catch (_) {}

  return null;
}

/**
 * Utility to optimize and upload image files to the server's /api/upload endpoint
 * and route them to the appropriate Supabase Storage bucket.
 * Falls back to high-efficiency canvas-compressed data URLs if both server and Supabase are offline.
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
    const uploadedUrl = await sendToUploadEndpoint(dataUrl, file.name, effectiveBucket, folder);
    return uploadedUrl || dataUrl;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        resolve('');
        return;
      }
      const rawBase64 = reader.result;
      const img = new Image();
      img.onload = async () => {
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

          // Ensure encoded payload fits comfortably inside the target bucket's file size limit (e.g., 2MB for avatars, 5MB for blog/attractions)
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

        const uploadedUrl = await sendToUploadEndpoint(compressed, file.name, targetBucket, folder);
        resolve(uploadedUrl || compressed);
      };

      img.onerror = async () => {
        // Fallback for formats like AVIF if canvas decoding fails in an older browser
        if (file.size > bucketConfig.maxSizeBytes) {
          reject(new Error(`File exceeds maximum size limit of ${bucketConfig.maxSizeLabel}`));
          return;
        }
        const uploadedUrl = await sendToUploadEndpoint(rawBase64, file.name, targetBucket, folder);
        resolve(uploadedUrl || rawBase64);
      };

      img.src = rawBase64;
    };

    reader.onerror = () => {
      resolve('');
    };

    reader.readAsDataURL(file);
  });
}

/**
 * General media uploader supporting both images and videos across all 7 Supabase Storage buckets.
 */
export async function uploadMediaFile(
  file: File,
  options: {
    bucket: SupabaseBucketId;
    folder?: string;
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  }
): Promise<string> {
  const bucketConfig = getBucketConfig(options.bucket);
  const normalizedMime = file.type === 'image/jpg' ? 'image/jpeg' : file.type;

  if (!bucketConfig.allowedMimeTypes.includes(normalizedMime)) {
    throw new Error(
      `Unsupported file type "${file.type || 'unknown'}" for ${bucketConfig.id}. Allowed: ${bucketConfig.allowedMimeTypes.join(', ')}`
    );
  }

  if (file.size > bucketConfig.maxSizeBytes) {
    throw new Error(`File exceeds maximum size limit of ${bucketConfig.maxSizeLabel} for ${bucketConfig.id}`);
  }

  if (normalizedMime.startsWith('image/') && normalizedMime !== 'image/avif') {
    return uploadAndOptimizeImage(
      file,
      options.maxWidth ?? (options.bucket === 'avatars' ? 400 : 1400),
      options.maxHeight ?? (options.bucket === 'avatars' ? 400 : 950),
      options.quality ?? 0.85,
      { bucket: options.bucket, folder: options.folder }
    );
  }

  // Videos and AVIF uploaded directly without canvas rasterization
  const dataUrl = await readFileAsDataUrl(file);
  const uploadedUrl = await sendToUploadEndpoint(
    dataUrl,
    file.name,
    options.bucket,
    options.folder || bucketConfig.defaultFolder
  );
  if (!uploadedUrl) {
    throw new Error(`Failed to upload ${file.name} to ${options.bucket}`);
  }
  return uploadedUrl;
}
