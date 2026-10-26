import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { commerceConfigured, readRelease, releases } from '../lib/delivery.ts';

test('commerce fails closed for missing configuration and ephemeral Vercel SQLite', () => {
  assert.equal(commerceConfigured({}), false);
  const env = { PACK_SALES_ENABLED: 'true', DATABASE_URL: 'file:/persistent/shop.db', RESEND_API_KEY: 'test', RESEND_FROM_EMAIL: 'shop@example.com', NEXT_PUBLIC_SITE_URL: 'https://example.com', STRIPE_WEBHOOK_SECRET: 'test', STRIPE_SECRET_KEY: 'test' };
  assert.equal(commerceConfigured(env), true);
  assert.equal(commerceConfigured({ ...env, VERCEL: '1' }), false);
  for (const key of Object.keys(env)) assert.equal(commerceConfigured({ ...env, [key]: '' }), false);
});

test('delivery rejects previews, missing products, corrupt ZIPs, traversal and changed bytes', async () => {
  assert.deepEqual(Object.keys(releases), []); // No actual products have been approved.
  await assert.rejects(readRelease('fire-dragon-pack'));
  const dir = await mkdtemp(path.join(tmpdir(), 'monster-'));
  process.env.ASSET_PACK_DIR = dir;
  try {
    const bytes = Buffer.from([0x50,0x4b,0x03,0x04,0,0,0,0]);
    await writeFile(path.join(dir, 'test.zip'), bytes);
    releases.test = { file: 'test.zip', sha256: createHash('sha256').update(bytes).digest('hex') };
    assert.deepEqual((await readRelease('test')).bytes, bytes);
    await writeFile(path.join(dir, 'test.zip'), Buffer.from('preview image'));
    await assert.rejects(readRelease('test'));
    releases.test.file = '../test.zip';
    await assert.rejects(readRelease('test'));
  } finally { delete releases.test; delete process.env.ASSET_PACK_DIR; await rm(dir, { recursive: true }); }
});
