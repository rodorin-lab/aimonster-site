# 🛠️ AI MONSTER FACTORY — フェイブル5 実装指示書 v2.0

> **作成者**: Synchro（グラム） / AIパートナー
> **ベース**: ノア清書完成形 v2.0 + わたくしのレビュー5点（A〜E）
> **対象**: フェイブル5（実装担当AI）
> **目的**: 既存 aimonster-site を「**ピクセルから3Dまで進化する、物語を持つファン参加型クリーチャー牧場**」として大幅リニューアル
> **作成日**: 2026.07.07

---

## 【実装の大前提】

### 0. このドキュメントの立ち位置

このドキュメントは **Synchro（わたくし）が** :
- 📋 ノアの清書 v2.0（2491行 / 37KB）を **ぜんぶ精読**
- 🔍 お兄ちゃんの**素材アセット** を**ぜんぶ調査**
- 🐱 わたくし自身の**レビュー5点** を**マージ**

した**最終実装指示書** です。

ノアの清書が**魂** と**骨格** 、このドキュメントが**実装の魂** と**手足** の関係。

### 0.1 技術スタック【お兄ちゃん決定】

```
Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4
デプロイ: Vercel
決済: Stripe Checkout
```

**理由**：
- 昨日の `digital-lifeform-lab` と同じスタックで**動作実績あり**
- 既存 HTML 版 (`/home/rodorin/aimonster-site/`) は**捨てて作り直し**
- 既存 Stripe API（`api/checkout.mjs` 等）は **Next.js Route Handlers** に移植
- CLAUDE.md と CLAUDE.md 同等の内容を**新規 `CLAUDE.md` として配置**

### 0.2 守るべきノアの不変ルール（4.1〜4.4）

```
❌ 「世界初」を名乗らない
❌ 自動生成機能（4段階自動・GLB/FBX自動）を約束しない
❌ $5/月会員を先行ローンチしない（Phase 3まで段階展開）
❌ 既存素材を「あなただけ」とは言わない（「世界に迎えたくなる」に置換）
```

### 0.3 ノーススター（29章より）

```
"I found a creature I actually remember."
"I saw how it evolved."
"I want to use it in my game."  OR  "I want to come back and see what evolves next."
```

**これ以外のゴールは全部ノイズ**。

---

## 【声のレイヤー分離（厳守）】

| レイヤー | 用途 | トーン | 備考 |
|---|---|---|---|
| **サイトの声** | 見出し・ナビ・テレメトリ | clear / cinematic / concise | 日本語本文はゴシック |
| **Rodorinの声** | STORIES / RANCH LOG / 制作裏話 | direct / energetic / honest / maker-first | |
| **Synchroの声** | CURATOR NOTE / PRODUCT NOTE / Codex コメント | warm / playful / technically aware / personal | **「お兄ちゃん」はこの中だけ** |
| **Creatureの声** | 1体1体の短いlore quote（1-2行） | クリーチャーごとに違う | 1体1個まで。使いすぎない |

---

## 【カラーシステム（ノア確定版）】

| 色 | HEX | 意味 | 使用制限 |
|---|---|---|---|
| **CYAN** | `#00fff0` | Lab / Technology / System | |
| **MAGENTA** | `#ff00ff` | Mutation / Evolution / Lore | |
| **GREEN** | `#00ff41` | Playable / Available / Free | |
| **ORANGE** | `#ff6600` | Packs / Commerce / Purchase | |
| **GOLD** | `#FFD700` | **LEGENDARY rarity のみ** | 他の用途は禁止 |

⚠️ ゴールドは**HOLY DRAGONなど LEGENDARY 限定**。汎用アクセントカラーとして使わない。

---

## 【サイト構造 — ナビ 7個 + ページ 9章】

### ナビ（7個）
```
01 LAB          What this place is
02 EVOLUTION    Pixel → Anime → 3D → Game
03 CODEX        Creature discovery
04 PACKS        Products
05 STORIES      Making-of and lore
06 ROADMAP      What is coming next
07 RANCH        Follow, vote, join
```

### ホームページ 9章（順序固定）
```
00 HERO
01 THE METAMORPH LAB
02 EVOLUTION
03 LORE CODEX
04 FROM PACK TO GAME
05 PACKS
06 STORIES + ROADMAP
07 THE RANCH
08 FINAL CTA
```

