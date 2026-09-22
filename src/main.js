import './style.css';
import './library.css';
import './workspace.css';
import './pages.css';
import './visibility-fixes.css';
import './responsive.css';
import * as Tone from 'tone';

function publicUrl(url) {
  if (!url || /^(blob:|data:|https?:)/.test(url)) return url;
  if (url.startsWith('/')) return `${import.meta.env.BASE_URL}${url.slice(1)}`;
  return url;
}

const notes = ['C6','B5','A#5','A5','G#5','G5','F#5','F5','E5','D#5','D5','C#5','C5','B4','A#4','A4','G#4','G4','F#4','F4','E4','D#4','D4','C#4','C4','B3','A#3','A3','G#3','G3','F#3','F3','E3','D#3','D3','C#3','C3'];
const white = n => !n.includes('#');
const lanes = ['kick','snare','clap','hat','openhat','bass'];
const views = ['home','melody','drums','chords','vocals','mix','export','settings'];
let qwertyOctave = 4;

const allKeys = [
  'A minor','E minor','B minor','F# minor','C# minor','G# minor','Eb minor','Bb minor','F minor','C minor','G minor','D minor',
  'C major','G major','D major','A major','E major','B major','F# major','Db major','Ab major','Eb major','Bb major','F major'
];

const chordTones = {
  Am:['A3','C4','E4'], Am7:['A3','C4','E4','G4'], Am9:['A3','C4','E4','G4','B4'],
  Em:['E3','G3','B3'], Em7:['E3','G3','B3','D4'], Em9:['E3','G3','B3','D4','F#4'],
  F:['F3','A3','C4'], Fmaj7:['F3','A3','C4','E4'], Fmaj9:['F3','A3','C4','E4','G4'],
  C:['C3','E3','G3'], Cmaj7:['C3','E3','G3','B3'], Cmaj9:['C3','E3','G3','B3','D4'], C7:['C3','E3','G3','A#3'],
  G:['G3','B3','D4'], G7:['G3','B3','D4','F4'], G13:['G3','B3','D4','F4','E4'], Gmaj7:['G3','B3','D4','F#4'], Gmaj9:['G3','B3','D4','F#4','A4'],
  Dm:['D3','F3','A3'], Dm7:['D3','F3','A3','C4'], Dm9:['D3','F3','A3','C4','E4'],
  Gm:['G3','A#3','D4'], Gm7:['G3','A#3','D4','F4'], Gm9:['G3','A#3','D4','F4','A4'],
  Bb:['A#3','D4','F4'], Bbmaj7:['A#3','D4','F4','A4'], Bbmaj9:['A#3','D4','F4','A4','C5'], Bbm:['A#3','C#4','F4'], Bbm7:['A#3','C#4','F4','G#4'], Bbm9:['A#3','C#4','F4','G#4','C5'],
  Bm:['B3','D4','F#4'], Bm7:['B3','D4','F#4','A4'], Bm9:['B3','D4','F#4','A4','C#5'], B:['B3','D#4','F#4'], Bmaj7:['B3','D#4','F#4','A#4'], Bmaj9:['B3','D#4','F#4','A#4','C#5'],
  D:['D3','F#3','A3'], Dmaj7:['D3','F#3','A3','C#4'], Dmaj9:['D3','F#3','A3','C#4','E4'], D7:['D3','F#3','A3','C4'], D9:['D3','F#3','A3','C4','E4'],
  A:['A3','C#4','E4'], Amaj7:['A3','C#4','E4','G#4'], Amaj9:['A3','C#4','E4','G#4','B4'], A7:['A3','C#4','E4','G4'], A9:['A3','C#4','E4','G4','B4'],
  E:['E3','G#3','B3'], Emaj7:['E3','G#3','B3','D#4'], Emaj9:['E3','G#3','B3','D#4','F#4'], E7:['E3','G#3','B3','D4'], E9:['E3','G#3','B3','D4','F#4'],
  'F#m':['F#3','A3','C#4'], 'F#m7':['F#3','A3','C#4','E4'], 'F#m9':['F#3','A3','C#4','E4','G#4'],
  'F#':['F#3','A#3','C#4'], 'F#maj7':['F#3','A#3','C#4','F4'], 'F#maj9':['F#3','A#3','C#4','F4','G#4'], 'F#7':['F#3','A#3','C#4','E4'], 'F#9':['F#3','A#3','C#4','E4','G#4'],
  'C#m':['C#3','E3','G#3'], 'C#m7':['C#3','E3','G#3','B3'], 'C#m9':['C#3','E3','G#3','B3','D#4'],
  'C#':['C#3','F3','G#3'], 'C#maj7':['C#3','F3','G#3','C4'], 'C#7':['C#3','F3','G#3','B3'],
  'G#m':['G#3','B3','D#4'], 'G#m7':['G#3','B3','D#4','F#4'], 'G#m9':['G#3','B3','D#4','F#4','A#4'],
  'D#m':['D#3','F#3','A#3'], 'D#m7':['D#3','F#3','A#3','C#4'],
  'Ebm':['D#3','F#3','A#3'], 'Ebm7':['D#3','F#3','A#3','C#4'], 'Ebm9':['D#3','F#3','A#3','C#4','F4'],
  'Abm':['G#3','B3','D#4'], 'Abm7':['G#3','B3','D#4','F#4'], 'Abm9':['G#3','B3','D#4','F#4','A#4'],
  'Db':['C#3','F3','G#3'], 'Dbmaj7':['C#3','F3','G#3','C4'], 'Dbmaj9':['C#3','F3','G#3','C4','D#4'], 'Db7':['C#3','F3','G#3','B3'], 'Db9':['C#3','F3','G#3','B3','D#4'],
  'Gb':['F#3','A#3','C#4'], 'Gbmaj7':['F#3','A#3','C#4','F4'],
  'Ab':['G#3','C4','D#4'], 'Abmaj7':['G#3','C4','D#4','G4'], 'Abmaj9':['G#3','C4','D#4','G4','A#4'], 'Ab7':['G#3','C4','D#4','F#4'], 'Ab9':['G#3','C4','D#4','F#4','A#4'],
  'Eb':['D#3','G3','A#3'], 'Ebmaj7':['D#3','G3','A#3','D4'], 'Ebmaj9':['D#3','G3','A#3','D4','F4'], 'Eb7':['D#3','G3','A#3','C#4'], 'Eb9':['D#3','G3','A#3','C#4','F4'],
  'Fm':['F3','G#3','C4'], 'Fm7':['F3','G#3','C4','D#4'], 'Fm9':['F3','G#3','C4','D#4','G4'],
  'Cm':['C3','D#3','G3'], 'Cm7':['C3','D#3','G3','A#3'], 'Cm9':['C3','D#3','G3','A#3','D4']
};

function getChordNotes(chord) {
  if (chordTones[chord]) return chordTones[chord];
  const m = String(chord).match(/^([A-G][b#]?)(.*)$/);
  if (!m) return ['C4', 'E4', 'G4'];
  const root = m[1];
  const type = m[2];
  const scale = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const flatToSharp = { 'Db':'C#', 'Eb':'D#', 'Gb':'F#', 'Ab':'G#', 'Bb':'A#' };
  const normRoot = flatToSharp[root] || root;
  const rootIdx = scale.indexOf(normRoot);
  if (rootIdx < 0) return ['C4', 'E4', 'G4'];
  const isMinor = type.startsWith('m') && !type.startsWith('maj');
  const isMaj7 = type.includes('maj');
  const is7 = type.includes('7') || type.includes('9') || type.includes('13');
  const thirdInterval = isMinor ? 3 : 4;
  const fifthInterval = 7;
  const seventhInterval = isMaj7 ? 11 : (is7 ? 10 : null);
  const res = [scale[rootIdx] + '3', scale[(rootIdx + thirdInterval) % 12] + '4', scale[(rootIdx + fifthInterval) % 12] + '4'];
  if (seventhInterval !== null) res.push(scale[(rootIdx + seventhInterval) % 12] + '4');
  return res;
}

const progressions = {
  'A minor':[
    {name:'Moonlit', bars:['Am7','Fmaj7','Cmaj7','G'], feel:'Warm late-night lift'},
    {name:'Velvet', bars:['Am','Em','F','G'], feel:'Sparse and open'},
    {name:'Afterglow', bars:['Am9','Dm9','G13','Cmaj7'], feel:'Soft color around the vocal'},
    {name:'Extended 2-Bar Lift', bars:['Am7','Dm7','G7','Cmaj7','Fmaj7','Bm7','E7','Am7'], feel:'Neo-Soul 2-bar cycle'}
  ],
  'E minor':[
    {name:'Midnight', bars:['Em7','Cmaj7','Gmaj7','D'], feel:'Grounded nocturnal pulse'},
    {name:'Solitude', bars:['Em','Bm','C','D'], feel:'Deep and reflective'},
    {name:'Aurora', bars:['Em9','Am9','D9','Gmaj7'], feel:'Lush harmonic motion'},
    {name:'Deep Orbit (2 Bars)', bars:['Em7','Am7','D7','Gmaj7','Cmaj7','F#m7','B7','Em7'], feel:'Extended melodic drive'}
  ],
  'B minor':[
    {name:'Nightfall', bars:['Bm7','Gmaj7','Dmaj7','A'], feel:'Cinematic chill'},
    {name:'Drift', bars:['Bm','F#m','G','A'], feel:'Spacious wave'},
    {name:'Cold Wave', bars:['Bm9','Em9','A9','Dmaj7'], feel:'Modern synthwave warmth'}
  ],
  'F# minor':[
    {name:'Neon Shadow', bars:['F#m7','Dmaj7','Amaj7','E'], feel:'Dark pop drive'},
    {name:'Echoes', bars:['F#m','C#m','D','E'], feel:'Moody electronic space'},
    {name:'Purple Haze', bars:['F#m9','Bm9','E9','Amaj7'], feel:'Lofi guitar bed'}
  ],
  'C# minor':[
    {name:'Dark Sunset', bars:['C#m7','Amaj7','Emaj7','B'], feel:'Emotional late-night'},
    {name:'Solace', bars:['C#m','G#m','A','B'], feel:'Warm club soul'},
    {name:'Silk Night', bars:['C#m9','F#m9','B9','Emaj7'], feel:'Lush trap soul'}
  ],
  'G# minor':[
    {name:'Dusk', bars:['G#m7','Emaj7','Bmaj7','F#'], feel:'Melancholic beauty'},
    {name:'Silhouette', bars:['G#m','D#m','E','F#'], feel:'Deep house groove'},
    {name:'Nocturne', bars:['G#m9','C#m9','F#9','Bmaj7'], feel:'Polished R&B'}
  ],
  'Eb minor':[
    {name:'Deep Soul', bars:['Ebm7','Bmaj7','Gbmaj7','Db'], feel:'Smooth neo-soul'},
    {name:'Late Night', bars:['Ebm','Bbm','B','Db'], feel:'Sub-heavy trap bed'},
    {name:'Cloud Nine', bars:['Ebm9','Abm9','Db9','Gbmaj7'], feel:'Floating silk'}
  ],
  'Bb minor':[
    {name:'Haze', bars:['Bbm7','Gbmaj7','Dbmaj7','Ab'], feel:'Dark cinematic beat'},
    {name:'Slow Burn', bars:['Bbm','Fm','Gb','Ab'], feel:'Raw urban mood'},
    {name:'Underground', bars:['Bbm9','Ebm9','Ab9','Dbmaj7'], feel:'Deep pocket'}
  ],
  'F minor':[
    {name:'Shadows', bars:['Fm7','Dbmaj7','Abmaj7','Eb'], feel:'Grounded emotion'},
    {name:'Grit', bars:['Fm','Cm','Db','Eb'], feel:'Heavy and driving'},
    {name:'Atmosphere', bars:['Fm9','Bbm9','Eb9','Abmaj7'], feel:'Silky and expansive'}
  ],
  'C minor':[
    {name:'Metro', bars:['Cm7','Abmaj7','Ebmaj7','Bb'], feel:'Hip hop anthem bed'},
    {name:'Low Pulse', bars:['Cm','Gm','Ab','Bb'], feel:'Grounded club soul'},
    {name:'Late Drive', bars:['Cm9','Fm9','Bb9','Ebmaj7'], feel:'Modern jazz chords'}
  ],
  'G minor':[
    {name:'Smoke', bars:['Gm7','Ebmaj7','Bbmaj7','F'], feel:'Smoky lounge vibe'},
    {name:'Amber', bars:['Gm','Dm','Eb','F'], feel:'Warm and forward'},
    {name:'Soulful', bars:['Gm9','Cm9','F9','Bbmaj7'], feel:'Classic vinyl progression'}
  ],
  'D minor':[
    {name:'Low room', bars:['Dm7','Bbmaj7','Fmaj7','C'], feel:'Moody and grounded'},
    {name:'Drive', bars:['Dm','Am','Bb','C'], feel:'Forward without crowding'},
    {name:'Smoke', bars:['Dm9','Gm7','C7','Fmaj7'], feel:'Darker color for a hook'},
    {name:'Velvet Loop (2 Bars)', bars:['Dm7','Gm7','C7','Fmaj7','Bbmaj7','Em7','A7','Dm7'], feel:'Extended soul journey'}
  ],
  'C major':[
    {name:'Daylight', bars:['Cmaj7','Am7','Fmaj7','G'], feel:'Clear pop bed'},
    {name:'Easy', bars:['C','G','Am','F'], feel:'Straight and singable'},
    {name:'Glass', bars:['Cmaj9','Am7','Dm7','G7'], feel:'Bright with a little air'},
    {name:'Golden Horizon (2 Bars)', bars:['Cmaj7','Fmaj7','Dm7','G7','Em7','Am7','Dm7','G7'], feel:'Lush 2-bar pop journey'}
  ],
  'G major':[
    {name:'Sunrise', bars:['Gmaj7','Em7','Cmaj7','D'], feel:'Uplifting golden morning'},
    {name:'Golden', bars:['G','D','Em','C'], feel:'Pure singalong warmth'},
    {name:'Breeze', bars:['Gmaj9','Em7','Am7','D7'], feel:'Airy indie pop'}
  ],
  'D major':[
    {name:'Radiance', bars:['Dmaj7','Bm7','Gmaj7','A'], feel:'Open sky and brightness'},
    {name:'Open Sky', bars:['D','A','Bm','G'], feel:'Driving energetic groove'},
    {name:'Coast', bars:['Dmaj9','Bm7','Em7','A7'], feel:'Smooth summer breeze'}
  ],
  'A major':[
    {name:'Warm Glow', bars:['Amaj7','F#m7','Dmaj7','E'], feel:'Vibrant optimism'},
    {name:'Shine', bars:['A','E','F#m','D'], feel:'Straightforward and joyful'},
    {name:'Paradise', bars:['Amaj9','F#m7','Bm7','E7'], feel:'Lush tropical air'}
  ],
  'E major':[
    {name:'Euphoria', bars:['Emaj7','C#m7','Amaj7','B'], feel:'Sparkling brightness'},
    {name:'Vibrant', bars:['E','B','C#m','A'], feel:'Uplifting pulse'},
    {name:'Luminescence', bars:['Emaj9','C#m7','F#m7','B7'], feel:'Smooth vocal support'}
  ],
  'B major':[
    {name:'Crystal', bars:['Bmaj7','G#m7','Emaj7','F#'], feel:'Glistening clarity'},
    {name:'Clear', bars:['B','F#','G#m','E'], feel:'Crisp modern pop'},
    {name:'Horizon', bars:['Bmaj9','G#m7','C#m7','F#7'], feel:'Rich extended color'}
  ],
  'F# major':[
    {name:'Sunset Sky', bars:['F#maj7','D#m7','Bmaj7','C#'], feel:'Warm golden hue'},
    {name:'Gleam', bars:['F#','C#','D#m','B'], feel:'Forward melodic motion'},
    {name:'Prism', bars:['F#maj9','D#m7','G#m7','C#7'], feel:'Pastel electronic sheen'}
  ],
  'Db major':[
    {name:'Velvet Rose', bars:['Dbmaj7','Bbm7','Gbmaj7','Ab'], feel:'Lush neo-soul warmth'},
    {name:'Warm Sand', bars:['Db','Ab','Bbm','Gb'], feel:'Smooth sunset chords'},
    {name:'Moonflower', bars:['Dbmaj9','Bbm7','Ebm7','Ab7'], feel:'Rich romantic R&B'}
  ],
  'Ab major':[
    {name:'Pastel', bars:['Abmaj7','Fm7','Dbmaj7','Eb'], feel:'Gentle soul bed'},
    {name:'Sweet Melancholy', bars:['Ab','Eb','Fm','Db'], feel:'Intimate and warm'},
    {name:'Opal', bars:['Abmaj9','Fm7','Bbm7','Eb7'], feel:'Lush bedroom pop'}
  ],
  'Eb major':[
    {name:'Lush Bloom', bars:['Ebmaj7','Cm7','Abmaj7','Bb'], feel:'Grand and uplifting'},
    {name:'Pure Bliss', bars:['Eb','Bb','Cm','Ab'], feel:'Bright pop foundation'},
    {name:'Velvet Skyline', bars:['Ebmaj9','Cm7','Fm7','Bb7'], feel:'Smooth jazz chords'}
  ],
  'Bb major':[
    {name:'Smooth Coast', bars:['Bbmaj7','Gm7','Ebmaj7','F'], feel:'Relaxed easy soul'},
    {name:'Golden Hour', bars:['Bb','F','Gm','Eb'], feel:'Warm and grounded'},
    {name:'Airflow', bars:['Bbmaj9','Gm7','Cm7','F7'], feel:'Crisp radio sheen'}
  ],
  'F major':[
    {name:'Soft gold', bars:['Fmaj7','Dm7','Gm7','C'], feel:'Warm R&B bed'},
    {name:'Open road', bars:['F','C','Dm','Bb'], feel:'Simple and wide'},
    {name:'Silk', bars:['Fmaj9','Dm9','Gm7','C7'], feel:'Lush support under a lead'},
    {name:'Velvet Coast (2 Bars)', bars:['Fmaj7','Dm7','Gm7','C7','Am7','Dm7','Gm7','C7'], feel:'Extended soul bed'}
  ]
};

const kitNames = {rnb:'R&B', house:'House', trap:'Trap', dnb:'Drum & bass', acoustic:'Acoustic', dj:'DJ Set'};
const sessionKits = {
  rnb:{
    kick:'/sounds/0x808/909/kick-2.wav',
    snare:'/sounds/0x808/909/snare.wav',
    clap:'/sounds/0x808/909/clap2.wav',
    hat:'/sounds/0x808/909/hihat-closed-1.wav',
    openhat:'/sounds/0x808/909/hihat-open-1.wav',
    bass:'/sounds/0x808/808-synth/808-sub-kick-short.wav',
    blurb:'R&B · 909 pocket',
    steps:{kick:[0,7,10,14],snare:[4,12],clap:[4,12],hat:[0,2,4,6,8,10,12,14],openhat:[2,10],bass:[0,10]}
  },
  house:{
    kick:'/sounds/stargate/fugue-state-audio/drums/kicks/synthkit-kick.wav',
    snare:'/sounds/stargate/fugue-state-audio/drums/snares/synthkit-snare.wav',
    clap:'/sounds/stargate/fugue-state-audio/drums/claps/synthkit-clap.wav',
    hat:'/sounds/stargate/karoryfer/hihats/hihat_BRD_tight.wav',
    openhat:'/sounds/stargate/karoryfer/hihats/hihat_BRD_open.wav',
    bass:'/sounds/stargate/fugue-state-audio/drums/kicks/sdbkit-sub-a.wav',
    blurb:'House · studio kit',
    steps:{kick:[0,4,8,12],snare:[4,12],clap:[4,12],hat:[2,6,10,14],openhat:[2,10],bass:[0,6,8,14]}
  },
  trap:{
    kick:'/sounds/0x808/trap-808/kick.wav',
    snare:'/sounds/0x808/trap-808/snare.wav',
    clap:'/sounds/0x808/trap-808/clap.wav',
    hat:'/sounds/0x808/trap-808/hihat-closed.wav',
    openhat:'/sounds/0x808/trap-808/hihat-open.wav',
    bass:'/sounds/0x808/808-synth/808-sub-kick-long.wav',
    blurb:'Trap · deep 808',
    steps:{kick:[0,6,11,14],snare:[4,12],clap:[4,12],hat:[0,2,4,6,7,8,10,12,14,15],openhat:[2,10],bass:[0,8,14]}
  },
  dnb:{
    kick:'/sounds/stargate/fugue-state-audio/drums/kicks/distkit-kick.wav',
    snare:'/sounds/0x808/linndrum/snare-h.wav',
    clap:'/sounds/0x808/linndrum/clap.wav',
    hat:'/sounds/stargate/karoryfer/hihats/hihat_BRD_closed.wav',
    openhat:'/sounds/stargate/fugue-state-audio/drums/hihats/distkit-hatopen.wav',
    bass:'/sounds/0x808/808-synth/808-sub-kick.wav',
    blurb:'Drum & bass · broken kit',
    steps:{kick:[0,7,10],snare:[4,12],clap:[12],hat:[0,2,4,6,8,10,12,14],openhat:[6,14],bass:[0,6,10,14]}
  },
  acoustic:{
    kick:'/sounds/stargate/karoryfer/kicks/kick_Szpaderski_24_open.wav',
    snare:'/sounds/stargate/karoryfer/snares/snare_Pearl_alumunum_14x8.wav',
    clap:'/sounds/stargate/freesound/drums/clap/493707__bastianpusch__handclap01.wav',
    hat:'/sounds/stargate/karoryfer/hihats/hihat_BRD_closed.wav',
    openhat:'/sounds/stargate/karoryfer/hihats/hihat_BRD_open.wav',
    bass:'/sounds/0x808/808-synth/808-sub-kick-short.wav',
    blurb:'Acoustic · recorded kit',
    steps:{kick:[0,8,10],snare:[4,12],clap:[4,12],hat:[0,2,4,6,8,10,12,14],openhat:[10],bass:[0,8]}
  },
  dj:{
    kick:'/sounds/0x808/808-synth/808-sub-kick-long.wav',
    snare:'/sounds/sonic-pi/vinyl_scratch.flac',
    clap:'/sounds/0x808/percussion/clap.wav',
    hat:'/sounds/sonic-pi/vinyl_backspin.flac',
    openhat:'/sounds/0x808/909/hihat-open-2.wav',
    bass:'/sounds/0x808/trap-808/perc-sub.wav',
    blurb:'DJ Set · Scratches & 808',
    steps:{kick:[0,6,10],snare:[4,12],clap:[4,12],hat:[2,6,10,14],openhat:[10],bass:[0,8,14]}
  }
};
const starterKit = {kick:'',snare:'',clap:'',hat:'',openhat:'',bass:''};
const defaultMix = () => ({keys:{mute:false,vol:.8},drums:{mute:false,vol:.75},chords:{mute:false,vol:.5},vocals:{mute:false,vol:.7}});
const defaultDrums = () => ({
  kick:new Set([0,6,8,11,14]),
  snare:new Set([4,12]),
  clap:new Set([4,12]),
  hat:new Set([0,2,4,6,8,10,12,14]),
  openhat:new Set([2,10]),
  bass:new Set([0,8])
});

function esc(value){return String(value??'').replace(/[&<>"']/g,c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));}
function loadProject(){try{return JSON.parse(localStorage.getItem('bmai-project'))}catch{return null}}
const saved = loadProject();

const state = {
  view: views.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'home',
  id: saved?.id || crypto.randomUUID(),
  name: saved?.name || 'Untitled idea',
  description: saved?.description || '',
  bpm: saved?.bpm || 92,
  key: saved?.key || 'A minor',
  prompt: saved?.prompt || 'late-night R&B, warm and a little dark',
  chips: saved?.chips || ['R&B','Dark'],
  pattern: Array.isArray(saved?.pattern) ? saved.pattern.map(note=>({...note})) : [],
  kit: sessionKits[saved?.kit] ? saved.kit : 'rnb',
  drums: defaultDrums(),
  drumRolls: saved?.drumRolls || {},
  drumMix: saved?.drumMix || {
    kick: { vol: 1, pan: 0 },
    snare: { vol: 1, pan: 0 },
    clap: { vol: 1, pan: 0 },
    hat: { vol: 1, pan: 0 },
    openhat: { vol: 1, pan: 0 },
    bass: { vol: 1, pan: 0 }
  },
  chords: saved?.chords || progressions['A minor'][0],
  chordAdded: !!saved?.chordAdded,
  vocals: saved?.vocals || {title:'Soft hook',line:'keep the night close, don’t say it loud',chain:'Modern R&B'},
  vocalAdded: !!saved?.vocalAdded,
  idea: 0,
  instrument: saved?.instrument || 'rhodes',
  swing: saved?.swing !== undefined ? Number(saved.swing) : 18,
  mix: saved?.mix || defaultMix(),
  drumsAdded: !!saved?.drumsAdded,
  melodyAdded: saved?.melodyAdded != null ? !!saved.melodyAdded : !!(saved?.pattern?.length),
  drumPunch: saved?.drumPunch !== false,
  customSamples: saved?.customSamples || { kick: '', snare: '', clap: '', hat: '', openhat: '', bass: '' },
  fx: saved?.fx || { reverb: 0.22, delay: 0.15, filter: 0 },
  eq: saved?.eq || { low: 0, mid: 0, high: 0 },
  masterLimiter: saved?.masterLimiter !== false,
  sidechain: saved?.sidechain !== false,
  bassTuned: saved?.bassTuned !== false,
  songMode: !!saved?.songMode,
  songSection: saved?.songSection || 0,
  sections: saved?.sections || [
    { name: 'Intro', bars: 1, active: { keys: true, drums: false, chords: true, vocals: false } },
    { name: 'Verse', bars: 2, active: { keys: true, drums: true, chords: true, vocals: false } },
    { name: 'Hook', bars: 2, active: { keys: true, drums: true, chords: true, vocals: true } },
    { name: 'Outro', bars: 1, active: { keys: true, drums: false, chords: true, vocals: false } }
  ]
};
if (saved?.drums) {
  for (const lane of lanes) state.drums[lane] = new Set(saved.drums[lane] || []);
}

const chordRoots = {
  Am: 55.0, Am7: 55.0, Am9: 55.0,
  Em: 41.2, Em7: 41.2, Em9: 41.2,
  F: 43.65, Fmaj7: 43.65, Fmaj9: 43.65,
  C: 65.41, Cmaj7: 65.41, Cmaj9: 65.41, C7: 65.41,
  G: 49.0, G7: 49.0, G13: 49.0, Gmaj7: 49.0, Gmaj9: 49.0,
  Dm: 73.42, Dm7: 73.42, Dm9: 73.42,
  Gm: 49.0, Gm7: 49.0, Gm9: 49.0,
  Bb: 58.27, Bbmaj7: 58.27, Bbmaj9: 58.27, Bbm: 58.27, Bbm7: 58.27, Bbm9: 58.27,
  Bm: 61.74, Bm7: 61.74, Bm9: 61.74, B: 61.74, Bmaj7: 61.74, Bmaj9: 61.74,
  D: 73.42, Dmaj7: 73.42, Dmaj9: 73.42, D7: 73.42, D9: 73.42,
  A: 55.0, Amaj7: 55.0, Amaj9: 55.0, A7: 55.0, A9: 55.0,
  E: 41.2, Emaj7: 41.2, Emaj9: 41.2, E7: 41.2, E9: 41.2,
  'F#m': 46.25, 'F#m7': 46.25, 'F#m9': 46.25, 'F#': 46.25, 'F#maj7': 46.25, 'F#maj9': 46.25, 'F#7': 46.25, 'F#9': 46.25,
  'C#m': 69.30, 'C#m7': 69.30, 'C#m9': 69.30, 'C#': 69.30, 'C#maj7': 69.30, 'C#7': 69.30,
  'G#m': 51.91, 'G#m7': 51.91, 'G#m9': 51.91, 'G#': 51.91, 'G#maj7': 51.91,
  'D#m': 77.78, 'D#m7': 77.78, 'Eb': 77.78, 'Ebmaj7': 77.78, 'Ebmaj9': 77.78, 'Ebm': 77.78, 'Ebm7': 77.78, 'Ebm9': 77.78, 'Eb7': 77.78, 'Eb9': 77.78,
  'Ab': 51.91, 'Abmaj7': 51.91, 'Abmaj9': 51.91, 'Abm': 51.91, 'Abm7': 51.91, 'Ab7': 51.91, 'Ab9': 51.91,
  'Db': 69.30, 'Dbmaj7': 69.30, 'Dbmaj9': 69.30, 'Db7': 69.30, 'Db9': 69.30,
  'Gb': 46.25, 'Gbmaj7': 46.25,
  'Fm': 43.65, 'Fm7': 43.65, 'Fm9': 43.65,
  'Cm': 65.41, 'Cm7': 65.41, 'Cm9': 65.41
};

let history = [];
let future = [];
let selectedNote = -1;
let playing = false;
let timer;
let sequenceStep = 0;
let metronomeOn = false;
let audioContext;
const bufferCache = new Map();
let vocalBuffer = null;
const customBuffers = { kick: null, snare: null, clap: null, hat: null, openhat: null, bass: null };
let activePickingLane = null;
let drumBusInput = null;
let drumPunchShaper = null;
let drumBusGain = null;
let drumBypassGain = null;

let masterInputGain = null;
let masterOutputGain = null;
let masterLimiterNode = null;
let masterMaximizerGain = null;
let sidechainDuckerGain = null;
let eqLow = null;
let eqMid = null;
let eqHigh = null;
let masterFilterNode = null;
let masterAnalyserNode = null;
let reverbGain = null;
let delayNode = null;
let delayGain = null;
let delayFeedback = null;
let reverbConvolver = null;
let animId = null;
const toneEngine = { synth: null, kick: null, snare: null, hat: null, bass: null, transportStarted: false };
const toneLoop = { sequence: null };

function ensureToneEngine(){
  if (!Tone || !Tone.PolySynth || !Tone.Synth) return null;
  if (!toneEngine.synth) {
    toneEngine.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.02, decay: 0.18, sustain: 0.2, release: 0.45 }
    }).toDestination();
    toneEngine.synth.volume.value = -9;

    toneEngine.kick = new Tone.MembraneSynth({
      pitchDecay: 0.04,
      octaves: 3,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.12, sustain: 0.01, release: 0.08 }
    }).toDestination();
    toneEngine.kick.volume.value = -14;

    toneEngine.snare = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.001, decay: 0.14, sustain: 0, release: 0.06 }
    }).toDestination();
    toneEngine.snare.volume.value = -18;

    toneEngine.hat = new Tone.MetalSynth({
      frequency: 200,
      envelope: { attack: 0.001, decay: 0.09, sustain: 0.0, release: 0.025 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5
    }).toDestination();
    toneEngine.hat.volume.value = -17;

    toneEngine.bass = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.01, decay: 0.28, sustain: 0.12, release: 0.2 }
    }).toDestination();
    toneEngine.bass.volume.value = -10;
  }
  return toneEngine;
}

