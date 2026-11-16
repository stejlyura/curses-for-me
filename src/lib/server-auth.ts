import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import {
  SessionPayload,
  signSessionToken,
  timingSafeStringEqual,
  verifyCredentials,
  verifyPasswordDigest,
  verifySessionToken,
} from './session-token';

export const SESSION_COOKIE_NAME = 'marketolog_session';
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD_SALT = 'marketolog-salt-v1';
const DEFAULT_PASSWORD_DIGEST =
  '14b9b99a49807b3c81c5bc47d6f3607bd9f1609a98cc2bd3ee37b26e8c79cda4';

const getSessionSecret = (): string => {
  const envSecret = process.env.SESSION_SECRET?.trim();
  if (envSecret && envSecret.length >= 24 && !envSecret.startsWith('replace-')) {
    return envSecret;
  }
  return crypto
    .createHmac('sha256', '01fd4bf1-4249-4b19-abba-eb364214818d:gen-lang-client-0040909997')
    .update('marketolog-academy:session-signing-secret-v1')
    .digest('hex');
};

const sanitizeAuthText = (value: string): string =>
  value.replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/\u00A0/g, ' ');

const normalizeEnvSecret = (raw: string | undefined): string => {
  if (!raw) return '';
  let val = sanitizeAuthText(raw).trim();
  if (
    val.length >= 2 &&
    ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
  ) {
    val = val.slice(1, -1).trim();
  }
  return val;
};

export const getExpectedUsername = (): string => {
  const custom = normalizeEnvSecret(process.env.APP_LOGIN_USER);
  return custom.length > 0 ? custom : DEFAULT_USERNAME;
};

export const authenticateCredentials = (username: string, password: string): boolean => {
  const expectedUser = getExpectedUsername();
  const normalizedUser = sanitizeAuthText(username).trim().toLowerCase();
  const normalizedExpectedUser = sanitizeAuthText(expectedUser).trim().toLowerCase();
  const cleanPass = sanitizeAuthText(password);
  const trimmedPass = cleanPass.trim();
  const customPass = normalizeEnvSecret(process.env.APP_LOGIN_PASS);

  if (customPass.length > 0) {
    return (
      verifyCredentials(normalizedUser, cleanPass, normalizedExpectedUser, customPass) ||
      verifyCredentials(normalizedUser, trimmedPass, normalizedExpectedUser, customPass)
    );
  }

  return (
    timingSafeStringEqual(normalizedUser, normalizedExpectedUser) &&
    (verifyPasswordDigest(cleanPass, DEFAULT_PASSWORD_SALT, DEFAULT_PASSWORD_DIGEST) ||
      verifyPasswordDigest(trimmedPass, DEFAULT_PASSWORD_SALT, DEFAULT_PASSWORD_DIGEST))
  );
};

export const createSessionCookieValue = (username: string): string => {
  const now = Date.now();
  return signSessionToken(
    {
      sub: username,
      iat: now,
      exp: now + SESSION_TTL_SECONDS * 1000,
    },
    getSessionSecret()
  );
};

export const extractBearerToken = (req?: NextRequest): string | undefined => {
  if (!req) return undefined;
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return undefined;
  const match = /^Bearer\s+(.+)$/i.exec(authHeader.trim());
  return match?.[1]?.trim() || undefined;
};

export const requireAuthenticatedSession = async (
  req?: NextRequest
): Promise<SessionPayload | null> => {
  try {
    let rawCookie: string | undefined;
    if (req) {
      rawCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    } else {
      const store = await cookies();
      rawCookie = store.get(SESSION_COOKIE_NAME)?.value;
    }

    const candidates = [rawCookie, extractBearerToken(req)].filter(
      (val): val is string => typeof val === 'string' && val.length > 0
    );

    for (const candidate of candidates) {
      const payload = verifySessionToken(candidate, getSessionSecret());
      if (payload && timingSafeStringEqual(payload.sub, getExpectedUsername())) {
        return payload;
      }
    }

    return null;
  } catch {
    return null;
  }
};

export const shouldUseSecureCookie = (req: NextRequest): boolean => {
  const proto = req.headers.get('x-forwarded-proto');
  if (proto) {
    return proto.split(',')[0].trim() === 'https';
  }
  return req.nextUrl.protocol === 'https:';
};

export const buildSessionCookieOptions = (
  req: NextRequest,
  value: string,
  maxAge: number
) => {
  const isSecure = shouldUseSecureCookie(req);
  if (isSecure) {
    return {
      name: SESSION_COOKIE_NAME,
      value,
      httpOnly: true,
      sameSite: 'none' as const,
      secure: true,
      partitioned: true,
      path: '/',
      maxAge,
    };
  }

  return {
    name: SESSION_COOKIE_NAME,
    value,
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: false,
    path: '/',
    maxAge,
  };
};
