import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const { pathname } = request.nextUrl

  const isAuthenticated = request.cookies.has('admin_session')

  const isAdminRoot = pathname === '/admin'
  const isLoginPage = pathname === '/admin/login'
  const isProtectedAdminRoute = pathname.startsWith('/admin') && !isLoginPage

  if (!isAuthenticated && isProtectedAdminRoute) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  if (isAuthenticated && isAdminRoot) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}