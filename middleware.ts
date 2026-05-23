import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Define route types
  const isAdminRoot = pathname === '/admin'
  const isLoginPage = pathname === '/admin/login'
  const isProtectedAdminRoute = pathname.startsWith('/admin') && !isLoginPage

  // 1. Redirect unauthenticated users away from protected admin routes
  if (!user && isProtectedAdminRoute) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // 2. Redirect authenticated users away from login page
  if (user && isLoginPage) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  // 3. Redirect authenticated users from root /admin to /admin/dashboard
  if (user && isAdminRoot) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return response
}

export const config = {
  // Apply middleware to all admin routes
  matcher: ['/admin/:path*'],
}