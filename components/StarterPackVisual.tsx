import Image from "next/image";

export default function StarterPackVisual({ priority = false }: { priority?: boolean }) {
  return (
    <div className="starter-visual" aria-label="Creature Starter Pack preview">
      <div className="starter-visual__topline">
        <span>CREATURE STARTER PACK</span>
        <strong>$9.90</strong>
      </div>
      <div className="starter-visual__roster">
        <CreatureSlot src="/monsters/dragon_fire.png" name="FIRE DRAGON" priority={priority} />
        <CreatureSlot src="/monsters/slime_electric.png" name="ELECTRIC SLIME" priority={priority} />
        <div className="starter-visual__slot starter-visual__mystery">
          <span className="starter-visual__question">?</span>
          <span>CODEX MYSTERY</span>
        </div>
      </div>
      <div className="starter-visual__files">
        <span>PNG</span>
        <span>SPRITE SHEET</span>
        <span>JSON</span>
        <span>README JP / EN</span>
        <span>COMMERCIAL USE</span>
      </div>
    </div>
  );
}

function CreatureSlot({ src, name, priority }: { src: string; name: string; priority: boolean }) {
  return (
    <div className="starter-visual__slot">
      <div className="starter-visual__image">
        <Image src={src} alt={name} fill sizes="(max-width: 760px) 30vw, 190px" priority={priority} style={{ objectFit: "contain" }} />
      </div>
      <span>{name}</span>
    </div>
  );
}
