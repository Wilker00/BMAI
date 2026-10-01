// FL Studio Sampler ADSR Envelope Generator & Visualizer
// Enables Attack, Hold, Decay, Sustain, Release curves for 808s and one-shots.
// Features interactive SVG envelope curve and Web Audio envelope scheduling.

export const DEFAULT_ADSR = {
  attack: 0.005, // seconds
  hold: 0.05,    // seconds
  decay: 0.25,   // seconds
  sustain: 0.7,  // 0.0 - 1.0 level
  release: 0.15  // seconds
};

export function renderAdsrSvg(adsr = DEFAULT_ADSR, width = 240, height = 50) {
  const env = { ...DEFAULT_ADSR, ...(adsr || {}) };
  const totalTime = Math.max(0.6, env.attack + env.hold + env.decay + 0.2 + env.release);

  const t0 = 0;
  const t1 = env.attack;
  const t2 = t1 + env.hold;
  const t3 = t2 + env.decay;
  const t4 = t3 + 0.15; // sustain hold representation
  const t5 = t4 + env.release;

  const px = t => Math.round((t / totalTime) * (width - 16) + 8);
  const py = val => Math.round((1 - val) * (height - 14) + 7);

  const p0 = `${px(t0)},${py(0)}`;
  const p1 = `${px(t1)},${py(1)}`;
  const p2 = `${px(t2)},${py(1)}`;
  const p3 = `${px(t3)},${py(env.sustain)}`;
  const p4 = `${px(t4)},${py(env.sustain)}`;
  const p5 = `${px(t5)},${py(0)}`;

  const lineD = `M ${p0} L ${p1} L ${p2} L ${p3} L ${p4} L ${p5}`;
  const fillD = `${lineD} L ${px(t5)} ${height - 2} L ${px(t0)} ${height - 2} Z`;

  return `<div class="fl-adsr-graph" aria-label="ADSR Envelope Preview">
    <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
      <defs>
        <linearGradient id="flAdsrGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.02" />
        </linearGradient>
      </defs>
      <path d="${fillD}" fill="url(#flAdsrGrad)" />
      <path d="${lineD}" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-linejoin="round" />
      <circle cx="${px(t1)}" cy="${py(1)}" r="3" fill="#fff" />
      <circle cx="${px(t2)}" cy="${py(1)}" r="3" fill="#fff" />
      <circle cx="${px(t3)}" cy="${py(env.sustain)}" r="3" fill="#fff" />
      <circle cx="${px(t5)}" cy="${py(0)}" r="3" fill="#fff" />
    </svg>
  </div>`;
}

export function renderAdsrControls(lane, adsr = DEFAULT_ADSR) {
  const env = { ...DEFAULT_ADSR, ...(adsr || {}) };
  return `<div class="fl-adsr-panel" data-adsr-lane="${lane}">
    ${renderAdsrSvg(env, 240, 50)}
    <div class="fl-adsr-knobs-row">
      <div class="fl-adsr-knob">
        <label>ATT</label>
        <input type="range" min="0" max="1000" step="5" value="${Math.round(env.attack * 1000)}" class="fl-mini-knob" data-adsr-param="attack" data-adsr-lane="${lane}" />
        <span>${Math.round(env.attack * 1000)}ms</span>
      </div>
      <div class="fl-adsr-knob">
        <label>HOLD</label>
        <input type="range" min="0" max="1000" step="5" value="${Math.round(env.hold * 1000)}" class="fl-mini-knob" data-adsr-param="hold" data-adsr-lane="${lane}" />
        <span>${Math.round(env.hold * 1000)}ms</span>
      </div>
      <div class="fl-adsr-knob">
        <label>DEC</label>
        <input type="range" min="10" max="2500" step="10" value="${Math.round(env.decay * 1000)}" class="fl-mini-knob" data-adsr-param="decay" data-adsr-lane="${lane}" />
        <span>${Math.round(env.decay * 1000)}ms</span>
      </div>
      <div class="fl-adsr-knob">
        <label>SUS</label>
        <input type="range" min="0" max="100" step="1" value="${Math.round(env.sustain * 100)}" class="fl-mini-knob" data-adsr-param="sustain" data-adsr-lane="${lane}" />
        <span>${Math.round(env.sustain * 100)}%</span>
      </div>
      <div class="fl-adsr-knob">
        <label>REL</label>
        <input type="range" min="10" max="3000" step="10" value="${Math.round(env.release * 1000)}" class="fl-mini-knob" data-adsr-param="release" data-adsr-lane="${lane}" />
        <span>${Math.round(env.release * 1000)}ms</span>
      </div>
    </div>
  </div>`;
}

export function applyAdsrToGainParam(gainParam, adsr = DEFAULT_ADSR, startTime, duration = 0.5, peakVolume = 1.0) {
  if (!gainParam) return;
  const env = { ...DEFAULT_ADSR, ...(adsr || {}) };
  const att = Math.max(0.001, env.attack);
  const hold = Math.max(0.001, env.hold);
  const dec = Math.max(0.005, env.decay);
  const sus = Math.max(0.001, Math.min(1.0, env.sustain));
  const rel = Math.max(0.005, env.release);

  const t0 = startTime;
  const tAtt = t0 + att;
  const tHold = tAtt + hold;
  const tDec = tHold + dec;

  gainParam.setValueAtTime(0.0001, t0);
  gainParam.linearRampToValueAtTime(peakVolume, tAtt);
  gainParam.setValueAtTime(peakVolume, tHold);
  gainParam.exponentialRampToValueAtTime(Math.max(0.0001, peakVolume * sus), tDec);

  const tEnd = Math.max(tDec, t0 + duration);
  gainParam.setValueAtTime(Math.max(0.0001, peakVolume * sus), tEnd);
  gainParam.exponentialRampToValueAtTime(0.0001, tEnd + rel);
}
