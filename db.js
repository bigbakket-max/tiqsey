import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables if present
dotenv.config();

// Initialize Supabase client with project credentials if provided
const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
const supabaseKey = (
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  ''
).trim();

export const supabase = (
  supabaseUrl &&
  supabaseKey &&
  !supabaseUrl.includes('placeholder') &&
  /^https?:\/\//i.test(supabaseUrl)
)
  ? createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

// Replaced 'your_table' with 'bookings' from the Tiqsey project
export async function getTableData(tableName = 'bookings') {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*');

    if (error) {
      console.error(`[Supabase] Error querying ${tableName}:`, error.message || error);
      return null;
    }
    return data;
  } catch (err) {
    console.error(`[Supabase] Network/JSON parse exception querying ${tableName}:`, err.message || err);
    return null;
  }
}

export default { supabase, getTableData };
