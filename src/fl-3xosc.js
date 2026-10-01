// FL Studio 3xOSC Subtractive Synthesizer Module
// Faithful recreation of Image-Line's legendary 3xOSC.
// Features 3 customizable oscillators (shape, coarse pitch, fine detune, mix level, phase invert),
// resonant filter (LP/HP/BP, cutoff, resonance), and Web Audio synthesis node graph.

export const DEFAULT_3XOSC_PATCH = {
  osc1: { shape: 'sawtooth', coarse: 0, fine: 0, level: 1.0, invert: false },
  osc2: { shape: 'sawtooth', coarse: 0, fine: 12, level: 0.75, invert: false },
  osc3: { shape: 'sine', coarse: -12, fine: -5, level: 0.5, invert: false },
  filter: { type: 'lowpass', cutoff: 3200, resonance: 1.8 },
  envelope: { attack: 0.01, decay: 0.35, sustain: 0.6, release: 0.25 }
};

export function render3xOscUi(patch = DEFAULT_3XOSC_PATCH) {
  const p = { ...DEFAULT_3XOSC_PATCH, ...(patch || {}) };

  const oscRows = [1, 2, 3].map(num => {
    const osc = p[`osc${num}`] || DEFAULT_3XOSC_PATCH[`osc${num}`];
    return `<div class="fl-3x-osc-row">
      <div class="fl-3x-osc-title">
        <span class="fl-osc-badge">OSC ${num}</span>
      </div>

      <!-- Waveform Shape Buttons -->
      <div class="fl-3x-shapes" data-osc-num="${num}">
        ${['sine', 'sawtooth', 'triangle', 'square', 'noise'].map(shape => `
          <button type="button" class="fl-shape-btn ${osc.shape === shape ? 'active' : ''}" data-3x-shape="${shape}" data-3x-osc="${num}" title="${shape.toUpperCase()}">
            ${shape === 'sine' ? 'SIN' : shape === 'sawtooth' ? 'SAW' : shape === 'triangle' ? 'TRI' : shape === 'square' ? 'SQR' : 'NOI'}
          </button>
        `).join('')}
      </div>

      <!-- Coarse Tune Knob (-24 to +24 semitones) -->
      <div class="fl-3x-param">
        <label>COARSE</label>
        <input type="range" min="-24" max="24" step="1" value="${osc.coarse || 0}" class="fl-mini-knob" data-3x-param="coarse" data-3x-osc="${num}" />
        <span class="fl-3x-val">${osc.coarse >= 0 ? '+' : ''}${osc.coarse || 0} st</span>
      </div>

      <!-- Fine Tune Knob (-100 to +100 cents) -->
      <div class="fl-3x-param">
        <label>FINE</label>
        <input type="range" min="-100" max="100" step="1" value="${osc.fine || 0}" class="fl-mini-knob" data-3x-param="fine" data-3x-osc="${num}" />
        <span class="fl-3x-val">${osc.fine >= 0 ? '+' : ''}${osc.fine || 0} ct</span>
      </div>

      <!-- Volume Mix Level (0 to 100%) -->
      <div class="fl-3x-param">
        <label>VOL</label>
        <input type="range" min="0" max="100" step="1" value="${Math.round((osc.level ?? 1.0) * 100)}" class="fl-mini-knob" data-3x-param="level" data-3x-osc="${num}" />
        <span class="fl-3x-val">${Math.round((osc.level ?? 1.0) * 100)}%</span>
      </div>

      <!-- Phase Invert (Ø) -->
      <div class="fl-3x-param">
        <button type="button" class="fl-phase-btn ${osc.invert ? 'active' : ''}" data-3x-param="invert" data-3x-osc="${num}" title="Invert Phase (Ø)">Ø</button>
      </div>
    </div>`;
  }).join('');

  return `<div class="fl-3xosc-window" id="fl-3xosc-window" role="dialog" aria-label="3xOSC Synthesizer">
    <!-- Window Header -->
    <div class="fl-plugin-titlebar">
      <div class="fl-plugin-title-left">
        <span class="fl-plugin-ico">SYNTH</span>
        <strong>3xOSC</strong>
        <span class="fl-plugin-track-tag">Subtractive Synthesizer</span>
      </div>
      <div class="fl-plugin-title-right">
        <button type="button" class="fl-plugin-close" data-fl-pw-close aria-label="Close 3xOSC">✕</button>
      </div>
    </div>

    <!-- 3 Oscillators Panel -->
    <div class="fl-3x-body">
      <div class="fl-3x-oscillators">
        ${oscRows}
      </div>

      <!-- Resonant Master Filter Strip -->
      <div class="fl-3x-filter-strip">
        <div class="fl-3x-filter-header">
          <span class="fl-osc-badge">FILTER</span>
        </div>
        <div class="fl-3x-filter-controls">
          <div class="fl-3x-param">
            <label>TYPE</label>
            <select class="fl-pr-select" data-3x-filter-param="type">
              <option value="lowpass" ${p.filter.type === 'lowpass' ? 'selected' : ''}>Lowpass (LP)</option>
              <option value="highpass" ${p.filter.type === 'highpass' ? 'selected' : ''}>Highpass (HP)</option>
              <option value="bandpass" ${p.filter.type === 'bandpass' ? 'selected' : ''}>Bandpass (BP)</option>
            </select>
          </div>
          <div class="fl-3x-param">
            <label>CUTOFF</label>
            <input type="range" min="40" max="18000" step="10" value="${p.filter.cutoff || 3200}" class="fl-mini-knob" data-3x-filter-param="cutoff" />
            <span class="fl-3x-val">${p.filter.cutoff || 3200} Hz</span>
          </div>
          <div class="fl-3x-param">
            <label>RES (Q)</label>
            <input type="range" min="0.1" max="15" step="0.1" value="${p.filter.resonance || 1.8}" class="fl-mini-knob" data-3x-filter-param="resonance" />
            <span class="fl-3x-val">${(p.filter.resonance || 1.8).toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

export function synthesize3xOscNote(audioContext, freq, duration, patch = DEFAULT_3XOSC_PATCH, when = null, destination = null) {
  if (!audioContext || !freq || isNaN(freq)) return;
  const now = when ?? audioContext.currentTime;
  const p = { ...DEFAULT_3XOSC_PATCH, ...(patch || {}) };

  const masterGain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  filter.type = p.filter?.type || 'lowpass';
  filter.frequency.setValueAtTime(p.filter?.cutoff || 3200, now);
  filter.Q.value = p.filter?.resonance || 1.8;

  filter.connect(masterGain);
  masterGain.connect(destination || audioContext.destination);

  // ADSR Gain Envelope
  const env = p.envelope || DEFAULT_3XOSC_PATCH.envelope;
  const attack = Math.max(0.002, env.attack || 0.01);
  const decay = Math.max(0.01, env.decay || 0.3);
  const sustain = Math.max(0.01, Math.min(1.0, env.sustain || 0.6));
  const release = Math.max(0.02, env.release || 0.25);

  masterGain.gain.setValueAtTime(0.0001, now);
  masterGain.gain.linearRampToValueAtTime(0.22, now + attack);
  masterGain.gain.exponentialRampToValueAtTime(Math.max(0.001, 0.22 * sustain), now + attack + decay);
  masterGain.gain.setValueAtTime(Math.max(0.001, 0.22 * sustain), now + duration);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration + release);

  // Start 3 oscillators
  [1, 2, 3].forEach(num => {
    const oscData = p[`osc${num}`] || DEFAULT_3XOSC_PATCH[`osc${num}`];
    const coarse = Number(oscData.coarse) || 0;
    const fine = Number(oscData.fine) || 0;
    const level = (Number(oscData.level) ?? 1.0) * (oscData.invert ? -1 : 1);
    if (Math.abs(level) < 0.01) return;

    const oscFreq = freq * Math.pow(2, (coarse + fine / 100) / 12);

    if (oscData.shape === 'noise') {
      const bufferSize = Math.floor(audioContext.sampleRate * (duration + release));
      const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noiseSource = audioContext.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      const noiseGain = audioContext.createGain();
      noiseGain.gain.value = Math.abs(level) * 0.15;
      noiseSource.connect(noiseGain).connect(filter);
      noiseSource.start(now);
      noiseSource.stop(now + duration + release + 0.05);
    } else {
      const osc = audioContext.createOscillator();
      osc.type = oscData.shape || 'sawtooth';
      osc.frequency.setValueAtTime(oscFreq, now);

      const oscGain = audioContext.createGain();
      oscGain.gain.value = Math.abs(level) * 0.33;
      osc.connect(oscGain).connect(filter);
      osc.start(now);
      osc.stop(now + duration + release + 0.05);
    }
  });
}
