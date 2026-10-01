// FL Studio Rename & Color Palette Modal (F2) - Zero Emojis
// Allows renaming and assigning signature FL 16-color swatches to patterns, tracks, and clips.

export const FL_PALETTE_COLORS = [
  '#38bdf8', '#0ea5e9', '#2563eb', '#6366f1',
  '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e',
  '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#84cc16', '#22c55e', '#10b981', '#64748b'
];

export function renderFlRenameColorModal(target = {}) {
  const currentName = target.name || 'Untitled';
  const currentColor = target.color || '#38bdf8';
  const typeLabel = target.type ? target.type.toUpperCase() : 'ITEM';

  const swatchesHtml = FL_PALETTE_COLORS.map(c => `
    <button type="button" class="fl-color-swatch ${c.toLowerCase() === currentColor.toLowerCase() ? 'active' : ''}" style="background-color: ${c};" data-fl-swatch="${c}" aria-label="Color ${c}"></button>
  `).join('');

  return `
    <div class="fl-rc-modal-backdrop" id="fl-rc-modal-backdrop">
      <div class="fl-rc-dialog" role="dialog" aria-labelledby="fl-rc-title">
        <div class="fl-rc-header">
          <span class="fl-rc-badge">${typeLabel}</span>
          <strong id="fl-rc-title">Rename &amp; Color (F2)</strong>
          <button type="button" class="fl-rc-close" id="fl-rc-close" aria-label="Close dialog">X</button>
        </div>
        <div class="fl-rc-body">
          <div class="fl-rc-row">
            <label for="fl-rc-name-input">NAME</label>
            <input type="text" id="fl-rc-name-input" class="fl-rc-input" value="${currentName}" autofocus />
          </div>
          <div class="fl-rc-row">
            <label>PALETTE COLOR</label>
            <div class="fl-rc-palette" id="fl-rc-palette">
              ${swatchesHtml}
            </div>
          </div>
        </div>
        <div class="fl-rc-footer">
          <button type="button" class="fl-rc-btn cancel" id="fl-rc-cancel">CANCEL</button>
          <button type="button" class="fl-rc-btn apply" id="fl-rc-apply">ACCEPT</button>
        </div>
      </div>
    </div>
  `;
}