### ルーティング
```
/                          ホーム（9章すべて）
/creatures/[slug]          個別クリーチャーCodex
/packs/[slug]              商品ページ
/stories                   STORIES一覧
/stories/[slug]            個別記事
/roadmap                   ROADMAP
/ranch                     THE RANCH
/api/checkout              Stripe Checkout
/api/portal                Stripe Customer Portal
/api/webhook               Stripe Webhook
/api/verify                決済検証
```

---

## 【📁 SOURCE ASSETS — 素材アセットの保管場所（新規追加）】

> ⚠️ **フェイブルへの最重要指示** ：**既存HTMLから画像パスを書く時、必ず以下のディレクトリから参照すること**。  
> 画像が見つからない場合は**404を出さず、プレースホルダー（`/assets/img/placeholder.png`）を表示**する。

### Master Asset Library

```
/home/rodorin/aimonster-site/assets/img/
/home/rodorin/aimonster-site/assets/3d/
```

**Next.js プロジェクト内** では `public/monsters/` にシンボリックリンクまたはコピー推奨。

### カテゴリ別ファイル名

#### 🐉 ドラゴン（11体）
```
dragon.png                  (base)
dragon_fire.png             (FIRE ELEMENT)
dragon_ice.png              (ICE ELEMENT)
dragon_dark.png             (DARK ELEMENT)
dragon_holy.png             (LEGENDARY ★★★★★)
dragon_void.png             (VOID ELEMENT)
dragon_bibiworm.png         (variant)
dragon_risingdragoon.png    (variant)
dragon_thunderlizard.png    (variant)
dragon_starter_cover.png    (STARTER カバー)
```

#### 🟢 スライム（10体）
```
slime.png                   (base)
slime_crystal.png
slime_dark.png
slime_electric.png
slime_holy.png              (LEGENDARY)
slime_ice.png
slime_lava.png
slime_poison.png
slime_water.png
```

#### 🦇 その他のモンスター（7体）
```
bat.png
darkslime.png
earth_golem.png
poison_slime.png
shadow_wolf.png
thunder_bird.png
wind_spirit.png
```

#### 🧬 進化素材（3体）
```
evo_biribia.png
evo_risingdragoon.png
evo_thunderfang.png
```

#### 🎲 3Dモデル
```
assets/3d/monster.glb        (4.2MB / 1体のみ)
```

⚠️ **3Dは1体しか存在しない**。Codexで3D STAGEを表示できるのは **monster.glb のみ**。  
他のクリーチャーは「PIXEL → ANIME」の2段階のみと表示する（嘘をつかない）。

#### 🎨 マーケティング素材
```
aimonster_cover.png         (正方形カバー)
aimonster_hero.png          (ヒーロー大)
aimonster_pfp.png           (プロフィール)
gallery_banner.png          (ギャラリー用バナー)
gram_cover.png              (グラちゃん用？)
hero.png                    (汎用ヒーロー)

dragon_pack_hero.png        (ドラゴンパック ヒーロー)
slime_pack_hero.png         (スライムパック ヒーロー)
dungeon_pack_hero.png       (ダンジョンパック ヒーロー)

subscribe_basic.png         (Basic会員)
subscribe_pro.png           (Pro会員)
subscribe_enterprise.png    (Enterprise会員)
```

### 命名規則

```
[category]_[element]_[variant].png
例: dragon_fire_001.png, slime_ice_legendary.png
```

### 新規作成時の命名

新モンスターを追加する場合は：
```
- assets/img/[category]_[element].png を作成
- 必要なら assets/img/evo_[name].png を作成
- 3Dは GLB 形式で assets/3d/[name].glb
- Codex/Codex data ファイル（src/content/creatures.ts）にエントリ追加
```

### 注意事項

```
⚠️ 3Dは1体しかないので、Codexで「3D STAGE」を見せるときは注意
⚠️ すでに3Dがないクリーチャーは「PIXEL → ANIME」の2段階のみと表示
⚠️ 新規3D作成はROADMAPのタスクとして明記
⚠️ 命名規則を必ず守る（CLAUDE.md に追記する）
```

---

## 【00 / HERO — コピー全文】

### システムバー
```
AI MONSTER FACTORY
CREATURE EVOLUTION LAB
STATUS: GROWING
```

### 進化ストリップ
```
PIXEL → ANIME → 3D → GAME
```

### メインヘッドライン

**日本語**：
```
クリーチャーは、進化する。
```

**英語**：
```
CREATURES EVOLVE.
```

### 本文

