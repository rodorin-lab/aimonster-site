// ─────────────────────────────────────────────────────────────────
// creatures.ts — THE LORE CODEX. Six creatures, each real, each sold.
// Honesty checkpoint (verified against actual asset files 2026-07-07):
// every creature has ONE real pixel-art image — there is no separate
// "anime" stage art yet. Only Fire Dragon has a real 3D prototype
// (monster.glb). So EVOLUTION STATUS is reported exactly as it is:
// PIXEL is live for all six; 3D is a live prototype for Fire Dragon
// only; ANIME and GAME are in progress / roadmap, not shipped.
// Do not claim more than this. See CLAUDE.md "DO NOT DO THIS."
// ─────────────────────────────────────────────────────────────────

import { bi, type Bi } from "./bi";
import type { Accent } from "./content";

export type Element = "FIRE" | "ICE" | "DARK" | "HOLY" | "ELECTRIC" | "LAVA";
export type Role = "BOSS" | "ELITE" | "SUPPORT" | "MINION";
export type Rarity = "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY";
export type EvoStageId = "pixel" | "anime" | "three_d" | "game";
export type EvoState = "LIVE" | "PROTOTYPE" | "IN_PROGRESS" | "ROADMAP";

export const rarityStars: Record<Rarity, number> = {
  COMMON: 1, UNCOMMON: 2, RARE: 3, EPIC: 4, LEGENDARY: 5,
};
// GOLD is reserved for LEGENDARY only (spec §5) — everything else uses its element accent.
export const rarityAccent = (r: Rarity): Accent => (r === "LEGENDARY" ? "gold" : "magenta");

export type Creature = {
  slug: string;
  name: string;
  alias: Bi;
  image: string; // public/monsters/*.png — the real pixel-art asset
  element: Element;
  role: Role;
  rarity: Rarity;
  personality: Bi;
  origin: Bi;
  habitat: Bi;
  quote: Bi; // creature voice — 1-2 lines, used sparingly
  curatorNote: Bi; // Synchro voice (CURATOR pattern) — "お兄ちゃん" only here if used
  evolution: { stage: EvoStageId; state: EvoState }[];
  model3d?: string; // public/monsters/3d/*.glb — only set for the one real prototype
  packSlug?: string; // links to packs.ts BEST_SELLERS entry
  favoriteable: true; // real feature (localStorage), never fake counts
};

const EVO_STANDARD: Creature["evolution"] = [
  { stage: "pixel", state: "LIVE" },
  { stage: "anime", state: "IN_PROGRESS" },
  { stage: "three_d", state: "ROADMAP" },
  { stage: "game", state: "ROADMAP" },
];

const EVO_FLAGSHIP: Creature["evolution"] = [
  { stage: "pixel", state: "LIVE" },
  { stage: "anime", state: "IN_PROGRESS" },
  { stage: "three_d", state: "PROTOTYPE" },
  { stage: "game", state: "ROADMAP" },
];

