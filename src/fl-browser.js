// FL Studio Browser Tree & Sample Preview Engine
// Features hierarchical tree navigation (Current project, Packs, Instruments, Effects),
// one-shot sample auditioning, search filter, and mini waveform visualizer.

export function renderFlBrowser(state = {}) {
  const packs = [
    { id: 'drums', label: 'Drums & Percussion', items: ['808 Sub Kick', 'Acoustic Kick', 'Trap Snare', '90s Boom Bap Snare', 'Analog Clap', 'Closed Hat 01', 'Open Hat Tight', '808 Long Bass C2', 'Crash Cymbal', 'Perc Shaker'] },
    { id: 'instruments', label: 'Generators & Synths', items: ['3xOSC Subtractive Synth', 'Rhodes Electric Piano', 'Ambient Pad Synth', '808 Bass Module'] },
    { id: 'effects', label: 'Effects & Plugins', items: ['Gross Beat', 'Soundgoodizer', 'Maximus Multiband', 'Fruity Parametric EQ 2', 'Fruity Limiter', 'Fruity Reverb 2', 'Fruity Delay 3', 'Fruity Chorus'] },
    { id: 'project', label: 'Current Project', items: ['Patterns (Bank)', 'Automation Clips', 'Vocal Takes', 'History / Undo Snapshots'] }
  ];

  return `<div class="fl-browser-view" id="fl-browser-view" aria-label="FL Studio Browser">
    <!-- Browser Search Bar -->
    <div class="fl-browser-search-wrap">
      <input type="text" class="fl-browser-search-input" id="fl-browser-search" placeholder="Search sounds, plugins..." />
    </div>

    <!-- Tree Categories List -->
    <div class="fl-browser-tree" role="tree">
      ${packs.map(pack => `
        <div class="fl-browser-category" data-browser-pack="${pack.id}">
          <div class="fl-browser-cat-header" tabindex="0" role="treeitem" aria-expanded="true">
            <span class="fl-browser-cat-badge">DIR</span>
            <strong class="fl-browser-cat-title">${pack.label}</strong>
          </div>
          <div class="fl-browser-items-list" role="group">
            ${pack.items.map(item => `
              <div class="fl-browser-item" tabindex="0" role="treeitem" data-browser-sample="${item}" title="Click to preview ${item}">
                <span class="fl-browser-item-type">${item.includes('Synth') || item.includes('Piano') ? 'GEN' : item.includes('Beat') || item.includes('EQ') || item.includes('Limiter') || item.includes('Reverb') ? 'FX' : 'SMP'}</span>
                <span class="fl-browser-item-name">${item}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Bottom Mini Sample Preview Waveform -->
    <div class="fl-browser-preview-bar">
      <div class="fl-browser-preview-meta">
        <span class="fl-browser-preview-tag">PREVIEW</span>
        <span class="fl-browser-preview-name" id="fl-browser-sample-name">Ready</span>
      </div>
      <canvas id="fl-browser-preview-canvas" class="fl-browser-canvas" width="220" height="34"></canvas>
    </div>
  </div>`;
}

export function drawFlWaveform(canvas, audioBuffer, { strokeColor = '#ff851b', fillColor = 'rgba(255, 133, 27, 0.25)' } = {}) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#101418';
  ctx.fillRect(0, 0, w, h);

  // Centerline
  ctx.strokeStyle = '#222830';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();

  if (!audioBuffer) return;

  const raw = audioBuffer.getChannelData(0);
  const step = Math.ceil(raw.length / w);
  const amp = (h / 2) * 0.9;

  ctx.fillStyle = fillColor;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 1.2;

  ctx.beginPath();
  for (let i = 0; i < w; i++) {
    let min = 1.0;
    let max = -1.0;
    for (let j = 0; j < step; j++) {
      const datum = raw[(i * step) + j] || 0;
      if (datum < min) min = datum;
      if (datum > max) max = datum;
    }
    const yTop = (h / 2) - (max * amp);
    const yBottom = (h / 2) - (min * amp);
    ctx.fillRect(i, yTop, 1, Math.max(2, yBottom - yTop));
  }
}