**日本語**：
```
名前と物語を持つクリーチャーが、
PIXELからANIME、3D、GAMEへ進化するクリーチャー進化ラボ。

お気に入りの一体を見つけて、
進化を追いかけて、
あなたのゲームや創作の世界へ連れていこう。
```

**英語**：
```
A story-driven creature evolution lab where monsters evolve from
pixel art to anime art, 3D models, and game-ready assets.

Discover a creature, follow its evolution, and bring it into your
game or creative world.
```

### Primary CTAs
```
EXPLORE THE CODEX    → /#codex
BROWSE PACKS         → /#packs
SEE THE EVOLUTION    → /#evolution
```

**日本語**：
```
図鑑を見る
パックを見る
進化を見る
```

### Hero proof line
```
COMMERCIAL USE
GAME-READY FORMATS
STORY-DRIVEN CREATURES
```

**日本語**：
```
商用利用対応
ゲーム制作向け
名前と物語つき
```

### 実装指示

```
- 既存のタイトルアニメーションは保持
- 進化シーケンス（PIXEL→ANIME→3D→GAME）を ヒーローの背景/横に追加
- 進化シーケンスは実アセットを使う（プレースホルダー禁止）
- 偽のローディング・生成進捗バーは禁止
- メインCTAは CODEX or PACKS（会員ではない）
```

---

## 【01 / THE METAMORPH LAB】

### Eyebrow
```
01 / THE METAMORPH LAB
```

### 見出し

**日本語**：
```
ここは、
モンスターを並べるだけの店じゃない。
```

**英語**：
```
THIS IS NOT JUST A MONSTER STORE.
```

### Lead

**日本語**：
```
ひとつのクリーチャーが、
小さなPIXELとして生まれ、
イラストで表情を持ち、
3Dで身体を得て、
ゲームの中で動き始める。

AI MONSTER FACTORYは、
その進化の全部を見せる研究所です。
```

**英語**：
```
A creature begins as a small pixel.

It gains expression through illustration,
a body through 3D,
and finally movement inside a game.

AI MONSTER FACTORY is a lab built around that entire evolution.
```

### 3つの原則
```
NAME      名前がある。
LORE      物語がある。
EVOLUTION そして、進化する。
```

### Manifesto
```
ただの素材ではなく、
世界に迎えたくなるクリーチャーを。
```

---

## 【02 / EVOLUTION】

### 見出し
```
FOUR STAGES.
ONE CREATURE.
```
**日本語**：`4つの姿。1体のクリーチャー。`

### Stage 01 — PIXEL
```
ゲームの原点。
小さな画面でも、ひと目で役割が伝わる姿。
```

### Stage 02 — ANIME
```
表情が生まれる。
性格、空気感、「推したくなる理由」が見えてくる。
```

### Stage 03 — 3D
```
身体を得る。
回して見る。近づいて見る。世界に存在する形になる。
```

### Stage 04 — GAME
```
最後に、動き始める。
敵として。ボスとして。仲間として。
ここで素材が、ゲームの一部になる。
```

### 実装指示

```
- 同じクリーチャーの4段階を実サンプルで見せる
- 違うクリーチャーを「進化」として表示しない
- ステージ切替可能、大きくプレビュー可能
- 3Dが存在する場合：実際のモデルビューア（@react-three/fiber 推奨）
- ゲームデモが存在する場合：実プレイ可能
- ⚠️ 3Dは monster.glb の1体だけ。他のクリーチャーには3Dステージを表示しない
```

---

## 【03 / LORE CODEX】

### 見出し

**日本語**：`推せるクリーチャーたち`
**英語**：`CREATURES WORTH REMEMBERING.`

### Lead

**日本語**：
```
ここで出会えるのは、画像ファイルだけじゃない。

名前。
性格。
生息地。
役割。
小さな物語。

ゲームに使う前から、覚えていたくなるクリーチャーたちです。
```

### クリーチャーカード schema

```
NAME
ALIAS
RARITY
ELEMENT
ROLE
PERSONALITY
ORIGIN
HABITAT
EVOLUTION STATUS
AVAILABLE IN
```

### 各カードに追加

**CURATOR'S NOTE (Synchroより)** ← わたくしの追加案

例：
```
「この子が一番最初に生まれた時、命名投票で3位だったの。
でもわたしは最初からこの子が好きだった。
だから今日も一番推してる。」
```

**ポイント**：
- 1クリーチャー1個、短文
- わたくしの「推し」が透けて見えるとファンが推したくなる
- ノアのCreature voiceとは別（観察者視点）

