// FL Studio Signature Native Plugins
// Includes Gross Beat, Soundgoodizer, Maximus, Fruity Parametric EQ 2,
// Fruity Limiter, Fruity Reverb 2, Fruity Delay 3, Fruity Fast Dist, Fruity Chorus.

export const FL_PLUGINS = [
  {
    id: 'grossbeat',
    name: 'Gross Beat',
    category: 'Time & Volume Effect',
    wiredType: 'filter',
    defaultParams: {
      timeSlot: 'half-speed',
      volumeSlot: 'sidechain-pump',
      timeMix: 1.0,
      volMix: 1.0,
      hold: 4
    }
  },
  {
    id: 'soundgoodizer',
    name: 'Soundgoodizer',
    category: 'Maximus Maximizer',
    wiredType: 'saturator',
    defaultParams: {
      mode: 'A', // A, B, C, D
      amount: 65,
      gain: 2.0
    }
  },
  {
    id: 'maximus',
    name: 'Maximus',
    category: 'Multiband Maximizer',
    wiredType: 'compress',
    defaultParams: {
      lowCrossover: 200,
      highCrossover: 4000,
      lowGain: 1.0,
      midGain: 1.2,
      highGain: 1.1,
      ceiling: -0.2,
      saturation: 35
    }
  },
  {
    id: 'peq2',
    name: 'Fruity Parametric EQ 2',
    category: 'Parametric Equalizer',
    wiredType: 'eq',
    defaultParams: {
      low: 0,
      mid: 0,
      high: 0,
      lowFreq: 100,
      midFreq: 1000,
      highFreq: 8000
    }
  },
  {
    id: 'limiter',
    name: 'Fruity Limiter',
    category: 'Limiter & Compressor',
    wiredType: 'compress',
    defaultParams: {
      ceiling: -0.5,
      threshold: -12,
      gain: 2.0,
      release: 150
    }
  },
  {
    id: 'reverb2',
    name: 'Fruity Reverb 2',
    category: 'Algorithmic Reverb',
    wiredType: 'utility',
    defaultParams: {
      decay: 2.2,
      roomSize: 65,
      dry: 80,
      wet: 35
    }
  },
  {
    id: 'delay3',
    name: 'Fruity Delay 3',
    category: 'Analog Delay',
    wiredType: 'utility',
    defaultParams: {
      time: '1/4',
      feedback: 45,
      pingpong: true,
      dry: 100,
      wet: 40
    }
  },
  {
    id: 'fastdist',
    name: 'Fruity Fast Dist',
    category: 'Overdrive Distortion',
    wiredType: 'saturator',
    defaultParams: {
      preamp: 60,
      tone: 50,
      mix: 100
    }
  },
  {
    id: 'chorus',
    name: 'Fruity Chorus',
    category: 'Stereo Chorus',
    wiredType: 'chorus',
    defaultParams: {
      speed: 1.2,
      depth: 60,
      mix: 70
    }
  },
  {
    id: 'waveshaper',
    name: 'Fruity WaveShaper',
    category: 'Wave Distortion & Saturation',
    wiredType: 'saturator',
    defaultParams: {
      preAmp: 1.0,
      postAmp: 1.0,
      curveType: 'soft-sat',
      tension: 0.5,
      bipolar: false
    }
  },
  {
    id: 'blood-overdrive',
    name: 'Blood Overdrive',
    category: 'Preamp Tube Overdrive',
    wiredType: 'saturator',
    defaultParams: {
      preBand: 1.2,
      color: 0.6,
      preAmp: 2.0,
      postGain: 0.8
    }
  }
];

export function findPluginDef(id) {
  return FL_PLUGINS.find(p => p.id === id) || FL_PLUGINS[0];
}

// ---------------------------------------------------------------------------
// Plugin UI Generators
// ---------------------------------------------------------------------------

