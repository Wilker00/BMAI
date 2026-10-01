// FL Studio Time Markers System - Zero Emojis
// Supports timeline flags for Intro, Verse, Hook, Drop, Bridge, and Outro.
// Click flag to jump playhead; drag to reposition.

export function createTimelineMarker({ id = null, name = 'Marker', bar = 1, color = '#38bdf8' } = {}) {
  return {
    id: id || `tm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    name: String(name || 'Marker').trim(),
    bar: Math.max(1, Number(bar) || 1),
    color: color || '#38bdf8'
  };
}

export function defaultTimelineMarkers() {
  return [
    createTimelineMarker({ name: 'Intro', bar: 1, color: '#38bdf8' }),
    createTimelineMarker({ name: 'Drop', bar: 9, color: '#f43f5e' }),
    createTimelineMarker({ name: 'Outro', bar: 17, color: '#a855f7' })
  ];
}

export function renderTimelineMarkers(markers = [], totalBars = 32) {
  if (!Array.isArray(markers) || !markers.length) return '';
  const safeTotal = Math.max(1, Number(totalBars) || 32);
  const sorted = [...markers].sort((a, b) => a.bar - b.bar);

  return sorted.map(m => {
    const leftPct = Math.max(0, Math.min(100, ((m.bar - 1) / safeTotal) * 100)).toFixed(2);
    const color = m.color || '#38bdf8';
    return `
      <div class="fl-timeline-marker-flag" data-marker-id="${m.id}" data-marker-bar="${m.bar}" style="left: ${leftPct}%; border-color: ${color};" title="${m.name} (Bar ${m.bar}) - Click to jump, F2 to rename">
        <span class="fl-marker-stem" style="background-color: ${color};"></span>
        <span class="fl-marker-label" style="background-color: ${color};">${m.name}</span>
      </div>
    `;
  }).join('');
}
