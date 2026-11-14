import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, shouldUseSecureCookie } from '@/lib/server-auth';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const response = NextResponse.json(
    { authenticated: false },
    { status: 200, headers: { 'Cache-Control': 'no-store, private' } }
  );

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    secure: shouldUseSecureCookie(req),
  });

  return response;
}
