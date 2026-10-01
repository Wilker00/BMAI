import { parsePitchToMidi, midiToPitch } from './fl-score-tools.js';

export const CHORD_STAMPS = {
  maj: { name: 'Major', intervals: [0, 4, 7] },
  min: { name: 'Minor', intervals: [0, 3, 7] },
  dom7: { name: '7th (Dominant)', intervals: [0, 4, 7, 10] },
  maj7: { name: 'Major 7th', intervals: [0, 4, 7, 11] },
  min7: { name: 'Minor 7th', intervals: [0, 3, 7, 10] },
  min9: { name: 'Minor 9th', intervals: [0, 3, 7, 10, 14] },
  maj9: { name: 'Major 9th', intervals: [0, 4, 7, 11, 14] },
  sus2: { name: 'Sus2', intervals: [0, 2, 7] },
  sus4: { name: 'Sus4', intervals: [0, 5, 7] },
  dim: { name: 'Diminished', intervals: [0, 3, 6] },
  aug: { name: 'Augmented', intervals: [0, 4, 8] }
};

export function expandChordStamp(rootPitch, stampType) {
  const stamp = CHORD_STAMPS[stampType];
  if (!stamp) return [rootPitch];
  const rootMidi = parsePitchToMidi(rootPitch);
  return stamp.intervals.map(interval => midiToPitch(rootMidi + interval));
}

export function renderFlPianoRollTools(selectedNote = null, {
  isSlideMode = false,
  ghostChannel = 'chords',
  scaleHighlight = 'minor',
  chordStamp = 'none'
} = {}) {
  return `<div class="fl-piano-toolbar" role="toolbar" aria-label="FL Piano Roll Tools">
    <!-- Tool Icons -->
    <div class="fl-pr-tool-group">
      <button type="button" class="fl-pr-btn active" data-fl-pr-tool="draw" data-fl-hint="Draw tool (P): Click to place note, drag edges to resize" title="Draw (P)">DRAW</button>
      <button type="button" class="fl-pr-btn" data-fl-pr-tool="paint" data-fl-hint="Paint tool (B): Click and drag to brush repeated notes" title="Paint (B)">PAINT</button>
      <button type="button" class="fl-pr-btn" data-fl-pr-tool="delete" data-fl-hint="Delete tool (D): Click note to delete" title="Delete (D)">DEL</button>
      <button type="button" class="fl-pr-btn" data-fl-pr-tool="slice" data-fl-hint="Slice tool (C): Click across notes to cut them" title="Slice (C)">CUT</button>
      <button type="button" class="fl-pr-btn" data-fl-pr-tool="select" data-fl-hint="Select tool (E): Click and drag to box-select notes" title="Select (E)">SEL</button>
    </div>

    <div class="fl-pr-divider"></div>

    <!-- 808 Slide Note Toggle -->
    <div class="fl-pr-tool-group">
      <button type="button" class="fl-pr-slide-btn ${isSlideMode ? 'active' : ''}" id="fl-pr-slide-toggle" data-fl-hint="808 Slide Note: Notes placed while active will glide pitch smoothly (Trap/Drill 808s)">
        <span class="fl-slide-icon">◢</span>
        <span>Slide</span>
      </button>
    </div>

    <div class="fl-pr-divider"></div>

    <!-- Ghost Channels Selector -->
    <div class="fl-pr-tool-group">
      <span class="fl-pr-mini-label">GHOST:</span>
      <select class="fl-pr-select" id="fl-pr-ghost-select" data-fl-hint="Ghost Channels: View translucent notes from other tracks in background">
        <option value="off" ${ghostChannel === 'off' ? 'selected' : ''}>Off</option>
        <option value="chords" ${ghostChannel === 'chords' ? 'selected' : ''}>Chords</option>
        <option value="melody" ${ghostChannel === 'melody' ? 'selected' : ''}>Melody</option>
        <option value="bass" ${ghostChannel === 'bass' ? 'selected' : ''}>Bass</option>
      </select>
    </div>

    <div class="fl-pr-divider"></div>

    <!-- Scale Highlighting -->
    <div class="fl-pr-tool-group">
      <span class="fl-pr-mini-label">SCALE:</span>
      <select class="fl-pr-select" id="fl-pr-scale-select" data-fl-hint="Scale Highlighting: Highlight keys belonging to chosen musical scale">
        <option value="minor" ${scaleHighlight === 'minor' ? 'selected' : ''}>Natural Minor</option>
        <option value="major" ${scaleHighlight === 'major' ? 'selected' : ''}>Major</option>
        <option value="dorian" ${scaleHighlight === 'dorian' ? 'selected' : ''}>Dorian</option>
        <option value="phrygian" ${scaleHighlight === 'phrygian' ? 'selected' : ''}>Phrygian</option>
        <option value="pentatonic" ${scaleHighlight === 'pentatonic' ? 'selected' : ''}>Pentatonic</option>
      </select>
    </div>

    <div class="fl-pr-divider"></div>

    <!-- Chord Stamp Tool -->
    <div class="fl-pr-tool-group">
      <span class="fl-pr-mini-label">STAMP:</span>
      <select class="fl-pr-select" id="fl-pr-stamp-select" data-fl-hint="Chord Stamp Tool: Click to drop a full voiced chord instantly (Major, Minor, 7th, 9th, Sus)">
        <option value="none" ${chordStamp === 'none' ? 'selected' : ''}>Off (1 Note)</option>
        <option value="maj" ${chordStamp === 'maj' ? 'selected' : ''}>Major Triad</option>
        <option value="min" ${chordStamp === 'min' ? 'selected' : ''}>Minor Triad</option>
        <option value="dom7" ${chordStamp === 'dom7' ? 'selected' : ''}>7th (Dominant)</option>
        <option value="maj7" ${chordStamp === 'maj7' ? 'selected' : ''}>Major 7th</option>
        <option value="min7" ${chordStamp === 'min7' ? 'selected' : ''}>Minor 7th</option>
        <option value="min9" ${chordStamp === 'min9' ? 'selected' : ''}>Minor 9th</option>
        <option value="maj9" ${chordStamp === 'maj9' ? 'selected' : ''}>Major 9th</option>
        <option value="sus2" ${chordStamp === 'sus2' ? 'selected' : ''}>Sus2</option>
        <option value="sus4" ${chordStamp === 'sus4' ? 'selected' : ''}>Sus4</option>
        <option value="dim" ${chordStamp === 'dim' ? 'selected' : ''}>Diminished</option>
        <option value="aug" ${chordStamp === 'aug' ? 'selected' : ''}>Augmented</option>
      </select>
    </div>

    <div class="fl-pr-divider"></div>

    <!-- FL Signature Transformation Tools -->
    <div class="fl-pr-tool-group">
      <button type="button" class="fl-pr-action-btn" data-fl-pr-action="chop" data-fl-hint="Chop tool (Alt+A / Alt+U): Subdivide selected notes into trap rolls">
        <span>Chop</span>
      </button>
      <button type="button" class="fl-pr-action-btn" data-fl-pr-action="strum" data-fl-hint="Strum tool (Alt+S): Add natural guitar/keys micro-timing offsets to chords">
        <span>Strum</span>
      </button>
      <button type="button" class="fl-pr-action-btn" data-fl-pr-action="random" data-fl-hint="Randomizer / Humanizer (Alt+R): Humanize velocities and micro-groove">
        <span>Rnd</span>
      </button>
      <button type="button" class="fl-pr-action-btn" data-fl-pr-action="flam" data-fl-hint="Flam tool (Alt+F): Add grace note hit immediately preceding note">
        <span>Flam</span>
      </button>
      <button type="button" class="fl-pr-action-btn" data-fl-pr-action="quantize" data-fl-hint="Quick Quantize (Ctrl+Q): Snap notes strictly to grid">
        <span>Q</span>
      </button>
    </div>

    <div class="fl-pr-divider"></div>

    <!-- Pitch Transpose -->
    <div class="fl-pr-tool-group">
      <button type="button" class="fl-pr-pitch-btn" data-fl-pr-pitch="-12" data-fl-hint="Transpose Down 1 Octave (Ctrl+Down)">-12</button>
      <button type="button" class="fl-pr-pitch-btn" data-fl-pr-pitch="-1" data-fl-hint="Transpose Down 1 Semitone (Down)">-1</button>
      <button type="button" class="fl-pr-pitch-btn" data-fl-pr-pitch="1" data-fl-hint="Transpose Up 1 Semitone (Up)">+1</button>
      <button type="button" class="fl-pr-pitch-btn" data-fl-pr-pitch="12" data-fl-hint="Transpose Up 1 Octave (Ctrl+Up)">+12</button>
    </div>

    <!-- Note Info & Velocity readout -->
    <div class="fl-pr-note-info">
      ${selectedNote ? `
        <span class="fl-pr-note-badge ${selectedNote.slide ? 'is-slide' : ''}">
          ${selectedNote.slide ? '◢ ' : ''}${selectedNote.note || 'Note'}
        </span>
        <span class="fl-pr-vel-text">Vel: ${Math.round(selectedNote.velocity * 100)}%</span>
      ` : `<span class="fl-pr-vel-text">Select note to edit</span>`}
    </div>
  </div>`;
}

