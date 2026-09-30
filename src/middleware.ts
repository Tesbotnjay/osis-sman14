import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static files and API routes that handle their own auth
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // static files
  ) {
    return NextResponse.next()
  }

  // Update Supabase session
  const { supabaseResponse, user } = await updateSession(request)

  // Check maintenance mode for public routes
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/login')) {
    // We check maintenance mode via a cookie set by admin
    // This avoids a DB call on every request
    const maintenanceMode = request.cookies.get('maintenance_mode')?.value === 'true'
    if (maintenanceMode && !user) {
      const maintenanceUrl = request.nextUrl.clone()
      maintenanceUrl.pathname = '/maintenance'
      return NextResponse.rewrite(maintenanceUrl)
    }
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/login'
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect logged-in users away from login page
  if (pathname === '/login' && user) {
    const adminUrl = request.nextUrl.clone()
    adminUrl.pathname = '/admin'
    return NextResponse.redirect(adminUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
