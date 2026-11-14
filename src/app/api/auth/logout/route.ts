import { NextRequest, NextResponse } from 'next/server';
import { buildSessionCookieOptions } from '@/lib/server-auth';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const response = NextResponse.json(
    { authenticated: false },
    { status: 200, headers: { 'Cache-Control': 'no-store, private' } }
  );

  response.cookies.set(buildSessionCookieOptions(req, '', 0));

  return response;
}
