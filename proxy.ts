import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ROLE_PERMISSIONS: Record<string, string[]> = {
    admin: ['/dashboard'],
    admin_group: [
      '/dashboard/register', 
      '/dashboard/renewal', 
      '/dashboard/declaration',
      '/dashboard/list-declaration',
      '/dashboard/social',
      '/dashboard/medical',
      '/dashboard/distributor'
    ],
    saleman: [
      '/dashboard',
      '/dashboard/renewal',
      '/dashboard/medical',
      '/dashboard/distributor',
      '/dashboard/collector',
      '/dashboard/payment'
    ],
    user: [
      '/dashboard/renewal',
      '/dashboard/medical',
    ], 
    agent: [
      '/dashboard/register', 
      '/dashboard/renewal', 
      '/dashboard/declaration',
      '/dashboard/list-declaration',
      '/dashboard/social',
      '/dashboard/medical',
      '/dashboard/distributor'
    ],
    customer: [
      '/dashboard/register', 
      '/dashboard/renewal', 
      '/dashboard/renewal',
      '/dashboard/medical',
    ],

}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = pathname.split('/')[1] || 'vi';
  const accessToken = request.cookies.get('accessToken')?.value;
  const userRole = request.cookies.get('userRole')?.value;

  if (pathname === `/${locale}` || pathname === '/') {
    if (accessToken || userRole) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  if (pathname.includes('/dashboard')) {
    if (!accessToken || !userRole) {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }

    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    if (userRole === 'admin') return NextResponse.next()
    const isAllowed = ROLE_PERMISSIONS[userRole]?.some(route => 
      pathWithoutLocale.startsWith(route)
    )
    if (!isAllowed) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard?error=unauthorized`, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
    '/(vi|en)/:path*'
  ]
}
