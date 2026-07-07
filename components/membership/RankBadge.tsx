import { getRankBenefits, type Rank } from "@/lib/rank";
import { useLang } from "@/lib/i18n";

export function RankBadge({ rank, size = "md" }: { rank: Rank; size?: "sm" | "md" | "lg" }) {
  const { t } = useLang();
  const b = getRankBenefits(rank);
  const isGold = rank === "LEGEND";
  const fontSize = size === "lg" ? "1.1rem" : size === "sm" ? "0.72rem" : "0.85rem";
  const pad = size === "lg" ? "0.5em 1em" : size === "sm" ? "0.2em 0.6em" : "0.35em 0.8em";
  return (
    <span
      className={isGold ? "chip chrome-gold" : "chip"}
      style={{
        fontSize, padding: pad, fontWeight: 800, letterSpacing: "0.06em",
        borderColor: `var(--${b.color === "text-faint" ? "text-faint" : b.color})`,
        color: `var(--${b.color === "text-faint" ? "text-faint" : b.color})`,
        display: "inline-flex", alignItems: "center", gap: "0.4em",
      }}
    >
      <span>{b.emoji}</span>
      <span>{t(b.label).toUpperCase()}</span>
    </span>
  );
}
