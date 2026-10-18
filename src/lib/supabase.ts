import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').trim();
export const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes('lzjjwsvalvfkgwtzuime') &&
  !SUPABASE_URL.includes('placeholder') &&
  SUPABASE_URL.startsWith('http')
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
