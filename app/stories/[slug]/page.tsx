import { notFound } from "next/navigation";
import { stories, findStory } from "@/lib/collections";
import StoryDetail from "./StoryDetail";

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = findStory(slug);
  if (!story) notFound();
  return <StoryDetail story={story} />;
}
