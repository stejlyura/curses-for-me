import crypto from 'node:crypto';

export interface SessionPayload {
  sub: string;
  iat: number;
  exp: number;
}

const toBase64Url = (input: string | Buffer): string =>
  Buffer.from(input).toString('base64url');

const fromBase64Url = (input: string): string =>
  Buffer.from(input, 'base64url').toString('utf8');

const sha256Buffer = (value: string): Buffer =>
  crypto.createHash('sha256').update(value, 'utf8').digest();

export const timingSafeStringEqual = (a: string, b: string): boolean => {
  const hashA = sha256Buffer(a);
  const hashB = sha256Buffer(b);
  return crypto.timingSafeEqual(hashA, hashB);
};

export const verifyCredentials = (
  username: string,
  password: string,
  expectedUsername: string,
  expectedPassword: string
): boolean => {
  if (!username || !password || !expectedUsername || !expectedPassword) {
    return false;
  }
  const userMatch = timingSafeStringEqual(username, expectedUsername);
  const passMatch = timingSafeStringEqual(password, expectedPassword);
  return userMatch && passMatch;
};

export const verifyPasswordDigest = (
  password: string,
  salt: string,
  expectedDigestHex: string
): boolean => {
  if (!password || !expectedDigestHex) return false;
  const computedHex = crypto
    .createHash('sha256')
    .update(`${salt}:${password}`, 'utf8')
    .digest('hex');
  return timingSafeStringEqual(computedHex, expectedDigestHex);
};

export const signSessionToken = (payload: SessionPayload, secret: string): string => {
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const sig = crypto
    .createHmac('sha256', secret)
    .update(encodedPayload)
    .digest('base64url');
  return `${encodedPayload}.${sig}`;
};

export const verifySessionToken = (
  token: string | undefined,
  secret: string,
  nowMs: number = Date.now()
): SessionPayload | null => {
  if (!token || !secret) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, providedSig] = parts;
  if (!encodedPayload || !providedSig) return null;

  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(encodedPayload)
    .digest('base64url');

  if (!timingSafeStringEqual(providedSig, expectedSig)) {
    return null;
  }

  try {
    const decoded = JSON.parse(fromBase64Url(encodedPayload)) as Partial<SessionPayload>;
    if (
      typeof decoded.sub !== 'string' ||
      !decoded.sub ||
      typeof decoded.iat !== 'number' ||
      typeof decoded.exp !== 'number'
    ) {
      return null;
    }

    if (decoded.exp <= nowMs) {
      return null;
    }

    return {
      sub: decoded.sub,
      iat: decoded.iat,
      exp: decoded.exp,
    };
  } catch {
    return null;
  }
};