function triggerToneLead(step){
  const engine = ensureToneEngine();
  if (!engine || !engine.synth) return;

  if (!toneEngine.transportStarted) {
    Tone.start();
    toneEngine.transportStarted = true;
  }

  const scale = scaleForKey?.() || ['C4', 'E4', 'G4', 'A4'];
  const base = scale[Math.abs(step) % scale.length] || 'C4';
  const leadNote = step % 4 === 0 ? base : scale[(Math.abs(step) + 1) % scale.length] || base;
  engine.synth.triggerAttackRelease(leadNote, '16n', undefined, 0.22);
}

function triggerToneDrum(layer, velocity = 0.75){
  const engine = ensureToneEngine();
  if (!engine) return;

  if (!toneEngine.transportStarted) {
    Tone.start();
    toneEngine.transportStarted = true;
  }

  const v = Math.max(0.12, Math.min(1.25, velocity));
  if (layer === 'kick') {
    engine.kick?.triggerAttackRelease('C1', '16n', undefined, v);
  } else if (layer === 'snare') {
    engine.snare?.triggerAttackRelease('8n', undefined, undefined, v * 0.9);
  } else if (layer === 'hat') {
    engine.hat?.triggerAttackRelease('16n', undefined, undefined, v * 0.7);
  } else if (layer === 'bass') {
    const note = state.key?.startsWith('A') ? 'A1' : state.key?.startsWith('C') ? 'C1' : state.key?.startsWith('D') ? 'D1' : 'F1';
    engine.bass?.triggerAttackRelease(note, '8n', undefined, v);
  }
}

function syncToneTransport(){
  if (!Tone || !Tone.Transport) return;
  Tone.Transport.stop();
  Tone.Transport.cancel(0);
  Tone.Transport.bpm.value = Number(state.bpm || 92);
  Tone.Transport.swing = (Number(state.swing || 0) / 100) * 0.65;
  Tone.Transport.swingSubdivision = '16n';
}

function startToneLoop(){
  if (!Tone || !Tone.Transport) return;
  syncToneTransport();
  if (toneLoop.sequence) {
    toneLoop.sequence.stop();
    toneLoop.sequence.dispose();
    toneLoop.sequence = null;
  }

  const advanceStep = () => {
    const step = sequenceStep % 16;
    triggerToneLead(step);
    playDrumStep(step);

    const head = document.querySelector('#playhead');
    if (head) head.style.left = `${(step / 16) * 100}%`;

    const barEl = document.querySelector('.bar-count');
    if (barEl) barEl.textContent = `${state.songMode ? (state.songSection + 1) : 1} · ${Math.floor(step / 4) + 1} · ${(step % 4) + 1}`;

    document.querySelectorAll('.step').forEach(node => {
      node.classList.toggle('now', Number(node.dataset.step) === step);
    });

    if (step === 15) {
      if (state.songMode && state.sections?.length) {
        const current = state.sections[state.songSection] || state.sections[0];
        const totalBars = current?.bars || 1;
        if (songBarCount >= totalBars - 1) {
          songBarCount = 0;
          state.songSection = (state.songSection + 1) % state.sections.length;
          updateSectionUI();
        } else {
          songBarCount += 1;
        }
      }
    }

    const noteEls = document.querySelectorAll('.note');
    noteEls.forEach(el => {
      const index = Number(el.dataset.i);
      const note = state.pattern[index];
      if (!note) return;
      const isNow = playing && step >= note.x && step < note.x + note.w;
      el.classList.toggle('playing', isNow);
    });

    sequenceStep = (sequenceStep + 1) % 16;
  };

  toneLoop.sequence = new Tone.Sequence((time) => {
    advanceStep();
  }, Array.from({ length: 16 }, (_, i) => i), '16n');

  toneLoop.sequence.start(0);
  Tone.Transport.start('+0.05');
}

function stopToneLoop(){
  if (Tone && Tone.Transport) {
    Tone.Transport.stop();
    Tone.Transport.cancel(0);
  }
  if (toneLoop.sequence) {
    toneLoop.sequence.stop();
    toneLoop.sequence.dispose();
    toneLoop.sequence = null;
  }
}

function createReverbImpulse(duration = 1.8, decay = 2.0){
  if(!audioContext) return null;
  const rate = audioContext.sampleRate;
  const length = Math.floor(rate * duration);
  const impulse = audioContext.createBuffer(2, length, rate);
  const left = impulse.getChannelData(0);
  const right = impulse.getChannelData(1);
  for(let i = 0; i < length; i++){
    const n = i / length;
    const factor = Math.pow(1 - n, decay);
    left[i] = (Math.random() * 2 - 1) * factor;
    right[i] = (Math.random() * 2 - 1) * factor;
  }
  return impulse;
}

function initMasterChain(){
  if(!audioContext) return null;
  if(masterInputGain) return masterInputGain;

  masterInputGain = audioContext.createGain();
  masterInputGain.gain.value = 1.0;

  // 3-Band Parametric Equalizer
  eqLow = audioContext.createBiquadFilter();
  eqLow.type = 'lowshelf';
  eqLow.frequency.value = 120;
  eqLow.gain.value = Number(state.eq?.low ?? 0);

  eqMid = audioContext.createBiquadFilter();
  eqMid.type = 'peaking';
  eqMid.frequency.value = 1200;
  eqMid.Q.value = 1.0;
  eqMid.gain.value = Number(state.eq?.mid ?? 0);

  eqHigh = audioContext.createBiquadFilter();
  eqHigh.type = 'highshelf';
  eqHigh.frequency.value = 6500;
  eqHigh.gain.value = Number(state.eq?.high ?? 0);

  // Sidechain Ducker node for pumping harmonic beds & bass
  sidechainDuckerGain = audioContext.createGain();
  sidechainDuckerGain.gain.value = 1.0;
  sidechainDuckerGain.connect(masterInputGain);

  masterOutputGain = audioContext.createGain();
  masterOutputGain.gain.value = 1.0;

  masterAnalyserNode = audioContext.createAnalyser();
  masterAnalyserNode.fftSize = 64;
  masterAnalyserNode.smoothingTimeConstant = 0.8;

  masterFilterNode = audioContext.createBiquadFilter();
  masterFilterNode.type = 'allpass';
  masterFilterNode.frequency.value = 1000;

  delayNode = audioContext.createDelay();
  delayNode.delayTime.value = 60 / (state.bpm || 92) * 0.75;
  delayFeedback = audioContext.createGain();
  delayFeedback.gain.value = 0.32;
  delayGain = audioContext.createGain();
  delayGain.gain.value = state.fx?.delay ?? 0.15;

  delayNode.connect(delayFeedback).connect(delayNode);
  delayNode.connect(delayGain).connect(masterFilterNode);

  reverbConvolver = audioContext.createConvolver();
  try {
    reverbConvolver.buffer = createReverbImpulse(1.8, 2.2);
  } catch(e){}
  reverbGain = audioContext.createGain();
  reverbGain.gain.value = state.fx?.reverb ?? 0.22;
  reverbConvolver.connect(reverbGain).connect(masterFilterNode);

  // Master Limiter & Maximizer (Brickwall peak limiting + loudness boost)
  masterLimiterNode = audioContext.createDynamicsCompressor();
  masterLimiterNode.threshold.value = -0.8;
  masterLimiterNode.knee.value = 0.0;
  masterLimiterNode.ratio.value = 20.0;
  masterLimiterNode.attack.value = 0.001;
  masterLimiterNode.release.value = 0.05;

  masterMaximizerGain = audioContext.createGain();
  masterMaximizerGain.gain.value = state.masterLimiter !== false ? 1.38 : 1.0;

  // Signal flow: input -> EQ Low -> EQ Mid -> EQ High -> DJ Filter -> Limiter -> Maximizer -> Output -> Analyser -> Speakers
  masterInputGain.connect(eqLow);
  eqLow.connect(eqMid);
  eqMid.connect(eqHigh);
  eqHigh.connect(masterFilterNode);
  eqHigh.connect(delayNode);
  eqHigh.connect(reverbConvolver);

  masterFilterNode.connect(masterLimiterNode);
  masterLimiterNode.connect(masterMaximizerGain);
  masterMaximizerGain.connect(masterOutputGain);
  masterOutputGain.connect(masterAnalyserNode);
  masterAnalyserNode.connect(audioContext.destination);

  updateFilterRouting();
  updateEQ();
  updateMasterLimiter();
  return masterInputGain;
}

function updateMasterLimiter(){
  if(!masterLimiterNode || !masterMaximizerGain) return;
  const on = state.masterLimiter !== false;
  if(on){
    masterLimiterNode.threshold.value = -0.8;
    masterLimiterNode.ratio.value = 20.0;
    masterMaximizerGain.gain.value = 1.38;
  } else {
    masterLimiterNode.threshold.value = 0.0;
    masterLimiterNode.ratio.value = 1.0;
    masterMaximizerGain.gain.value = 1.0;
  }
}

function updateEQ(){
  if(!eqLow || !eqMid || !eqHigh) return;
  eqLow.gain.value = Math.max(-12, Math.min(12, Number(state.eq?.low ?? 0)));
  eqMid.gain.value = Math.max(-12, Math.min(12, Number(state.eq?.mid ?? 0)));
  eqHigh.gain.value = Math.max(-12, Math.min(12, Number(state.eq?.high ?? 0)));
}

function triggerKickSidechain(){
  if(state.sidechain === false || !sidechainDuckerGain || !audioContext) return;
  const now = audioContext.currentTime;
  sidechainDuckerGain.gain.cancelScheduledValues(now);
  sidechainDuckerGain.gain.setValueAtTime(0.25, now);
  sidechainDuckerGain.gain.exponentialRampToValueAtTime(1.0, now + 0.16);
}

function updateFilterRouting(){
  if(!masterFilterNode) return;
  const val = Number(state.fx?.filter ?? 0);
  if(Math.abs(val) < 2){
    masterFilterNode.type = 'allpass';
    masterFilterNode.frequency.value = 1000;
  } else if(val < 0){
    masterFilterNode.type = 'lowpass';
    const minF = 200, maxF = 20000;
    const ratio = (100 + val) / 100;
    masterFilterNode.frequency.value = minF + (maxF - minF) * Math.pow(Math.max(0, ratio), 2.5);
    masterFilterNode.Q.value = 1.2;
  } else {
    masterFilterNode.type = 'highpass';
    const minF = 20, maxF = 3500;
    const ratio = val / 100;
    masterFilterNode.frequency.value = minF + (maxF - minF) * Math.pow(Math.min(1, ratio), 1.8);
    masterFilterNode.Q.value = 1.2;
  }
  if(reverbGain) reverbGain.gain.value = Math.max(0, Math.min(1, Number(state.fx?.reverb ?? 0.22)));
  if(delayGain) delayGain.gain.value = Math.max(0, Math.min(1, Number(state.fx?.delay ?? 0.15)));
  if(delayNode && state.bpm) delayNode.delayTime.value = 60 / state.bpm * 0.75;
}

function initVisualizer(){
  const canvas = document.querySelector('#audio-visualizer');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  if(!ctx) return;

  function draw(){
    animId = requestAnimationFrame(draw);
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    if(!masterAnalyserNode || !playing){
      ctx.strokeStyle = '#38334a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      return;
    }

    const bufferLength = masterAnalyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    masterAnalyserNode.getByteFrequencyData(dataArray);

    const numBars = 16;
    const barWidth = (width / numBars) - 1.5;
    const gradient = ctx.createLinearGradient(0, height, 0, 0);
    gradient.addColorStop(0, '#8e62d4');
    gradient.addColorStop(0.6, '#d17dc0');
    gradient.addColorStop(1, '#ffa5e0');

    for(let i = 0; i < numBars; i++){
      const val = dataArray[i * 2] || 0;
      const barHeight = Math.max(2, (val / 255) * (height - 2));
      const x = i * (barWidth + 1.5);
      const y = height - barHeight;

      ctx.fillStyle = gradient;
      ctx.beginPath();
      if(ctx.roundRect){
        ctx.roundRect(x, y, barWidth, barHeight, 2);
      } else {
        ctx.rect(x, y, barWidth, barHeight);
      }
      ctx.fill();
    }
  }

  if(animId) cancelAnimationFrame(animId);
  draw();
}

function makeDistortionCurve(amount = 1.8) {
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const k = typeof amount === 'number' ? amount : 1.8;
  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    curve[i] = Math.tanh(x * (1 + k * 0.8)) / Math.tanh(1 + k * 0.8);
  }
  return curve;
}

function initDrumBus() {
  if (!audioContext) return null;
  if (drumBusInput) return drumBusInput;

  drumBusInput = audioContext.createGain();
  drumPunchShaper = audioContext.createWaveShaper();
  drumPunchShaper.curve = makeDistortionCurve(1.8);
  drumPunchShaper.oversample = '2x';

  const punchDrive = audioContext.createGain();
  punchDrive.gain.value = 1.15;

  drumBusGain = audioContext.createGain();
  drumBypassGain = audioContext.createGain();

  drumBusInput.connect(punchDrive);
  punchDrive.connect(drumPunchShaper);
  drumPunchShaper.connect(drumBusGain);
  drumBusGain.connect(initMasterChain() || audioContext.destination);

  drumBusInput.connect(drumBypassGain);
  drumBypassGain.connect(initMasterChain() || audioContext.destination);

  updateDrumBusRouting();
  return drumBusInput;
}

function updateDrumBusRouting() {
  if (!drumBusGain || !drumBypassGain) return;
  const isPunch = state.drumPunch !== false;
  drumBusGain.gain.value = isPunch ? 1.0 : 0.0;
  drumBypassGain.gain.value = isPunch ? 0.0 : 1.0;
}

async function getAudioBuffer(url){
  if(!url) return null;
  if(bufferCache.has(url)) return bufferCache.get(url);
  try{
    audioContext ||= new AudioContext();
    const res = await fetch(publicUrl(url));
    const arr = await res.arrayBuffer();
    const buf = await audioContext.decodeAudioData(arr);
    bufferCache.set(url, buf);
    return buf;
  }catch{
    return null;
  }
}

async function preloadKit(kitId){
  const kit = sessionKits[kitId];
  if(!kit) return;
  for(const lane of lanes){
    if(kit[lane]) getAudioBuffer(kit[lane]);
  }
}

async function prepareVocalBuffer(blobUrl){
  if(!blobUrl){ vocalBuffer = null; return null; }
  try{
    audioContext ||= new AudioContext();
    const res = await fetch(publicUrl(blobUrl));
    const arr = await res.arrayBuffer();
    vocalBuffer = await audioContext.decodeAudioData(arr);
    return vocalBuffer;
  }catch{
    return null;
  }
}

function playSampleBuffer(buf, volume = 0.75, isDrum = false, playbackRate = 1.0, time = null, pan = 0){
  if(!buf || !audioContext) return;
  if(audioContext.state === 'suspended') audioContext.resume();
  const source = audioContext.createBufferSource();
  source.buffer = buf;
  if(playbackRate && playbackRate !== 1.0){
    source.playbackRate.value = Math.max(0.25, Math.min(4.0, playbackRate));
  }
  const gain = audioContext.createGain();
  gain.gain.value = Math.max(0, Math.min(1.5, volume));

  let outNode = gain;
  if(audioContext.createStereoPanner && pan !== 0){
    const panner = audioContext.createStereoPanner();
    panner.pan.value = Math.max(-1, Math.min(1, pan));
    gain.connect(panner);
    outNode = panner;
  }

  if(isDrum){
    const bus = initDrumBus();
    if(bus){
      source.connect(gain);
      outNode.connect(bus);
    } else {
      source.connect(gain);
      outNode.connect(initMasterChain() || audioContext.destination);
    }
  } else {
    source.connect(gain);
    outNode.connect(initMasterChain() || audioContext.destination);
  }

  if(time != null && time > audioContext.currentTime){
    source.start(time);
  } else {
    source.start();
  }
}
let catalog = null;
let packId = 'featured';
let groupId = 'picks';
let query = '';
let previewAudio = null;
let recorder = null;
let vocalUrl = '';
let vocalChunks = [];

