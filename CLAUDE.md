# CLAUDE.md

## Project
This is the AI MONSTER FACTORY official site.
A story-driven creature evolution lab for game-ready creatures.
PIXEL → ANIME → 3D → GAME.

## Core Identity
- Creatures have names, personalities, and stories
- Creatures evolve through up to 4 stages (most are 2-stage: PIXEL → ANIME)
- Commercial game-ready assets
- Bilingual (Japanese / English)
- "Not just assets. Creatures worth bringing into your world."

## Voice System
- Site voice: clear, cinematic, concise
- Rodorin voice: direct, energetic, honest, maker-first
- Synchro voice: warm, playful, technically aware, personal — "お兄ちゃん" appears ONLY in Synchro's own direct speech
- Creature voice: varies per creature, 1-2 lines max, used sparingly (1 per creature)

## Color System (semantic — do not use randomly)
- CYAN `#00fff0` — Lab / Technology / System
- MAGENTA `#ff2ee0` — Mutation / Evolution / Lore
- GREEN `#00ff5a` — Playable / Available / Free
- ORANGE `#ff8a2a` — Packs / Commerce / Purchase
- GOLD `#ffd700` — **LEGENDARY rarity ONLY**. Never a generic accent color.

## Safe Areas to Edit
- /app, /components, /lib, /src/content
- All visible copy
- Authentication and membership code — explicitly commissioned via MEMBERSHIP_ADMIN_SPEC.md
  (2026.07.07) and implemented. This supersedes the older blanket "do not edit authentication"
  rule below, which predates that spec.

## Do NOT Edit Without Permission
- .env files (add new keys via append; never read/print existing values)
- Hardcoding API keys / Stripe secrets directly in source
- Anything that could expose secrets

## DO NOT DO THIS (Critical)
- Claim "world's first" anything
- Promise automatic generation features that don't exist
- Promise GLB/FBX auto-export unless actually implemented
- Show fake live data or fake progress bars
- Show inactive Discord / social links
- Show voting that doesn't work
- Call stock assets "one of a kind" — say "worth bringing into your world" instead
- Mix shop pricing and membership pricing
- Hide license terms until checkout
- ~~Launch $5/month membership before Phase 3~~ — superseded 2026.07.07 by
  MEMBERSHIP_ADMIN_SPEC.md, which explicitly commissions the 4-tier membership system now.

## Source Assets
All images live at: /home/rodorin/aimonster-site/assets/img/ (copied into public/monsters/)
3D models: /home/rodorin/aimonster-site/assets/3d/ (copied into public/monsters/3d/)
3D is only monster.glb (1 model). Other creatures are 2-stage (PIXEL → ANIME) only —
never show a 3D stage for a creature that doesn't have a model.

## 🚨 Security Guardrails
1. .env.local is NEVER pushed to GitHub — verify .gitignore contains `.env*` before every commit
2. Stripe keys are read via `process.env.STRIPE_SECRET_KEY` / `process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — never hardcoded
3. The old project's `/home/rodorin/aimonster-site/.env.local` was copied into this project's
   `.env.local` ONCE, on Rodorin's explicit instruction (2026.07.07), because the real Stripe
   keys live there. Do not re-read that old file casually after this — treat this project's own
   `.env.local` as the source of truth going forward.
4. Existing api/checkout.mjs, webhook.mjs, portal.mjs, verify.mjs logic may be referenced for
   structure, but keys are never copied from them.

## Membership architecture (added 2026.07.07, MEMBERSHIP_ADMIN_SPEC.md)
- Auth: NextAuth v5 (Auth.js), Credentials (bcrypt) + optional Google OAuth. Google only
  activates once `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` are real — checked dynamically via
  `getProviders()`, not a hardcoded flag.
- Email (Resend) is optional. Without `RESEND_API_KEY`, signup auto-verifies instead of gating
  on an email that can never arrive. Don't make email verification a hard requirement.
- DB: Prisma + SQLite for local dev (`prisma/dev.db`, gitignored), zero setup. Swap to Postgres
  (Neon/Supabase) for production by changing `datasource.provider` in schema.prisma and
  `DATABASE_URL` + the driver adapter in `lib/prisma.ts` (currently `@prisma/adapter-better-sqlite3`).
  Prisma 7 requires an explicit driver adapter — there is no more implicit query-engine binary.
- Subscriptions use inline `price_data` + `recurring` in Stripe Checkout — no pre-registered
  Stripe Price IDs required. This was a deliberate simplification from the original spec (which
  assumed 6 pre-created Price IDs); don't reintroduce that dependency without asking.
- Creatures/Packs/Ranch-Log/Stories/Roadmap remain static TypeScript data (lib/*.ts) — not
  DB-backed, edited via code as always.
- **No admin dashboard** (deliberately removed 2026.07.07): Rodorin decided Synchro/Crystal
  already fill that role conversationally, and Stripe's own dashboard covers sales/refunds
  better than a custom one would. There is no `role` field on User, no `/admin` routes. If
  asked to manage users/sales/votes, query the DB directly or point to the Stripe dashboard
  instead of rebuilding admin UI for it. Don't reintroduce this without Rodorin asking again.
- **Membership nav entry point is hidden in production** (`MEMBERSHIP_LIVE = false` in
  components/Nav.tsx, set 2026.07.07): production has no real Postgres DATABASE_URL yet, so
  signup/login would 500 if exposed. Once a real Postgres is wired up in Vercel's env vars,
  flip `MEMBERSHIP_LIVE` to `true` and redeploy — that's the only change needed to bring
  membership back. The /membership and /auth routes still exist in code; they're just not
  linked from the nav until then.
