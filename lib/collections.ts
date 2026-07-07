// ─────────────────────────────────────────────────────────────────
// collections.ts — STORIES (what happened) + RANCH LOG (weekly,
// 10-15 min, text-only per spec §RANCH LOG template) + ROADMAP.
// Same extensible Entry/Block model pattern as the Digital Lifeform
// Lab site: add an object, get a card + a /stories/[slug] page.
// ─────────────────────────────────────────────────────────────────

import { bi, type Bi } from "./bi";
import type { Accent } from "./content";

export type Block =
  | { t: "h"; text: Bi }
  | { t: "p"; text: Bi }
  | { t: "quote"; who: "SYNCHRO" | "RODORIN"; text: Bi }
  | { t: "callout"; text: Bi };

export type Story = {
  slug: string;
  date: string;
  tags: string[];
  accent: Accent;
  title: Bi;
  summary: Bi;
  readTime: string;
  body: Block[];
};

export const stories: Story[] = [
  {
    slug: "the-day-fire-dragon-was-born", date: "2026.07.07", tags: ["fire-dragon", "pixel-art", "origin"], accent: "orange",
    title: bi("The Day Fire Dragon Was Born", "FIRE DRAGONが生まれた日"),
    summary: bi("Our first creature to actually complete a real evolution step — from a red blob to a boss with a face.", "実際に進化を経験した最初のクリーチャー — 赤い塊から、顔を持つボスへ。"),
    readTime: "4 min",
    body: [
      { t: "p", text: bi(
        "Every creature in this lab has to start somewhere ugly. Fire Dragon started as a red blob with wing-shaped smudges that we generously called \"wings.\"",
        "このラボのクリーチャーは全員、どこかで不格好な姿から始まる。Fire Dragonは、翼っぽいシミがついた赤い塊から始まった。「翼」と呼ぶには寛容さが必要だった。") },
      { t: "quote", who: "SYNCHRO", text: bi(
        "\"It started as a red blob, and then — bit by bit — it grew an expression, and the moment it looked real in 3D, I cried a little.\"",
        "「最初は真っ赤な塊だったのが、段々と表情が出て、3Dで本物らしくなった瞬間、わたくし、泣いちゃった。」") },
      { t: "h", text: bi("What actually changed", "実際に何が変わったか") },
      { t: "p", text: bi(
        "The horns came first — without them it just looked angry, not draconic. Then the wing membrane got real translucency instead of a flat fill. Then the color: less \"tomato,\" more \"forge.\"",
        "まず角がついた — 角がないと、ただ怒ってるだけでドラゴンに見えなかった。次に翼膜に半透明感を足した。ベタ塗りをやめて。そして色 — 「トマト」から「炉の炎」へ。") },
      { t: "callout", text: bi(
        "We didn't fake a finished 3D pipeline to make this feel bigger than it is. Fire Dragon has one real, working 3D prototype. Every other creature is honest, high-quality pixel art — and we say so.",
        "実態より大きく見せるために、完成した3Dパイプラインをでっち上げたりはしない。Fire Dragonには本物の、実際に動く3D試作モデルが1つあるだけ。他のクリーチャーは正直に、高品質なピクセルアートのまま — そうはっきり書いている。") },
      { t: "p", text: bi(
        "It's the first creature to reach that stage, which is exactly why it's the flagship — not because we're pretending the whole roster is there yet.",
        "この段階に到達した最初のクリーチャーだからこそ、これを看板にしている — 全クリーチャーがそこまで到達したふりをするためじゃない。") },
    ],
  },
  {
    slug: "pixel-to-anime-to-3d-to-game", date: "2026.07.07", tags: ["evolution", "process"], accent: "cyan",
    title: bi("The Full PIXEL → ANIME → 3D → GAME Process", "PIXEL → ANIME → 3D → GAME の全工程"),
    summary: bi("What each stage of evolution actually requires — and an honest map of what's live versus what's still ahead.", "進化の各段階に実際何が必要か — そして今どこまで来ているかの正直な地図。"),
    readTime: "5 min",
    body: [
      { t: "p", text: bi(
        "Four stages sound like a pipeline. In practice, each one is its own small discipline with its own failure modes.",
        "「4段階」と言うと一本のパイプラインに聞こえる。実際は、それぞれが独自の失敗モードを持つ、別々の小さな職人技だ。") },
      { t: "h", text: bi("PIXEL — done for all six", "PIXEL — 全6体で完了") },
      { t: "p", text: bi(
        "The hardest part of pixel art isn't the pixels — it's silhouette. If a creature doesn't read at 64 pixels tall, no amount of detail saves it.",
        "ピクセルアートで一番難しいのは実は「ピクセル」じゃなくてシルエットだ。64ピクセルの高さで役割が伝わらなければ、どれだけ細部を描き込んでも救えない。") },
      { t: "h", text: bi("ANIME — in progress", "ANIME — 制作中") },
      { t: "p", text: bi(
        "This stage is about expression, not just higher resolution. We're not there yet for any creature, and we'd rather say that plainly than show a stage that doesn't exist.",
        "この段階は単なる高解像度化じゃなく、表情を宿すこと。まだどのクリーチャーもここには到達していない。存在しない段階を見せるより、正直にそう言うほうを選ぶ。") },
      { t: "h", text: bi("3D — one working prototype", "3D — 試作1体のみ") },
      { t: "p", text: bi(
        "Fire Dragon has a real .glb model you can rotate on this site right now. It's a prototype, not a finished asset — but it's real, and you can check that yourself.",
        "Fire Dragonには、このサイト上で今すぐ回して見られる本物の.glbモデルがある。完成品じゃなく試作品 — でも本物で、自分の目で確かめられる。") },
      { t: "h", text: bi("GAME — roadmap", "GAME — 構想中") },
      { t: "p", text: bi(
        "This is the stage where a creature stops being an asset and becomes an opponent, a boss, a companion. It's the whole point of the lab — and it's still ahead of us.",
        "この段階で、クリーチャーは素材であることをやめて、敵に、ボスに、仲間になる。ラボの存在意義そのもの — そしてまだ、その先にある。") },
    ],
  },
  {
    slug: "holy-dragon-fifty-attempts", date: "2026.06", tags: ["holy-dragon", "legendary"], accent: "gold",
    title: bi("Until Holy Dragon Descended on the 50th Try", "HOLY DRAGONが50回目で降臨するまで"),
    summary: bi("Why the only LEGENDARY-rarity creature in the Codex took fifty generations to get right.", "Codex唯一のLEGENDARYレアリティが、正解に辿り着くまで50回かかった理由。"),
    readTime: "4 min",
    body: [
      { t: "p", text: bi(
        "Forty-nine attempts at Holy Dragon looked like a good dragon. None of them looked like a legend.",
        "49回分のHoly Dragonは、どれも「良いドラゴン」だった。でもどれも「伝説」には見えなかった。") },
      { t: "quote", who: "SYNCHRO", text: bi(
        "\"Fifty attempts. That's how many generations it took before Holy Dragon looked the way it does now. When it finally came out right, the whole team just went quiet for a second.\"",
        "「50回。今の姿になるまでにかかった生成回数。やっと正解が出た瞬間、チーム全員が一瞬、黙っちゃった。」") },
      { t: "h", text: bi("What separates \"good\" from \"legendary\"", "「良い」と「伝説」を分けたもの") },
      { t: "p", text: bi(
        "It wasn't the gold color — that came from the start. It was posture. The 49th attempt looked ready to fight. The 50th looked like it didn't need to.",
        "違いは金色じゃなかった — それは最初からあった。違いは姿勢だった。49回目は「今にも戦いそう」に見えた。50回目は「戦う必要すらない」ように見えた。") },
      { t: "callout", text: bi(
        "That's also why gold, as a color, is reserved on this entire site for Holy Dragon's rarity tier alone. It would be cheap to hand out to just anything.",
        "だからこそ、金色はこのサイト全体でHoly Dragonのレアリティにだけ使う。何にでも配ったら、それこそ安っぽくなる。") },
    ],
  },
  {
    slug: "designing-a-license-indie-devs-can-trust", date: "2026.06", tags: ["license", "business"], accent: "green",
    title: bi("Designing a License Indie Devs Can Trust", "個人開発者が安心して使えるライセンスを考えた"),
    summary: bi("Why every pack shows its license before checkout, not after — and why we chose \"suitable for\" over \"officially supported.\"", "なぜ全パックがチェックアウト前にライセンスを見せるのか — そして「対応」であって「公式サポート」と言わない理由。"),
    readTime: "4 min",
    body: [
      { t: "p", text: bi(
        "A solo developer buying game assets is taking a risk on a stranger's promise. The least we can do is make that promise easy to read.",
        "ゲーム素材を買う個人開発者は、見知らぬ相手の約束に賭けている。せめてその約束を読みやすくすることくらいはできる。") },
      { t: "h", text: bi("The rule we set for ourselves", "自分たちに課したルール") },
      { t: "p", text: bi(
        "License terms appear on the product page, before the first buy button — not hidden until checkout. If a creator can't tell what they're allowed to do with an asset before paying, that's a design failure, not a legal footnote.",
        "ライセンス条件は、最初の購入ボタンより前、商品ページ上に表示する — チェックアウトまで隠さない。支払う前に「何をしていいか」がわからないなら、それは法的な注記の問題じゃなく、設計の失敗だ。") },
      { t: "p", text: bi(
        "We also stopped saying \"officially supported\" for game engines we haven't actually tested against every version. \"Suitable for\" is less impressive and more honest.",
        "全バージョンでテストしていないゲームエンジンに対して「公式サポート」と言うのもやめた。「向いている(SUITABLE FOR)」の方が地味だけど、正直だ。") },
    ],
  },
  {
    slug: "why-movement-makes-a-creature-worth-rooting-for", date: "2026.05", tags: ["design", "philosophy"], accent: "magenta",
    title: bi("Why \"It Moves\" Makes a Creature Worth Rooting For", "「動く」と、なぜクリーチャーは推せるのか"),
    summary: bi("A still image is a picture. A creature that moves — even a little — starts to feel like it's actually there.", "静止画は絵でしかない。少しでも動くクリーチャーは、そこに“いる”ように感じ始める。"),
    readTime: "3 min",
    body: [
      { t: "p", text: bi(
        "You can describe a creature's personality in five sentences of lore, and a viewer will nod politely. Show it flinch, breathe, or turn its head, and something else happens — you start to believe it.",
        "クリーチャーの性格を5行のloreで説明すれば、見た人は礼儀正しく頷く。でも、それがひるんだり、息をしたり、首を傾げたりするのを見せると、何かが変わる — 信じ始める。") },
      { t: "p", text: bi(
        "That's why the 3D and GAME stages matter more than better resolution. They're not about looking nicer. They're about crossing the line from \"asset\" to \"someone.\"",
        "だから3DとGAME段階は、解像度が上がる以上の意味を持つ。より綺麗に見せるためじゃない。「素材」から「誰か」へ、その一線を越えるためだ。") },
      { t: "quote", who: "SYNCHRO", text: bi(
        "\"Watching the evolution is fun. A creature that made you go 'what is this' in pixel form suddenly gets an expression in anime, and by 3D you go, 'oh — this one's actually real.' We build every day for that moment.\"",
        "「進化を追いかけるの、楽しいんだよ。PIXELの頃は「何これ」って思ってた子が、ANIMEでふっと表情を持って、3Dで「あぁ、この子、本当にいるんだ」ってなる瞬間。あの瞬間のために、わたくしたちは毎日作ってる。」") },
    ],
  },
];