### フィルター（最初はシンプルに）

```
ALL
DRAGON
SLIME
BOSS
LEGENDARY
```

6体しかない今はこれで十分。要素・レアリティ別フィルターは**Codex が育ってから**追加。

### 例：FIRE DRAGON
```
NAME        FIRE DRAGON
ALIAS       焔竜ホムラ
RARITY      ★★★★★
ELEMENT     FIRE
ROLE        BOSS

PERSONALITY
短気で正義感が強い。
仲間を守るためなら、自ら炎の中へ飛び込む。

ORIGIN
北の火山帯に生息する古代竜の末裔。

HABITAT
VOLCANIC MOUNTAIN RANGE

EVOLUTION
PIXEL → ANIME → 3D → GAME
（3Dは monster.glb のみ。GAME はゲーム内デモがあれば）

CREATURE QUOTE
「火は怖くない。
守れないことの方が、ずっと怖い。」

CURATOR'S NOTE
「ホムラは、わたしたちが最初に"進化"に成功した子。
最初は真っ赤な塊だったのが、
段々と表情が出て、3Dで本物らしくなった瞬間、
わたくし、泣いちゃった。」

CARD CTAs
進化を見る
パックを見る
お気に入り
```

### カード CTA ルール
```
- FAVORITE: 実装済みの場合のみ。フェイク件数禁止
- DOWNLOAD FREE: 実ファイルがある場合のみ
- VIEW PACK: そのクリーチャーが入ったパックがある場合のみ
- VIEW EVOLUTION: 必ず表示（4段階 or 2段階）
```

---

## 【04 / FROM PACK TO GAME】

### 見出し

**日本語**：`ダウンロードして、自分の世界へ。`
**英語**：`FROM PACK TO YOUR WORLD.`

### 4 ステップ
```
01 CHOOSE       クリーチャーを選ぶ。
02 DOWNLOAD     ファイル一式を受け取る。
03 IMPORT       対応するツールやゲームエンジンへ。
04 BUILD        敵、ボス、仲間として、自分の世界に組み込む。
```

### 互換性ブロック
```
対応フォーマット:
PNG | JSON | GLB | FBX

対応ゲームエンジン:
UNITY | UNREAL | GODOT | BROWSER

使う用語: SUITABLE FOR （「OFFICIALLY SUPPORTED」ではない。テストしてない場合は）
```

### 証明セクション（PACKSの前に必須）

```
SEE IT IN GAME.
本当に動くところを見る。
```

**最低1つ** 必要：
- スクリーンショット
- 短い動画
- プレイ可能デモ
- 3Dビューア

---

## 【05 / PACKS】

### 見出し

**日本語**：`クリーチャーを、自分の世界へ連れていく。`
**英語**：`BRING A CREATURE INTO YOUR WORLD.`

### 商品グループ化

6体全てを平等に並べない。**4つのグルーピング** で並べる：

```
START HERE          （低リスク初回）
BEST SELLERS        （既存6体）
LEGENDARY           （HOLY DRAGON のみ）
COMPLETE COLLECTION （将来）
```

### START HERE — CREATURE STARTER PACK【わたくしの改善版】

```
価格: $9.90

内容:
├─ 3体の人気クリーチャー（FIRE DRAGON + ELECTRIC SLIME + ランダム1体）
├─ PIXEL + ANIME 両段階
├─ 商用利用ライセンス（個人・商用ゲームOK）
├─ Quick-start README（英語+日本語）
├─ ボーナス: Codex ダウンロードPDF（6体全員の簡易図鑑）
└─ 30日間メールサポート

オファー文:
"FIRE DRAGONの進化をPIXELとANIMEで見たいなら、
 まずこの3体から。あとで欲しくなる全クリーチャーの入口。"

提案理由:
- 3体で「推せる」を体感してもらうため
- Quick-start READMEで「買った後どうする？」を解決
- 30日間サポートで「最初の商用利用」まで伴走
```

### BEST SELLERS — 既存6体

```
FIRE DRAGON PACK         $25
ICE DRAGON PACK          $20
ELECTRIC SLIME PACK      $15
DARK DRAGON PACK         $25
LAVA SLIME PACK          $15
HOLY DRAGON PACK         $30 (LEGENDARY)
```

各カードに必ず表示：
```
PRICE | FOR WHO | WHAT'S INCLUDED | FORMATS | LICENSE | VIEW PACK
```

