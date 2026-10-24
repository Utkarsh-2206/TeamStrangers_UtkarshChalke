import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('your-project')
);

// Fallback dummy client if unconfigured to prevent hard startup crashes
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://mock.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'mock-anon-key'
);