function noteFrequency(note){const match=note.match(/([A-G])(#?)(\d)/);const pitch={C:0,D:2,E:4,F:5,G:7,A:9,B:11}[match[1]]+(match[2]?1:0)+(Number(match[3])+1)*12;return 440*2**((pitch-69)/12)}
const soundfontCache = {};
const soundfontLoading = {};
const soundfontNames = {guitar:'acoustic_guitar_nylon',strings:'string_ensemble_1',organ:'church_organ',flute:'flute',piano:'acoustic_grand_piano'};
function triggerSoundfontLoad(instId){
  const sfName = soundfontNames[instId];
  if(!sfName || soundfontCache[sfName] || soundfontLoading[sfName]) return;
  soundfontLoading[sfName] = true;
  const script = document.createElement('script');
  script.src = `https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/${sfName}-mp3.js`;
  script.async = true;
  script.onload = () => {
    if(window.MIDI?.Soundfont?.[sfName]) soundfontCache[sfName] = window.MIDI.Soundfont[sfName];
    else soundfontLoading[sfName] = false;
  };
  script.onerror = () => { soundfontLoading[sfName] = false; };
  document.head.appendChild(script);
}
function playSoundfontNote(sfName, note, duration, volume){
  const data = soundfontCache[sfName]?.[note];
  if(!data) return false;
  try {
    const audio = new Audio(data);
    audio.volume = Math.max(0, Math.min(1, volume * 1.6));
    audio.play().catch(()=>{});
    setTimeout(() => { audio.pause(); }, (duration + 0.6) * 1000);
    return true;
  } catch {
    return false;
  }
}
function tone(note,duration=.32,volume=.08,instrument=state.instrument||'rhodes',useSidechain=false){
  audioContext||=new AudioContext();
  if(audioContext.state==='suspended') audioContext.resume();
  const now=audioContext.currentTime;
  const freq=noteFrequency(note);
  if(!freq||isNaN(freq)) return;
  const high=Math.min(1,Math.max(0,((69+12*Math.log2(freq/440))-50)/30));
  const voicedVolume=volume*(1.12-high*.32);
  const sfName = soundfontNames[instrument];
  if(sfName){
    triggerSoundfontLoad(instrument);
    if(playSoundfontNote(sfName, note, duration, voicedVolume)) return;
  }

  const masterGain=audioContext.createGain();
  masterGain.gain.setValueAtTime(Math.max(voicedVolume,.0001),now);
  masterGain.gain.exponentialRampToValueAtTime(.0001,now+duration);
  const dest = (useSidechain && sidechainDuckerGain) ? sidechainDuckerGain : (initMasterChain() || audioContext.destination);
  masterGain.connect(dest);

  if(instrument==='piano'){
    const filter=audioContext.createBiquadFilter();
    filter.type='lowpass';
    filter.frequency.setValueAtTime(3600,now);
    filter.frequency.exponentialRampToValueAtTime(900,now+duration);
    filter.Q.value=.7;
    filter.connect(masterGain);

    const osc1=audioContext.createOscillator();
    osc1.type='triangle';
    osc1.frequency.value=freq;
    const g1=audioContext.createGain();
    g1.gain.setValueAtTime(.75,now);
    g1.gain.exponentialRampToValueAtTime(.001,now+duration);
    osc1.connect(g1).connect(filter);
    osc1.start(now);
    osc1.stop(now+duration+.05);

    const osc2=audioContext.createOscillator();
    osc2.type='sine';
    osc2.frequency.value=freq*2;
    const g2=audioContext.createGain();
    g2.gain.setValueAtTime(.35,now);
    g2.gain.exponentialRampToValueAtTime(.0005,now+duration*.85);
    osc2.connect(g2).connect(filter);
    osc2.start(now);
    osc2.stop(now+duration+.05);

    const oscHammer=audioContext.createOscillator();
    oscHammer.type='sine';
    oscHammer.frequency.value=freq*4.1;
    const gHammer=audioContext.createGain();
    gHammer.gain.setValueAtTime(.4,now);
    gHammer.gain.exponentialRampToValueAtTime(.0001,now+Math.min(.06,duration*.2));
    oscHammer.connect(gHammer).connect(filter);
    oscHammer.start(now);
    oscHammer.stop(now+.08);
    return;
  }

  if(instrument==='guitar'){
    const filter=audioContext.createBiquadFilter();
    filter.type='lowpass';
    filter.frequency.setValueAtTime(2600,now);
    filter.frequency.exponentialRampToValueAtTime(650,now+duration*.7);
    filter.Q.value=1.1;
    filter.connect(masterGain);

    const osc1=audioContext.createOscillator();
    osc1.type='triangle';
    osc1.frequency.value=freq;
    const g1=audioContext.createGain();
    g1.gain.setValueAtTime(.7,now);
    g1.gain.exponentialRampToValueAtTime(.001,now+duration*.9);
    osc1.connect(g1).connect(filter);
    osc1.start(now);
    osc1.stop(now+duration+.05);

    const osc2=audioContext.createOscillator();
    osc2.type='sawtooth';
    osc2.frequency.value=freq*2;
    const g2=audioContext.createGain();
    g2.gain.setValueAtTime(.22,now);
    g2.gain.exponentialRampToValueAtTime(.0001,now+Math.min(.18,duration*.5));
    osc2.connect(g2).connect(filter);
    osc2.start(now);
    osc2.stop(now+.22);
    return;
  }

  if(instrument==='strings'){
    const filter=audioContext.createBiquadFilter();
    filter.type='lowpass';
    filter.frequency.value=1800;
    filter.Q.value=.6;
    filter.connect(masterGain);

    const attack=Math.min(.18,duration*.35);
    [-7,7].forEach(detune=>{
      const osc=audioContext.createOscillator();
      osc.type='sawtooth';
      osc.frequency.value=freq;
      osc.detune.value=detune;
      const g=audioContext.createGain();
      g.gain.setValueAtTime(.001,now);
      g.gain.linearRampToValueAtTime(.42,now+attack);
      g.gain.exponentialRampToValueAtTime(.01,now+duration+.15);
      osc.connect(g).connect(filter);
      osc.start(now);
      osc.stop(now+duration+.2);
    });
    return;
  }

  if(instrument==='organ'){
    const filter=audioContext.createBiquadFilter();
    filter.type='lowpass';
    filter.frequency.value=3800;
    filter.Q.value=.5;
    filter.connect(masterGain);

    [
      { mult: 0.5, gain: 0.35 },
      { mult: 1.0, gain: 0.55 },
      { mult: 1.5, gain: 0.22 },
      { mult: 2.0, gain: 0.28 }
    ].forEach(harm=>{
      const osc=audioContext.createOscillator();
      osc.type='sine';
      osc.frequency.value=freq*harm.mult;
      const g=audioContext.createGain();
      g.gain.setValueAtTime(harm.gain,now);
      g.gain.exponentialRampToValueAtTime(.001,now+duration);
      osc.connect(g).connect(filter);
      osc.start(now);
      osc.stop(now+duration+.05);
    });
    return;
  }

  if(instrument==='flute'){
    const filter=audioContext.createBiquadFilter();
    filter.type='lowpass';
    filter.frequency.setValueAtTime(1400+freq*.8,now);
    filter.Q.value=.6;
    filter.connect(masterGain);

    const osc=audioContext.createOscillator();
    osc.type='sine';
    osc.frequency.value=freq;
    const g=audioContext.createGain();
    g.gain.setValueAtTime(.72,now);
    g.gain.exponentialRampToValueAtTime(.01,now+duration);
    osc.connect(g).connect(filter);
    osc.start(now);
    osc.stop(now+duration+.05);

    const oscHarm=audioContext.createOscillator();
    oscHarm.type='sine';
    oscHarm.frequency.value=freq*2;
    const gHarm=audioContext.createGain();
    gHarm.gain.setValueAtTime(.15,now);
    gHarm.gain.exponentialRampToValueAtTime(.001,now+duration*.7);
    oscHarm.connect(gHarm).connect(filter);
    oscHarm.start(now);
    oscHarm.stop(now+duration+.05);

    const oscBreath=audioContext.createOscillator();
    oscBreath.type='triangle';
    oscBreath.frequency.value=freq*3;
    const gBreath=audioContext.createGain();
    gBreath.gain.setValueAtTime(.06,now);
    gBreath.gain.exponentialRampToValueAtTime(.0001,now+Math.min(.1,duration*.3));
    oscBreath.connect(gBreath).connect(filter);
    oscBreath.start(now);
    oscBreath.stop(now+.12);
    return;
  }

  if(instrument==='bass'){
    const filter=audioContext.createBiquadFilter();
    filter.type='lowpass';
    filter.frequency.value=1800;
    filter.connect(masterGain);

    const osc=audioContext.createOscillator();
    osc.type='sine';
    osc.frequency.setValueAtTime(freq*1.5,now);
    osc.frequency.exponentialRampToValueAtTime(freq,now+0.028);

    const g=audioContext.createGain();
    g.gain.setValueAtTime(.9,now);
    g.gain.exponentialRampToValueAtTime(.01,now+duration);
    osc.connect(g).connect(filter);
    osc.start(now);
    osc.stop(now+duration+.05);
    return;
  }

  if(instrument==='brass'){
    const filter=audioContext.createBiquadFilter();
    filter.type='lowpass';
    filter.frequency.setValueAtTime(800,now);
    filter.frequency.exponentialRampToValueAtTime(3600,now+0.06);
    filter.frequency.exponentialRampToValueAtTime(1200,now+duration);
    filter.Q.value=2.0;
    filter.connect(masterGain);

    [-9,9].forEach(detune=>{
      const osc=audioContext.createOscillator();
      osc.type='sawtooth';
      osc.frequency.value=freq;
      osc.detune.value=detune;
      const g=audioContext.createGain();
      g.gain.value=.35;
      osc.connect(g).connect(filter);
      osc.start(now);
      osc.stop(now+duration+.05);
    });
    return;
  }

  if(instrument==='pad'){
    const filter=audioContext.createBiquadFilter();
    filter.type='lowpass';
    filter.frequency.value=1500;
    filter.Q.value=.8;
    filter.connect(masterGain);

    const osc=audioContext.createOscillator();
    osc.type='triangle';
    osc.frequency.value=freq;
    const g=audioContext.createGain();
    const attack=Math.min(.14,duration*.4);
    g.gain.setValueAtTime(.0001,now);
    g.gain.linearRampToValueAtTime(.65,now+attack);
    g.gain.exponentialRampToValueAtTime(.01,now+duration+.1);
    osc.connect(g).connect(filter);
    osc.start(now);
    osc.stop(now+duration+.12);
    return;
  }

  if(instrument==='analog'){
    const filter=audioContext.createBiquadFilter();
    filter.type='lowpass';
    filter.frequency.setValueAtTime(freq*(3.2+high*2.4),now);
    filter.frequency.exponentialRampToValueAtTime(Math.max(220,freq*(.7+high)),now+duration);
    filter.Q.value=1.05;
    filter.connect(masterGain);

    [-7,7].forEach(detune=>{
      const osc=audioContext.createOscillator();
      osc.type='sawtooth';
      osc.frequency.value=freq;
      osc.detune.value=detune;
      const g=audioContext.createGain();
      g.gain.value=.25;
      osc.connect(g).connect(filter);
      osc.start(now);
      osc.stop(now+duration+.04);
    });
    const sub=audioContext.createOscillator();
    sub.type='sine';
    sub.frequency.value=freq;
    const subG=audioContext.createGain();
    subG.gain.value=high<.45?.4:.16;
    sub.connect(subG).connect(filter);
    sub.start(now);
    sub.stop(now+duration+.04);
    return;
  }

  if(instrument==='pluck'){
    const filter=audioContext.createBiquadFilter();
    filter.type='bandpass';
    filter.frequency.setValueAtTime(freq*(6+high*5),now);
    filter.frequency.exponentialRampToValueAtTime(Math.max(280,freq*1.4),now+.12);
    filter.Q.value=2.2;
    filter.connect(masterGain);

    const osc=audioContext.createOscillator();
    osc.type='triangle';
    osc.frequency.value=freq;
    osc.connect(filter);
    osc.start(now);
    osc.stop(now+duration+.04);
    return;
  }

  // DEFAULT: Fender Rhodes / Neo-Soul Electric Piano — darker lows, brighter highs
  const filter=audioContext.createBiquadFilter();
  filter.type='lowpass';
  filter.frequency.setValueAtTime(900+freq*(1.1+high*1.6),now);
  filter.frequency.exponentialRampToValueAtTime(280+freq*(.35+high*.5),now+duration);
  filter.Q.value=.55+high*.25;
  filter.connect(masterGain);

  const oscBody=audioContext.createOscillator();
  oscBody.type='sine';
  oscBody.frequency.value=freq;
  const gainBody=audioContext.createGain();
  gainBody.gain.setValueAtTime(.72-high*.22,now);
  gainBody.gain.exponentialRampToValueAtTime(.01,now+duration);
  oscBody.connect(gainBody).connect(filter);
  oscBody.start(now);
  oscBody.stop(now+duration+.05);

  const tineFreq=freq*3.98;
  if(tineFreq<18000){
    const oscTine=audioContext.createOscillator();
    oscTine.type='sine';
    oscTine.frequency.value=tineFreq;
    const gainTine=audioContext.createGain();
    gainTine.gain.setValueAtTime(.12+high*.28,now);
    gainTine.gain.exponentialRampToValueAtTime(.0001,now+Math.min(.11,duration*.4));
    oscTine.connect(gainTine).connect(filter);
    oscTine.start(now);
    oscTine.stop(now+.14);
  }

  const osc2=audioContext.createOscillator();
  osc2.type='sine';
  osc2.frequency.value=freq*2;
  const gain2=audioContext.createGain();
  gain2.gain.setValueAtTime(.14+high*.16,now);
  gain2.gain.exponentialRampToValueAtTime(.001,now+duration*.75);
  osc2.connect(gain2).connect(filter);
  osc2.start(now);
  osc2.stop(now+duration+.05);
}
function getChordRoot(chordStr){
  if(!chordStr) return 55.0;
  if(chordRoots[chordStr]) return chordRoots[chordStr];
  const m = String(chordStr).match(/^([A-G][b#]?)/);
  const rootNote = m ? m[1] : 'A';
  const rootMap = { 'C': 65.41, 'C#': 69.30, 'Db': 69.30, 'D': 73.42, 'D#': 77.78, 'Eb': 77.78, 'E': 82.41, 'F': 43.65, 'F#': 46.25, 'Gb': 46.25, 'G': 49.00, 'G#': 51.91, 'Ab': 51.91, 'A': 55.00, 'A#': 58.27, 'Bb': 58.27, 'B': 61.74 };
  return rootMap[rootNote] || 55.0;
}

function hit(name,volume=.75,time=null){
  audioContext ||= new AudioContext();
  if(audioContext.state === 'suspended') audioContext.resume();

  if(name === 'kick'){
    triggerKickSidechain();
  }

  const laneMix = state.drumMix?.[name] || { vol: 1.0, pan: 0 };
  const finalVol = volume * (laneMix.vol ?? 1.0);
  const finalPan = laneMix.pan ?? 0;

  let playbackRate = 1.0;
  if(name === 'bass' && state.bassTuned !== false){
    const root = getChordRoot(currentChord());
    playbackRate = root / 65.41;
  }

  if(customBuffers[name]){
    playSampleBuffer(customBuffers[name], finalVol, true, playbackRate, time, finalPan);
    return;
  }
  const url = starterKit[name];
  if(!url) return;
  const buf = bufferCache.get(url);
  if(buf){
    playSampleBuffer(buf, finalVol, true, playbackRate, time, finalPan);
  } else {
    const voice = new Audio(publicUrl(url));
    voice.volume = Math.max(0, Math.min(1, finalVol));
    if(playbackRate !== 1.0) voice.playbackRate = Math.max(0.25, Math.min(4.0, playbackRate));
    voice.play().catch(()=>{});
    getAudioBuffer(url);
  }
}

async function loadCustomSample(lane, file){
  if(!file) return;
  try{
    audioContext ||= new AudioContext();
    if(audioContext.state === 'suspended') await audioContext.resume();
    const arr = await file.arrayBuffer();
    const buf = await audioContext.decodeAudioData(arr);
    customBuffers[lane] = buf;
    state.customSamples = state.customSamples || {};
    state.customSamples[lane] = file.name;
    const blobUrl = URL.createObjectURL(file);
    starterKit[lane] = blobUrl;
    bufferCache.set(blobUrl, buf);
    saveProject();
    renderApp();
    hit(lane, 0.85);
    notify(`Loaded custom ${lane.toUpperCase()}: ${file.name}`);
  }catch(err){
    console.error('Failed to load sample:', err);
    notify(`Could not load audio file "${file.name}" — check format`);
  }
}

function resetCustomSample(lane){
  customBuffers[lane] = null;
  if(state.customSamples) delete state.customSamples[lane];
  const kit = sessionKits[state.kit];
  if(kit && kit[lane]){
    starterKit[lane] = kit[lane];
  }
  saveProject();
  renderApp();
  hit(lane, 0.75);
  notify(`Reset ${lane.toUpperCase()} to kit default`);
}
function mixVol(id){return state.mix[id].mute?0:state.mix[id].vol}
function currentChord(){return state.chords.bars[Math.floor(sequenceStep/4)%state.chords.bars.length]}
function playVocalOnce(){
  if(!vocalUrl||!mixVol('vocals')) return;
  audioContext ||= new AudioContext();
  if(audioContext.state === 'suspended') audioContext.resume();

  if(vocalBuffer){
    const source = audioContext.createBufferSource();
    source.buffer = vocalBuffer;
    const gain = audioContext.createGain();
    gain.gain.value = mixVol('vocals');

    const chain = state.vocals.chain;
    if(chain === 'Lo-fi'){
      source.playbackRate.value = 0.94;
      const hp = audioContext.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 350;
      const lp = audioContext.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 3800;
      source.connect(hp).connect(lp).connect(gain).connect(initMasterChain() || audioContext.destination);
      source.connect(hp).connect(lp).connect(gain).connect(audioContext.destination);
    } else if(chain === 'Dark rap'){
      source.playbackRate.value = 0.97;
      const lp = audioContext.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 2600;
      const boost = audioContext.createBiquadFilter();
      boost.type = 'peaking';
      boost.frequency.value = 220;
      boost.gain.value = 4;
      source.connect(boost).connect(lp).connect(gain).connect(initMasterChain() || audioContext.destination);
      source.connect(boost).connect(lp).connect(gain).connect(audioContext.destination);
    } else {
      // Modern R&B: subtle air boost + stereo space
      const hp = audioContext.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 120;
      const air = audioContext.createBiquadFilter();
      air.type = 'highshelf';
      air.frequency.value = 5000;
      air.gain.value = 3;

      const delay = audioContext.createDelay();
      delay.delayTime.value = 0.28;
      const delayFeedback = audioContext.createGain();
      delayFeedback.gain.value = 0.22;
      const delayGain = audioContext.createGain();
      delayGain.gain.value = 0.25;

      source.connect(hp).connect(air);
      air.connect(gain);
      air.connect(delay);
      delay.connect(delayFeedback).connect(delay);
      delay.connect(delayGain).connect(gain);
      gain.connect(initMasterChain() || audioContext.destination);
      gain.connect(audioContext.destination);
    }
    source.start();
  } else {
    const voice = new Audio(publicUrl(vocalUrl));
    voice.volume = mixVol('vocals');
    if(state.vocals.chain==='Lo-fi') voice.playbackRate=.92;
    voice.play().catch(()=>{});
    prepareVocalBuffer(vocalUrl);
  }
}
function drumVelocity(lane, step){
  if(lane==='hat'){
    if(step%4===0) return .28; // accented quarter-note hats
    if(step%2===0) return .21; // 8th note groove
    return .15; // 16th swing ghost
  }
  if(lane==='snare'){
    if(step===4||step===12) return .85; // solid backbeat crack
    return .36; // ghost snare!
  }
  if(lane==='clap'){
    if(step===4||step===12) return .80; // wide stereo clap
    return .35;
  }
  if(lane==='openhat'){
    return .65; // open hihat sizzle
  }
  if(lane==='kick'){
    if(step===0||step===8) return .85; // heavy anchor downbeat
    return .72; // syncopated push kick
  }
  if(lane==='bass'){
    if(step===0||step===8) return .40;
    return .30;
  }
  return .75;
}
function isTrackActive(trackId){
  if(!state.songMode) return true;
  const currentSec = state.sections[state.songSection] || state.sections[0];
  return currentSec?.active?.[trackId] !== false;
}
function playDrumStep(step){
  const activeDrums = isTrackActive('drums');
  const activeKeys = isTrackActive('keys');
  const activeChords = isTrackActive('chords');
  const activeVocals = isTrackActive('vocals');

  if(activeDrums && mixVol('drums')){
    for(const name of lanes){
      if(state.drums[name]?.has(step)){
        const roll = state.drumRolls?.[name]?.[step] || 1;
        const vel = drumVelocity(name, step) * mixVol('drums');
        if(roll > 1){
          const stepDur = (60 / state.bpm) / 4;
          const now = audioContext ? audioContext.currentTime : 0;
          for(let k = 0; k < roll; k++){
            const subTime = k === 0 ? null : (now + (stepDur / roll) * k);
            const subVel = vel * (0.85 + 0.15 * (k / roll));
            hit(name, subVel, subTime);
          }
        } else {
          hit(name, vel);
        }
      }
    }
  }

  if(activeKeys && mixVol('keys') && state.pattern.length){
    const sixteenth = 60 / state.bpm / 4;
    state.pattern.filter(note => note.x === step).forEach(note => {
      const hold = Math.max(sixteenth * .75, note.w * sixteenth * .92);
      const accent = note.x % 8 === 0 ? 1 : note.x % 4 === 0 ? .84 : .66;
      tone(note.n, hold, .14 * accent * mixVol('keys'), state.instrument, false);
    });
  }

  if(activeChords && state.chordAdded && mixVol('chords') && step % 4 === 0){
    const chord = currentChord();
    const tones = chordTones[chord] || getChordNotes(chord);
    tones.forEach(note => tone(note, .78, .045 * mixVol('chords'), state.instrument === 'pluck' ? 'rhodes' : state.instrument, true));
  }

  if(activeVocals && state.vocalAdded && step === 0) playVocalOnce();
  if(metronomeOn && step % 4 === 0) tone(step === 0 ? 'C6' : 'C5', .05, .035, 'pluck');
}

function projectSnapshot(){
  return {
    id: state.id,
    name: state.name,
    description: state.description,
    updated: Date.now(),
    bpm: state.bpm,
    key: state.key,
    prompt: state.prompt,
    chips: state.chips,
    pattern: state.pattern,
    idea: state.idea,
    instrument: state.instrument,
    swing: state.swing,
    kit: state.kit,
    drums: Object.fromEntries(lanes.map(lane => [lane, [...(state.drums[lane] || [])]])),
    drumRolls: state.drumRolls || {},
    drumMix: state.drumMix || {},
    chords: state.chords,
    chordAdded: !!state.chordAdded,
    drumsAdded: !!state.drumsAdded,
    vocals: state.vocals,
    vocalAdded: !!state.vocalAdded,
    mix: state.mix,
    melodyAdded: !!state.melodyAdded,
    drumPunch: state.drumPunch !== false,
    customSamples: state.customSamples || {},
    fx: state.fx || { reverb: 0.22, delay: 0.15, filter: 0 },
    eq: state.eq || { low: 0, mid: 0, high: 0 },
    masterLimiter: state.masterLimiter !== false,
    sidechain: state.sidechain !== false,
    bassTuned: state.bassTuned !== false,
    songMode: !!state.songMode,
    songSection: state.songSection || 0,
    sections: state.sections || []
  };
}

function loadProjects(){
  try {
    const list = JSON.parse(localStorage.getItem('bmai-projects'));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeProjects(list){
  localStorage.setItem('bmai-projects', JSON.stringify(list));
}

function saveProject(){
  const snapshot = projectSnapshot();
  localStorage.setItem('bmai-project', JSON.stringify(snapshot));
  const list = loadProjects();
  const index = list.findIndex(p => p.id === snapshot.id);
  if(index >= 0) list[index] = snapshot;
  else list.unshift(snapshot);
  writeProjects(list);
  const status = document.querySelector('.project span:last-child');
  if(status) status.textContent = 'Saved just now';
}

function applySnapshot(project){
  state.id = project.id;
  state.name = project.name || 'Untitled idea';
  state.description = project.description || '';
  state.bpm = project.bpm || 92;
  state.key = project.key || 'A minor';
  state.prompt = project.prompt || 'late-night R&B, warm and a little dark';
  state.chips = project.chips || ['R&B'];
  state.pattern = project.pattern?.length ? project.pattern.map(n => ({...n})) : [];
  state.idea = project.idea || 0;
  state.instrument = project.instrument || 'rhodes';
  state.swing = project.swing !== undefined ? Number(project.swing) : 18;
  state.kit = sessionKits[project.kit] ? project.kit : 'rnb';
  state.drumsAdded = !!project.drumsAdded;
  state.drumRolls = project.drumRolls || {};
  state.drumMix = project.drumMix || {
    kick: { vol: 1, pan: 0 },
    snare: { vol: 1, pan: 0 },
    clap: { vol: 1, pan: 0 },
    hat: { vol: 1, pan: 0 },
    openhat: { vol: 1, pan: 0 },
    bass: { vol: 1, pan: 0 }
  };
  state.drumPunch = project.drumPunch !== false;
  state.customSamples = project.customSamples || {};
  state.fx = project.fx || { reverb: 0.22, delay: 0.15, filter: 0 };
  state.eq = project.eq || { low: 0, mid: 0, high: 0 };
  state.masterLimiter = project.masterLimiter !== false;
  state.sidechain = project.sidechain !== false;
  state.bassTuned = project.bassTuned !== false;
  state.songMode = !!project.songMode;
  state.songSection = project.songSection || 0;
  if(Array.isArray(project.sections) && project.sections.length) state.sections = project.sections;
  updateDrumBusRouting();
  updateFilterRouting();
  updateEQ();
  updateMasterLimiter();
  state.chords = project.chords || (progressions[state.key] ? progressions[state.key][0] : progressions['A minor'][0]);
  state.chordAdded = !!project.chordAdded;
  state.vocals = project.vocals || { title: 'Soft hook', line: 'keep the night close, don’t say it loud', chain: 'Modern R&B' };
  state.vocalAdded = !!project.vocalAdded;
  state.mix = project.mix || defaultMix();
  state.melodyAdded = !!project.melodyAdded;
  for(const lane of lanes) state.drums[lane] = new Set(project.drums?.[lane] || []);
  applyKit(sessionKits[project.kit] ? project.kit : 'rnb');
}
function openProject(id){
  const project=loadProjects().find(item=>item.id===id);
  if(!project) return;
  if(playing) setPlaying(false);
  history=[]; future=[];
  applySnapshot(project);
  selectedNote=-1;
  saveProject();
  setView('home');
  notify(`Opened ${project.name}`);
}
function createProject(){
  const name=document.querySelector('#new-project-name')?.value.trim()||'Untitled idea';
  const description=document.querySelector('#new-project-description')?.value.trim()||'';
  const kit=sessionKits[document.querySelector('#new-project-kit')?.value]?document.querySelector('#new-project-kit').value:'rnb';
  if(playing) setPlaying(false);
  history=[]; future=[];
  selectedNote=-1;
  state.id=crypto.randomUUID();
  state.name=name;
  state.description=description;
  state.bpm=92;
  state.key='A minor';
  state.prompt=description||'late-night R&B, warm and a little dark';
  state.chips=['R&B'];
  state.pattern=[];
  state.idea=0;
  state.instrument='rhodes';
  state.chords=progressions['A minor'][0];
  state.chordAdded=false;
  state.drumsAdded=false;
  state.vocalAdded=false;
  state.melodyAdded=false;
  state.drumRolls={};
  state.customSamples={kick:'',snare:'',clap:'',hat:'',openhat:'',bass:''};
  state.mix=defaultMix();
  applyKit(kit,true);
  saveProject();
  setView('home');
  notify(`${name} saved. Add melody, drums, or chords next.`);
}
function applyKit(id,resetSteps=false){
  const kit=sessionKits[id]; if(!kit) return;
  state.kit=id;
  for(const lane of lanes){
    if(!customBuffers[lane]){
      starterKit[lane]=kit[lane];
    }
  }
  Object.assign(starterKit,kit);
  if(resetSteps) for(const lane of lanes) state.drums[lane]=new Set(kit.steps[lane]);
  const genreSwings = { rnb: 18, trap: 12, house: 8, acoustic: 15, dnb: 0 };
  if(resetSteps && genreSwings[id] !== undefined) state.swing = genreSwings[id];
  preloadKit(id);
}
applyKit(state.kit);

function notify(msg){const toast=document.querySelector('.toast');toast.textContent=msg;toast.classList.add('show');clearTimeout(notify.t);notify.t=setTimeout(()=>toast.classList.remove('show'),2200)}
function setView(view){
  state.view=view;
  if(location.hash.slice(1)!==view) location.hash=view;
  if(view!=='home') saveProject();
  renderApp();
}

const studioNav={open:localStorage.getItem('bmai-nav')!=='closed'};
function applyStudioLayout(){
  const shell=document.querySelector('.shell');
  const toggle=document.querySelector('#nav-toggle');
  const piano=document.querySelector('#piano-section');
  if(!shell||!toggle||!piano) return;
  const phone=window.matchMedia('(max-width: 760px)').matches;
  const wide=window.matchMedia('(max-width: 1100px)').matches;
  const pianoOn=!piano.hidden;
  shell.classList.toggle('nav-collapsed',!studioNav.open);
  shell.dataset.layout=phone?'stack':wide?'wide':'studio';
  toggle.setAttribute('aria-expanded',String(studioNav.open));
  toggle.setAttribute('aria-label',studioNav.open?'Hide studio panel':'Show studio panel');
  const mark=toggle.querySelector('span');
  if(mark) mark.textContent=studioNav.open?'‹':'›';
  const inspector=document.querySelector('#inspector');
  shell.classList.toggle('inspector-closed',!inspectorPane.open&&!phone&&!wide);
  if(inspector){
    inspector.classList.toggle('rolled',!inspectorPane.open);
    inspector.setAttribute('aria-expanded',String(inspectorPane.open));
  }
  if(phone){
    shell.style.gridTemplateColumns='';
    shell.style.gridTemplateRows='';
    shell.style.gridTemplateAreas='';
    return;
  }
  const nav=studioNav.open?(wide?'160px':'185px'):'minmax(0,0px)';
  const side=wide||!inspectorPane.open?'minmax(0,0px)':'236px';
  shell.style.gridTemplateColumns=`${nav} minmax(0,1fr) ${side}`;
  shell.style.gridTemplateRows=pianoOn?'59px 56px minmax(0,1fr) minmax(168px,28vh) 29px':'59px 56px minmax(0,1fr) 29px';
  shell.style.gridTemplateAreas=pianoOn
    ?'"top top top" "bar bar bar" "nav stage side" "nav piano side" "foot foot foot"'
    :'"top top top" "bar bar bar" "nav stage side" "foot foot foot"';
}
function setStudioNav(open){
  studioNav.open=open;
  localStorage.setItem('bmai-nav',open?'open':'closed');
  applyStudioLayout();
}
const inspectorPane={open:localStorage.getItem('bmai-inspector')!=='closed'};
function setInspectorOpen(open){
  inspectorPane.open=open;
  localStorage.setItem('bmai-inspector',open?'open':'closed');
  applyStudioLayout();
}
function inspectorArtLabel(){
  if(state.view==='drums') return state.kit.toUpperCase();
  if(state.view==='vocals') return state.vocals.chain;
  if(state.view==='melody') return state.chips.join(' / ')||'R&B';
  return state.key;
}
const keyScales = {
  'A minor':['A4','C5','D5','E5','G5','A5'],
  'E minor':['E4','G4','A4','B4','D5','E5'],
  'B minor':['B4','D5','E5','F#5','A5','B5'],
  'F# minor':['F#4','A4','B4','C#5','E5','F#5'],
  'C# minor':['C#4','E4','F#4','G#4','B4','C#5'],
  'G# minor':['G#4','B4','C#5','D#5','F#5','G#5'],
  'Eb minor':['D#4','F#4','G#4','A#4','C#5','D#5'],
  'Bb minor':['A#4','C#5','D#5','F5','G#5','A#5'],
  'F minor':['F4','G#4','A#4','C5','D#5','F5'],
  'C minor':['C4','D#4','F4','G4','A#4','C5'],
  'G minor':['G4','A#4','C5','D5','F5','G5'],
  'D minor':['D4','F4','G4','A4','C5','D5'],
  'C major':['C4','D4','E4','G4','A4','C5'],
  'G major':['G4','A4','B4','D5','E5','G5'],
  'D major':['D4','E4','F#4','A4','B4','D5'],
  'A major':['A4','B4','C#5','E5','F#5','A5'],
  'E major':['E4','F#4','G#4','B4','C#5','E5'],
  'B major':['B4','C#5','D#5','F#5','G#5','B5'],
  'F# major':['F#4','G#4','A#4','C#5','D#5','F#5'],
  'Db major':['C#4','D#4','F4','G#4','A#4','C#5'],
  'Ab major':['G#4','A#4','C5','D#5','F5','G#5'],
  'Eb major':['D#4','F4','G4','A#4','C5','D#5'],
  'Bb major':['A#4','C5','D5','F5','G5','A#5'],
  'F major':['F4','G4','A4','C5','D5','F5']
};
function scaleForKey(key=state.key){return keyScales[key]||keyScales['A minor']}
function pitchOf(note){const m=note.match(/([A-G])(#?)(\d)/);return {C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1]]+(m[2]?1:0)+Number(m[3])*12}
function applySessionKey(next){
  if(!keyScales[next]) return;
  const list=document.querySelector('#key-list');
  if(list) list.hidden=true;
  document.querySelector('#key')?.setAttribute('aria-expanded','false');
  if(next===state.key) return;
  const from=scaleForKey(state.key);
  const to=scaleForKey(next);
  state.pattern=state.pattern.map(note=>{
    let degree=from.indexOf(note.n);
    if(degree<0){
      const pitch=pitchOf(note.n);
      degree=from.reduce((best,name,index)=>Math.abs(pitchOf(name)-pitch)<Math.abs(pitchOf(from[best])-pitch)?index:best,0);
    }
    return {...note,n:to[degree]};
  });
  state.key=next;
  state.chords=(progressions[next]||[]).find(item=>item.name===state.chords.name)||progressions[next][0];
  saveProject();
  renderApp();
  notify(`Melody and chords moved to ${next}`);
}
function placeKeyMenu(){
  const anchor=document.querySelector('.key-menu');
  const list=document.querySelector('#key-list');
  if(!anchor||!list||list.hidden) return;
  const rect=anchor.getBoundingClientRect();
  const width=Math.max(rect.width,168);
  let left=rect.left;
  if(left+width>window.innerWidth-8) left=Math.max(8,window.innerWidth-8-width);
  list.style.left=`${left}px`;
  list.style.top=`${rect.bottom+6}px`;
  list.style.width=`${width}px`;
}
function setKeyMenuOpen(open){
  const list=document.querySelector('#key-list');
  const trigger=document.querySelector('#key');
  if(!list||!trigger) return;
  list.hidden=!open;
  trigger.setAttribute('aria-expanded',String(open));
  if(open) placeKeyMenu();
}
function generateMelody(){history.push(state.pattern.map(note=>({...note})));future=[];const scale=scaleForKey();state.idea=0;state.pattern=Array.from({length:8},(_,i)=>({n:scale[Math.floor(Math.random()*scale.length)],x:i*2+Math.floor(Math.random()*2),w:1+Math.floor(Math.random()*2)}));state.melodyAdded=true;saveProject();renderApp();scrollPianoToNotes();notify('Four melody ideas ready')}
function generateDrums(){
  const kit=sessionKits[state.kit];
  for(const lane of lanes) state.drums[lane]=new Set(kit.steps[lane]);
  for(const step of [1,3,7,9,11,15]) Math.random()>.4?state.drums.hat.add(step):state.drums.hat.delete(step);
  for(const step of [5,9,13]) Math.random()>.65?state.drums.kick.add(step):state.drums.kick.delete(step);
  if(['rnb','acoustic','trap'].includes(state.kit)){
    state.drums.snare.add(10);
    if(Math.random()>.5) state.drums.snare.add(14);
  }
  if(!state.drumsAdded) state.drumsAdded=true;
  saveProject();renderApp();notify('Beat humanized with ghost notes & dynamic groove');
}
function markDrumsInProject(){
  if(!state.drumsAdded){state.drumsAdded=true;saveProject()}
}
function generateChords(){const options=progressions[state.key]||progressions['A minor'];state.chords=options[Math.floor(Math.random()*options.length)];state.chordAdded=true;saveProject();renderApp();notify(`${state.chords.name} chords added`)}
function generateVocals(){
  const mood=(state.chips[0]||'R&B').toLowerCase();
  const seed=state.prompt.split(/[\s,]+/).filter(Boolean)[0]||'night';
  const lines=[
    {title:'Soft hook',line:`keep the ${seed} close, don’t say it loud`,chain:state.vocals.chain},
    {title:'Low refrain',line:`I still hear that ${mood} in the hallway`,chain:state.vocals.chain},
    {title:'Lift',line:`wait for the drop, then let the ${seed} bloom`,chain:state.vocals.chain}
  ];
  state.vocals=lines[Math.floor(Math.random()*lines.length)];
  state.vocalAdded=true;saveProject();renderApp();notify('Vocal idea added to the project');
}

const app=document.querySelector('#app');
app.innerHTML=`
  <main class="shell">
    <header class="topbar">
      <button class="brand" id="go-home" type="button"><span class="brand-mark">B</span><span>BMAI</span><small>STUDIO</small></button>
      <div class="project"><span class="project-dot"></span><strong id="project-title">Untitled idea</strong><span>Saved just now</span></div>
      <div class="top-actions"><button class="icon-btn" id="undo" title="Undo">↶</button><button class="outline-btn" id="go-export">Export</button><button class="avatar" id="go-account">BM</button></div>
    </header>
    <section class="transport">
      <div class="transport-controls"><button class="round" id="play" aria-label="Play">▶</button><button class="stop" id="stop" aria-label="Stop">■</button><span class="bar-count" title="Bar, beat, step">1 · 1 · 1</span></div>
      <div class="tempo">
        <label>BPM <input id="bpm" type="number" min="40" max="240" value="92" /></label>
        <button type="button" class="tap-tempo-btn" id="tap-tempo" title="Click rhythmically to set BPM">TAP</button>
        <span class="divider"></span>
        <label class="key-menu">KEY <button type="button" class="key-trigger" id="key" aria-haspopup="listbox" aria-expanded="false"><span id="key-value">A minor</span></button>
          <ul class="key-list" id="key-list" hidden role="listbox">
            ${allKeys.map(k=>`<li><button type="button" data-key="${k}" role="option">${k}</button></li>`).join('')}
          </ul>
        </label>
        <span class="divider"></span>
        <label title="MPC 16th swing groove">SWING <input id="swing" type="number" min="0" max="60" value="18" style="width:36px;" />%</label>
        <span class="divider"></span>
        <button class="metronome" id="metronome" type="button">♩</button>
      </div>
      <div class="transport-right">
        <div class="qwerty-indicator" id="qwerty-indicator" title="Play live using computer keyboard A-L (white) and W-O (black). Z/X shifts octave.">⌨ <span id="qwerty-oct">C4-D5</span></div>
        <span class="divider"></span>
        <canvas id="audio-visualizer" class="spectrum-canvas" width="105" height="24" title="Real-time Audio Spectrum Visualizer"></canvas>
        <span class="divider"></span>
        <span>4 / 4</span>
        <span class="divider"></span>
        <span>♬ 1/16</span>
      </div>
    </section>
    <button class="nav-toggle" id="nav-toggle" type="button" aria-controls="studio-nav" aria-expanded="true"><span aria-hidden="true">‹</span></button>
    <div class="workspace">
      <aside class="tools" id="studio-nav">
        <div class="sidebar-title">Studio <span>✦</span></div>
        <button class="tool" data-view="home"><i>□</i><span>Projects</span><small>home</small></button>
        <button class="tool" data-view="melody"><i>⌁</i><span>Melody</span><small>in this project</small></button>
        <button class="tool" data-view="drums"><i>◌</i><span>Drums</span><small>in this project</small></button>
        <button class="tool" data-view="chords"><i>⌗</i><span>Chords</span><small>in this project</small></button>
        <button class="tool" data-view="vocals"><i>◒</i><span>Vocals</span><small>in this project</small></button>
        <div class="sidebar-bottom">
          <button class="library">▣ &nbsp; Sound library</button>
          <button class="nav-link" data-view="mix">🎚 &nbsp; Mix</button>
          <button class="nav-link" data-view="export">↗ &nbsp; Export</button>
          <button class="settings" data-view="settings">⚙ &nbsp; Project settings</button>
        </div>
      </aside>
      <section class="main-stage" id="stage"></section>
      <aside class="inspector" id="inspector">
        <div class="inspector-sheet" id="inspector-sheet"></div>
      </aside>
      <button class="inspector-dock" id="inspector-dock" type="button" aria-label="Open project panel">
        <span class="preset-art"><span class="orb"></span><span id="dock-label">R&amp;B</span></span>
        <strong id="dock-name"></strong>
        <span class="dock-open">Open</span>
      </button>
    </div>
    <section class="piano-section" id="piano-section">
      <div class="piano-header">
        <div>
          <p class="piano-kicker"><span class="piano-dot"></span>PIANO ROLL</p>
          <strong id="piano-label">Keys · AI Melody 01</strong>
          <p class="piano-hint">Drag a note to move it. Drag the bright edge to change length. Click empty grid to add. Remove deletes the selected note.</p>
        </div>
        <div class="piano-tools">
          <div class="piano-selected" id="piano-selected">Click a note to edit it</div>
          <button class="ghost" id="remove-note" type="button" disabled>Remove</button>
          <select id="piano-inst" class="piano-inst-select" title="Change instrument"><option value="rhodes">Rhodes EP</option><option value="piano">Grand Piano</option><option value="guitar">Acoustic Guitar</option><option value="strings">Orchestral Strings</option><option value="bass">808 Bass</option><option value="brass">Synth Brass</option><option value="organ">Church Organ</option><option value="flute">Concert Flute</option><option value="pad">Lofi Pad</option><option value="analog">Analog Poly</option><option value="pluck">Crystal Pluck</option></select>
          <button class="ghost" data-roll="undo" type="button">Undo</button>
          <button class="ghost" data-roll="redo" type="button">Redo</button>
        </div>
      </div>
      <div class="roll-ruler" aria-hidden="true"><span class="ruler-key">KEY</span><div class="roll-beats"><span>Beat 1</span><span>Beat 2</span><span>Beat 3</span><span>Beat 4</span></div></div>
      <div class="piano-wrap" id="piano-wrap"><div class="keyboard" id="keyboard"></div><div class="grid" id="grid"><div class="playhead" id="playhead"></div></div></div>
    </section>
    <footer><span id="status-line"><b>Ready</b> · Local MVP session</span><span>Press <kbd>Space</kbd> to play</span></footer>
    <div class="library-modal" id="library-modal" hidden><div class="library-card"><div class="library-head"><div><span>CURATED FACTORY LIBRARY</span><h2 id="library-count">CC0 sound library</h2></div><button id="close-library">×</button></div><div class="library-tabs"><button type="button" class="lib-tab active" id="lib-tab-sounds">Factory Sounds &amp; Kits</button><button type="button" class="lib-tab" id="lib-tab-sources">Free Public Sources</button></div><div id="lib-view-sounds"><p>Production-ready drums, basses, loops and textures. Preview any sound or load a beat kit.</p><div class="kit-row"><span>Beat style</span><button type="button" data-kit="rnb" class="on">R&amp;B</button><button type="button" data-kit="house">House</button><button type="button" data-kit="trap">Trap</button><button type="button" data-kit="dnb">Drum &amp; bass</button><button type="button" data-kit="acoustic">Acoustic</button><button type="button" data-kit="dj">DJ Set</button></div><div class="library-tools"><input id="library-search" type="search" placeholder="Search kicks, bass, pads, breaks…" aria-label="Search sounds" /></div><div class="pack-row" id="pack-row"></div><div class="group-row" id="group-row"></div><div class="sound-groups" id="sound-groups"></div><div class="library-meta"><span id="library-status"></span><span>CC0 only · novelty effects excluded</span></div></div><div id="lib-view-sources" hidden><div class="sources-intro"><h3>Download free packs, scratches, and instruments</h3><p>Grab a royalty-free pack, then drop the wav or mp3 onto a drum lane, or pick Guitar, Strings, Organ, Flute, or Grand Piano in the piano roll.</p></div><div class="sources-grid"><div class="source-card"><div class="source-header"><h4>SampleRadar</h4><span class="source-badge">75,000+ SAMPLES</span></div><p>Royalty-free drums, breaks, 808s, and vintage keys.</p><div class="source-actions"><a class="source-link-btn" href="https://www.musicradar.com/news/tech/free-music-samples-royalty-free-loops-hits-and-multis-to-download" target="_blank" rel="noopener">Visit SampleRadar ↗</a></div></div><div class="source-card"><div class="source-header"><h4>Freesound CC0</h4><span class="source-badge cc0">CC0</span></div><p>Public-domain scratches, vocal chants, and drum machines.</p><div class="source-actions"><a class="source-link-btn" href="https://freesound.org/search/?q=license:creative_commons_0" target="_blank" rel="noopener">Search Freesound ↗</a></div></div><div class="source-card"><div class="source-header"><h4>Internet Archive</h4><span class="source-badge archive">ARCHIVE</span></div><p>Historic breaks, funk drums, and public-domain recordings.</p><div class="source-actions"><a class="source-link-btn" href="https://archive.org/details/audio" target="_blank" rel="noopener">Open Archive ↗</a></div></div><div class="source-card"><div class="source-header"><h4>FluidR3 GM</h4><span class="source-badge soundfont">128 INSTRUMENTS</span></div><p>Sampled guitar, strings, organ, and flute already playable in the piano roll.</p><div class="source-actions"><a class="source-link-btn" href="https://github.com/gleitz/midi-js-soundfonts" target="_blank" rel="noopener">View soundfonts ↗</a></div></div><div class="source-card"><div class="source-header"><h4>ccMixter &amp; Looperman</h4><span class="source-badge" style="background:#2d1b38;color:#ff9bd8;">FREE VOCALS</span></div><p>Over 30,000 royalty-free vocal acapellas, singing lines, and rap verses for BMAI AI Vocals.</p><div class="source-actions"><a class="source-link-btn" href="https://ccmixter.org/browse" target="_blank" rel="noopener">ccMixter ↗</a><a class="source-link-btn" href="https://www.looperman.com/acapellas" target="_blank" rel="noopener" style="margin-left:6px;">Looperman ↗</a></div></div></div></div></div></div>
  </main>
  <input type="file" id="import-json-file" accept=".json" style="display:none;" />
  <input type="file" id="drum-sample-input" accept="audio/*,.wav,.mp3,.ogg,.flac,.aif,.aiff,.m4a" style="display:none;" />
  <input type="file" id="vocal-file-input" accept="audio/*,.wav,.mp3,.ogg,.flac,.aif,.aiff,.m4a" style="display:none;" />
  <div class="toast"></div>
`;
const melodyIdeas = [
  {name:'Moonlit', tag:'Warm · expressive', feel:'A small phrase that lifts on beat 3.'},
  {name:'Velvet tide', tag:'Soft · rising', feel:'The line steps down, then turns back up.'},
  {name:'Afterglow', tag:'Sparse · intimate', feel:'Two notes, with room left for the vocal.'},
  {name:'Low signal', tag:'Moody · rhythmic', feel:'The higher notes land off the beat.'}
];
function arrangement(){
  const kit=sessionKits[state.kit];
  return `
    <div class="arrange-block">
    <div class="timeline-title"><span>${state.songMode?`SONG: ${(state.sections[state.songSection]?.name||'Intro').toUpperCase()}`:'1 BAR LOOP'}</span><div class="timeline-ruler"><span>1</span><span>2</span><span>3</span><span>4</span></div></div>
    <div class="arrangement ${(!isTrackActive('keys')||state.mix.keys.mute)?'muted-track':''}" data-arrange-track="keys"><div class="track-label"><span class="track-icon">♪</span><div><strong>Keys</strong><small>Electric piano</small></div></div><div class="clip"><span>${state.melodyAdded?esc(melodyIdeas[state.idea].name):'Empty clip'}</span><div class="mini-notes"></div></div></div>
    <div class="arrangement drum-track ${(!isTrackActive('drums')||state.mix.drums.mute)?'muted-track':''}" data-arrange-track="drums"><div class="track-label"><span class="track-icon">◌</span><div><strong>Drums</strong><small id="drum-kit-label">${esc(kit.blurb)}</small></div></div><div class="clip drum-clip"><span>Kick · Snare · Clap · Hat · Open Hat · Bass</span><div class="mini-notes"></div></div></div>
    ${state.chordAdded?`<div class="arrangement ${(!isTrackActive('chords')||state.mix.chords.mute)?'muted-track':''}" data-arrange-track="chords"><div class="track-label"><span class="track-icon">⌗</span><div><strong>Chords</strong><small>${esc(state.chords.name)}</small></div></div><div class="clip chord-clip"><span>${esc(state.chords.bars.join(' · '))}</span></div></div>`:''}
    ${state.vocalAdded?`<div class="arrangement ${(!isTrackActive('vocals')||state.mix.vocals.mute)?'muted-track':''}" data-arrange-track="vocals"><div class="track-label"><span class="track-icon">◒</span><div><strong>Vocals</strong><small>${esc(state.vocals.chain)}</small></div></div><div class="clip vocal-clip"><span>${esc(state.vocals.line)}</span></div></div>`:''}
    <div class="arrange-playhead" id="arrange-playhead"></div>

    <div class="song-structure-bar">
      <div class="song-structure-head">
        <div class="structure-mode-toggle">
          <button type="button" class="mode-pill ${state.songMode?'on':''}" id="toggle-song-mode" title="Toggle between single 1-bar loop and full song progression">
            <span class="mode-dot"></span> ${state.songMode ? 'SONG ARRANGEMENT ACTIVE' : 'LOOP MODE (1 BAR)'}
          </button>
        </div>
        <span class="structure-hint">${state.songMode ? `Current: ${state.sections[state.songSection].name.toUpperCase()} (playing)` : 'Click to enable multi-section song progression'}</span>
      </div>
      <div class="section-tiles">
        ${state.sections.map((sec, i) => `
          <div class="section-tile ${state.songSection === i ? 'active' : ''}" data-section-idx="${i}">
            <div class="section-top">
              <span class="sec-num">0${i+1}</span>
              <strong>${sec.name.toUpperCase()}</strong>
              <span class="sec-bars">${sec.bars} ${sec.bars === 1 ? 'bar' : 'bars'}</span>
            </div>
            <div class="section-track-tags">
              <span class="sec-tag ${sec.active.keys ? 'on' : ''}" data-toggle-sec-track="${i}" data-track="keys">Keys</span>
              <span class="sec-tag ${sec.active.drums ? 'on' : ''}" data-toggle-sec-track="${i}" data-track="drums">Drums</span>
              <span class="sec-tag ${sec.active.chords ? 'on' : ''}" data-toggle-sec-track="${i}" data-track="chords">Chords</span>
              <span class="sec-tag ${sec.active.vocals ? 'on' : ''}" data-toggle-sec-track="${i}" data-track="vocals">Vocals</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    </div>
  `;
}

let createKit='rnb';
function projectParts(project){
  const parts=[];
  if(project.melodyAdded) parts.push({label:'Melody',value:melodyIdeas[project.idea||0]?.name||'Melody'});
  if(project.drumsAdded) parts.push({label:'Drums',value:sessionKits[project.kit]?.blurb||'Drums'});
  if(project.chordAdded) parts.push({label:'Chords',value:project.chords?.name||'Chords'});
  if(project.vocalAdded) parts.push({label:'Vocals',value:project.vocals?.title||'Vocal'});
  return parts;
}
function contentsLine(project){
  const parts=projectParts(project);
  return parts.length?parts.map(part=>part.value).join(' · '):'Nothing added yet';
}
function backToProject(){
  return `<button class="back-project" data-view="home" type="button">← Back to ${esc(state.name)}</button>`;
}
function stageHome(){
  const projects=loadProjects();
  const current=projects.find(project=>project.id===state.id);
  const inside=projectParts(current||projectSnapshot());
  return `<div class="page-stack">
    <div class="stage-header"><div><p class="eyebrow">PROJECTS</p><h1>Make a project, then add the music into it.</h1></div><span class="session-pill">${projects.length} saved</span></div>
    <p class="page-lead">Melody, drums, and chords live inside a project. Create one first, jump in to write, then come back here to see what was saved.</p>
    ${current?`<section class="project-hub">
      <div class="inspector-title"><span>THIS PROJECT</span></div>
      <h2>${esc(current.name)}</h2>
      <p class="description">${esc(current.description||'No description yet.')}</p>
      <div class="details">${inside.length?inside.map(part=>`<div><span>${esc(part.label.toUpperCase())}</span><strong>${esc(part.value)}</strong></div>`).join(''):'<div><span>INSIDE</span><strong>Nothing added yet</strong></div>'}</div>
      <div class="genre-grid project-jumps">
        <button class="choice-card ${state.melodyAdded?'chosen':''}" data-view="melody" type="button"><strong>Melody</strong><small>${state.melodyAdded?esc(melodyIdeas[state.idea].name):'Not in this project yet'}</small></button>
        <button class="choice-card ${state.drumsAdded?'chosen':''}" data-view="drums" type="button"><strong>Drums</strong><small>${state.drumsAdded?esc(sessionKits[state.kit].blurb):'Not in this project yet'}</small></button>
        <button class="choice-card ${state.chordAdded?'chosen':''}" data-view="chords" type="button"><strong>Chords</strong><small>${state.chordAdded?esc(state.chords.name):'Not in this project yet'}</small></button>
        <button class="choice-card ${state.vocalAdded?'chosen':''}" data-view="vocals" type="button"><strong>Vocals</strong><small>${state.vocalAdded?esc(state.vocals.title):'Not in this project yet'}</small></button>
      </div>
    </section>`:''}
    <form class="take-box" id="create-project-form">
      <strong>New project</strong>
      <div class="form-grid">
        <label>Name<input id="new-project-name" value="Untitled idea"></label>
        <label>Starting kit<select id="new-project-kit">${Object.entries(kitNames).map(([id,name])=>`<option value="${id}" ${id===createKit?'selected':''}>${name}</option>`).join('')}</select></label>
        <label class="wide">Description<textarea id="new-project-description" rows="2" placeholder="Late-night R&amp;B sketch with a soft lead and a 909 pocket."></textarea></label>
      </div>
      <button class="page-btn hot" id="create-project" type="button">Create project</button>
    </form>
    <div class="project-list">${projects.map(project=>`<article class="project-face ${project.id===state.id?'current':''}">
      <div class="inspector-title"><span>${esc(sessionKits[project.kit]?.blurb||'PROJECT')}</span></div>
      <div class="preset-art"><div class="orb"></div><span>${esc(project.key||'A minor')}</span></div>
      <h2>${esc(project.name)}</h2>
      <p class="description">${esc(project.description||'No description yet.')}</p>
      <div class="details"><div><span>INSIDE</span><strong>${esc(contentsLine(project))}</strong></div><div><span>TEMPO</span><strong>${project.bpm||92} BPM</strong></div></div>
      <button class="add-project" data-open-project="${project.id}" type="button">${project.id===state.id?'This project':'Open project'}</button>
    </article>`).join('')||'<p class="page-lead">No projects saved yet. Create one above.</p>'}</div>
  </div>`;
}
function stageMelody(){
  return `<div class="page-stack">
    ${backToProject()}
    <div class="stage-header"><div><p class="eyebrow">AI MELODY</p><h1>Turn the feeling into a phrase.</h1></div><span class="session-pill">1 bar loop · ${state.bpm} BPM</span></div>
    <div class="generator">
      <div class="prompt"><span class="spark">✦</span><input id="prompt" value="${esc(state.prompt)}" aria-label="Describe melody" /><button id="generate">Generate <span>↗</span></button></div>
      <div class="chips">${['R&B','Dark','Smooth','Simple'].map(chip=>`<button class="chip ${state.chips.includes(chip)?'selected':''}" data-chip="${chip}">${chip}</button>`).join('')}<button class="chip settings-chip" data-open="settings">⚙ Options</button></div>
    </div>
    <div class="ideas-head"><span>4 GENERATED IDEAS</span><span class="hint">Choose one, then open Drums or Chords</span></div>
    <div class="ideas">${melodyIdeas.map((idea,i)=>`<article class="idea ${i===state.idea?'chosen':''}" data-idea="${i}"><div class="idea-number">0${i+1}</div><div class="wave">${Array.from({length:22},(_,x)=>`<i style="height:${14+Math.abs(Math.sin(x*1.4+i))*23}px"></i>`).join('')}</div><div class="idea-text"><strong>${idea.name}</strong><span>${idea.tag}</span></div><button class="add" data-add-melody>+</button></article>`).join('')}</div>
    ${arrangement()}
  </div>`;
}
function stageDrums(){
  const isPunch = state.drumPunch !== false;
  return `<div class="page-stack">
    ${backToProject()}
    <div class="stage-header"><div><p class="eyebrow">AI DRUMS</p><h1>Program the pocket, then humanize it.</h1></div><span class="session-pill">${esc(sessionKits[state.kit].blurb)}</span></div>
    <p class="page-lead">Drag &amp; drop your own <code>.wav</code> or <code>.mp3</code> samples onto any drum lane for commercial sound, or program the 6-lane kit below. <strong>Shift+Click</strong> or <strong>Right-Click</strong> any active step to cycle <strong>2x / 3x / 4x rolls &amp; ratchets</strong>. Need free samples? Browse <a href="#" id="lead-open-sources" style="color:#b391ff;text-decoration:underline;">SampleRadar, Freesound &amp; Archive.org</a>.</p>
    <div class="drum-top-bar">
      <div class="kit-row page-kits">${Object.entries(sessionKits).map(([id])=>`<button type="button" data-kit="${id}" class="${state.kit===id?'on':''}">${kitNames[id]}</button>`).join('')}</div>
      <button type="button" class="punch-btn ${isPunch?'on':''}" id="toggle-drum-punch" title="Analog soft-clipper saturation on drum bus">
        <span class="punch-led"></span> DRUM PUNCH (SOFT CLIP)
      </button>
    </div>
    <div class="drum-lanes">${lanes.map(lane=>{
      const hasCustom = !!customBuffers[lane];
      const sampleName = state.customSamples?.[lane] || 'Stock kit';
      const laneVol = Math.round((state.drumMix?.[lane]?.vol ?? 1.0) * 100);
      const lanePan = Math.round((state.drumMix?.[lane]?.pan ?? 0) * 100);
      return `<div class="drum-lane" data-lane-drop="${lane}">
        <div class="lane-info">
          <button type="button" class="lane-label-btn" data-preview-lane="${lane}" title="Click to preview ${lane}">
            <span class="preview-icon">▷</span>
            <strong>${lane.toUpperCase()}</strong>
          </button>
          ${lane==='bass'?`<button type="button" class="tuned-808-btn ${state.bassTuned!==false?'on':''}" id="toggle-tuned-808" title="Auto-tune 808 sub bass to chord progression root notes"><span class="pitch-dot"></span> TUNED 808</button>`:''}
          <div class="lane-sample-control">
            <button type="button" class="lane-sample-btn ${hasCustom?'has-custom':''}" data-pick-lane="${lane}" title="Drag &amp; drop audio file (.wav, .mp3) here or click to browse">
              <span class="sample-name" title="${esc(sampleName)}">${esc(sampleName)}</span>
              <span class="upload-icon">↑</span>
            </button>
            ${hasCustom ? `<button type="button" class="reset-sample-btn" data-reset-sample="${lane}" title="Reset to stock kit sample">×</button>` : ''}
          </div>
          <div class="lane-mix-controls">
            <label title="Track Volume: ${laneVol}%">VOL <input type="range" min="0" max="150" value="${laneVol}" data-lane-vol="${lane}" class="mini-slider" /></label>
            <label title="Stereo Pan: ${lanePan > 0 ? '+' + lanePan + 'R' : (lanePan < 0 ? lanePan + 'L' : 'C')}">PAN <input type="range" min="-100" max="100" value="${lanePan}" data-lane-pan="${lane}" class="mini-slider" /></label>
          </div>
        </div>
        <div class="steps">${Array.from({length:16},(_,step)=>{
          const isOn = state.drums[lane]?.has(step);
          const roll = state.drumRolls?.[lane]?.[step] || 1;
          return `<button class="step ${isOn?'on':''} ${step%4===0?'beat':''} ${playing&&sequenceStep===step?'now':''}" data-lane="${lane}" data-step="${step}" aria-label="${lane} step ${step+1}" title="${isOn ? (roll > 1 ? roll + 'x Roll (Right/Shift click to change)' : 'Active (Right/Shift click for 2x/3x/4x rolls)') : 'Click to add hit'}">${roll > 1 ? `<span class="roll-badge">${roll}x</span>` : ''}</button>`;
        }).join('')}</div>
      </div>`;
    }).join('')}</div>
    <div class="take-actions"><button class="page-btn hot" id="humanize-drums">Humanize beat</button><button class="page-btn" data-open="library">Browse kits</button><button class="page-btn" id="open-public-sources">🎁 Free Sound Packs</button></div>
    ${arrangement()}
  </div>`;
}

function stageChords(){
  const options = progressions[state.key] || progressions['A minor'] || [];
  const barCount = state.chords?.bars?.length > 4 ? (state.chords.bars.length / 4) + ' bars' : '1 bar';
  return `<div class="page-stack">
    ${backToProject()}
    <div class="stage-header"><div><p class="eyebrow">AI CHORDS</p><h1>Build a harmonic bed in ${esc(state.key)}.</h1></div><span class="session-pill">${esc(state.chords.bars.join(' · '))} (${barCount})</span></div>
    <p class="page-lead">Pick a chord progression in ${esc(state.key)}. Rich extended voicings (7ths, 9ths, 11ths) loop smoothly with your beat and export directly to MIDI.</p>
    <div class="ideas">${options.map(option=>`<article class="idea ${option.name===state.chords.name?'chosen':''}" data-chord="${esc(option.name)}"><div class="idea-number">${esc(option.bars[0])}</div><div class="idea-text"><strong>${esc(option.name)}</strong><span>${esc(option.feel)} · ${option.bars.length > 4 ? (option.bars.length / 4) + ' bars' : '1 bar'}</span></div></article>`).join('')}</div>
    <div class="chord-bars">${state.chords.bars.map((bar,i)=>`<div class="chord-bar"><span>BEAT ${i+1}</span><b>${esc(bar)}</b></div>`).join('')}</div>
    <div class="take-actions"><button class="page-btn hot" id="generate-chords">Regenerate in this key</button><button class="page-btn" id="add-chords">Add chords to project</button></div>
    ${arrangement()}
  </div>`;
}

const factoryVocals = [
  { name: 'Life Goes On', url: '/sounds/stargate/microlag/One-Shots/Vocals/Life_Goes_On.wav', tag: 'Melodic Hook · Soul' },
  { name: 'Fantastic', url: '/sounds/stargate/microlag/One-Shots/Vocals/Fantastic.wav', tag: 'Smooth Vocal Lead' },
  { name: 'December', url: '/sounds/stargate/microlag/One-Shots/Vocals/December.wav', tag: 'Singing Phrase · R&B' },
  { name: "I Hope It's Not Over", url: "/sounds/stargate/microlag/One-Shots/Vocals/I_Hope_It's_Not_Over.wav", tag: 'Emotional Refrain' },
  { name: "One Two Three Let's Go", url: "/sounds/stargate/microlag/One-Shots/Vocals/One_Two_Three_Let's_Go.wav", tag: 'Hype Drop · Energy' },
  { name: 'Check This Out', url: '/sounds/stargate/microlag/One-Shots/Vocals/Vocal_Check_This_Out.wav', tag: 'DJ Drop · Hip-Hop' },
  { name: 'Word Up', url: '/sounds/stargate/microlag/One-Shots/Vocals/Word_Up.wav', tag: 'Classic DJ Shout' },
  { name: 'Praise The Lord', url: '/sounds/stargate/microlag/One-Shots/Vocals/Praise_The_Lord.wav', tag: 'Gospel Hook' },
  { name: "That's Insane", url: "/sounds/stargate/microlag/One-Shots/Vocals/That's_Insane.wav", tag: 'Trap Energy Shout' },
  { name: 'Pretty Cool', url: '/sounds/stargate/microlag/One-Shots/Vocals/Pretty_Cool.wav', tag: 'Chill Phrase' },
  { name: 'Excuse Me', url: '/sounds/stargate/microlag/One-Shots/Vocals/Excuse_Me.wav', tag: 'Vocal Transition' },
  { name: 'Shine Muscat', url: '/sounds/stargate/microlag/One-Shots/Vocals/Shine_Muscat_Is_Bussin.wav', tag: 'Catchphrase Drop' }
];
async function useVocalSource(url, title){
  if(vocalUrl && vocalUrl.startsWith('blob:')) URL.revokeObjectURL(vocalUrl);
  vocalUrl = url;
  state.vocals = {...state.vocals, title: title || state.vocals.title, line: title || state.vocals.line};
  state.vocalAdded = true;
  await prepareVocalBuffer(url);
  saveProject();
  renderApp();
  playVocalOnce();
  notify(`${title || 'Vocal'} loaded`);
}
function stageVocals(){
  const chains=['Modern R&B','Dark rap','Lo-fi'];
  const ideas=[state.vocals,
    {title:'Low refrain',line:'I still hear that hallway echo'},
    {title:'Lift',line:'wait for the drop, then let it bloom'}
  ].filter((idea,index,list)=>list.findIndex(item=>item.title===idea.title)===index).slice(0,3);
  return `<div class="page-stack">
    ${backToProject()}
    <div class="stage-header"><div><p class="eyebrow">AI VOCALS</p><h1>Choose a free hook, drop, or record a take.</h1></div><span class="session-pill">${esc(state.vocals.chain)}</span></div>
    <p class="page-lead">Pick one of the built-in hooks, drop in a wav or mp3, or record with the microphone. The take stays in this browser.</p>
    <div class="ideas-head"><span>FREE BUILT-IN VOCAL HOOKS</span><span class="hint">Click any vocal to audition and load</span></div>
    <div class="factory-vocals-grid">${factoryVocals.map(v=>`<button type="button" class="vocal-card ${vocalUrl===v.url?'chosen':''}" data-load-vocal="${esc(v.url)}" data-vocal-title="${esc(v.name)}"><span class="vocal-icon">🎙</span><div class="vocal-info"><strong>${esc(v.name)}</strong><span>${esc(v.tag)}</span></div></button>`).join('')}</div>
    <div class="lyric-list">${ideas.map(idea=>`<button class="lyric-line ${idea.title===state.vocals.title?'chosen':''}" data-lyric="${esc(idea.title)}" data-line="${esc(idea.line)}"><strong>${esc(idea.title)}</strong><span> · ${esc(idea.line)}</span></button>`).join('')}</div>
    <div class="kit-row chain-row">${chains.map(chain=>`<button type="button" data-chain="${esc(chain)}" class="${state.vocals.chain===chain?'on':''}">${esc(chain)}</button>`).join('')}</div>
    <div class="take-box vocal-drop-box" id="vocal-drop-zone">
      <strong>${vocalUrl?esc(state.vocals.title||'Vocal loaded'):'Microphone or your own vocal file'}</strong>
      <p>${vocalUrl?'This vocal plays with the project and is included in the WAV export.':'Record, pick a hook above, or drop a wav or mp3 here.'}</p>
      <div class="waveform-box">
        <canvas id="vocal-waveform" class="waveform-canvas" width="480" height="64" title="Vocal Audio Waveform"></canvas>
      </div>
      <div class="take-actions">
        <button class="page-btn hot" id="record-vocal">Record mic</button>
        <button class="page-btn" id="stop-vocal">Stop</button>
        <button class="page-btn" id="play-vocal" ${vocalUrl?'':'disabled'}>Play vocal</button>
        <button class="page-btn" id="pick-vocal-file">Upload wav / mp3</button>
        ${vocalUrl?'<button class="page-btn" id="clear-vocal">Clear vocal</button>':''}
        <button class="page-btn" id="add-vocal">Add vocals to project</button>
      </div>
    </div>
    ${arrangement()}
  </div>`;
}

function drawVocalWaveform(){
  const canvas = document.querySelector('#vocal-waveform');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  ctx.strokeStyle = '#2d293d';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, h/2);
  ctx.lineTo(w, h/2);
  ctx.stroke();

  if(!vocalBuffer){
    ctx.fillStyle = '#655e75';
    ctx.font = '10px "DM Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('No audio recorded or loaded yet', w / 2, h / 2 + 4);
    return;
  }

  const raw = vocalBuffer.getChannelData(0);
  const step = Math.ceil(raw.length / w);
  const amp = h / 2 * 0.92;

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#c784e8');
  grad.addColorStop(1, '#ff96d2');
  ctx.fillStyle = grad;

  for(let i = 0; i < w; i++){
    let min = 1.0;
    let max = -1.0;
    for(let j = 0; j < step; j++){
      const datum = raw[(i * step) + j];
      if(datum < min) min = datum;
      if(datum > max) max = datum;
    }
    const barHeight = Math.max(2, (max - min) * amp);
    ctx.fillRect(i, (h / 2) - (max * amp), 1, barHeight);
  }
}

function stageMix(){
  const rows=[['keys','Keys'],['drums','Drums'],['chords','Chords'],['vocals','Vocals']];
  const filterVal = Number(state.fx?.filter ?? 0);
  const filterTag = filterVal === 0 ? 'Bypass' : (filterVal < 0 ? `Lowpass ${filterVal}` : `Highpass +${filterVal}`);
  const isLimiterOn = state.masterLimiter !== false;
  const isSidechainOn = state.sidechain !== false;

  return `<div class="page-stack">
    <div class="stage-header"><div><p class="eyebrow">MIX &amp; MASTER</p><h1>Polish dynamics, EQ and studio space.</h1></div><span class="session-pill">Faders · DSP EQ · Limiter</span></div>
    <p class="page-lead">Shape your tracks with the 3-Band Parametric EQ, engage commercial brickwall limiting, pump the kick with sidechain ducking, or sweep the master DJ filter.</p>

    <div class="mastering-row">
      <button type="button" class="master-btn ${isLimiterOn?'on':''}" id="toggle-master-limiter" title="Streaming Maximizer & Brickwall Limiter (-0.8dB Peak · +2.8dB Boost)">
        <span class="master-led"></span>
        <div class="master-btn-text">
          <strong>MASTER LIMITER &amp; MAXIMIZER</strong>
          <small>${isLimiterOn ? 'Active (-0.8dB Brickwall · +2.8dB Boost)' : 'Bypassed (Clean Headroom)'}</small>
        </div>
      </button>

      <button type="button" class="master-btn ${isSidechainOn?'on':''}" id="toggle-sidechain" title="Kick Sidechain Ducking (Ducks chords & bass under kick transient)">
        <span class="master-led"></span>
        <div class="master-btn-text">
          <strong>KICK SIDECHAIN DUCKING</strong>
          <small>${isSidechainOn ? 'Active (Pumps Chords & Bass on Kicks)' : 'Bypassed (Flat)'}</small>
        </div>
      </button>
    </div>

    <div class="fx-rack-card">
      <div class="fx-rack-header">
        <div class="fx-rack-title">
          <span class="fx-badge">STUDIO EQ</span>
          <strong>3-Band Master Parametric Equalizer</strong>
        </div>
        <button type="button" class="reset-eq-btn" id="reset-eq">Reset Flat</button>
      </div>
      <div class="fx-controls-grid eq-grid">
        <div class="fx-knob-box">
          <div class="fx-knob-label"><span>LOW SHELF (120 Hz)</span><b id="val-eq-low">${(state.eq?.low||0)>0?'+'+state.eq.low:state.eq?.low||0} dB</b></div>
          <input type="range" min="-12" max="12" step="0.5" value="${state.eq?.low||0}" id="eq-low" class="fx-slider" />
          <div class="fx-scale-labels"><span>-12dB Sub Cut</span><span>0dB Flat</span><span>+12dB Bass Boost</span></div>
        </div>
        <div class="fx-knob-box">
          <div class="fx-knob-label"><span>MID PEAK (1.2 kHz)</span><b id="val-eq-mid">${(state.eq?.mid||0)>0?'+'+state.eq.mid:state.eq?.mid||0} dB</b></div>
          <input type="range" min="-12" max="12" step="0.5" value="${state.eq?.mid||0}" id="eq-mid" class="fx-slider" />
          <div class="fx-scale-labels"><span>-12dB Scoop</span><span>0dB Flat</span><span>+12dB Clarity</span></div>
        </div>
        <div class="fx-knob-box">
          <div class="fx-knob-label"><span>HIGH SHELF (6.5 kHz)</span><b id="val-eq-high">${(state.eq?.high||0)>0?'+'+state.eq.high:state.eq?.high||0} dB</b></div>
          <input type="range" min="-12" max="12" step="0.5" value="${state.eq?.high||0}" id="eq-high" class="fx-slider" />
          <div class="fx-scale-labels"><span>-12dB Dark</span><span>0dB Flat</span><span>+12dB Air &amp; Sheen</span></div>
        </div>
      </div>
    </div>

    <div class="fx-rack-card">
      <div class="fx-rack-header">
        <div class="fx-rack-title">
          <span class="fx-badge">DSP RACK</span>
          <strong>Studio Space &amp; Master DJ Filter</strong>
        </div>
        <span class="fx-status-tag" id="fx-status-tag">${filterTag}</span>
      </div>
      <div class="fx-controls-grid">
        <div class="fx-knob-box">
          <div class="fx-knob-label"><span>DJ FILTER SWEEP</span><b id="val-fx-filter">${filterVal > 0 ? '+' + filterVal : filterVal}</b></div>
          <input type="range" min="-100" max="100" value="${filterVal}" id="fx-filter" class="fx-slider" />
          <div class="fx-scale-labels"><span>Lowpass (Club)</span><span>Flat</span><span>Highpass (Thin)</span></div>
        </div>
        <div class="fx-knob-box">
          <div class="fx-knob-label"><span>SPACE REVERB</span><b id="val-fx-reverb">${Math.round((state.fx?.reverb ?? 0.22) * 100)}%</b></div>
          <input type="range" min="0" max="100" value="${Math.round((state.fx?.reverb ?? 0.22) * 100)}" id="fx-reverb" class="fx-slider" />
          <div class="fx-scale-labels"><span>Dry</span><span>Warm Hall</span></div>
        </div>
        <div class="fx-knob-box">
          <div class="fx-knob-label"><span>STEREO DELAY</span><b id="val-fx-delay">${Math.round((state.fx?.delay ?? 0.15) * 100)}%</b></div>
          <input type="range" min="0" max="100" value="${Math.round((state.fx?.delay ?? 0.15) * 100)}" id="fx-delay" class="fx-slider" />
          <div class="fx-scale-labels"><span>Dry</span><span>3/16 Echo</span></div>
        </div>
      </div>
    </div>

    <div class="stage-header" style="margin-top:10px;"><div><p class="eyebrow">TRACK FADERS</p><h1>Stem Volumes</h1></div><span class="session-pill">Channel Gains</span></div>
    <div class="mix-stack">${rows.map(([id,name])=>`<div class="mix-row"><strong>${name}</strong><button data-mute="${id}" class="${state.mix[id].mute?'on':''}">${state.mix[id].mute?'Muted':'Mute'}</button><input type="range" min="0" max="100" value="${Math.round(state.mix[id].vol*100)}" data-vol="${id}" /><small>${Math.round(state.mix[id].vol*100)}%</small></div>`).join('')}</div>
    ${arrangement()}
  </div>`;
}

function stageExport(){
  return `<div class="page-stack">
    <div class="stage-header"><div><p class="eyebrow">EXPORT</p><h1>Take the idea into another DAW or release it.</h1></div><span class="session-pill">WAV + MIDI + JSON</span></div>

    <div class="export-card featured-export">
      <div class="export-badge-pill">STUDIO AUDIO (WAV)</div>
      <h3>Master Audio Mixdown (.wav)</h3>
      <p>Pristine 16-bit 44.1kHz stereo audio file with drum punch, pitched 808s, master brickwall limiter, 3-band EQ, and studio effects applied. Ready for TikTok, YouTube, CapCut, Instagram, or direct listening.</p>
      <div class="export-actions">
        <button class="page-btn hot" id="export-wav-master">Download Master (.wav)</button>
        <button class="page-btn" id="export-wav-stems">Download Stems (.wav)</button>
      </div>
    </div>

    <div class="export-card"><h3>Standard MIDI</h3><p>Complete multi-bar loop: Melody (Ch 1), Chords (Ch 2), Bass (Ch 3), and GM Drums (Ch 10 with Kick, Snare, Clap, Closed Hat, Open Hat, and Hi-Hat Rolls), ready for Ableton, FL Studio, Logic, or GarageBand.</p><div class="export-actions"><button class="page-btn hot" id="export-midi">Download .mid</button></div></div>
    <div class="export-card"><h3>BMAI project</h3><p>JSON snapshot of tempo, key, drums, rolls, pan/vol, chords, mix, and the vocal line so you can reopen or share this session.</p><div class="export-actions"><button class="page-btn hot" id="export-json">Download .json</button><button class="page-btn" id="import-json">Import .json</button></div></div>
    ${arrangement()}
  </div>`;
}

function stageSettings(){
  return `<div class="page-stack">
    <div class="stage-header"><div><p class="eyebrow">PROJECT SETTINGS</p><h1>Name the idea and lock the grid.</h1></div></div>
    <div class="form-grid">
      <label>Project name<input id="settings-name" value="${esc(state.name)}"></label>
      <label class="wide">Description<textarea id="settings-description" rows="2">${esc(state.description)}</textarea></label>
      <label>Tempo<input id="settings-bpm" type="number" min="40" max="240" value="${state.bpm}"></label>
      <label>Key<select id="settings-key">${allKeys.map(key=>`<option ${key===state.key?'selected':''}>${key}</option>`).join('')}</select></label>
      <label>Time signature<select id="settings-meter"><option>4 / 4</option></select></label>
    </div>
    <div class="take-actions"><button class="page-btn hot" id="save-settings">Save settings</button><button class="page-btn" id="import-json-settings">Import project</button><button class="page-btn" id="new-idea">Start a new idea</button></div>
  </div>`;
}

function inspectorCard(eyebrow,art,body){
  return `<div class="inspector-title"><span>${esc(eyebrow)}</span><button id="close-inspector" type="button" aria-label="Close panel">×</button></div><div class="preset-art"><div class="orb"></div><span>${esc(art)}</span></div>${body}`;
}
function inspectorFor(){
  if(state.view==='home') return inspectorCard('THIS PROJECT',state.key,`<h2>${esc(state.name)}</h2><p class="description">${esc(state.description||'No description yet.')}</p><div class="details"><div><span>INSIDE</span><strong>${esc(contentsLine(projectSnapshot()))}</strong></div></div>`);
  if(state.view==='drums') return inspectorCard('DRUM KIT',state.kit.toUpperCase(),`<h2>${esc(sessionKits[state.kit].blurb)}</h2><p class="description">16-step grid, four lanes. Humanize moves hats and ghost kicks without wiping the kit.</p><button class="full-preview" id="preview">▷ &nbsp; Preview beat</button><button class="add-project" id="humanize-drums">Humanize beat</button>`);
  if(state.view==='chords') return inspectorCard('PROGRESSION',state.key,`<h2>${esc(state.chords.name)}</h2><p class="description">${esc(state.chords.feel)}</p><div class="details"><div><span>BARS</span><strong>${esc(state.chords.bars.join(' · '))}</strong></div></div><button class="add-project" id="add-chords">+ &nbsp; Add to project</button>`);
  if(state.view==='vocals') return inspectorCard('VOCAL',state.vocals.chain,`<h2>${esc(state.vocals.title)}</h2><p class="description">${esc(state.vocals.line)}</p><button class="add-project" id="add-vocal">+ &nbsp; Add to project</button><button class="text-btn" id="generate-vocals">↻ &nbsp; New hook</button>`);
  if(state.view==='mix') return inspectorCard('MIX','BALANCE',`<h2>Session balance</h2><p class="description">Muted tracks stay in the arrangement but do not play. Export still includes their MIDI.</p>`);
  if(state.view==='export') return inspectorCard('EXPORT','MIDI',`<h2>Ready to leave</h2><p class="description">MIDI for the DAW, JSON to reopen this BMAI session.</p><button class="add-project" id="export-midi">Download MIDI</button>`);
  if(state.view==='settings') return inspectorCard('SETTINGS',state.key,`<h2>${esc(state.name)}</h2><p class="description">Changes apply to every page in this session.</p>`);
  const idea=melodyIdeas[state.idea]||melodyIdeas[0];
  return inspectorCard(`IDEA 0${state.idea+1}`,state.chips.join(' / ')||'R&B',`<h2>${esc(idea.name)}</h2><p class="description">${esc(idea.feel)} It loops for one bar.</p><div class="details"><div><span>KEY</span><strong>${esc(state.key)}</strong></div><div><span>SWING</span><strong>${state.swing}%</strong></div></div><div style="margin:14px 0 6px;"><span style="font:9px 'DM Mono';letter-spacing:.12em;color:#9b99a8;text-transform:uppercase;">Keys Instrument</span><div class="kit-row inst-kit-row" style="margin-top:6px;"><button type="button" data-inst="rhodes" class="${state.instrument==='rhodes'?'on':''}">Rhodes EP</button><button type="button" data-inst="piano" class="${state.instrument==='piano'?'on':''}">Grand Piano</button><button type="button" data-inst="guitar" class="${state.instrument==='guitar'?'on':''}">Acoustic Guitar</button><button type="button" data-inst="strings" class="${state.instrument==='strings'?'on':''}">Strings</button><button type="button" data-inst="bass" class="${state.instrument==='bass'?'on':''}">808 Bass</button><button type="button" data-inst="brass" class="${state.instrument==='brass'?'on':''}">Synth Brass</button><button type="button" data-inst="organ" class="${state.instrument==='organ'?'on':''}">Organ</button><button type="button" data-inst="flute" class="${state.instrument==='flute'?'on':''}">Flute</button><button type="button" data-inst="pad" class="${state.instrument==='pad'?'on':''}">Lofi Pad</button><button type="button" data-inst="analog" class="${state.instrument==='analog'?'on':''}">Analog</button><button type="button" data-inst="pluck" class="${state.instrument==='pluck'?'on':''}">Pluck</button></div></div><button class="full-preview" id="preview">▷ &nbsp; Preview loop</button><button class="add-project" id="add-project">+ &nbsp; Add to project</button><button class="text-btn" id="regenerate">↻ &nbsp; Regenerate this idea</button>`);
}

let isResizing = false;
let isMoving = false;

function placeNoteEl(el,p){
  const y=notes.indexOf(p.n);
  el.style.top=`${Math.max(0,y)*16+1}px`;
  el.style.left=`${p.x*6.25}%`;
  el.style.width=`${Math.max(p.w*6.25-0.4,2)}%`;
  el.classList.toggle('short',p.w<2);
  const label=el.querySelector('.note-pitch');
  if(label) label.textContent=p.w>=2?p.n:'';
  el.title=`${p.n} · beat ${Math.floor(p.x/4)+1} · ${p.w} ${p.w===1?'step':'steps'} — drag to move, right edge to length`;
}
function updatePianoChrome(){
  const box=document.querySelector('#piano-selected');
  const remove=document.querySelector('#remove-note');
  const p=state.pattern[selectedNote];
  if(box) box.textContent=p?`${p.n}  ·  beat ${Math.floor(p.x/4)+1}  ·  ${p.w} ${p.w===1?'step':'steps'}`:'Click a note to edit it';
  if(remove) remove.disabled=!p;
}
function highlightPianoRow(index){
  const wrap=document.querySelector('#piano-wrap');
  const grid=document.querySelector('#grid');
  if(wrap) wrap.querySelectorAll('.key').forEach((key,i)=>key.classList.toggle('over',i===index));
  if(grid) grid.style.setProperty('--hover',index>=0?`${index*16}px`:'-40px');
}
function pianoCoords(event){
  const grid=document.querySelector('#grid');
  if(!grid) return null;
  const rect=grid.getBoundingClientRect();
  if(rect.width<4) return null;
  const x=(event.clientX-rect.left)/rect.width;
  const y=event.clientY-rect.top;
  return {
    step:Math.max(0,Math.min(15,Math.floor(x*16))),
    noteIndex:Math.max(0,Math.min(notes.length-1,Math.floor(y/16)))
  };
}
function removeSelectedNote(){
  if(selectedNote<0||!state.pattern[selectedNote]) return;
  const gone=state.pattern[selectedNote];
  history.push(state.pattern.map(note=>({...note})));
  future=[];
  state.pattern.splice(selectedNote,1);
  selectedNote=-1;
  saveProject();
  renderPiano();
  notify(`Removed ${gone.n}`);
}

function renderPiano(){
  const keyboard=document.querySelector('#keyboard'); const grid=document.querySelector('#grid'); const wrap=document.querySelector('#piano-wrap');
  if(!keyboard||!grid) return;
  const scale=scaleForKey();
  const scaleNames=new Set(scale.map(n=>n.replace(/\d+$/,'')));
  keyboard.innerHTML=notes.map(n=>{
    const name=n.replace(/\d+$/,'');
    const on=scale.includes(n)||scaleNames.has(name);
    return `<button type="button" class="key ${white(n)?'white':'black'}${on?' in-scale':''}" data-note="${n}"><span>${n}</span></button>`;
  }).join('');
  const rows=notes.map((n,i)=>`${white(n)?'#161722':'#101119'} ${i*16}px ${(i+1)*16}px`).join(',');
  grid.style.background=`repeating-linear-gradient(90deg,transparent 0 calc(25% - 1px),#3c3d4c 0 25%),repeating-linear-gradient(90deg,transparent 0 calc(6.25% - 1px),#2a2b38 0 6.25%),linear-gradient(${rows})`;
  grid.querySelectorAll('.note').forEach(el=>el.remove());
  state.pattern.forEach((p,i)=>{
    if(notes.indexOf(p.n)<0) return;
    const el=document.createElement('div');
    el.className='note';
    el.dataset.i=i;
    if(selectedNote===i) el.classList.add('selected');
    const label=document.createElement('span');
    label.className='note-pitch';
    const handle=document.createElement('span');
    handle.className='note-handle';
    handle.title='Drag to change length';
    el.append(label,handle);
    placeNoteEl(el,p);
    grid.append(el);
  });
  updatePianoChrome();
  if(wrap&&!wrap.dataset.scrolled){
    scrollPianoToNotes();
    wrap.dataset.scrolled='true';
  }
}

function bindPianoEditor(){
  const grid=document.querySelector('#grid');
  const wrap=document.querySelector('#piano-wrap');
  const remove=document.querySelector('#remove-note');
  const inst=document.querySelector('#piano-inst');
  if(remove&&!remove.dataset.bound){
    remove.dataset.bound='true';
    remove.addEventListener('click',removeSelectedNote);
  }
  if(inst&&!inst.dataset.bound){
    inst.dataset.bound='true';
    inst.addEventListener('change',event=>{
      state.instrument=event.target.value;
      triggerSoundfontLoad(state.instrument);
      saveProject();
      try{tone('C5',.45,.12,state.instrument)}catch{}
      renderApp();
      const instNames={rhodes:'Neo-Soul Rhodes',piano:'Acoustic Grand Piano',guitar:'FluidR3 Acoustic Guitar',strings:'FluidR3 Strings Ensemble',bass:'808 Sub Bass',brass:'80s Synth Brass',organ:'FluidR3 Church Organ',flute:'FluidR3 Concert Flute',pad:'Lofi Ambient Pad',analog:'Analog Poly',pluck:'Crystal Pluck'};
      notify(`${instNames[state.instrument]||'Keyboard'} loaded`);
    });
  }
  if(wrap&&!wrap.dataset.keysBound){
    wrap.dataset.keysBound='true';
    wrap.addEventListener('click',event=>{
      const key=event.target.closest('.key');
      if(!key) return;
      const noteName=key.dataset.note;
      if(noteName) try{tone(noteName,.32,.12)}catch{}
    });
    wrap.addEventListener('pointermove',event=>{
      if(event.target.closest('.note')) return;
      const key=event.target.closest('.key');
      if(key){
        highlightPianoRow([...wrap.querySelectorAll('.key')].indexOf(key));
        return;
      }
      if(event.target.closest('#grid')){
        const pos=pianoCoords(event);
        highlightPianoRow(pos?pos.noteIndex:-1);
      }
    });
    wrap.addEventListener('pointerleave',()=>highlightPianoRow(-1));
  }
  if(!grid||grid.dataset.bound) return;
  grid.dataset.bound='true';
  let drag=null;

  grid.addEventListener('pointerdown',event=>{
    if(event.button!==0) return;
    const pos=pianoCoords(event);
    if(!pos) return;
    const noteEl=event.target.closest('.note');
    if(noteEl){
      const i=Number(noteEl.dataset.i);
      const p=state.pattern[i];
      if(!p) return;
      selectedNote=i;
      drag={
        mode:event.target.closest('.note-handle')?'resize':'move',
        index:i,
        from:{n:p.n,x:p.x,w:p.w},
        start:pos,
        moved:false
      };
      isResizing=drag.mode==='resize';
      isMoving=drag.mode==='move';
      document.querySelectorAll('.note').forEach(n=>n.classList.toggle('selected',n===noteEl));
      updatePianoChrome();
      try{grid.setPointerCapture(event.pointerId)}catch{}
      event.preventDefault();
      return;
    }
    drag={mode:'add',start:pos,moved:false};
    try{grid.setPointerCapture(event.pointerId)}catch{}
  });

  grid.addEventListener('pointermove',event=>{
    if(!drag||drag.mode==='add') return;
    const p=state.pattern[drag.index];
    const el=grid.querySelector(`.note[data-i="${drag.index}"]`);
    if(!p||!el) return;
    const pos=pianoCoords(event);
    if(!pos) return;
    if(drag.mode==='resize'){
      const nextW=Math.max(1,Math.min(16-p.x,drag.from.w+(pos.step-drag.start.step)));
      if(nextW!==p.w){
        p.w=nextW;
        drag.moved=true;
        placeNoteEl(el,p);
        updatePianoChrome();
      }
      return;
    }
    const nextX=Math.max(0,Math.min(16-p.w,drag.from.x+(pos.step-drag.start.step)));
    const nextN=notes[pos.noteIndex]||p.n;
    if(nextX!==p.x||nextN!==p.n){
      p.x=nextX;
      if(nextN!==p.n){
        p.n=nextN;
        try{tone(p.n,.1,.08)}catch{}
      }
      drag.moved=true;
      placeNoteEl(el,p);
      updatePianoChrome();
    }
  });

  const endDrag=()=>{
    if(!drag) return;
    const current=drag;
    drag=null;
    isResizing=false;
    isMoving=false;
    if(current.mode==='add'){
      const noteName=notes[current.start.noteIndex];
      if(!noteName) return;
      if(state.pattern.some(note=>note.n===noteName&&note.x===current.start.step)) return;
      history.push(state.pattern.map(note=>({...note})));
      future=[];
      state.pattern.push({n:noteName,x:current.start.step,w:1});
      state.melodyAdded=true;
      selectedNote=state.pattern.length-1;
      try{tone(noteName,.28,.12)}catch{}
      saveProject();
      renderPiano();
      notify(`Added ${noteName} at step ${current.start.step+1}`);
      return;
    }
    if(current.moved){
      history.push(state.pattern.map(note=>({...note})));
      future=[];
      state.melodyAdded=true;
      saveProject();
      renderPiano();
      const p=state.pattern[current.index];
      if(p) notify(`${p.n} · step ${p.x+1}`);
      return;
    }
    selectedNote=current.index;
    updatePianoChrome();
    document.querySelectorAll('.note').forEach(n=>n.classList.toggle('selected',Number(n.dataset.i)===selectedNote));
  };
  grid.addEventListener('pointerup',endDrag);
  grid.addEventListener('pointercancel',endDrag);
}

function scrollPianoToNotes(){
  const wrap=document.querySelector('#piano-wrap');
  if(!wrap) return;
  if(state.pattern?.length){
    const yPositions=state.pattern.map(p=>notes.indexOf(p.n)).filter(y=>y>=0);
    if(yPositions.length){
      const minY=Math.min(...yPositions);
      const maxY=Math.max(...yPositions);
      const centerPx=((minY+maxY)/2)*16;
      const target=Math.max(0,Math.min(592-wrap.clientHeight,centerPx-wrap.clientHeight/2));
      wrap.scrollTop=target;
      return;
    }
  }
  wrap.scrollTop=30;
}

function renderApp(){
  const stages={home:stageHome,melody:stageMelody,drums:stageDrums,chords:stageChords,vocals:stageVocals,mix:stageMix,export:stageExport,settings:stageSettings};
  document.querySelector('#stage').innerHTML=(stages[state.view]||stageMelody)();
  const inspectorSheet=document.querySelector('#inspector-sheet');
  if(inspectorSheet) inspectorSheet.innerHTML=inspectorFor();
  const dockLabel=document.querySelector('#dock-label');
  const dockName=document.querySelector('#dock-name');
  if(dockLabel) dockLabel.textContent=inspectorArtLabel();
  if(dockName) dockName.textContent=state.name;
  document.querySelector('#project-title').textContent=state.name;
  document.querySelector('#bpm').value=state.bpm;
  const keyValue=document.querySelector('#key-value');
  if(keyValue) keyValue.textContent=state.key;
  document.querySelectorAll('#key-list [data-key]').forEach(button=>button.classList.toggle('on',button.dataset.key===state.key));
  const swingEl=document.querySelector('#swing');
  if(swingEl) swingEl.value=state.swing??18;
  document.querySelector('#key').value=state.key;
  document.querySelectorAll('.tool[data-view]').forEach(button=>button.classList.toggle('active',button.dataset.view===state.view));
  document.querySelectorAll('.nav-link, .settings').forEach(button=>button.classList.toggle('on',button.dataset.view===state.view));
  document.querySelector('#piano-section').hidden=!['melody','chords'].includes(state.view);
  const instNames={rhodes:'Rhodes',analog:'Analog',pluck:'Pluck',piano:'Piano',guitar:'Guitar',strings:'Strings',bass:'Bass',brass:'Brass',organ:'Organ',flute:'Flute',pad:'Pad'};
  const chordLen = state.chords?.bars?.length > 4 ? (state.chords.bars.length / 4) + ' bars' : '1 bar';
  const pianoLabel=document.querySelector('#piano-label');
  if(pianoLabel) pianoLabel.textContent=state.view==='chords'?`Chords · ${state.chords.name} · ${chordLen}`:`Keys (${instNames[state.instrument]||'Rhodes'}) · ${melodyIdeas[state.idea].name} · 1 bar`;
  const pianoInst=document.querySelector('#piano-inst');
  if(pianoInst) pianoInst.value=state.instrument||'rhodes';
  document.querySelector('#status-line').innerHTML=`<b>Ready</b> · ${esc(state.key)} · ${state.swing}% swing · Limiter ${state.masterLimiter!==false?'ON':'BYPASS'}`;
  document.querySelectorAll('[data-kit]').forEach(button=>button.classList.toggle('on',button.dataset.kit===state.kit));
  renderPiano();
  bindPianoEditor();
  if(state.view === 'vocals'){
    drawVocalWaveform();
  }
  const qwertyOctEl = document.querySelector('#qwerty-oct');
  if(qwertyOctEl) qwertyOctEl.textContent = `C${qwertyOctave}-D${qwertyOctave+1}`;
  applyStudioLayout();
  initVisualizer();
}

let songBarCount = 0;

function updateSectionUI(){
  document.querySelectorAll('.section-tile').forEach((el, idx)=>{
    el.classList.toggle('active', idx === state.songSection);
  });
  const hint = document.querySelector('.structure-hint');
  if(hint && state.songMode && state.sections[state.songSection]){
    hint.textContent = `Current: ${state.sections[state.songSection].name.toUpperCase()} (playing)`;
  }
  const timelineTitle = document.querySelector('.timeline-title span');
  if(timelineTitle){
    timelineTitle.textContent = state.songMode 
      ? `SONG: ${(state.sections[state.songSection]?.name||'Intro').toUpperCase()}` 
      : '1 BAR LOOP';
  }
  ['keys', 'drums', 'chords', 'vocals'].forEach(t => {
    const el = document.querySelector(`[data-arrange-track="${t}"]`);
    if(el){
      el.classList.toggle('muted-track', !isTrackActive(t) || !!state.mix[t]?.mute);
    }
  });
}

function setPlaying(on){
  playing=on;
  clearTimeout(timer);
  clearInterval(timer);
  document.querySelector('#play').textContent=on?'Ⅱ':'▶';

  const placePlayhead=step=>{
    const block=document.querySelector('.arrange-block');
    if(block)block.style.setProperty('--play',`${step/16}`);
    const head=document.querySelector('#playhead');
    if(head)head.style.left=(step/16)*100+'%';
    const barNum = state.songMode ? (state.songSection + 1) : 1;
    const barEl = document.querySelector('.bar-count');
    if(barEl) barEl.textContent=`${barNum} · ${Math.floor(step/4)+1} · ${(step%4)+1}`;
    document.querySelectorAll('.note').forEach(el => {
      const i = Number(el.dataset.i);
      const note = state.pattern[i];
      if(note){
        const isNow = playing && step >= note.x && step < (note.x + note.w);
        el.classList.toggle('playing', isNow);
      }
    });
  };

  if(!on){
    stopToneLoop();
    sequenceStep = 0;
    placePlayhead(0);
    document.querySelectorAll('.step.now').forEach(step=>step.classList.remove('now'));
    document.querySelectorAll('.note.playing').forEach(el=>el.classList.remove('playing'));
    if(state.songMode){
      state.songSection = 0;
      updateSectionUI();
    }
    return;
  }

  audioContext ||= new AudioContext();
  audioContext.resume();
  initMasterChain();
  initVisualizer();
  sequenceStep = 0;
  songBarCount = 0;
  triggerToneLead(sequenceStep);
  playDrumStep(sequenceStep);
  placePlayhead(sequenceStep);
  startToneLoop();
}

function renderOfflineTone(ctx, dest, note, time, duration, volume, instrument){
  const freq = noteFrequency(note);
  if(!freq || isNaN(freq)) return;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(Math.max(volume, 0.0001), time);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
  masterGain.connect(dest);

  if(instrument === 'piano'){
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3600, time);
    filter.frequency.exponentialRampToValueAtTime(900, time + duration);
    filter.Q.value = 0.7;
    filter.connect(masterGain);

    const osc1 = ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.value = freq;
    const g1 = ctx.createGain();
    g1.gain.setValueAtTime(0.75, time);
    g1.gain.exponentialRampToValueAtTime(0.001, time + duration);
    osc1.connect(g1).connect(filter);
    osc1.start(time);
    osc1.stop(time + duration + 0.05);

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 2;
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.35, time);
    g2.gain.exponentialRampToValueAtTime(0.0005, time + duration * 0.85);
    osc2.connect(g2).connect(filter);
    osc2.start(time);
    osc2.stop(time + duration + 0.05);

    const oscHammer = ctx.createOscillator();
    oscHammer.type = 'sine';
    oscHammer.frequency.value = freq * 4.1;
    const gHammer = ctx.createGain();
    gHammer.gain.setValueAtTime(0.4, time);
    gHammer.gain.exponentialRampToValueAtTime(0.0001, time + Math.min(0.06, duration * 0.2));
    oscHammer.connect(gHammer).connect(filter);
    oscHammer.start(time);
    oscHammer.stop(time + 0.08);
    return;
  }

  if(instrument === 'guitar'){
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2600, time);
    filter.frequency.exponentialRampToValueAtTime(650, time + duration * 0.7);
    filter.Q.value = 1.1;
    filter.connect(masterGain);

    const osc1 = ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.value = freq;
    const g1 = ctx.createGain();
    g1.gain.setValueAtTime(0.7, time);
    g1.gain.exponentialRampToValueAtTime(0.001, time + duration * 0.9);
    osc1.connect(g1).connect(filter);
    osc1.start(time);
    osc1.stop(time + duration + 0.05);

    const osc2 = ctx.createOscillator();
    osc2.type = 'sawtooth';
    osc2.frequency.value = freq * 2;
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.22, time);
    g2.gain.exponentialRampToValueAtTime(0.0001, time + Math.min(0.18, duration * 0.5));
    osc2.connect(g2).connect(filter);
    osc2.start(time);
    osc2.stop(time + 0.22);
    return;
  }

  if(instrument === 'strings'){
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1800;
    filter.Q.value = 0.6;
    filter.connect(masterGain);

    const attack = Math.min(0.18, duration * 0.35);
    [-7, 7].forEach(detune => {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      osc.detune.value = detune;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.001, time);
      g.gain.linearRampToValueAtTime(0.42, time + attack);
      g.gain.exponentialRampToValueAtTime(0.01, time + duration + 0.15);
      osc.connect(g).connect(filter);
      osc.start(time);
      osc.stop(time + duration + 0.2);
    });
    return;
  }

  if(instrument === 'organ'){
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 3800;
    filter.Q.value = 0.5;
    filter.connect(masterGain);

    [
      { mult: 0.5, gain: 0.35 },
      { mult: 1.0, gain: 0.55 },
      { mult: 1.5, gain: 0.22 },
      { mult: 2.0, gain: 0.28 }
    ].forEach(harm => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq * harm.mult;
      const g = ctx.createGain();
      g.gain.setValueAtTime(harm.gain, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + duration);
      osc.connect(g).connect(filter);
      osc.start(time);
      osc.stop(time + duration + 0.05);
    });
    return;
  }

  if(instrument === 'flute'){
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400 + freq * 0.8, time);
    filter.Q.value = 0.6;
    filter.connect(masterGain);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.72, time);
    g.gain.exponentialRampToValueAtTime(0.01, time + duration);
    osc.connect(g).connect(filter);
    osc.start(time);
    osc.stop(time + duration + 0.05);

    const oscHarm = ctx.createOscillator();
    oscHarm.type = 'sine';
    oscHarm.frequency.value = freq * 2;
    const gHarm = ctx.createGain();
    gHarm.gain.setValueAtTime(0.15, time);
    gHarm.gain.exponentialRampToValueAtTime(0.001, time + duration * 0.7);
    oscHarm.connect(gHarm).connect(filter);
    oscHarm.start(time);
    oscHarm.stop(time + duration + 0.05);

    const oscBreath = ctx.createOscillator();
    oscBreath.type = 'triangle';
    oscBreath.frequency.value = freq * 3;
    const gBreath = ctx.createGain();
    gBreath.gain.setValueAtTime(0.06, time);
    gBreath.gain.exponentialRampToValueAtTime(0.0001, time + Math.min(0.1, duration * 0.3));
    oscBreath.connect(gBreath).connect(filter);
    oscBreath.start(time);
    oscBreath.stop(time + 0.12);
    return;
  }

  if(instrument === 'bass'){
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1800;
    filter.connect(masterGain);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 1.5, time);
    osc.frequency.exponentialRampToValueAtTime(freq, time + 0.028);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.9, time);
    g.gain.exponentialRampToValueAtTime(0.01, time + duration);
    osc.connect(g).connect(filter);
    osc.start(time);
    osc.stop(time + duration + 0.05);
    return;
  }

  if(instrument === 'brass'){
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, time);
    filter.frequency.exponentialRampToValueAtTime(3600, time + 0.06);
    filter.frequency.exponentialRampToValueAtTime(1200, time + duration);
    filter.Q.value = 2.0;
    filter.connect(masterGain);

    [-9, 9].forEach(detune => {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      osc.detune.value = detune;
      const g = ctx.createGain();
      g.gain.value = 0.35;
      osc.connect(g).connect(filter);
      osc.start(time);
      osc.stop(time + duration + 0.05);
    });
    return;
  }

  if(instrument === 'pad'){
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1500;
    filter.Q.value = 0.8;
    filter.connect(masterGain);

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    const g = ctx.createGain();
    const attack = Math.min(0.14, duration * 0.4);
    g.gain.setValueAtTime(0.0001, time);
    g.gain.linearRampToValueAtTime(0.65, time + attack);
    g.gain.exponentialRampToValueAtTime(0.01, time + duration + 0.1);
    osc.connect(g).connect(filter);
    osc.start(time);
    osc.stop(time + duration + 0.12);
    return;
  }

  if(instrument === 'analog'){
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, time);
    filter.frequency.exponentialRampToValueAtTime(450, time + duration);
    filter.Q.value = 1.1;
    filter.connect(masterGain);

    [-7, 7].forEach(detune => {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      osc.detune.value = detune;
      const g = ctx.createGain();
      g.gain.value = 0.25;
      osc.connect(g).connect(filter);
      osc.start(time);
      osc.stop(time + duration + 0.04);
    });
    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.value = freq;
    const subG = ctx.createGain();
    subG.gain.value = 0.45;
    sub.connect(subG).connect(filter);
    sub.start(time);
    sub.stop(time + duration + 0.04);
    return;
  }

  if(instrument === 'pluck'){
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 2.2, time);
    filter.frequency.exponentialRampToValueAtTime(freq, time + duration);
    filter.Q.value = 1.8;
    filter.connect(masterGain);

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    osc.connect(filter);
    osc.start(time);
    osc.stop(time + duration + 0.04);
    return;
  }

  // Rhodes default
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2600, time);
  filter.frequency.exponentialRampToValueAtTime(750, time + duration);
  filter.Q.value = 0.6;
  filter.connect(masterGain);

  const oscBody = ctx.createOscillator();
  oscBody.type = 'sine';
  oscBody.frequency.value = freq;
  const gainBody = ctx.createGain();
  gainBody.gain.setValueAtTime(0.65, time);
  gainBody.gain.exponentialRampToValueAtTime(0.01, time + duration);
  oscBody.connect(gainBody).connect(filter);
  oscBody.start(time);
  oscBody.stop(time + duration + 0.05);

  const tineFreq = freq * 3.98;
  if(tineFreq < 18000){
    const oscTine = ctx.createOscillator();
    oscTine.type = 'sine';
    oscTine.frequency.value = tineFreq;
    const gainTine = ctx.createGain();
    gainTine.gain.setValueAtTime(0.35, time);
    gainTine.gain.exponentialRampToValueAtTime(0.0001, time + Math.min(0.11, duration * 0.4));
    oscTine.connect(gainTine).connect(filter);
    oscTine.start(time);
    oscTine.stop(time + 0.14);
  }

  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.value = freq * 2;
  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(0.22, time);
  gain2.gain.exponentialRampToValueAtTime(0.001, time + duration * 0.75);
  osc2.connect(gain2).connect(filter);
  osc2.start(time);
  osc2.stop(time + duration + 0.05);
}

