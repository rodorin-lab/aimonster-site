# Living Arcade preview verification

## Passed

- `npm run build`: Next.js production build, TypeScript and static generation.
- `npx eslint components/arcade app/arcade app/archive app/page.tsx lib/arcade.ts`: no errors.
- `node --experimental-strip-types --test tests/factory-2.test.mjs`: 4 passing tests, including byte-for-byte preservation of original tracked files except the home entry point.
- `node --experimental-strip-types --test tests/arcade.test.mjs`: 2 passing tests.
- Headless Google Chrome / Playwright, desktop 1440×1000 and mobile 390×844: no document horizontal overflow.
- All six PLAY buttons load a game canvas. Closing each dialog removes the iframe, stopping its runtime.
- Opening all six games and reloading restores six visited passport stamps.
- 3D hangar creates a canvas successfully.
- No browser page errors during this verification sequence.

Screenshots are local in `test-artifacts/`: neon-desktop.png, neon-mobile.png, arcade-3d.png and game-*.png.

## Known limits

- Full-game completion, all missions, all touchscreen gameplay, gamepad controls and actual Quest performance are not verified.
- No immersive WebXR implementation is claimed.
- Global `npm run lint -- --quiet` fails on pre-existing files, including membership render-time `Date.now()` and other existing hook rules. Those files were left unchanged.
- Next.js reports the existing middleware-to-proxy deprecation warning; this preview does not migrate authentication middleware.
- No actual checkout, payment, webhook delivery or production membership database was exercised. Original implementations and product data are preserved, not newly certified.
- Games without screenshots use clearly decorative art rather than unrelated commercial reference images.
