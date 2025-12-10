import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Client-side Supabase client (for use in Client Components)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create client for use in Client Components
export const createClientComponentClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Server-side client with service role key (for admin operations)
export const getServiceSupabase = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
