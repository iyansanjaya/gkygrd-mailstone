import { createBrowserClient } from "@supabase/ssr";

/**
 * Membuat klien Supabase untuk digunakan di komponen browser/client.
 * Klien ini menangani state autentikasi secara otomatis via cookies.
 *
 * @returns Instance klien Supabase browser
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
