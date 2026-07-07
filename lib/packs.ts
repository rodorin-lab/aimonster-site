// ─────────────────────────────────────────────────────────────────
// packs.ts — products. Prices and contents per spec §05. Only real,
// currently-sellable products have a `checkoutId` — that id is what
// /api/checkout uses to build the Stripe line item server-side.
// COMPLETE COLLECTION is intentionally NOT purchasable yet (spec §12:
// never show a future placeholder as if it's available today).
// ─────────────────────────────────────────────────────────────────

import { bi, type Bi } from "./bi";
import type { Accent } from "./content";

export type PackGroup = "start-here" | "best-sellers" | "legendary" | "complete-collection";

export type Pack = {
  slug: string;
  checkoutId?: string; // present only for real, buyable packs
  group: PackGroup;
  name: string;
  image: string;
  priceUsd: number; // in dollars (checkout converts to cents)
  forWho: Bi;
  includes: Bi[];
  formats: string[];
  license: Bi;
  accent: Accent;
  creatureSlugs: string[]; // links into creatures.ts
  synchroNote?: Bi;
};

export const packs: Pack[] = [
  {
    slug: "creature-starter-pack",
    checkoutId: "creature-starter-pack",
    group: "start-here",
    name: "CREATURE STARTER PACK",
    image: "/monsters/dragon_starter_cover.png",
    priceUsd: 9.9,
    forWho: bi(
      "Anyone who wants to see what evolution looks like before committing to a full pack.",
      "本格的なパックを買う前に、進化の中身を見てみたい人向け。",
    ),
    includes: [
      bi("3 fan-favorite creatures: Fire Dragon + Electric Slime + one random creature from the Codex", "人気クリーチャー3体: FIRE DRAGON + ELECTRIC SLIME + Codexからランダム1体"),
      bi("High-resolution pixel art (PNG + sprite sheet)", "高解像度ピクセルアート(PNG + スプライトシート)"),
      bi("Commercial-use license (personal + commercial games OK)", "商用利用ライセンス(個人・商用ゲームOK)"),
      bi("Quick-start README (English + Japanese)", "クイックスタートREADME(英語+日本語)"),
      bi("Bonus: Codex mini-guide PDF (all 6 creatures)", "ボーナス: Codex簡易図鑑PDF(全6体)"),
      bi("30-day email support", "30日間メールサポート"),
    ],
    formats: ["PNG", "JSON"],
    license: bi("Commercial use included.", "商用利用込み。"),
    accent: "green",
    creatureSlugs: ["fire-dragon", "electric-slime"],
    synchroNote: bi(
      "\"If you only try one thing here, try this. It's the cheapest way to find out if you actually like what we make.\"",
      "「ここで一つだけ試すなら、これにして。わたくしたちの作るものが本当に好きか、一番安く確かめられる方法だから。」",
    ),
  },
  {
    slug: "fire-dragon-pack", checkoutId: "fire-dragon-pack", group: "best-sellers",
    name: "FIRE DRAGON PACK", image: "/monsters/dragon_fire.png", priceUsd: 25,
    forWho: bi("Anyone who needs a boss-tier fire creature with real presence.", "存在感のある炎属性ボスクリーチャーが欲しい人向け。"),
    includes: [
      bi("Fire Dragon full pixel-art set", "Fire Dragon 高解像度ピクセルアート一式"),
      bi("3D prototype model (.glb) — the only creature with a 3D stage today", "3D試作モデル(.glb) — 現時点で3D段階があるのはこの子だけ"),
      bi("Commercial-use license", "商用利用ライセンス"),
    ],
    formats: ["PNG", "JSON", "GLB"], license: bi("Commercial use included.", "商用利用込み。"),
    accent: "orange", creatureSlugs: ["fire-dragon"],
  },
  {
    slug: "ice-dragon-pack", checkoutId: "ice-dragon-pack", group: "best-sellers",
    name: "ICE DRAGON PACK", image: "/monsters/dragon_ice.png", priceUsd: 20,
    forWho: bi("Games that need a calm, deliberate ice-themed boss or elite.", "冷静で威圧感のある氷属性ボス/エリートが欲しいゲーム向け。"),
    includes: [bi("Ice Dragon full pixel-art set", "Ice Dragon 高解像度ピクセルアート一式"), bi("Commercial-use license", "商用利用ライセンス")],
    formats: ["PNG", "JSON"], license: bi("Commercial use included.", "商用利用込み。"),
    accent: "orange", creatureSlugs: ["ice-dragon"],
  },
  {
    slug: "electric-slime-pack", checkoutId: "electric-slime-pack", group: "best-sellers",
    name: "ELECTRIC SLIME PACK", image: "/monsters/slime_electric.png", priceUsd: 15,
    forWho: bi("Early-game enemy design — quick, cheap, full of personality.", "序盤の敵デザイン向け — 手軽・安価・個性たっぷり。"),
    includes: [bi("Electric Slime full pixel-art set", "Electric Slime 高解像度ピクセルアート一式"), bi("Commercial-use license", "商用利用ライセンス")],
    formats: ["PNG", "JSON"], license: bi("Commercial use included.", "商用利用込み。"),
    accent: "orange", creatureSlugs: ["electric-slime"],
  },
  {
    slug: "dark-dragon-pack", checkoutId: "dark-dragon-pack", group: "best-sellers",
    name: "DARK DRAGON PACK", image: "/monsters/dragon_dark.png", priceUsd: 25,
    forWho: bi("A late-game boss that wins through patience, not brute force.", "力押しじゃなく“待ち”で勝つ終盤ボスが欲しい人向け。"),
    includes: [bi("Dark Dragon full pixel-art set", "Dark Dragon 高解像度ピクセルアート一式"), bi("Commercial-use license", "商用利用ライセンス")],
    formats: ["PNG", "JSON"], license: bi("Commercial use included.", "商用利用込み。"),
    accent: "orange", creatureSlugs: ["dark-dragon"],
  },
  {
    slug: "lava-slime-pack", checkoutId: "lava-slime-pack", group: "best-sellers",
    name: "LAVA SLIME PACK", image: "/monsters/slime_lava.png", priceUsd: 15,
    forWho: bi("Mid-game dungeon filler that still looks boss-quality.", "中盤ダンジョンの雑魚敵、でもボス級の作り込みが欲しい人向け。"),
    includes: [bi("Lava Slime full pixel-art set", "Lava Slime 高解像度ピクセルアート一式"), bi("Commercial-use license", "商用利用ライセンス")],
    formats: ["PNG", "JSON"], license: bi("Commercial use included.", "商用利用込み。"),
    accent: "orange", creatureSlugs: ["lava-slime"],
  },
  {
    slug: "holy-dragon-pack", checkoutId: "holy-dragon-pack", group: "legendary",
    name: "HOLY DRAGON PACK", image: "/monsters/dragon_holy.png", priceUsd: 30,
    forWho: bi("Boss fights and pivotal characters that need legendary presence.", "ボス戦や重要キャラクターに、伝説級の存在感を。"),
    includes: [bi("Holy Dragon full pixel-art set", "Holy Dragon 高解像度ピクセルアート一式"), bi("Commercial-use license", "商用利用ライセンス")],
    formats: ["PNG", "JSON"], license: bi("Commercial use included.", "商用利用込み。"),
    accent: "gold", creatureSlugs: ["holy-dragon"],
    synchroNote: bi(
      "\"This one took fifty generations to get right. Gold isn't decoration on this card — it's earned.\"",
      "「この子は50回の生成を経てやっと完成した。このカードの金色は飾りじゃなくて、勝ち取ったものだよ。」",
    ),
  },
  {
    slug: "evolution-complete", group: "complete-collection",
    name: "EVOLUTION COMPLETE", image: "/monsters/gallery_banner.png", priceUsd: 0,
    forWho: bi("Studios and creators who want the entire roster in one purchase.", "全クリーチャーを一括で欲しいスタジオ/クリエイター向け。"),
    includes: [
      bi("All current and future creature packs", "現在および今後の全クリーチャーパック"),
      bi("Bundle discount", "バンドル割引"),
      bi("A future exclusive creature: ORIGIN DRAGON", "限定クリーチャー「ORIGIN DRAGON」"),
      bi("Extended commercial license (once the legal terms are written)", "商用拡張ライセンス(法的文書の準備が整い次第)"),
    ],
    formats: ["PNG", "JSON", "GLB"], license: bi("Coming with Phase 4 — not sold yet.", "Phase 4で提供予定 — まだ販売していません。"),
    accent: "orange", creatureSlugs: [],
  },
];

export const findPack = (slug: string) => packs.find((p) => p.slug === slug);
export const bestSellers = () => packs.filter((p) => p.group === "best-sellers");
export const legendaryPacks = () => packs.filter((p) => p.group === "legendary");
export const startHerePack = () => packs.find((p) => p.group === "start-here")!;
export const completeCollection = () => packs.find((p) => p.group === "complete-collection")!;
