import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').trim();
export const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();
export const SUPABASE_STORAGE_BUCKET = (import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'media').trim() || 'media';

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

export async function uploadDataUrlToSupabaseStorage(
  dataUrl: string,
  filename = 'media',
  folder = 'uploads'
): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (!match) return null;

  const mime = match[1];
  const base64 = match[2];
  const ext = mime.includes('png')
    ? 'png'
    : mime.includes('webp')
    ? 'webp'
    : mime.includes('svg')
    ? 'svg'
    : mime.includes('gif')
    ? 'gif'
    : 'jpg';

  try {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mime });
    const safeBase = filename.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30) || 'media';
    const objectPath = `${folder}/${safeBase}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

    const { error } = await supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .upload(objectPath, blob, {
        contentType: mime,
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.warn('[Supabase Storage Client Upload Warning]:', error.message);
      return null;
    }

    const { data } = supabase.storage.from(SUPABASE_STORAGE_BUCKET).getPublicUrl(objectPath);
    return data?.publicUrl || null;
  } catch (err: any) {
    console.warn('[Supabase Storage Client Upload Error]:', err?.message || err);
    return null;
  }
}
