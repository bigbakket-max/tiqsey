import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables if present
dotenv.config();

// Initialize Supabase client with project credentials
const supabaseUrl = process.env.SUPABASE_URL || 'https://lzjjwsvalvfkgwtzuime.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Replaced 'your_table' with 'bookings' from the Tiqsey project
export async function getTableData(tableName = 'bookings') {
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
