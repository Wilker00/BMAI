import test from 'node:test';
import assert from 'node:assert/strict';
import { flStrumNotes, flChopNotes, flRandomizeNotes, flFlamNotes, renderFlScoreModal } from '../src/fl-score-tools.js';
import { createTimelineMarker, defaultTimelineMarkers, renderTimelineMarkers } from '../src/fl-timeline-markers.js';
import { renderFlExportModal } from '../src/fl-export-modal.js';
import { findPluginDef, renderFlPluginWindow } from '../src/fl-plugins.js';

test('FL Score Tools: Strummer spreads chord note start times with direction and tension', () => {
  const chordNotes = [
    { n: 'C4', x: 0, w: 4, v: 0.8 },
    { n: 'E4', x: 0, w: 4, v: 0.8 },
    { n: 'G4', x: 0, w: 4, v: 0.8 },
    { n: 'B4', x: 0, w: 4, v: 0.8 }
  ];

  const strummedUp = flStrumNotes(chordNotes, { startOffset: 0.15, stroke: 'up', preserveEnd: true });
  assert.equal(strummedUp.length, 4);
  assert.equal(strummedUp[0].n, 'C4');
  assert.equal(strummedUp[0].x, 0);
  assert.ok(strummedUp[1].x > strummedUp[0].x, 'Second note starts after first note');
  assert.ok(strummedUp[2].x > strummedUp[1].x, 'Third note starts after second note');
  assert.ok(strummedUp[3].x > strummedUp[2].x, 'Fourth note starts after third note');
  // preserveEnd check: higher notes have shorter duration so all end around bar 4
  assert.ok(strummedUp[3].w < chordNotes[3].w, 'Last strummed note duration shortened to preserve chord end');

  const strummedDown = flStrumNotes(chordNotes, { startOffset: 0.15, stroke: 'down' });
  assert.equal(strummedDown.length, 4);
  assert.ok(strummedDown.some(n => n.n === 'B4' && n.x === 0), 'Down strum hits top note first');
});

test('FL Score Tools: Chopper slices notes into trap rolls and arpeggios', () => {
  const notes = [
    { n: 'F4', x: 0, w: 4, v: 0.8 }
  ];

  // 1/16 slice = 1.0 step length -> 4 slices
  const chopped16 = flChopNotes(notes, { division: '1/16', pattern: 'straight', gate: 0.8 });
  assert.equal(chopped16.length, 4);
  assert.equal(chopped16[0].x, 0);
  assert.equal(chopped16[1].x, 1);
  assert.equal(chopped16[2].x, 2);
  assert.equal(chopped16[3].x, 3);
  assert.equal(chopped16[0].w, 0.8);

  // 1/32 slice = 0.5 step length -> 8 slices
  const chopped32 = flChopNotes(notes, { division: '1/32', pattern: 'straight', gate: 0.9 });
  assert.equal(chopped32.length, 8);

  // Arpeggio pattern changes pitch
  const arpNotes = flChopNotes(notes, { division: '1/16', pattern: 'arpeggio-up', gate: 0.85 });
  assert.equal(arpNotes.length, 4);
  assert.notEqual(arpNotes[0].n, arpNotes[1].n, 'Arpeggiator offsets pitch across slices');
});

test('FL Score Tools: Randomizer humanizes velocity, micro-timing and semitones', () => {
  const fixedNotes = [
    { n: 'A3', x: 0, w: 2, v: 0.7 },
    { n: 'C4', x: 2, w: 2, v: 0.7 },
    { n: 'E4', x: 4, w: 2, v: 0.7 }
  ];

  const randomized = flRandomizeNotes(fixedNotes, { velAmount: 0.2, timeNudge: 0.05, pitchAmount: 2 });
  assert.equal(randomized.length, 3);
  assert.ok(randomized.every(n => n.v >= 0.1 && n.v <= 1.0));
  assert.ok(randomized.every(n => typeof n.n === 'string' && n.n.length >= 2));
});

