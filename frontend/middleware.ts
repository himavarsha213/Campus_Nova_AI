import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('campusnova_token')?.value;
  const role = request.cookies.get('campusnova_role')?.value;
  const { pathname } = request.nextUrl;

  // Define route checks
  const isStudentRoute = pathname.startsWith('/student');
  const isFacultyRoute = pathname.startsWith('/faculty');
  const isAdminRoute = pathname.startsWith('/admin');

  if (isStudentRoute || isFacultyRoute || isAdminRoute) {
    // 1. Unauthenticated users redirected to login
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // 2. Role-Based Access Control Checks
    if (isStudentRoute && role !== 'student' && role !== 'admin') {
      // Students routes only for student or admin
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isFacultyRoute && role !== 'faculty' && role !== 'admin') {
      // Faculty routes only for faculty or admin
      const redirectUrl = role === 'student' ? '/student/dashboard' : '/login';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    if (isAdminRoute && role !== 'admin') {
      // Admin routes ONLY for admin
      const redirectUrl = role === 'faculty' ? '/faculty/dashboard' : (role === 'student' ? '/student/dashboard' : '/login');
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  return NextResponse.next();
}

// Apply middleware only to student, faculty, and admin routes
export const config = {
  matcher: [
    '/student/:path*',
    '/faculty/:path*',
    '/admin/:path*'
  ],
};
