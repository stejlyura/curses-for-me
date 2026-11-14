import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedSession } from '@/lib/server-auth';
import { readLearningStateFromDb, writeLearningStateToDb } from '@/lib/firestore-state';

const NO_STORE_HEADERS = { 'Cache-Control': 'no-store, private' };

export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = await requireAuthenticatedSession(req);
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401, headers: NO_STORE_HEADERS }
    );
  }

  try {
    const state = await readLearningStateFromDb();
    return NextResponse.json({ state }, { status: 200, headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error('GET /api/state failed:', error);
    return NextResponse.json(
      { error: 'Не удалось получить прогресс из базы данных.' },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  const session = await requireAuthenticatedSession(req);
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401, headers: NO_STORE_HEADERS }
    );
  }

  try {
    const body = (await req.json()) as { state?: unknown };
    if (!body || typeof body !== 'object' || !('state' in body)) {
      return NextResponse.json(
        { error: 'Некорректное тело запроса.' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const saved = await writeLearningStateToDb(session.sub, body.state);
    return NextResponse.json({ state: saved }, { status: 200, headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error('PUT /api/state failed:', error);
    return NextResponse.json(
      { error: 'Не удалось сохранить прогресс в базу данных.' },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
