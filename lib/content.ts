// ─────────────────────────────────────────────────────────────────
// content.ts — site-wide copy per MASTER SPEC v2.0. Semantic 4-color
// system + GOLD reserved for LEGENDARY only. Only real, verified
// links and real product/feature availability — never fake progress.
// ─────────────────────────────────────────────────────────────────

import { bi, type Bi } from "./bi";

export type Accent = "cyan" | "magenta" | "green" | "orange" | "gold";

export const LINKS = {
  github: "https://github.com/rodorin-lab",
  siteLab: "https://digital-lifeform-lab.vercel.app",
} as const;

export const brand = {
  name: "AI MONSTER FACTORY",
  sub: bi("CREATURE EVOLUTION LAB", "クリーチャー進化ラボ"),
};

// ── Nav — 7 items (spec §sitemap) ────────────────────────────────
export type NavItem = { id: string; label: Bi; ch: string };
export const nav: NavItem[] = [
  { id: "lab", label: bi("Lab", "ラボ"), ch: "01" },
  { id: "evolution", label: bi("Evolution", "進化"), ch: "02" },
  { id: "codex", label: bi("Codex", "図鑑"), ch: "03" },
  { id: "packs", label: bi("Packs", "パック"), ch: "04" },
  { id: "stories", label: bi("Stories", "物語"), ch: "05" },
  { id: "roadmap", label: bi("Roadmap", "ロードマップ"), ch: "06" },
  { id: "ranch", label: bi("Ranch", "牧場"), ch: "07" },
];

// ── 00 / HERO ─────────────────────────────────────────────────────
export const hero = {
  systemBar: ["AI MONSTER FACTORY", "CREATURE EVOLUTION LAB", "STATUS: GROWING"],
  evoStrip: ["PIXEL", "ANIME", "3D", "GAME"],
  eyebrow: bi("GAME ASSETS FOR INDIE DEVELOPERS", "インディーゲーム開発者向け・商用利用OK"),
  headline: bi("CREATURES FOR YOUR GAME.", "物語を持つモンスターを、すぐゲームへ。"),
  body: bi(
    "Download story-driven monster assets as PNG, sprite sheets, JSON, and GLB. Use them as enemies, bosses, or companions in your game.\n\nStart with 3 creatures for $9.90 — commercial use included.",
    "名前と物語を持つモンスター素材を、PNG・スプライトシート・JSON・GLBで提供。敵、ボス、仲間としてゲームへ組み込めます。\n\nまずは3体入り $9.90から。商用利用ライセンス込み。",
  ),
  ctas: [
    { label: bi("View Starter Pack — $9.90", "Starter Packを見る — $9.90"), to: "/packs/creature-starter-pack", accent: "green" as Accent, solid: true, kind: "route" as const },
    { label: bi("Meet Fire Dragon for free", "無料でFire Dragonを見る"), to: "/creatures/fire-dragon", accent: "magenta" as Accent, solid: false, kind: "route" as const },
    { label: bi("Explore the Codex", "図鑑を見る"), to: "codex", accent: "cyan" as Accent, solid: false, kind: "anchor" as const },
  ],
  proof: [
    bi("COMMERCIAL USE", "商用利用対応"),
    bi("GAME-READY FORMATS", "ゲーム制作向け"),
    bi("STORY-DRIVEN CREATURES", "名前と物語つき"),
  ] as Bi[],
  scrollHint: bi("SCROLL TO DESCEND", "スクロールして潜行"),
};

