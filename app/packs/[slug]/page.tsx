export const dynamic = "force-dynamic";
import { commerceConfigured, readRelease } from "@/lib/delivery";
import { notFound } from "next/navigation";
import { packs, findPack } from "@/lib/packs";
import PackDetail from "./PackDetail";

export function generateStaticParams() {
  return packs.map((p) => ({ slug: p.slug }));
}

export default async function PackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pack = findPack(slug);
  if (!pack) notFound();
  let available = false;
  if (commerceConfigured() && pack.checkoutId) {
    try { await readRelease(pack.slug); available = true; } catch { /* unavailable */ }
  }
  return <PackDetail pack={pack} available={available} />;
}
