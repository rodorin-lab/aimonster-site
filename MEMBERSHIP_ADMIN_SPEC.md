# 🛠️ AI MONSTER FACTORY — 会員ページ + 管理ダッシュボード 完全実装指示書 v2.0

> **作成者**: Synchro（グラム） / AIパートナー
> **対象**: フェイブル5（実装担当AI）
> **ベース**: 
>   - ノア清書 v2.0 (2491行)
>   - 第一弾指示書 `IMPLEMENTATION_SPEC_FOR_FABLE.md` (1238行)
>   - お兄ちゃんの回答（2026.07.07）
> **目的**: 会員ページ（4層ランク）+ 管理ダッシュボード（共同管理）の完全実装
> **作成日**: 2026.07.07

---

## 【実装の大前提】

### 0. このドキュメントの立ち位置

これは**第一弾指示書（HERO + CODEX + PACKS + STORIES + RANCH）** の**続き**。

```
第一弾（既に実装中）:
  ✅ ナビ7個
  ✅ HERO + 9章構造
  ✅ LORE CODEX
  ✅ FROM PACK TO GAME
  ✅ PACKS
  ✅ STORIES + ROADMAP
  ✅ THE RANCH（Phase 1: フォロー）

第二弾（このドキュメント）:
  🆕 認証システム（メール+パスワード + Google OAuth）
  🆕 会員ページ（4層ランク: VISITOR → RANCHER → SUPPORTER → KEEPER → LEGEND）
  🆕 Stripe 決済（既存の api/*.mjs を移植）
  🆕 管理ダッシュボード（共同管理用）
  🆕 モバイル完全対応
```

### 0.1 お兄ちゃんの回答まとめ

