import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fulfillPack } from '../lib/fulfillment-core.ts';

function fixture() {
  const rows = new Map();
  const sent = [];
  const deps = {
    prisma: { purchase: {
      async upsert({ where, create }) {
        if (!rows.has(where.stripeSessionId)) rows.set(where.stripeSessionId, { id: 'order', ...create });
        return { ...rows.get(where.stripeSessionId) };
      },
      async update({ data }) { Object.assign([...rows.values()][0], data); },
    } },
    findPack: slug => slug === 'test' ? { slug: 'test' } : undefined,
    readRelease: async () => ({ bytes: Buffer.from("fixture") }),
    sendPurchaseEmail: async (...args) => { sent.push(args); },
  };
  const session = { id: 'cs_test', mode: 'payment', payment_status: 'paid', metadata: { product_id: 'test', source: 'aimonster-factory-v2' }, customer_details: { email: 'buyer@example.com' }, amount_total: 990, currency: 'usd', payment_intent: 'pi_test' };
  return { deps, rows, sent, session };
}

test('guest and member receive one persistent order/token and one email on sequential replay', async () => {
  for (const userId of ['', 'member']) {
    const f = fixture(); f.session.metadata.userId = userId;
    await fulfillPack(f.session, f.deps);
    const order = [...f.rows.values()][0];
    assert.equal(order.userId, userId || null);
    assert.equal(order.buyerEmail, 'buyer@example.com');
    assert.match(order.downloadToken, /^[a-f0-9]{48}$/);
    assert.equal(order.packSlug, 'test');
    await fulfillPack(f.session, f.deps);
    assert.equal(f.rows.size, 1); assert.equal(f.sent.length, 1);
  }
});
test('unpaid and unrelated sessions never create entitlements', async () => {
  const f = fixture(); f.session.payment_status = 'unpaid';
  await fulfillPack(f.session, f.deps); assert.equal(f.rows.size, 0);
  f.session.payment_status = 'paid'; f.session.metadata.source = 'other';
  await fulfillPack(f.session, f.deps); assert.equal(f.rows.size, 0);
});
test('delayed success and zero-cost promotion fulfill only once paid', async () => {
  const f = fixture(); f.session.payment_status = 'unpaid';
  await fulfillPack(f.session, f.deps);
  f.session.payment_status = 'no_payment_required'; f.session.amount_total = 0;
  await fulfillPack(f.session, f.deps); assert.equal(f.sent.length, 1);
});
test('email failure retries same order/token; missing files retain order without sending', async () => {
  const f = fixture(); f.deps.sendPurchaseEmail = async () => { throw Error('provider down'); };
  await assert.rejects(fulfillPack(f.session, f.deps));
  const token = [...f.rows.values()][0].downloadToken;
  f.deps.sendPurchaseEmail = async (...args) => f.sent.push(args);
  await fulfillPack(f.session, f.deps);
  assert.equal(f.sent[0][1], token); assert.equal(f.rows.size, 1);
  const g = fixture(); g.deps.readRelease = async () => { throw Error('missing ZIP'); };
  await assert.rejects(fulfillPack(g.session, g.deps));
  assert.equal(g.rows.size, 1); assert.equal(g.sent.length, 0);
});
