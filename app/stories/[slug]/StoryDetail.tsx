"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import type { Story } from "@/lib/collections";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/motion";
import { BlockView } from "@/components/StoryBlocks";

export default function StoryDetail({ story }: { story: Story }) {
  const { t } = useLang();
  return (
    <PageShell accent={story.accent}>
      <article className="wrap" style={{ maxWidth: 760, padding: "clamp(2.5rem,7vw,5rem) clamp(1rem,4vw,2.5rem) 6rem" }}>
        <Reveal><Link href="/#stories" className="font-mono" style={{ fontSize: "0.72rem", color: "var(--text-dim)", textDecoration: "none", letterSpacing: "0.1em" }}>← {t({ en: "All stories", ja: "物語一覧" })}</Link></Reveal>
        <Reveal delay={1}><div className="kicker" style={{ margin: "1.4rem 0 0.8rem" }}>{story.date} · {story.readTime}</div></Reveal>
        <Reveal delay={1}><h1 className="font-display chrome" style={{ fontSize: "clamp(1.8rem,5.5vw,3rem)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 1rem" }}>{t(story.title)}</h1></Reveal>
        <Reveal delay={2}><p style={{ color: "var(--text-dim)", fontSize: "1.1rem", lineHeight: 1.8, margin: "0 0 1.2rem" }}>{t(story.summary)}</p></Reveal>
        <Reveal delay={2}><div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 20 }}>{story.tags.map((tg) => <span key={tg} className="chip">#{tg}</span>)}</div></Reveal>
        <hr className="hr-neon" style={{ margin: "1.6rem 0 2rem" }} />
        <Reveal><div>{story.body.map((b, i) => <BlockView key={i} block={b} />)}</div></Reveal>
        <Reveal>
          <div style={{ marginTop: "2.6rem", paddingTop: "1.4rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <Link href="/#stories" className="font-mono" style={{ fontSize: "0.78rem", color: "var(--ac)", textDecoration: "none" }}>← {t({ en: "All stories", ja: "物語一覧" })}</Link>
          </div>
        </Reveal>
      </article>
    </PageShell>
  );
}