export function renderFlVelocityDrawer(notes = [], { totalSteps = 16, activeIndex = -1 } = {}) {
  return `<div class="fl-velocity-drawer" id="fl-velocity-drawer">
    <div class="fl-vel-drawer-header">
      <span class="fl-vel-title">Target: Note Velocity (1–127)</span>
      <span class="fl-vel-sub">Click/drag stalks to adjust hit intensity</span>
    </div>
    <div class="fl-vel-stalks-track">
      ${Array.from({ length: totalSteps }, (_, step) => {
        const stepNotes = notes.filter(n => Math.floor(n.x ?? n.step ?? 0) === step);
        const topNote = stepNotes[stepNotes.length - 1];
        const vel = topNote ? Math.max(0.05, Math.min(1.0, topNote.v ?? topNote.velocity ?? 0.8)) : 0;
        const heightPct = Math.round(vel * 100);
        const isBeatStart = step % 4 === 0;

        return `<div class="fl-vel-col ${isBeatStart ? 'beat-start' : ''}" data-step="${step}">
          ${topNote ? `
            <div class="fl-vel-stalk" style="height: ${heightPct}%" data-fl-hint="Step ${step + 1} Velocity: ${heightPct}%" data-step="${step}">
              <div class="fl-vel-cap"></div>
              <div class="fl-vel-line"></div>
            </div>
          ` : `<div class="fl-vel-empty"></div>`}
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

export function renderGhostNotesMarkup(ghostNotes = [], { totalSteps = 16, rowHeight = 20 } = {}) {
  if (!ghostNotes.length) return '';
  return `<div class="fl-ghost-notes-layer" aria-hidden="true">
    ${ghostNotes.map(n => {
      const step = n.x ?? n.step ?? 0;
      const width = n.w ?? n.length ?? 2;
      const leftPct = (step / totalSteps) * 100;
      const widthPct = (width / totalSteps) * 100;
      return `<div class="fl-ghost-note" style="left: ${leftPct}%; width: ${widthPct}%;" title="Ghost Note: ${n.n || 'Note'}">
        <span class="fl-ghost-label">${n.n || ''}</span>
      </div>`;
    }).join('')}
  </div>`;
}