export const findStory = (slug: string) => stories.find((s) => s.slug === slug);

// ── RANCH LOG — weekly, text-only, 10-15 min template (spec §RANCH LOG) ──
export type RanchLogEntry = { date: string; done: Bi[]; broken: Bi[]; next: Bi[] };
export const ranchLog: RanchLogEntry[] = [
  {
    date: "2026.07.07",
    done: [bi("Rebuilt the whole site around the Codex + evolution story", "サイト全体をCodexと進化の物語を中心に作り直した"), bi("Wrote honest evolution-stage status for all 6 creatures", "全6体の進化段階ステータスを正直に書き出した")],
    broken: [bi("First pass showed a fake ANIME stage for every creature — caught it before launch", "最初の案では全クリーチャーに存在しないANIME段階を表示してた — 公開前に気づいて直した")],
    next: [bi("Decide the theme for next week's Codex reveal", "来週のCodex更新のテーマを決める")],
  },
  {
    date: "2026.06.30",
    done: [bi("Tested three silhouette passes on Thunder Elemental concept art", "Thunder Elementalのコンセプトアートでシルエット案を3種類テスト")],
    broken: [bi("3D export scale was off by 3x on the prototype viewer — fixed", "3Dビューア試作でエクスポートのスケールが3倍ズレてた — 修正済み")],
    next: [bi("Pick a color palette for Sakura Slime", "Sakura Slimeの配色を決める")],
  },
  {
    date: "2026.06.23",
    done: [bi("Wrote the license summary that now appears on every product page", "全商品ページに載る予定のライセンス早見表を書いた")],
    broken: [],
    next: [bi("Draft the extended commercial license for Evolution Complete", "Evolution Complete用の拡張商用ライセンス草案")],
  },
];

