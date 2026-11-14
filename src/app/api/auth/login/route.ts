import { NextRequest, NextResponse } from 'next/server';
import {
  authenticateCredentials,
  buildSessionCookieOptions,
  createSessionCookieValue,
  SESSION_TTL_SECONDS,
} from '@/lib/server-auth';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as { username?: unknown; password?: unknown };
    const username = typeof body.username === 'string' ? body.username.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Введите логин и пароль.' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    if (!authenticateCredentials(username, password)) {
      return NextResponse.json(
        { error: 'Неверный логин или пароль.' },
        { status: 401, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const token = createSessionCookieValue(username);
    const response = NextResponse.json(
      { authenticated: true, username, token },
      { status: 200, headers: { 'Cache-Control': 'no-store, private' } }
    );

    response.cookies.set(buildSessionCookieOptions(req, token, SESSION_TTL_SECONDS));

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Некорректный формат запроса.' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
