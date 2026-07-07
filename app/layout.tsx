import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Orbitron, Chakra_Petch } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const orbitron = Orbitron({ variable: "--font-orbitron", subsets: ["latin"], weight: ["500", "700", "800", "900"] });
const chakra = Chakra_Petch({ variable: "--font-chakra", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "AI MONSTER FACTORY | Creature Evolution Lab",
  description:
    "A story-driven creature evolution lab. Monsters evolve from pixel art to anime art, 3D models, and game-ready assets. Discover a creature, follow its evolution, bring it into your world.",
  keywords: [
    "game assets", "pixel art", "monster pack", "creature evolution", "indie game",
    "commercial license", "Unity", "Unreal", "Godot", "3D model", "GLB",
  ],
  openGraph: {
    title: "AI MONSTER FACTORY | Creature Evolution Lab",
    description: "Creatures evolve from pixel art to anime, 3D, and game-ready assets. Not just assets — creatures worth bringing into your world.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI MONSTER FACTORY",
    description: "A story-driven creature evolution lab. PIXEL → ANIME → 3D → GAME.",
  },
};

export const viewport: Viewport = { themeColor: "#05070d" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${chakra.variable} antialiased`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
