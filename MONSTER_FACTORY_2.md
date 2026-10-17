# MONSTER FACTORY 2.0 — THE LIVING ARCHIVE

AILIS edition for Rodorin. Branch: `feat/ailis-monster-factory-2`.
Baseline: `152aa2b3567601e2ab0029b60d8ebf9b71c86a8b`.

## Experience

- Editorial, orbital specimen archive with six original creatures, bilingual UI and responsive layout.
- Existing Fire Dragon GLB observer (lazy loaded); no invented 3D availability for other products.
- Seven original sellable products; searchable, filterable, price-sortable; compare up to three packs.
- Local-browser field notes, explicitly bookmarks rather than purchases or ownership.
- Lazy-loaded procedural 3D Resonance Field: six crystals, two orbiting hazards, 45 seconds, three HP, win/loss/retry, pause and background auto-pause, keyboard and directional controls.
- The playground is an independent procedural demonstration, not a claim about assets included in paid packs.

## Preservation boundaries

The original `app/page.tsx` is preserved byte-for-byte at `app/classic/page.tsx`.
Every other original tracked file is unchanged. This includes pack/creature data,
checkout API, Stripe configuration, webhook, auth, downloads, license pages,
all original product/detail routes, assets, package manifest and lockfile.
No production promotion, main-branch merge, payment or database migration was performed.
Local preview has no production credentials. Real charge/download fulfilment is not tested.

## Verification

```sh
npm ci
npm run build
npx tsc --noEmit
npx eslint app/page.tsx app/classic/page.tsx components/factory lib/resonance.ts
node --test tests/factory-2.test.mjs
```

Start a local preview without production secrets:

```sh
AUTH_TRUST_HOST=true AUTH_SECRET=local-preview-only-not-a-production-secret npm run start -- --hostname 127.0.0.1 --port 6179
node tests/browser-smoke.cjs
```

Browser smoke uses an isolated headless Chromium profile and CDP; default binary
`/home/rodorin/.local/bin/google-chrome`, override via `CHROME_BIN`.
Screenshots are written to `test-artifacts/` (not committed). Checks include filters,
search, sort, persistence, comparison, actual GLB canvas, keyboard crystal collection,
pause, auto-pause, 390px overflow, language toggle, classic/all seven pack routes,
and absence of browser exceptions, console errors and failed requests.

## Scope and known limitations

This is a curated first-party marketplace, not a multi-vendor platform. No seller
onboarding, payouts, asset uploads or new product promises are added. Three.js
requires WebGL; field notes live only in this browser. Existing dependencies have
audit warnings; no forced dependency upgrade was mixed into this design change.
Existing authentication/deployment configuration must be reviewed separately
before promoting the preview. Checkout must be verified in an appropriate Stripe
test environment before any production promotion.
