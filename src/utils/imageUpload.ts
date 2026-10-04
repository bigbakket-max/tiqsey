/**
 * Utility to optimize and upload image files to the server's /api/upload endpoint
 * Falls back to high-efficiency canvas-compressed data URLs if the server is offline.
 */
export async function uploadAndOptimizeImage(
  file: File,
  maxWidth = 1280,
  maxHeight = 850,
  quality = 0.85
): Promise<string> {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Selected file is not an image');
  }

  // Handle SVG without rasterizing
  if (file.type === 'image/svg+xml') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        if (typeof reader.result === 'string') {
          try {
            const resp = await fetch('/api/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image: reader.result, filename: file.name })
            });
            if (resp.ok) {
              const data = await resp.json();
              if (data?.url) return resolve(data.url);
            }
          } catch (_) {}
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read SVG file'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve) => {
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
          try {
            compressed = canvas.toDataURL('image/webp', quality);
            if (!compressed.startsWith('data:image/webp')) {
              compressed = canvas.toDataURL('image/jpeg', quality);
            }
          } catch {
            compressed = canvas.toDataURL('image/jpeg', quality);
          }
        }

        // Send to server upload endpoint for persistent, tiny URL
        try {
          const resp = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: compressed,
              filename: file.name
            })
          });
          if (resp.ok) {
            const data = await resp.json();
            if (data?.url) {
              return resolve(data.url);
            }
          }
        } catch (uploadErr) {
          console.warn('[imageUpload] Server upload unavailable, falling back to compressed base64', uploadErr);
        }

        resolve(compressed);
      };

      img.onerror = () => {
        resolve(rawBase64);
      };

      img.src = rawBase64;
    };

    reader.onerror = () => {
      resolve('');
    };

    reader.readAsDataURL(file);
  });
}
