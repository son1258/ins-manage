import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ROLE_PERMISSIONS: Record<string, string[]> = {
    // Thêm '/dashboard' vào danh sách cho phép của tất cả các role 
    // để họ có thể truy cập vào trang chủ của bảng điều khiển.
    admin: ['/dashboard'],
    admin_group: ['/dashboard', '/dashboard/register', '/dashboard/renewal', '/dashboard/declaration', '/dashboard/list-declaration', '/dashboard/social', '/dashboard/medical', '/dashboard/distributor'],
    saleman: ['/dashboard', '/dashboard/renewal', '/dashboard/medical', '/dashboard/distributor', '/dashboard/collector', '/dashboard/payment'],
    user: ['/dashboard', '/dashboard/renewal', '/dashboard/medical'], 
    agent: ['/dashboard', '/dashboard/register', '/dashboard/renewal', '/dashboard/declaration', '/dashboard/list-declaration', '/dashboard/social', '/dashboard/medical', '/dashboard/distributor'],
    customer: ['/dashboard', '/dashboard/register', '/dashboard/renewal', '/dashboard/medical'],
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = pathname.split('/')[1] || 'vi';
  const accessToken = request.cookies.get('accessToken')?.value;
  const userRole = request.cookies.get('userRole')?.value;

  // 1. Nếu vào trang chủ / hoặc /vi -> điều hướng về dashboard hoặc login
  if (pathname === `/${locale}` || pathname === '/') {
    if (accessToken && userRole) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // 2. Kiểm tra các route thuộc khu vực /dashboard
  if (pathname.includes('/dashboard')) {
    // Nếu chưa đăng nhập hoặc thiếu Role -> đá về Login
    if (!accessToken || !userRole) {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }

    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    
    // Admin mặc định được qua
    if (userRole === 'admin') return NextResponse.next();

    // KIỂM TRA QUYỀN
    const allowedRoutes = ROLE_PERMISSIONS[userRole] || [];
    
    // Dùng startsWith để kiểm tra quyền truy cập route con
    const isAllowed = allowedRoutes.some(route => 
      pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
    );

    if (!isAllowed) {
      // Nếu đang ở /dashboard mà bị chặn (do mảng permissions thiếu) -> Loop chắc chắn xảy ra
      // Do đó, nếu path là gốc dashboard, ta nên cho qua nếu user hợp lệ
      if (pathWithoutLocale === '/dashboard' || pathWithoutLocale === '/dashboard/') {
        return NextResponse.next();
      }

      // Nếu truy cập trang con không hợp lệ (vd: /dashboard/admin-only) 
      // thì đá về trang dashboard chính kèm lỗi
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