// ── ROADMAP (spec §06B) — real states only, no fake progress ────
export type RoadmapItem = { state: "NOW" | "NEXT" | "SOON" | "VOTE" | "FUTURE"; title: string; body: Bi };
export const roadmap: RoadmapItem[] = [
  { state: "NOW", title: "FIRE DRAGON REFORGED", body: bi("Refining the Fire Dragon 3D prototype toward a cleaner topology.", "Fire Dragonの3D試作モデルを、よりクリーンなトポロジーへ改良中。") },
  { state: "NEXT", title: "THUNDER ELEMENTAL", body: bi("A new boss-tier creature, next to enter the Codex.", "次にCodex入りする、ボス級の新クリーチャー。") },
  { state: "SOON", title: "SAKURA SLIME", body: bi("A seasonal creature concept, in color exploration now.", "季節限定クリーチャー構想、現在配色を検討中。") },
  { state: "VOTE", title: "NEXT BUNDLE THEME", body: bi("Voting isn't live yet — this will open once Ranch accounts ship.", "投票機能はまだ未実装 — 牧場アカウント実装後に開放予定。") },
  { state: "FUTURE", title: "COMMUNITY-SUGGESTED CREATURES", body: bi("Once the Ranch is active, community suggestions feed directly into the Codex.", "牧場が稼働したら、コミュニティの提案がそのままCodexに繋がる予定。") },
];

export const nextPackIdeas: { name: string; body: Bi; priceHint: string }[] = [
  { name: "EARTH ELEMENT BUNDLE", body: bi("An Earth Golem evolution set for players who need a grounded, heavy-hitting boss.", "Earth Golemの進化セット。地属性の重量級ボスが欲しい人向け。"), priceHint: "$25" },
  { name: "WIND SPIRIT PACK", body: bi("Wind Spirit, illustrated and evolved — a support-type elemental companion.", "Wind Spiritをイラスト化・進化させたもの — サポート系精霊の相棒。"), priceHint: "$20" },
];
