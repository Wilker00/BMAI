import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const topPanelSource = fs.readFileSync(new URL('../src/fl-top-panel.js', import.meta.url), 'utf8');
const mainSource = fs.readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const channelRackSource = fs.readFileSync(new URL('../src/fl-channel-rack.js', import.meta.url), 'utf8');
const mixerSource = fs.readFileSync(new URL('../src/fl-mixer.js', import.meta.url), 'utf8');
const pluginsSource = fs.readFileSync(new URL('../src/fl-plugins.js', import.meta.url), 'utf8');
const edisonSource = fs.readFileSync(new URL('../src/fl-edison.js', import.meta.url), 'utf8');
const browserSource = fs.readFileSync(new URL('../src/fl-browser.js', import.meta.url), 'utf8');
const pickerSource = fs.readFileSync(new URL('../src/fl-picker-panel.js', import.meta.url), 'utf8');
const markersSource = fs.readFileSync(new URL('../src/fl-timeline-markers.js', import.meta.url), 'utf8');
const flInteractionSource = mainSource.slice(mainSource.indexOf('function bindFlStudioInteractions()'));
const flClickDelegateSource = flInteractionSource.slice(
  flInteractionSource.indexOf("document.addEventListener('click'"),
  flInteractionSource.indexOf("document.addEventListener('change'")
);

test('every declared top-menu command has an application handler', () => {
  const declared = [...topPanelSource.matchAll(/action:\s*'([^']+)'/g)].map(match => match[1]);
  const handled = new Set(
    [...mainSource.matchAll(/(?:act|dataset\.flAction)\s*===\s*'([^']+)'/g)].map(match => match[1])
  );
  assert.deepEqual(declared.filter(action => !handled.has(action)), []);
});

test('brand home control is semantic and wired', () => {
  assert.match(topPanelSource, /<button[^>]+data-action="go-home"/);
  assert.match(mainSource, /dataset\.action === 'go-home'/);
});

test('workflow exposes the five production stages', () => {
  for (const label of ['Project', 'Create', 'Arrange', 'Mix', 'Export']) {
    assert.match(mainSource, new RegExp(`label:'${label}'`));
  }
});

test('channel rack controls have application handlers', () => {
  const controls = [
    'fl-rack-new-pat', 'fl-rack-toggle-graph', 'fl-rack-pattern-select',
    'fl-rack-steps-select', 'fl-rack-swing', 'flAudition', 'flMute',
    'flChannelMenu', 'flCloseSettings', 'flPan', 'flVol', 'graphMode'
  ];
  for (const control of controls) {
    assert.match(channelRackSource, new RegExp(control.replace(/[A-Z]/g, letter => `[-${letter.toLowerCase()}]`).replace(/\[|\]/g, '')));
    assert.match(mainSource, new RegExp(control));
  }
});

test('mixer controls have application handlers and semantic selectors', () => {
  for (const control of ['flSelectTrack', 'flFxToggle', 'flFxWet', 'fxMoveUp', 'fxMoveDown', 'flOpenPeq2']) {
    assert.match(mainSource, new RegExp(control));
  }
  assert.match(mainSource, /function trackFxSlots\(trackId\)/);
  assert.match(mixerSource, /<button[^>]+data-fl-select-track/);
  assert.match(mixerSource, /<button[^>]+data-fl-open-peq2/);
});

test('plugin windows persist every editable control', () => {
  const editableIds = [...pluginsSource.matchAll(/<(?:input|select)[^>]+id="(fl-[^"]+)"[^>]*>/g)]
    .filter(([, id]) => !id.includes('-out'));
  for (const [markup, id] of editableIds) {
    assert.match(markup, /data-(?:plugin-param|peq-band|ws-param)/, `${id} is missing parameter wiring`);
  }
  assert.match(mainSource, /target\.dataset\.pluginParam && activePluginModal/);
  assert.match(flClickDelegateSource, /btn\.dataset\.sgMode && activePluginModal/);
  assert.match(flClickDelegateSource, /btn\.id === 'fl-delay-pp'/);
  assert.match(flClickDelegateSource, /btn\.id === 'fl-plugin-close'/);
});

test('Edison transport exposes working play and stop handlers', () => {
  assert.match(edisonSource, /id="fl-edison-play"/);
  assert.match(edisonSource, /id="fl-edison-stop"/);
  assert.match(flClickDelegateSource, /btn\.id === 'fl-edison-play'/);
  assert.match(flClickDelegateSource, /btn\.id === 'fl-edison-stop'/);
});

test('clickable browser, picker, mixer, and marker controls are semantic buttons', () => {
  assert.match(browserSource, /<button[^>]+fl-browser-item/);
  assert.match(browserSource, /<button[^>]+fl-browser-cat-header/);
  assert.match(pickerSource, /<button[^>]+data-picker-pattern-id/);
  assert.match(pickerSource, /<button[^>]+data-picker-audio-id/);
  assert.match(mixerSource, /<button[^>]+data-fl-open-slot/);
  assert.match(markersSource, /<button[^>]+data-marker-bar/);
});