function audioBufferToWav(buffer){
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const left = buffer.getChannelData(0);
  const right = numChannels > 1 ? buffer.getChannelData(1) : left;
  const length = left.length;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = 2 * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = length * blockAlign;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  function writeString(offset, str){
    for(let i = 0; i < str.length; i++){
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  writeString(0, 'RIFF');
  view.setUint32(4, totalSize - 8, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, 2, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for(let i = 0; i < length; i++){
    const sL = Math.max(-1, Math.min(1, left[i]));
    const sR = Math.max(-1, Math.min(1, right[i]));
    view.setInt16(offset, sL < 0 ? sL * 0x8000 : sL * 0x7FFF, true);
    offset += 2;
    view.setInt16(offset, sR < 0 ? sR * 0x8000 : sR * 0x7FFF, true);
    offset += 2;
  }

  return new Blob([view], { type: 'audio/wav' });
}

function downloadBlob(blob, filename){
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

async function renderAudioWav(stemTrack = null){
  for(const lane of lanes){
    const url = starterKit[lane];
    if(url && !customBuffers[lane] && !bufferCache.has(url)){
      await getAudioBuffer(url);
    }
  }

  const barDuration = (60 / state.bpm) * 4;
  const barSectionMap = [];
  if(state.songMode && state.sections?.length){
    state.sections.forEach(sec => {
      for(let b = 0; b < (sec.bars || 1); b++){
        barSectionMap.push(sec);
      }
    });
  }
  const totalBars = state.songMode && barSectionMap.length ? barSectionMap.length : 4;
  const totalDuration = totalBars * barDuration + 2.0;
  const sampleRate = 44100;
  const totalFrames = Math.ceil(totalDuration * sampleRate);
  const offCtx = new OfflineAudioContext(2, totalFrames, sampleRate);

  const offMasterInput = offCtx.createGain();
  const offMasterOutput = offCtx.createGain();

  // Offline 3-Band Parametric EQ
  const offEqLow = offCtx.createBiquadFilter();
  offEqLow.type = 'lowshelf';
  offEqLow.frequency.value = 120;
  offEqLow.gain.value = Number(state.eq?.low ?? 0);

  const offEqMid = offCtx.createBiquadFilter();
  offEqMid.type = 'peaking';
  offEqMid.frequency.value = 1200;
  offEqMid.Q.value = 1.0;
  offEqMid.gain.value = Number(state.eq?.mid ?? 0);

  const offEqHigh = offCtx.createBiquadFilter();
  offEqHigh.type = 'highshelf';
  offEqHigh.frequency.value = 6500;
  offEqHigh.gain.value = Number(state.eq?.high ?? 0);

  // Offline Kick Sidechain Input (for ducking chords and bass)
  const offSidechainInput = offCtx.createGain();
  offSidechainInput.gain.value = 1.0;
  offSidechainInput.connect(offMasterInput);

  const offFilter = offCtx.createBiquadFilter();
  const val = Number(state.fx?.filter ?? 0);
  if(Math.abs(val) < 2){
    offFilter.type = 'allpass';
    offFilter.frequency.value = 1000;
  } else if(val < 0){
    offFilter.type = 'lowpass';
    const minF = 200, maxF = 20000;
    const ratio = (100 + val) / 100;
    offFilter.frequency.value = minF + (maxF - minF) * Math.pow(Math.max(0, ratio), 2.5);
    offFilter.Q.value = 1.2;
  } else {
    offFilter.type = 'highpass';
    const minF = 20, maxF = 3500;
    const ratio = val / 100;
    offFilter.frequency.value = minF + (maxF - minF) * Math.pow(Math.min(1, ratio), 1.8);
    offFilter.Q.value = 1.2;
  }

  const offImpulseLen = Math.floor(sampleRate * 1.8);
  const offImpulse = offCtx.createBuffer(2, offImpulseLen, sampleRate);
  const leftD = offImpulse.getChannelData(0);
  const rightD = offImpulse.getChannelData(1);
  for(let i = 0; i < offImpulseLen; i++){
    const factor = Math.pow(1 - i / offImpulseLen, 2.2);
    leftD[i] = (Math.random() * 2 - 1) * factor;
    rightD[i] = (Math.random() * 2 - 1) * factor;
  }
  const offReverb = offCtx.createConvolver();
  offReverb.buffer = offImpulse;
  const offReverbGain = offCtx.createGain();
  offReverbGain.gain.value = Math.max(0, Math.min(1, Number(state.fx?.reverb ?? 0.22)));
  offReverb.connect(offReverbGain).connect(offFilter);

  const offDelay = offCtx.createDelay();
  offDelay.delayTime.value = 60 / state.bpm * 0.75;
  const offDelayFb = offCtx.createGain();
  offDelayFb.gain.value = 0.32;
  const offDelayGain = offCtx.createGain();
  offDelayGain.gain.value = Math.max(0, Math.min(1, Number(state.fx?.delay ?? 0.15)));
  offDelay.connect(offDelayFb).connect(offDelay);
  offDelay.connect(offDelayGain).connect(offFilter);

  // Offline Master Limiter & Maximizer
  const offLimiter = offCtx.createDynamicsCompressor();
  if(state.masterLimiter !== false){
    offLimiter.threshold.value = -0.8;
    offLimiter.knee.value = 0.0;
    offLimiter.ratio.value = 20.0;
    offLimiter.attack.value = 0.001;
    offLimiter.release.value = 0.05;
  } else {
    offLimiter.threshold.value = 0.0;
    offLimiter.ratio.value = 1.0;
  }
  const offMaximizer = offCtx.createGain();
  offMaximizer.gain.value = state.masterLimiter !== false ? 1.38 : 1.0;

  // Signal routing: input -> 3-Band EQ -> Filter/Reverb/Delay -> Limiter -> Maximizer -> Output
  offMasterInput.connect(offEqLow);
  offEqLow.connect(offEqMid);
  offEqMid.connect(offEqHigh);
  offEqHigh.connect(offFilter);
  offEqHigh.connect(offReverb);
  offEqHigh.connect(offDelay);

  offFilter.connect(offLimiter);
  offLimiter.connect(offMaximizer);
  offMaximizer.connect(offMasterOutput);
  offMasterOutput.connect(offCtx.destination);

  const offDrumBusInput = offCtx.createGain();
  if(state.drumPunch !== false){
    const punchDrive = offCtx.createGain();
    punchDrive.gain.value = 1.15;
    const punchShaper = offCtx.createWaveShaper();
    punchShaper.curve = makeDistortionCurve(1.8);
    punchShaper.oversample = '2x';
    const drumGain = offCtx.createGain();
    drumGain.gain.value = 1.0;
    offDrumBusInput.connect(punchDrive).connect(punchShaper).connect(drumGain).connect(offMasterInput);
  } else {
    offDrumBusInput.connect(offMasterInput);
  }

  for(let b = 0; b < totalBars; b++){
    const barStartTime = b * barDuration;
    const currentSec = state.songMode ? barSectionMap[b] : null;

    const keysActive = (!stemTrack || stemTrack === 'keys') && state.melodyAdded && !state.mix.keys.mute && (!state.songMode || currentSec?.active?.keys !== false);
    const drumsActive = (!stemTrack || stemTrack === 'drums') && !state.mix.drums.mute && (!state.songMode || currentSec?.active?.drums !== false);
    const chordsActive = (!stemTrack || stemTrack === 'chords') && state.chordAdded && !state.mix.chords.mute && (!state.songMode || currentSec?.active?.chords !== false);
    const vocalsActive = (!stemTrack || stemTrack === 'vocals') && state.vocalAdded && !state.mix.vocals.mute && (!state.songMode || currentSec?.active?.vocals !== false);

    if(keysActive){
      const baseStep = barDuration / 16;
      const swingFactor = ((state.swing || 0) / 100) * 0.45;
      state.pattern.forEach(note => {
        const step = note.x;
        const swingOffset = (step % 2 === 1) ? baseStep * swingFactor : 0;
        const noteTime = barStartTime + step * baseStep + swingOffset;
        const noteDur = Math.max(0.22, note.w * 0.22);
        const noteVol = 0.11 * state.mix.keys.vol;
        renderOfflineTone(offCtx, offMasterInput, note.n, noteTime, noteDur, noteVol, state.instrument);
      });
    }

    if(chordsActive && state.chords?.bars){
      for(let beat = 0; beat < 4; beat++){
        const chordIndex = (b * 4 + beat) % state.chords.bars.length;
        const chord = state.chords.bars[chordIndex];
        const tones = chordTones[chord] || getChordNotes(chord);
        const chordTime = barStartTime + beat * (60 / state.bpm);
        tones.forEach(n => {
          renderOfflineTone(offCtx, offSidechainInput, n, chordTime, 0.68, 0.05 * state.mix.chords.vol, state.instrument);
        });
      }
    }

    if(vocalsActive && vocalBuffer){
      const vSource = offCtx.createBufferSource();
      vSource.buffer = vocalBuffer;
      const vGain = offCtx.createGain();
      vGain.gain.value = state.mix.vocals.vol;

      const chain = state.vocals.chain;
      if(chain === 'Lo-fi'){
        vSource.playbackRate.value = 0.94;
        const hp = offCtx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = 350;
        const lp = offCtx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 3800;
        vSource.connect(hp).connect(lp).connect(vGain).connect(offMasterInput);
      } else if(chain === 'Dark rap'){
        vSource.playbackRate.value = 0.97;
        const lp = offCtx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 2600;
        const boost = offCtx.createBiquadFilter();
        boost.type = 'peaking';
        boost.frequency.value = 220;
        boost.gain.value = 4;
        vSource.connect(boost).connect(lp).connect(vGain).connect(offMasterInput);
      } else {
        const hp = offCtx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = 120;
        const air = offCtx.createBiquadFilter();
        air.type = 'highshelf';
        air.frequency.value = 5000;
        air.gain.value = 3;

        const delay = offCtx.createDelay();
        delay.delayTime.value = 0.28;
        const delayFeedback = offCtx.createGain();
        delayFeedback.gain.value = 0.22;
        const delayGain = offCtx.createGain();
        delayGain.gain.value = 0.25;

        vSource.connect(hp).connect(air);
        air.connect(vGain);
        air.connect(delay);
        delay.connect(delayFeedback).connect(delay);
        delay.connect(delayGain).connect(vGain);
        vGain.connect(offMasterInput);
      }
      vSource.start(barStartTime);
    }

    if(drumsActive){
      const baseStep = barDuration / 16;
      const swingFactor = ((state.swing || 0) / 100) * 0.45;
      for(let s = 0; s < 16; s++){
        const swingOffset = (s % 2 === 1) ? baseStep * swingFactor : 0;
        const stepTime = barStartTime + s * baseStep + swingOffset;
        const chord = state.chords.bars[Math.floor(s / 4) % state.chords.bars.length];

        // Kick sidechain ducking in offline audio
        if(state.sidechain !== false && state.drums.kick?.has(s)){
          offSidechainInput.gain.setValueAtTime(0.25, stepTime);
          offSidechainInput.gain.exponentialRampToValueAtTime(1.0, stepTime + 0.16);
        }

        for(const lane of lanes){
          if(state.drums[lane]?.has(s)){
            let playbackRate = 1.0;
            if(lane === 'bass' && state.bassTuned !== false){
              const root = getChordRoot(chord);
              playbackRate = root / 65.41;
            }
            const buf = customBuffers[lane] || bufferCache.get(starterKit[lane]);
            if(buf){
              const roll = state.drumRolls?.[lane]?.[s] || 1;
              const laneMix = state.drumMix?.[lane] || { vol: 1.0, pan: 0 };
              for(let k = 0; k < roll; k++){
                const subTime = stepTime + (baseStep / roll) * k;
                const dSource = offCtx.createBufferSource();
                dSource.buffer = buf;
                if(playbackRate !== 1.0) dSource.playbackRate.value = playbackRate;
                const dGain = offCtx.createGain();
                const vel = drumVelocity(lane, s) * state.mix.drums.vol * (0.85 + 0.15 * (k / roll)) * (laneMix.vol ?? 1.0);
                dGain.gain.value = vel;
                if(offCtx.createStereoPanner && laneMix.pan !== 0){
                  const dPanner = offCtx.createStereoPanner();
                  dPanner.pan.value = laneMix.pan;
                  dSource.connect(dGain).connect(dPanner).connect(offDrumBusInput);
                } else {
                  dSource.connect(dGain).connect(offDrumBusInput);
                }
                dSource.start(subTime);
              }
            }
          }
        }
      }
    }
  }

  const renderedBuffer = await offCtx.startRendering();
  const wavBlob = audioBufferToWav(renderedBuffer);
  const cleanName = state.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-');
  const filename = stemTrack ? `${cleanName}-${stemTrack}.wav` : `${cleanName}-master.wav`;
  downloadBlob(wavBlob, filename);
}

async function exportAllStems(){
  const stems = ['drums'];
  if(state.melodyAdded) stems.push('keys');
  if(state.chordAdded) stems.push('chords');
  if(state.vocalAdded && vocalBuffer) stems.push('vocals');

  for(const stem of stems){
    await renderAudioWav(stem);
    await new Promise(r => setTimeout(r, 200));
  }
}

function variableLength(value){const bytes=[value&127];while(value>>=7)bytes.unshift((value&127)|128);return bytes}
function midiNumber(note){const m=note.match(/([A-G])(#?)(\d)/);return({C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1]]+(m[2]?1:0)+(Number(m[3])+1)*12)}
function buildSongBars(){
  const sections = state.songMode && state.sections?.length ? state.sections : [{ bars: 4, active: { keys: true, drums: true, chords: true, vocals: true } }];
  const bars = [];
  let total = 0;
  for (const section of sections) {
    const count = Math.max(1, Number(section.bars) || 1);
    for (let i = 0; i < count; i++) {
      bars.push({ barIndex: total + i, sectionName: section.name || `Section ${bars.length + 1}` });
    }
    total += count;
  }
  return bars.length ? bars : [{ barIndex: 0, sectionName: 'Loop' }];
}
function exportMidi(){
  const ticks = 480;
  const events = [];
  const songBars = buildSongBars();
  const totalBars = songBars.length || 1;
  const totalTicks = totalBars * 1920;

  for (let barIndex = 0; barIndex < totalBars; barIndex++) {
    const barStart = barIndex * 1920;

    state.pattern.forEach(note => {
      const start = barStart + note.x * 120;
      const end = start + note.w * 120 - 15;
      events.push(
        { t: start, data: [0x90, midiNumber(note.n), 96] },
        { t: end, data: [0x80, midiNumber(note.n), 0] }
      );
    });

    for (let s = 0; s < 16; s++) {
      const t = barStart + s * 120;
      const drumMap = {
        kick: { on: [0x99, 36, 100], off: [0x89, 36, 0] },
        snare: { on: [0x99, 38, 95], off: [0x89, 38, 0] },
        clap: { on: [0x99, 39, 90], off: [0x89, 39, 0] },
        hat: { on: [0x99, 42, 80], off: [0x89, 42, 0] },
        openhat: { on: [0x99, 46, 85], off: [0x89, 46, 0] },
        bass: { on: [0x92, 33, 105], off: [0x82, 33, 0] }
      };

      for(const lane of lanes){
        if(state.drums[lane]?.has(s)){
          const roll = state.drumRolls?.[lane]?.[s] || 1;
          const info = drumMap[lane];
          if(info){
            const stepTicks = 120;
            for(let k = 0; k < roll; k++){
              const subT = t + Math.floor((stepTicks / roll) * k);
              const subOff = subT + Math.floor((stepTicks / roll) * 0.7);
              events.push({ t: subT, data: info.on }, { t: subOff, data: info.off });
            }
          }
        }
      }
    }

    if (state.chordAdded && state.chords?.bars) {
      const chordBars = state.chords.bars;
      const chordIndex = barIndex % chordBars.length;
      const chord = chordBars[chordIndex];
      const bars = chordTones[chord] || getChordNotes(chord);
      const chordStart = barStart + 0;
      const chordEnd = barStart + 1880;
      bars.forEach(note => {
        events.push(
          { t: chordStart, data: [0x91, midiNumber(note), 80] },
          { t: chordEnd, data: [0x81, midiNumber(note), 0] }
        );
      });
    }
  }

  events.sort((a,b)=>a.t-b.t||a.data[0]-b.data[0]);
  let last=0;const tempo=Math.round(60000000/state.bpm),body=[0,0xff,0x51,3,(tempo>>16)&255,(tempo>>8)&255,tempo&255];
  for(const event of events){body.push(...variableLength(event.t-last),...event.data);last=event.t}
  body.push(0,0xff,0x2f,0);
  const u32=n=>[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255];
  const bytes=[...new TextEncoder().encode('MThd'),0,0,0,6,0,0,0,1,(ticks>>8)&255,ticks&255,...new TextEncoder().encode('MTrk'),...u32(body.length),...body];
  const blob=new Blob([new Uint8Array(bytes)],{type:'audio/midi'}),a=document.createElement('a');
  a.href=URL.createObjectURL(blob);a.download=`${state.name.replace(/\s+/g,'-').toLowerCase()}.mid`;a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);notify(`Standard MIDI exported (${totalBars} bars) `);
}

function exportJson(){
  const blob=new Blob([localStorage.getItem('bmai-project')||'{}'],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${state.name.replace(/\s+/g,'-').toLowerCase()}.json`;a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);notify('Project file downloaded');
}

function importJson(){
  const input=document.querySelector('#import-json-file');
  if(input) input.click();
}

function handleJsonFile(e){
  const file=e.target.files?.[0];
  if(!file) return;
  const reader=new FileReader();
  reader.onload=evt=>{
    try{
      const data=JSON.parse(evt.target.result);
      if(!data||typeof data!=='object') throw new Error('Invalid JSON');
      if(data.name) state.name=data.name;
      if(data.bpm) state.bpm=Number(data.bpm)||92;
      if(data.key) state.key=data.key;
      if(data.prompt) state.prompt=data.prompt;
      if(Array.isArray(data.chips)) state.chips=data.chips;
      if(Array.isArray(data.pattern)) state.pattern=data.pattern;
      if(data.kit&&sessionKits[data.kit]) applyKit(data.kit);
      if(data.drums){
        for(const lane of lanes) state.drums[lane]=new Set(data.drums[lane]||[]);
      }
      if(data.chords) state.chords=data.chords;
      if(data.chordAdded!==undefined) state.chordAdded=!!data.chordAdded;
      if(data.vocals) state.vocals=data.vocals;
      if(data.vocalAdded!==undefined) state.vocalAdded=!!data.vocalAdded;
      if(data.mix) state.mix=data.mix;
      if(data.melodyAdded!==undefined) state.melodyAdded=!!data.melodyAdded;
      if(data.drumPunch!==undefined) state.drumPunch=!!data.drumPunch;
      if(data.customSamples) state.customSamples=data.customSamples;
      if(data.fx) state.fx=data.fx;
      if(data.bassTuned!==undefined) state.bassTuned=!!data.bassTuned;
      if(data.songMode!==undefined) state.songMode=!!data.songMode;
      if(data.songSection!==undefined) state.songSection=Number(data.songSection)||0;
      if(Array.isArray(data.sections)&&data.sections.length) state.sections=data.sections;
      updateDrumBusRouting();
      updateFilterRouting();
      history=[];
      future=[];
      saveProject();
      renderApp();
      notify(`Project "${state.name}" loaded successfully`);
    }catch(err){
      notify('Could not load project file — invalid JSON');
    }
  };
  reader.readAsText(file);
  e.target.value='';
}

function currentPack(){return catalog.packs.find(pack=>pack.id===packId)||catalog.packs[0]}
function currentGroup(){const pack=currentPack();return pack.groups.find(group=>group.id===groupId)||pack.groups[0]}
function visibleSounds(){const needle=query.trim().toLowerCase();if(!needle)return currentGroup().sounds;return currentPack().groups.flatMap(group=>group.sounds).filter(sound=>sound.name.toLowerCase().includes(needle))}
function renderLibrary(){
  const pack=currentPack();const group=currentGroup();const sounds=visibleSounds();
  document.querySelector('#library-count').textContent=`${catalog.count} CC0 sounds`;
  document.querySelector('#pack-row').innerHTML=catalog.packs.map(item=>`<button type="button" data-pack="${item.id}" class="${item.id===pack.id?'on':''}">${item.name}</button>`).join('');
  document.querySelector('#group-row').innerHTML=pack.groups.map(item=>`<button type="button" data-group="${item.id}" class="${!query&&item.id===group.id?'on':''}">${item.name}</button>`).join('');
  document.querySelector('#sound-groups').innerHTML=sounds.map(sound=>`<button type="button" class="sound-preview" data-url="${sound.url}"><span>${query?pack.name:group.name}</span><strong>▷ ${sound.name}</strong></button>`).join('')||'<p class="empty-sounds">No sounds match that search.</p>';
  document.querySelector('#library-status').textContent=query?`${sounds.length} matches in ${pack.name}`:`${sounds.length} in ${group.name}`;
}
function playPreview(button){if(previewAudio)previewAudio.pause();document.querySelectorAll('.sound-preview').forEach(item=>item.classList.remove('is-playing'));previewAudio=new Audio(publicUrl(button.dataset.url));previewAudio.volume=.75;button.classList.add('is-playing');previewAudio.play().catch(()=>{});previewAudio.addEventListener('ended',()=>button.classList.remove('is-playing'))}
function setLibraryTab(tab){
  const sounds=document.querySelector('#lib-tab-sounds');
  const sources=document.querySelector('#lib-tab-sources');
  const viewSounds=document.querySelector('#lib-view-sounds');
  const viewSources=document.querySelector('#lib-view-sources');
  if(!sounds||!sources||!viewSounds||!viewSources) return;
  const showSources=tab==='sources';
  sounds.classList.toggle('active',!showSources);
  sources.classList.toggle('active',showSources);
  viewSounds.hidden=showSources;
  viewSources.hidden=!showSources;
}
async function openLibrary(initialTab='sounds'){const modal=document.querySelector('#library-modal');modal.hidden=false;setLibraryTab(initialTab);if(catalog){renderLibrary();return}document.querySelector('#sound-groups').innerHTML='<p class="empty-sounds">Loading library…</p>';catalog=await fetch(publicUrl('/sounds/catalog.json')).then(response=>response.json());renderLibrary()}
async function startVocal(){
  try{
    const stream=await navigator.mediaDevices.getUserMedia({audio:true});
    vocalChunks=[];recorder=new MediaRecorder(stream);recorder.ondataavailable=event=>{if(event.data.size)vocalChunks.push(event.data)};
    recorder.onstop=()=>{stream.getTracks().forEach(track=>track.stop());if(vocalUrl)URL.revokeObjectURL(vocalUrl);vocalUrl=URL.createObjectURL(new Blob(vocalChunks,{type:recorder.mimeType||'audio/webm'}));prepareVocalBuffer(vocalUrl);state.vocalAdded=true;saveProject();renderApp();notify('Vocal take captured')};
    recorder.start();notify('Recording… click Stop when the line is done');
  }catch{notify('Microphone permission is needed to record')}
}

function applyIdea(index){
  const scale=scaleForKey();
  const base=state.pattern.map(note=>({...note}));
  const variants=[
    base,
    base.map((note,i)=>({...note,n:scale[(i+1)%scale.length],x:(note.x+2)%15})),
    base.map((note,i)=>({...note,n:scale[i%2?0:2],w:i%2?1:2})),
    base.map((note,i)=>({...note,n:scale[(scale.length-1)-(i%scale.length)]})),
    state.pattern,
    state.pattern.map((note,i)=>({...note,n:['E5','D5','C5','A4'][i%4],x:(note.x+1)%15+1})),
    state.pattern.map((note,i)=>({...note,n:i%2?'C5':'A4'})),
    state.pattern.map((note,i)=>({...note,n:['A5','E5','G5','C5'][i%4]}))
  ];
  history.push(base);
  history.push(state.pattern.map(note=>({...note})));
  state.pattern=variants[index].map(note=>({...note}));
  state.idea=index;
  state.melodyAdded=true;saveProject();renderApp();scrollPianoToNotes();
  state.melodyAdded=true;saveProject();renderPiano();
}

function cycleStepRoll(lane, step){
  state.drumRolls = state.drumRolls || {};
  state.drumRolls[lane] = state.drumRolls[lane] || {};
  const cur = state.drumRolls[lane][step] || 1;
  const next = cur === 1 ? 2 : cur === 2 ? 3 : cur === 3 ? 4 : 1;
  if(next === 1){
    delete state.drumRolls[lane][step];
  } else {
    state.drumRolls[lane][step] = next;
  }
  saveProject();
  renderApp();
  notify(`${lane.toUpperCase()} Step ${step+1}: ${next === 1 ? 'Standard (1x)' : next + 'x roll / ratchet'}`);
}

function onAction(target, event){
  if(target.dataset.view){setView(target.dataset.view);return true}
  if(target.dataset.open==='library'){openLibrary();return true}
  if(target.dataset.open){setView(target.dataset.open);return true}
  if(target.dataset.start){applyKit(target.dataset.start,true);state.chips=target.dataset.start==='rnb'?['R&B','Dark']:target.dataset.start==='acoustic'?['Smooth']:target.dataset.start==='trap'?['Dark']:['Simple'];saveProject();setView('drums');notify(`${sessionKits[state.kit].blurb} loaded`);return true}
  if(target.dataset.kit&&sessionKits[target.dataset.kit]){applyKit(target.dataset.kit,true);markDrumsInProject();saveProject();renderApp();notify(`${sessionKits[state.kit].blurb} loaded`);return true}
  if(target.dataset.chip){const chip=target.dataset.chip;state.chips=state.chips.includes(chip)?state.chips.filter(item=>item!==chip):[...state.chips,chip];saveProject();target.classList.toggle('selected');return true}
  if(target.dataset.idea){applyIdea(Number(target.dataset.idea));document.querySelectorAll('.idea').forEach(el=>el.classList.remove('chosen'));target.closest('.idea').classList.add('chosen');return true}
  if(target.dataset.chord){const option=(progressions[state.key]||[]).find(item=>item.name===target.dataset.chord);if(option){state.chords=option;saveProject();renderApp()}return true}
  if(target.dataset.lyric){state.vocals={...state.vocals,title:target.dataset.lyric,line:target.dataset.line};saveProject();renderApp();return true}
  if(target.dataset.loadVocal){useVocalSource(target.dataset.loadVocal,target.dataset.vocalTitle);return true}
  if(target.id==='pick-vocal-file'){document.querySelector('#vocal-file-input')?.click();return true}
  if(target.id==='clear-vocal'){if(vocalUrl?.startsWith('blob:')) URL.revokeObjectURL(vocalUrl);vocalUrl='';vocalBuffer=null;state.vocalAdded=false;saveProject();renderApp();notify('Vocal cleared');return true}
  if(target.id==='lib-tab-sounds'||target.closest?.('#lib-tab-sounds')){setLibraryTab('sounds');return true}
  if(target.id==='lib-tab-sources'||target.closest?.('#lib-tab-sources')){setLibraryTab('sources');return true}
  if(target.dataset.chain){state.vocals={...state.vocals,chain:target.dataset.chain};saveProject();renderApp();return true}
  if(target.dataset.lane){
    const lane = target.dataset.lane;
    const step = Number(target.dataset.step);
    if(event?.shiftKey && state.drums[lane]?.has(step)){
      cycleStepRoll(lane, step);
      return true;
    }
    if(state.drums[lane].has(step)){
      state.drums[lane].delete(step);
      if(state.drumRolls?.[lane]?.[step]) delete state.drumRolls[lane][step];
    } else {
      state.drums[lane].add(step);
    }
    markDrumsInProject();
    saveProject();
    renderApp();
    return true;
  }
  if(target.id==='open-public-sources'||target.closest?.('#open-public-sources')||target.id==='lead-open-sources'){
    openLibrary('sources');
    return true;
  }
  if(target.id==='toggle-master-limiter'||target.closest?.('#toggle-master-limiter')){
    state.masterLimiter = !(state.masterLimiter !== false);
    updateMasterLimiter();
    saveProject();
    renderApp();
    notify(state.masterLimiter ? 'Master Limiter & Maximizer enabled (-0.8dB Peak · +2.8dB Boost)' : 'Master Limiter bypassed (Clean headroom)');
    return true;
  }
  if(target.id==='toggle-sidechain'||target.closest?.('#toggle-sidechain')){
    state.sidechain = !(state.sidechain !== false);
    saveProject();
    renderApp();
    notify(state.sidechain ? 'Kick Sidechain Ducking enabled (Chords & Bass pump on kicks)' : 'Kick Sidechain bypassed (Flat)');
    return true;
  }
  if(target.id==='reset-eq'||target.closest?.('#reset-eq')){
    state.eq = { low: 0, mid: 0, high: 0 };
    updateEQ();
    saveProject();
    renderApp();
    notify('Master EQ reset to Flat (0 dB)');
    return true;
  }
  if(target.dataset.mute){state.mix[target.dataset.mute].mute=!state.mix[target.dataset.mute].mute;saveProject();renderApp();return true}
  if(target.id==='generate'||target.id==='regenerate'||target.closest?.('#generate')){const prompt=document.querySelector('#prompt');if(prompt)state.prompt=prompt.value;generateMelody();return true}
  if(target.id==='humanize-drums'){generateDrums();return true}
  if(target.id==='generate-chords'){generateChords();return true}
  if(target.id==='add-chords'){state.chordAdded=true;saveProject();renderApp();notify('Chords added to the arrangement');return true}
  if(target.id==='generate-vocals'){generateVocals();return true}
  if(target.id==='add-vocal'){state.vocalAdded=true;saveProject();renderApp();notify('Vocal track added');return true}
  if(target.id==='record-vocal'){startVocal();return true}
  if(target.id==='stop-vocal'){if(recorder&&recorder.state==='recording')recorder.stop();return true}
  if(target.id==='play-vocal'){playVocalOnce();return true}
  if(target.id==='add-project'||target.dataset.addMelody!==undefined){state.melodyAdded=true;saveProject();notify('Melody added to the project');return true}
  if(target.id==='preview'){setPlaying(!playing);return true}
  if(target.dataset.inst){
    state.instrument=target.dataset.inst;
    triggerSoundfontLoad(state.instrument);
    saveProject();
    renderApp();
    tone('C5',.45,.12,state.instrument);
    const instNames={rhodes:'Neo-Soul Rhodes',piano:'Acoustic Grand Piano',guitar:'FluidR3 Acoustic Guitar',strings:'FluidR3 Strings Ensemble',bass:'808 Sub Bass',brass:'80s Synth Brass',organ:'FluidR3 Church Organ',flute:'FluidR3 Concert Flute',pad:'Lofi Ambient Pad',analog:'Analog Poly',pluck:'Crystal Pluck'};
    notify(`${instNames[state.instrument]||'Keyboard'} loaded`);
    return true;
  }
  if(target.id==='export-midi'){exportMidi();return true}
  if(target.id==='export-json'){saveProject();exportJson();return true}
  if(target.id==='import-json'||target.id==='import-json-settings'){importJson();return true}
  if(target.dataset.openProject){openProject(target.dataset.openProject);return true}
  if(target.id==='create-project'){createProject();return true}
  if(target.id==='save-settings'){const nextKey=document.querySelector('#settings-key').value;state.name=document.querySelector('#settings-name').value||'Untitled idea';state.description=document.querySelector('#settings-description')?.value.trim()||state.description;state.bpm=Number(document.querySelector('#settings-bpm').value)||92;if(nextKey!==state.key){const from=scaleForKey(state.key);const to=scaleForKey(nextKey);state.pattern=state.pattern.map(note=>{let degree=from.indexOf(note.n);if(degree<0){const pitch=pitchOf(note.n);degree=from.reduce((best,name,index)=>Math.abs(pitchOf(name)-pitch)<Math.abs(pitchOf(from[best])-pitch)?index:best,0)}return {...note,n:to[degree]}});state.key=nextKey;state.chords=(progressions[nextKey]||[]).find(item=>item.name===state.chords.name)||progressions[nextKey][0]}saveProject();renderApp();notify('Project settings saved');return true}
  if(target.id==='new-idea'){setView('home');notify('Create the next project at the top of the list');return true}
  if(target.id==='close-inspector'){setInspectorOpen(false);return true}
  if(target.id==='toggle-drum-punch'||target.closest?.('#toggle-drum-punch')){
    state.drumPunch=!(state.drumPunch!==false);
    updateDrumBusRouting();
    saveProject();
    renderApp();
    notify(state.drumPunch?'Drum Punch enabled (Soft-clip saturation)':'Drum Punch bypassed (Clean)');
    return true;
  }
  if(target.id==='toggle-tuned-808'||target.closest?.('#toggle-tuned-808')){
    state.bassTuned = !(state.bassTuned !== false);
    saveProject();
    renderApp();
    notify(state.bassTuned ? 'Tuned 808 enabled (Sub-bass matches chords)' : 'Tuned 808 bypassed (Fixed root)');
    return true;
  }
  if(target.id==='toggle-song-mode'||target.closest?.('#toggle-song-mode')){
    state.songMode = !state.songMode;
    if(state.songMode) state.songSection = 0;
    saveProject();
    renderApp();
    notify(state.songMode ? 'Song Mode enabled (multi-section progression)' : 'Loop Mode active (1 bar)');
    return true;
  }
  if(target.dataset.sectionIdx !== undefined || target.closest?.('[data-section-idx]')){
    const el = target.dataset.sectionIdx !== undefined ? target : target.closest('[data-section-idx]');
    const idx = Number(el.dataset.sectionIdx);
    if(!isNaN(idx) && state.sections[idx]){
      state.songSection = idx;
      saveProject();
      renderApp();
      notify(`Selected section: ${state.sections[idx].name}`);
      return true;
    }
  }
  if(target.dataset.toggleSecTrack !== undefined || target.closest?.('[data-toggle-sec-track]')){
    const el = target.dataset.toggleSecTrack !== undefined ? target : target.closest('[data-toggle-sec-track]');
    const secIdx = Number(el.dataset.toggleSecTrack);
    const track = el.dataset.track;
    if(state.sections[secIdx] && track){
      state.sections[secIdx].active[track] = !state.sections[secIdx].active[track];
      saveProject();
      renderApp();
      notify(`${state.sections[secIdx].name} · ${track} ${state.sections[secIdx].active[track] ? 'enabled' : 'muted'}`);
      return true;
    }
  }
  if(target.id==='export-wav-master'||target.closest?.('#export-wav-master')){
    const btn = target.closest('#export-wav-master') || target;
    btn.disabled = true;
    btn.textContent = 'Rendering WAV...';
    notify('Rendering 16-bit Master WAV mixdown...');
    renderAudioWav().then(()=>{
      notify('Master WAV mixdown exported successfully');
    }).catch(err=>{
      console.error(err);
      notify('WAV export failed');
    }).finally(()=>{
      btn.disabled = false;
      btn.textContent = 'Download Master (.wav)';
    });
    return true;
  }
  if(target.id==='export-wav-stems'||target.closest?.('#export-wav-stems')){
    const btn = target.closest('#export-wav-stems') || target;
    btn.disabled = true;
    btn.textContent = 'Rendering Stems...';
    notify('Rendering multi-track stems (WAV)...');
    exportAllStems().then(()=>{
      notify('All stems exported successfully');
    }).catch(err=>{
      console.error(err);
      notify('Stems export failed');
    }).finally(()=>{
      btn.disabled = false;
      btn.textContent = 'Download Stems (.wav)';
    });
    return true;
  }
  if(target.dataset.previewLane||target.closest?.('[data-preview-lane]')){
    const btn=target.dataset.previewLane?target:target.closest('[data-preview-lane]');
    const lane=btn.dataset.previewLane;
    if(lane){
      hit(lane,0.85);
      notify(`Preview ${lane.toUpperCase()}`);
      return true;
    }
  }
  if(target.dataset.resetSample||target.closest?.('[data-reset-sample]')){
    const btn=target.dataset.resetSample?target:target.closest('[data-reset-sample]');
    const lane=btn.dataset.resetSample;
    if(lane){
      resetCustomSample(lane);
      return true;
    }
  }
  if(target.dataset.pickLane||target.closest?.('[data-pick-lane]')){
    const btn=target.dataset.pickLane?target:target.closest('[data-pick-lane]');
    const lane=btn.dataset.pickLane;
    if(lane){
      activePickingLane=lane;
      const input=document.querySelector('#drum-sample-input');
      if(input) input.click();
      return true;
    }
  }
  return false;
}

document.querySelector('#nav-toggle').addEventListener('click',()=>setStudioNav(!studioNav.open));
document.querySelector('#inspector-dock').addEventListener('click',()=>setInspectorOpen(true));
window.addEventListener('resize',applyStudioLayout);
document.querySelector('#go-home').addEventListener('click',()=>setView('home'));
document.querySelector('#go-export').addEventListener('click',()=>setView('export'));
document.querySelector('#go-account').addEventListener('click',()=>setView('settings'));
document.querySelector('#play').addEventListener('click',()=>setPlaying(!playing));
document.querySelector('#stop').addEventListener('click',()=>setPlaying(false));
document.querySelector('#undo').addEventListener('click',()=>{if(!history.length)return;future.push(state.pattern.map(note=>({...note})));state.pattern=history.pop();saveProject();renderPiano();notify('Undid note edit')});
document.querySelector('#bpm').addEventListener('change',event=>{state.bpm=Number(event.target.value)||92;saveProject();if(playing)setPlaying(true)});
document.querySelector('#swing').addEventListener('change',event=>{state.swing=Math.max(0,Math.min(60,Number(event.target.value)||0));saveProject();if(playing)setPlaying(true);notify(`Swing set to ${state.swing}%`)});
document.querySelector('#key').addEventListener('click',event=>{event.stopPropagation();const list=document.querySelector('#key-list');setKeyMenuOpen(list.hidden)});
document.querySelector('#key-list').addEventListener('click',event=>{const button=event.target.closest('[data-key]');if(!button) return;event.stopPropagation();applySessionKey(button.dataset.key)});
document.addEventListener('click',()=>setKeyMenuOpen(false));
window.addEventListener('resize',placeKeyMenu);
document.querySelector('#key').addEventListener('change',event=>{state.key=event.target.value;if(!(progressions[state.key]||[]).some(item=>item.name===state.chords.name))state.chords=progressions[state.key][0];saveProject();renderApp()});
document.querySelector('#metronome').addEventListener('click',event=>{metronomeOn=!metronomeOn;event.currentTarget.classList.toggle('metronome-on',metronomeOn);notify(metronomeOn?'Metronome enabled':'Metronome disabled')});

let tapTimes = [];
function handleTapTempo(){
  const now = performance.now();
  if(tapTimes.length && (now - tapTimes[tapTimes.length - 1]) > 2500){
    tapTimes = [];
  }
  tapTimes.push(now);
  if(tapTimes.length > 5) tapTimes.shift();
  if(tapTimes.length >= 2){
    const intervals = [];
    for(let i = 1; i < tapTimes.length; i++){
      intervals.push(tapTimes[i] - tapTimes[i - 1]);
    }
    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const bpm = Math.max(40, Math.min(240, Math.round(60000 / avg)));
    state.bpm = bpm;
    const bpmEl = document.querySelector('#bpm');
    if(bpmEl) bpmEl.value = bpm;
    saveProject();
    if(playing) setPlaying(true);
    notify(`Tap Tempo: ${bpm} BPM`);
  } else {
    notify('Tap rhythmically again to set BPM');
  }
}
document.querySelector('#tap-tempo')?.addEventListener('click', handleTapTempo);

document.querySelector('#stage').addEventListener('click',event=>onAction(event.target.closest('button, article, [data-view], [data-open], [data-lane]')||event.target, event));
document.querySelector('#stage').addEventListener('contextmenu', event => {
  const stepBtn = event.target.closest('[data-lane][data-step]');
  if(stepBtn){
    event.preventDefault();
    const lane = stepBtn.dataset.lane;
    const step = Number(stepBtn.dataset.step);
    if(!state.drums[lane].has(step)){
      state.drums[lane].add(step);
    }
    cycleStepRoll(lane, step);
  }
});
document.querySelector('#inspector').addEventListener('click',event=>onAction(event.target.closest('button')||event.target, event));
document.querySelector('#stage').addEventListener('input',event=>{
  if(event.target.id==='prompt')state.prompt=event.target.value;
  if(event.target.dataset.vol){
    state.mix[event.target.dataset.vol].vol=Number(event.target.value)/100;
    event.target.nextElementSibling.textContent=event.target.value;
    saveProject();
  }
  if(event.target.dataset.laneVol){
    const lane = event.target.dataset.laneVol;
    state.drumMix = state.drumMix || {};
    state.drumMix[lane] = state.drumMix[lane] || { vol: 1.0, pan: 0 };
    state.drumMix[lane].vol = Number(event.target.value) / 100;
    saveProject();
  }
  if(event.target.dataset.lanePan){
    const lane = event.target.dataset.lanePan;
    state.drumMix = state.drumMix || {};
    state.drumMix[lane] = state.drumMix[lane] || { vol: 1.0, pan: 0 };
    state.drumMix[lane].pan = Number(event.target.value) / 100;
    saveProject();
  }
  if(event.target.id==='eq-low'){
    state.eq = state.eq || { low: 0, mid: 0, high: 0 };
    state.eq.low = Number(event.target.value);
    updateEQ();
    const valEl = document.querySelector('#val-eq-low');
    if(valEl) valEl.textContent = `${state.eq.low > 0 ? '+' + state.eq.low : state.eq.low} dB`;
    saveProject();
  }
  if(event.target.id==='eq-mid'){
    state.eq = state.eq || { low: 0, mid: 0, high: 0 };
    state.eq.mid = Number(event.target.value);
    updateEQ();
    const valEl = document.querySelector('#val-eq-mid');
    if(valEl) valEl.textContent = `${state.eq.mid > 0 ? '+' + state.eq.mid : state.eq.mid} dB`;
    saveProject();
  }
  if(event.target.id==='eq-high'){
    state.eq = state.eq || { low: 0, mid: 0, high: 0 };
    state.eq.high = Number(event.target.value);
    updateEQ();
    const valEl = document.querySelector('#val-eq-high');
    if(valEl) valEl.textContent = `${state.eq.high > 0 ? '+' + state.eq.high : state.eq.high} dB`;
    saveProject();
  }
  if(event.target.id==='fx-filter'){
    state.fx = state.fx || {};
    state.fx.filter = Number(event.target.value);
    updateFilterRouting();
    const tag = state.fx.filter === 0 ? 'Bypass' : (state.fx.filter < 0 ? `Lowpass ${state.fx.filter}` : `Highpass +${state.fx.filter}`);
    const statusTag = document.querySelector('#fx-status-tag');
    if(statusTag) statusTag.textContent = tag;
    const valEl = document.querySelector('#val-fx-filter');
    if(valEl) valEl.textContent = state.fx.filter > 0 ? '+' + state.fx.filter : state.fx.filter;
    saveProject();
  }
  if(event.target.id==='fx-reverb'){
    state.fx = state.fx || {};
    state.fx.reverb = Number(event.target.value) / 100;
    updateFilterRouting();
    const valEl = document.querySelector('#val-fx-reverb');
    if(valEl) valEl.textContent = `${event.target.value}%`;
    saveProject();
  }
  if(event.target.id==='fx-delay'){
    state.fx = state.fx || {};
    state.fx.delay = Number(event.target.value) / 100;
    updateFilterRouting();
    const valEl = document.querySelector('#val-fx-delay');
    if(valEl) valEl.textContent = `${event.target.value}%`;
    saveProject();
  }
});
document.querySelector('.tools').addEventListener('click',event=>{const button=event.target.closest('[data-view], .library, .settings');if(!button)return;if(button.classList.contains('library'))openLibrary();else if(button.dataset.view)setView(button.dataset.view)});
document.querySelectorAll('[data-roll]').forEach(button=>button.addEventListener('click',()=>{if(button.dataset.roll==='undo'&&history.length){future.push(state.pattern.map(note=>({...note})));state.pattern=history.pop();renderPiano();notify('Undid note edit')}else if(button.dataset.roll==='redo'&&future.length){history.push(state.pattern.map(note=>({...note})));state.pattern=future.pop();renderPiano();notify('Redid note edit')}else notify(button.dataset.roll==='snap'?'Snap set to 1/16':'Nothing to change')}));
document.querySelector('#close-library').addEventListener('click',()=>document.querySelector('#library-modal').hidden=true);
document.querySelector('#library-search').addEventListener('input',event=>{query=event.target.value;if(catalog)renderLibrary()});
document.querySelector('#library-modal').addEventListener('click',event=>{
  if(event.target.closest('#lib-tab-sources')){setLibraryTab('sources');return}
  if(event.target.closest('#lib-tab-sounds')){setLibraryTab('sounds');return}
  const pack=event.target.closest('[data-pack]');const group=event.target.closest('[data-group]');const kit=event.target.closest('[data-kit]');const sound=event.target.closest('.sound-preview');
  if(pack){packId=pack.dataset.pack;groupId=currentPack().groups[0].id;query='';document.querySelector('#library-search').value='';renderLibrary()}
  else if(group){groupId=group.dataset.group;query='';document.querySelector('#library-search').value='';renderLibrary()}
  else if(kit){applyKit(kit.dataset.kit,true);saveProject();renderApp();notify(`${sessionKits[state.kit].blurb} loaded`)}
  else if(sound) playPreview(sound);
});

const importInput=document.querySelector('#import-json-file');
if(importInput) importInput.addEventListener('change',handleJsonFile);

const vocalFileInput=document.querySelector('#vocal-file-input');
if(vocalFileInput){
  vocalFileInput.addEventListener('change',event=>{
    const file=event.target.files?.[0];
    if(file) useVocalSource(URL.createObjectURL(file),file.name.replace(/\.[^.]+$/,''));
    event.target.value='';
  });
}
const drumSampleInput=document.querySelector('#drum-sample-input');
if(drumSampleInput){
  drumSampleInput.addEventListener('change',event=>{
    const file=event.target.files?.[0];
    if(file&&activePickingLane){
      loadCustomSample(activePickingLane,file);
    }
    event.target.value='';
  });
}

window.addEventListener('dragover',e=>e.preventDefault());
window.addEventListener('drop',e=>e.preventDefault());

const stageEl=document.querySelector('#stage');
if(stageEl){
  stageEl.addEventListener('dragover',e=>{
    const laneEl=e.target.closest('[data-lane-drop]');
    const vocalZone=e.target.closest('#vocal-drop-zone');
    if(laneEl){
      e.preventDefault();
      e.dataTransfer.dropEffect='copy';
      document.querySelectorAll('[data-lane-drop]').forEach(el=>{
        if(el!==laneEl) el.classList.remove('drag-over');
      });
      laneEl.classList.add('drag-over');
    } else if(vocalZone){
      e.preventDefault();
      e.dataTransfer.dropEffect='copy';
      vocalZone.classList.add('drag-over');
    }
  });

  stageEl.addEventListener('dragleave',e=>{
    const laneEl=e.target.closest('[data-lane-drop]');
    const vocalZone=e.target.closest('#vocal-drop-zone');
    if(laneEl&&!laneEl.contains(e.relatedTarget)){
      laneEl.classList.remove('drag-over');
    }
    if(vocalZone&&!vocalZone.contains(e.relatedTarget)){
      vocalZone.classList.remove('drag-over');
    }
  });

  stageEl.addEventListener('drop',async e=>{
    const vocalZone=e.target.closest('#vocal-drop-zone');
    const laneEl=e.target.closest('[data-lane-drop]');
    if(vocalZone){
      e.preventDefault();
      vocalZone.classList.remove('drag-over');
      const file=e.dataTransfer.files?.[0];
      if(file){
        useVocalSource(URL.createObjectURL(file),file.name.replace(/\.[^.]+$/,''));
      }
      return;
    }
    if(laneEl){
      e.preventDefault();
      laneEl.classList.remove('drag-over');
      const lane=laneEl.dataset.laneDrop;
      const file=e.dataTransfer.files?.[0];
      if(file&&lane){
        await loadCustomSample(lane,file);
      }
    }
  });
}

bindPianoEditor();

const qwertyMap = {
  'KeyA': { semitone: 0, note: 'C' },
  'KeyW': { semitone: 1, note: 'C#' },
  'KeyS': { semitone: 2, note: 'D' },
  'KeyE': { semitone: 3, note: 'D#' },
  'KeyD': { semitone: 4, note: 'E' },
  'KeyF': { semitone: 5, note: 'F' },
  'KeyT': { semitone: 6, note: 'F#' },
  'KeyG': { semitone: 7, note: 'G' },
  'KeyY': { semitone: 8, note: 'G#' },
  'KeyH': { semitone: 9, note: 'A' },
  'KeyU': { semitone: 10, note: 'A#' },
  'KeyJ': { semitone: 11, note: 'B' },
  'KeyK': { semitone: 12, note: 'C' },
  'KeyO': { semitone: 13, note: 'C#' },
  'KeyL': { semitone: 14, note: 'D' },
  'KeyP': { semitone: 15, note: 'D#' },
  'Semicolon': { semitone: 16, note: 'E' }
};

const activeQwertyKeys = new Set();

window.addEventListener('keydown', event => {
  if(['INPUT','SELECT','TEXTAREA'].includes(event.target.tagName) || event.target.isContentEditable) return;
  if((event.key==='Delete'||event.key==='Backspace')&&selectedNote>=0&&state.pattern[selectedNote]){
    event.preventDefault();
    removeSelectedNote();
    return;
  }
  if(event.code === 'Space'){
    event.preventDefault();
    setPlaying(!playing);
    return;
  }
  if(event.code === 'KeyZ'){
    event.preventDefault();
    qwertyOctave = Math.max(2, qwertyOctave - 1);
    const ind = document.querySelector('#qwerty-oct');
    if(ind) ind.textContent = `C${qwertyOctave}-D${qwertyOctave+1}`;
    notify(`QWERTY Octave shifted down: C${qwertyOctave}`);
    return;
  }
  if(event.code === 'KeyX'){
    event.preventDefault();
    qwertyOctave = Math.min(6, qwertyOctave + 1);
    const ind = document.querySelector('#qwerty-oct');
    if(ind) ind.textContent = `C${qwertyOctave}-D${qwertyOctave+1}`;
    notify(`QWERTY Octave shifted up: C${qwertyOctave}`);
    return;
  }

  const map = qwertyMap[event.code];
  if(map && !event.repeat){
    event.preventDefault();
    activeQwertyKeys.add(event.code);
    const semitones = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
    const totalSemitones = (qwertyOctave * 12) + map.semitone;
    const noteOctave = Math.floor(totalSemitones / 12);
    const noteName = semitones[totalSemitones % 12];
    const fullPitch = `${noteName}${noteOctave}`;

    tone(fullPitch, 0.45, 0.15, state.instrument || 'rhodes');

    const qInd = document.querySelector('#qwerty-indicator');
    if(qInd) qInd.classList.add('active');

    const pKeys = document.querySelectorAll('#keyboard .key');
    pKeys.forEach(k => {
      if(k.textContent.trim() === fullPitch || (k.querySelector('span')?.textContent.trim() === fullPitch)){
        k.classList.add('qwerty-hit');
      }
    });
  }
});

window.addEventListener('keyup', event => {
  if(activeQwertyKeys.has(event.code)){
    activeQwertyKeys.delete(event.code);
    if(activeQwertyKeys.size === 0){
      const qInd = document.querySelector('#qwerty-indicator');
      if(qInd) qInd.classList.remove('active');
      document.querySelectorAll('#keyboard .key.qwerty-hit').forEach(k => k.classList.remove('qwerty-hit'));
    }
  }
});

window.addEventListener('hashchange',()=>{const view=location.hash.slice(1);if(views.includes(view)&&view!==state.view){state.view=view;renderApp()}});
renderApp();
if(saved) saveProject();
