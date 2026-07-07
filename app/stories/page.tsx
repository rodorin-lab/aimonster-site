"use client";

import Link from "next/link";
import { useLang, bi } from "@/lib/i18n";
import { stories } from "@/lib/collections";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/motion";
import { Corners, Head, P, dOf, acClass } from "@/components/shared";

export default function StoriesIndex() {
  const { t } = useLang();
  return (
    <PageShell accent="magenta">
      <div className="wrap" style={{ padding: "clamp(2.5rem,7vw,5rem) clamp(1rem,4vw,2.5rem) 5rem" }}>
        <Reveal><Link href="/" className="font-mono" style={{ fontSize: "0.72rem", color: "var(--text-dim)", textDecoration: "none", letterSpacing: "0.1em" }}>← HOME</Link></Reveal>
        <div style={{ marginTop: 20 }}>
          <Head eyebrow="06 / STORIES" title={bi("What happened inside the lab.", "研究所の中で、何が起きたか。")} lead={bi(
            "Behind every shipped creature are failed generations, revised palettes, and honest limits.",
            "出荷された全てのクリーチャーの裏には、失敗した生成、修正された配色、そして正直な限界がある。",
          )} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
          {stories.map((s, i) => (
            <Reveal key={s.slug} delay={dOf(i)} className={acClass(s.accent)}>
              <Link href={`/stories/${s.slug}`} className="holo" style={{ display: "block", padding: "1.4rem", height: "100%", textDecoration: "none" }}>
                <Corners />
                <div className="font-mono" style={{ fontSize: "0.66rem", letterSpacing: "0.1em", color: "rgba(var(--ac-rgb),0.9)", marginBottom: 8 }}>{s.date} · {s.readTime}</div>
                <h3 className="font-display" style={{ fontSize: "1.08rem", fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>{t(s.title)}</h3>
                <P style={{ fontSize: "0.9rem" }}>{t(s.summary)}</P>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
