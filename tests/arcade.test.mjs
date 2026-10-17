import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { arcadeGames } from '../lib/arcade.ts';

test('six distinct bundled games have local playable entry points', () => {
  assert.equal(arcadeGames.length, 6);
  assert.equal(new Set(arcadeGames.map(g => g.id)).size, arcadeGames.length);
  for (const game of arcadeGames) {
    assert.match(game.src, /^\/arcade-games\/[a-z]+\/[a-z.]+$/);
    assert.ok(existsSync(`public${game.src}`), game.src);
    assert.match(readFileSync(`public${game.src}`, 'utf8'), /<canvas|<script/i);
    assert.equal(game.position.length, 3);
  }
  assert.ok(existsSync('public/arcade-games/space/lib/three.min.js'));
});

test('game runner stays lazy, unmounts on close and labels visits honestly', () => {
  const source = readFileSync('components/arcade/LivingArcade.tsx', 'utf8');
  assert.match(source, /session&&<GameSession/);
  assert.match(source, /onClose=\{\(\)=>setSession\(null\)\}/);
  assert.match(source, /クリア実績・購入履歴ではありません/);
  assert.match(source, /visits.length===arcadeGames.length/);
});
