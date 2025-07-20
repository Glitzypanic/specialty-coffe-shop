import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';

export async function middleware(req: NextRequest) {
  const session = await getServerSession();
  const { pathname } = req.nextUrl;

  if (session && (pathname === '/auth/signin' || pathname === '/auth/signup')) {
    return NextResponse.redirect(new URL('/products', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/:path*'],
};