test('FL Score Tools: Flam Articulator adds grace notes', () => {
  const mainNotes = [
    { n: 'D4', x: 4, w: 2, v: 0.9 }
  ];

  const flammed = flFlamNotes(mainNotes, { count: 3, flamTime: 0.05, decay: 0.6 });
  assert.equal(flammed.length, 3); // 2 grace hits + 1 primary hit
  assert.ok(flammed[0].x < flammed[2].x, 'Grace hit starts prior to main hit');
  assert.ok(flammed[0].v < flammed[2].v, 'Grace hit velocity is decayed compared to main hit');
});

test('FL Score Tools UI: Renders interactive dialog without emojis', () => {
  const html = renderFlScoreModal('strum', { startOffset: 0.12 });
  assert.ok(html.includes('fl-score-dialog'));
  assert.ok(html.includes('FL Strummer'));
  assert.ok(html.includes('STROKE DIRECTION'));
  assert.ok(html.includes('ACCEPT'));
  assert.ok(html.includes('CANCEL'));
});

test('FL Timeline Markers: Create, sort and render timeline flags', () => {
  const markers = [
    createTimelineMarker({ name: 'Drop', bar: 9, color: '#f43f5e' }),
    createTimelineMarker({ name: 'Intro', bar: 1, color: '#38bdf8' }),
    createTimelineMarker({ name: 'Outro', bar: 17, color: '#a855f7' })
  ];

  const html = renderTimelineMarkers(markers, 32);
  assert.ok(html.includes('data-marker-bar="1"'));
  assert.ok(html.includes('data-marker-bar="9"'));
  assert.ok(html.includes('data-marker-bar="17"'));
  assert.ok(html.includes('Drop'));
  assert.ok(html.includes('Intro'));
  assert.ok(html.includes('Outro'));
  assert.ok(html.includes('left: 0.00%')); // Bar 1 is 0%
  assert.ok(html.includes('left: 25.00%')); // (9 - 1) / 32 = 8/32 = 25%
});

test('FL Commercial Export Modal: Generates options for song, pattern, WAV bit-depths and stems', () => {
  const dummyState = { name: 'Platinum Hit', bpm: 140, songLength: 32 };
  const html = renderFlExportModal(dummyState, { mode: 'song', format: 'wav-24', tail: 'leave' });
  assert.ok(html.includes('Render Project - Platinum Hit'));
  assert.ok(html.includes('WAV 24-BIT'));
  assert.ok(html.includes('WAV 32-BIT FLOAT'));
  assert.ok(html.includes('MP3 320 KBPS'));
  assert.ok(html.includes('LEAVE REMAINDER'));
  assert.ok(html.includes('Split mixer tracks'));
  assert.ok(html.includes('START EXPORT'));
});

test('FL Plugins: WaveShaper and Blood Overdrive definitions and UI renderers', () => {
  const ws = findPluginDef('waveshaper');
  assert.equal(ws.id, 'waveshaper');
  assert.equal(ws.name, 'Fruity WaveShaper');

  const bo = findPluginDef('blood-overdrive');
  assert.equal(bo.id, 'blood-overdrive');
  assert.equal(bo.name, 'Blood Overdrive');

  const wsHtml = renderFlPluginWindow('master', 'Master', 0, { pluginId: 'waveshaper', params: { tension: 0.6 } });
  assert.ok(wsHtml.includes('fl-plugin-waveshaper'));
  assert.ok(wsHtml.includes('SOFT SAT'));
  assert.ok(wsHtml.includes('HARD CLIP'));

  const boHtml = renderFlPluginWindow('master', 'Master', 1, { pluginId: 'blood-overdrive', params: { preAmp: 3.0 } });
  assert.ok(boHtml.includes('fl-plugin-blood'));
  assert.ok(boHtml.includes('VINTAGE TUBE PREAMP'));
  assert.ok(boHtml.includes('PREAMP (DRIVE)'));

  const peq2Html = renderFlPluginWindow('master', 'Master', 2, { pluginId: 'peq2', params: { b1: 2, b4: -3 } });
  assert.ok(peq2Html.includes('fl-peq-screen'));
  assert.ok(peq2Html.includes('fl-peq-node'));
  assert.ok(peq2Html.includes('fl-peq-bands-row'));
});
