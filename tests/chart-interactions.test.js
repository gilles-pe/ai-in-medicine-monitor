import test from 'node:test';
import assert from 'node:assert/strict';
import {nearbyEvidenceIds} from '../lib/chart-interactions.js';
test('phone source targeting uses CSS distance, orders nearby choices and deduplicates groups',()=>{
  const points=[{x:10,y:10,ids:['a','b']},{x:20,y:10,ids:['b','c']},{x:80,y:10,ids:['d']}];
  assert.deepEqual(nearbyEvidenceIds(points,19,10),['b','c','a']);
  assert.deepEqual(nearbyEvidenceIds(points,102,10),['d']);
  assert.deepEqual(nearbyEvidenceIds(points,103,10),[]);
  assert.deepEqual(nearbyEvidenceIds(points,NaN,10),[]);
});
