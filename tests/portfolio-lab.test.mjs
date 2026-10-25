import test from 'node:test';
import assert from 'node:assert/strict';
import { rankFaults, energyProfile, optimiseEnergy, flexibleLoads, initialRelay, relayTransition, retrievePassages, sampleDocuments } from '../lib/portfolio-lab.ts';

test('triage exposes tied hypotheses and missing evidence without guessing',()=>{
  assert.deepEqual(rankFaults([]),[]);
  const ranked=rankFaults(['feed']);
  assert.equal(ranked.length,2);
  assert.equal(ranked[0].matched.length,1);
  assert.equal(ranked[0].missing.length,1);
  assert.deepEqual(rankFaults(['feed','feed']),ranked);
  assert.equal(rankFaults(['feed','noise'])[0].title,'Transport assembly');
});
test('energy optimiser respects all windows, hourly cap and energy conservation',()=>{
  const baseline=energyProfile(flexibleLoads.map(l=>l.original));
  const {best,candidates}=optimiseEnergy(50);
  assert.ok(best);
  assert.equal(candidates,1200);
  assert.ok(best.peak<=50);
  assert.equal(best.kwh,baseline.kwh);
  assert.ok(best.costCents<=baseline.costCents);
  best.starts.forEach((start,i)=>assert.ok(start>=flexibleLoads[i].earliest && start<=flexibleLoads[i].latest));
});
test('energy optimiser finds the global feasible cost minimum',()=>{
  const {best}=optimiseEnergy(50);
  for(let a=7;a<=16;a++) for(let b=8;b<=17;b++) for(let c=7;c<=18;c++) {
    const candidate=energyProfile([a,b,c]);
    if(candidate.peak<=50) assert.ok(best.costCents<=candidate.costCents);
  }
});
test('impossible demand cap stays infeasible and invalid values are rejected',()=>{
  assert.equal(optimiseEnergy(20).best,null);
  assert.throws(()=>optimiseEnergy(NaN));
  assert.throws(()=>energyProfile([0,8,8]));
});
test('workflow refuses unapproved delivery and deduplicates input and output',()=>{
  let state=relayTransition(initialRelay,'deliver');
  assert.equal(state.attempts,0);
  state=relayTransition(state,'receive');
  state=relayTransition(state,'receive');
  assert.equal(state.status,'needs-review');
  state=relayTransition(state,'deliver');
  assert.equal(state.attempts,0);
  for(const action of ['approve','deliver','restore','deliver']) state=relayTransition(state,action);
  assert.equal(state.status,'completed');
  assert.equal(state.attempts,2);
  const replayed=relayTransition(state,'deliver');
  assert.equal(replayed.attempts,2);
  assert.equal(replayed.delivered,true);
});
test('retry exhaustion survives endpoint restoration',()=>{
  let state=initialRelay;
  for(const action of ['receive','approve','deliver','deliver','deliver','restore','deliver']) state=relayTransition(state,action);
  assert.equal(state.status,'exhausted');
  assert.equal(state.attempts,3);
  assert.equal(state.delivered,false);
  assert.deepEqual(relayTransition(state,'reset'),initialRelay);
});
test('retrieval abstains on unsupported questions and cites unchanged excerpts',()=>{
  for(const query of ['', 'the and what', 'quantum banana', 'approval quantum banana']) assert.deepEqual(retrievePassages(query),[]);
  const matches=retrievePassages('approval');
  assert.ok(matches.length);
  matches.forEach(match=>assert.equal(match.text,sampleDocuments.find(doc=>doc.id===match.id).text));
});
