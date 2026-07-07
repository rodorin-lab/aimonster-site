// Server-safe primitives (no "use client"): shared by both server route
// files and client components so data modules can build bilingual content
// without pulling in the client-only language context.

export type Lang = "en" | "ja";

/** A bilingual string. */
export type Bi = { en: string; ja: string };

export const bi = (en: string, ja: string): Bi => ({ en, ja });
