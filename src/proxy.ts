import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js proxy untuk menangani autentikasi Supabase
 * - Menyegarkan sesi setiap request
 * - Melindungi route yang dikonfigurasi
 * - Mengarahkan user terautentikasi dari halaman auth
 */
export async function proxy(request: NextRequest) {
  // Lewati jika Supabase tidak dikonfigurasi (dev mode tanpa env vars)
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // PENTING: Menyegarkan token auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Konfigurasi route yang dilindungi
  // Route ini memerlukan autentikasi - user akan diarahkan ke login
  const protectedRoutes = [
    "/",
    "/account",
    "/form",
    "/dashboard",
    "/profile",
    "/settings",
  ];
  const isProtectedRoute = protectedRoutes.some((route) => {
    // Cocokkan persis untuk home page
    if (route === "/") {
      return request.nextUrl.pathname === "/";
    }
    // Cocokkan prefix untuk route lainnya
    return request.nextUrl.pathname.startsWith(route);
  });

  // Arahkan user tidak terautentikasi dari route yang dilindungi
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Arahkan user terautentikasi menjauhi halaman auth
  const authRoutes = ["/login", "/otp"];
  const isAuthRoute = authRoutes.some(
    (route) => request.nextUrl.pathname === route,
  );

  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    const redirectTo = url.searchParams.get("redirect") || "/";
    url.pathname = redirectTo;
    url.searchParams.delete("redirect");
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

/**
 * Konfigurasi route mana yang proxy harus jalankan
 * Mengecualikan file statis dan API route yang tidak perlu auth
 */
export const config = {
  matcher: [
    /*
     * Cocokkan semua path request kecuali:
     * - _next/static (file statis)
     * - _next/image (file optimasi gambar)
     * - favicon.ico (file favicon)
     * - File publik (svg, png, jpg, dll.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
