/**
 * Supabase client singleton.
 * Uses service-role key so functions can bypass RLS for server-side writes.
 * The anon key is used for public-facing reads where RLS policies apply.
 *
 * Required Firebase Functions config keys:
 *   firebase functions:config:set supabase.url="https://xxx.supabase.co"
 *   firebase functions:config:set supabase.service_key="eyJ..."
 *   firebase functions:config:set supabase.anon_key="eyJ..."
 *
 * Env vars (used on Vercel / plain Node):
 *   SUPABASE_URL, SUPABASE_SERVICE_KEY
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as functions from 'firebase-functions';

const config = functions.config();

const supabaseUrl: string =
  process.env.SUPABASE_URL ?? config.supabase?.url ?? '';

const supabaseServiceKey: string =
  process.env.SUPABASE_SERVICE_KEY ?? config.supabase?.service_key ?? '';

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (client) return client;
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      '[Supabase] Missing SUPABASE_URL or SUPABASE_SERVICE_KEY. ' +
        'Set environment variables or firebase functions config.'
    );
  }
  client = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
  return client;
}

/**
 * Server-side client with full database access (bypasses RLS).
 * Lazily initialised so importing this module never crashes when env
 * vars are absent (e.g. Vercel builds / health checks without secrets).
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const c = getClient() as unknown as Record<string | symbol, unknown>;
    const value = c[prop];
    return typeof value === 'function' ? value.bind(getClient()) : value;
  },
});

/** Re-export for route-level type checking. */
export type { SupabaseClient };
