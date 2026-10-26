import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sendPurchaseEmail } from '../lib/email.ts';

test('purchase email requires configuration, uses canonical link and idempotency, propagates failure', async () => {
  const saved = Object.fromEntries(['RESEND_API_KEY', 'RESEND_FROM_EMAIL', 'NEXT_PUBLIC_SITE_URL'].map(k => [k, process.env[k]]));
  const oldFetch = globalThis.fetch;
  try {
    delete process.env.RESEND_API_KEY;
    await assert.rejects(sendPurchaseEmail('buyer@example.com', 'a'.repeat(48), 'cs_test'));
    Object.assign(process.env, { RESEND_API_KEY: 'fake-test-key', RESEND_FROM_EMAIL: 'shop@example.com', NEXT_PUBLIC_SITE_URL: 'https://shop.example.com' });
    let request;
    globalThis.fetch = async (url, options) => { request = { url, options }; return { ok: true }; };
    await sendPurchaseEmail('buyer@example.com', 'a'.repeat(48), 'cs_test');
    assert.equal(request.options.headers['Idempotency-Key'], 'purchase/cs_test');
    const body = JSON.parse(request.options.body);
    assert.equal(body.to, 'buyer@example.com');
    assert.ok(body.text.includes('https://shop.example.com/api/download/' + 'a'.repeat(48)));
    globalThis.fetch = async () => ({ ok: false, status: 429 });
    await assert.rejects(sendPurchaseEmail('buyer@example.com', 'a'.repeat(48), 'cs_test'), /429/);
  } finally {
    globalThis.fetch = oldFetch;
    for (const [k,v] of Object.entries(saved)) { if (v === undefined) delete process.env[k]; else process.env[k] = v; }
  }
});
