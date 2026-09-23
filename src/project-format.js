const lanes = ['kick', 'snare', 'clap', 'hat', 'openhat', 'bass'];
const tracks = ['keys', 'drums', 'chords', 'vocals'];
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const fail = field => { throw new Error(`Invalid project: check ${field}.`); };
const number = (value, min, max, field, integer = false) => {
  if(typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) fail(field);
};

// Validate the whole document before replacing the current project. Older
// snapshots may omit optional fields; applySnapshot supplies their defaults.
export function validateProject(project, { keys = [], kits = [] } = {}) {
  if(!object(project) || !Array.isArray(project.pattern) || !object(project.drums)) fail('project structure');
  if(project.schemaVersion !== undefined && project.schemaVersion !== 1) fail('schema version');
  for(const field of ['name', 'description', 'prompt', 'instrument', 'chordInstrument']) {
    if(project[field] !== undefined && typeof project[field] !== 'string') fail(field);
  }
  if(project.key !== undefined && (typeof project.key !== 'string' || (keys.length && !keys.includes(project.key)))) fail('key');
  if(project.kit !== undefined && (typeof project.kit !== 'string' || (kits.length && !kits.includes(project.kit)))) fail('kit');
  if(project.meter !== undefined && project.meter !== '4/4' && project.meter !== '3/4' && project.meter !== '6/8') fail('meter');
  for(const [field, min, max, integer] of [['bpm',40,240], ['swing',0,60], ['idea',0,3,true], ['songSection',0,127,true]]) {
    if(project[field] !== undefined) number(project[field], min, max, field, integer);
  }
  const notes = list => {
    if(!Array.isArray(list) || list.length > 4096) fail('notes');
    for(const note of list) {
      if(!object(note) || !/^[A-G]#?[0-8]$/.test(note.n)) fail('note pitch');
      number(note.x, 0, 15, 'note position', true);
      number(note.w, 0.25, 16, 'note length');
      if(note.x + note.w > 16) fail('note end');
    }
  };
  notes(project.pattern);
  if(project.sectionPatterns !== undefined) {
    if(!object(project.sectionPatterns)) fail('section patterns');
    for(const [index, list] of Object.entries(project.sectionPatterns)) {
      if(!/^\d+$/.test(index) || Number(index) > 127) fail('section pattern index');
      notes(list);
    }
  }
  if(project.melodyDrafts !== undefined) {
    if(!Array.isArray(project.melodyDrafts) || project.melodyDrafts.length !== 4) fail('melody drafts');
    project.melodyDrafts.forEach(notes);
  }
  for(const lane of lanes) {
    const steps = project.drums[lane] || [];
    if(!Array.isArray(steps) || steps.length > 16) fail('drum steps');
    steps.forEach(step => number(step, 0, 15, 'drum position', true));
  }
  for(const field of ['drumMix','drumTrim','drumRolls','customSamples','customSampleAssets','mix','fx','eq','vocals','vocalRec']) {
    if(project[field] !== undefined && !object(project[field])) fail(field);
  }
  for(const field of ['customSamples','customSampleAssets']) {
    for(const [lane, value] of Object.entries(project[field] || {})) {
      if(!lanes.includes(lane) || typeof value !== 'string') fail(field);
    }
  }
  for(const [lane, value] of Object.entries(project.drumTrim || {})) {
    if(!lanes.includes(lane)) fail('drum trim lane');
    number(value, 0, 120, 'drum trim');
  }
  for(const [lane, rolls] of Object.entries(project.drumRolls || {})) {
    if(!lanes.includes(lane) || !object(rolls)) fail('drum rolls');
    for(const [step, count] of Object.entries(rolls)) {
      number(Number(step), 0, 15, 'roll position', true);
      number(count, 1, 16, 'roll count', true);
    }
  }
  for(const [field, ids, max] of [['mix',tracks,1.5], ['drumMix',lanes,2]]) {
    for(const [id, value] of Object.entries(project[field] || {})) {
      if(!ids.includes(id) || !object(value)) fail(field);
      if(value.vol !== undefined) number(value.vol, 0, max, `${field} volume`);
      if(value.pan !== undefined) number(value.pan, -1, 1, `${field} pan`);
      if(value.mute !== undefined && typeof value.mute !== 'boolean') fail(`${field} mute`);
      if(value.solo !== undefined && typeof value.solo !== 'boolean') fail(`${field} solo`);
    }
  }
  for(const [field, min, max] of [['eq',-24,24]]) {
    for(const value of Object.values(project[field] || {})) number(value, min, max, field);
  }
  for(const [name, value] of Object.entries(project.fx || {})) number(value, name === 'filter' ? -100 : 0, name === 'filter' ? 100 : 1, 'effects');
  if(project.chips !== undefined && (!Array.isArray(project.chips) || project.chips.some(chip => typeof chip !== 'string'))) fail('chips');
  if(project.chords !== undefined) {
    if(!object(project.chords) || !Array.isArray(project.chords.bars) || !project.chords.bars.length || project.chords.bars.length > 64 || project.chords.bars.some(chord => typeof chord !== 'string' || !/^[A-G][b#]?[a-zA-Z0-9+#()-]*$/.test(chord))) fail('chords');
  }
  if(project.chordVoice !== undefined){
    if(!object(project.chordVoice)) fail('chord voice');
    if(project.chordVoice.inversion !== undefined) number(project.chordVoice.inversion, 0, 2, 'chord inversion', true);
    if(project.chordVoice.octave !== undefined) number(project.chordVoice.octave, -1, 1, 'chord octave', true);
  }
  if(project.sections !== undefined) {
    if(!Array.isArray(project.sections) || project.sections.length > 128) fail('sections');
    let total = 0;
    for(const section of project.sections) {
      if(!object(section) || typeof section.name !== 'string' || !object(section.active)) fail('section');
      number(section.bars, 1, 64, 'section length', true);
      total += section.bars;
      if(Object.values(section.active).some(value => typeof value !== 'boolean')) fail('section tracks');
    }
    if(total > 256) fail('song length (maximum 256 bars)');
  }
  if(project.vocals?.url !== undefined && typeof project.vocals.url !== 'string') fail('vocal source');
  if(project.vocalTakes !== undefined) {
    if(!Array.isArray(project.vocalTakes) || project.vocalTakes.length > 64) fail('vocal takes');
    for(const take of project.vocalTakes) {
      if(!object(take) || typeof take.id !== 'string' || typeof take.title !== 'string' || typeof take.url !== 'string') fail('vocal take');
      number(take.start ?? 0, 0, 1, 'vocal take start');
      number(take.end ?? 1, 0, 1, 'vocal take end');
      if((take.end ?? 1) <= (take.start ?? 0)) fail('vocal take range');
      number(take.gain ?? 1, 0, 1.5, 'vocal take gain');
    }
  }
  return project;
}