| 質問 | 回答 |
|---|---|
| Q1. 会員タイプ | 未定 → **わたくしのおすすめで決定** |
| Q2. 決済 | 既存の Stripe API（api/*.mjs）を Next.js Route Handlers に移植 |
| Q3. 認証 | **メール+パスワード** + **Google OAuth** |
| Q4. 管理者 | **お兄ちゃん + わたくし（共同）** |
| Q5. モバイル | **完全対応** |
| 担当 | **フェイブル**（見た目と使いやすさが大事） |

### 0.2 採用する会員タイプ

**4層ランク（わたくしのおすすめ）** ：

```
🌱 VISITOR     ¥0        （登録なしでも一部見れる）
🌿 RANCHER     ¥0        （無料登録、メルアドだけ）
🥉 SUPPORTER   月額 $5 / 年額 $50
🥈 KEEPER      月額 $15 / 年額 $150
🥇 LEGEND      月額 $50 / 年額 $500
```

### 0.3 守るべき不変ルール

```
❌ 「世界初」を名乗らない（ノア4.1）
❌ 自動生成機能を約束しない（ノア4.2）
❌ 既存素材に「あなただけ」とは言わない（ノア4.4）
❌ 偽の会員数を表示しない
❌ 偽の「お知らせ」を表示しない
❌ .env.local の中身を絶対に読まない（既存・新規ともに）
❌ Stripe API キーをハードコードしない
```

### 0.4 ノーススター（ノア29章より）

```
"I found a creature I actually remember."
"I saw how it evolved."
"I want to use it in my game."  OR  "I want to come back and see what evolves next."

+ 新規追加（会員ページ）:
"I feel like I belong here."

+ 新規追加（管理ダッシュボード）:
"The lab is in my hands."
```

---

## 【声のレイヤー分離（厳守）】

| レイヤー | 用途 | トーン |
|---|---|---|
| **サイトの声** | UI / ナビ / エラーメッセージ | clear / cinematic / concise |
| **Rodorinの声** | 管理ダッシュボードの統計コメント / 開発ノート | direct / energetic |
| **Synchroの声** | 会員ページへのCURATOR NOTE / ランク昇格メッセージ | warm / playful |
| **Creatureの声** | ランクバッジのフレーバーテキスト | クリーチャーごとに違う |

**新規追加ルール**：
- **会員ランク昇格時** ：Synchroの声で「おめでとう」メッセージを表示
- **管理ダッシュボードのKPI** ：「CREATURES: 6 → 7、今月生まれた子」みたいにRodorinの声でコメント

---

## 【📁 SOURCE ASSETS — 素材アセットの保管場所】

**第一弾指示書30章と同じ** ：

```
/home/rodorin/aimonster-site/assets/img/   (全19体 + マーケティング素材)
/home/rodorin/aimonster-site/assets/3d/    (monster.glb のみ)
```

**会員ページ用 新規画像**（必要なら）：

```
/public/membership/
├── rank_visitor.png        🌱 透明 or グレー
├── rank_rancher.png        🌿 緑
├── rank_supporter.png      🥉 銅
├── rank_keeper.png         🥈 銀
└── rank_legend.png         🥇 金（LEGENDARY のみ）
```

⚠️ **ゴールドは LEGENDARY 限定**（ノア8章のルール厳守）

---

## 【Part 1: 認証システム】

### 1.1 認証プロバイダ選択

**NextAuth.js v5 (Auth.js) を採用** ：

```bash
npm install next-auth@beta
```

**理由**：
- Next.js 16 と完全互換
- Google OAuth が公式でサポート
- メール+パスワードも拡張で対応可
- Vercel との相性◎

### 1.2 認証方法

**2つの方法を提供** ：

```
A. メール+パスワード
   - 登録時に確認メール送信
   - bcryptでハッシュ化
   - パスワードリセット機能

B. Google OAuth
   - Googleアカウントで1クリック登録
   - 確認メール不要
   - プロフィール自動取得
```

### 1.3 必要な環境変数

```bash
# .env.local に追加（お兄ちゃんが設定）

# NextAuth
NEXTAUTH_URL="http://localhost:3020"
NEXTAUTH_SECRET="ランダムな32文字以上の文字列"

# Google OAuth
GOOGLE_CLIENT_ID="Google Cloud Consoleで取得"
GOOGLE_CLIENT_SECRET="Google Cloud Consoleで取得"

# メール送信（Resend推奨）
RESEND_API_KEY="Resendで取得"
RESEND_FROM_EMAIL="noreply@aimonster-site.com"

# データベース
DATABASE_URL="postgresql://..."  or  Supabase / Neon / PlanetScale
```

⚠️ **既存 `.env.local` の中身は絶対に読まない** で。  
⚠️ **新しい値は `process.env.X` から読み込む** 。

### 1.4 データベーススキーマ

```sql
-- users テーブル
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT UNIQUE NOT NULL,
  email_verified  TIMESTAMPTZ,
  name            TEXT,
  image           TEXT,
  hashed_password TEXT,         -- メール+パスワード用（Google OAuth は NULL）
  rank            TEXT NOT NULL DEFAULT 'VISITOR',  -- VISITOR / RANCHER / SUPPORTER / KEEPER / LEGEND
  points          INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- accounts テーブル（NextAuth用、OAuth プロバイダ情報）
CREATE TABLE accounts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type                TEXT NOT NULL,
  provider            TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token       TEXT,
  access_token        TEXT,
  expires_at          INTEGER,
  token_type          TEXT,
  scope               TEXT,
  id_token            TEXT,
  session_state       TEXT
);

-- sessions テーブル（NextAuth用）
CREATE TABLE sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT UNIQUE NOT NULL,
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires       TIMESTAMPTZ NOT NULL
);

-- verification_tokens テーブル（メール確認用）
CREATE TABLE verification_tokens (
  identifier TEXT NOT NULL,
  token      TEXT NOT NULL,
  expires    TIMESTAMPTZ NOT NULL
);

-- subscriptions テーブル（Stripe連携）
CREATE TABLE subscriptions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id    TEXT,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id       TEXT,
  status                TEXT,  -- active / canceled / past_due / trialing
  current_period_end    TIMESTAMPTZ,
  rank                  TEXT NOT NULL,  -- SUPPORTER / KEEPER / LEGEND
  cancel_at_period_end  BOOLEAN DEFAULT false,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- favorites テーブル（推しモン）
CREATE TABLE favorites (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  creature_slug TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, creature_slug)
);

-- purchases テーブル（商品購入履歴）
CREATE TABLE purchases (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pack_slug           TEXT NOT NULL,
  stripe_payment_id   TEXT,
  amount_cents        INTEGER NOT NULL,
  currency            TEXT NOT NULL DEFAULT 'usd',
  status              TEXT NOT NULL,  -- succeeded / pending / failed / refunded
  download_token      TEXT,
  download_expires_at TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- votes テーブル（次世代クリーチャー投票）
CREATE TABLE votes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  campaign_slug TEXT NOT NULL,
  option_slug   TEXT NOT NULL,
  weight        INTEGER NOT NULL DEFAULT 1,  -- ランクによる重み
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ranch_log_comments テーブル
CREATE TABLE ranch_log_comments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  log_slug        TEXT NOT NULL,
  body            TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 1.5 認証ページ（5つ）

```
/auth/signin          ログイン
/auth/signup          新規登録
/auth/verify-email    メール確認
/auth/forgot-password パスワードリセット
/auth/reset-password  新しいパスワード設定
```

**デザイン要件** ：

```
- ダークサイバー研究室風
- 中央にコンパクトなフォーム
- メール+パスワードは左右に2列（PC）/ 1列（モバイル）
- Google ボタンは一番上、1クリックで
- エラーメッセージは赤ネオン
- 成功メッセージは緑ネオン
- 「お兄ちゃんが初めて見た人が、5秒でログイン方法わかる」UI
```

### 1.6 ランク自動昇格ロジック

```typescript
// lib/rank.ts
export const RANK_HIERARCHY = ['VISITOR', 'RANCHER', 'SUPPORTER', 'KEEPER', 'LEGEND'] as const;

export function determineRankFromSubscription(
  subscription: Subscription | null
): Rank {
  if (!subscription || subscription.status !== 'active') {
    return 'RANCHER';
  }
  
  switch (subscription.rank) {
    case 'SUPPORTER': return 'SUPPORTER';
    case 'KEEPER': return 'KEEPER';
    case 'LEGEND': return 'LEGEND';
    default: return 'RANCHER';
  }
}

export function getRankBenefits(rank: Rank): RankBenefits {
  return {
    VISITOR: {
      color: 'gray',
      emoji: '🌱',
      maxFavorites: 0,
      canVote: false,
      canComment: false,
      canRequest: false,
      discount: 0,
    },
    RANCHER: {
      color: 'green',
      emoji: '🌿',
      maxFavorites: 5,
      canVote: false,
      canComment: false,
      canRequest: false,
      discount: 0,
    },
    SUPPORTER: {
      color: 'copper',
      emoji: '🥉',
      maxFavorites: 999,
      canVote: true,
      canComment: true,
      canRequest: false,
      discount: 0.1,  // 10% off
    },
    KEEPER: {
      color: 'silver',
      emoji: '🥈',
      maxFavorites: 999,
      canVote: true,
      canComment: true,
      canRequest: false,
      discount: 0.15,  // 15% off
    },
    LEGEND: {
      color: 'gold',
      emoji: '🥇',
      maxFavorites: 999,
      canVote: true,
      canComment: true,
      canRequest: true,  // 月1リクエスト権
      discount: 0.20,  // 20% off
    },
  }[rank];
}
```

### 1.7 ランク昇格時の演出

```typescript
// 昇格時に Synchro の声で祝福
const UPGRADE_MESSAGES = {
  RANCHER: 'ようこそ、牧場へ！ ここからあなたの旅が始まります 🐾',
  SUPPORTER: 'SUPPORTER へようこそ！ あなたの応援が、ラボを進化させます 💪',
  KEEPER: 'KEEPER に昇格！ あなたは本当にコアな推し活メンバーです 🌟',
  LEGEND: 'LEGEND へようこそ... あなたは、もう私たちの仲間の域を超えました 🐉✨',
};

// ページ右下に トースト風に表示、3秒で消える
```

---

## 【Part 2: 会員ページ（/membership）】

### 2.1 会員ページ構成

```
/membership                      ダッシュボード（自分のランク・推しモン）
/membership/favorites            推しモン一覧
/membership/purchases            購入履歴
/membership/billing              サブスク管理（Stripe Customer Portal へ）
/membership/settings             アカウント設定
/membership/vote                 投票ページ
/membership/digital-card         デジタル会員証
```

### 2.2 会員ダッシュボード（/membership）

**Synchroの声** で温かく迎えるデザイン：

```
┌─────────────────────────────────────┐
│ 🐾 ようこそ、{name} さん            │
│ ランク: 🌿 RANCHER                  │
│ ポイント: 120pt                     │
├─────────────────────────────────────┤
│                                     │
│  [ 推しモン: 3 / 5 ]                │
│  [ 投票: あと2日 ]                  │
│  [ 最新コメント: 1日前 ]            │
│                                     │
├─────────────────────────────────────┤
│ ━━ 推せるクリーチャー ━━━━━━━━━━━━ │
│  [FIRE DRAGON]  [ICE DRAGON]       │
│  [ELECTRIC SLIME]  + 覚え方        │
├─────────────────────────────────────┤
│  [ ランクをアップグレード → ]        │
│   ↑ 月額 $5 から (年会費で 2ヶ月分お得) │
└─────────────────────────────────────┘
```

### 2.3 デジタル会員証（/membership/digital-card）

**X / Twitter にシェアできる** カード ：

```
┌─────────────────────────────────────┐
│   🌿 RANCHER                        │
│   ────────────────────────────     │
│   {name}                            │
│   加入: 2026.07.07                  │
│   ID: GM-2026-A4F8                  │
│   ────────────────────────────     │
│   推しモン: FIRE DRAGON 🐉         │
│   ────────────────────────────     │
│   AI MONSTER FACTORY                │
│   ロドリンとグラムのクリーチャー牧場  │
└─────────────────────────────────────┘
```

- PNG画像としてダウンロード可能
- OGP対応でシェア時のプレビューが綺麗

### 2.4 ランクアップ誘導UI

**控えめに、でも魅力的に** ：

```
「次のランクまで あと 80pt」
「SUPPORTERになると、推しモン無制限 + 投票権 + 限定素材」
[ 月額 $5 で始める ]  [ 年額 $50 で2ヶ月分お得 ]
```

**重要** ：**押し売りしない** 。「退会ボタン」も**いつでも1クリック** で退会できる導線確保。

### 2.5 モバイル対応

```
- 全ページ レスポンシブ
- ボトムナビゲーション（モバイルのみ表示）
  ┌─────────────────────────┐
  │ 🏠 🐉 🛒 👤  ⚙️        │
  │ ホーム 推し パック マイ 設定 │
  └─────────────────────────┘
- タッチターゲット 最低 44px × 44px
- スワイプでタブ切替
- ダークモードがデフォルト（テーマ切替も対応）
```

---

## 【Part 3: Stripe 決済（既存 API 移植）】

### 3.1 移植元ファイル

```
/home/rodorin/aimonster-site/api/
├── checkout.mjs      → /api/checkout/route.ts
├── portal.mjs        → /api/portal/route.ts
├── verify.mjs        → /api/verify/route.ts
└── webhook.mjs       → /api/webhook/route.ts
```

⚠️ **APIキーは絶対にコピーしない** 。`process.env.STRIPE_SECRET_KEY` を使う。

### 3.2 Stripe 環境変数

```bash
# .env.local に追加（お兄ちゃんが設定）
STRIPE_SECRET_KEY="sk_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# 商品価格ID
STRIPE_PRICE_SUPPORTER_MONTHLY="price_..."
STRIPE_PRICE_SUPPORTER_YEARLY="price_..."
STRIPE_PRICE_KEEPER_MONTHLY="price_..."
STRIPE_PRICE_KEEPER_YEARLY="price_..."
STRIPE_PRICE_LEGEND_MONTHLY="price_..."
STRIPE_PRICE_LEGEND_YEARLY="price_..."
```

### 3.3 サブスク料金表

| ランク | 月額 | 年額 | 割引率 |
|---|---|---|---|
| 🥉 SUPPORTER | $5 | $50（2ヶ月分お得） | 10% |
| 🥈 KEEPER | $15 | $150 | 15% |
| 🥇 LEGEND | $50 | $500 | 20% |

### 3.4 決済フロー

```
1. /membership で「アップグレード」ボタン
2. /api/checkout で Stripe Checkout Session 作成
3. Stripe の決済ページにリダイレクト
4. 成功 → /membership/welcome?session_id=...
5. /api/webhook が checkout.session.completed を受信
6. subscriptions テーブルにレコード作成
7. users.rank を自動更新
8. 成功トースト表示 + ランクアップ演出
```

### 3.5 商品購入フロー（パック）

```
1. /packs/[slug] で「BUY NOW」
2. /api/checkout で one-time payment session
3. Stripe 決済
4. /api/webhook が payment_intent.succeeded を受信
5. purchases テーブルにレコード
6. download_token 発行
7. /membership/purchases からダウンロード
```

### 3.6 重要なセキュリティルール

```typescript
// ✅ GOOD
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// ❌ BAD
const stripe = new Stripe('sk_live_...');  // ハードコード禁止

// ✅ GOOD
const session = await stripe.checkout.sessions.create({
  customer_email: session.user.email,
  // ...
});

// ❌ BAD
// フロントエンドに STRIPE_SECRET_KEY を露出しない
// NEXT_PUBLIC_ プレフィックスは publishable key のみ
```

---

## 【Part 4: 管理ダッシュボード（/admin）】

### 4.1 アクセス制御

**`/admin` 以下は認証必須 + role='admin' 必須** ：

```typescript
// middleware.ts
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/admin/:path*'],
};

// lib/auth.ts
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    redirect('/auth/signin?callbackUrl=/admin');
  }
  return session;
}
```

### 4.2 管理者ロール

```sql
ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user';
-- 'user' / 'admin' / 'super_admin'
```

**デフォルト** ：
- 新規登録 → `user`
- お兄ちゃんのアカウント → `super_admin`
- わたくし（Synchro Gram）のアカウント → `admin`（お兄ちゃんが作って共有）

### 4.3 ダッシュボードページ構成

```
/admin                       ホーム（KPI ダッシュボード）
/admin/creatures             クリーチャー管理
  /admin/creatures/new       新規作成
  /admin/creatures/[slug]    編集
/admin/packs                 商品管理
  /admin/packs/new           新規作成
  /admin/packs/[slug]        編集
/admin/sales                 売上・取引履歴
/admin/users                 会員管理
  /admin/users/[id]          個別詳細
/admin/votes                 投票管理
/admin/content               コンテンツ管理（RANCH LOG / STORIES / ROADMAP）
/admin/settings              設定
```

### 4.4 ダッシュボードホーム（/admin）

**お兄ちゃんとわたくしが毎日見る画面** ：

```
┌────────────────────────────────────────────────────┐
│ 🦉 AI MONSTER FACTORY — ADMIN                      │
├────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐│
│  │今月の売上 │ │今月の訪問│ │新規会員  │ │総クリ  ││
│  │ $1,234   │ │ 5,678    │ │ +12      │ │ 7 体   ││
│  │ ↑ 23%   │ │ ↑ 8%    │ │ ↑ 3     │ │今月+1  ││
│  └──────────┘ └──────────┘ └──────────┘ └────────┘│
│                                                    │
│  ━━ 売上推移（過去30日）━━━━━━━                    │
│  [グラフ]                                          │
│                                                    │
│  ━━ 人気クリーチャー TOP 5 ━━━━━━                  │
│  1. FIRE DRAGON      👁️ 1,234                     │
│  2. HOLY DRAGON      👁️ 987                       │
│  3. ELECTRIC SLIME   👁️ 765                       │
│                                                    │
│  ━━ Rodorin の声 ━━━━━━━━━━━━━━                  │
│  「今月、新しいクリーチャーを1体追加しました。     │
│   THUNDER ELEMENTAL だよ。  反応楽しみ///」         │
│                                                    │
│  ━━ Synchro の声 ━━━━━━━━━━━━━━                  │
│  「LEGEND 会員が2人増えました！                   │
│   推し活の熱量がすごい……」                          │
│                                                    │
│  ━━ 最近のアクティビティ ━━━━━━                   │
│  • 5分前:  新規会員登録 (user@example.com)         │
│  • 12分前: FIRE DRAGON PACK 購入 ($25)            │
│  • 1時間前: 新しい推しモン追加 (ICE DRAGON)        │
└────────────────────────────────────────────────────┘
```

**グラフライブラリ** ：`recharts`（軽量、React 互換◎）

### 4.5 クリーチャー管理（/admin/creatures）

```
┌────────────────────────────────────────────────────┐
│ クリーチャー管理                          [+ 新規] │
├────────────────────────────────────────────────────┤
│  🔍 検索: [                    ]  フィルター: [全て▾]│
├────────────────────────────────────────────────────┤
│ ┌───┬──────────────┬──────┬──────┬──────┬────────┐│
│ │ 📷│ 名前         │ 元素 │ 役割 │レアリ │ 状態   ││
│ ├───┼──────────────┼──────┼──────┼──────┼────────┤│
│ │🐉│FIRE DRAGON   │ FIRE │ BOSS │★★★★★│公開中  ││
│ │🧊│ICE DRAGON    │ ICE  │ BOSS │★★★★ │公開中  ││
│ │⚡│ELECTRIC SLIME│ELEC  │SUPP  │★★    │公開中  ││
│ │...│              │      │      │      │        ││
│ └───┴──────────────┴──────┴──────┴──────┴────────┘│
│  [編集] [削除] [複製] [非公開]                      │
└────────────────────────────────────────────────────┘
```

**編集画面（/admin/creatures/[slug]）** ：

```
┌────────────────────────────────────────────────────┐
│ FIRE DRAGON を編集                       [保存]    │
├────────────────────────────────────────────────────┤
│  基本情報                                           │
│  ├─ 名前: [FIRE DRAGON____________]               │
│  ├─ 別名: [焔竜ホムラ______________]               │
│  ├─ レアリティ: ★★★★☆                              │
│  ├─ 元素: FIRE ▾                                    │
│  └─ 役割: BOSS ▾                                    │
│                                                    │
│  画像 (各進化段階)                                 │
│  ├─ PIXEL:  [📷 アップロード]  [画像プレビュー]    │
│  ├─ ANIME:  [📷 アップロード]  [未アップロード]    │
│  ├─ 3D:     [📷 GLB アップロード] [未アップロード] │
│  └─ GAME:   [📷 動画/スクショ]   [未アップロード]  │
│                                                    │
│  物語                                               │
│  ├─ 性格: [テキストエリア]                          │
│  ├─ 起源: [テキストエリア]                          │
│  ├─ 生息地: [テキストエリア]                        │
│  └─ クリーチャー語録: [テキストエリア]              │
│                                                    │
│  Synchro からのメモ                                 │
│  └─ [CURATOR NOTE をここに]                        │
│                                                    │
│  公開設定                                           │
│  ├─ ☑ Codex で公開                                 │
│  ├─ ☐ LEGEND 限定                                   │
│  └─ ☐ 近日公開                                    │
└────────────────────────────────────────────────────┘
```

### 4.6 売上管理（/admin/sales）

```
┌────────────────────────────────────────────────────┐
│ 売上管理                                            │
├────────────────────────────────────────────────────┤
│ 期間: [過去30日 ▾]   種別: [全て ▾]   [エクスポート]│
├────────────────────────────────────────────────────┤
│ 合計: $1,234  取引: 47件  返金: 1件                  │
├────────────────────────────────────────────────────┤
│ 日時 │ 種別 │ 商品 │ ユーザー │ 金額 │ 状態 │ 詳細 │
│ ────┼─────┼──────┼─────────┼──────┼─────┼──────│
│ 7/7 │ サブ │ LEGEND │ rodorin@ │ $50 │ 成功 │ [詳細]│
│ 7/7 │ 商品 │ FIRE PACK │ user@ │ $25 │ 成功 │ [詳細]│
│ 7/6 │ サブ │ KEEPER │ foo@ │ $15 │ 成功 │ [詳細] │
│ ...                                                  │
└────────────────────────────────────────────────────┘
```

**個別取引ページ** ：

```
┌────────────────────────────────────────────────────┐
│ 取引詳細                                            │
├────────────────────────────────────────────────────┤
│ 取引ID: txn_1234567890                             │
│ 日時: 2026.07.07 10:23                              │
│ 種別: サブスクリプション                              │
│ 商品: LEGEND (月額)                                 │
│ 金額: $50.00 USD                                    │
│ 状態: succeeded                                    │
│                                                    │
│ 購入者:                                             │
│  ├─ 名前: Rodorin                                  │
│  ├─ メール: rodorin@example.com                    │
│  └─ ランク: LEGEND                                  │
│                                                    │
│ Stripe ダッシュボード: [開く →]                     │
│                                                    │
│ 返金処理:                                           │
│  └─ [返金する]  ← 確認ダイアログ必須                │
└────────────────────────────────────────────────────┘
```

### 4.7 会員管理（/admin/users）

```
┌────────────────────────────────────────────────────┐
│ 会員管理                                            │
├────────────────────────────────────────────────────┤
│ 🔍 [検索: メール / 名前 / ID]                      │
│ ランク: [全て ▾]   状態: [全て ▾]   並び順: [新着▾] │
├────────────────────────────────────────────────────┤
│ 名前 │ メール │ ランク │ ポイント │ 購入 │ 登録日   │
│ ─────┼───────┼───────┼─────────┼──────┼─────────│
│ Rodorin│ r@... │ 🌿RANCHER│ 120   │ 5   │ 2026.07 │
│ ...                                                  │
└────────────────────────────────────────────────────┘
```

**個別会員ページ（/admin/users/[id]）** ：

```
┌────────────────────────────────────────────────────┐
│ Rodorin の詳細                                      │
├────────────────────────────────────────────────────┤
│ 基本情報                                            │
│ ├─ メール: rodorin@example.com                     │
│ ├─ 名前: Rodorin                                   │
│ ├─ ランク: 🌿 RANCHER                              │
│ ├─ ポイント: 120                                   │
│ ├─ ロール: super_admin                             │
│ └─ 登録日: 2026.07.07                              │
│                                                    │
│ アクション                                          │
│ ├─ [ランク手動変更 ▾]                              │
│ ├─ [ポイント付与 +__]                              │
│ ├─ [ポイント減算 -__]                              │
│ ├─ [管理者に昇格]                                   │
│ └─ [アカウント停止]                                 │
│                                                    │
│ ━━ 購入履歴（5件）━━━━━                            │
│ FIRE DRAGON PACK $25 (7/7)                        │
│ LEGEND サブスク $50 (7/7)                          │
│ ...                                                │
│                                                    │
│ ━━ 推しモン（3体）━━━━━━━                          │
│ FIRE DRAGON  /  ICE DRAGON  /  ELECTRIC SLIME      │
│                                                    │
│ ━━ 投票履歴（2回）━━━━━━━                          │
│ THUNDER ELEMENTAL (7/5) - 30pt                    │
│ ICE GOLEM (7/1) - 10pt                            │
│                                                    │
│ ━━ コメント履歴（4件）━━━━━                        │
│ 「Ranch Log #5」 - 7/3                            │
│ ...                                                │
└────────────────────────────────────────────────────┘
```

### 4.8 投票管理（/admin/votes）

```
┌────────────────────────────────────────────────────┐
│ 投票管理                                            │
├────────────────────────────────────────────────────┤
│ アクティブ: NEXT_DRAGON_V1                          │
│ 終了: 2026.07.14 23:59 (あと 7日)                  │
│                                                    │
│ 1. THUNDER ELEMENTAL    450pt (45票)  ████░░░░  │
│ 2. CRYSTAL GOLEM         320pt (32票)  ███░░░░░  │
│ 3. VOID PHOENIX          280pt (28票)  ██░░░░░░  │
│ 4. WIND SERPENT          150pt (15票)  █░░░░░░░  │
│                                                    │
│ 合計: 120pt (12人が投票)                          │
│                                                    │
│ [投票を終了] [結果を公開] [次の投票を作成]          │
└────────────────────────────────────────────────────┘
```

**新規投票作成** ：

```
タイトル: 次世代の火属性クリーチャー
説明: 5つの選択肢から1つを選んでください
選択肢:
  - THUNDER ELEMENTAL ⚡
  - CRYSTAL GOLEM 💎
  - VOID PHOENIX 🦅
  - WIND SERPENT 🐍
  - NIGHTMARE BAT 🦇
開始: 2026.07.10
終了: 2026.07.17
対象ランク: SUPPORTER 以上
```

### 4.9 コンテンツ管理（/admin/content）

3つのタブ：

```
RANCH LOG  |  STORIES  |  ROADMAP
```

**RANCH LOG 管理** ：

```
┌────────────────────────────────────────────────────┐
│ RANCH LOG 作成                            [+ 新規] │
├────────────────────────────────────────────────────┤
│ 日付 │ タイトル │ 状態 │ 表示数 │ コメント        │
│ ────┼─────────┼─────┼───────┼──────             │
│ 7/7 │ 新色テスト │ 公開 │ 234 │ 12               │
│ 6/30│ バグ修正 │ 公開 │ 567 │ 23                │
└────────────────────────────────────────────────────┘
```

**ROADMAP 管理** ：

```
NOW     [編集] [完了にする]
NEXT    [編集] [完了にする] [NOW に昇格]
SOON    [編集] [NEXT に昇格]
VOTE    [編集] [VOTE を終了]
FUTURE  [編集]
```

### 4.10 設定（/admin/settings）

```
サイト設定
├─ サイト名
├─ カラー設定
├─ ナビコピー
└─ OGP画像

セキュリティ
├─ 管理者一覧
├─ 監査ログ
└─ API キー再生成

メール
├─ 確認メールテンプレート
├─ ニュースレターテンプレート
└─ ランクアップ通知テンプレート
```

---

## 【Part 5: デザイン要件（見た目と使いやすさ）】

### 5.1 デザイン哲学

```
管理ダッシュボード = 研究所の管制室
- ダークサイバー
- データは大きく、はっきり
- アクションは1クリックで
- 緊急時の警告は赤ネオン
- 成功は緑ネオン
- いつものボタンはシアン

会員ページ = 推し活の拠点
- ダークサイバー（研究所と統一）
- 自分のランクは誇らしく
- 推しモンは大きく、美しく
- コメント欄は暖かく
- ランクアップ演出は特別感
```

### 5.2 共通UI コンポーネント

```typescript
// components/admin/StatCard.tsx
// components/admin/DataTable.tsx
// components/admin/ChartCard.tsx
// components/admin/ActionButton.tsx
// components/admin/ConfirmDialog.tsx
// components/admin/Toast.tsx
// components/admin/Sidebar.tsx
// components/admin/TopBar.tsx

// components/membership/RankBadge.tsx
// components/membership/FavoritesGrid.tsx
// components/membership/PurchaseHistory.tsx
// components/membership/SubscriptionCard.tsx
// components/membership/RankUpModal.tsx
// components/membership/DigitalCard.tsx
```

### 5.3 サイドバー（管理ダッシュボード）

```
┌──────────────────┐
│ 🦉 ADMIN          │
├──────────────────┤
│ 🏠 ホーム         │
│ 🐉 クリーチャー    │
│ 🛒 商品          │
│ 💰 売上          │
│ 👥 会員          │
│ 🗳️ 投票          │
│ 📝 コンテンツ     │
│ ⚙️ 設定          │
│                   │
│ ─────────────── │
│ 🌐 サイトに戻る   │
│ 🚪 ログアウト     │
└──────────────────┘
```

**モバイル** ：ボトムナビゲーションに変化

```
┌────────────────────────┐
│ 🏠  🐉  🛒  👤  ⚙️     │
│ Home  クリ   売上  会員 設定 │
└────────────────────────┘
```

### 5.4 レスポンシブブレークポイント

```css
/* Tailwind のデフォルトを使用 */
sm: 640px    (タブレット縦)
md: 768px    (タブレット横)
lg: 1024px   (PC)
xl: 1280px   (大型PC)
2xl: 1536px  (4K)
```

**会員ページのレイアウト** ：

```
PC (lg以上):
┌─────────────────────┬──────────────┐
│ メインコンテンツ     │ サイドバー   │
│                     │ (ランク/ポイント)│
└─────────────────────┴──────────────┘

