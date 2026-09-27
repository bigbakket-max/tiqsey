const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://lzjjwsvalvfkgwtzuime.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function getTableData(tableName = 'bookings') {
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

module.exports = { supabase, getTableData };
