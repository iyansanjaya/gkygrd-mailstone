import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Handler callback OAuth untuk autentikasi Google
 * Menukar kode otorisasi dengan sesi
 *
 * Catatan: Ketika signup dinonaktifkan, Supabase langsung redirect ke /login
 * dengan error di URL hash, melewati callback ini sepenuhnya.
 * Callback ini hanya menangani pertukaran kode auth yang sukses.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Autentikasi berhasil - redirect ke tujuan yang dimaksud
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Fallback: redirect ke login jika terjadi kesalahan
  return NextResponse.redirect(`${origin}/login`);
}
