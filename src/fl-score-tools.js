// FL Studio Score Tools (Zero Emojis)
// Features Piano Roll Strummer (Alt+S), Chopper (Alt+U), Randomizer (Alt+R), and Flam (Alt+F).

const PITCH_CLASSES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function parsePitchToMidi(pitch) {
  if (typeof pitch !== 'string') return 60;
  const match = pitch.trim().match(/^([A-Ga-g])([#b]?)(-?\d+)$/);
  if (!match) return 60;
  let [, letter, accidental, octaveStr] = match;
  letter = letter.toUpperCase();
  const octave = parseInt(octaveStr, 10);
  let semitone = PITCH_CLASSES.indexOf(letter);
  if (accidental === '#') semitone = (semitone + 1) % 12;
  else if (accidental === 'b') semitone = (semitone + 11) % 12;
  return (octave + 1) * 12 + semitone;
}

export function midiToPitch(midi) {
  const safeMidi = Math.max(0, Math.min(127, Math.round(midi)));
  const octave = Math.floor(safeMidi / 12) - 1;
  const semitone = safeMidi % 12;
  return `${PITCH_CLASSES[semitone]}${octave}`;
}

export function flStrumNotes(notes = [], { startOffset = 0.1, stroke = 'up', tension = 0, preserveEnd = false } = {}) {
  if (!Array.isArray(notes) || notes.length <= 1) return notes.map(n => ({ ...n }));

  // Sort notes by pitch
  const sorted = [...notes].sort((a, b) => {
    const midiA = parsePitchToMidi(a.n);
    const midiB = parsePitchToMidi(b.n);
    return stroke === 'down' ? midiB - midiA : midiA - midiB;
  });

  const baseStart = Math.min(...notes.map(n => n.x ?? 0));
  const baseEnd = Math.max(...notes.map(n => (n.x ?? 0) + (n.w ?? 1)));
  const count = sorted.length;

  return sorted.map((note, index) => {
    let t = count > 1 ? index / (count - 1) : 0;
    if (tension !== 0) {
      t = tension > 0 ? Math.pow(t, 1 + tension * 2) : 1 - Math.pow(1 - t, 1 - tension * 2);
    }
    const offset = index * startOffset;
    const newX = baseStart + offset;
    let newW = note.w ?? 1;
    if (preserveEnd) {
      newW = Math.max(0.125, baseEnd - newX);
    }
    return {
      ...note,
      x: Math.round(newX * 1000) / 1000,
      w: Math.round(newW * 1000) / 1000
    };
  });
}

export function flChopNotes(notes = [], { division = '1/16', pattern = 'straight', gate = 0.85, divisions = null } = {}) {
  if (!Array.isArray(notes)) return [];

  // Determine slice step width in 16th grid units
  let stepWidth = 1.0;
  if (divisions) {
    // If explicit division count passed
    stepWidth = null;
  } else if (division === '1/32') {
    stepWidth = 0.5;
  } else if (division === '1/16') {
    stepWidth = 1.0;
  } else if (division === '1/8') {
    stepWidth = 2.0;
  } else if (division === '1/4') {
    stepWidth = 4.0;
  }

  const result = [];

  for (const note of notes) {
    const origW = note.w ?? 1;
    const origX = note.x ?? 0;
    const count = stepWidth ? Math.max(1, Math.round(origW / stepWidth)) : Math.max(1, Math.round(divisions || 4));
    const sliceLen = stepWidth ? stepWidth : origW / count;
    const activeW = Math.round(sliceLen * (gate ?? 1.0) * 1000) / 1000;

    for (let i = 0; i < count; i++) {
      let pitch = note.n;
      if (pattern === 'arpeggio-up') {
        const rootMidi = parsePitchToMidi(note.n);
        const arpIntervals = [0, 3, 7, 10, 12, 15, 19, 22];
        pitch = midiToPitch(rootMidi + arpIntervals[i % arpIntervals.length]);
      } else if (pattern === 'arpeggio-down') {
        const rootMidi = parsePitchToMidi(note.n);
        const arpIntervals = [12, 10, 7, 3, 0];
        pitch = midiToPitch(rootMidi + arpIntervals[i % arpIntervals.length]);
      }

      result.push({
        ...note,
        id: `${note.id || 'chop'}-${i}-${Math.random().toString(36).slice(2, 5)}`,
        n: pitch,
        x: Math.round((origX + i * sliceLen) * 1000) / 1000,
        w: activeW
      });
    }
  }

  return result;
}

export function flRandomizeNotes(notes = [], { velAmount = 0.2, timeNudge = 0.05, pitchAmount = 0, velRange = null, timeRange = null, pitchRange = null } = {}) {
  if (!Array.isArray(notes)) return [];
  const vAmt = velRange !== null ? velRange : velAmount;
  const tAmt = timeRange !== null ? timeRange : timeNudge;
  const pAmt = pitchRange !== null ? pitchRange : pitchAmount;

  return notes.map(note => {
    let newV = note.v ?? 0.8;
    if (vAmt > 0) {
      newV = Math.max(0.1, Math.min(1.0, newV + (Math.random() * 2 - 1) * vAmt));
    }
    let newX = note.x ?? 0;
    if (tAmt > 0) {
      newX = Math.max(0, newX + (Math.random() * 2 - 1) * tAmt);
    }
    let newN = note.n;
    if (pAmt > 0) {
      const shift = Math.round((Math.random() * 2 - 1) * pAmt);
      const midi = parsePitchToMidi(note.n);
      newN = midiToPitch(midi + shift);
    }
    return {
      ...note,
      n: newN,
      v: Math.round(newV * 100) / 100,
      x: Math.round(newX * 1000) / 1000
    };
  });
}

export function flFlamNotes(notes = [], { count = 3, flamTime = 0.05, decay = 0.6, timeGap = null, velocityMult = null } = {}) {
  if (!Array.isArray(notes)) return [];
  const totalHits = Math.max(2, Math.round(count || 3));
  const tGap = timeGap !== null ? timeGap : flamTime;
  const decayRate = velocityMult !== null ? velocityMult : decay;
  const result = [];

  for (const note of notes) {
    const origX = note.x ?? 0;
    const origV = note.v ?? 0.8;

    // Grace hits occurring prior to the main hit
    for (let i = 0; i < totalHits - 1; i++) {
      const stepsBefore = totalHits - 1 - i;
      const graceX = Math.max(0, origX - stepsBefore * tGap);
      const graceV = Math.max(0.05, origV * Math.pow(decayRate, stepsBefore));
      result.push({
        ...note,
        id: `${note.id || 'note'}-grace-${i}-${Math.random().toString(36).slice(2, 5)}`,
        x: Math.round(graceX * 1000) / 1000,
        v: Math.round(graceV * 100) / 100,
        w: Math.min(note.w ?? 0.5, Math.max(0.125, tGap))
      });
    }

    // Primary hit
    result.push({
      ...note
    });
  }

  return result;
}

export function renderFlScoreModal(tool = 'strum', params = {}) {
  let title = 'FL Score Tool';
  let bodyHtml = '';

  if (tool === 'strum') {
    title = 'FL Strummer (Alt+S)';
    const offset = params.startOffset ?? 0.15;
    const stroke = params.stroke || 'up';
    const preserve = !!params.preserveEnd;
    bodyHtml = `
      <div class="fl-score-row">
        <label>STRUM TIME</label>
        <input type="range" min="0.01" max="0.5" step="0.01" value="${offset}" data-score-param="startOffset" class="fl-score-slider" />
        <span class="fl-score-val">${Math.round(offset * 1000)}ms</span>
      </div>
      <div class="fl-score-row">
        <label>STROKE DIRECTION</label>
        <div class="fl-score-toggle-group">
          <button type="button" class="fl-score-toggle-btn ${stroke === 'up' ? 'active' : ''}" data-score-opt="stroke:up">UP</button>
          <button type="button" class="fl-score-toggle-btn ${stroke === 'down' ? 'active' : ''}" data-score-opt="stroke:down">DOWN</button>
        </div>
      </div>
      <div class="fl-score-row checkbox-row">
        <label>
          <input type="checkbox" ${preserve ? 'checked' : ''} data-score-opt="preserveEnd:${!preserve}" />
          PRESERVE END
        </label>
      </div>
    `;
  } else if (tool === 'chop') {
    title = 'FL Chopper (Alt+U)';
    const div = params.division || '1/16';
    const pat = params.pattern || 'straight';
    bodyHtml = `
      <div class="fl-score-row">
        <label>TIME MULTIPLIER</label>
        <div class="fl-score-toggle-group">
          <button type="button" class="fl-score-toggle-btn ${div === '1/4' ? 'active' : ''}" data-score-opt="division:1/4">1/4</button>
          <button type="button" class="fl-score-toggle-btn ${div === '1/8' ? 'active' : ''}" data-score-opt="division:1/8">1/8</button>
          <button type="button" class="fl-score-toggle-btn ${div === '1/16' ? 'active' : ''}" data-score-opt="division:1/16">1/16</button>
          <button type="button" class="fl-score-toggle-btn ${div === '1/32' ? 'active' : ''}" data-score-opt="division:1/32">1/32</button>
        </div>
      </div>
      <div class="fl-score-row">
        <label>PATTERN MODE</label>
        <div class="fl-score-toggle-group">
          <button type="button" class="fl-score-toggle-btn ${pat === 'straight' ? 'active' : ''}" data-score-opt="pattern:straight">STRAIGHT</button>
          <button type="button" class="fl-score-toggle-btn ${pat === 'arpeggio-up' ? 'active' : ''}" data-score-opt="pattern:arpeggio-up">ARP UP</button>
        </div>
      </div>
    `;
  } else if (tool === 'randomize') {
    title = 'FL Randomizer (Alt+R)';
    const vel = params.velAmount ?? 0.2;
    const time = params.timeNudge ?? 0.05;
    bodyHtml = `
      <div class="fl-score-row">
        <label>VELOCITY RANGE</label>
        <input type="range" min="0" max="0.5" step="0.02" value="${vel}" data-score-param="velAmount" class="fl-score-slider" />
        <span class="fl-score-val">${Math.round(vel * 100)}%</span>
      </div>
      <div class="fl-score-row">
        <label>TIME SHIFT</label>
        <input type="range" min="0" max="0.2" step="0.01" value="${time}" data-score-param="timeNudge" class="fl-score-slider" />
        <span class="fl-score-val">${Math.round(time * 1000)}ms</span>
      </div>
    `;
  } else if (tool === 'flam') {
    title = 'FL Flam (Alt+F)';
    const gap = params.flamTime ?? 0.05;
    const decay = params.decay ?? 0.6;
    bodyHtml = `
      <div class="fl-score-row">
        <label>FLAM TIME</label>
        <input type="range" min="0.01" max="0.2" step="0.01" value="${gap}" data-score-param="flamTime" class="fl-score-slider" />
        <span class="fl-score-val">${Math.round(gap * 1000)}ms</span>
      </div>
      <div class="fl-score-row">
        <label>VELOCITY DECAY</label>
        <input type="range" min="0.1" max="1.0" step="0.05" value="${decay}" data-score-param="decay" class="fl-score-slider" />
        <span class="fl-score-val">${Math.round(decay * 100)}%</span>
      </div>
    `;
  }

  return `
    <div class="fl-score-modal-backdrop" id="fl-score-modal-backdrop">
      <div class="fl-score-dialog" role="dialog" aria-labelledby="fl-score-title">
        <div class="fl-score-header">
          <strong id="fl-score-title">${title}</strong>
          <button type="button" class="fl-score-close" id="fl-score-close" aria-label="Close dialog">X</button>
        </div>
        <div class="fl-score-body">
          ${bodyHtml}
        </div>
        <div class="fl-score-footer">
          <button type="button" class="fl-score-btn cancel" id="fl-score-cancel">CANCEL</button>
          <button type="button" class="fl-score-btn apply" id="fl-score-accept">ACCEPT</button>
        </div>
      </div>
    </div>
  `;
}
