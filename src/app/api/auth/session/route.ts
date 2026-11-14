import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedSession } from '@/lib/server-auth';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = await requireAuthenticatedSession(req);
  if (!session) {
    return NextResponse.json(
      { authenticated: false, username: null },
      { status: 200, headers: { 'Cache-Control': 'no-store, private' } }
    );
  }

  return NextResponse.json(
    { authenticated: true, username: session.sub },
    { status: 200, headers: { 'Cache-Control': 'no-store, private' } }
  );
}
