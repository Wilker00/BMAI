// Modern Compact DAW Playlist Picker Panel
// Features sleek pattern & audio clip selector, clean typography, compact rows, zero emojis.

export function renderFlPickerPanel(state, {
  activeTab = 'patterns', // 'patterns' or 'audio'
  activePatternId = null,
  searchFilter = ''
} = {}) {
  const drumPatterns = state.patterns?.drums || [];
  const melodyPatterns = state.patterns?.melody || [];
  const bassPatterns = state.patterns?.bass || [];
  const chordPatterns = state.patterns?.chords || [];

  const allPatterns = [
    ...drumPatterns.map(p => ({ ...p, kind: 'drums', label: p.name || 'Drums', color: '#38bdf8' })),
    ...melodyPatterns.map(p => ({ ...p, kind: 'melody', label: p.name || 'Melody', color: '#4ade80' })),
    ...bassPatterns.map(p => ({ ...p, kind: 'bass', label: p.name || 'Bass', color: '#a78bfa' })),
    ...chordPatterns.map(p => ({ ...p, kind: 'chords', label: p.progression?.name || p.name || 'Chords', color: '#f472b6' }))
  ];

  const audioTakes = (state.vocalTakes || []).map(t => ({
    id: t.id,
    label: t.title || 'Audio Take',
    color: '#fbbf24'
  }));

  const filteredPatterns = searchFilter
    ? allPatterns.filter(p => p.label.toLowerCase().includes(searchFilter.toLowerCase()))
    : allPatterns;

  const filteredAudio = searchFilter
    ? audioTakes.filter(a => a.label.toLowerCase().includes(searchFilter.toLowerCase()))
    : audioTakes;

  return `<aside class="fl-picker-panel" aria-label="Playlist Picker">
    <!-- Sleek Compact Header Tabs -->
    <div class="fl-picker-header">
      <div class="fl-picker-tabs">
        <button type="button" class="fl-picker-tab ${activeTab === 'patterns' ? 'active' : ''}" data-fl-picker-tab="patterns">
          PAT (${allPatterns.length})
        </button>
        <button type="button" class="fl-picker-tab ${activeTab === 'audio' ? 'active' : ''}" data-fl-picker-tab="audio">
          AUDIO (${audioTakes.length})
        </button>
      </div>
      <button type="button" class="fl-picker-add-btn" id="fl-picker-new-pat" title="Create new pattern (F4)">+ PAT</button>
    </div>

    <!-- Search filter bar -->
    <div class="fl-picker-search">
      <input type="text" class="fl-picker-input" id="fl-picker-search-input" placeholder="Search clips..." value="${searchFilter}" />
    </div>

    <!-- Clips List Strip -->
    <div class="fl-picker-list">
      ${activeTab === 'patterns' ? (
        filteredPatterns.length ? filteredPatterns.map(pat => {
          const isSelected = pat.id === (activePatternId || state.activePatternIds?.[pat.kind]);
          return `<button type="button" class="fl-picker-item ${isSelected ? 'selected' : ''}" data-picker-pattern-id="${pat.id}" data-picker-kind="${pat.kind}" title="Click to stamp ${pat.label} onto playlist">
            <span class="fl-picker-color-tag" style="background: ${pat.color}"></span>
            <span class="fl-picker-item-name">${pat.label}</span>
            <span class="fl-picker-bars">${pat.bars || 1}B</span>
          </button>`;
        }).join('') : `<div class="fl-picker-empty">No patterns found</div>`
      ) : (
        filteredAudio.length ? filteredAudio.map(aud => {
          return `<button type="button" class="fl-picker-item" data-picker-audio-id="${aud.id}" title="Click to place ${aud.label} onto playlist">
            <span class="fl-picker-color-tag" style="background: ${aud.color}"></span>
            <span class="fl-picker-item-name">${aud.label}</span>
            <span class="fl-picker-bars">WAV</span>
          </button>`;
        }).join('') : `<div class="fl-picker-empty">No audio clips loaded</div>`
      )}
    </div>

    <!-- Footer Quick Actions -->
    <div class="fl-picker-footer">
      <button type="button" class="fl-picker-action-btn" id="fl-picker-clone-pat" title="Clone current pattern">CLONE</button>
      <button type="button" class="fl-picker-action-btn" id="fl-picker-split-pat" title="Split pattern by channel">SPLIT</button>
      <button type="button" class="fl-picker-action-btn" id="fl-picker-rename-pat" title="Rename active pattern">RENAME</button>
    </div>
  </aside>`;
}
