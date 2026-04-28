import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ROLE_PERMISSIONS: Record<string, string[]> = {
    admin: ['/dashboard'],
    admin_group: ['/dashboard'],
    saleman: ['/dashboard', '/dashboard/orders', '/dashboard/payment'],
    user: ['/dashboard', '/dashboard/orders', '/dashboard/payment'], 
    agent: ['/dashboard', '/dashboard/orders', '/dashboard/payment'],
    customer: ['/dashboard', '/dashboard/orders', '/dashboard/payment'],
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = pathname.split('/')[1] || 'vi';
  const accessToken = request.cookies.get('accessToken')?.value;
  const userRole = request.cookies.get('userRole')?.value;

  if (pathname === `/${locale}` || pathname === '/') {
    if (accessToken && userRole) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  if (pathname.includes('/dashboard')) {
    if (!accessToken || !userRole) {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }

    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    if (userRole === 'admin') return NextResponse.next();
    const allowedRoutes = ROLE_PERMISSIONS[userRole] || [];

    const isAllowed = allowedRoutes.some(route => 
      pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
    );

    if (!isAllowed) {
      if (pathWithoutLocale === '/dashboard' || pathWithoutLocale === '/dashboard/') {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL(`/${locale}/dashboard?error=unauthorized`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ]
}