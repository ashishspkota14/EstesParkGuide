import { createClient } from '@supabase/supabase-js';
import { ENV } from './env.js';

// Create Supabase client with service role key (backend only)
export const supabase = createClient(
  ENV.SUPABASE_URL,
  ENV.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Test connection function
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('trails')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Database connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connected successfully');
    return true;
  } catch (err) {
    console.error('Database connection error:', err.message);
    return false;
  }
};

export default supabase;