// Pure simulation: no browser, network, account or commerce dependencies.
export const CRYSTALS: [number, number][] = [[-3,-3],[0,-3],[3,-3],[-3,3],[0,3],[3,3]];
export const ROUND_SECONDS = 45;
export type Round = { x: number; z: number; elapsed: number; hp: number; shield: number; collected: boolean[]; status: "running" | "won" | "lost" };
export const newRound = (): Round => ({ x: 0, z: 0, elapsed: 0, hp: 3, shield: 0, collected: CRYSTALS.map(() => false), status: "running" });
export function hazardsAt(time: number): [number, number][] {
  return [0, Math.PI].map(angle => [Math.cos(time * .8 + angle) * 2.2, Math.sin(time * .8 + angle) * 2.2]);
}
export function stepRound(previous: Round, dx: number, dz: number, delta: number): Round {
  if (previous.status !== "running") return previous;
  const dt = Math.max(0, Math.min(delta, .05));
  const magnitude = Math.max(1, Math.hypot(dx, dz));
  const next: Round = { ...previous, collected: [...previous.collected], elapsed: previous.elapsed + dt, shield: Math.max(0, previous.shield - dt), x: Math.max(-3.7, Math.min(3.7, previous.x + dx / magnitude * 3.4 * dt)), z: Math.max(-3.7, Math.min(3.7, previous.z + dz / magnitude * 3.4 * dt)) };
  CRYSTALS.forEach(([x,z],i) => { if (Math.hypot(next.x - x, next.z - z) < .62) next.collected[i] = true; });
  if (next.shield === 0 && hazardsAt(next.elapsed).some(([x,z]) => Math.hypot(next.x-x,next.z-z) < .68)) {
    next.hp -= 1; next.shield = 1.5; next.x = 0; next.z = 0;
  }
  if (next.hp <= 0 || next.elapsed >= ROUND_SECONDS) next.status = "lost";
  else if (next.collected.every(Boolean)) next.status = "won";
  return next;
}
