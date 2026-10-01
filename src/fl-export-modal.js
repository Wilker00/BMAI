// FL Studio Commercial Export Modal (Ctrl+R / Shift+Ctrl+R) - Zero Emojis
// Full project render dialog supporting Song vs Pattern, WAV 16/24/32-bit float, MP3 320 kbps,
// tail options (leave/cut/wrap remainder), and stem track export splitting.

export function renderFlExportModal(state = {}, options = {}) {
  const projectName = state.name || 'Untitled Project';
  const mode = options.mode || 'song';
  const format = options.format || 'wav-24';
  const tail = options.tail || 'leave';
  const splitMixer = !!options.splitMixerTracks;

  return `
    <div class="fl-export-modal-backdrop" id="fl-export-modal-backdrop">
      <div class="fl-export-dialog" role="dialog" aria-labelledby="fl-export-title">
        <div class="fl-export-header">
          <strong id="fl-export-title">Render Project - ${projectName}</strong>
          <button type="button" class="fl-export-close" id="fl-export-close" aria-label="Close dialog">X</button>
        </div>
        <div class="fl-export-body">
          <!-- Render Mode: Song vs Pattern -->
          <div class="fl-export-group">
            <label class="fl-export-label">RENDER MODE</label>
            <div class="fl-export-btn-group">
              <button type="button" class="fl-export-tab ${mode === 'song' ? 'active' : ''}" data-exp-mode="song">SONG (FULL ARRANGEMENT)</button>
              <button type="button" class="fl-export-tab ${mode === 'pattern' ? 'active' : ''}" data-exp-mode="pattern">PATTERN (ACTIVE LOOP)</button>
            </div>
          </div>

          <!-- Format / Bit-depth Selection -->
          <div class="fl-export-group">
            <label class="fl-export-label">FORMAT &amp; QUALITY</label>
            <div class="fl-export-btn-group formats">
              <button type="button" class="fl-export-format-btn ${format === 'wav-16' ? 'active' : ''}" data-exp-format="wav-16">WAV 16-BIT</button>
              <button type="button" class="fl-export-format-btn ${format === 'wav-24' ? 'active' : ''}" data-exp-format="wav-24">WAV 24-BIT</button>
              <button type="button" class="fl-export-format-btn ${format === 'wav-32' ? 'active' : ''}" data-exp-format="wav-32">WAV 32-BIT FLOAT</button>
              <button type="button" class="fl-export-format-btn ${format === 'mp3' ? 'active' : ''}" data-exp-format="mp3">MP3 320 KBPS</button>
            </div>
          </div>

          <!-- Tail Options -->
          <div class="fl-export-group">
            <label class="fl-export-label">TAIL HANDLING</label>
            <div class="fl-export-btn-group">
              <button type="button" class="fl-export-tab ${tail === 'leave' ? 'active' : ''}" data-exp-tail="leave">LEAVE REMAINDER</button>
              <button type="button" class="fl-export-tab ${tail === 'cut' ? 'active' : ''}" data-exp-tail="cut">CUT REMAINDER</button>
              <button type="button" class="fl-export-tab ${tail === 'wrap' ? 'active' : ''}" data-exp-tail="wrap">WRAP REMAINDER</button>
            </div>
          </div>

          <!-- Stem Separation Options -->
          <div class="fl-export-group checkbox-group">
            <label class="fl-export-checkbox-label">
              <input type="checkbox" id="fl-export-split-stems" ${splitMixer ? 'checked' : ''} />
              <span>Split mixer tracks (Export individual track stems to ZIP)</span>
            </label>
          </div>
        </div>
        <div class="fl-export-footer">
          <button type="button" class="fl-export-btn cancel" id="fl-export-cancel">CANCEL</button>
          <button type="button" class="fl-export-btn start" id="fl-export-start">START EXPORT</button>
        </div>
      </div>
    </div>
  `;
}
