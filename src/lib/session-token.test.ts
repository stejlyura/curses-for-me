import test from 'node:test';
import assert from 'node:assert/strict';
import {
  signSessionToken,
  verifyCredentials,
  verifyPasswordDigest,
  verifySessionToken,
} from './session-token';

const TEST_SECRET = 'unit-test-session-secret-0123456789abcdef';

test('verifyCredentials validates exact credentials and rejects wrong ones', () => {
  assert.equal(verifyCredentials('admin', 'gangstervegas', 'admin', 'gangstervegas'), true);
  assert.equal(verifyCredentials('admin', 'wrongpass', 'admin', 'gangstervegas'), false);
  assert.equal(verifyCredentials('user', 'gangstervegas', 'admin', 'gangstervegas'), false);
  assert.equal(verifyCredentials('', 'gangstervegas', 'admin', 'gangstervegas'), false);
  assert.equal(
    verifyPasswordDigest(
      'gangstervegas',
      'marketolog-salt-v1',
      '14b9b99a49807b3c81c5bc47d6f3607bd9f1609a98cc2bd3ee37b26e8c79cda4'
    ),
    true
  );
  assert.equal(
    verifyPasswordDigest(
      'wrongpass',
      'marketolog-salt-v1',
      '14b9b99a49807b3c81c5bc47d6f3607bd9f1609a98cc2bd3ee37b26e8c79cda4'
    ),
    false
  );
});

test('signSessionToken and verifySessionToken roundtrip valid token and reject tampered/expired', () => {
  const now = 1_700_000_000_000;
  const token = signSessionToken(
    { sub: 'admin', iat: now, exp: now + 60_000 },
    TEST_SECRET
  );

  const verified = verifySessionToken(token, TEST_SECRET, now + 10_000);
  assert.deepEqual(verified, { sub: 'admin', iat: now, exp: now + 60_000 });

  // Expired
  assert.equal(verifySessionToken(token, TEST_SECRET, now + 60_001), null);

  // Tampered signature
  const [body, sig] = token.split('.');
  const tampered = `${body}.${sig.slice(0, -1)}${sig.endsWith('a') ? 'b' : 'a'}`;
  assert.equal(verifySessionToken(tampered, TEST_SECRET, now + 1_000), null);

  // Wrong secret
  assert.equal(verifySessionToken(token, 'other-secret-0123456789abcdef', now + 1_000), null);
});