// ── 01 / THE METAMORPH LAB ────────────────────────────────────────
export const metamorphLab = {
  eyebrow: "01 / THE METAMORPH LAB",
  heading: bi("This is not just a monster store.", "ここは、モンスターを並べるだけの店じゃない。"),
  lead: bi(
    "A creature begins as a small pixel.\n\nIt gains expression through illustration, a body through 3D, and finally movement inside a game.\n\nAI MONSTER FACTORY is a lab built around that entire evolution.",
    "ひとつのクリーチャーが、\n小さなPIXELとして生まれ、\nイラストで表情を持ち、\n3Dで身体を得て、\nゲームの中で動き始める。\n\nAI MONSTER FACTORYは、\nその進化の全部を見せる研究所です。",
  ),
  principles: [
    { k: "NAME", v: bi("It has a name.", "名前がある。") },
    { k: "LORE", v: bi("It has a story.", "物語がある。") },
    { k: "EVOLUTION", v: bi("And it evolves.", "そして、進化する。") },
  ] as { k: string; v: Bi }[],
  manifesto: bi(
    "Not just assets.\nCreatures worth bringing into your world.",
    "ただの素材ではなく、\n世界に迎えたくなるクリーチャーを。",
  ),
};

// ── 02 / EVOLUTION ────────────────────────────────────────────────
export type StageId = "pixel" | "anime" | "three_d" | "game";
export const evolution = {
  eyebrow: "02 / EVOLUTION",
  heading: bi("FOUR STAGES. ONE CREATURE.", "4つの姿。1体のクリーチャー。"),
  lead: bi(
    "The lab is evolving too. Here's exactly what's real today, and what's still ahead — no stage is claimed before it's actually shipped.",
    "ラボ自体も進化の途中。今日、本当に存在する段階と、まだ先にある段階を正直に。嘘はつかない。",
  ),
  stages: [
    { id: "pixel" as StageId, label: "PIXEL", state: bi("LIVE — all 6 creatures", "稼働 — 全6体"),
      body: bi("Where every game begins. A silhouette that reads its role at a glance, even on a tiny screen.", "ゲームの原点。小さな画面でも、ひと目で役割が伝わる姿。") },
    { id: "anime" as StageId, label: "ANIME", state: bi("IN PROGRESS", "制作中"),
      body: bi("Expression is born. Personality, mood, and the reason you'd root for it start to show.", "表情が生まれる。性格、空気感、「推したくなる理由」が見えてくる。") },
    { id: "three_d" as StageId, label: "3D", state: bi("PROTOTYPE — Fire Dragon only", "試作 — Fire Dragonのみ"),
      body: bi("A body. Turn it around, get close, and it becomes something that exists in the world — not just on a card.", "身体を得る。回して見る。近づいて見る。世界に存在する形になる。") },
    { id: "game" as StageId, label: "GAME", state: bi("ROADMAP", "構想中"),
      body: bi("Finally, it moves. As an enemy. As a boss. As a companion. This is where the asset becomes part of a game.", "最後に、動き始める。敵として。ボスとして。仲間として。ここで素材が、ゲームの一部になる。") },
  ],
  note: bi(
    "Only Fire Dragon has reached the 3D stage so far (a real, working prototype model). Every other creature you see here is genuine, shipped pixel art — not a placeholder.",
    "現時点で3D段階に到達しているのはFire Dragonのみ(実際に動く試作モデル)。それ以外のクリーチャーは全て本物の、出荷済みピクセルアートです。プレースホルダーではありません。",
  ),
};

