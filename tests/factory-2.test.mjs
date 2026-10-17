import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { newRound, stepRound, CRYSTALS, hazardsAt } from '../lib/resonance.ts';

test('existing tracked files are unchanged except the new entry point', () => {
  const base = '152aa2b3567601e2ab0029b60d8ebf9b71c86a8b';
  const baseline = process.env.FACTORY_BASE || base;
  const files = execFileSync('git',['ls-tree','-r','--name-only',baseline],{encoding:'utf8'}).trim().split('\n');
  for (const file of files) {
    if(file === 'app/page.tsx') continue;
    assert.deepEqual(readFileSync(file), execFileSync('git',['show',`${baseline}:${file}`],{maxBuffer:100*1024*1024}), file);
  }
  assert.deepEqual(readFileSync('app/classic/page.tsx'),execFileSync('git',['show',`${baseline}:app/page.tsx`]));
});
test('new round, bounded movement and diagonal normalization', () => {
  const initial = newRound();
  assert.equal(initial.hp,3);
  const straight = stepRound(initial,1,0,.05);
  const diagonal = stepRound(initial,1,1,.05);
  assert.ok(Math.abs(Math.hypot(diagonal.x,diagonal.z)-straight.x)<1e-8);
  assert.equal(initial.x,0,'simulation does not mutate the previous state');
  let state = initial;
  for(let i=0;i<100;i++) state=stepRound(state,1,0,.05);
  assert.ok(state.x<=3.7);
});
test('collecting all six crystals wins and terminal state is frozen', () => {
  let state = newRound();
  for(const [x,z] of CRYSTALS) state=stepRound({...state,x,z},0,0,0);
  assert.equal(state.collected.filter(Boolean).length,6);
  assert.equal(state.status,'won');
  assert.equal(stepRound(state,1,1,.05),state);
});
test('hazard collision, invulnerability, time-out and death', () => {
  const [x,z]=hazardsAt(0)[0];
  const hit=stepRound({...newRound(),x,z},0,0,0);
  assert.equal(hit.hp,2); assert.equal(hit.x,0); assert.equal(hit.z,0);
  assert.equal(stepRound({...hit,x,z},0,0,0).hp,2);
  assert.equal(stepRound({...newRound(),x,z,hp:1},0,0,0).status,'lost');
  assert.equal(stepRound({...newRound(),elapsed:44.99},0,0,.05).status,'lost');
  assert.equal(stepRound(newRound(),0,0,100).elapsed,.05,'background gaps are clamped');
});