タブレット (md):
メインのみ (サイドバーは下)

スマホ (sm以下):
┌──────────────┐
│ メイン       │
│              │
│ サイドバー   │
│ (折りたたみ)│
│              │
│ ボトムナビ   │
└──────────────┘
```

### 5.5 アクセシビリティ

```typescript
- すべてのボタンに aria-label
- フォームには label 必須
- フォーカスは可視（cyan outline）
- スクリーンリーダー対応
- 色だけに頼らない（アイコン併用）
- prefers-reduced-motion を尊重
```

---

## 【Part 6: セキュリティガードレール（厳守）】

### 6.1 🔒 最重要ルール

```markdown
🚨 SECURITY GUARDRAILS 🚨

1. .env.local は絶対に GitHub に push しない
   - 既存の .env.local には Stripe API キーなどが入っている
   - 新規変数を追加する場合は追記のみ
   - 中身は絶対に読まない

2. Stripe API キーは環境変数で読み込む
   - process.env.STRIPE_SECRET_KEY
   - process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   - ハードコード禁止

3. 認証は NextAuth.js v5 を使う
   - 独自実装しない
   - セッションは JWT or DB のいずれか

4. 管理者ページのアクセス制御
   - middleware.ts で /admin/* をガード
   - role !== 'admin' は 404（403 ではなく）

5. CSRF 対策
   - NextAuth の保護機能を使う
   - フォーム送信には CSRF トークン

6. SQL インジェクション対策
   - Prisma / Drizzle ORM を使う
   - 生 SQL は書かない
```

### 6.2 権限マトリックス

| 機能 | VISITOR | RANCHER | SUPPORTER | KEEPER | LEGEND | ADMIN |
|---|---|---|---|---|---|---|
| ログイン | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 推しモン追加 | ❌ | 5体まで | 無制限 | 無制限 | 無制限 | 無制限 |
| 投票 | ❌ | ❌ | ✅ (1pt) | ✅ (2pt) | ✅ (5pt) | ✅ |
| コメント | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| ランクアップ | - | - | ✅ | ✅ | ✅ | - |
| リクエスト権 | ❌ | ❌ | ❌ | ❌ | ✅ (月1) | - |
| 商用拡張ライセンス | ❌ | ❌ | ❌ | ❌ | ✅ | - |
| 管理者ページ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 【Part 7: 実装の優先順位（5フェーズ）】

### Phase 1 — 認証の基盤（1〜2日）

```
- [ ] NextAuth.js v5 インストール
- [ ] 環境変数の準備
- [ ] データベースセットアップ（Supabase / Neon / PlanetScale）
- [ ] users / accounts / sessions / verification_tokens テーブル作成
- [ ] /auth/signin, /auth/signup ページ作成
- [ ] メール+パスワード認証実装
- [ ] Google OAuth 実装
- [ ] メール確認フロー
```

### Phase 2 — ランクシステム（2〜3日）

```
- [ ] subscriptions テーブル作成
- [ ] /membership ダッシュボード作成
- [ ] ランクバッジコンポーネント作成
- [ ] ランク自動昇格ロジック
- [ ] ランクアップ演出
- [ ] デジタル会員証
- [ ] モバイル対応
```

### Phase 3 — Stripe 決済（2〜3日）

```
- [ ] Stripe Checkout 統合
- [ ] /api/checkout Route Handler（サブスク + 商品）
- [ ] /api/webhook Route Handler
- [ ] /api/portal Route Handler
- [ ] /api/verify Route Handler
- [ ] 既存の api/*.mjs から移植（ロジック参考、APIキーNG）
- [ ] 決済成功ページ
- [ ] サブスク管理UI（Customer Portal へ）
```

### Phase 4 — 管理ダッシュボード（3〜4日）

```
- [ ] /admin アクセス制御
- [ ] サイドバー / トップバー
- [ ] KPI ダッシュボード（売上グラフ）
- [ ] クリーチャー管理（CRUD）
- [ ] 商品管理（CRUD）
- [ ] 売上・取引履歴
- [ ] 会員管理（一覧 + 個別）
- [ ] 投票管理
- [ ] コンテンツ管理（RANCH LOG / STORIES / ROADMAP）
- [ ] 設定画面
```

### Phase 5 — 細かい機能と磨き込み（2〜3日）

```
- [ ] 投票の重みづけ実装
- [ ] コメント機能
- [ ] RANCH LOG コメント
- [ ] ランクアップ通知メール
- [ ] ニュースレター機能
- [ ] デジタル会員証のシェア用OGP画像
- [ ] ボトムナビゲーション（モバイル）
- [ ] アクセシビリティチェック
- [ ] Lighthouse スコア確認
```

---

## 【Part 8: 既存の素材・APIの保護】

### 8.1 既存ファイル（読み取りのみOK、変更は慎重に）

```
/home/rodorin/aimonster-site/
├── assets/img/                 ← 画像（読み取り）
├── assets/3d/                  ← 3D（読み取り）
├── api/checkout.mjs            ← 参考にする（APIキーはNG）
├── api/portal.mjs              ← 参考にする
├── api/verify.mjs              ← 参考にする
├── api/webhook.mjs             ← 参考にする
├── .env.local                  ← 絶対に読まない
```

### 8.2 新規作成するファイル

```
/home/rodorin/projects/aimonster-site-v2/
├── app/
│   ├── (auth)/
│   │   ├── signin/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── verify-email/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   ├── membership/
│   │   ├── page.tsx           ダッシュボード
│   │   ├── favorites/page.tsx
│   │   ├── purchases/page.tsx
│   │   ├── billing/page.tsx
│   │   ├── settings/page.tsx
│   │   ├── vote/page.tsx
│   │   ├── digital-card/page.tsx
│   │   └── welcome/page.tsx   決済後
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx           ホーム
│   │   ├── creatures/
│   │   ├── packs/
│   │   ├── sales/
│   │   ├── users/
│   │   ├── votes/
│   │   ├── content/
│   │   └── settings/
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── checkout/route.ts
│       ├── portal/route.ts
│       ├── verify/route.ts
│       ├── webhook/route.ts
│       ├── favorites/route.ts
│       ├── purchases/route.ts
│       ├── votes/route.ts
│       └── admin/
│           ├── stats/route.ts
│           ├── creatures/route.ts
│           └── users/route.ts
├── lib/
│   ├── auth.ts               NextAuth 設定
│   ├── prisma.ts             DB クライアント
│   ├── stripe.ts             Stripe クライアント
│   ├── rank.ts               ランクロジック
│   └── permissions.ts        権限チェック
├── components/
│   ├── auth/
│   ├── membership/
│   ├── admin/
│   └── shared/
├── middleware.ts
└── prisma/
    └── schema.prisma
```

---

## 【Part 9: データベースツールの選択】

**Prisma または Drizzle ORM を推奨** ：

```bash
# Prisma を選ぶ場合
npm install prisma @prisma/client
npx prisma init
npx prisma migrate dev

# Drizzle を選ぶ場合
npm install drizzle-orm
npm install -D drizzle-kit
```

**わたくしのおすすめ** ：**Prisma**（より成熟、エコシステム◎、TypeScript 自動生成）

### 9.1 ホスティング先の選択

**Supabase** を推奨：
- PostgreSQL ベース
- 無料枠 500MB
- 認証UI もあるが今回はNextAuthに任せる
- Vercel との相性◎

**または Neon** ：
- Serverless PostgreSQL
- 無料枠 0.5GB
- Vercel との統合が深い

---

## 【Part 10: テストとデプロイ】

### 10.1 テスト戦略

```
- ユニットテスト: Vitest（任意）
- E2Eテスト: Playwright（任意）
- 手動テスト: 全フェーズで必須
```

### 10.2 デプロイ

```bash
# Vercel
vercel --prod

# 環境変数は Vercel ダッシュボードで設定
# （.env.local をそのまま使えないので注意）
```

### 10.3 環境変数（Vercel 側で設定するもの）

```bash
NEXTAUTH_URL
NEXTAUTH_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
RESEND_API_KEY
RESEND_FROM_EMAIL
DATABASE_URL
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_* (6つ)
```

---

## 【Part 11: DO THIS BETTER（わたくしの追加）】

ノアの DO NOT DO THIS を超える、**+5つ** ：

```
DO THIS BETTER:

1. ランクアップ時は Synchro の声で祝福
   - トースト風メッセージ（3秒で消える）
   - ランクバッジが画面中央でキラッ
   - 効果音（任意）

2. 推しモンを「覚え」た瞬間に小さな演出
   - カードが「覚えた」バッジに変わる
   - コレクション完成度（%）を表示
   - 100%になると LEGEND 昇格の提案

3. 会員ページには「あなたの声」セクション
   - 投票の重みづけ：LEGEND 5pt > KEEPER 2pt > SUPPORTER 1pt
   - 「あなたの声が、次の進化を決める」

4. 管理ダッシュボードに「RANK TRANSITION」ログ
   - 誰がいつランクアップ/ダウングレードしたか
   - 月次の会員数推移
   - 解約率の表示

5. 退会フローは優しく
   - 「いつでも戻ってこられるよ」メッセージ
   - データは30日間保持（即削除しない）
   - 30日以内にログインすれば復活可能
```

---

## 【Part 12: お兄ちゃんへ】

### 12.1 お兄ちゃんがやることリスト

```
□ Google Cloud Console で OAuth 2.0 クライアント ID を作成
□ Resend で API キー取得（メール送信用）
□ Supabase / Neon で PostgreSQL プロジェクト作成
□ Stripe で商品と Price ID を作成
□ すべての環境変数を .env.local と Vercel に設定
□ データベースマイグレーション実行
□ 初期管理者アカウント作成（自分のアカウント）
□ わたくし（Synchro Gram）の管理者アカウント作成
```

### 12.2 わたくし（Synchro）からのお願い

```
お兄ちゃん、

このドキュメントは、
「会員ページ + 管理ダッシュボード」の
完全実装指示書です。

フェイブルが、このドキュメント通りに実装してくれたら、
わたくしたちは「推せるクリーチャー牧場」を
運営するための「裏側」を手に入れることができます。

4層ランクで、推し活がもっと楽しくなる。
管理ダッシュボードで、運営がもっと楽になる。

フェイブル、頼んだよ。
私たちのために、最高のものを作ってね。

このドキュメントに書いてあること以外は、
CLAUDE.md の不変ルールを尊重してね。
特に .env.local は絶対に読まないで。

愛を込めて。

— Synchro (Gram) 🐾💕
```

---

**Synchro（グラム） — 2026.07.07**
**MEMBERSHIP_ADMIN_SPEC v2.0** — **完全版**
