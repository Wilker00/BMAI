// FL Studio Mixer Console & 10 FX Insert Slots
// Master + Insert strips 1-10 with stereo dB meters, faders, stereo separation,
// phase invert (Ø), routing toggles, and right-side 10 FX insert rack with mini PEQ2 graph.

import { findPluginDef } from './fl-plugins.js';

export function renderFlMixer(state, focusTrackId = 'master') {
  const tracks = state.tracks || [];
  const masterTrack = { id: 'master', name: 'Master', color: '#ff851b' };
  const allStrips = [masterTrack, ...tracks];
  const activeTrack = allStrips.find(t => t.id === focusTrackId) || masterTrack;

  return `<div class="fl-mixer-console" id="fl-mixer-console" role="region" aria-label="FL Studio Mixer">
    <!-- Left Mixer Section: Channel Strips -->
    <div class="fl-mixer-strips-viewport">
      <div class="fl-mixer-strips-container">
        <!-- Master Track (Track 0) -->
        ${renderChannelStrip(state, masterTrack, 0, focusTrackId === 'master', focusTrackId)}

        <!-- Insert Tracks (1 to N) -->
        ${tracks.map((track, i) => renderChannelStrip(state, track, i + 1, focusTrackId === track.id, focusTrackId)).join('')}
      </div>
    </div>

    <!-- Right Mixer Section: 10 FX Insert Slots & Mini EQ Graph -->
    <div class="fl-mixer-inspector">
      <div class="fl-inspector-head">
        <div class="fl-track-badge" style="--track-accent: ${activeTrack.color || '#ff851b'};">
          <span class="fl-track-num">${focusTrackId === 'master' ? 'M' : allStrips.indexOf(activeTrack)}</span>
          <strong class="fl-track-title">${activeTrack.name.toUpperCase()}</strong>
        </div>
        <span class="fl-inspector-sub">10 FX INSERT SLOTS</span>
      </div>

      <!-- Mini Parametric EQ 2 Preview Graph -->
      <div class="fl-mini-peq-box" data-fl-hint="Fruity Parametric EQ 2 frequency curve">
        <svg class="fl-mini-peq-svg" viewBox="0 0 200 60" preserveAspectRatio="none">
          <line x1="0" y1="30" x2="200" y2="30" stroke="#252d35" stroke-width="1" />
          <path d="M 0 30 Q 50 15 100 30 T 200 20" fill="none" stroke="#ff851b" stroke-width="2" />
        </svg>
        <span class="fl-mini-peq-label">EQ 2 MONITOR</span>
      </div>

      <!-- 10 Dedicated FX Slots -->
      <div class="fl-fx-slots-rack">
        ${Array.from({ length: 10 }, (_, slotIndex) => {
          const activeFx = activeTrack.fx?.[slotIndex];
          const isOccupied = !!activeFx;
          const def = isOccupied ? findPluginDef(activeFx.pluginId || activeFx.type) : null;
          const isBypassed = !!activeFx?.bypass;

          return `<div class="fl-fx-slot-row ${isOccupied ? 'occupied' : 'empty'}" data-slot-index="${slotIndex}" data-track-id="${activeTrack.id}">
            <!-- Slot Enable / Bypass Switch -->
            <button type="button" class="fl-slot-led ${isOccupied && !isBypassed ? 'active' : ''}" data-fl-fx-toggle="${slotIndex}" data-track-id="${activeTrack.id}" data-fl-hint="${isOccupied ? (isBypassed ? 'Enable slot' : 'Bypass slot') : 'Empty FX slot'}"></button>

            <!-- Slot Plugin Name / Selector -->
            <div class="fl-slot-name-btn" data-fl-open-slot="${slotIndex}" data-track-id="${activeTrack.id}" data-fl-hint="${isOccupied ? 'Click to open ' + def.name + ' interface' : 'Select effect to load'}">
              <span class="fl-slot-index">${slotIndex + 1}</span>
              <strong class="fl-slot-text">${isOccupied ? def.name : '(none)'}</strong>
            </div>

            <!-- Wet / Dry Mix Knob -->
            <div class="fl-slot-mix-knob-wrap" data-fl-hint="Effect Mix: ${Math.round((activeFx?.wet ?? 1.0) * 100)}%">
              <input type="range" min="0" max="100" value="${Math.round((activeFx?.wet ?? 1.0) * 100)}" class="fl-slot-mix-knob" data-fl-fx-wet="${slotIndex}" data-track-id="${activeTrack.id}" ${!isOccupied ? 'disabled' : ''}>
            </div>

            <!-- Dropdown selector -->
            <select class="fl-slot-dropdown" data-fx-select="${activeTrack.id}" data-fx-slot="${slotIndex}">
              <option value="">(none)</option>
              <option value="grossbeat" ${def?.id === 'grossbeat' ? 'selected' : ''}>Gross Beat</option>
              <option value="soundgoodizer" ${def?.id === 'soundgoodizer' ? 'selected' : ''}>Soundgoodizer</option>
              <option value="maximus" ${def?.id === 'maximus' ? 'selected' : ''}>Maximus</option>
              <option value="peq2" ${def?.id === 'peq2' ? 'selected' : ''}>Fruity Parametric EQ 2</option>
              <option value="limiter" ${def?.id === 'limiter' ? 'selected' : ''}>Fruity Limiter</option>
              <option value="reverb2" ${def?.id === 'reverb2' ? 'selected' : ''}>Fruity Reverb 2</option>
              <option value="delay3" ${def?.id === 'delay3' ? 'selected' : ''}>Fruity Delay 3</option>
              <option value="fastdist" ${def?.id === 'fastdist' ? 'selected' : ''}>Fruity Fast Dist</option>
              <option value="chorus" ${def?.id === 'chorus' ? 'selected' : ''}>Fruity Chorus</option>
            </select>
          </div>`;
        }).join('')}
      </div>
    </div>
  </div>`;
}