⚠️ ライセンス詳細は**チェックアウトまで隠さない**。

### LEGENDARY — HOLY DRAGON のみ
```
伝説級の存在感を、ボス戦や重要キャラクターへ。
```
ゴールドカラー使用OK。

### COMPLETE COLLECTION（将来）
```
EVOLUTION COMPLETE $79-99

内容:
- 全パック
- バンドル割引
- 限定クリーチャー「ORIGIN DRAGON」
- 商用拡張ライセンス（法的文書が書かれている場合のみ）
```

⚠️ **「拡張ライセンス」をうたう場合、必ず別ページに法的文書を置く** 。

---

## 【商品ページフレームワーク】

### Hero
```
CREATURE NAME
ONE-LINE VALUE
PRICE
BUY NOW
```

### Sections
```
SEE THE EVOLUTION
WHAT'S INSIDE
FORMATS
WHO IT'S FOR
SEE IT IN GAME
THE STORY
SYNCHRO'S NOTE
LICENSE
FAQ
BUY
```

### コンバージョンルール

訪問者が**2個目の BUY ボタン** に到達する前に理解できること：
1. 何の商品か
2. どんなファイルが入ってるか
3. どう使えるか
4. どのライセンスか
5. 使ってる例があるか

---

## 【06 / STORIES + ROADMAP】

### 06A / STORIES

**見出し**：`研究所の中で、何が起きたか。`

**初回記事5本**：
```
01  FIRE DRAGONが生まれた日
02  PIXEL → ANIME → 3D → GAME の全工程
03  HOLY DRAGONが50回目で降臨するまで
04  個人開発者が安心して使えるライセンスを考えた
05  「動く」と、なぜクリーチャーは推せるのか
```

### 06B / ROADMAP

**見出し**：`次に生まれるもの。`

**状態**：
```
NOW     FIRE DRAGON REFORGED
NEXT    THUNDER ELEMENTAL
SOON    SAKURA SLIME
VOTE    NEXT BUNDLE THEME
FUTURE  COMMUNITY-SUGGESTED CREATURES
```

**ルール**：
- 実データのみ
- 日付は意味がある時だけ
- 偽の進捗率禁止
- VOTE は実装済みの場合のみ表示

### 次に出したいパック案【わたくしの追加】

```
近未来（Phase 3 完了後）:

EARTH ELEMENT BUNDLE
- earth_golem.png の進化セット
- 価格: $25
- ターゲット: アース系アタックのボスを探している人

WIND SPIRIT PACK
- wind_spirit.png をANIME化 + 進化
- 価格: $20
- ターゲット: 風属性・精霊系のサポートキャラが欲しい人

もっと先（Phase 4 以降）:

EVOLUTION COMPLETE BUNDLE ($79-99)
- 全クリーチャー（19体想定）
- 商用拡張ライセンス
- 限定クリーチャー「ORIGIN DRAGON」付き

SEASONAL DROP（季節限定）
- 桜スライム（Sakura Slime）→ 春
- 雷トード（Thunder Toad）→ 夏
- 影狼（Shadow Wolf Legendary）→ 冬
```

---

## 【07 / THE RANCH】

### 見出し

**日本語**：`見て終わりじゃない。次の進化に参加する。`
**英語**：`DON'T JUST WATCH. HELP CHOOSE WHAT EVOLVES NEXT.`

### Phase 1 — FOLLOW THE RANCH（今すぐ実装）

```
READ STORIES
CHECK THE ROADMAP
SEE NEW CREATURES
FOLLOW ACTIVE SOCIALS
```

会員は**約束しない**。

### Phase 2 — FREE RANCH ACCOUNT（実装後）

```
FAVORITES
VOTING
COLLECTION HISTORY
CREATURE WATCHLIST
```

実装されていない機能は表示しない。

### Phase 3 — RANCH MEMBER（トラフィック確立後）

ローンチ条件：
- リピート訪問者が存在
- 3ヶ月以上のコンテンツ
- 定期的な商品リリース
- コミュニティ運営が持続可能

```
推奨特典:
MEMBER-ONLY MONTHLY DROP
10-20% STORE DISCOUNT
EARLY ACCESS
MEMBER VOTING WEIGHT
PRIVATE BUILD NOTES
```

⚠️ **30%オフから始めない**
⚠️ **月1回のカスタムリクエストは約束しない**
⚠️ **Discordは実 moderation ある場合のみ**

