import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token');

  const loginPathname = '/login';
  const registerPathname = '/register';

  // Jika tidak ada token dan user bukan di halaman login atau register, redirect ke halaman login
  if (!token && request.nextUrl.pathname !== loginPathname && request.nextUrl.pathname !== registerPathname) {
    return NextResponse.redirect(new URL(loginPathname, request.url));
  }

  // Jika ada token dan user mencoba mengakses halaman login atau register, redirect ke halaman home
  if (token && (request.nextUrl.pathname === loginPathname || request.nextUrl.pathname === registerPathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|favicon.ico|_next/image).*)', // Middleware akan dijalankan di semua halaman kecuali API routes dan lainnya
};