// ── 04 / FROM PACK TO GAME ────────────────────────────────────────
export const fromPackToGame = {
  eyebrow: "FIELD GUIDE / FROM PACK TO GAME",
  heading: bi("FROM PACK TO YOUR WORLD.", "ダウンロードして、自分の世界へ。"),
  steps: [
    { n: "01", k: "CHOOSE", v: bi("Pick a creature.", "クリーチャーを選ぶ。") },
    { n: "02", k: "DOWNLOAD", v: bi("Get the full file set.", "ファイル一式を受け取る。") },
    { n: "03", k: "IMPORT", v: bi("Bring it into your tool or game engine.", "対応するツールやゲームエンジンへ。") },
    { n: "04", k: "BUILD", v: bi("Use it as an enemy, a boss, or a companion in your own world.", "敵、ボス、仲間として、自分の世界に組み込む。") },
  ] as { n: string; k: string; v: Bi }[],
  compat: {
    formatsLabel: bi("Compatible formats:", "対応フォーマット:"),
    formats: ["PNG", "JSON", "GLB"],
    enginesLabel: bi("Suitable for:", "使う用語:"),
    engines: ["UNITY", "UNREAL", "GODOT", "BROWSER"],
    note: bi(
      "\"Suitable for\" — not \"officially supported.\" We haven't run automated tests against every engine version.",
      "「SUITABLE FOR(向いている)」であって「OFFICIALLY SUPPORTED(公式サポート)」ではありません。全エンジンバージョンでの自動テストは行っていません。",
    ),
  },
  proof: {
    heading: bi("SEE IT IN GAME.", "本当に動くところを見る。"),
    lead: bi("The 3D prototype below is real and interactive — drag to rotate it yourself.", "下の3D試作モデルは本物で操作できます — ドラッグして回してみて。"),
  },
};

// ── 07 / THE RANCH — Phase 1 only (spec §07: don't promise membership) ──
export const ranch = {
  eyebrow: "07 / THE RANCH",
  heading: bi("DON'T JUST WATCH. HELP CHOOSE WHAT EVOLVES NEXT.", "見て終わりじゃない。次の進化に参加する。"),
  lead: bi(
    "No membership to join yet — just real, honest ways to follow what's happening in the lab right now.",
    "まだ会員制度はありません — 今のラボで起きていることを追いかける、正直な方法だけ。",
  ),
  phase1: [
    { label: bi("Read Stories", "物語を読む"), href: "#stories" },
    { label: bi("Check the Roadmap", "ロードマップを見る"), href: "#roadmap" },
    { label: bi("See new creatures", "新クリーチャーを見る"), href: "#codex" },
    { label: bi("Follow the build on GitHub", "GitHubで制作を追う"), href: LINKS.github, external: true },
  ] as { label: Bi; href: string; external?: boolean }[],
  future: {
    label: bi("LATER (not yet live)", "今後(まだ実装されていません)"),
    phase2: bi("Free Ranch account — favorites, voting, watchlist", "無料牧場アカウント — お気に入り、投票、ウォッチリスト"),
    phase3: bi("Ranch Membership — monthly drops, store discount (launches once traffic + content are established)", "牧場メンバーシップ — 月次ドロップ、ストア割引(トラフィックとコンテンツが確立してから開始)"),
  },
};

// ── 08 / FINAL CTA ────────────────────────────────────────────────
export const finalCta = {
  heading: bi("READY TO EVOLVE?", "次の一体を、自分の世界へ。"),
  body: bi(
    "Discover a creature in the Codex. Follow its evolution. When you find the one you want, bring it into your game or creative world.",
    "図鑑から出会う。進化を追いかける。使いたい一体が見つかったら、ゲームや創作の世界へ連れていく。",
  ),
  // "anchor" = section on this homepage (scroll), "route" = a real page (navigate).
  ctas: [
    { label: bi("Explore the Codex", "図鑑を見る"), to: "codex", kind: "anchor" as const },
    { label: bi("Browse Packs", "パックを見る"), to: "packs", kind: "anchor" as const },
    { label: bi("See What's Next", "次を見る"), to: "/roadmap", kind: "route" as const },
  ],
  telemetry: [
    { k: "LAB", v: "ACTIVE" }, { k: "CREATURES", v: "EVOLVING" },
    { k: "PACKS", v: "AVAILABLE" }, { k: "NEXT FORM", v: "UNKNOWN" },
  ] as { k: string; v: string }[],
  end: ["END OF PAGE", "EVOLUTION CONTINUES."],
};

export const footer = {
  line: bi("Built inside AI MONSTER FACTORY — part of the Digital Lifeform Lab family.", "AIモンスター・ファクトリー謹製 — Digital Lifeform Labファミリーの一員。"),
};
