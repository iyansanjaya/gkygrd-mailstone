import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Membuat klien Supabase untuk digunakan di Server Components, Server Actions, dan Route Handlers.
 * Menangani manajemen sesi berbasis cookie dengan operasi baca/tulis yang tepat.
 *
 * @returns Instance klien Supabase server
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Method `setAll` dipanggil dari Server Component.
            // Ini bisa diabaikan jika middleware menyegarkan sesi user.
          }
        },
      },
    },
  );
}