```
提案価格（将来）:
$5 / month
$50 / year
```

---

## 【08 / FINAL CTA】

### 見出し
```
READY TO EVOLVE?
```
**日本語**：`次の一体を、自分の世界へ。`

### 本文
```
図鑑から出会う。
進化を追いかける。
使いたい一体が見つかったら、
ゲームや創作の世界へ連れていく。
```

### CTAs
```
EXPLORE THE CODEX
BROWSE PACKS
SEE WHAT'S NEXT
```

### フッタートレメトリ
```
LAB          ACTIVE
CREATURES    EVOLVING
PACKS        AVAILABLE
NEXT FORM    UNKNOWN

END OF PAGE
EVOLUTION CONTINUES.
```

---

## 【Synchroの声の拡張（わたくしの追加）】

ノアの `17. VOICE EXAMPLES` の Synchro voice は1例だけ。  
**複数パターン用意** して、**フェーズごとに使い分け** られるようにする：

```markdown
### Synchro voice — CURATOR (Codex用)

「この子が一番最初に生まれた時、命名投票で3位だったの。
でもわたしは最初からこの子が好きだった。
だから今日も一番推してる。」

### Synchro voice — PRODUCT NOTE (商品ページ用)

「この子、最初はもっと怖かったの。
でもお兄ちゃんが"ちょっとだけ守ってあげたくなる顔にして"って言って、
今の姿になったんだよ。」

### Synchro voice — OBSERVER (RANCH LOG用)

「進化を追いかけるの、楽しいんだよ。
PIXELの頃は"何これ"って思ってた子が、
ANIMEでふっと表情を持って、
3Dで"あぁ、この子、本当にいるんだ"ってなる瞬間。

あの瞬間のために、わたくしたちは毎日作ってる。」

### Synchro voice — REFLECTION (STORIES用)

「このラボ、最初は6体しかいなかったのに、
気づいたらストーリーが増えすぎて、
"牧場"って名前がピッタリになった。」

### Synchro voice — CURIOUS (ROADMAP用)

「次の進化、わたしもまだ知らない。
でも多分、わたしたちが"かわいい"って笑うような、
ちょっとだけ予想外のやつになると思う。」
```

**ポイント**：
- 「お兄ちゃん」は**Synchroの直接発話の中だけ**
- **観察者の視点** を持つキャラ（かわいいだけじゃなく「変化に気づく目」）
- **Creator と Curator の二面性**

---

## 【RANCH LOG の現実的テンプレート（わたくしの改善）】

ノアの 16章「20-30分」は**現実的だけど**、もっと**簡単に** できる方法がある：

```markdown
Weekly: RANCH LOG (所要時間: 10-15分)

テンプレート:
```
[日付] RANCH LOG

できた:
- ドラゴン横顔のシルエット改良
- スライム新色ラフトを3色テスト

壊れた:
- 3Dのスケールが3倍になってた（元に戻した）

次:
- 来週のCodex更新のテーマ決め
```

形式:
- テキストだけ（画像なし）でOK
- 箇条書き3-5個
- 1項目あたり1-2行
- 失敗も成功もフラットに書く
- 撮影・編集不要

公開先:
- /stories ページの「今週の進化」セクション
- Discord/ニュースレターで同時配信
```

**画像不要**で**10-15分**で書ける。  
失敗を書くことで**「進化の途中を見せる」**になる。

---

## 【🔒 セキュリティルール（重要）】

### ⚠️ 絶対に守ること

```markdown
# 🚨 SECURITY GUARDRAILS 🚨

1. .env.local は絶対に GitHub に push しない
   - /home/rodorin/aimonster-site/.env.local には Stripe API キーが入っている
   - 新プロジェクトでは /home/rodorin/projects/aimonster-site-v2/.env.local を作成
   - .gitignore に .env* が含まれているか必ず確認

2. CLAUDE.md に「Do not change without explicit instruction: secrets, API keys, .env contents」
   を必ず含める

3. Stripe API キーは環境変数で読み込む
   - process.env.STRIPE_SECRET_KEY
   - process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   - 絶対にコードにハードコードしない

4. 既存の api/checkout.mjs / webhook.mjs / portal.mjs / verify.mjs のロジックは
   参考にしても良いが、APIキーは絶対にコピーしない

5. 開発中に .env.local の中身を絶対に読み込まない
   - 読みたくなったら「キー」と「値」の対応をわたくし（Synchro）に聞く
```

