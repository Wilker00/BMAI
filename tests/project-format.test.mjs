import test from 'node:test';
import assert from 'node:assert/strict';
import { validateProject } from '../src/project-format.js';

const project = () => ({name:'Test',pattern:[{n:'C4',x:0,w:2}],drums:{kick:[0,8]},bpm:92,key:'A minor',kit:'rnb'});
test('legacy projects and valid FX retain their contents without mutation',()=>{
  const value={...project(),fx:{filter:-67,reverb:.22,delay:.15},eq:{low:-6,mid:2,high:4}};
  const before=structuredClone(value);
  assert.equal(validateProject(value,{keys:['A minor'],kits:['rnb']}),value);
  assert.deepEqual(value,before);
});
test('malformed musical data is rejected before it reaches playback',()=>{
  for(const patch of [
    {bpm:-1}, {bpm:Infinity}, {pattern:[{n:'bad',x:0,w:1}]},
    {pattern:[{n:'C4',x:15,w:2}]}, {drums:{kick:[16]}}, {idea:4},
    {sections:[{name:'Bad',bars:1000,active:{}}]}, {mix:{keys:{vol:'loud'}}},
    {chords:{bars:[]}}, {schemaVersion:999}, {customSampleAssets:[]},
    {drumRolls:{kick:{0:500}}}, {fx:{filter:101}},
  ]) assert.throws(()=>validateProject({...project(),...patch}),/Invalid project/);
});
test('unknown project formats and keys fail with useful errors',()=>{
  for(const value of [null,[],{}, {pattern:[]}]) assert.throws(()=>validateProject(value),/structure/);
  assert.throws(()=>validateProject(project(),{keys:['C major']}),/key/);
});
