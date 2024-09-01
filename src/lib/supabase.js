import { createClient } from '@supabase/supabase-js'
import { createBrowserClient, createServerClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anonymous Key')
}

let browserInstance = null;

export const createBrowserSupabaseClient = () => {
  if (browserInstance) return browserInstance;
  browserInstance = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return browserInstance;
};

export const createServerSupabaseClient = (context) => {
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get: (name) => {
          const cookies = context.req.cookies;
          const cookie = cookies[name];
          return cookie;
        },
        set: (name, value, options) => {
          context.res.setHeader('Set-Cookie', `${name}=${value}; Path=/; HttpOnly; SameSite=Lax`);
        },
        remove: (name, options) => {
          context.res.setHeader('Set-Cookie', `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
        },
      },
    }
  );
};

// For server-side operations that need higher privileges
export const createAdminClient = () => {
  if (!supabaseServiceRoleKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY is not set. Falling back to SUPABASE_ANON_KEY for admin operations.');
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey || supabaseAnonKey);
};

// Use this for client-side operations
export const supabase = createBrowserSupabaseClient();