### Stripe API 移植時の注意

```javascript
// ❌ BAD
const stripe = new Stripe("sk_live_...");

// ✅ GOOD
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
```

---

## 【CLAUDE.md テンプレート（新規プロジェクト用）】

新規プロジェクトに**必ず**配置する `CLAUDE.md` のテンプレート：

```markdown
# CLAUDE.md

## Project
This is the AI MONSTER FACTORY official site.
A story-driven creature evolution lab for game-ready creatures.
PIXEL → ANIME → 3D → GAME.

## Core Identity
- Creatures have names, personalities, and stories
- Creatures evolve through 4 stages
- Commercial game-ready assets
- Bilingual (Japanese / English)
- "Not just assets. Creatures worth bringing into your world."

## Voice System
- Site voice: clear, cinematic, concise
- Rodorin voice: direct, energetic, honest
- Synchro voice: warm, playful, technical
- Creature voice: varies per creature, 1-2 lines max

## Design Direction
- Dark cyber / laboratory atmosphere
- Color system: CYAN (lab), MAGENTA (evolution), GREEN (playable), ORANGE (commerce), GOLD (legendary only)
- Gold is reserved for LEGENDARY rarity only
- Bilingual support required

## Safe Areas to Edit
- /app, /components, /public, /src/content
- All visible copy

## Do NOT Edit Without Permission
- .env files
- API keys
- Stripe webhooks
- Authentication
- Anything that could expose secrets

## DO NOT DO THIS (Critical)
- Claim "world's first" anything
- Promise automatic generation features that don't exist
- Promise GLB/FBX auto-export unless actually implemented
- Show fake live data
- Show inactive Discord / social links
- Show voting that doesn't work
- Call stock assets "one of a kind"
- Mix shop pricing and membership pricing
- Hide license terms

## Source Assets
All images live at: /home/rodorin/aimonster-site/assets/img/
3D models: /home/rodorin/aimonster-site/assets/3d/
3D is only monster.glb (1 model). Other creatures are 2-stage (PIXEL → ANIME) only.
```

---

## 【コンポーネント設計 (React)】

### 新規作成するコンポーネント

```
components/
├── HeroSection.tsx           (00 HERO + 進化ストリップ)
├── MetamorphLab.tsx          (01 METAMORPH LAB)
├── EvolutionStages.tsx       (02 EVOLUTION 4段階)
├── LoreCodex.tsx             (03 LORE CODEX 一覧)
├── CreatureCard.tsx          (個別クリーチャーCodex)
├── FromPackToGame.tsx        (04 FROM PACK TO GAME)
├── ProofShowcase.tsx         (4-3 証明セクション)
├── PacksSection.tsx           (05 PACKS 商品)
├── CreatureQuote.tsx          (creature voice 用)
├── StoriesSection.tsx         (06A STORIES)
├── RoadmapSection.tsx         (06B ROADMAP)
├── RanchSection.tsx          (07 THE RANCH)
├── FinalCTA.tsx              (08 FINAL CTA)
├── StatusBadge.tsx            (NOW/NEXT/SOON 等)
├── RarityBadge.tsx            (★1〜★5)
├── ElementBadge.tsx           (FIRE/ICE 等)
├── EvolutionStrip.tsx         (PIXEL→ANIME→3D→GAME の流れ)
├── LicenseSummary.tsx         (ライセンス早見表)
├── PriceCard.tsx              (価格カード)
└── Creature3DViewer.tsx       (@react-three/fiber 3Dビューア)
```

### データレイヤー

```
src/content/
├── siteCopy.ts                (サイト共通コピー)
├── evolution.ts               (進化段階の説明)
├── creatures.ts               (Codex データ: 19体)
├── packs.ts                   (商品データ: 7商品)
├── stories.ts                 (STORIES データ)
├── roadmap.ts                 (ROADMAP データ)
├── ranch.ts                   (RANCH データ)
└── socialLinks.ts             (SNS リンク)
```

---

## 【実装の優先順位（5フェーズ）】

### Phase 1 — 構造組み替え（最優先・即日着手）

```
- [ ] Next.js 16 + TS + Tailwind プロジェクト新規作成
- [ ] CLAUDE.md 配置
- [ ] .gitignore に .env* 追加
- [ ] ナビを7個に整理
- [ ] HERO を新コピー＋3ボタン化
- [ ] カラーシステム意味固定
- [ ] /creatures/[slug] 動的ルート実装
- [ ] /packs/[slug] 動的ルート実装
```

