// Datei: lib/supabase/proxy.ts

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase credentials missing in middleware");
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch user profile with role if user is authenticated
  const { data: profile, error: profileError } = user
    ? await supabase.from("profiles").select("role").eq("id", user.id).single()
    : { data: null, error: null };

  // Admin routes protection
  const adminRoutes = ["/admin"];
  const isAdminRoute = adminRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isAdminRoute) {
    if (!user) {
      // Not authenticated -> redirect to login with return URL
      const redirectUrl = new URL("/auth/login", request.url);
      redirectUrl.searchParams.set(
        "redirect",
        request.nextUrl.pathname + request.nextUrl.search
      );
      return NextResponse.redirect(redirectUrl);
    }

    if (profile?.role !== "admin") {
      // Authenticated but not admin -> redirect to home with error
      const redirectUrl = new URL("/", request.url);
      redirectUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(redirectUrl);
    }
  }

  // User routes protection (profile, orders, etc.)
  const protectedRoutes = ["/userProfile", "/profile", "/settings"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !user) {
    const redirectUrl = new URL("/auth/login", request.url);
    // Include original URL as redirect parameter
    redirectUrl.searchParams.set(
      "redirect",
      request.nextUrl.pathname + request.nextUrl.search
    );
    return NextResponse.redirect(redirectUrl);
  }

  // Auth routes - redirect logged-in users away from login/signup
  const authRoutes = ["/auth/login", "/auth/sign-up"];
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isAuthRoute && user) {
    // If user is admin and coming from auth, go to admin dashboard
    if (profile?.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    // Regular user goes to home
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