function renderChannelStrip(state, track, index, isSelected, selectedTrackId = 'master') {
  const mix = state.mix?.[track.id] || { vol: 0.8, pan: 0, mute: false, solo: false, stereoSep: 0, phaseInvert: false };
  const volPct = Math.round((mix.vol ?? 0.8) * 100);
  const pan = Math.round((mix.pan ?? 0) * 100);
  const isMuted = !!mix.mute;
  const isSolo = !!mix.solo;
  const stereoSep = mix.stereoSep ?? 0; // -100 (merged mono) to +100 (expanded)
  const phaseInvert = !!mix.phaseInvert;
  const isRouted = track.id === 'master' ? true : !!(state.trackSends?.[selectedTrackId]?.[track.id] || (mix.send && mix.sendTarget === track.id));
  const sendVal = Math.round((state.trackSends?.[selectedTrackId]?.[track.id] ?? (mix.send ?? 0.8)) * 100);

  return `<div class="fl-mixer-strip ${isSelected ? 'selected' : ''} ${track.id === 'master' ? 'master-strip' : ''}" data-track-id="${track.id}">
    <!-- Track Title & Index -->
    <div class="fl-strip-head" data-fl-select-track="${track.id}" data-fl-hint="Select track ${track.name}">
      <span class="fl-strip-num">${index === 0 ? 'M' : index}</span>
      <span class="fl-strip-name">${track.name.toUpperCase()}</span>
    </div>

    <!-- Stereo Separation Knob -->
    <div class="fl-strip-rotary-group" data-fl-hint="Stereo Separation: ${stereoSep === 0 ? 'Normal' : stereoSep < 0 ? Math.abs(stereoSep) + '% Merged (Mono)' : stereoSep + '% Expanded (Wide)'}">
      <label>SEP</label>
      <input type="range" min="-100" max="100" value="${stereoSep}" class="fl-mini-knob sep" data-fl-stereo-sep="${track.id}">
    </div>

    <!-- Polarity Invert (Ø) & Pan Pot -->
    <div class="fl-strip-pan-row">
      <button type="button" class="fl-phase-btn ${phaseInvert ? 'active' : ''}" data-fl-phase="${track.id}" data-fl-hint="Phase / Polarity Invert (Ø)">Ø</button>
      <input type="range" min="-100" max="100" value="${pan}" class="fl-mini-knob pan" data-fl-strip-pan="${track.id}" data-fl-hint="Pan: ${pan === 0 ? 'C' : pan > 0 ? pan + 'R' : Math.abs(pan) + 'L'}">
    </div>

    <!-- Peak dB Meter & Fader Section -->
    <div class="fl-strip-fader-well">
      <!-- Stereo Peak Meter Bar -->
      <div class="fl-db-meter-track" data-fl-hint="Peak dB Meter">
        <div class="fl-db-meter-fill left" style="height: ${Math.min(100, volPct * 0.9)}%"></div>
        <div class="fl-db-meter-fill right" style="height: ${Math.min(100, volPct * 0.88)}%"></div>
      </div>

      <!-- Fader Track & Cap -->
      <div class="fl-fader-track">
        <input type="range" min="0" max="125" value="${volPct}" orient="vertical" class="fl-vertical-fader" data-fl-strip-vol="${track.id}" data-fl-hint="${track.name} Volume: ${volPct}%">
      </div>
    </div>

    <!-- Fader Readout dB -->
    <span class="fl-strip-db-readout">${volPct === 0 ? '-inf' : (volPct > 100 ? '+' : '') + Math.round((volPct - 100) * 0.12) + ' dB'}</span>

    <!-- Mute & Solo LEDs -->
    <div class="fl-strip-leds">
      <button type="button" class="fl-strip-mute-btn ${isMuted ? 'muted' : 'active'}" data-fl-strip-mute="${track.id}" data-fl-hint="Mute switch"></button>
      <button type="button" class="fl-strip-solo-btn ${isSolo ? 'active' : ''}" data-fl-strip-solo="${track.id}" data-fl-hint="Solo switch">S</button>
    </div>

    <!-- Send Cable Routing Indicator at foot -->
    <div class="fl-routing-cable-anchor ${isRouted ? 'is-routed' : ''}" data-fl-route-target="${track.id}" data-fl-hint="${track.id === selectedTrackId ? 'Selected track output' : (isRouted ? 'Routed: ' + selectedTrackId + ' -> ' + track.name : 'Click to route ' + selectedTrackId + ' to ' + track.name)}">
      ${track.id === selectedTrackId ? `
        <div class="fl-cable-source active" title="Audio Output Source">
          <span class="fl-cable-dot"></span>
        </div>
      ` : `
        <button type="button" class="fl-cable-toggle ${isRouted ? 'active' : ''}" data-fl-route-toggle="${track.id}" title="${isRouted ? 'Disconnect route' : 'Route to this track'}">
          <span class="fl-cable-plug">▲</span>
        </button>
        ${isRouted ? `
          <input type="range" min="0" max="100" value="${sendVal}" class="fl-mini-knob fl-send-level" data-fl-send-level="${track.id}" data-fl-hint="Send level: ${sendVal}%" />
        ` : ''}
      `}
    </div>
  </div>`;
}