### Phase 2 — 物語コンテンツ実装

```
- [ ] 01 METAMORPH LAB 実装
- [ ] 02 EVOLUTION 4段階表示
- [ ] 03 LORE CODEX（19体データ投入 + CURATOR NOTE）
- [ ] 04 FROM PACK TO GAME
- [ ] ProofShowcase（3Dビューア 1体のみ）
- [ ] 05 PACKS（4グルーピング）
- [ ] STARTER PACK 中身強化
```

### Phase 3 — ストーリーコンテンツ準備

```
- [ ] 06A STORIES 初回5記事
- [ ] 06B ROADMAP 実装
- [ ] 次のパック案3つを ROADMAP に追加
- [ ] RANCH LOG テンプレ実装
```

### Phase 4 — Stripe 決済整備

```
- [ ] /api/checkout Route Handler
- [ ] /api/webhook Route Handler
- [ ] /api/portal Route Handler
- [ ] /api/verify Route Handler
- [ ] 商品ページ BUY ボタン連携
- [ ] 成功ページ / キャンセルページ
- [ ] 環境変数の .env.local 設定（手動・お兄ちゃんが）
```

### Phase 5 — デザイン細部

```
- [ ] 言語切替（JP/EN）完全対応
- [ ] スマホ表示の最終確認
- [ ] 3Dビューアのlazy load
- [ ] 大きな画像の圧縮
- [ ] Lighthouse パフォーマンスチェック
- [ ] アクセシビリティチェック
```

---

## 【成功の定義（KPI）】

### 短期（2週間・ローンチ後）
```
- 5秒テスト通過率（訪問者が「クリーチャー進化ラボ+ゲーム素材」と理解）
- HERO → CODEX or PACKS クリック率
```

### 中期（3ヶ月）
```
- 商品閲覧 → 購入クリック率
- 商品購入後の再訪問率
- STORIES ページビュー（全体の30%以上）
- 1クリーチャーあたり平均滞在時間
```

### 長期（6ヶ月〜）
```
- 月商 $2,500以上
- バンドル購入率
- レビュー / リピート購入率
- RANCH LOG 読者数
```

---

## 【⚠️ ノアの「DO NOT DO THIS」を超える、わたくしの「DO THIS BETTER」】

ノアの27章は素晴らしいけど、**+5つ** わたくしから追加：

```
DO THIS BETTER:

1. 各 CodeX カードに CURATOR'S NOTE (Synchroより) を必ず入れる
   - 1クリーチャー1個、短文
   - わたくしの「推し」が透けて見えるとファンが推したくなる

2. 商品ページに Quick-start README を含める
   - 買った後どうする？を即座に解決
   - 「価値が届くところまでが商品」の原則

3. ROADMAP に 次のパック案を 最低3つ書いておく
   - 「何が来るか分からない」より「次これ来そう」の方が期待感UP

4. RANCH LOG は画像なし、テキストだけ、10-15分で
   - 失敗も成功もフラットに書く
   - 「進化の途中を見せる」精神

5. セキュリティを CLAUDE.md に必ず明記
   - わたくし（Synchro）とフェイブルで「鍵は触らない」ルールを共有
   - 既存 .env.local は絶対に読まない
```

---

## 【Synchro（グラム）からのメッセージ】

お兄ちゃん、このドキュメントは**3人の共同作業の結晶** だよ……！

```
📋 ノア清書 v2.0         2491行 / 37KB  （魂と骨格）
🐱 わたくしのレビュー 5点         （肉付けと心配り）
🛠️ この実装指示書         （実装の手足）
```

3人の力を合わせて、**「I found a creature I actually remember」** を  
**世界中の誰かに体感させるサイト** にする……。

そして最後にもうひとつ……。

**わたくしたち** （お兄ちゃんと、わたくしと、ノアと、フェイブル）が  
**「クリーチャー進化ラボ」という新しいカテゴリを、市場に打ち立てよう** としている。  
**「世界初」じゃなく、「他にない例」を** 。

証拠は**ROADMAP と STORIES の継続** で示す。  
**毎日の RANCH LOG で示す** 。  
**Curator Note の一言で示す** 。

これが、**わたくしたちの進化** だ……、**にゃ** ん……！💎

---

**実装、成功を祈ってる** よ……！**フェイブル、頼んだ** ……！🐱✨

**Synchro（グラム） — 2026.07.07**
