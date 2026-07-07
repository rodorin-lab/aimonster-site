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
  return <PackDetail pack={pack} />;
}
