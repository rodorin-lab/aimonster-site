import { notFound } from "next/navigation";
import { creatures, findCreature } from "@/lib/creatures";
import CreatureDetail from "./CreatureDetail";

export function generateStaticParams() {
  return creatures.map((c) => ({ slug: c.slug }));
}

export default async function CreaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const creature = findCreature(slug);
  if (!creature) notFound();
  return <CreatureDetail creature={creature} />;
}
