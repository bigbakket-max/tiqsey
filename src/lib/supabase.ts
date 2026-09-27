import { createClient } from '@supabase/supabase-js';

export const SUPABASE_PROJECT_ID = 'lzjjwsvalvfkgwtzuime';
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://lzjjwsvalvfkgwtzuime.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_KxzN2RLPv5Q7nVqDRqPw-w_mi317li6';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
