import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['ar', 'en'];
const defaultLocale = 'ar';

const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if path starts with a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  let locale = defaultLocale;

  if (!pathnameHasLocale) {
    // Check if it's an API route or public file
    if (pathname.startsWith('/api/') || pathname.startsWith('/_next/') || pathname.includes('.')) {
      return NextResponse.next();
    }
    
    // Redirect to default locale
    const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  } else {
    locale = pathname.split('/')[1];
  }

  // Auth check for protected routes
  const isPublicPath = PUBLIC_PATHS.some(path => pathname.includes(path));
  const token = request.cookies.get('erp-token')?.value;

  if (!isPublicPath && !token && !pathname.includes('/login')) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  if (pathname.includes('/login') && token) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
};