function renderGrossBeatUi(params) {
  const timePresets = [
    { id: 'off', label: 'Off (Bypass)' },
    { id: 'half-speed', label: '1/2 Speed (HalfTime)' },
    { id: 'slow-triplet', label: 'Slow Triplet' },
    { id: 'scratch-vinyl', label: 'Turntable Scratch' },
    { id: 'tape-stop', label: 'Tape Slowdown' },
    { id: 'stutter-16', label: '1/16 Stutter Roll' },
    { id: 'reverse-burst', label: 'Momentary Reverse' },
    { id: 'flanger-sweep', label: 'Flanger Time Sweep' }
  ];

  const volPresets = [
    { id: 'off', label: 'Off (Clean)' },
    { id: 'sidechain-pump', label: '1/4 Sidechain Pump' },
    { id: 'gate-8th', label: '1/8 Trance Gater' },
    { id: 'gate-16th', label: '1/16 Fast Chop' },
    { id: 'tremolo', label: 'Smooth Tremolo' },
    { id: 'stutter-fade', label: 'Stutter Decay' }
  ];

  const currentTime = params.timeSlot || 'half-speed';
  const currentVol = params.volumeSlot || 'sidechain-pump';

  return `<div class="fl-plugin-grossbeat">
    <div class="fl-gb-header">
      <div class="fl-gb-badge">
        <span class="fl-gb-logo">GROSS BEAT</span>
        <span class="fl-gb-sub">Time &amp; Volume Manipulation Matrix</span>
      </div>
      <div class="fl-gb-mix-controls">
        <div class="fl-gb-knob">
          <label>TIME MIX</label>
          <input type="range" min="0" max="100" value="${Math.round((params.timeMix ?? 1) * 100)}" id="fl-gb-time-mix" data-plugin-param="timeMix" data-plugin-scale="100">
          <output id="fl-gb-time-mix-out">${Math.round((params.timeMix ?? 1) * 100)}%</output>
        </div>
        <div class="fl-gb-knob">
          <label>VOL MIX</label>
          <input type="range" min="0" max="100" value="${Math.round((params.volMix ?? 1) * 100)}" id="fl-gb-vol-mix" data-plugin-param="volMix" data-plugin-scale="100">
          <output id="fl-gb-vol-mix-out">${Math.round((params.volMix ?? 1) * 100)}%</output>
        </div>
      </div>
    </div>

    <!-- Interactive Envelope Canvas / Grid -->
    <div class="fl-gb-matrix-surface">
      <div class="fl-gb-grid-view">
        <svg class="fl-gb-curve-svg" viewBox="0 0 400 160" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gbCurveGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#ff851b" stop-opacity="0.4" />
              <stop offset="100%" stop-color="#ff851b" stop-opacity="0.0" />
            </linearGradient>
          </defs>
          <!-- Grid Lines -->
          ${Array.from({ length: 9 }, (_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="160" stroke="#1f262e" stroke-width="1"/>`).join('')}
          ${Array.from({ length: 5 }, (_, i) => `<line x1="0" y1="${i * 40}" x2="400" y2="${i * 40}" stroke="#1f262e" stroke-width="1"/>`).join('')}
          <!-- Waveform Curve -->
          <path d="${currentTime === 'half-speed'
            ? 'M 0 0 L 200 80 L 200 80 L 400 160 L 400 160 L 0 160 Z'
            : currentTime === 'scratch-vinyl'
            ? 'M 0 0 Q 150 140 250 80 T 400 160 L 400 160 L 0 160 Z'
            : 'M 0 40 L 100 80 L 200 40 L 300 120 L 400 80 L 400 160 L 0 160 Z'}" fill="url(#gbCurveGrad)" />
          <path d="${currentTime === 'half-speed'
            ? 'M 0 0 L 200 80 M 200 0 L 400 80'
            : currentTime === 'scratch-vinyl'
            ? 'M 0 0 Q 150 140 250 80 T 400 160'
            : 'M 0 40 L 100 80 L 200 40 L 300 120 L 400 80'}" stroke="#ff851b" stroke-width="2.5" fill="none" />
        </svg>
      </div>

      <!-- Preset Slots Matrix -->
      <div class="fl-gb-slots-container">
        <div class="fl-gb-slots-column">
          <span class="fl-gb-col-title">TIME PRESETS</span>
          <div class="fl-gb-slots-grid">
            ${timePresets.map(p => `
              <button type="button" class="fl-gb-slot-btn ${currentTime === p.id ? 'active' : ''}" data-gb-time="${p.id}">
                ${p.label}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="fl-gb-slots-column">
          <span class="fl-gb-col-title">VOLUME / GATING</span>
          <div class="fl-gb-slots-grid">
            ${volPresets.map(p => `
              <button type="button" class="fl-gb-slot-btn ${currentVol === p.id ? 'active' : ''}" data-gb-vol="${p.id}">
                ${p.label}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function renderMaximusUi(params) {
  const lowG = Number(params.lowGain ?? 1.0);
  const midG = Number(params.midGain ?? 1.2);
  const highG = Number(params.highGain ?? 1.1);
  const ceil = Number(params.ceiling ?? -0.2);
  const sat = Number(params.saturation ?? 35);

  return `<div class="fl-plugin-maximus">
    <div class="fl-max-header">
      <span class="fl-max-title">MAXIMUS</span>
      <span class="fl-max-sub">3-Band Mastering Maximizer &amp; Saturation</span>
    </div>

    <div class="fl-max-bands-display">
      <div class="fl-max-band low">
        <span class="fl-band-tag">LOW</span>
        <div class="fl-band-meter" style="height: ${Math.round(lowG * 65)}%"></div>
        <span class="fl-band-val">${(lowG * 100).toFixed(0)}%</span>
      </div>
      <div class="fl-max-band mid">
        <span class="fl-band-tag">MID</span>
        <div class="fl-band-meter" style="height: ${Math.round(midG * 65)}%"></div>
        <span class="fl-band-val">${(midG * 100).toFixed(0)}%</span>
      </div>
      <div class="fl-max-band high">
        <span class="fl-band-tag">HIGH</span>
        <div class="fl-band-meter" style="height: ${Math.round(highG * 65)}%"></div>
        <span class="fl-band-val">${(highG * 100).toFixed(0)}%</span>
      </div>
      <div class="fl-max-band master">
        <span class="fl-band-tag">MASTER</span>
        <div class="fl-band-meter" style="height: 85%"></div>
        <span class="fl-band-val">${ceil} dB</span>
      </div>
    </div>

    <div class="fl-max-controls">
      <div class="fl-max-knob">
        <label>LOW GAIN</label>
        <input type="range" min="0" max="200" value="${Math.round(lowG * 100)}" id="fl-max-low" data-plugin-param="lowGain" data-plugin-scale="100">
        <output id="fl-max-low-out">${(lowG * 100).toFixed(0)}%</output>
      </div>
      <div class="fl-max-knob">
        <label>MID GAIN</label>
        <input type="range" min="0" max="200" value="${Math.round(midG * 100)}" id="fl-max-mid" data-plugin-param="midGain" data-plugin-scale="100">
        <output id="fl-max-mid-out">${(midG * 100).toFixed(0)}%</output>
      </div>
      <div class="fl-max-knob">
        <label>HIGH GAIN</label>
        <input type="range" min="0" max="200" value="${Math.round(highG * 100)}" id="fl-max-high" data-plugin-param="highGain" data-plugin-scale="100">
        <output id="fl-max-high-out">${(highG * 100).toFixed(0)}%</output>
      </div>
      <div class="fl-max-knob">
        <label>SATURATION</label>
        <input type="range" min="0" max="100" value="${sat}" id="fl-max-sat" data-plugin-param="saturation">
        <output id="fl-max-sat-out">${sat}%</output>
      </div>
      <div class="fl-max-knob">
        <label>CEILING</label>
        <input type="range" min="-12" max="0" step="0.1" value="${ceil}" id="fl-max-ceil" data-plugin-param="ceiling">
        <output id="fl-max-ceil-out">${ceil} dB</output>
      </div>
    </div>
  </div>`;
}

function renderSoundgoodizerUi(params) {
  const currentMode = params.mode || 'A';
  const amount = Number(params.amount ?? 65);
  const angle = (amount / 100) * 270 - 135; // -135 to +135 deg

  return `<div class="fl-plugin-soundgoodizer">
    <div class="fl-sg-title">SOUNDGOODIZER</div>
    <div class="fl-sg-body">
      <!-- Big Center Rotary Knob -->
      <div class="fl-sg-knob-container">
        <div class="fl-sg-ring" style="--ring-fill: ${amount}%"></div>
        <div class="fl-sg-dial" id="fl-sg-dial" style="transform: rotate(${angle}deg);">
          <div class="fl-sg-dot"></div>
        </div>
        <input type="range" min="0" max="100" value="${amount}" class="fl-sg-range" id="fl-sg-amount" data-plugin-param="amount" aria-label="Soundgoodizer amount">
      </div>
      <div class="fl-sg-readout" id="fl-sg-readout">${amount}%</div>

      <!-- Mode Buttons A, B, C, D -->
      <div class="fl-sg-modes" role="radiogroup" aria-label="Soundgoodizer Mode">
        <button type="button" class="fl-sg-mode-btn ${currentMode === 'A' ? 'active' : ''}" data-sg-mode="A" style="--btn-color:#ff851b;">A</button>
        <button type="button" class="fl-sg-mode-btn ${currentMode === 'B' ? 'active' : ''}" data-sg-mode="B" style="--btn-color:#22c55e;">B</button>
        <button type="button" class="fl-sg-mode-btn ${currentMode === 'C' ? 'active' : ''}" data-sg-mode="C" style="--btn-color:#38bdf8;">C</button>
        <button type="button" class="fl-sg-mode-btn ${currentMode === 'D' ? 'active' : ''}" data-sg-mode="D" style="--btn-color:#eab308;">D</button>
      </div>
    </div>
  </div>`;
}

function renderParametricEq2Ui(params) {
  const b1 = Number(params.b1 ?? params.low ?? 0);
  const b2 = Number(params.b2 ?? 0);
  const b3 = Number(params.b3 ?? -1);
  const b4 = Number(params.b4 ?? params.mid ?? 0);
  const b5 = Number(params.b5 ?? 2);
  const b6 = Number(params.b6 ?? params.high ?? 0);
  const b7 = Number(params.b7 ?? 0);

  const bands = [
    { id: 'b1', name: '1', freq: '30 Hz', gain: b1, color: '#f43f5e', cx: 35 },
    { id: 'b2', name: '2', freq: '100 Hz', gain: b2, color: '#fb923c', cx: 85 },
    { id: 'b3', name: '3', freq: '400 Hz', gain: b3, color: '#facc15', cx: 140 },
    { id: 'b4', name: '4', freq: '1.2k', gain: b4, color: '#4ade80', cx: 195 },
    { id: 'b5', name: '5', freq: '3.5k', gain: b5, color: '#38bdf8', cx: 250 },
    { id: 'b6', name: '6', freq: '8 kHz', gain: b6, color: '#818cf8', cx: 300 },
    { id: 'b7', name: '7', freq: '16k', gain: b7, color: '#c084fc', cx: 345 }
  ];

  const midY = 65;
  const scale = 2.4;
  const pts = bands.map(b => ({
    x: b.cx,
    y: Math.max(10, Math.min(120, midY - b.gain * scale))
  }));

  let pathD = `M 0 ${pts[0].y}`;
  for (let i = 0; i < pts.length; i++) {
    const cur = pts[i];
    const next = pts[i + 1] || { x: 380, y: cur.y };
    const cX = (cur.x + next.x) / 2;
    pathD += ` Q ${cur.x} ${cur.y}, ${cX} ${(cur.y + next.y) / 2}`;
  }
  pathD += ` T 380 ${pts[pts.length - 1].y}`;

  return `<div class="fl-plugin-peq2">
    <div class="fl-peq-screen">
      <svg class="fl-peq-svg" viewBox="0 0 380 130" preserveAspectRatio="none">
        <line x1="0" y1="20" x2="380" y2="20" stroke="#1c2229" stroke-width="1" stroke-dasharray="3,3" />
        <line x1="0" y1="65" x2="380" y2="65" stroke="#283340" stroke-width="1.2" />
        <line x1="0" y1="110" x2="380" y2="110" stroke="#1c2229" stroke-width="1" stroke-dasharray="3,3" />
        <path d="${pathD}" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" />
        ${bands.map((b, idx) => `
          <circle cx="${pts[idx].x}" cy="${pts[idx].y}" r="5.5" fill="${b.color}" stroke="#ffffff" stroke-width="1" class="fl-peq-node" data-peq-band="${b.id}" />
          <text x="${pts[idx].x}" y="${pts[idx].y - 8}" font-size="7.5" fill="#94a3b8" text-anchor="middle" font-family="monospace">${b.name}</text>
        `).join('')}
      </svg>
    </div>
    <div class="fl-peq-bands-row">
      ${bands.map(b => `
        <div class="fl-peq-band-col">
          <span class="fl-peq-band-badge" style="background: ${b.color}; color: #000;">${b.name}</span>
          <span class="fl-peq-freq">${b.freq}</span>
          <input type="range" min="-18" max="18" value="${b.gain}" class="fl-peq-fader" data-peq-band="${b.id}" orient="vertical" />
          <output class="fl-peq-out">${b.gain > 0 ? '+' : ''}${b.gain}dB</output>
        </div>
      `).join('')}
    </div>
  </div>`;
}

function renderWaveShaperUi(params) {
  const pre = Number(params.preAmp ?? 1.0);
  const post = Number(params.postAmp ?? 1.0);
  const tension = Number(params.tension ?? 0.5);
  const curveType = params.curveType || 'soft-sat';

  const width = 280;
  const height = 110;
  const points = [];
  const steps = 30;
  for (let i = 0; i <= steps; i++) {
    const x = i / steps;
    let y = x;
    if (curveType === 'soft-sat') {
      y = Math.tanh(x * (1 + tension * 3)) / Math.tanh(1 + tension * 3);
    } else if (curveType === 'hard-clip') {
      const threshold = Math.max(0.2, 1 - tension * 0.6);
      y = Math.min(threshold, x) / threshold;
    } else if (curveType === 'foldback') {
      y = Math.sin(x * Math.PI * (0.5 + tension));
    } else if (curveType === 'asymmetric') {
      y = Math.pow(x, 1 / (1 + tension * 2));
    }
    const px = Math.round(x * (width - 24) + 12);
    const py = Math.round((1 - Math.max(0, Math.min(1, y))) * (height - 20) + 10);
    points.push(`${px},${py}`);
  }
  const pathD = `M ${points.join(' L ')}`;

  return `<div class="fl-plugin-waveshaper">
    <div class="fl-ws-screen">
      <svg class="fl-ws-svg" viewBox="0 0 ${width} ${height}">
        <line x1="12" y1="100" x2="268" y2="10" stroke="#222b35" stroke-dasharray="3,3" />
        <path d="${pathD}" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" />
        <circle cx="140" cy="${Math.round((1 - tension) * (height - 24) + 12)}" r="4" fill="#fff" />
      </svg>
    </div>
    <div class="fl-ws-modes">
      <button type="button" class="fl-ws-mode-btn ${curveType === 'soft-sat' ? 'active' : ''}" data-ws-curve="soft-sat">SOFT SAT</button>
      <button type="button" class="fl-ws-mode-btn ${curveType === 'hard-clip' ? 'active' : ''}" data-ws-curve="hard-clip">HARD CLIP</button>
      <button type="button" class="fl-ws-mode-btn ${curveType === 'foldback' ? 'active' : ''}" data-ws-curve="foldback">FOLDBACK</button>
      <button type="button" class="fl-ws-mode-btn ${curveType === 'asymmetric' ? 'active' : ''}" data-ws-curve="asymmetric">ASYM</button>
    </div>
    <div class="fl-ws-controls">
      <div class="fl-param-knob">
        <label>TENSION</label>
        <input type="range" min="0" max="100" value="${Math.round(tension * 100)}" id="fl-ws-tension" data-ws-param="tension">
        <output id="fl-ws-tension-out">${Math.round(tension * 100)}%</output>
      </div>
      <div class="fl-param-knob">
        <label>PRE AMP</label>
        <input type="range" min="50" max="300" value="${Math.round(pre * 100)}" id="fl-ws-pre" data-ws-param="preAmp">
        <output id="fl-ws-pre-out">${pre.toFixed(1)}x</output>
      </div>
      <div class="fl-param-knob">
        <label>POST AMP</label>
        <input type="range" min="10" max="200" value="${Math.round(post * 100)}" id="fl-ws-post" data-ws-param="postAmp">
        <output id="fl-ws-post-out">${post.toFixed(1)}x</output>
      </div>
    </div>
  </div>`;
}

function renderBloodOverdriveUi(params) {
  const preBand = Number(params.preBand ?? 1.2);
  const color = Number(params.color ?? 0.6);
  const preAmp = Number(params.preAmp ?? 2.0);
  const postGain = Number(params.postGain ?? 0.8);

  return `<div class="fl-plugin-blood">
    <div class="fl-blood-badge">VINTAGE TUBE PREAMP</div>
    <div class="fl-blood-controls">
      <div class="fl-param-knob">
        <label>PREBAND</label>
        <input type="range" min="50" max="300" value="${Math.round(preBand * 100)}" id="fl-bo-preband" data-plugin-param="preBand" data-plugin-scale="100">
        <output>${preBand.toFixed(1)}x</output>
      </div>
      <div class="fl-param-knob">
        <label>COLOR</label>
        <input type="range" min="0" max="100" value="${Math.round(color * 100)}" id="fl-bo-color" data-plugin-param="color" data-plugin-scale="100">
        <output>${Math.round(color * 100)}%</output>
      </div>
      <div class="fl-param-knob">
        <label>PREAMP (DRIVE)</label>
        <input type="range" min="10" max="500" value="${Math.round(preAmp * 100)}" id="fl-bo-preamp" data-plugin-param="preAmp" data-plugin-scale="100">
        <output>${preAmp.toFixed(1)}x</output>
      </div>
      <div class="fl-param-knob">
        <label>POST GAIN</label>
        <input type="range" min="10" max="200" value="${Math.round(postGain * 100)}" id="fl-bo-post" data-plugin-param="postGain" data-plugin-scale="100">
        <output>${postGain.toFixed(1)}x</output>
      </div>
    </div>
  </div>`;
}

function renderLimiterUi(params) {
  const ceil = Number(params.ceiling ?? -0.5);
  const thresh = Number(params.threshold ?? -12);
  const gain = Number(params.gain ?? 2.0);

  return `<div class="fl-plugin-limiter">
    <div class="fl-lim-screen">
      <div class="fl-lim-line ceil" style="top: ${Math.max(10, 50 - ceil * 3)}px"><span class="fl-lim-tag">CEIL ${ceil} dB</span></div>
      <div class="fl-lim-line thresh" style="top: ${Math.max(25, 70 - thresh * 2.5)}px"><span class="fl-lim-tag">THRESH ${thresh} dB</span></div>
    </div>
    <div class="fl-lim-controls">
      <div class="fl-fader-col">
        <label>CEIL</label>
        <input type="range" min="-12" max="0" step="0.1" value="${ceil}" id="fl-lim-ceil" data-plugin-param="ceiling">
        <output id="fl-lim-ceil-out">${ceil} dB</output>
      </div>
      <div class="fl-fader-col">
        <label>THRESH</label>
        <input type="range" min="-36" max="0" step="0.5" value="${thresh}" id="fl-lim-thresh" data-plugin-param="threshold">
        <output id="fl-lim-thresh-out">${thresh} dB</output>
      </div>
      <div class="fl-fader-col">
        <label>GAIN</label>
        <input type="range" min="0" max="18" step="0.5" value="${gain}" id="fl-lim-gain" data-plugin-param="gain">
        <output id="fl-lim-gain-out">+${gain} dB</output>
      </div>
    </div>
  </div>`;
}

function renderReverb2Ui(params) {
  const decay = Number(params.decay ?? 2.2);
  const room = Number(params.roomSize ?? 65);
  const dry = Number(params.dry ?? 80);
  const wet = Number(params.wet ?? 35);

  return `<div class="fl-plugin-reverb2">
    <div class="fl-reverb-room-preview">
      <div class="fl-reverb-box" style="transform: scale(${0.4 + (room / 100) * 0.6});">
        <span class="fl-room-label">ROOM ${room}%</span>
      </div>
    </div>
    <div class="fl-reverb-controls">
      <div class="fl-param-knob">
        <label>DECAY</label>
        <input type="range" min="0.2" max="10" step="0.1" value="${decay}" id="fl-rev-decay" data-plugin-param="decay">
        <output id="fl-rev-decay-out">${decay}s</output>
      </div>
      <div class="fl-param-knob">
        <label>ROOM</label>
        <input type="range" min="10" max="100" value="${room}" id="fl-rev-room" data-plugin-param="roomSize">
        <output id="fl-rev-room-out">${room}%</output>
      </div>
      <div class="fl-param-knob">
        <label>DRY</label>
        <input type="range" min="0" max="100" value="${dry}" id="fl-rev-dry" data-plugin-param="dry">
        <output id="fl-rev-dry-out">${dry}%</output>
      </div>
      <div class="fl-param-knob">
        <label>WET</label>
        <input type="range" min="0" max="100" value="${wet}" id="fl-rev-wet" data-plugin-param="wet">
        <output id="fl-rev-wet-out">${wet}%</output>
      </div>
    </div>
  </div>`;
}

function renderDelay3Ui(params) {
  const time = params.time || '1/4';
  const fb = Number(params.feedback ?? 45);

  return `<div class="fl-plugin-delay3">
    <div class="fl-delay-row">
      <div class="fl-delay-setting">
        <label>TIME</label>
        <select id="fl-delay-time" class="fl-rack-select" data-plugin-param="time">
          <option value="1/2" ${time === '1/2' ? 'selected' : ''}>1/2 Note</option>
          <option value="1/4" ${time === '1/4' ? 'selected' : ''}>1/4 Beat</option>
          <option value="1/8" ${time === '1/8' ? 'selected' : ''}>1/8 Beat</option>
          <option value="1/16" ${time === '1/16' ? 'selected' : ''}>1/16 Beat</option>
          <option value="1/8D" ${time === '1/8D' ? 'selected' : ''}>1/8 Dotted</option>
          <option value="1/4T" ${time === '1/4T' ? 'selected' : ''}>1/4 Triplet</option>
        </select>
      </div>
      <div class="fl-param-knob">
        <label>FEEDBACK</label>
        <input type="range" min="0" max="95" value="${fb}" id="fl-delay-fb" data-plugin-param="feedback">
        <output id="fl-delay-fb-out">${fb}%</output>
      </div>
      <div class="fl-param-knob">
        <label>PING PONG</label>
        <button type="button" class="fl-btn-switch ${params.pingpong === false ? '' : 'active'}" id="fl-delay-pp">${params.pingpong === false ? 'OFF' : 'ON'}</button>
      </div>
    </div>
  </div>`;
}

function renderFastDistUi(params) {
  const preamp = Number(params.preamp ?? 60);
  const tone = Number(params.tone ?? 50);

  return `<div class="fl-plugin-fastdist">
    <div class="fl-dist-meter">
      <div class="fl-dist-indicator" style="width: ${preamp}%;"></div>
    </div>
    <div class="fl-dist-row">
      <div class="fl-param-knob">
        <label>PREAMP</label>
        <input type="range" min="0" max="100" value="${preamp}" id="fl-dist-preamp" data-plugin-param="preamp">
        <output id="fl-dist-preamp-out">${preamp}%</output>
      </div>
      <div class="fl-param-knob">
        <label>TONE</label>
        <input type="range" min="0" max="100" value="${tone}" id="fl-dist-tone" data-plugin-param="tone">
        <output id="fl-dist-tone-out">${tone < 50 ? 'Dark' : tone > 50 ? 'Bright' : 'Neutral'}</output>
      </div>
    </div>
  </div>`;
}

function renderChorusUi(params) {
  const speed = Number(params.speed ?? 1.2);
  const depth = Number(params.depth ?? 60);

  return `<div class="fl-plugin-chorus">
    <div class="fl-chorus-row">
      <div class="fl-param-knob">
        <label>SPEED</label>
        <input type="range" min="0.1" max="5.0" step="0.1" value="${speed}" id="fl-chorus-speed" data-plugin-param="speed">
        <output id="fl-chorus-speed-out">${speed} Hz</output>
      </div>
      <div class="fl-param-knob">
        <label>DEPTH</label>
        <input type="range" min="0" max="100" value="${depth}" id="fl-chorus-depth" data-plugin-param="depth">
        <output id="fl-chorus-depth-out">${depth}%</output>
      </div>
    </div>
  </div>`;
}

export function renderFlPluginWindow(arg1, arg2, arg3, arg4) {
  let def, params, trackName = 'Master', slotIndex = 0, fx = {};
  if (typeof arg1 === 'object' && arg1 && arg1.id) {
    def = arg1;
    params = arg2 || def.defaultParams || {};
    trackName = 'Track';
    slotIndex = 0;
    fx = { wet: 1.0, params };
  } else {
    const trackId = arg1;
    trackName = arg2 || 'Track';
    slotIndex = Number(arg3) || 0;
    fx = arg4 || {};
    const pluginId = fx.pluginId || (fx.type === 'eq' ? 'peq2' : fx.type === 'compress' ? 'limiter' : fx.type === 'saturator' ? 'soundgoodizer' : 'peq2');
    def = findPluginDef(pluginId);
    params = fx.params || def.defaultParams || {};
  }

  let body = '';
  if (def.id === 'grossbeat') body = renderGrossBeatUi(params);
  else if (def.id === 'soundgoodizer') body = renderSoundgoodizerUi(params);
  else if (def.id === 'maximus') body = renderMaximusUi(params);
  else if (def.id === 'peq2') body = renderParametricEq2Ui(params);
  else if (def.id === 'limiter') body = renderLimiterUi(params);
  else if (def.id === 'reverb2') body = renderReverb2Ui(params);
  else if (def.id === 'delay3') body = renderDelay3Ui(params);
  else if (def.id === 'fastdist') body = renderFastDistUi(params);
  else if (def.id === 'chorus') body = renderChorusUi(params);
  else if (def.id === 'waveshaper') body = renderWaveShaperUi(params);
  else if (def.id === 'blood-overdrive') body = renderBloodOverdriveUi(params);
  else body = renderParametricEq2Ui(params);

  return `<div class="fl-plugin-backdrop" id="fl-plugin-backdrop" role="dialog" aria-modal="true" aria-label="${def.name}">
    <div class="fl-plugin-window">
      <!-- Title Bar -->
      <div class="fl-plugin-titlebar">
        <div class="fl-plugin-title-left">
          <span class="fl-plugin-ico">FX</span>
          <strong>${def.name}</strong>
          <span class="fl-plugin-track-tag">${trackName} · Slot ${slotIndex + 1}</span>
        </div>
        <div class="fl-plugin-title-right">
          <button type="button" class="fl-plugin-close" id="fl-plugin-close" aria-label="Close plugin window">X</button>
        </div>
      </div>
      <!-- Plugin Controls Body -->
      <div class="fl-plugin-body">
        ${body}
      </div>
      <!-- Plugin Bottom Status -->
      <div class="fl-plugin-footer">
        <span>${def.category}</span>
        <span>Wet: ${Math.round((fx.wet ?? 1.0) * 100)}%</span>
      </div>
    </div>
  </div>`;
}
