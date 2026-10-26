# Purchase delivery repair — 2026-10-27

## Current finding and safe default

No sale-ready ZIPs, sprite sheets, JSON metadata, license files, quick-start README or advertised bonus PDF are present in this checkout. `public/monsters` contains previews and one GLB; those are not proof of a complete advertised pack. No substitute ZIP has been fabricated. All pack sales now fail closed by default and pack detail pages show preparation status. Brand, catalog, pricing and subscription behavior remain intact.

This patch is not proof that production purchases have been delivered. It does not deploy infrastructure, migrate the live database, send real customer emails or charge real cards.

## Flow

- Checkout requires explicit `PACK_SALES_ENABLED=true`, configured Stripe webhook, email sender, canonical HTTPS site URL, a configured SQLite database and an approved ZIP. Database/schema and file-integrity checks run before Stripe creates a payable session.
- Current database adapter is SQLite. Vercel pack checkout is deliberately blocked even with the sales flag: its filesystem is not a persistent order database. Before enabling Vercel sales, migrate schema, CLI configuration and runtime adapter to a persistent database and replace this guard with a corresponding durable-store readiness check. Do not simply remove `!env.VERCEL`.
- Verified `checkout.session.completed` and `checkout.session.async_payment_succeeded` events fulfill only paid/no-payment-required sessions from this site's metadata source. Guests use Stripe's collected email; members retain their account association. No automatic association by unverified email address.
- A unique Stripe Checkout session ID deduplicates purchase rows. Tokens are random 192-bit bearer secrets with a 30-day expiry. Paid records are retained before file or email delivery attempts, including old sessions whose product is unavailable.
- ZIP delivery validates an explicit filename, resolved private path, ZIP signature and SHA-256. It never redirects to preview images. Checkout pins the approved ZIP hash in Stripe metadata and fulfillment persists it on the purchase; legacy sessions pin it at first successful fulfillment. Later replacement fails rather than delivering different bytes. Keep purchased releases immutable and available for the full download period.
- Resend receives a stable idempotency key per Checkout session. `deliveryEmailSentAt` means the provider accepted the request, not proof of inbox delivery. Send failures throw to make Stripe retry. Concurrent/replayed events share the row/token and provider idempotency key. Resend's deduplication window is finite; reconcile a crash after send and before DB marking before manually replaying an old event.
- Success page verifies Stripe and reports email acceptance or delivery pending; it does not grant entitlement based on a browser redirect. Refresh to recheck pending delivery. Member purchase history continues to use account-linked purchases.
- Full `charge.refunded` events revoke download tokens. Partial refunds retain access. Previously downloaded files cannot be revoked.

## Prepare a genuine pack

1. Verify that every file and format promised on the existing product page is present, including license terms, sprite sheets/JSON, bonus PDF and README where advertised. Correct product copy before release if contents differ.
2. Store a reviewed, non-empty ZIP outside `public`, at an absolute persistent `ASSET_PACK_DIR`. Use a simple filename like `fire-dragon-pack-v1.zip`. Do not commit paid content or secrets to this public repository.
3. Compute `sha256sum` and add the matching slug, filename and SHA-256 to the server-only `releases` map in `lib/delivery.ts`. Never edit an existing purchased release in place. Current implementation buffers ZIPs in memory; use a private object store with short-lived signed URLs for large packs before launch.
4. Back up the real DB. Run `npx prisma migrate deploy`, `npx prisma generate` against the supported persistent SQLite installation. The migration preserves existing member purchases and permits guests; unique token/session constraints prevent accidental duplicates. Resolve any preexisting duplicate tokens before migration.
5. Configure environment variables without committing them: `DATABASE_URL` (`file:/absolute/persistent/shop.db`), `ASSET_PACK_DIR`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (verified domain), `NEXT_PUBLIC_SITE_URL` (canonical HTTPS), `PACK_SALES_ENABLED` (leave false until readiness review). Ensure disk/DB backup and sender delivery monitoring.

## Stripe test-mode acceptance run (not yet executed)

Use a separate persistent test DB, reviewed ZIP, test Stripe keys and an inbox you control. Do not use live keys or send tests to customers. A local HTTPS tunnel can supply `NEXT_PUBLIC_SITE_URL` and deliverable email links.

1. Install dependencies with Node 24: `npm ci`; run `npm test`, `npx prisma migrate deploy`, `npm run build`. Start the app. Set the sales flag only in this isolated test environment.
2. `stripe listen --events checkout.session.completed,checkout.session.async_payment_succeeded,charge.refunded --forward-to localhost:3000/api/webhook`. Configure its displayed webhook signing secret locally without sharing it.
3. Buy an approved pack while signed out via the actual site checkout. Use Stripe test card `4242 4242 4242 4242`, a future expiry and any valid CVC. Generic `stripe trigger` fixtures lack this app's product metadata and are not an end-to-end checkout test.
4. Confirm one Purchase with null userId, buyer email, session/payment IDs, amount/currency, token, hash and email timestamp. Open the delivered link and verify ZIP contents/hash match the purchased product. Check the success page's status.
5. Repeat while signed in; confirm member history can download. Replay the actual test event using Stripe CLI/dashboard; confirm one row/token and no second email within provider deduplication window. Test concurrent replay as well.
6. Exercise delayed payment: completed/unpaid must not grant a token; async success must fulfill. Invalid webhook signatures must return 400. Unknown/expired tokens return 404/410. Corrupt/missing/replaced ZIPs return 503; sales preflight must reject before charging. Stop Resend temporarily, verify webhook fails and paid row remains; restore and replay to deliver the same token. Full test refund must revoke access.
7. Restore sales disabled after testing until genuine content and durable production storage are ready. Review historical Stripe paid sessions against purchase records before any controlled reconciliation. Old records lack session IDs; do not blindly replay old events and create duplicates of legacy records.

## Validation in this repair environment

Tests cover sale gating, Vercel rejection, approved-file integrity/path checks, guest/member persistence, sequential webhook replay, unpaid sessions, delayed/zero-cost fulfillment and failed email/file retries. The initial and new SQLite migrations were executed in an in-memory database and checked for guest insertion and session uniqueness. These are local automated checks, not a completed Stripe payment or verified email inbox delivery.

Additional checks: purchase-email tests mock HTTP only (no mail was sent); TypeScript and targeted ESLint checks passed after dependency installation. Stripe/Resend/database credentials are absent from this execution environment, so real Stripe test checkout and inbox receipt remain unverified.

Production build: initial attempt failed fetching the existing Google Fonts over TLS. Retrying with `NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1 npm run build` succeeded, including TypeScript and generation of all 51 pages. No product/brand fonts were changed.
