// FL Studio "Edison" Mini Waveform Sample Editor
// Provides waveform editing, trim in/out points, normalize, reverse,
// fade in/out, zero-crossing snap, and 1-click export to Channel Rack.

export function renderFlEdisonUi({
  lane = 'kick',
  sampleName = 'Sample',
  trimStart = 0, // 0.0 - 1.0
  trimEnd = 1.0,  // 0.0 - 1.0
  isNormalized = false,
  isReversed = false
} = {}) {
  return `<div class="fl-edison-window" id="fl-edison-window" role="dialog" aria-label="Edison Waveform Editor">
    <!-- Window Titlebar -->
    <div class="fl-plugin-titlebar">
      <div class="fl-plugin-title-left">
        <span class="fl-plugin-ico">WAVE</span>
        <strong>Edison Editor</strong>
        <span class="fl-plugin-track-tag">${sampleName} · [${lane.toUpperCase()}]</span>
      </div>
      <div class="fl-plugin-title-right">
        <button type="button" class="fl-plugin-close" id="fl-edison-close" aria-label="Close Edison">X</button>
      </div>
    </div>

    <!-- Toolbar Strip (No Emojis) -->
    <div class="fl-edison-toolbar">
      <button type="button" class="fl-ed-btn" id="fl-edison-play" title="Play / Audition Selection">PLAY</button>
      <button type="button" class="fl-ed-btn" id="fl-edison-stop" title="Stop">STOP</button>
      <div class="fl-pr-divider"></div>
      <button type="button" class="fl-ed-btn ${isNormalized ? 'active' : ''}" id="fl-edison-norm" title="Normalize Peak (Alt+N)">NORM</button>
      <button type="button" class="fl-ed-btn ${isReversed ? 'active' : ''}" id="fl-edison-rev" title="Reverse Sample (Alt+Left)">REV</button>
      <button type="button" class="fl-ed-btn" id="fl-edison-fadein" title="Fade In (Soft ramp)">FADE IN</button>
      <button type="button" class="fl-ed-btn" id="fl-edison-fadeout" title="Fade Out">FADE OUT</button>
      <button type="button" class="fl-ed-btn" id="fl-edison-snap-zero" title="Snap to Zero Crossing">ZERO</button>
      <div class="fl-pr-divider"></div>
      <button type="button" class="fl-ed-btn hot" id="fl-edison-commit" title="Commit and send audio to Channel Rack">SEND TO RACK</button>
    </div>

    <!-- Waveform Display Canvas -->
    <div class="fl-edison-canvas-wrap">
      <canvas id="fl-edison-canvas" class="fl-edison-canvas" width="560" height="140"></canvas>
      <div class="fl-ed-trim-overlay" id="fl-edison-trim-overlay">
        <!-- Start Marker -->
        <div class="fl-ed-marker start" id="fl-ed-marker-start" style="left: ${trimStart * 100}%">
          <span class="fl-ed-marker-flag">IN</span>
        </div>
        <!-- End Marker -->
        <div class="fl-ed-marker end" id="fl-ed-marker-end" style="left: ${trimEnd * 100}%">
          <span class="fl-ed-marker-flag">OUT</span>
        </div>
      </div>
    </div>

    <!-- Waveform Stats Footer -->
    <div class="fl-edison-footer">
      <div class="fl-ed-stat">
        <label>TRIM IN:</label>
        <span id="fl-ed-in-text">${(trimStart * 100).toFixed(1)}%</span>
      </div>
      <div class="fl-ed-stat">
        <label>TRIM OUT:</label>
        <span id="fl-ed-out-text">${(trimEnd * 100).toFixed(1)}%</span>
      </div>
      <div class="fl-ed-stat">
        <label>LENGTH:</label>
        <span id="fl-ed-len-text">${((trimEnd - trimStart) * 100).toFixed(1)}%</span>
      </div>
    </div>
  </div>`;
}

export function drawEdisonWaveform(canvas, audioBuffer, {
  trimStart = 0,
  trimEnd = 1.0,
  playheadPosition = -1
} = {}) {
  if (!canvas || !audioBuffer) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#101418';
  ctx.fillRect(0, 0, w, h);

  // Background Grid
  ctx.strokeStyle = '#1e2630';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();

  // Draw Audio Peaks
  const raw = audioBuffer.getChannelData(0);
  const step = Math.ceil(raw.length / w);
  const amp = (h / 2) * 0.9;

  // Active waveform gradient
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#ff9d3b');
  grad.addColorStop(0.5, '#ff851b');
  grad.addColorStop(1, '#d35400');
  ctx.fillStyle = grad;

  for (let i = 0; i < w; i++) {
    let min = 1.0;
    let max = -1.0;
    for (let j = 0; j < step; j++) {
      const datum = raw[(i * step) + j] || 0;
      if (datum < min) min = datum;
      if (datum > max) max = datum;
    }
    const barHeight = Math.max(2, (max - min) * amp);
    ctx.fillRect(i, (h / 2) - (max * amp), 1, barHeight);
  }

  // Dim Trimmed Out Regions
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  const inPx = Math.round(trimStart * w);
  const outPx = Math.round(trimEnd * w);
  if (inPx > 0) ctx.fillRect(0, 0, inPx, h);
  if (outPx < w) ctx.fillRect(outPx, 0, w - outPx, h);

  // Playhead line
  if (playheadPosition >= 0 && playheadPosition <= 1) {
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(Math.round(playheadPosition * w), 0, 2, h);
  }
}

// Slicex-style Automatic Transient & Beat Slicer
// Detects energy onsets/flux in audio buffers to produce sliced regions for Piano Roll mapping.
export function detectAudioTransients(audioBuffer, { sensitivity = 0.35, minSliceSeconds = 0.08 } = {}) {
  if (!audioBuffer) return [0.0, 1.0];

  const raw = audioBuffer.getChannelData(0);
  const sampleRate = audioBuffer.sampleRate || 44100;
  const blockSize = Math.round(sampleRate * 0.01); // 10ms blocks
  const minSamples = Math.round(minSliceSeconds * sampleRate);

  const energy = [];
  for (let i = 0; i < raw.length; i += blockSize) {
    let sum = 0;
    const end = Math.min(raw.length, i + blockSize);
    for (let j = i; j < end; j++) {
      sum += raw[j] * raw[j];
    }
    energy.push(Math.sqrt(sum / (end - i)));
  }

  const sliceIndices = [0];
  let lastSliceSample = 0;

  for (let b = 1; b < energy.length - 1; b++) {
    const prevE = energy[b - 1];
    const curE = energy[b];
    const diff = curE - prevE;
    const curSample = b * blockSize;

    if (diff > sensitivity && (curSample - lastSliceSample) >= minSamples) {
      sliceIndices.push(curSample);
      lastSliceSample = curSample;
    }
  }

  // Ensure end slice point
  if (lastSliceSample < raw.length - minSamples) {
    sliceIndices.push(raw.length);
  }

  return sliceIndices.map(sampleIdx => Math.min(1.0, sampleIdx / raw.length));
}

