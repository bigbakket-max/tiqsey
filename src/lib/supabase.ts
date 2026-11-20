import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').trim();
export const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

const isValidSupabaseUrl = (value: string): boolean => {
  if (!value || value.includes('placeholder')) return false;

  try {
    const url = new URL(value);
    const isLocalDevelopment =
      url.hostname === 'localhost' || url.hostname === '127.0.0.1';

    return (
      (url.protocol === 'https:' || (isLocalDevelopment && url.protocol === 'http:')) &&
      (isLocalDevelopment || url.hostname.endsWith('.supabase.co'))
    );
  } catch {
    return false;
  }
};

// Do not block a valid project URL based on its project reference.
// Environment variables remain the source of truth for enabling the client.
export const isSupabaseConfigured = Boolean(
  isValidSupabaseUrl(SUPABASE_URL) && SUPABASE_ANON_KEY
);

export const SUPABASE_PROJECT_ID = isSupabaseConfigured
  ? (new URL(SUPABASE_URL).hostname.split('.')[0] || '')
  : '';

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