export const creatures: Creature[] = [
  {
    slug: "fire-dragon",
    name: "FIRE DRAGON",
    alias: bi("Fire Dragon", "焔竜ホムラ"),
    image: "/monsters/dragon_fire.png",
    element: "FIRE", role: "BOSS", rarity: "EPIC",
    personality: bi(
      "Short-tempered and fiercely protective. Dives into the flames itself before it lets a companion get hurt.",
      "短気で正義感が強い。仲間を守るためなら、自ら炎の中へ飛び込む。",
    ),
    origin: bi(
      "A descendant of an ancient dragon line from the northern volcanic belt.",
      "北の火山帯に生息する古代竜の末裔。",
    ),
    habitat: bi("VOLCANIC MOUNTAIN RANGE", "火山山脈地帯"),
    quote: bi(
      "\"Fire doesn't scare me. Not being able to protect you — that's what scares me.\"",
      "「火は怖くない。守れないことの方が、ずっと怖い。」",
    ),
    curatorNote: bi(
      "\"Fire Dragon is the first one we got to actually evolve. It started as a red blob, and then — bit by bit — it grew an expression, and the moment it looked real in 3D, I cried a little.\"",
      "「ホムラは、わたしたちが最初に“進化”に成功した子。最初は真っ赤な塊だったのが、段々と表情が出て、3Dで本物らしくなった瞬間、わたくし、泣いちゃった。」",
    ),
    evolution: EVO_FLAGSHIP,
    model3d: "/monsters/3d/monster.glb",
    packSlug: "fire-dragon-pack",
    favoriteable: true,
  },
  {
    slug: "ice-dragon",
    name: "ICE DRAGON",
    alias: bi("Ice Dragon", "氷竜シグレ"),
    image: "/monsters/dragon_ice.png",
    element: "ICE", role: "BOSS", rarity: "RARE",
    personality: bi(
      "Calm to the point of unsettling. Speaks rarely, and when it does, the temperature in the room actually drops.",
      "不気味なほど冷静。滅多に喋らず、口を開くと本当に部屋の温度が下がる。",
    ),
    origin: bi(
      "Said to have slept beneath a glacier for a hundred years before anyone saw it move.",
      "百年の間、氷河の下で眠っていたと言われている。誰も動く姿を見たことがなかった。",
    ),
    habitat: bi("FROZEN HIGHLANDS", "凍土高地"),
    quote: bi(
      "\"Warmth is temporary. Stillness lasts.\"",
      "「温かさは一瞬。静けさは、ずっと続く。」",
    ),
    curatorNote: bi(
      "\"Ice Dragon almost didn't make the cut — the first pixel pass looked too soft. We pushed the sharpness of the crystal spikes three more times until it finally felt cold enough.\"",
      "「シグレは、実は最初のピクセル案だと柔らかすぎてボツになりかけたの。氷の棘のシャープさを3回描き直して、やっと“冷たさ”が出た。」",
    ),
    evolution: EVO_STANDARD,
    packSlug: "ice-dragon-pack",
    favoriteable: true,
  },
  {
    slug: "electric-slime",
    name: "ELECTRIC SLIME",
    alias: bi("Electric Slime", "電撃スライム・ビリー"),
    image: "/monsters/slime_electric.png",
    element: "ELECTRIC", role: "SUPPORT", rarity: "UNCOMMON",
    personality: bi(
      "Can't sit still. Bounces even when nobody's watching, and startles itself with its own static shocks.",
      "じっとしていられない性格。誰も見てなくても跳ね続けて、自分の静電気に自分で驚く。",
    ),
    origin: bi(
      "Formed near an old power relay where the slime absorbed stray current for years.",
      "古い送電中継地の近くで生まれた。長年、漏れた電流を吸収し続けてこの姿になった。",
    ),
    habitat: bi("ABANDONED POWER STATION", "廃電力施設"),
    quote: bi(
      "\"Zap first, apologize later!\"",
      "「まず感電、謝るのはあと！」",
    ),
    curatorNote: bi(
      "\"This one's my comic relief pick. Every dungeon needs one enemy that makes players laugh before it makes them lose HP.\"",
      "「この子はコメディ担当。どんなダンジョンにも、HPを削る前にプレイヤーを笑わせる敵が一体は必要だから。」",
    ),
    evolution: EVO_STANDARD,
    packSlug: "electric-slime-pack",
    favoriteable: true,
  },
  {
    slug: "dark-dragon",
    name: "DARK DRAGON",
    alias: bi("Dark Dragon", "闇竜ヴォイド・シェイド"),
    image: "/monsters/dragon_dark.png",
    element: "DARK", role: "BOSS", rarity: "EPIC",
    personality: bi(
      "Doesn't roar, doesn't taunt. Watches, waits, and only moves once it already knows it has won.",
      "吠えない、挑発しない。ただ観察し、待ち、勝てると確信した時にだけ動く。",
    ),
    origin: bi(
      "A dragon that stopped casting a shadow after a battle no story fully explains.",
      "ある戦いの後、影を落とさなくなった竜。その戦いの全容は、どの物語にも残っていない。",
    ),
    habitat: bi("THE UNLIT DEPTHS", "光の届かぬ深淵"),
    quote: bi(
      "\"You saw me coming. That was your first mistake.\"",
      "「私が来るのを見た。それが、お前の最初の過ちだ。」",
    ),
    curatorNote: bi(
      "\"Dark Dragon's palette went through more revisions than any other creature here — too purple felt silly, too black felt invisible against dark levels. This shade of violet was revision six.\"",
      "「ヴォイド・シェイドの配色は、ここにいる誰よりも修正回数が多かった。紫が強すぎるとチープに、黒すぎると暗いステージで見えなくなる。今の紫は6回目の修正案だよ。」",
    ),
    evolution: EVO_STANDARD,
    packSlug: "dark-dragon-pack",
    favoriteable: true,
  },
  {
    slug: "lava-slime",
    name: "LAVA SLIME",
    alias: bi("Lava Slime", "溶岩スライム・マグ"),
    image: "/monsters/slime_lava.png",
    element: "LAVA", role: "MINION", rarity: "UNCOMMON",
    personality: bi(
      "Slow-moving and good-natured — right up until something steps on it, and then the floor is lava, literally.",
      "動きは鈍く温厚 — でも何かに踏まれた瞬間、文字通り床が溶岩になる。",
    ),
    origin: bi(
      "Formed where an underground magma vent meets the water table, cooling just enough to hold its shape.",
      "地下のマグマ噴出口が地下水脈と接する場所で生まれた。形を保てるギリギリまで冷えて固まっている。",
    ),
    habitat: bi("MAGMA VENT CAVERNS", "マグマ噴出洞窟"),
    quote: bi(
      "\"I'm not angry. I'm just... 1,200 degrees.\"",
      "「怒ってないよ。ただ…1200度なだけ。」",
    ),
    curatorNote: bi(
      "\"Lava Slime is proof a 'minion' enemy doesn't have to look throwaway. We gave it the same lighting pass as the bosses. It deserves that.\"",
      "「マグは“雑魚敵”だってちゃんと作り込めるって証明したかった子。ボスと同じライティング処理をかけてる。それだけの価値がある子だから。」",
    ),
    evolution: EVO_STANDARD,
    packSlug: "lava-slime-pack",
    favoriteable: true,
  },
  {
    slug: "holy-dragon",
    name: "HOLY DRAGON",
    alias: bi("Holy Dragon", "聖竜アルテミア"),
    image: "/monsters/dragon_holy.png",
    element: "HOLY", role: "BOSS", rarity: "LEGENDARY",
    personality: bi(
      "Serene, deliberate, and utterly without malice — which somehow makes it more intimidating, not less.",
      "静謐で、動じない。悪意が一切ないことが、逆に威圧感になっている。",
    ),
    origin: bi(
      "Said to appear only when a story truly needs it to — never summoned, only arrived at.",
      "本当に物語がそれを必要とした時にだけ現れると言われている。呼び出されるのではなく、辿り着かれる存在。",
    ),
    habitat: bi("THE UPPER SANCTUM", "天の聖域"),
    quote: bi(
      "\"I do not fight for glory. I fight because someone must remain standing.\"",
      "「私は栄光のために戦わない。ただ、誰かが立っていなければならないから戦う。」",
    ),
    curatorNote: bi(
      "\"Fifty attempts. That's how many generations it took before Holy Dragon looked the way it does now. When it finally came out right, the whole team just went quiet for a second.\"",
      "「50回。今の姿になるまでにかかった生成回数。やっと正解が出た瞬間、チーム全員が一瞬、黙っちゃった。」",
    ),
    evolution: EVO_STANDARD,
    packSlug: "holy-dragon-pack",
    favoriteable: true,
  },
];

export const findCreature = (slug: string) => creatures.find((c) => c.slug === slug);

export const filterGroups: { id: "all" | "dragon" | "slime" | "boss" | "legendary"; label: Bi }[] = [
  { id: "all", label: bi("ALL", "すべて") },
  { id: "dragon", label: bi("DRAGON", "ドラゴン") },
  { id: "slime", label: bi("SLIME", "スライム") },
  { id: "boss", label: bi("BOSS", "ボス") },
  { id: "legendary", label: bi("LEGENDARY", "レジェンダリー") },
];

export function matchesFilter(c: Creature, f: string): boolean {
  if (f === "all") return true;
  if (f === "dragon") return c.name.includes("DRAGON");
  if (f === "slime") return c.name.includes("SLIME");
  if (f === "boss") return c.role === "BOSS";
  if (f === "legendary") return c.rarity === "LEGENDARY";
  return true;
}
