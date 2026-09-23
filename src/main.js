import './style.css';
import './library.css';
import './workspace.css';
import './pages.css';
import './responsive.css';
import './components.css';
import './equipment-art.css';
import { pageHeader, miniGuide, actionBar, btn, disclosure, clickCard, mountTooltips, hideTooltip } from './ui.js';
import { icon } from './icons.js';
import { equipmentArt, projectArtworkKind } from './equipment-art.js';
import * as Tone from 'tone';
import { storeAudioAsset, resolveAudioAsset, isStoredAudioAsset, packProjectAssets, hydrateProjectAssets } from './project-storage.js';
import { validateProject } from './project-format.js';
import { normalizedBpm, toneSwingAmount, stepOffsetSeconds, melodyDurationSeconds, melodyGain, rollGainMultiplier } from './transport.js';

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

const kitNames = {rnb:'R&B', house:'House', trap:'Trap', dnb:'DnB', acoustic:'Acoustic', dj:'DJ'};
const GENRE_SWING = { rnb: 18, trap: 12, house: 8, acoustic: 15, dnb: 0, dj: 10 };
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
const defaultSections = () => [
  { name: 'Intro', bars: 1, active: { keys: true, drums: false, chords: true, vocals: false } },
  { name: 'Verse', bars: 2, active: { keys: true, drums: true, chords: true, vocals: false } },
  { name: 'Hook', bars: 2, active: { keys: true, drums: true, chords: true, vocals: true } },
  { name: 'Outro', bars: 1, active: { keys: true, drums: false, chords: true, vocals: false } }
];
const defaultDrums = () => ({
  kick:new Set([0,6,8,11,14]),
  snare:new Set([4,12]),
  clap:new Set([4,12]),
  hat:new Set([0,2,4,6,8,10,12,14]),
  openhat:new Set([2,10]),
  bass:new Set([0,8])
});

function esc(value){return String(value??'').replace(/[&<>"']/g,c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));}
const trackIconName = { keys:'music_note', drums:'album', chords:'piano', vocals:'mic' };
function loadProject(){try{return JSON.parse(localStorage.getItem('bmai-project'))}catch{return null}}
const saved = loadProject();

const state = {
  view: (saved?.id && views.includes(location.hash.slice(1))) ? location.hash.slice(1) : 'home',
  committed: !!(saved?.id),
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
  vocalTakes: Array.isArray(saved?.vocalTakes) ? saved.vocalTakes.map(t => ({...t})) : [],
  vocalRec: normalizeVocalRec(saved?.vocalRec),
  idea: Number.isInteger(saved?.idea) ? saved.idea : 0,
  melodyDrafts: Array.isArray(saved?.melodyDrafts) && saved.melodyDrafts.length === 4
    ? saved.melodyDrafts.map(list => Array.isArray(list) ? list.map(note => ({...note})) : [])
    : [[], [], [], []],
  instrument: saved?.instrument || 'rhodes',
  swing: saved?.swing !== undefined ? Number(saved.swing) : 18,
  mix: saved?.mix || defaultMix(),
  drumsAdded: !!saved?.drumsAdded,
  melodyAdded: saved?.melodyAdded != null ? !!saved.melodyAdded : !!(saved?.pattern?.length),
  drumPunch: saved?.drumPunch !== false,
  customSamples: saved?.customSamples || { kick: '', snare: '', clap: '', hat: '', openhat: '', bass: '' },
  customSampleAssets: saved?.customSampleAssets || {},
  fx: saved?.fx || { reverb: 0.22, delay: 0.15, filter: 0 },
  eq: saved?.eq || { low: 0, mid: 0, high: 0 },
  masterLimiter: saved?.masterLimiter !== false,
  sidechain: saved?.sidechain !== false,
  bassTuned: saved?.bassTuned !== false,
  drumTrim: saved?.drumTrim || {},
  songMode: !!saved?.songMode,
  songSection: saved?.songSection || 0,
  sections: saved?.sections || [
    { name: 'Intro', bars: 1, active: { keys: true, drums: false, chords: true, vocals: false } },
    { name: 'Verse', bars: 2, active: { keys: true, drums: true, chords: true, vocals: false } },
    { name: 'Hook', bars: 2, active: { keys: true, drums: true, chords: true, vocals: true } },
    { name: 'Outro', bars: 1, active: { keys: true, drums: false, chords: true, vocals: false } }
  ],
  sectionPatterns: saved?.sectionPatterns && typeof saved.sectionPatterns === 'object'
    ? Object.fromEntries(Object.entries(saved.sectionPatterns).map(([key, list]) => [key, Array.isArray(list) ? list.map(note => ({...note})) : []]))
    : {}
};
if (saved?.drums) {
  for (const lane of lanes) state.drums[lane] = new Set(saved.drums[lane] || []);
}
if (!state.melodyDrafts[state.idea]?.length && state.pattern.length) {
  state.melodyDrafts[state.idea] = state.pattern.map(note => ({...note}));
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
const projectUndo = [];
const projectRedo = [];
let lastProjectSnapshot = null;
let projectHistoryBusy = false;
let selectedNote = -1;
let playing = false;
let timer;
let sequenceStep = 0;
let metronomeOn = false;
let audioContext = Tone.getContext().rawContext;
let projectAudioReady = Promise.resolve([]);
let audioRestoreVersion = 0;
let projectSaveError = false;
const bufferCache = new Map();
const sfBufferCache = new Map();
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

async function unlockAudio(){
  audioContext ||= new AudioContext();
  const resumeSamples = audioContext.state === 'suspended' ? audioContext.resume() : Promise.resolve();
  try{ if(Tone?.start) await Tone.start(); }catch{}
  try{ await resumeSamples; }catch{}
  initMasterChain();
  return audioContext;
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
  Tone.Transport.bpm.value = normalizedBpm(state.bpm);
  Tone.Transport.swing = toneSwingAmount(state.swing);
  Tone.Transport.swingSubdivision = '16n';
  try{ Tone.Transport.position = 0; }catch{}
}

function updatePlayhead(step){
  const block=document.querySelector('.arrange-block');
  if(block) block.style.setProperty('--play',`${step/16}`);
  const head=document.querySelector('#playhead');
  if(head) head.style.left=`${(step/16)*100}%`;
  const barEl=document.querySelector('.bar-count');
  if(barEl) barEl.textContent=`${state.songMode?(state.songSection+1):1} · ${Math.floor(step/4)+1} · ${(step%4)+1}`;
  document.querySelectorAll('.step').forEach(node=>{
    node.classList.toggle('now',Number(node.dataset.step)===step);
  });
  document.querySelectorAll('.note').forEach(el=>{
    const note=state.pattern[Number(el.dataset.i)];
    if(!note) return;
    el.classList.toggle('playing',playing && step>=note.x && step<(note.x+note.w));
  });
  document.querySelectorAll('.rack-hit, .rack-cell, .rack-tick, [data-rack-cell]').forEach(node=>{
    const value=node.dataset.step??node.dataset.rackCell;
    if(value==null) return;
    node.classList.toggle('now',Number(value)===step);
  });
  const chordBars=state.chords?.bars?.length||1;
  const chordIndex=Math.floor(step/4)%chordBars;
  document.querySelectorAll('[data-rack-bar]').forEach(node=>{
    node.classList.toggle('now',playing&&Number(node.dataset.rackBar)===chordIndex);
  });
  document.querySelectorAll('.chord-bar').forEach((node,index)=>{
    node.classList.toggle('current-chord',index===chordIndex);
  });
  if(state.view==='chords'){
    const box=document.querySelector('#piano-selected');
    const symbol=chordAt(step);
    if(box&&box.textContent!==symbol) box.textContent=symbol;
  }
}

function advancePlayback(when){
  if(!playing) return;
  const step=sequenceStep%16;
  try{ playDrumStep(step, when); }catch{}
  const token = setPlaying.token;
  if(when != null) Tone.getDraw().schedule(() => { if(playing && token === setPlaying.token) updatePlayhead(step); }, when);
  else updatePlayhead(step);
  if(step===15 && state.songMode && state.sections?.length){
    const current=state.sections[state.songSection]||state.sections[0];
    const totalBars=current?.bars||1;
    if(songBarCount>=totalBars-1){
      songBarCount=0;
      state.songSection=(state.songSection+1)%state.sections.length;
      updateSectionUI();
    } else {
      songBarCount+=1;
    }
  }
  sequenceStep=(sequenceStep+1)%16;
}

function startTimeoutLoop(){
  let nextStep = 0;
  const startedAt = audioContext.currentTime + 0.05;
  const tick=()=>{
    if(!playing) return;
    const now = audioContext.currentTime;
    // Schedule ahead on the audio clock instead of accumulating timer drift.
    let when = startedAt + stepOffsetSeconds(nextStep, state.bpm, state.swing);
    while(when < now + 0.1){
      advancePlayback(Math.max(now, when));
      nextStep += 1;
      when = startedAt + stepOffsetSeconds(nextStep, state.bpm, state.swing);
    }
    timer=setTimeout(tick, 25);
  };
  tick();
}

function startToneLoop(){
  stopToneLoop();
  toneLoop.gotTick = false;
  if(Tone?.Transport){
    try{
      syncToneTransport();
      toneLoop.sequence=new Tone.Sequence(time=>{
        toneLoop.gotTick = true;
        advancePlayback(time);
      }, Array.from({length:16},(_,i)=>i), '16n');
      toneLoop.sequence.start(0);
      Tone.Transport.start('+0.02');
      timer = setTimeout(()=>{
        if(!playing || toneLoop.gotTick) return;
        stopToneLoop();
        startTimeoutLoop();
      }, 280);
      return;
    }catch{
      stopToneLoop();
    }
  }
  startTimeoutLoop();
}

function stopToneLoop(){
  Tone.getDraw().cancel(0);
  clearTimeout(timer);
  clearInterval(timer);
  if (Tone && Tone.Transport) {
    Tone.Transport.stop();
    Tone.Transport.cancel(0);
  }
  if (toneLoop.sequence) {
    try{ toneLoop.sequence.stop(); }catch{}
    try{ toneLoop.sequence.dispose(); }catch{}
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

function triggerKickSidechain(when=null){
  if(state.sidechain === false || !sidechainDuckerGain || !audioContext) return;
  const now = Math.max(audioContext.currentTime, when ?? audioContext.currentTime);
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
      ctx.strokeStyle = '#3d3e41';
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
    gradient.addColorStop(0, '#96999d');
    gradient.addColorStop(0.6, '#a2a4a8');
    gradient.addColorStop(1, '#cccfd3');

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
    let arr;
    if(isStoredAudioAsset(url)){
      const blob = await resolveAudioAsset(url);
      if(!blob) return null;
      arr = await blob.arrayBuffer();
    } else {
      const res = await fetch(publicUrl(url));
      if(!res.ok || (res.headers.get('content-type') || '').includes('text/html')) return null;
      arr = await res.arrayBuffer();
    }
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
  await Promise.all(lanes.map(lane => kit[lane] ? getAudioBuffer(kit[lane]) : null));
}

async function prepareVocalBuffer(blobUrl){
  const buffer = blobUrl ? await getAudioBuffer(blobUrl) : null;
  if(vocalUrl === blobUrl){
    vocalBuffer = buffer;
    drawVocalWaveform();
  }
  return buffer;
}

function restoreProjectAudio(){
  const version = ++audioRestoreVersion;
  const projectId = state.id;
  vocalBuffer = null;
  for(const lane of lanes){
    customBuffers[lane] = null;
    starterKit[lane] = state.customSampleAssets?.[lane] || (state.customSamples?.[lane] ? '' : sessionKits[state.kit][lane]);
  }
  projectAudioReady = (async () => {
    const missing = [];
    await Promise.all(lanes.map(async lane => {
      const ref = state.customSampleAssets?.[lane];
      if(!ref){
        if(state.customSamples?.[lane]) missing.push(`${lane} sample`);
        return;
      }
      const buffer = await getAudioBuffer(ref);
      if(version !== audioRestoreVersion || state.id !== projectId || state.customSampleAssets?.[lane] !== ref) return;
      customBuffers[lane] = buffer;
      if(!buffer) missing.push(`${lane} sample`);
    }));
    const url = vocalUrl;
    if(url){
      const buffer = await getAudioBuffer(url);
      if(version !== audioRestoreVersion || state.id !== projectId) return [];
      if(vocalUrl === url) vocalBuffer = buffer;
      if(!buffer) missing.push('vocal');
    }
    if(version !== audioRestoreVersion || state.id !== projectId) return [];
    drawVocalWaveform();
    if(missing.length) notify(`Missing audio: ${missing.join(', ')}. Reimport the original files.`);
    return missing;
  })();
  return projectAudioReady;
}

function playSampleBuffer(buf, volume = 0.75, isDrum = false, playbackRate = 1.0, time = null, pan = 0, stopAfter = 0){
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

  const startAt = (time != null && time > audioContext.currentTime) ? time : audioContext.currentTime;
  source.start(startAt);
  if(stopAfter > 0){
    try{ source.stop(startAt + stopAfter); }catch{}
  }
}
let catalog = null;
let packId = 'featured';
let groupId = 'picks';
let query = '';
let previewAudio = null;
let recorder = null;
let vocalArm = null;
let vocalUrl = state.vocals?.url || '';
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
function playSoundfontNote(sfName, note, duration, volume, when){
  const data = soundfontCache[sfName]?.[note];
  if(!data || !audioContext) return false;
  const key = `${sfName}|${note}`;
  const buf = sfBufferCache.get(key);
  if(buf){
    playSampleBuffer(buf, Math.min(1.4, volume * 1.5), false, 1, when);
    return true;
  }
  fetch(data).then(r=>r.arrayBuffer()).then(arr=>audioContext.decodeAudioData(arr.slice(0))).then(decoded=>{
    sfBufferCache.set(key, decoded);
  }).catch(()=>{});
  return false;
}
function tone(note,duration=.32,volume=.08,instrument=state.instrument||'rhodes',useSidechain=false,when=null){
  audioContext||=new AudioContext();
  if(audioContext.state==='suspended') audioContext.resume();
  const now=when ?? audioContext.currentTime;
  const freq=noteFrequency(note);
  if(!freq||isNaN(freq)) return;
  const high=Math.min(1,Math.max(0,((69+12*Math.log2(freq/440))-50)/30));
  const voicedVolume=volume*(1.12-high*.32);
  const sfName = soundfontNames[instrument];
  if(sfName){
    triggerSoundfontLoad(instrument);
    if(playSoundfontNote(sfName, note, duration, voicedVolume, now)) return;
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
    triggerKickSidechain(time);
  }

  const laneMix = state.drumMix?.[name] || { vol: 1.0, pan: 0 };
  const finalVol = volume * (laneMix.vol ?? 1.0);
  const finalPan = laneMix.pan ?? 0;

  let playbackRate = 1.0;
  if(name === 'bass' && state.bassTuned !== false){
    const root = getChordRoot(currentChord());
    playbackRate = root / 65.41;
  }

  const trim = Number(state.drumTrim?.[name]) || 0;
  if(customBuffers[name]){
    playSampleBuffer(customBuffers[name], finalVol, true, playbackRate, time, finalPan, trim);
    return;
  }
  const url = starterKit[name];
  if(!url) return;
  const buf = bufferCache.get(url);
  if(buf){
    playSampleBuffer(buf, finalVol, true, playbackRate, time, finalPan, trim);
  } else {
    getAudioBuffer(url);
  }
}

async function loadCustomSample(lane, file){
  if(!file || !lanes.includes(lane)) return;
  const projectId = state.id;
  try{
    audioContext ||= new AudioContext();
    if(audioContext.state === 'suspended') await audioContext.resume();
    const arr = await file.arrayBuffer();
    const buf = await audioContext.decodeAudioData(arr);
    const ref = await storeAudioAsset(file);
    if(state.id !== projectId) return;
    customBuffers[lane] = buf;
    state.customSamples = state.customSamples || {};
    state.customSamples[lane] = file.name;
    state.customSampleAssets ||= {};
    state.customSampleAssets[lane] = ref;
    starterKit[lane] = ref;
    bufferCache.set(ref, buf);
    saveProject();
    renderApp();
    hit(lane, 0.85);
    notify(`Loaded custom ${lane.toUpperCase()}: ${file.name}`);
  }catch(err){
    console.error('Failed to load sample:', err);
    notify(`Could not read "${file.name}". Use WAV, MP3, OGG, or FLAC.`);
  }
}

function resetCustomSample(lane){
  customBuffers[lane] = null;
  if(state.customSamples) delete state.customSamples[lane];
  if(state.customSampleAssets) delete state.customSampleAssets[lane];
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
function chordAt(step){
  const bars = Array.isArray(state.chords?.bars) && state.chords.bars.length ? state.chords.bars : ['Am7'];
  return bars[Math.floor(step / 4) % bars.length];
}
function currentChord(){
  return chordAt(sequenceStep);
}
async function playVocalOnce(when=null){
  if(!vocalUrl||!mixVol('vocals')) return;
  audioContext ||= new AudioContext();
  if(audioContext.state === 'suspended'){
    try{ await audioContext.resume(); }catch{ return; }
  }
  if(audioContext.state !== 'running' || !vocalBuffer){
    if(vocalUrl && !vocalBuffer) prepareVocalBuffer(vocalUrl);
    return;
  }

  if(vocalBuffer){
    const take = (state.vocalTakes || []).find(item => item.url === vocalUrl) || {start:0,end:1,gain:1};
    const source = audioContext.createBufferSource();
    source.buffer = vocalBuffer;
    const gain = audioContext.createGain();
    gain.gain.value = mixVol('vocals') * Math.max(0, Number(take.gain) || 1);

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
    }
    const start = Math.max(0, Math.min(1, Number(take.start) || 0));
    const end = Math.max(start + 0.01, Math.min(1, Number(take.end) || 1));
    try{ source.start(Math.max(audioContext.currentTime, when ?? audioContext.currentTime), start * vocalBuffer.duration, (end - start) * vocalBuffer.duration); }catch{}
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
function partAudible(part){
  if(part==='keys') return !!(state.melodyAdded || state.view==='melody');
  if(part==='drums') return !!(state.drumsAdded || state.view==='drums');
  if(part==='chords') return !!(state.chordAdded || state.view==='chords');
  if(part==='vocals') return !!(state.vocalAdded || (state.view==='vocals' && (vocalUrl || vocalBuffer)));
  return false;
}
function projectHasMusic(){
  return !!(state.melodyAdded || state.drumsAdded || state.chordAdded || state.vocalAdded);
}
function playDrumStep(step, when=null){
  const activeDrums = isTrackActive('drums') && partAudible('drums');
  const activeKeys = isTrackActive('keys') && partAudible('keys');
  const activeChords = isTrackActive('chords') && partAudible('chords');
  const activeVocals = isTrackActive('vocals') && partAudible('vocals');

  if(activeDrums && mixVol('drums')){
    for(const name of lanes){
      if(state.drums[name]?.has(step)){
        const roll = state.drumRolls?.[name]?.[step] || 1;
        const vel = drumVelocity(name, step) * mixVol('drums');
        if(roll > 1){
          const stepDur = (60 / state.bpm) / 4;
          const now = audioContext ? audioContext.currentTime : 0;
          const baseTime = when ?? now;
          for(let k = 0; k < roll; k++){
            const subTime = baseTime + (stepDur / roll) * k;
            const subVel = vel * (0.85 + 0.15 * (k / roll));
            hit(name, subVel, subTime);
          }
        } else {
          hit(name, vel, when);
        }
      }
    }
  }

  if(activeKeys && mixVol('keys') && activePattern().length){
    const sixteenth = 60 / state.bpm / 4;
    activePattern().filter(note => note.x === step).forEach(note => {
      const hold = melodyDurationSeconds(note.w, state.bpm);
      tone(note.n, hold, melodyGain(note.x, mixVol('keys')), state.instrument, false, when);
    });
  }

  if(activeChords && mixVol('chords') && step % 4 === 0){
    const chord = currentChord();
    const tones = chordTones[chord] || getChordNotes(chord);
    tones.forEach(note => tone(note, .78, .045 * mixVol('chords'), state.instrument === 'pluck' ? 'rhodes' : state.instrument, true, when));
  }

  if(activeVocals && step === 0) playVocalOnce(when);
  if(metronomeOn && step % 4 === 0) tone(step === 0 ? 'C6' : 'C5', .05, .035, 'pluck', false, when);
}

function projectSnapshot(){
  return {
    schemaVersion: 1,
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
    melodyDrafts: (state.melodyDrafts || [[],[],[],[]]).map(list => (list || []).map(note => ({...note}))),
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
    vocalTakes: (state.vocalTakes || []).map(t => ({...t})),
    vocalRec: vocalRecSettings(),
    mix: state.mix,
    melodyAdded: !!state.melodyAdded,
    drumPunch: state.drumPunch !== false,
    customSamples: state.customSamples || {},
    customSampleAssets: state.customSampleAssets || {},
    fx: state.fx || { reverb: 0.22, delay: 0.15, filter: 0 },
    eq: state.eq || { low: 0, mid: 0, high: 0 },
    masterLimiter: state.masterLimiter !== false,
    sidechain: state.sidechain !== false,
    bassTuned: state.bassTuned !== false,
    drumTrim: state.drumTrim || {},
    songMode: !!state.songMode,
    songSection: state.songSection || 0,
    sections: state.sections || [],
    sectionPatterns: state.sectionPatterns || {}
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
  if(!state.committed) return;
  const snapshot = projectSnapshot();
  const comparable = value => { const clone = structuredClone(value); delete clone.updated; return JSON.stringify(clone); };
  if(!projectHistoryBusy && lastProjectSnapshot && comparable(lastProjectSnapshot) !== comparable(snapshot)){
    projectUndo.push(structuredClone(lastProjectSnapshot));
    if(projectUndo.length > 50) projectUndo.shift();
    projectRedo.length = 0;
  }
  const status = document.querySelector('#project-status');
  try{
    const list = loadProjects();
    const index = list.findIndex(p => p.id === snapshot.id);
    if(index >= 0) list[index] = snapshot;
    else list.unshift(snapshot);
    writeProjects(list);
    localStorage.setItem('bmai-project', JSON.stringify(snapshot));
    lastProjectSnapshot = structuredClone(snapshot);
    projectSaveError = false;
    if(status) status.textContent = 'Saved on this device';
    return true;
  }catch{
    projectSaveError = true;
    if(status) status.textContent = 'Not saved — download a backup';
    notify('Device storage is full or unavailable. Download a project backup to keep your work.');
    return false;
  }
}

function restoreProjectHistory(direction){
  const source = direction === 'undo' ? projectUndo : projectRedo;
  const destination = direction === 'undo' ? projectRedo : projectUndo;
  if(!source.length){ notify(direction === 'undo' ? 'Nothing to undo' : 'Nothing to redo'); return false; }
  const target = source.pop();
  const current = projectSnapshot();
  destination.push(structuredClone(current));
  projectHistoryBusy = true;
  try{
    applySnapshot(target);
    lastProjectSnapshot = structuredClone(target);
    saveProject();
  }finally{ projectHistoryBusy = false; }
  renderApp();
  notify(direction === 'undo' ? 'Undid project change' : 'Redid project change');
  return true;
}

function applySnapshot(project){
  releaseVocalTake();
  drumHistory.length = 0;
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
  state.customSampleAssets = project.customSampleAssets || {};
  state.fx = project.fx || { reverb: 0.22, delay: 0.15, filter: 0 };
  state.eq = project.eq || { low: 0, mid: 0, high: 0 };
  state.masterLimiter = project.masterLimiter !== false;
  state.sidechain = project.sidechain !== false;
  state.bassTuned = project.bassTuned !== false;
  state.drumTrim = project.drumTrim || {};
  state.songMode = !!project.songMode;
  state.songSection = project.songSection || 0;
  state.sectionPatterns = project.sectionPatterns && typeof project.sectionPatterns === 'object'
    ? Object.fromEntries(Object.entries(project.sectionPatterns).map(([key,list]) => [key, cloneNotes(list)])) : {};
  state.sections = Array.isArray(project.sections) && project.sections.length ? structuredClone(project.sections) : defaultSections();
  updateDrumBusRouting();
  updateFilterRouting();
  updateEQ();
  updateMasterLimiter();
  state.chords = project.chords || (progressions[state.key] ? progressions[state.key][0] : progressions['A minor'][0]);
  state.chordAdded = !!project.chordAdded;
  state.vocals = project.vocals || { title: 'Soft hook', line: 'keep the night close, don’t say it loud', chain: 'Modern R&B' };
  state.vocalAdded = !!project.vocalAdded;
  state.vocalTakes = Array.isArray(project.vocalTakes) ? project.vocalTakes.map(t => ({...t})) : [];
  state.vocalRec = normalizeVocalRec(project.vocalRec);
  if(vocalUrl && vocalUrl.startsWith('blob:') && vocalUrl !== state.vocals?.url) URL.revokeObjectURL(vocalUrl);
  vocalUrl = state.vocals?.url || '';
  state.mix = Object.fromEntries(Object.entries(defaultMix()).map(([track, defaults]) => [track, {...defaults, ...project.mix?.[track]}]));
  state.melodyAdded = !!project.melodyAdded;
  state.idea = Number.isInteger(project.idea) ? project.idea : 0;
  state.melodyDrafts = Array.isArray(project.melodyDrafts) && project.melodyDrafts.length === 4
    ? project.melodyDrafts.map(list => Array.isArray(list) ? list.map(note => ({...note})) : [])
    : [[], [], [], []];
  if(!state.melodyDrafts[state.idea]?.length && state.pattern.length) state.melodyDrafts[state.idea] = state.pattern.map(note => ({...note}));
  state.committed = true;
  for(const lane of lanes) state.drums[lane] = new Set(project.drums?.[lane] || []);
  restoreProjectAudio();
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
  resetProjectEnvironment();
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
  state.melodyDrafts=[[],[],[],[]];
  state.instrument='rhodes';
  state.chords=progressions['A minor'][0];
  state.chordAdded=false;
  state.drumsAdded=false;
  state.vocalAdded=false;
  state.vocalTakes=[];
  if(vocalUrl && vocalUrl.startsWith('blob:')) URL.revokeObjectURL(vocalUrl);
  vocalUrl='';
  vocalBuffer=null;
  state.vocals={title:'Soft hook',line:'keep the night close, don’t say it loud',chain:'Modern R&B'};
  state.melodyAdded=false;
  state.drumRolls={};
  state.customSamples={kick:'',snare:'',clap:'',hat:'',openhat:'',bass:''};
  state.mix=defaultMix();
  state.committed=true;
  applyKit(kit,true);
  saveProject();
  setView('home');
  notify(`${name} saved. Add melody, drums, or chords next.`);
}
function startNewIdea(){
  if(playing) setPlaying(false);
  resetProjectEnvironment();
  history=[]; future=[];
  selectedNote=-1;
  state.committed=false;
  state.id=crypto.randomUUID();
  state.name='Untitled idea';
  state.description='';
  state.bpm=92;
  state.key='A minor';
  state.prompt='late-night R&B, warm and a little dark';
  state.chips=['R&B'];
  state.pattern=[];
  state.idea=0;
  state.melodyDrafts=[[],[],[],[]];
  state.instrument='rhodes';
  state.chords=progressions['A minor'][0];
  state.chordAdded=false;
  state.drumsAdded=false;
  state.vocalAdded=false;
  state.vocalTakes=[];
  state.melodyAdded=false;
  state.drumRolls={};
  state.customSamples={kick:'',snare:'',clap:'',hat:'',openhat:'',bass:''};
  state.mix=defaultMix();
  state.songMode=false;
  state.songSection=0;
  if(vocalUrl && vocalUrl.startsWith('blob:')) URL.revokeObjectURL(vocalUrl);
  vocalUrl='';
  vocalBuffer=null;
  state.vocals={title:'Soft hook',line:'keep the night close, don’t say it loud',chain:'Modern R&B'};
  localStorage.removeItem('bmai-project');
  applyKit('rnb',true);
  setView('home');
  notify('Create a project to start.');
}
function nameFromPrompt(prompt){
  const words=String(prompt||'').split(/[\s,]+/).filter(Boolean).slice(0,4);
  if(!words.length) return 'Untitled idea';
  return words.map(word=>word.charAt(0).toUpperCase()+word.slice(1)).join(' ').slice(0,42);
}
function generateStarter(){
  const prompt=document.querySelector('#feeling-prompt')?.value.trim()||'late-night R&B, warm and a little dark';
  const key=document.querySelector('#feeling-key')?.value||'A minor';
  const bpm=Math.max(40,Math.min(240,Number(document.querySelector('#feeling-bpm')?.value)||92));
  const kit=sessionKits[document.querySelector('#feeling-kit')?.value]?document.querySelector('#feeling-kit').value:'rnb';
  if(playing) setPlaying(false);
  resetProjectEnvironment();
  history=[]; future=[];
  selectedNote=-1;
  createKit=kit;
  state.id=crypto.randomUUID();
  state.prompt=prompt;
  state.name=nameFromPrompt(prompt);
  state.description=prompt;
  state.bpm=bpm;
  state.key=keyScales[key]?key:'A minor';
  state.chips=['R&B'];
  state.idea=0;
  state.instrument='rhodes';
  state.chords=(progressions[state.key]||progressions['A minor'])[0];
  state.chordAdded=false;
  state.vocalAdded=false;
  state.vocalTakes=[];
  state.drumRolls={};
  state.customSamples={kick:'',snare:'',clap:'',hat:'',openhat:'',bass:''};
  state.mix=defaultMix();
  state.songMode=false;
  state.songSection=0;
  if(vocalUrl && vocalUrl.startsWith('blob:')) URL.revokeObjectURL(vocalUrl);
  vocalUrl='';
  vocalBuffer=null;
  state.vocals={title:'Soft hook',line:'keep the night close, don’t say it loud',chain:'Modern R&B'};
  const scale=scaleForKey(state.key);
  state.melodyDrafts=[0,1,2,3].map(style=>buildMelodyPhrase(scale, style));
  state.pattern=cloneNotes(state.melodyDrafts[0]);
  state.melodyAdded=true;
  state.committed=true;
  applyKit(kit,true);
  state.drumsAdded=true;
  saveProject();
  setView('home');
  setPlaying(true);
  notify('Starter loop ready. Change a lane, or add chords and vocals.');
}
function applyKit(id,resetSteps=false){
  const kit=sessionKits[id]; if(!kit) return;
  state.kit=id;
  for(const lane of lanes){
    if(!customBuffers[lane] && !state.customSampleAssets?.[lane] && !state.customSamples?.[lane]){
      starterKit[lane]=kit[lane];
    }
  }
  if(resetSteps) for(const lane of lanes) state.drums[lane]=new Set(kit.steps[lane]);
  if(resetSteps && id !== 'dj' && GENRE_SWING[id] !== undefined) state.swing = GENRE_SWING[id];
  preloadKit(id);
}
applyKit(state.kit);

function resetProjectEnvironment(){
  releaseVocalTake();
  audioRestoreVersion += 1;
  projectAudioReady = Promise.resolve([]);
  drumHistory.length = 0;
  state.customSampleAssets = {};
  for(const lane of lanes) customBuffers[lane] = null;
  state.drumMix = Object.fromEntries(lanes.map(lane => [lane, { vol: 1, pan: 0 }]));
  state.drumTrim = {};
  state.fx = { reverb: 0.22, delay: 0.15, filter: 0 };
  state.eq = { low: 0, mid: 0, high: 0 };
  state.masterLimiter = true;
  state.sidechain = true;
  state.bassTuned = true;
  state.drumPunch = true;
  state.songMode = false;
  state.songSection = 0;
  state.sections = defaultSections();
  state.sectionPatterns = {};
  state.vocalRec = normalizeVocalRec();
  updateDrumBusRouting();
  updateFilterRouting();
  updateEQ();
  updateMasterLimiter();
}

function notify(msg){const toast=document.querySelector('.toast');toast.textContent=msg;toast.classList.add('show');clearTimeout(notify.t);notify.t=setTimeout(()=>toast.classList.remove('show'),2200)}
function setView(view){
  if(view!=='vocals') releaseVocalTake();
  if(view!=='home' && !state.committed){
    notify('Generate a loop first');
    if(state.view!=='home'){
      state.view='home';
      renderApp();
    }
    if(location.hash.slice(1) && location.hash.slice(1)!=='home') location.hash='home';
    return;
  }
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
    alignRollRuler();
    return;
  }
  const nav=studioNav.open?(wide?'160px':'185px'):'minmax(0,0px)';
  const side=wide||!inspectorPane.open?'minmax(0,0px)':'236px';
  shell.style.gridTemplateColumns=`${nav} minmax(0,1fr) ${side}`;
  shell.style.gridTemplateRows=pianoOn?'59px 56px minmax(0,1fr) minmax(168px,28vh) 29px':'59px 56px minmax(0,1fr) 29px';
  shell.style.gridTemplateAreas=pianoOn
    ?'"top top top" "bar bar bar" "nav stage side" "nav piano side" "foot foot foot"'
    :'"top top top" "bar bar bar" "nav stage side" "foot foot foot"';
  alignRollRuler();
}
function alignRollRuler(){
  const wrap=document.querySelector('#piano-wrap');
  const ruler=document.querySelector('.roll-ruler');
  if(!wrap||!ruler) return;
  ruler.style.paddingRight=`${Math.max(0,wrap.offsetWidth-wrap.clientWidth)}px`;
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
  const shift=list=>(list||[]).map(note=>{
    let degree=from.indexOf(note.n);
    if(degree<0){
      const pitch=pitchOf(note.n);
      degree=from.reduce((best,name,index)=>Math.abs(pitchOf(name)-pitch)<Math.abs(pitchOf(from[best])-pitch)?index:best,0);
    }
    return {...note,n:to[degree]};
  });
  state.pattern=shift(state.pattern);
  state.melodyDrafts=(state.melodyDrafts||[[],[],[],[]]).map(shift);
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
function cloneNotes(list){return (list||[]).map(note=>({...note}))}
function activePattern(){
  const section = state.songMode ? String(state.songSection) : '';
  return section && Array.isArray(state.sectionPatterns?.[section]) ? state.sectionPatterns[section] : state.pattern;
}
function saveActiveSectionPattern(){
  if(!state.songMode) return;
  state.sectionPatterns ||= {};
  state.sectionPatterns[String(state.songSection)] = cloneNotes(state.pattern);
}
function selectSongSection(index){
  const next = Number(index);
  if(!Number.isInteger(next) || !state.sections[next] || next === state.songSection) return;
  saveActiveSectionPattern();
  state.songSection = next;
  const savedPattern = state.sectionPatterns?.[String(next)];
  state.pattern = savedPattern?.length ? cloneNotes(savedPattern) : cloneNotes(state.pattern);
  rememberMelodyDraft();
  saveProject();
  renderApp();
  notify(`Editing ${state.sections[next].name}: its melody variation is now active`);
}
function rememberMelodyDraft(){
  if(!Array.isArray(state.melodyDrafts)||state.melodyDrafts.length!==4) state.melodyDrafts=[[],[],[],[]];
  const index=Math.max(0,Math.min(3,state.idea||0));
  state.melodyDrafts[index]=cloneNotes(state.pattern);
}
function buildMelodyPhrase(scale, style){
  const pick=degree=>scale[((degree%scale.length)+scale.length)%scale.length];
  const rand=n=>Math.floor(Math.random()*n);
  if(style===0){
    let degree=rand(3);
    return Array.from({length:8},(_,i)=>{
      degree=(degree+(rand(3)===0?-1:1)+scale.length)%scale.length;
      const w=rand(3)?1:2;
      const x=Math.min(15,i*2);
      return {n:pick(degree),x,w:Math.min(w,16-x)};
    });
  }
  if(style===1){
    let degree=scale.length-1;
    return Array.from({length:6},(_,i)=>{
      degree=Math.max(0,degree-(rand(2)+1));
      if(i===4) degree=Math.min(scale.length-1,degree+2);
      const x=Math.min(14,i*2+(i>3?2:0));
      return {n:pick(degree),x,w:Math.min(2,16-x)};
    });
  }
  if(style===2){
    const a=rand(scale.length);
    const b=(a+2)%scale.length;
    return [{n:pick(a),x:0,w:2},{n:pick(b),x:8,w:3}];
  }
  return Array.from({length:6},(_,i)=>{
    const x=Math.min(15,i*2+1);
    return {n:pick(rand(scale.length)),x,w:1};
  });
}
function generateMelody(onlyCurrent=false){
  const scale=scaleForKey();
  history.push(cloneNotes(state.pattern));
  future=[];
  if(!Array.isArray(state.melodyDrafts)||state.melodyDrafts.length!==4) state.melodyDrafts=[[],[],[],[]];
  const hasDrafts=state.melodyDrafts.some(list=>list?.length);
  if(onlyCurrent && hasDrafts){
    state.melodyDrafts[state.idea]=buildMelodyPhrase(scale, state.idea);
    state.pattern=cloneNotes(state.melodyDrafts[state.idea]);
    notify(`${melodyIdeas[state.idea].name} regenerated. Add it when it sounds right.`);
  }else{
    state.melodyDrafts=[0,1,2,3].map(style=>buildMelodyPhrase(scale, style));
    state.idea=0;
    state.pattern=cloneNotes(state.melodyDrafts[0]);
    notify('Four melody ideas ready. Pick one, then add it.');
  }
  state.melodyAdded=false;
  selectedNote=-1;
  saveProject();
  renderApp();
  scrollPianoToNotes();
  setPlaying(true);
}
function generateDrums(){
  if(typeof pushDrumHistory === 'function') pushDrumHistory();
  const kit=sessionKits[state.kit];
  for(const lane of lanes) state.drums[lane]=new Set(kit.steps[lane]);
  for(const step of [1,3,7,9,11,15]) Math.random()>.4?state.drums.hat.add(step):state.drums.hat.delete(step);
  for(const step of [5,9,13]) Math.random()>.65?state.drums.kick.add(step):state.drums.kick.delete(step);
  if(['rnb','acoustic','trap'].includes(state.kit)){
    state.drums.snare.add(10);
    if(Math.random()>.5) state.drums.snare.add(14);
  }
  saveProject();renderApp();notify(state.drumsAdded?'Beat rewritten.':'Beat rewritten. Add drums when the pocket is right.');
}
function generateChords(){const options=progressions[state.key]||progressions['A minor'];state.chords=options[Math.floor(Math.random()*options.length)];state.chordAdded=false;saveProject();renderApp();notify(`${state.chords.name} is ready. Add it to the project.`)}
function generateVocals(){
  const mood=(state.chips[0]||'R&B').toLowerCase();
  const seed=state.prompt.split(/[\s,]+/).filter(Boolean)[0]||'night';
  const lines=[
    {title:'Soft hook',line:`keep the ${seed} close, don’t say it loud`,chain:state.vocals.chain},
    {title:'Low refrain',line:`I still hear that ${mood} in the hallway`,chain:state.vocals.chain},
    {title:'Lift',line:`wait for the drop, then let the ${seed} bloom`,chain:state.vocals.chain}
  ];
  const next=lines[Math.floor(Math.random()*lines.length)];
  state.vocals={...state.vocals,...next,url:state.vocals.url||''};
  saveProject();renderApp();notify(vocalUrl?'Hook line updated. Add the vocal when it sounds right.':'Hook line updated. Load or record audio, then add it.');
}

const app=document.querySelector('#app');
app.innerHTML=`
  <main class="shell">
    <header class="topbar">
      <button class="brand" id="go-home" type="button"><span class="brand-mark">B</span><span>BMAI</span><small>STUDIO</small></button>
      <button class="project" id="open-rack" type="button" aria-haspopup="dialog" aria-expanded="false" data-tip="Other parts in this project"><strong id="project-title">Untitled idea</strong><span id="project-status">Saved just now</span></button>
      <div class="top-actions"><button class="icon-btn" id="undo" data-tip="Undo">${icon('undo')}</button><button class="outline-btn" id="go-export">${icon('ios_share')} Export</button><button class="avatar" id="go-account">BM</button></div>
    </header>
    <section class="transport">
      <div class="transport-controls"><button class="round" id="play" aria-label="Play">${icon('play_arrow')}</button><button class="stop" id="stop" aria-label="Stop">${icon('stop')}</button><span class="bar-count" data-tip="Bar, beat, step">1 · 1 · 1</span></div>
      <div class="tempo">
        <label>BPM <input id="bpm" type="number" min="40" max="240" value="92" /></label>
        <button type="button" class="tap-tempo-btn" id="tap-tempo" data-tip="Click rhythmically to set BPM">TAP</button>
        <span class="divider"></span>
        <label class="key-menu">KEY <button type="button" class="key-trigger" id="key" aria-haspopup="listbox" aria-expanded="false"><span id="key-value">A minor</span></button>
          <ul class="key-list" id="key-list" hidden role="listbox">
            ${allKeys.map(k=>`<li><button type="button" data-key="${k}" role="option">${k}</button></li>`).join('')}
          </ul>
        </label>
        <span class="divider"></span>
        <label data-tip="MPC 16th swing groove">SWING <input id="swing" type="number" min="0" max="60" value="18" style="width:36px;" />%</label>
        <span class="divider"></span>
        <button class="metronome" id="metronome" type="button" data-tip="Metronome">${icon('timer')}</button>
      </div>
      <div class="transport-right">
        <canvas id="audio-visualizer" class="spectrum-canvas" width="105" height="24" data-tip="Real-time Audio Spectrum Visualizer"></canvas>
        <span class="divider"></span>
        <span class="meter-chip">4/4</span>
      </div>
    </section>
    <button class="nav-toggle" id="nav-toggle" type="button" aria-controls="studio-nav" aria-expanded="true">${icon('chevron_left')}</button>
    <div class="workspace">
      <aside class="tools" id="studio-nav">
        <div class="sidebar-title">Studio</div>
        <button class="tool" data-view="home">${icon('folder')}<span>Projects</span><small>home</small></button>
        <button class="tool" data-view="melody">${icon('music_note')}<span>Melody</span><small>inside</small></button>
        <button class="tool" data-view="drums">${icon('album')}<span>Drums</span><small>inside</small></button>
        <button class="tool" data-view="chords">${icon('piano')}<span>Chords</span><small>inside</small></button>
        <button class="tool" data-view="vocals">${icon('mic')}<span>Vocals</span><small>inside</small></button>
        <div class="sidebar-bottom">
          <button class="library">${icon('library_music')} Library</button>
          <button class="nav-link" data-view="mix">${icon('equalizer')} Mix</button>
          <button class="nav-link" data-view="export">${icon('ios_share')} Export</button>
          <button class="settings" data-view="settings">${icon('settings')} Settings</button>
        </div>
      </aside>
      <section class="main-stage" id="stage"></section>
      <aside class="inspector" id="inspector">
        <div class="inspector-sheet" id="inspector-sheet"></div>
      </aside>
      <button class="inspector-dock" id="inspector-dock" type="button" aria-label="Open project panel">
        <span class="preset-art"><span id="dock-artwork" aria-hidden="true">${equipmentArt(projectArtworkKind(state.id || state.name))}</span><span class="art-label" id="dock-label">R&amp;B</span></span>
        <strong id="dock-name"></strong>
        <span class="dock-open">Open</span>
      </button>
    </div>
    <section class="piano-section" id="piano-section">
      <div class="piano-header">
        <div>
          <p class="piano-kicker"><span class="piano-dot"></span>PIANO ROLL</p>
          <strong id="piano-label">Keys · Moonlit · 1 bar</strong>
        </div>
        <div class="piano-tools">
          <div class="piano-selected" id="piano-selected">No note</div>
          <button class="ghost" id="remove-note" type="button" disabled>Remove</button>
          <select id="piano-inst" class="piano-inst-select" data-tip="Change instrument"><option value="rhodes">Rhodes</option><option value="piano">Piano</option><option value="guitar">Guitar</option><option value="strings">Strings</option><option value="bass">Bass</option><option value="brass">Brass</option><option value="organ">Organ</option><option value="flute">Flute</option><option value="pad">Pad</option><option value="analog">Analog</option><option value="pluck">Pluck</option></select>
          <button class="ghost" data-roll="undo" type="button">${icon('undo')} Undo</button>
          <button class="ghost" data-roll="redo" type="button">${icon('redo')} Redo</button>
        </div>
      </div>
      <div class="roll-ruler" aria-hidden="true"><span class="ruler-key">KEY</span><div class="roll-beats"><span>Beat 1</span><span>Beat 2</span><span>Beat 3</span><span>Beat 4</span></div></div>
      <div class="piano-wrap" id="piano-wrap"><div class="keyboard" id="keyboard"></div><div class="grid" id="grid"><div class="playhead" id="playhead"></div></div></div>
    </section>
    <footer><span id="status-line"><b>Ready</b> · Local MVP session</span><span>Press <kbd>Space</kbd> to play</span></footer>
    <div class="library-modal" id="library-modal" hidden><div class="library-card"><div class="library-head"><div><span>LIBRARY</span><h2 id="library-count">CC0 sound library</h2></div><button id="close-library">${icon('close')}</button></div><div class="library-tabs"><button type="button" class="lib-tab active" id="lib-tab-sounds">Sounds</button><button type="button" class="lib-tab" id="lib-tab-sources">Sources</button></div><div id="lib-view-sounds"><div class="kit-row"><span>Beat style</span><button type="button" data-kit="rnb" class="on">R&amp;B</button><button type="button" data-kit="house">House</button><button type="button" data-kit="trap">Trap</button><button type="button" data-kit="dnb">Drum &amp; bass</button><button type="button" data-kit="acoustic">Acoustic</button><button type="button" data-kit="dj">DJ Set</button></div><div class="library-tools"><input id="library-search" type="search" placeholder="Search kicks, bass, pads, breaks…" aria-label="Search sounds" /></div><div class="pack-row" id="pack-row"></div><div class="group-row" id="group-row"></div><div class="sound-groups" id="sound-groups"></div><div class="library-meta"><span id="library-status"></span><span>CC0 only · novelty effects excluded</span></div></div><div id="lib-view-sources" hidden><div class="sources-intro"><h3>Free sources</h3></div><div class="sources-grid"><div class="source-card"><div class="source-header"><h4>SampleRadar</h4><span class="source-badge">75,000+ SAMPLES</span></div><p>Royalty-free drums, breaks, 808s, and vintage keys.</p><div class="source-actions"><a class="source-link-btn" href="https://www.musicradar.com/news/tech/free-music-samples-royalty-free-loops-hits-and-multis-to-download" target="_blank" rel="noopener">Open SampleRadar</a></div></div><div class="source-card"><div class="source-header"><h4>Freesound CC0</h4><span class="source-badge cc0">CC0</span></div><p>Public-domain scratches, vocal chants, and drum machines.</p><div class="source-actions"><a class="source-link-btn" href="https://freesound.org/search/?q=license:creative_commons_0" target="_blank" rel="noopener">Search Freesound</a></div></div><div class="source-card"><div class="source-header"><h4>Internet Archive</h4><span class="source-badge archive">ARCHIVE</span></div><p>Historic breaks, funk drums, and public-domain recordings.</p><div class="source-actions"><a class="source-link-btn" href="https://archive.org/details/audio" target="_blank" rel="noopener">Open Archive</a></div></div><div class="source-card"><div class="source-header"><h4>FluidR3 GM</h4><span class="source-badge soundfont">128 INSTRUMENTS</span></div><p>Sampled guitar, strings, organ, and flute already playable in the piano roll.</p><div class="source-actions"><a class="source-link-btn" href="https://github.com/gleitz/midi-js-soundfonts" target="_blank" rel="noopener">View soundfonts</a></div></div><div class="source-card"><div class="source-header"><h4>ccMixter &amp; Looperman</h4><span class="source-badge" style="background:#28292c;color:#c7cace;">FREE VOCALS</span></div><p>Over 30,000 royalty-free vocal acapellas, singing lines, and rap verses for BMAI vocals.</p><div class="source-actions"><a class="source-link-btn" href="https://ccmixter.org/browse" target="_blank" rel="noopener">ccMixter</a><a class="source-link-btn" href="https://www.looperman.com/acapellas" target="_blank" rel="noopener" style="margin-left:6px;">Looperman</a></div></div></div></div></div></div>
  </main>
  <input type="file" id="import-json-file" accept=".json" style="display:none;" />
  <input type="file" id="drum-sample-input" accept="audio/*,.wav,.mp3,.ogg,.flac,.aif,.aiff,.m4a" style="display:none;" />
  <input type="file" id="vocal-file-input" accept="audio/*,.wav,.mp3,.ogg,.flac,.aif,.aiff,.m4a" style="display:none;" />
    <div class="rack" id="rack" hidden>
      <button type="button" class="rack-backdrop" id="rack-backdrop" tabindex="-1" aria-label="Close"></button>
      <div class="rack-panel" role="dialog" aria-modal="true" aria-label="Other parts">
        <div class="rack-top">
          <div class="rack-switch" id="rack-switch" role="tablist"></div>
          <button type="button" class="rack-close" id="rack-close" aria-label="Close">${icon('close')}</button>
        </div>
        <div class="rack-ruler" id="rack-ruler" hidden aria-hidden="true"><span></span><div class="rack-beats"><i></i><i></i><i></i><i></i></div></div>
        <div class="rack-body" id="rack-body"></div>
      </div>
    </div>
    <div class="focus-rail" id="focus-rail" aria-hidden="true"></div>
    <div class="toast"></div>
`;
mountTooltips();
const melodyIdeas = [
  {name:'Moonlit', tag:'Warm · expressive', feel:'A small phrase that lifts on beat 3.'},
  {name:'Velvet tide', tag:'Soft · rising', feel:'The line steps down, then turns back up.'},
  {name:'Afterglow', tag:'Sparse · intimate', feel:'Two notes, with room left for the vocal.'},
  {name:'Low signal', tag:'Moody · rhythmic', feel:'The higher notes land off the beat.'}
];
function addedCount(){
  return [state.melodyAdded, state.drumsAdded, state.chordAdded, state.vocalAdded].filter(Boolean).length;
}
function nextEmptyLane(){
  if(!state.melodyAdded) return 'melody';
  if(!state.drumsAdded) return 'drums';
  if(!state.chordAdded) return 'chords';
  if(!state.vocalAdded) return 'vocals';
  return null;
}
function arrangement(){
  const kit=sessionKits[state.kit];
  const tracks=[];
  if(state.melodyAdded) tracks.push(`<div class="arrangement ${(!isTrackActive('keys')||state.mix.keys.mute)?'muted-track':''}" data-arrange-track="keys"><div class="track-label">${icon(trackIconName.keys,'track-icon keys')}<div><strong>Keys</strong><small>Electric piano</small></div></div><div class="clip"><span>${esc(melodyIdeas[state.idea].name)}</span><div class="mini-notes"></div></div></div>`);
  if(state.drumsAdded) tracks.push(`<div class="arrangement drum-track ${(!isTrackActive('drums')||state.mix.drums.mute)?'muted-track':''}" data-arrange-track="drums"><div class="track-label">${icon(trackIconName.drums,'track-icon drums')}<div><strong>Drums</strong><small id="drum-kit-label">${esc(kit.blurb)}</small></div></div><div class="clip drum-clip"><span>Kick · Snare · Clap · Hat · Open Hat · Bass</span><div class="mini-notes"></div></div></div>`);
  if(state.chordAdded) tracks.push(`<div class="arrangement ${(!isTrackActive('chords')||state.mix.chords.mute)?'muted-track':''}" data-arrange-track="chords"><div class="track-label">${icon(trackIconName.chords,'track-icon chords')}<div><strong>Chords</strong><small>${esc(state.chords.name)}</small></div></div><div class="clip chord-clip"><span>${esc(state.chords.bars.join(' · '))}</span></div></div>`);
  if(state.vocalAdded) tracks.push(`<div class="arrangement ${(!isTrackActive('vocals')||state.mix.vocals.mute)?'muted-track':''}" data-arrange-track="vocals"><div class="track-label">${icon(trackIconName.vocals,'track-icon vocals')}<div><strong>Vocals</strong><small>${esc(state.vocals.chain)}</small></div></div><div class="clip vocal-clip"><span>${esc(state.vocals.line)}</span></div></div>`);
  return `
    <div class="arrange-block">
    <div class="timeline-title"><span>${state.songMode?`SONG: ${(state.sections[state.songSection]?.name||'Intro').toUpperCase()}`:'1 BAR LOOP'}</span><div class="timeline-ruler"><span>1</span><span>2</span><span>3</span><span>4</span></div></div>
    ${tracks.length?tracks.join(''):'<p class="page-lead arrange-empty">Nothing in this project yet. Add a melody, drums, chords, or a vocal.</p>'}
    <div class="arrange-playhead" id="arrange-playhead"></div>

    ${addedCount()<2?'':`<div class="song-structure-bar">
      <div class="song-structure-head">
        <div class="structure-mode-toggle">
          <button type="button" class="mode-pill ${state.songMode?'on':''}" id="toggle-song-mode" data-tip="Toggle between single 1-bar loop and full song progression">
            <span class="mode-dot"></span> ${state.songMode ? 'SONG' : 'LOOP'}
          </button>
        </div>
        <span class="structure-hint">${state.songMode ? state.sections[state.songSection].name : '1 bar loop'}</span>
      </div>
      <div class="section-tiles">
        ${state.sections.map((sec, i) => `
          <div class="section-tile ${state.songSection === i ? 'active' : ''}">
            <button type="button" class="section-top" data-section-idx="${i}">
              <span class="sec-num">0${i+1}</span>
              <strong>${sec.name.toUpperCase()}</strong>
              <span class="sec-bars">${sec.bars} ${sec.bars === 1 ? 'bar' : 'bars'}</span>
            </button>
            <div class="section-track-tags">
              <button type="button" class="sec-tag ${sec.active.keys ? 'on' : ''}" data-toggle-sec-track="${i}" data-track="keys">Keys</button>
              <button type="button" class="sec-tag ${sec.active.drums ? 'on' : ''}" data-toggle-sec-track="${i}" data-track="drums">Drums</button>
              <button type="button" class="sec-tag ${sec.active.chords ? 'on' : ''}" data-toggle-sec-track="${i}" data-track="chords">Chords</button>
              <button type="button" class="sec-tag ${sec.active.vocals ? 'on' : ''}" data-toggle-sec-track="${i}" data-track="vocals">Vocals</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`}
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
  return `<button class="back-project" data-view="home" type="button">${icon('arrow_back')} Back to ${esc(state.name)}</button>`;
}
function sketchLane(track, view, title, detail, added){
  const muted=added && (!isTrackActive(track) || state.mix[track]?.mute);
  return `<button class="arrangement sketch-lane ${added?'filled':'empty-lane'} ${muted?'muted-track':''}" data-view="${view}" data-arrange-track="${track}" type="button">
    <div class="track-label">${icon(trackIconName[track]||'music_note','track-icon '+track)}<div><strong>${title}</strong><small>${added?esc(detail):'Empty'}</small></div></div>
    <div class="clip"><span>${added?esc(detail):'Not in this project'}</span><em>${added?'Change':'Add'}</em></div>
  </button>`;
}
function sketchBoard(){
  const kit=sessionKits[state.kit];
  return `<div class="arrange-block sketch-board">
    <div class="timeline-title"><span>${addedCount()>=2 && state.songMode?`SONG: ${(state.sections[state.songSection]?.name||'Intro').toUpperCase()}`:'1 BAR LOOP'}</span><div class="timeline-ruler"><span>1</span><span>2</span><span>3</span><span>4</span></div></div>
    ${sketchLane('keys','melody','Keys', state.melodyAdded?melodyIdeas[state.idea].name:'', state.melodyAdded)}
    ${sketchLane('drums','drums','Drums', state.drumsAdded?kit.blurb:'', state.drumsAdded)}
    ${sketchLane('chords','chords','Chords', state.chordAdded?state.chords.name:'', state.chordAdded)}
    ${sketchLane('vocals','vocals','Vocals', state.vocalAdded?(state.vocals.title||'Vocal'):'', state.vocalAdded)}
    <div class="arrange-playhead" id="arrange-playhead"></div>
    ${addedCount()>=2?`<div class="song-structure-bar">
      <div class="song-structure-head">
        <div class="structure-mode-toggle">
          <button type="button" class="mode-pill ${state.songMode?'on':''}" id="toggle-song-mode"><span class="mode-dot"></span> ${state.songMode?'SONG':'LOOP'}</button>
        </div>
        <span class="structure-hint">${state.songMode?state.sections[state.songSection].name:'1 bar loop'}</span>
      </div>
      <div class="section-tiles">
        ${state.sections.map((sec, i) => `<div class="section-tile ${state.songSection===i?'active':''}"><button type="button" class="section-top" data-section-idx="${i}"><span class="sec-num">0${i+1}</span><strong>${sec.name.toUpperCase()}</strong><span class="sec-bars">${sec.bars} ${sec.bars===1?'bar':'bars'}</span></button><div class="section-track-tags"><button type="button" class="sec-tag ${sec.active.keys?'on':''}" data-toggle-sec-track="${i}" data-track="keys">Keys</button><button type="button" class="sec-tag ${sec.active.drums?'on':''}" data-toggle-sec-track="${i}" data-track="drums">Drums</button><button type="button" class="sec-tag ${sec.active.chords?'on':''}" data-toggle-sec-track="${i}" data-track="chords">Chords</button><button type="button" class="sec-tag ${sec.active.vocals?'on':''}" data-toggle-sec-track="${i}" data-track="vocals">Vocals</button></div></div>`).join('')}
      </div>
    </div>`:'<p class="page-lead arrange-empty">One bar. Song sections open after two parts are in the project.</p>'}
  </div>`;
}
const projectPalette = [
  ['#e23b4a', '#2a1014', '#ffd0d6'],
  ['#e07a3a', '#2a160e', '#ffd7c2'],
  ['#e2b33a', '#2a220e', '#ffe7ad'],
  ['#3aaa6a', '#0e2418', '#c8f5da'],
  ['#7d9a45', '#1c2410', '#e4f0c4'],
  ['#c4a574', '#2a2416', '#f6ead4'],
  ['#7a5ae2', '#18122a', '#e0d6ff'],
  ['#d24a8a', '#2a101c', '#ffd0e6']
];
function projectColorIndex(seed){
  const text = String(seed || 'bmai');
  let hash = 2166136261;
  for(let i = 0; i < text.length; i++){
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash) % projectPalette.length;
}
function projectColorMap(projects){
  const map = new Map();
  const taken = new Set();
  const ordered = [...projects].sort((a, b) => String(a.id).localeCompare(String(b.id)));
  for(const project of ordered){
    let index = projectColorIndex(project.id || project.name);
    if(taken.has(index)){
      for(let step = 1; step < projectPalette.length; step++){
        const next = (index + step) % projectPalette.length;
        if(!taken.has(next)){ index = next; break; }
      }
    }
    taken.add(index);
    map.set(project.id, index);
  }
  return map;
}
function projectSwatch(seed){
  const map = projectColorMap(loadProjects());
  const index = map.has(seed) ? map.get(seed) : projectColorIndex(seed);
  const [mark, wash, ink] = projectPalette[index];
  return { mark, wash, ink, style: `--card:${mark};--card-wash:${wash};--card-ink:${ink}` };
}
function paintProjectColor(){
  const swatch = projectSwatch(state.id || state.name);
  for(const el of document.querySelectorAll('#inspector, #inspector-dock')){
    el.style.setProperty('--card', swatch.mark);
    el.style.setProperty('--card-wash', swatch.wash);
    el.style.setProperty('--card-ink', swatch.ink);
  }
}
function projectCard(project){
  const swatch = projectSwatch(project.id || project.name);
  return `<article class="project-face ${project.id===state.id?'current':''}" style="${swatch.style}">
      <div class="inspector-title"><span>${esc(sessionKits[project.kit]?.blurb||'PROJECT')}</span></div>
      <div class="preset-art">${equipmentArt(projectArtworkKind(project.id || project.name))}<span class="art-label">${esc(project.key||'A minor')}</span></div>
      <h2>${esc(project.name)}</h2>
      <p class="description">${esc(project.description||'No description yet.')}</p>
      <div class="details"><div><span>INSIDE</span><strong>${esc(contentsLine(project))}</strong></div><div><span>TEMPO</span><strong>${project.bpm||92} BPM</strong></div></div>
      <button class="add-project" data-open-project="${project.id}" type="button">${project.id===state.id&&state.committed?'This project':'Open project'}</button>
    </article>`;
}
function savedProjects(){
  const projects=loadProjects();
  if(!projects.length) return `<div class="project-empty">${equipmentArt('cassette')}<p class="page-lead">No projects saved yet. Create one above.</p></div>`;
  return `<div class="ideas-head"><span>SAVED PROJECTS</span></div><div class="project-list">${projects.map(projectCard).join('')}</div>`;
}
function stageHome(){
  const projects=loadProjects();
  const current=state.committed?projects.find(project=>project.id===state.id):null;
  const inside=projectParts(current||projectSnapshot());
  return `<div class="page-stack">
    ${pageHeader({ kicker:'STUDIO', title:'Projects', meta:`${projects.length} saved`, guide:'home' })}
    ${miniGuide('home')}
    ${current?`<section class="project-hub" style="${projectSwatch(current.id).style}">
      <div class="inspector-title"><span>THIS PROJECT</span></div>
      <h2>${esc(current.name)}</h2>
      <p class="description">${esc(current.description||'No description yet.')}</p>
      <div class="details">${inside.length?inside.map(part=>`<div><span>${esc(part.label.toUpperCase())}</span><strong>${esc(part.value)}</strong></div>`).join(''):'<div><span>INSIDE</span><strong>Nothing added yet</strong></div>'}</div>
      <div class="genre-grid project-jumps">
        <button class="choice-card ${state.melodyAdded?'chosen':''}" data-view="melody" type="button">${equipmentArt('melody')}<span class="category-copy"><strong>Melody</strong><small>${state.melodyAdded?esc(melodyIdeas[state.idea].name):'Empty'}</small></span></button>
        <button class="choice-card ${state.drumsAdded?'chosen':''}" data-view="drums" type="button">${equipmentArt('drums')}<span class="category-copy"><strong>Drums</strong><small>${state.drumsAdded?esc(sessionKits[state.kit].blurb):'Empty'}</small></span></button>
        <button class="choice-card ${state.chordAdded?'chosen':''}" data-view="chords" type="button">${equipmentArt('chords')}<span class="category-copy"><strong>Chords</strong><small>${state.chordAdded?esc(state.chords.name):'Empty'}</small></span></button>
        <button class="choice-card ${state.vocalAdded?'chosen':''}" data-view="vocals" type="button">${equipmentArt('vocals')}<span class="category-copy"><strong>Vocals</strong><small>${state.vocalAdded?esc(state.vocals.title):'Empty'}</small></span></button>
      </div>
    </section>`:''}
    <details class="new-project-disclosure" ${projects.length?'':'open'}>
      <summary>${icon('add')} New project</summary>
      <form class="take-box" id="create-project-form">
        <div class="form-grid">
          <label>Name<input id="new-project-name" value="Untitled idea"></label>
          <label>Starting kit<select id="new-project-kit">${Object.entries(kitNames).map(([id,name])=>`<option value="${id}" ${id===createKit?'selected':''}>${name}</option>`).join('')}</select></label>
          <label class="wide">Description <span class="optional-label">Optional</span><textarea id="new-project-description" rows="2" placeholder="Late-night R&amp;B sketch with a soft lead and a 909 pocket."></textarea></label>
        </div>
        <div class="take-actions"><button class="page-btn hot action-primary" id="create-project" type="button">Create project</button></div>
      </form>
    </details>
    ${savedProjects()}
  </div>`;
}
function stageMelody(){
  const patches = [['rhodes','Rhodes'],['piano','Piano'],['guitar','Guitar'],['strings','Strings'],['bass','Bass'],['brass','Brass'],['organ','Organ'],['flute','Flute'],['pad','Pad'],['analog','Analog'],['pluck','Pluck']];
  const swing = Math.max(0, Math.min(60, Number(state.swing) || 0));
  const swingT = swing / 60;
  return `<div class="page-stack">
    ${backToProject()}
    ${pageHeader({ kicker:'ARRANGE', title:'Melody', meta:`${state.bpm} BPM`, guide:'melody' })}
    ${miniGuide('melody')}
    <div class="generator">
      <div class="prompt"><input id="prompt" value="${esc(state.prompt)}" aria-label="Describe melody" /><button id="generate">Generate</button></div>
      <div class="chips">${['R&B','Dark','Smooth','Simple'].map(chip=>`<button class="chip ${state.chips.includes(chip)?'selected':''}" data-chip="${chip}">${chip}</button>`).join('')}<button class="chip settings-chip" data-open="settings">Options</button></div>
    </div>
    <div class="phrase-desk">
      <div class="phrase-sound">
        <span>SOUND</span>
        <div class="patch-bank">${patches.map(([id,name])=>`<button type="button" data-inst="${id}" class="${(state.instrument||'rhodes')===id?'on':''}">${name}</button>`).join('')}</div>
      </div>
      <div class="phrase-swing">
        <span>SWING</span>
        <div class="pot compact" style="--t:${swingT.toFixed(4)}" data-tip="Drag up or down. Double-click for straight.">
          <span class="pot-track" aria-hidden="true"></span>
          <span class="pot-arc" aria-hidden="true"></span>
          <span class="pot-cap" aria-hidden="true"><i></i></span>
          <input type="range" min="0" max="60" value="${swing}" data-swing="1" data-home="0" class="pot-range" aria-label="Swing" />
        </div>
        <b>${swing}%</b>
        <div class="fx-scale-labels"><span>Straight</span><span>Shuffle</span></div>
      </div>
    </div>
    <div class="ideas-head"><span>PHRASES</span></div>
    <div class="ideas">${melodyIdeas.map((idea,i)=>{const ready=!!state.melodyDrafts?.[i]?.length;return clickCard(ready&&i===state.idea?'chosen':'', `data-idea="${i}" data-tip="Preview ${esc(idea.name)}"`, `<div class="idea-number">0${i+1}</div><div class="idea-text"><strong>${idea.name}</strong><span>${state.melodyAdded&&i===state.idea?'In project':idea.tag}</span></div>`);}).join('')}</div>
    ${actionBar('Phrase', `${btn('Regenerate', { id:'regenerate', tip:'New phrase for this idea' })}${btn('Use in project', { id:'use-melody', hot:true })}`)}
    ${arrangement()}
  </div>`;
}
let doctorDetailsOpen = false;
const drumHistory = [];

function markDrumsInProject(){
  if(!state.drumsAdded && lanes.some(lane => state.drums[lane]?.size)) state.drumsAdded = true;
}

function pushDrumHistory(){
  drumHistory.push({
    drums: Object.fromEntries(lanes.map(l => [l, Array.from(state.drums[l] || [])])),
    drumRolls: JSON.parse(JSON.stringify(state.drumRolls || {})),
    sidechain: state.sidechain,
    bassTuned: state.bassTuned,
    drumsAdded: !!state.drumsAdded,
    swing: state.swing,
    drumMix: JSON.parse(JSON.stringify(state.drumMix || {})),
    drumTrim: JSON.parse(JSON.stringify(state.drumTrim || {})),
    samples: Object.fromEntries(lanes.map(lane => [lane, {
      custom: customBuffers[lane],
      name: state.customSamples?.[lane] || '',
      asset: state.customSampleAssets?.[lane] || '',
      url: starterKit[lane]
    }]))
  });
  if(drumHistory.length > 25) drumHistory.shift();
}

function undoBeatFix(){
  if(!drumHistory.length){
    notify('No previous beat state to undo');
    return;
  }
  const prev = drumHistory.pop();
  for(const lane of lanes){
    state.drums[lane] = new Set(prev.drums[lane] || []);
  }
  state.drumRolls = prev.drumRolls || {};
  if(prev.sidechain !== undefined) state.sidechain = prev.sidechain;
  if(prev.bassTuned !== undefined) state.bassTuned = prev.bassTuned;
  if(prev.drumsAdded !== undefined) state.drumsAdded = prev.drumsAdded;
  if(prev.swing !== undefined) state.swing = prev.swing;
  if(prev.drumMix) state.drumMix = JSON.parse(JSON.stringify(prev.drumMix));
  if(prev.drumTrim) state.drumTrim = JSON.parse(JSON.stringify(prev.drumTrim));
  if(prev.samples){
    state.customSamples = state.customSamples || {};
    for(const lane of lanes){
      const snap = prev.samples[lane];
      if(!snap) continue;
      customBuffers[lane] = snap.custom || null;
      state.customSamples[lane] = snap.name || '';
      state.customSampleAssets ||= {};
      state.customSampleAssets[lane] = snap.asset || '';
      if(snap.url) starterKit[lane] = snap.url;
    }
  }
  syncToneTransport();
  saveProject();
  renderApp();
  notify('↺ Reverted beat to previous state');
}

function ensureDrumLanes(){
  state.drums = state.drums || {};
  state.drumRolls = state.drumRolls || {};
  for(const lane of lanes){
    if(!(state.drums[lane] instanceof Set)) state.drums[lane] = new Set(state.drums[lane] || []);
  }
}

function backbeatGroups(kit){
  return kit === 'trap' ? [[4, 12], [8]] : [[4, 12]];
}

function voiceOn(snare, clap, step){
  return snare.has(step) || clap.has(step);
}

function bestBackbeatGroup(snare, clap, kit){
  let best = backbeatGroups(kit)[0];
  let bestScore = -1;
  for(const group of backbeatGroups(kit)){
    const score = group.filter(step => voiceOn(snare, clap, step)).length;
    if(score > bestScore){
      best = group;
      bestScore = score;
    }
  }
  return best;
}

function backbeatLocked(snare, clap, kit){
  return backbeatGroups(kit).some(group => group.every(step => voiceOn(snare, clap, step)));
}

function activeBackbeatSteps(snare, clap, kit){
  return backbeatGroups(kit).find(group => group.every(step => voiceOn(snare, clap, step)))
    || bestBackbeatGroup(snare, clap, kit);
}

function hatTargets(kit){
  if(kit === 'house' || kit === 'trap') return [2, 6, 10, 14];
  return [2, 6, 10, 14, 0, 4, 8, 12];
}

function plannedHatAdds(hat, openhat, kit){
  const have = new Set([...hat, ...openhat]);
  const adds = [];
  for(const step of hatTargets(kit)){
    if(have.size >= 4) break;
    if(have.has(step)) continue;
    adds.push(step);
    have.add(step);
  }
  return adds;
}

function deadBeatsOf(drums){
  const dead = [];
  for(let beat = 0; beat < 4; beat++){
    const start = beat * 4;
    let hits = false;
    for(let step = start; step < start + 4; step++){
      if(lanes.some(lane => drums[lane]?.has(step))){
        hits = true;
        break;
      }
    }
    if(!hits) dead.push(beat);
  }
  return dead;
}

function adjacentKickRemoves(kick){
  const remove = new Set();
  const steps = [...kick].sort((a, b) => a - b);
  for(let i = 0; i < steps.length - 1; i++){
    if(steps[i + 1] - steps[i] === 1) remove.add(steps[i + 1]);
  }
  if(kick.has(15) && kick.has(0)) remove.add(15);
  return [...remove];
}

function subRollMarks(rolls){
  const marks = [];
  const labels = [];
  for(const lane of ['kick', 'bass']){
    for(const [step, rate] of Object.entries(rolls?.[lane] || {})){
      if(rate > 1){
        marks.push({lane, step: Number(step)});
        labels.push(`${lane.toUpperCase()} step ${Number(step) + 1} (${rate}x)`);
      }
    }
  }
  return {marks, labels};
}

function gradeBeat(score){
  if(score < 55) return {grade: 'Cluttered / Rough', badgeClass: 'bad'};
  if(score < 78) return {grade: 'Needs Polish', badgeClass: 'warn'};
  if(score < 90) return {grade: 'Solid Pocket', badgeClass: 'good'};
  return {grade: 'Commercial Ready', badgeClass: 'good'};
}

const LANE_EAR = {
  kick: { lowMin: 0.45, maxDur: 1.8 },
  bass: { lowMin: 0.5, maxDur: 3 },
  snare: { highMax: 0.9, maxDur: 1.5 },
  clap: { lowMax: 0.97, maxDur: 1.2 },
  hat: { highMin: 0.25, lowMax: 0.62, maxDur: 0.55 },
  openhat: { highMin: 0.18, lowMax: 0.7, maxDur: 1.5 }
};
const LANE_TRIM = { kick: 0.35, snare: 0.28, clap: 0.28, hat: 0.12, openhat: 0.45, bass: 0.55 };
let audioReport = null;
let listenSerial = 0;

function laneVol(lane){
  return state.drumMix?.[lane]?.vol ?? 1;
}

function setLaneVol(lane, vol){
  state.drumMix = state.drumMix || {};
  const prev = state.drumMix[lane] || { vol: 1, pan: 0 };
  state.drumMix[lane] = {...prev, vol: Math.round(Math.max(0.25, Math.min(1.35, vol)) * 100) / 100};
}

function restoreKitSample(lane){
  customBuffers[lane] = null;
  state.customSamples = state.customSamples || {};
  state.customSamples[lane] = '';
  if(state.customSampleAssets) delete state.customSampleAssets[lane];
  const kit = sessionKits[state.kit];
  if(kit?.[lane]) starterKit[lane] = kit[lane];
  if(state.drumTrim?.[lane]) delete state.drumTrim[lane];
}

function profileSample(buffer){
  const data = buffer.getChannelData(0);
  const sr = buffer.sampleRate || 44100;
  const limit = Math.min(data.length, Math.floor(sr * 2.5));
  if(!limit) return {peak: 0, rms: 0, clip: 0, low: 0, high: 0, duration: 0};
  const lowC = Math.exp(-2 * Math.PI * 160 / sr);
  const highC = Math.exp(-2 * Math.PI * 4500 / sr);
  let lp = 0, hp = 0, peak = 0, sumSq = 0, clips = 0, lowE = 0, highE = 0, lastLoud = 0;
  for(let i = 0; i < limit; i++){
    const x = data[i];
    const ax = Math.abs(x);
    if(ax > peak) peak = ax;
    sumSq += x * x;
    if(ax > 0.985) clips++;
    lp += (1 - lowC) * (x - lp);
    hp += (1 - highC) * (x - hp);
    lowE += lp * lp;
    highE += (x - hp) * (x - hp);
    if(ax > 0.02) lastLoud = i;
  }
  const band = lowE + highE + 1e-12;
  return {
    peak,
    rms: Math.sqrt(sumSq / limit),
    clip: clips / limit,
    low: lowE / band,
    high: highE / band,
    duration: (lastLoud + 1) / sr
  };
}

function sampleStamp(lane){
  const buf = customBuffers[lane];
  if(!buf) return starterKit[lane] || '';
  const data = buf.getChannelData(0);
  const n = data.length;
  let hash = n;
  const jump = Math.max(1, Math.floor(n / 32));
  for(let i = 0; i < n; i += jump) hash = (hash * 33 + Math.round(data[i] * 1000)) | 0;
  return `custom:${hash}:${buf.duration}`;
}

function beatListenKey(){
  return JSON.stringify({
    kit: state.kit,
    bpm: state.bpm,
    swing: state.swing,
    bassTuned: state.bassTuned !== false,
    trim: state.drumTrim || {},
    vols: lanes.map(laneVol),
    drums: lanes.map(lane => [...(state.drums[lane] || [])].sort((a, b) => a - b)),
    rolls: state.drumRolls || {},
    samples: lanes.map(sampleStamp)
  });
}

function laneBuffer(lane){
  return customBuffers[lane] || bufferCache.get(starterKit[lane]) || null;
}

async function ensureLaneBuffers(){
  await Promise.all(lanes.map(async lane => {
    if(customBuffers[lane] || !starterKit[lane]) return;
    await getAudioBuffer(starterKit[lane]);
  }));
}

function sampleReasonText(lane, reason){
  const name = lane.toUpperCase();
  if(reason === 'missing') return `${name} is programmed, but the sample never loaded.`;
  if(reason === 'silent') return `${name} sample is silent.`;
  if(reason === 'voice') return `${name} sample does not sound like that drum.`;
  if(reason === 'tail') return `${name} sample rings over the next hit.`;
  return `${name} sample is clipped.`;
}

function buildSampleIssue(){
  const bad = [];
  const reasons = {};
  const trims = {};
  const marks = [];
  for(const lane of lanes){
    if(!state.drums[lane]?.size) continue;
    const custom = !!customBuffers[lane];
    const buf = laneBuffer(lane);
    const step = [...state.drums[lane]].sort((a, b) => a - b)[0];
    if(!buf){
      bad.push(lane);
      reasons[lane] = 'missing';
      marks.push({lane, step});
      continue;
    }
    const profile = profileSample(buf);
    if(profile.peak < 0.02 || profile.rms < 0.004){
      bad.push(lane);
      reasons[lane] = 'silent';
      marks.push({lane, step});
      continue;
    }
    if(!custom) continue;
    const rule = LANE_EAR[lane];
    const wrongVoice = (rule.lowMin && profile.low < rule.lowMin)
      || (rule.lowMax && profile.low > rule.lowMax)
      || (rule.highMin && profile.high < rule.highMin)
      || (rule.highMax && profile.high > rule.highMax);
    if(wrongVoice){
      bad.push(lane);
      reasons[lane] = 'voice';
      marks.push({lane, step});
    } else if(profile.duration > rule.maxDur && !(Number(state.drumTrim?.[lane]) > 0 && Number(state.drumTrim[lane]) <= rule.maxDur)){
      bad.push(lane);
      reasons[lane] = 'tail';
      trims[lane] = LANE_TRIM[lane];
      marks.push({lane, step});
    } else if(profile.clip > 0.05){
      bad.push(lane);
      reasons[lane] = 'clip';
      marks.push({lane, step});
    }
  }
  if(!bad.length) return null;
  return {
    id: 'bad_sample',
    severity: 'warning',
    title: `Sample problem (${bad.map(lane => lane.toUpperCase()).join(', ')})`,
    desc: bad.map(lane => sampleReasonText(lane, reasons[lane])).join(' '),
    fixLabel: 'Repair samples',
    marks,
    cost: 16,
    lanes: bad,
    reasons,
    trims
  };
}

function buildSwingIssue(){
  const target = GENRE_SWING[state.kit] ?? 12;
  const value = Number(state.swing) || 0;
  const odd = new Set();
  for(const lane of lanes){
    for(const step of state.drums[lane] || []){
      if(step % 2 === 1) odd.add(step);
    }
  }
  const drunk = value >= target + 10;
  const stiff = !drunk && value <= target - 8;
  const unheard = !drunk && !stiff && target >= 10 && odd.size === 0;
  if(!drunk && !stiff && !unheard) return null;
  const ghostSteps = [3, 11].filter(step => !lanes.some(lane => state.drums[lane]?.has(step)));
  const laneOn = step => lanes.find(lane => state.drums[lane]?.has(step)) || 'hat';
  const marks = (unheard ? ghostSteps : [...odd].slice(0, 4)).map(step => ({lane: laneOn(step), step}));
  if(unheard && !marks.length) return null;
  let title = `Groove is straight (${value}%)`;
  let desc = `The off-beats sit early. This kit wants them late, at ${target}% swing.`;
  if(drunk){
    title = `Swing is late (${value}%)`;
    desc = `The late hits collide with the next step. This kit locks in at ${target}% swing.`;
  } else if(unheard){
    title = 'Swing is not in the recording';
    desc = `Nothing lands on a swung step, so this bar stays straight. ${target}% swing needs a couple of off-beat hats.`;
  }
  return {
    id: 'swing_feel',
    severity: drunk ? 'warning' : 'info',
    title,
    desc,
    fixLabel: unheard ? 'Add swing' : `Set ${target}%`,
    marks,
    cost: 12,
    target,
    unheard
  };
}

function buildBalanceIssues(ear){
  if(!ear || ear.silent) return [];
  const issues = [];
  const hatVol = laneVol('hat');
  const openVol = laneVol('openhat');
  const hasHats = (state.drums.hat?.size || 0) + (state.drums.openhat?.size || 0) > 0;
  const hasBack = (state.drums.snare?.size || 0) + (state.drums.clap?.size || 0) > 0;
  const hasLow = (state.drums.kick?.size || 0) + (state.drums.bass?.size || 0) > 0;
  if(hasHats && ear.highShare > 0.58 && (hatVol > 0.78 || openVol > 0.78)){
    const steps = [...(state.drums.hat || []), ...(state.drums.openhat || [])].sort((a, b) => a - b).slice(0, 4);
    issues.push({
      id: 'harsh_hats',
      severity: 'info',
      title: 'Hats are harsh',
      desc: 'The top end of this bar is louder than the rest of the kit.',
      fixLabel: 'Tame hats',
      marks: steps.map(step => ({lane: state.drums.hat?.has(step) ? 'hat' : 'openhat', step})),
      cost: 10
    });
  }
  if(hasBack && ear.kickRms > 0.02 && ear.backRms > 0 && ear.backRms < ear.kickRms * 0.38 && laneVol('snare') < 1.15){
    const steps = activeBackbeatSteps(state.drums.snare, state.drums.clap, state.kit);
    issues.push({
      id: 'buried_snare',
      severity: 'warning',
      title: 'Snare is buried',
      desc: 'In the recording the backbeat is quieter than the kick, so the pocket loses its crack.',
      fixLabel: 'Lift snare',
      marks: steps.map(step => ({lane: 'snare', step})),
      cost: 12
    });
  }
  if(hasLow && ear.lowShare > 0.84 && (laneVol('bass') > 0.75 || laneVol('kick') > 1)){
    issues.push({
      id: 'boomy_low',
      severity: 'warning',
      title: 'Low end takes over',
      desc: 'The kick and sub are louder than the rest of the bar, so the groove sounds muffled.',
      fixLabel: 'Pull sub back',
      marks: [...(state.drums.bass || [])].slice(0, 3).map(step => ({lane: 'bass', step})),
      cost: 14
    });
  }
  if(ear.clipRatio > 0.012 && Math.max(...lanes.map(laneVol)) > 0.82){
    issues.push({
      id: 'clipped_bar',
      severity: 'critical',
      title: 'The bar is clipping',
      desc: 'The drum recording hits the ceiling and distorts.',
      fixLabel: 'Lower the hot lanes',
      marks: [],
      cost: 12
    });
  }
  return issues;
}

function measureRenderedBar(buffer){
  const data = buffer.getChannelData(0);
  const sr = buffer.sampleRate;
  const stepDur = 60 / (Number(state.bpm) || 92) / 4;
  const lowC = Math.exp(-2 * Math.PI * 140 / sr);
  const highC = Math.exp(-2 * Math.PI * 5000 / sr);
  let lp = 0, hp = 0, sumE = 0, sumL = 0, sumH = 0, clips = 0, counted = 0;
  const stepRms = [];
  for(let s = 0; s < 16; s++){
    const a = Math.min(data.length, Math.floor(s * stepDur * sr));
    const b = Math.min(data.length, Math.floor((s + 1) * stepDur * sr));
    let energy = 0, count = 0;
    for(let i = a; i < b; i++){
      const x = data[i];
      lp += (1 - lowC) * (x - lp);
      hp += (1 - highC) * (x - hp);
      const high = x - hp;
      energy += x * x;
      sumE += x * x;
      sumL += lp * lp;
      sumH += high * high;
      if(Math.abs(x) > 0.98) clips++;
      count++;
      counted++;
    }
    stepRms.push(Math.sqrt(energy / Math.max(1, count)));
  }
  const band = sumL + sumH + 1e-12;
  const mean = steps => steps.length ? steps.reduce((sum, step) => sum + (stepRms[step] || 0), 0) / steps.length : 0;
  const backSteps = [4, 12].filter(step => state.drums.snare?.has(step) || state.drums.clap?.has(step));
  return {
    silent: sumE < 1e-6,
    lowShare: sumL / band,
    highShare: sumH / band,
    clipRatio: clips / Math.max(1, counted),
    backRms: mean(backSteps),
    kickRms: mean([...(state.drums.kick || [])]),
    stepRms
  };
}

async function renderDrumBar(){
  if(typeof OfflineAudioContext !== 'function') return null;
  const bpm = Number(state.bpm) || 92;
  const stepDur = 60 / bpm / 4;
  const rate = 22050;
  const ctx = new OfflineAudioContext(1, Math.ceil((stepDur * 16 + 0.05) * rate), rate);
  let scheduled = 0;
  for(let s = 0; s < 16; s++){
    const stepTime = stepOffsetSeconds(s, bpm, state.swing);
    for(const lane of lanes){
      if(!state.drums[lane]?.has(s)) continue;
      const buf = laneBuffer(lane);
      if(!buf) continue;
      const roll = state.drumRolls?.[lane]?.[s] || 1;
      let playbackRate = 1;
      if(lane === 'bass' && state.bassTuned !== false){
        const chord = state.chords?.bars?.[Math.floor(s / 4) % (state.chords.bars?.length || 1)];
        playbackRate = getChordRoot(chord) / 65.41;
      }
      for(let k = 0; k < roll; k++){
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.playbackRate.value = playbackRate;
        const gain = ctx.createGain();
        gain.gain.value = laneVol(lane) * drumVelocity(lane, s) * (state.mix?.drums?.vol ?? 0.75) * rollGainMultiplier(roll,k);
        src.connect(gain).connect(ctx.destination);
        const when = stepTime + (stepDur / roll) * k;
        src.start(Math.max(0, when));
        const trim = Number(state.drumTrim?.[lane]) || 0;
        if(trim > 0){
          try{ src.stop(when + trim); }catch{}
        }
        scheduled++;
      }
    }
  }
  if(!scheduled) return null;
  return ctx.startRendering();
}

async function hearBeat(){
  const issues = [];
  try{
    await ensureLaneBuffers();
  }catch{}
  const sampleIssue = buildSampleIssue();
  if(sampleIssue) issues.push(sampleIssue);
  const swingIssue = buildSwingIssue();
  if(swingIssue) issues.push(swingIssue);
  try{
    const rendered = await renderDrumBar();
    if(rendered) issues.push(...buildBalanceIssues(measureRenderedBar(rendered)));
  }catch(err){
    console.error(err);
  }
  return {issues};
}

function mergeBeatAnalysis(grid, heard){
  const listening = !heard || heard.pending;
  const sound = listening ? [] : (heard.issues || []);
  const issues = [...grid.issues, ...sound];
  const cost = issues.reduce((sum, issue) => sum + (issue.cost || 0), 0);
  const score = issues.length ? Math.max(15, Math.min(100, 100 - cost)) : 100;
  const graded = gradeBeat(score);
  const positives = [...(grid.positives || [])];
  if(!listening && !sound.length) positives.unshift('Recording, swing, and samples line up');
  return {score, grade: graded.grade, badgeClass: graded.badgeClass, issues, positives: positives.slice(0, 4), listening};
}

function beatAnalysisNow(){
  const grid = analyzeBeat(state);
  const key = beatListenKey();
  const heard = audioReport && audioReport.key === key ? audioReport : {pending: true, issues: []};
  return mergeBeatAnalysis(grid, heard);
}

function scheduleBeatListen(){
  if(state.view !== 'drums' || quickFixBeat.busy) return;
  const key = beatListenKey();
  if(audioReport && audioReport.key === key) return;
  const serial = ++listenSerial;
  audioReport = {key, pending: true, issues: []};
  hearBeat().then(heard => {
    if(serial !== listenSerial || beatListenKey() !== key) return;
    audioReport = {key, pending: false, issues: heard.issues};
    if(state.view === 'drums') renderApp();
  }).catch(err => {
    console.error(err);
    if(serial !== listenSerial) return;
    audioReport = {key, pending: false, issues: []};
    if(state.view === 'drums') renderApp();
  });
}

function applySoundFixes(issues, fixNames){
  const byId = new Map(issues.map(issue => [issue.id, issue]));
  const swing = byId.get('swing_feel');
  if(swing){
    const target = swing.target ?? (GENRE_SWING[state.kit] ?? 12);
    if(Number(state.swing) !== target){
      state.swing = target;
      syncToneTransport();
      fixNames.push(`Set swing to ${target}%`);
    }
    if(swing.unheard){
      let added = 0;
      for(const step of [3, 11]){
        if(lanes.some(lane => state.drums[lane]?.has(step))) continue;
        state.drums.hat.add(step);
        added++;
      }
      if(added) fixNames.push('Put swing on the off-beats');
    }
  }
  const sampleIssue = byId.get('bad_sample');
  if(sampleIssue?.lanes?.length){
    let restored = 0;
    let trimmed = 0;
    for(const lane of sampleIssue.lanes){
      const reason = sampleIssue.reasons?.[lane];
      if(reason === 'tail'){
        state.drumTrim = state.drumTrim || {};
        state.drumTrim[lane] = sampleIssue.trims?.[lane] || LANE_TRIM[lane];
        trimmed++;
      } else {
        restoreKitSample(lane);
        if(laneVol(lane) < 0.2) setLaneVol(lane, 1);
        restored++;
      }
    }
    if(restored) fixNames.push('Replaced the samples that do not fit');
    if(trimmed) fixNames.push('Shortened the samples that were ringing');
  }
  if(byId.has('harsh_hats')){
    if(laneVol('hat') > 0.72) setLaneVol('hat', 0.72);
    if(laneVol('openhat') > 0.68) setLaneVol('openhat', 0.68);
    fixNames.push('Tamed the hats');
  }
  if(byId.has('buried_snare')){
    setLaneVol('snare', Math.max(laneVol('snare'), 1.2));
    setLaneVol('clap', Math.max(laneVol('clap'), 1.1));
    if(laneVol('kick') > 1) setLaneVol('kick', 1);
    fixNames.push('Lifted the snare');
  }
  if(byId.has('boomy_low')){
    if(laneVol('bass') > 0.68) setLaneVol('bass', 0.68);
    if(laneVol('kick') > 0.92) setLaneVol('kick', 0.92);
    fixNames.push('Pulled the low end back');
  }
  if(byId.has('clipped_bar')){
    for(const lane of lanes){
      if(laneVol(lane) > 0.8) setLaneVol(lane, 0.8);
    }
    fixNames.push('Lowered the clipping lanes');
  }
}

function analyzeBeat(state){
  const issues = [];
  const positives = [];
  let deductions = 0;

  const asSet = value => value instanceof Set ? value : new Set(value || []);
  const kick = asSet(state.drums?.kick);
  const snare = asSet(state.drums?.snare);
  const clap = asSet(state.drums?.clap);
  const hat = asSet(state.drums?.hat);
  const openhat = asSet(state.drums?.openhat);
  const bass = asSet(state.drums?.bass);
  const rolls = state.drumRolls || {};

  const totalHits = kick.size + snare.size + clap.size + hat.size + openhat.size + bass.size;
  const kit = state.kit;
  const pushIssue = (issue, cost) => {
    issues.push({...issue, cost});
    deductions += cost;
  };

  if(totalHits < 4){
    pushIssue({
      id: 'empty_pattern',
      severity: 'critical',
      title: 'Empty / Sparse Beat',
      desc: 'This bar does not have enough hits to carry a groove.',
      fixLabel: 'Populate Pocket',
      marks: []
    }, 60);
  }

  const hasDownbeat = kick.has(0) || bass.has(0);
  if(kit === 'house' && totalHits >= 4){
    const missing = [0, 4, 8, 12].filter(step => !kick.has(step));
    if(missing.length){
      pushIssue({
        id: 'four_floor',
        severity: missing.includes(0) ? 'warning' : 'info',
        title: `Four-on-the-floor gap (step ${missing.map(step => step + 1).join(', ')})`,
        desc: 'House needs a kick on every beat. The open beats are the part that drops out.',
        fixLabel: 'Fill the floor',
        marks: missing.map(step => ({lane: 'kick', step}))
      }, 16);
    } else {
      positives.push('Four-on-the-floor kick');
    }
  } else if(!hasDownbeat && totalHits >= 4){
    pushIssue({
      id: 'missing_downbeat',
      severity: 'warning',
      title: 'Missing Beat 1 Anchor',
      desc: 'No kick or sub-bass on beat 1, so the bar never lands.',
      fixLabel: 'Anchor Beat 1',
      marks: [{lane: 'kick', step: 0}]
    }, 18);
  } else if(hasDownbeat){
    positives.push('Beat 1 Downbeat Anchored');
  }

  if(totalHits >= 4 && !backbeatLocked(snare, clap, kit)){
    const group = bestBackbeatGroup(snare, clap, kit);
    const missing = group.filter(step => !voiceOn(snare, clap, step));
    const halftime = kit === 'trap' && group.length === 1;
    pushIssue({
      id: 'weak_backbeat',
      severity: 'warning',
      title: halftime ? 'Missing halftime snare' : 'Missing backbeat',
      desc: halftime
        ? 'The snare never lands on beat 3, so the halftime pocket has no crack.'
        : 'Snare or clap is missing on beat 2 or beat 4, so that part of the bar has no backbeat.',
      fixLabel: 'Lock Backbeat',
      marks: missing.map(step => ({lane: 'snare', step}))
    }, 20);
  } else if(totalHits >= 4){
    positives.push('Punchy Backbeat Pocket');
  }

  if(totalHits >= 4 && kit !== 'house'){
    const clashes = activeBackbeatSteps(snare, clap, kit).filter(step => kick.has(step) && voiceOn(snare, clap, step));
    if(clashes.length){
      pushIssue({
        id: 'snare_masking',
        severity: 'warning',
        title: `Kick masking snare (step ${clashes.map(step => step + 1).join(', ')})`,
        desc: 'The kick lands on the snare, so the backbeat loses its crack.',
        fixLabel: 'De-conflict Snare',
        marks: clashes.map(step => ({lane: 'kick', step}))
      }, 14);
    }
  }

  const dead = totalHits >= 4 ? deadBeatsOf({kick, snare, clap, hat, openhat, bass}) : [];
  if(dead.length && dead.length < 4){
    pushIssue({
      id: 'dead_beat',
      severity: 'warning',
      title: `Empty ${dead.map(beat => `beat ${beat + 1}`).join(' & ')}`,
      desc: 'That part of the bar has no drums, so the groove drops out there.',
      fixLabel: 'Fill the gap',
      marks: dead.map(beat => ({lane: 'hat', step: beat * 4 + 2}))
    }, 14);
  }

  const hatSteps = new Set([...hat, ...openhat]);
  const hatAdds = totalHits >= 4 ? plannedHatAdds(hat, openhat, kit) : [];
  if(hatAdds.length && hatSteps.size < 4){
    pushIssue({
      id: 'thin_hats',
      severity: 'info',
      title: 'Hi-hats drop out',
      desc: 'There are not enough hats to keep the bar moving. Highlighted steps are the gaps.',
      fixLabel: 'Add hats',
      marks: hatAdds.map(step => ({lane: 'hat', step}))
    }, 10);
  }

  const subCollisions = [...kick].filter(step => bass.has(step));
  const muddyKicks = adjacentKickRemoves(kick);
  const collisionMud = subCollisions.length > 0 && state.sidechain === false;
  if(collisionMud || muddyKicks.length){
    const desc = collisionMud && muddyKicks.length
      ? 'Kick and 808 hit together without sidechain, and some kicks are stacked on neighboring steps.'
      : collisionMud
        ? `Kick and 808 hit together on step ${subCollisions.map(step => step + 1).join(', ')} without sidechain.`
        : 'Neighboring kicks have no space between them, so the low end smears.';
    pushIssue({
      id: 'low_end_mud',
      severity: 'critical',
      title: 'Low-end mud',
      desc,
      fixLabel: 'Clean Low-End',
      marks: [
        ...muddyKicks.map(step => ({lane: 'kick', step})),
        ...(collisionMud ? subCollisions.map(step => ({lane: 'bass', step})) : [])
      ]
    }, 22);
  } else if(kick.size > 0 && bass.size > 0){
    positives.push('Separated Kick & Bass Space');
  }

  const hatClashes = [...openhat].filter(step => hat.has(step));
  if(hatClashes.length){
    pushIssue({
      id: 'hat_clash',
      severity: 'info',
      title: `Open and closed hat overlap (step ${hatClashes.map(step => step + 1).join(', ')})`,
      desc: 'Open hat and closed hat fire together. The closed hat should choke so the open hat can speak.',
      fixLabel: 'Choke Hats',
      marks: hatClashes.map(step => ({lane: 'hat', step}))
    }, 12);
  } else if(hat.size > 0 || openhat.size > 0){
    positives.push('Clean Hi-Hat Air');
  }

  const rolled = subRollMarks(rolls);
  if(rolled.marks.length){
    pushIssue({
      id: 'sub_ratchet',
      severity: 'warning',
      title: 'Sub rolls are fluttering',
      desc: `Rolls on the low end (${rolled.labels.join(', ')}) rumble and distort.`,
      fixLabel: 'Smooth Sub Rolls',
      marks: rolled.marks
    }, 16);
  }

  if(bass.size > 0 && state.bassTuned === false){
    const first = [...bass].sort((a, b) => a - b)[0];
    pushIssue({
      id: 'untuned_808',
      severity: 'info',
      title: '808 is not following the chords',
      desc: 'The sub stays on one pitch instead of the chord root.',
      fixLabel: 'Auto-Tune 808',
      marks: [{lane: 'bass', step: first}]
    }, 10);
  } else if(bass.size > 0){
    positives.push('808 Harmonically Tuned to Chords');
  }

  const score = issues.length === 0 ? 100 : Math.max(15, Math.min(100, 100 - deductions));
  const {grade, badgeClass} = gradeBeat(score);
  return {score, grade, badgeClass, issues, positives: positives.slice(0, 4)};
}

function applyBeatFixes(issues, fixNames){
  const ids = new Set(issues.map(issue => issue.id));
  ensureDrumLanes();

  if(ids.has('empty_pattern')){
    const defaults = sessionKits[state.kit]?.steps || sessionKits.rnb.steps;
    for(const lane of lanes) state.drums[lane] = new Set(defaults[lane] || []);
    fixNames.push('Restored the kit pocket');
    return;
  }

  if(ids.has('four_floor')){
    for(const step of [0, 4, 8, 12]) state.drums.kick.add(step);
    fixNames.push('Filled four-on-the-floor');
  }

  if(ids.has('missing_downbeat')){
    state.drums.kick.add(0);
    fixNames.push('Anchored beat 1');
  }

  if(ids.has('weak_backbeat')){
    const group = bestBackbeatGroup(state.drums.snare, state.drums.clap, state.kit);
    for(const step of group){
      if(!state.drums.snare.has(step) && !state.drums.clap.has(step)) state.drums.snare.add(step);
    }
    fixNames.push('Locked the backbeat');
  }

  if(ids.has('dead_beat')){
    const gaps = deadBeatsOf(state.drums);
    if(gaps.length && gaps.length < 4){
      for(const beat of gaps){
        const step = beat * 4 + 2;
        if(!state.drums.hat.has(step) && !state.drums.openhat.has(step)) state.drums.hat.add(step);
      }
      fixNames.push('Filled the empty part of the bar');
    }
  }

  if(ids.has('thin_hats')){
    const before = new Set([...state.drums.hat, ...state.drums.openhat]).size;
    for(const step of plannedHatAdds(state.drums.hat, state.drums.openhat, state.kit)) state.drums.hat.add(step);
    if(new Set([...state.drums.hat, ...state.drums.openhat]).size > before) fixNames.push('Added the missing hats');
  }

  if(ids.has('snare_masking')){
    let changed = false;
    for(const step of activeBackbeatSteps(state.drums.snare, state.drums.clap, state.kit)){
      if((state.drums.snare.has(step) || state.drums.clap.has(step)) && state.drums.kick.has(step)){
        state.drums.kick.delete(step);
        changed = true;
      }
    }
    if(changed) fixNames.push('Moved the kick off the snare');
  }

  if(ids.has('low_end_mud')){
    const before = state.drums.kick.size;
    for(const step of adjacentKickRemoves(state.drums.kick)) state.drums.kick.delete(step);
    if(state.drums.kick.size !== before) fixNames.push('Separated the stacked kicks');
    const stacked = [...state.drums.kick].some(step => state.drums.bass.has(step));
    if(stacked && state.sidechain === false){
      state.sidechain = true;
      updateDrumBusRouting();
      fixNames.push('Ducked the sub under the kick');
    }
  }

  if(ids.has('hat_clash')){
    for(const step of [...state.drums.openhat]) state.drums.hat.delete(step);
    fixNames.push('Choked the closed hats');
  }

  if(ids.has('sub_ratchet')){
    state.drumRolls.kick = {};
    state.drumRolls.bass = {};
    fixNames.push('Cleared the sub rolls');
  }

  if(ids.has('untuned_808')){
    state.bassTuned = true;
    fixNames.push('Tuned the 808 to the chords');
  }
}

async function quickFixBeat(issueId = null){
  if(quickFixBeat.busy) return;
  quickFixBeat.busy = true;
  const serial = ++listenSerial;
  try{
    ensureDrumLanes();
    await ensureLaneBuffers();
    let heard = await hearBeat();
    const before = mergeBeatAnalysis(analyzeBeat(state), heard);
    const selected = issueId ? before.issues.filter(issue => issue.id === issueId) : before.issues;
    if(!selected.length){
      audioReport = {key: beatListenKey(), pending: false, issues: heard.issues};
      renderApp();
      notify('Beat is already locked');
      return;
    }

    pushDrumHistory();
    const fixNames = [];
    if(issueId){
      applyBeatFixes(selected, fixNames);
      applySoundFixes(selected, fixNames);
    } else {
      let pending = analyzeBeat(state).issues;
      for(let pass = 0; pass < 3 && pending.length; pass++){
        const count = fixNames.length;
        applyBeatFixes(pending, fixNames);
        pending = analyzeBeat(state).issues;
        if(fixNames.length === count) break;
      }
      await ensureLaneBuffers();
      heard = await hearBeat();
      applySoundFixes(heard.issues, fixNames);
    }

    markDrumsInProject();
    saveProject();
    await ensureLaneBuffers();
    const afterHeard = await hearBeat();
    if(serial !== listenSerial) return;
    audioReport = {key: beatListenKey(), pending: false, issues: afterHeard.issues};
    renderApp();
    hit('kick', 0.9);
    setTimeout(() => hit('snare', 0.8), 180);

    const after = mergeBeatAnalysis(analyzeBeat(state), afterHeard);
    const summary = [...new Set(fixNames)].slice(0, 3).join(', ') || 'Beat optimized';
    const left = after.issues[0]?.title;
    notify(left
      ? `Beat ${before.score}% → ${after.score}%. ${summary}. Still open: ${left}. Undo with Ctrl+Z`
      : `Beat ${before.score}% → ${after.score}%. ${summary}. Undo with Ctrl+Z`);
  }catch(err){
    console.error(err);
    notify('Could not hear the beat. Try again.');
  }finally{
    quickFixBeat.busy = false;
  }
}

function beatMarkSet(analysis){
  const marks = new Map();
  for(const issue of analysis?.issues || []){
    for(const mark of issue.marks || []){
      const key = `${mark.lane}:${mark.step}`;
      const prev = marks.get(key);
      marks.set(key, prev ? `${prev}. ${issue.title}` : issue.title);
    }
  }
  return marks;
}

function renderBeatDoctor(analysis){
  const issues = analysis.issues;
  return `<div class="beat-doctor-card" id="beat-doctor-panel">
    <div class="doctor-header">
      <div class="doctor-score-box">
        <div class="doctor-score-badge ${analysis.badgeClass}">
          <span class="score-num">${analysis.score}%</span>
          <span class="score-label">${analysis.grade}</span>
        </div>
        <div class="doctor-title-box">
          <div class="doctor-kicker">
            <span class="doctor-pulse ${analysis.badgeClass}"></span>
            BEAT CHECK
          </div>
            <p class="doctor-summary">
            ${analysis.listening ? 'Listening' : issues.length === 0 ? 'Pocket locked' : `${issues.length} to fix`}
          </p>
        </div>
      </div>
      <div class="doctor-actions">
        ${drumHistory.length ? `<button type="button" class="doctor-btn undo-fix-btn" id="undo-beat-fix" data-tip="Undo last beat repair">↺ Undo</button>` : ''}
        <button type="button" class="doctor-btn quick-fix-btn ${issues.length === 0 ? 'perfect' : 'hot'}" id="quick-fix-beat" data-tip="Instantly resolve rhythmic clashes, low-end mud, and missing anchors">
          Fix beat
        </button>
        <button type="button" class="doctor-btn inspect-btn" id="toggle-doctor-details">
          ${doctorDetailsOpen ? 'Hide Diagnostics' : 'Inspect Issues'}
        </button>
      </div>
    </div>

    <div class="doctor-issue-tags">
      ${issues.length ? issues.map(iss => `<span class="issue-pill ${iss.severity}" data-tip="${esc(iss.desc)}"><strong>${esc(iss.title)}</strong><button type="button" class="pill-fix-btn" data-fix-issue="${iss.id}">Fix</button></span>`).join('') : analysis.listening ? '<span class="positive-pill">Listening to the bar</span>' : '<span class="positive-pill">Clean low-end</span><span class="positive-pill">Locked backbeat</span><span class="positive-pill">Beat 1 anchored</span><span class="positive-pill">Samples fit the kit</span>'}
    </div>

    ${doctorDetailsOpen ? `
      <div class="doctor-drawer">
        <div class="drawer-header">
          <span>ACOUSTIC &amp; GROOVE DIAGNOSTICS</span>
          <small>Listens to the bar, then checks swing, sample choice, and the recording</small>
        </div>
        <div class="doctor-breakdown">
          ${issues.map(iss => `
            <div class="doctor-item ${iss.severity}">
              <div class="item-text">
                <div class="item-head">
                  <span class="sev-badge ${iss.severity}">${iss.severity.toUpperCase()}</span>
                  <strong>${esc(iss.title)}</strong>
                </div>
                <p>${esc(iss.desc)}</p>
              </div>
              <button type="button" class="item-fix-btn" data-fix-issue="${iss.id}">${iss.fixLabel || 'Fix'}</button>
            </div>
          `).join('')}
          ${analysis.positives.map(pos => `
            <div class="doctor-item positive">
              <div class="item-text">
                <strong>${esc(pos)}</strong>
                <p>OK</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  </div>`;
}

function stageDrums(){
  const isPunch = state.drumPunch !== false;
  const analysis = beatAnalysisNow();
  const beatMarks = beatMarkSet(analysis);
  return `<div class="page-stack">
    ${backToProject()}
    ${pageHeader({ kicker:'RHYTHM', title:'Drums', meta:esc(sessionKits[state.kit].blurb), guide:'drums' })}
    ${miniGuide('drums')}
    <div class="drum-top-bar">
      <div class="kit-row page-kits">${Object.entries(sessionKits).map(([id])=>`<button type="button" data-kit="${id}" class="${state.kit===id?'on':''}">${kitNames[id]}</button>`).join('')}</div>
      <button type="button" class="punch-btn ${isPunch?'on':''}" id="toggle-drum-punch" data-tip="Analog soft-clipper saturation on drum bus">
        <span class="punch-led"></span> PUNCH
      </button>
    </div>
    ${renderBeatDoctor(analysis)}
    <div class="drum-lanes">${lanes.map(lane=>{
      const hasCustom = !!customBuffers[lane];
      const sampleName = state.customSamples?.[lane] || 'Stock kit';
      const laneVol = Math.round((state.drumMix?.[lane]?.vol ?? 1.0) * 100);
      const lanePan = Math.round((state.drumMix?.[lane]?.pan ?? 0) * 100);
      const panText = lanePan > 0 ? `${lanePan}R` : lanePan < 0 ? `${Math.abs(lanePan)}L` : 'C';
      const panT = (lanePan + 100) / 200;
      return `<div class="drum-lane" data-lane-drop="${lane}">
        <div class="lane-info">
          <button type="button" class="lane-label-btn" data-preview-lane="${lane}" data-tip="Click to preview ${lane}">
            ${icon('play_arrow','preview-icon')}
            <strong>${lane.toUpperCase()}</strong>
          </button>
          ${lane==='bass'?`<button type="button" class="tuned-808-btn ${state.bassTuned!==false?'on':''}" id="toggle-tuned-808" data-tip="Tune 808 to the chord root"><span class="pitch-dot"></span> TUNE</button>`:''}
          <div class="lane-sample-control">
            <button type="button" class="lane-sample-btn ${hasCustom?'has-custom':''}" data-pick-lane="${lane}" data-tip="${hasCustom?`Replace ${esc(sampleName)}`:'Add sample. WAV, MP3, OGG, or FLAC.'}">
              ${icon(hasCustom?'swap_horiz':'upload','upload-icon')}
              <span class="sample-name">${hasCustom?esc(sampleName):'Add sample'}</span>
            </button>
            ${hasCustom ? `<button type="button" class="reset-sample-btn" data-reset-sample="${lane}" data-tip="Remove the imported sample">Remove</button>` : ''}
          </div>
        </div>
        <div class="lane-desk">
          <div class="lane-pan">
            <span>PAN</span>
            <div class="pot bipolar compact" style="--t:${panT.toFixed(4)}" data-tip="Drag up or down. Double-click for center.">
              <span class="pot-track" aria-hidden="true"></span>
              <span class="pot-arc" aria-hidden="true"></span>
              <span class="pot-cap" aria-hidden="true"><i></i></span>
              <input type="range" min="-100" max="100" value="${lanePan}" data-lane-pan="${lane}" data-home="0" class="pot-range" aria-label="${lane} pan" />
            </div>
            <b>${panText}</b>
          </div>
          <div class="lane-level">
            <span>LVL</span>
            <div class="lane-fader-well">
              <input type="range" min="0" max="150" value="${laneVol}" data-lane-vol="${lane}" data-home="100" class="lane-fader" aria-label="${lane} level" data-tip="Drag to set level. Double-click for unity." />
              <small>${laneVol}</small>
            </div>
          </div>
        </div>
        <div class="steps">${Array.from({length:16},(_,step)=>{
          const isOn = state.drums[lane]?.has(step);
          const roll = state.drumRolls?.[lane]?.[step] || 1;
          const flag = beatMarks.get(`${lane}:${step}`);
          const hint = isOn ? (roll > 1 ? roll + 'x Roll (Right/Shift click to change)' : 'Active (Right/Shift click for 2x/3x/4x rolls)') : 'Click to add hit';
          return `<button class="step ${isOn?'on':''} ${step%4===0?'beat':''} ${playing&&sequenceStep===step?'now':''} ${flag?'issue':''}" data-lane="${lane}" data-step="${step}" aria-label="${lane} step ${step+1}${flag ? ', ' + esc(flag) : ''}" data-tip="${flag ? esc(flag) + ' — ' : ''}${hint}">${roll > 1 ? `<span class="roll-badge">${roll}x</span>` : ''}</button>`;
        }).join('')}</div>
      </div>`;
    }).join('')}</div>
    <div class="take-actions action-bar" aria-label="Drum actions"><span class="action-bar-label">Pattern</span><button class="page-btn" id="quick-fix-beat-action" data-tip="Repair timing and balance issues">Fix</button><button class="page-btn" id="humanize-drums" data-tip="Add subtle velocity and timing variation">Humanize</button><button class="page-btn" data-open="library" data-tip="Browse installed drum kits">Kits</button><button class="page-btn" id="open-public-sources" data-tip="Browse free sample sources">Samples</button><button class="page-btn hot action-primary" id="add-drums">Use in project</button></div>
    ${arrangement()}
  </div>`;
}

function chordKeyStrip(symbol){
  const sounding = new Set(getChordNotes(symbol).map(note => note.replace(/\d/g, '')));
  const order = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const black = new Set(['C#','D#','F#','G#','A#']);
  return `<span class="chord-keys" aria-hidden="true">${order.map(pc => `<i class="${black.has(pc) ? 'black' : 'white'}${sounding.has(pc) ? ' on' : ''}"></i>`).join('')}</span>`;
}
function stageChords(){
  const options = progressions[state.key] || progressions['A minor'] || [];
  const applied = state.chordAdded;
  return `<div class="page-stack">
    ${backToProject()}
    ${pageHeader({ kicker:'HARMONY', title:'Chords', meta:`${esc(state.chords.name)} · ${applied?'In project':'Preview'}`, guide:'chords' })}
    ${miniGuide('chords')}
    <div class="ideas">${options.map(option=>clickCard(option.name===state.chords.name?'chosen':'', `data-chord="${esc(option.name)}" data-tip="Preview ${esc(option.name)}"`, `<div class="idea-number">${esc(option.bars[0])}</div><div class="idea-text"><strong>${esc(option.name)}</strong><span>${esc(option.feel)} · ${option.bars.length > 4 ? (option.bars.length / 4) + ' bars' : '1 bar'}</span></div>`)).join('')}</div>
    <div class="chord-bars">${state.chords.bars.map((bar,i)=>`<div class="chord-bar ${i===0?'current-chord':''}"><span>${i+1}</span><b>${esc(bar)}</b>${chordKeyStrip(bar)}</div>`).join('')}</div>
    ${actionBar('Progression', `${btn('Regenerate', { id:'generate-chords', tip:'Another progression in this key' })}${btn('Use in project', { id:'add-chords', hot:true })}`)}
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
  const projectId = state.id;
  const request = (useVocalSource.request || 0) + 1;
  useVocalSource.request = request;
  try{
    await audioContext.resume();
    const buffer = await getAudioBuffer(url);
    if(!buffer) throw new Error('Could not read that file. Use WAV, MP3, OGG, or FLAC.');
    let ref = url;
    if(url.startsWith('blob:')){
      const response = await fetch(url);
      ref = await storeAudioAsset(await response.blob());
      bufferCache.set(ref, buffer);
    }
    if(state.id !== projectId || useVocalSource.request !== request) return;
    vocalUrl = ref;
    vocalBuffer = buffer;
    state.vocalTakes ||= [];
    state.vocalTakes.push({ id: crypto.randomUUID(), title: title || 'Vocal take', url: ref, start: 0, end: 1, gain: 1 });
    state.vocals = {...state.vocals, url: ref, title: title || state.vocals.title, line: title || state.vocals.line};
    state.vocalAdded = false;
    saveProject();
    renderApp();
    playVocalOnce();
    notify(`${title || 'Vocal'} ready. Add it when it sounds right.`);
  }catch(error){
    notify(`Could not save vocal: ${error.message}`);
  }finally{
    if(url.startsWith('blob:')){ URL.revokeObjectURL(url); bufferCache.delete(url); }
  }
}
function vocalTakeRow(take){
  const inn = Math.round((take.start || 0) * 100);
  const out = Math.round((take.end ?? 1) * 100);
  const gain = Math.round((take.gain ?? 1) * 100);
  return `<div class="vocal-take ${take.url===vocalUrl?'chosen':''}">
    <button type="button" class="text-btn" data-select-take="${esc(take.id)}">${icon('play_arrow')} ${esc(take.title||'Vocal take')}</button>
    <div class="take-trim" style="--in:${inn};--out:${out}">
      <label><span>IN <b>${inn}</b></span><input type="range" class="mini-slider" min="0" max="100" value="${inn}" data-take-field="start" data-take-id="${esc(take.id)}" aria-label="In point"></label>
      <div class="trim-lane" aria-hidden="true"><i></i></div>
      <label><span>OUT <b>${out}</b></span><input type="range" class="mini-slider" min="1" max="100" value="${out}" data-take-field="end" data-take-id="${esc(take.id)}" aria-label="Out point"></label>
    </div>
    <div class="lane-level take-gain">
      <span>GAIN</span>
      <div class="lane-fader-well">
        <input type="range" class="lane-fader" min="0" max="150" value="${gain}" data-take-field="gain" data-take-id="${esc(take.id)}" data-home="100" aria-label="Take gain" data-tip="Drag to set level. Double-click for unity.">
        <small>${gain}</small>
      </div>
    </div>
  </div>`;
}

function stageVocals(){
  const chains=['Modern R&B','Dark rap','Lo-fi'];
  const ideas=[state.vocals,
    {title:'Low refrain',line:'I still hear that hallway echo'},
    {title:'Lift',line:'wait for the drop, then let it bloom'}
  ].filter((idea,index,list)=>list.findIndex(item=>item.title===idea.title)===index).slice(0,3);
  return `<div class="page-stack">
    ${backToProject()}
    ${pageHeader({ kicker:'RECORD', title:'Vocals', meta:esc(state.vocals.chain), guide:'vocals' })}
    ${miniGuide('vocals')}
    <div class="ideas-head"><span>HOOKS</span></div>
    <div class="factory-vocals-grid">${factoryVocals.map(v=>`<button type="button" class="vocal-card click-card ${vocalUrl===v.url?'chosen':''}" data-load-vocal="${esc(v.url)}" data-vocal-title="${esc(v.name)}" data-tip="Audition ${esc(v.name)}">${icon('mic','vocal-icon')}<div class="vocal-info"><strong>${esc(v.name)}</strong><span>${esc(v.tag)}</span></div></button>`).join('')}</div>
    <div class="ideas-head"><span>LINES</span>${btn('New hook', { id:'generate-vocals', tip:'Write another lyric line' })}</div>
    <div class="lyric-list">${ideas.map(idea=>`<button class="lyric-line click-card ${idea.title===state.vocals.title?'chosen':''}" data-lyric="${esc(idea.title)}" data-line="${esc(idea.line)}"><strong>${esc(idea.title)}</strong><span> · ${esc(idea.line)}</span></button>`).join('')}</div>
    ${state.vocalTakes?.length ? `<div class="vocal-takes"><div class="ideas-head"><span>TAKES</span><span class="hint">Trim the region, then set the level</span></div>${state.vocalTakes.map(vocalTakeRow).join('')}</div>` : ''}
    <div class="kit-row chain-row">${chains.map(chain=>`<button type="button" data-chain="${esc(chain)}" class="${state.vocals.chain===chain?'on':''}">${esc(chain)}</button>`).join('')}</div>
    ${recordingSetup()}
    <div class="take-box vocal-drop-box" id="vocal-drop-zone">
      <strong>${vocalUrl?esc(state.vocals.title||'Vocal loaded'):'Vocal'}</strong>
      <div class="waveform-box">
        <canvas id="vocal-waveform" class="waveform-canvas" width="480" height="64" data-tip="Vocal waveform"></canvas>
      </div>
      ${actionBar('Take', `<button class="page-btn" id="record-vocal" type="button" data-tip="Record from the microphone">Record</button><button class="page-btn" id="stop-vocal" type="button">Stop</button><button class="page-btn" id="play-vocal" type="button" ${vocalUrl?'':'disabled'}>Play</button><button class="page-btn" id="pick-vocal-file" type="button" data-tip="WAV, MP3, OGG, or FLAC">${icon('upload')} Import vocal</button>${vocalUrl?'<button class="page-btn" id="clear-vocal" type="button">Remove</button>':''}${btn('Use in project', { id:'add-vocal', hot:true })}`)}
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

  ctx.strokeStyle = '#313236';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, h/2);
  ctx.lineTo(w, h/2);
  ctx.stroke();

  if(!vocalBuffer){
    ctx.fillStyle = '#66686c';
    ctx.font = '10px ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('No vocal', w / 2, h / 2 + 4);
    return;
  }

  const raw = vocalBuffer.getChannelData(0);
  const step = Math.ceil(raw.length / w);
  const amp = h / 2 * 0.92;

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#b1b3b7');
  grad.addColorStop(1, '#c4c7cc');
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

  const active = (state.vocalTakes || []).find(item => item.url === vocalUrl);
  const start = active?.start ?? 0;
  const end = active?.end ?? 1;
  const x0 = Math.max(0, Math.min(w, Math.round(start * w)));
  const x1 = Math.max(x0, Math.min(w, Math.round(end * w)));
  ctx.fillStyle = 'rgba(10,10,10,.62)';
  if(x0 > 0) ctx.fillRect(0, 0, x0, h);
  if(x1 < w) ctx.fillRect(x1, 0, w - x1, h);
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(x0, 0, 1, h);
  if(x1 > x0) ctx.fillRect(x1 - 1, 0, 1, h);
}

function mixerPot(id, label, valueId, valueText, min, max, step, value, scales, bipolar){
  const t = (Number(value) - Number(min)) / (Number(max) - Number(min) || 1);
  const stepAttr = step ? ` step="${step}"` : '';
  return `<div class="fx-knob-box">
          <div class="fx-knob-label"><span>${label}</span><b id="${valueId}">${valueText}</b></div>
          <div class="pot${bipolar ? ' bipolar' : ''}" style="--t:${t.toFixed(4)}" data-tip="${bipolar ? 'Drag up or down. Double-click for flat.' : 'Drag up or down. Double-click for dry.'}">
            <span class="pot-track" aria-hidden="true"></span>
            <span class="pot-arc" aria-hidden="true"></span>
            <span class="pot-cap" aria-hidden="true"><i></i></span>
            <input type="range" min="${min}" max="${max}"${stepAttr} value="${value}" id="${id}" class="fx-slider pot-range" data-home="0" aria-label="${label}" />
          </div>
          <div class="fx-scale-labels">${scales}</div>
        </div>`;
}

function channelStrip(id, name){
  const vol = Math.round((state.mix[id]?.vol ?? 0) * 100);
  const muted = !!state.mix[id]?.mute;
  return `<div class="channel-strip${muted ? ' is-muted' : ''}">
      <strong>${name}</strong>
      <div class="fader-bed">
        <span class="fader-scale" aria-hidden="true"><em>100</em><em>50</em><em>0</em></span>
        <div class="fader-well">
          <input type="range" min="0" max="100" value="${vol}" data-vol="${id}" class="channel-fader" aria-label="${name} volume" />
          <small>${vol}%</small>
        </div>
      </div>
      <button type="button" data-mute="${id}" class="strip-mute${muted ? ' on' : ''}" aria-pressed="${muted}" aria-label="${muted ? 'Unmute' : 'Mute'} ${name}">M</button>
    </div>`;
}

function paintMixerControl(input){
  const pot = input?.closest?.('.pot');
  if(!pot) return;
  const min = Number(input.min);
  const max = Number(input.max);
  pot.style.setProperty('--t', String((Number(input.value) - min) / ((max - min) || 1)));
}

function bindMixerDesk(){
  document.querySelectorAll('.pot').forEach(pot => {
    if(pot.dataset.bound) return;
    pot.dataset.bound = '1';
    const input = pot.querySelector('input');
    if(!input) return;
    paintMixerControl(input);
    const write = (next) => {
      const min = Number(input.min);
      const max = Number(input.max);
      const step = Number(input.step) || 1;
      const clamped = Math.min(max, Math.max(min, next));
      const stepped = Math.round(clamped / step) * step;
      const fixed = step < 1 ? Number(stepped.toFixed(1)) : stepped;
      if(Number(input.value) === fixed) return;
      input.value = String(fixed);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    };
    pot.addEventListener('pointerdown', event => {
      if(event.button !== 0) return;
      event.preventDefault();
      pot.setPointerCapture(event.pointerId);
      const startY = event.clientY;
      const start = Number(input.value);
      const range = Number(input.max) - Number(input.min);
      const move = (ev) => write(start + ((startY - ev.clientY) / 130) * range);
      const up = () => {
        pot.removeEventListener('pointermove', move);
        pot.removeEventListener('pointerup', up);
        pot.removeEventListener('pointercancel', up);
      };
      pot.addEventListener('pointermove', move);
      pot.addEventListener('pointerup', up);
      pot.addEventListener('pointercancel', up);
    });
    pot.addEventListener('dblclick', () => write(Number(input.dataset.home ?? 0)));
    pot.addEventListener('wheel', event => {
      event.preventDefault();
      const step = Number(input.step) || 1;
      write(Number(input.value) + (event.deltaY < 0 ? step : -step));
    }, { passive: false });
  });
  document.querySelectorAll('.lane-fader').forEach(input => {
    if(input.dataset.bound) return;
    input.dataset.bound = '1';
    input.addEventListener('dblclick', () => {
      input.value = input.dataset.home || '100';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  });
}

function stageMix(){
  const rows=[['keys','Keys'],['drums','Drums'],['chords','Chords'],['vocals','Vocals']];
  const filterVal = Number(state.fx?.filter ?? 0);
  const filterTag = filterVal === 0 ? 'Bypass' : (filterVal < 0 ? `Lowpass ${filterVal}` : `Highpass +${filterVal}`);
  const isLimiterOn = state.masterLimiter !== false;
  const isSidechainOn = state.sidechain !== false;

  return `<div class="page-stack">
    ${pageHeader({ kicker:'OUTPUT', title:'Mix', meta:'Master', guide:'mix' })}
    ${miniGuide('mix')}

    <div class="mastering-row">
      <button type="button" class="master-btn ${isLimiterOn?'on':''}" id="toggle-master-limiter" data-tip="Brickwall limiter at -0.8 dB">
        <span class="master-led"></span>
        <div class="master-btn-text">
          <strong>LIMITER</strong>
          <small>${isLimiterOn ? 'On · -0.8 dB' : 'Bypassed'}</small>
        </div>
      </button>

      <button type="button" class="master-btn ${isSidechainOn?'on':''}" id="toggle-sidechain" data-tip="Kick Sidechain Ducking (Ducks chords & bass under kick transient)">
        <span class="master-led"></span>
        <div class="master-btn-text">
          <strong>SIDECHAIN</strong>
          <small>${isSidechainOn ? 'On · kick duck' : 'Bypassed'}</small>
        </div>
      </button>
    </div>

    <div class="fx-rack-card">
      <div class="fx-rack-header">
        <div class="fx-rack-title">
          <span class="fx-badge">EQ</span>
          <strong>3-band master</strong>
        </div>
        <button type="button" class="reset-eq-btn" id="reset-eq">Reset</button>
      </div>
      <div class="fx-controls-grid eq-grid">
        ${mixerPot('eq-low','LOW','val-eq-low',`${(state.eq?.low||0)>0?'+'+state.eq.low:state.eq?.low||0} dB`,-12,12,'0.5',state.eq?.low||0,'<span>-12</span><span>0</span><span>+12</span>',true)}
        ${mixerPot('eq-mid','MID','val-eq-mid',`${(state.eq?.mid||0)>0?'+'+state.eq.mid:state.eq?.mid||0} dB`,-12,12,'0.5',state.eq?.mid||0,'<span>-12</span><span>0</span><span>+12</span>',true)}
        ${mixerPot('eq-high','HIGH','val-eq-high',`${(state.eq?.high||0)>0?'+'+state.eq.high:state.eq?.high||0} dB`,-12,12,'0.5',state.eq?.high||0,'<span>-12</span><span>0</span><span>+12</span>',true)}
      </div>
    </div>

    <div class="fx-rack-card">
      <div class="fx-rack-header">
        <div class="fx-rack-title">
          <span class="fx-badge">FX</span>
          <strong>Space &amp; filter</strong>
        </div>
        <span class="fx-status-tag" id="fx-status-tag">${filterTag}</span>
      </div>
      <div class="fx-controls-grid">
        ${mixerPot('fx-filter','FILTER','val-fx-filter',filterVal > 0 ? '+' + filterVal : filterVal,-100,100,'',filterVal,'<span>LP</span><span>Flat</span><span>HP</span>',true)}
        ${mixerPot('fx-reverb','REVERB','val-fx-reverb',`${Math.round((state.fx?.reverb ?? 0.22) * 100)}%`,0,100,'',Math.round((state.fx?.reverb ?? 0.22) * 100),'<span>Dry</span><span></span><span>Hall</span>',false)}
        ${mixerPot('fx-delay','DELAY','val-fx-delay',`${Math.round((state.fx?.delay ?? 0.15) * 100)}%`,0,100,'',Math.round((state.fx?.delay ?? 0.15) * 100),'<span>Dry</span><span></span><span>Echo</span>',false)}
      </div>
    </div>

    <div class="ideas-head"><span>CHANNELS</span></div>
    <div class="mix-console">${rows.map(([id,name])=>channelStrip(id,name)).join('')}</div>
    ${arrangement()}
  </div>`;
}

function stageExport(){
  return `<div class="page-stack">
    ${pageHeader({ kicker:'DELIVER', title:'Export', guide:'export' })}
    ${miniGuide('export')}

    <div class="export-card featured-export">
      <h3>Audio</h3>
      <div class="export-actions">
        ${btn('Master WAV', { id:'export-wav-master', hot:true, tip:'16-bit 44.1 kHz stereo' })}
        ${btn('Stems WAV', { id:'export-wav-stems', tip:'Separate files for each part' })}
      </div>
    </div>

    <div class="export-card"><h3>MIDI</h3><div class="export-actions">${btn('MIDI', { id:'export-midi', tip:'Notes for another DAW' })}</div></div>
    <div class="export-card"><h3>Project</h3><div class="export-actions">${btn('Download project', { id:'export-json', hot:true, tip:'Backup with imported audio' })}${btn('Import project', { id:'import-json' })}</div></div>
    ${arrangement()}
  </div>`;
}

function stageSettings(){
  return `<div class="page-stack">
    ${pageHeader({ kicker:'SESSION', title:'Settings' })}
    <div class="form-grid">
      <label>Project name<input id="settings-name" value="${esc(state.name)}"></label>
      <label class="wide">Description<textarea id="settings-description" rows="2">${esc(state.description)}</textarea></label>
      <label>Tempo<input id="settings-bpm" type="number" min="40" max="240" value="${state.bpm}"></label>
      <label>Key<select id="settings-key">${allKeys.map(key=>`<option ${key===state.key?'selected':''}>${key}</option>`).join('')}</select></label>
      <label>Time signature<select id="settings-meter"><option>4 / 4</option></select></label>
    </div>
    ${actionBar('Session', `${btn('Save', { id:'save-settings', hot:true })}${btn('Import', { id:'import-json-settings' })}${btn('New idea', { id:'new-idea' })}`)}
  </div>`;
}

function inspectorCard(eyebrow,art,body){
  return `<div class="inspector-title"><span>${esc(eyebrow)}</span><button id="close-inspector" type="button" aria-label="Close panel">${icon('close')}</button></div><div class="preset-art">${equipmentArt(inspectorArtworkKind())}<span class="art-label">${esc(art)}</span></div>${body}`;
}
function inspectorArtworkKind(){
  if(['melody','drums','chords','vocals'].includes(state.view)) return state.view;
  if(state.view==='mix') return 'headphones';
  return projectArtworkKind(state.id || state.name);
}
function inspectorFor(){
  const facts = (rows) => `<div class="details">${rows.map(([k,v])=>`<div><span>${k}</span><strong>${v}</strong></div>`).join('')}</div>`;
  if(state.view==='home'){
    if(!state.committed) return inspectorCard('PROJECT','—',`<h2>No project</h2>${facts([['STATUS','Create one to start']])}`);
    return inspectorCard('PROJECT',state.key,`<h2>${esc(state.name)}</h2>${facts([['INSIDE',esc(contentsLine(projectSnapshot()))],['TEMPO',`${state.bpm} BPM`]])}`);
  }
  if(state.view==='drums') return inspectorCard('DRUMS',state.kit.toUpperCase(),`<h2>${esc(sessionKits[state.kit].blurb)}</h2>${facts([['STATUS',state.drumsAdded?'In project':'Not added']])}`);
  if(state.view==='chords') return inspectorCard('CHORDS',state.key,`<h2>${esc(state.chords.name)}</h2>${facts([['LENGTH',state.chords.bars?.length>4?(state.chords.bars.length/4)+' bars':'1 bar'],['STATUS',state.chordAdded?'In project':'Preview']])}`);
  if(state.view==='vocals') return inspectorCard('VOCAL',state.vocals.chain,`<h2>${esc(state.vocals.title)}</h2>${facts([['LINE',esc(state.vocals.line)],['STATUS',state.vocalAdded?'In project':'Not added']])}`);
  if(state.view==='mix') return inspectorCard('MIX',state.key,`<h2>${esc(state.name)}</h2>${facts([['PARTS',`${addedCount()} of 4`]])}`);
  if(state.view==='export') return inspectorCard('EXPORT',`${state.bpm}`,`<h2>${esc(state.name)}</h2>${facts([['PARTS',`${addedCount()} ready`]])}`);
  if(state.view==='settings') return inspectorCard('SETTINGS',state.key,`<h2>${esc(state.name)}</h2>${facts([['TEMPO',`${state.bpm} BPM`]])}`);
  const idea=melodyIdeas[state.idea]||melodyIdeas[0];
  return inspectorCard('MELODY',state.key,`<h2>${esc(idea.name)}</h2>${facts([['KEY',esc(state.key)],['SWING',`${state.swing}%`],['STATUS',state.melodyAdded?'In project':'Preview']])}`);
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
  el.dataset.tip=`${p.n} · beat ${Math.floor(p.x/4)+1} · ${p.w} ${p.w===1?'step':'steps'}. Drag to move, right edge to length.`;
  el.removeAttribute('title');
}
function chordRollPattern(){
  const bars=state.chords?.bars||[];
  if(!bars.length) return [];
  const span=Math.max(1,Math.floor(16/bars.length));
  const roll=[];
  bars.forEach((name,i)=>{
    const tones=chordTones[name]||getChordNotes(name);
    tones.forEach(n=>{
      if(notes.includes(n)) roll.push({n,x:Math.min(15,i*span),w:Math.min(span,16-i*span)});
    });
  });
  return roll;
}
function updatePianoChrome(){
  const box=document.querySelector('#piano-selected');
  const remove=document.querySelector('#remove-note');
  if(state.view==='chords'){
    if(box) box.textContent=chordAt(sequenceStep);
    if(remove) remove.disabled=true;
    return;
  }
  const p=state.pattern[selectedNote];
  if(box) box.textContent=p?`${p.n} · ${p.w} ${p.w===1?'step':'steps'}`:'No note';
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
  if(state.view!=='melody') return;
  if(selectedNote<0||!state.pattern[selectedNote]) return;
  const gone=state.pattern[selectedNote];
  history.push(state.pattern.map(note=>({...note})));
  future=[];
  state.pattern.splice(selectedNote,1);
  selectedNote=-1;
  rememberMelodyDraft();
  saveProject();
  renderPiano();
  notify(`Removed ${gone.n}`);
}

function renderPiano(){
  const keyboard=document.querySelector('#keyboard'); const grid=document.querySelector('#grid'); const wrap=document.querySelector('#piano-wrap');
  if(!keyboard||!grid){
    syncRackSurfaces();
    return;
  }
  const scale=scaleForKey();
  const scaleNames=new Set(scale.map(n=>n.replace(/\d+$/,'')));
  keyboard.innerHTML=notes.map(n=>{
    const name=n.replace(/\d+$/,'');
    const on=scale.includes(n)||scaleNames.has(name);
    return `<button type="button" class="key ${white(n)?'white':'black'}${on?' in-scale':''}" data-note="${n}"><span>${n}</span></button>`;
  }).join('');
  const row=16;
  const rows=notes.map((n,i)=>{
    const y=i*row;
    const fill=white(n)?'#1b1c1f':'#141417';
    return `${fill} ${y}px ${y+row-1}px,#303034 ${y+row-1}px ${y+row}px`;
  }).join(',');
  grid.style.background=`repeating-linear-gradient(90deg,transparent 0 calc(25% - 1px),#424346 0 25%),repeating-linear-gradient(90deg,transparent 0 calc(6.25% - 1px),#303034 0 6.25%),linear-gradient(${rows})`;
  grid.querySelectorAll('.note').forEach(el=>el.remove());
  const rollNotes=state.view==='chords'?chordRollPattern():state.pattern;
  const editable=state.view==='melody';
  rollNotes.forEach((p,i)=>{
    if(notes.indexOf(p.n)<0) return;
    const el=document.createElement('div');
    el.className=state.view==='chords'?'note chord-note':'note';
    el.dataset.i=i;
    if(editable&&selectedNote===i) el.classList.add('selected');
    const label=document.createElement('span');
    label.className='note-pitch';
    el.append(label);
    if(editable){
      const handle=document.createElement('span');
      handle.className='note-handle';
      handle.dataset.tip='Drag to change length';
      handle.removeAttribute('title');
      el.append(handle);
    }
    placeNoteEl(el,p);
    grid.append(el);
  });
  updatePianoChrome();
  if(wrap&&!wrap.dataset.scrolled){
    scrollPianoToNotes();
    wrap.dataset.scrolled='true';
  }
  syncRackSurfaces();
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
      const instNames={rhodes:'Rhodes',piano:'Piano',guitar:'Guitar',strings:'Strings',bass:'Bass',brass:'Brass',organ:'Organ',flute:'Flute',pad:'Pad',analog:'Analog',pluck:'Pluck'};
      notify(`${instNames[state.instrument]||'Keys'} loaded`);
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
    if(state.view!=='melody') return;
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
      selectedNote=state.pattern.length-1;
      rememberMelodyDraft();
      try{tone(noteName,.28,.12)}catch{}
      saveProject();
      renderPiano();
      notify(`Added ${noteName} at step ${current.start.step+1}`);
      return;
    }
    if(current.moved){
      history.push(state.pattern.map(note=>({...note})));
      future=[];
      rememberMelodyDraft();
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
  const roll=state.view==='chords'?chordRollPattern():state.pattern;
  if(roll?.length){
    const yPositions=roll.map(p=>notes.indexOf(p.n)).filter(y=>y>=0);
    if(yPositions.length){
      const minY=Math.min(...yPositions);
      const maxY=Math.max(...yPositions);
      const row=16;
      const rollH=notes.length*row;
      const centerPx=((minY+maxY)/2)*row;
      const target=Math.max(0,Math.min(rollH-wrap.clientHeight,centerPx-wrap.clientHeight/2));
      wrap.scrollTop=Math.round(target/row)*row;
      return;
    }
  }
  wrap.scrollTop=32;
}

let rackOpen=false;
let rackSlot='drums';
const rackIcon={melody:'music_note',drums:'album',chords:'piano',vocals:'mic'};
const rackLabel={melody:'Melody',drums:'Drums',chords:'Chords',vocals:'Vocals'};
const rackLaneMark={kick:'K',snare:'S',clap:'C',hat:'H',openhat:'O',bass:'B'};
function pagePart(){
  if(state.view==='melody') return 'melody';
  if(state.view==='drums') return 'drums';
  if(state.view==='chords') return 'chords';
  if(state.view==='vocals') return 'vocals';
  return null;
}
function partTrack(id){return id==='melody'?'keys':id}
function partInProject(id){
  if(id==='melody') return !!(state.melodyAdded&&state.pattern.length);
  if(id==='drums') return !!(state.drumsAdded&&lanes.some(lane=>state.drums[lane]?.size));
  if(id==='chords') return !!(state.chordAdded&&state.chords?.bars?.length);
  if(id==='vocals') return !!state.vocalAdded;
  return false;
}
function partLive(id){
  const track=partTrack(id);
  return isTrackActive(track)&&!state.mix[track]?.mute;
}
function rackChoices(){
  const here=pagePart();
  return ['melody','drums','chords','vocals'].filter(id=>partInProject(id)&&id!==here);
}
function partTicks(id){
  const ticks=Array(16).fill(false);
  if(id==='drums'){
    for(let step=0;step<16;step++) ticks[step]=lanes.some(lane=>state.drums[lane]?.has(step));
  }else if(id==='melody'){
    for(const note of state.pattern){
      for(let step=note.x;step<note.x+note.w&&step<16;step++) if(step>=0) ticks[step]=true;
    }
  }else if(id==='chords'||id==='vocals') ticks.fill(true);
  return ticks;
}
function tickRow(ticks){
  const stepNow=sequenceStep%16;
  return ticks.map((on,step)=>`<i class="rack-tick${on?' on':''}${step%4===0?' beat':''}${playing&&step===stepNow?' now':''}" data-step="${step}"></i>`).join('');
}
function rackSlotButton(id){
  return `<button type="button" class="rack-slot${id===rackSlot?' on':''}${partLive(id)?'':' dim'}" data-rack-slot="${id}" role="tab" aria-selected="${id===rackSlot}" aria-label="${rackLabel[id]}">${icon(rackIcon[id])}<span class="rack-spark" aria-hidden="true">${tickRow(partTicks(id))}</span></button>`;
}
function focusSlot(id){
  return `<button type="button" class="focus-slot${partLive(id)?'':' dim'}" data-rack-open="${id}" aria-label="${rackLabel[id]}">${icon(rackIcon[id])}<span class="focus-ticks" aria-hidden="true">${tickRow(partTicks(id))}</span></button>`;
}
function rackDrumBody(){
  const stepNow=sequenceStep%16;
  return `<div class="rack-lanes">${lanes.map(lane=>`<div class="rack-lane"><span class="rack-mark">${rackLaneMark[lane]}</span><div class="rack-hits">${Array.from({length:16},(_,step)=>{
    const on=!!state.drums[lane]?.has(step);
    return `<button type="button" class="rack-hit${on?' on':''}${step%4===0?' beat':''}${playing&&step===stepNow?' now':''}" data-rack-hit="${lane}" data-step="${step}" aria-label="${lane} ${step+1}"></button>`;
  }).join('')}</div></div>`).join('')}</div>`;
}
function rackMelodyRows(){
  const used=[...new Set(state.pattern.map(note=>note.n))].filter(name=>notes.includes(name));
  if(!used.length){
    const scale=scaleForKey().filter(name=>notes.includes(name));
    return (scale.length?scale:notes).slice(0,8);
  }
  const indexes=used.map(name=>notes.indexOf(name));
  let lo=Math.max(0,Math.min(...indexes)-1);
  let hi=Math.min(notes.length-1,Math.max(...indexes)+1);
  if(hi-lo>9){
    const mid=Math.round((Math.min(...indexes)+Math.max(...indexes))/2);
    lo=Math.max(0,mid-4);
    hi=Math.min(notes.length-1,lo+8);
    lo=Math.max(0,hi-8);
  }
  const rows=[];
  for(let i=lo;i<=hi;i++) rows.push(notes[i]);
  return rows;
}
function rackMelodyBody(){
  const stepNow=sequenceStep%16;
  return `<div class="rack-roll">${rackMelodyRows().map(name=>`<div class="rack-lane${white(name)?'':' sharp'}"><span class="rack-mark">${esc(name)}</span><div class="rack-hits">${Array.from({length:16},(_,step)=>{
    const cover=state.pattern.some(note=>note.n===name&&step>=note.x&&step<note.x+note.w);
    return `<button type="button" class="rack-cell${cover?' on':''}${step%4===0?' beat':''}${playing&&step===stepNow?' now':''}" data-rack-note="${esc(name)}" data-step="${step}" aria-label="${name} ${step+1}"></button>`;
  }).join('')}</div></div>`).join('')}</div>`;
}
function rackChordBody(){
  const bars=state.chords?.bars||[];
  const chordIndex=Math.floor((sequenceStep%16)/4)%Math.max(1,bars.length);
  return `<div class="rack-chords">${bars.map((bar,index)=>`<div class="rack-chord${playing&&index===chordIndex?' now':''}" data-rack-bar="${index}"><b>${esc(bar)}</b>${chordKeyStrip(bar)}</div>`).join('')}</div>`;
}
function rackVocalBody(){
  const muted=!!state.mix.vocals?.mute;
  const stepNow=sequenceStep%16;
  const title=state.vocals?.title||'Vocal';
  return `<div class="rack-vocal"><div class="rack-vocal-run" aria-hidden="true">${Array.from({length:16},(_,step)=>`<i class="${step%4===0?'beat':''}${playing&&step===stepNow?' now':''}" data-rack-cell="${step}"></i>`).join('')}</div><strong>${esc(title)}</strong><button type="button" class="rack-mute${muted?' on':''}" data-rack-mute="vocals" aria-label="${muted?'Unmute vocal':'Mute vocal'}">${icon(muted?'volume_off':'volume_up')}</button></div>`;
}
function renderRack(){
  const switcher=document.querySelector('#rack-switch');
  const body=document.querySelector('#rack-body');
  const ruler=document.querySelector('#rack-ruler');
  if(!switcher||!body) return;
  const choices=rackChoices();
  if(!choices.length) return;
  if(!choices.includes(rackSlot)) rackSlot=choices[0];
  switcher.innerHTML=choices.map(rackSlotButton).join('');
  if(ruler) ruler.hidden=!(rackSlot==='drums'||rackSlot==='melody');
  body.classList.toggle('dim',!partLive(rackSlot));
  body.innerHTML=rackSlot==='drums'?rackDrumBody():rackSlot==='melody'?rackMelodyBody():rackSlot==='chords'?rackChordBody():rackVocalBody();
}
function paintFocusRail(){
  const rail=document.querySelector('#focus-rail');
  const opener=document.querySelector('#open-rack');
  const choices=rackChoices();
  if(opener) opener.classList.toggle('has-rack',choices.length>0);
  if(!rail) return;
  const show=!!playing&&!rackOpen&&choices.length>0;
  rail.classList.toggle('is-live',show);
  rail.setAttribute('aria-hidden',show?'false':'true');
  rail.innerHTML=show?choices.map(focusSlot).join(''):'';
}
function setBeatFocus(on){
  document.querySelector('.shell')?.classList.toggle('beat-focus',!!on);
  paintFocusRail();
}
function syncRackSurfaces(){
  if(rackOpen){
    if(!rackChoices().length){
      rackOpen=false;
      const rack=document.querySelector('#rack');
      if(rack) rack.hidden=true;
      document.querySelector('#open-rack')?.setAttribute('aria-expanded','false');
    }else renderRack();
  }
  paintFocusRail();
}
function openRack(slot){
  if(!state.committed){
    notify('Create a project first');
    return;
  }
  const choices=rackChoices();
  if(!choices.length){
    notify('Nothing else is in this project yet');
    return;
  }
  rackOpen=true;
  if(slot&&choices.includes(slot)) rackSlot=slot;
  else if(!choices.includes(rackSlot)) rackSlot=choices[0];
  const rack=document.querySelector('#rack');
  if(rack) rack.hidden=false;
  document.querySelector('#open-rack')?.setAttribute('aria-expanded','true');
  renderRack();
  paintFocusRail();
  document.querySelector('#rack-close')?.focus();
}
function closeRack(){
  if(!rackOpen) return;
  rackOpen=false;
  const rack=document.querySelector('#rack');
  if(rack) rack.hidden=true;
  document.querySelector('#open-rack')?.setAttribute('aria-expanded','false');
  paintFocusRail();
}
function toggleRackDrum(lane,step){
  if(!state.drums[lane]) return;
  if(state.drums[lane].has(step)){
    state.drums[lane].delete(step);
    if(state.drumRolls?.[lane]?.[step]) delete state.drumRolls[lane][step];
  }else{
    state.drums[lane].add(step);
    try{hit(lane,.75)}catch{}
  }
  saveProject();
  renderApp();
}
function toggleRackMelody(noteName,step){
  if(!notes.includes(noteName)) return;
  const index=state.pattern.findIndex(note=>note.n===noteName&&step>=note.x&&step<note.x+note.w);
  history.push(state.pattern.map(note=>({...note})));
  future=[];
  if(index>=0) state.pattern.splice(index,1);
  else state.pattern.push({n:noteName,x:step,w:1});
  selectedNote=index>=0?-1:state.pattern.length-1;
  rememberMelodyDraft();
  saveProject();
  try{tone(noteName,.22,.1)}catch{}
  renderApp();
}
function onRackClick(event){
  if(event.target.closest('#rack-close, #rack-backdrop')){
    closeRack();
    return;
  }
  const slot=event.target.closest('[data-rack-slot]');
  if(slot){
    rackSlot=slot.dataset.rackSlot;
    renderRack();
    return;
  }
  const hitBtn=event.target.closest('[data-rack-hit]');
  if(hitBtn){
    toggleRackDrum(hitBtn.dataset.rackHit,Number(hitBtn.dataset.step));
    return;
  }
  const noteBtn=event.target.closest('[data-rack-note]');
  if(noteBtn){
    toggleRackMelody(noteBtn.dataset.rackNote,Number(noteBtn.dataset.step));
    return;
  }
  const mute=event.target.closest('[data-rack-mute]');
  if(mute&&state.mix[mute.dataset.rackMute]){
    state.mix[mute.dataset.rackMute].mute=!state.mix[mute.dataset.rackMute].mute;
    saveProject();
    renderApp();
  }
}

function renderApp(){
  const stages={home:stageHome,melody:stageMelody,drums:stageDrums,chords:stageChords,vocals:stageVocals,mix:stageMix,export:stageExport,settings:stageSettings};
  document.querySelector('#stage').innerHTML=(stages[state.view]||stageMelody)();
  const inspectorSheet=document.querySelector('#inspector-sheet');
  if(inspectorSheet) inspectorSheet.innerHTML=inspectorFor();
  const dockLabel=document.querySelector('#dock-label');
  const dockName=document.querySelector('#dock-name');
  const dockArtwork=document.querySelector('#dock-artwork');
  if(dockArtwork) dockArtwork.innerHTML=equipmentArt(inspectorArtworkKind());
  if(dockLabel) dockLabel.textContent=inspectorArtLabel();
  if(dockName) dockName.textContent=state.name;
  paintProjectColor();
  document.querySelector('#bpm').value=state.bpm;
  const keyValue=document.querySelector('#key-value');
  if(keyValue) keyValue.textContent=state.key;
  document.querySelectorAll('#key-list [data-key]').forEach(button=>button.classList.toggle('on',button.dataset.key===state.key));
  const swingEl=document.querySelector('#swing');
  if(swingEl) swingEl.value=state.swing??18;
  document.querySelector('#key').value=state.key;
  document.querySelectorAll('.tool[data-view], .nav-link, .settings').forEach(button=>{
    const locked=!state.committed && button.dataset.view && button.dataset.view!=='home';
    button.classList.toggle('locked', locked);
    if(locked) button.dataset.tip='Create a project first';
    else if(button.dataset.tip==='Create a project first' || button.dataset.tip==='Generate a loop first') delete button.dataset.tip;
  });
  document.querySelectorAll('.tool[data-view]').forEach(button=>button.classList.toggle('active',button.dataset.view===state.view));
  document.querySelectorAll('.nav-link, .settings').forEach(button=>button.classList.toggle('on',button.dataset.view===state.view));
  document.querySelector('#project-title').textContent=state.committed?state.name:'No project';
  const projectStatus=document.querySelector('#project-status');
  if(projectStatus) projectStatus.textContent = !state.committed ? 'Create one to start' : projectSaveError ? 'Not saved — download a backup' : 'Saved on this device';
  const pianoSection=document.querySelector('#piano-section');
  pianoSection.hidden=!['melody','chords'].includes(state.view);
  pianoSection.classList.toggle('is-watch',state.view==='chords');
  pianoSection.classList.toggle('is-edit',state.view==='melody');
  const instNames={rhodes:'Rhodes',analog:'Analog',pluck:'Pluck',piano:'Piano',guitar:'Guitar',strings:'Strings',bass:'Bass',brass:'Brass',organ:'Organ',flute:'Flute',pad:'Pad'};
  const chordLen = state.chords?.bars?.length > 4 ? (state.chords.bars.length / 4) + ' bars' : '1 bar';
  const pianoLabel=document.querySelector('#piano-label');
  if(pianoLabel) pianoLabel.textContent=state.view==='chords'?`Chords · ${state.chords.name} · ${chordLen}`:`Keys · ${melodyIdeas[state.idea].name} · 1 bar`;
  const pianoInst=document.querySelector('#piano-inst');
  if(pianoInst) pianoInst.value=state.instrument||'rhodes';
  document.querySelector('#status-line').innerHTML=`<span class="status-chip">Ready</span><span class="status-chip">${esc(state.key)}</span><span class="status-chip">${state.swing}% swing</span><span class="status-chip">Limiter ${state.masterLimiter!==false?'ON':'BYPASS'}</span>`;
  document.querySelectorAll('[data-kit]').forEach(button=>button.classList.toggle('on',button.dataset.kit===state.kit));
  renderPiano();
  bindPianoEditor();
  if(state.view === 'vocals'){
    drawVocalWaveform();
    paintVocalRecChrome();
  }
  applyStudioLayout();
  initVisualizer();
  scheduleBeatListen();
  bindMixerDesk();
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

async function setPlaying(on){
  playing=on;
  const playToken = ++setPlaying.token;
  clearTimeout(timer);
  clearInterval(timer);
  const playBtn=document.querySelector('#play');
  if(playBtn){
    playBtn.classList.toggle('is-playing', !!on);
    playBtn.setAttribute('aria-label', on ? 'Pause' : 'Play');
    const playIco=playBtn.querySelector('.ico');
    if(playIco) playIco.textContent=on?'pause':'play_arrow';
  }

  if(!on){
    setBeatFocus(false);
    stopToneLoop();
    sequenceStep = 0;
    updatePlayhead(0);
    document.querySelectorAll('.step.now').forEach(step=>step.classList.remove('now'));
    document.querySelectorAll('.note.playing').forEach(el=>el.classList.remove('playing'));
    if(state.songMode){
      state.songSection = 0;
      updateSectionUI();
    }
    return;
  }

  const audible=(partAudible('keys')&&state.pattern.length)||partAudible('drums')||partAudible('chords')||partAudible('vocals');
  if(!audible){
    playing=false;
    if(playBtn){
      playBtn.classList.remove('is-playing');
      playBtn.setAttribute('aria-label', 'Play');
      const playIco=playBtn.querySelector('.ico');
      if(playIco) playIco.textContent='play_arrow';
    }
    if(!state.committed){
      setBeatFocus(false);
      notify('Create a project first');
      return;
    }
    const next=state.view==='home'?nextEmptyLane():null;
    if(next){
      setBeatFocus(false);
      const labels={melody:'Add a melody',drums:'Add drums',chords:'Add chords',vocals:'Add a vocal'};
      setView(next);
      notify(labels[next]);
      return;
    }
    setBeatFocus(false);
    notify('Add a melody, drums, chords, or vocal before playing');
    return;
  }

  setBeatFocus(true);
  stopToneLoop();
  try{
    await unlockAudio();
    await projectAudioReady;
    await preloadKit(state.kit);
    if(vocalUrl && !vocalBuffer) await prepareVocalBuffer(vocalUrl);
  }catch{}
  if(!playing || playToken !== setPlaying.token) return;
  initVisualizer();
  sequenceStep = 0;
  songBarCount = 0;
  updatePlayhead(0);
  startToneLoop();
}
setPlaying.token = 0;

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
  await projectAudioReady;
  for(const lane of lanes){
    const url = starterKit[lane];
    if(url && !customBuffers[lane] && !bufferCache.has(url)){
      await getAudioBuffer(url);
    }
    if(state.drumsAdded && state.customSamples?.[lane] && !customBuffers[lane] && !bufferCache.get(url)) throw new Error(`Missing ${lane} sample. Reimport it before exporting.`);
  }
  if(state.vocalAdded && (!vocalUrl || !(vocalBuffer || await prepareVocalBuffer(vocalUrl)))) throw new Error('Missing vocal audio. Reimport it before exporting.');

  const barDuration = (60 / state.bpm) * 4;
  const barSectionMap = [];
  if(state.songMode && state.sections?.length){
    state.sections.forEach(sec => {
      for(let b = 0; b < (sec.bars || 1); b++){
      barSectionMap.push({ ...sec, sectionIndex: state.sections.indexOf(sec) });
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

  for(const lane of lanes){
    if(!customBuffers[lane] && starterKit[lane] && !bufferCache.has(starterKit[lane])){
      await getAudioBuffer(starterKit[lane]);
    }
  }
  if(state.vocalAdded && state.vocals?.url && !vocalBuffer){
    await prepareVocalBuffer(state.vocals.url);
  }

  for(let b = 0; b < totalBars; b++){
    const barStartTime = b * barDuration;
    const currentSec = state.songMode ? barSectionMap[b] : null;
    const barPattern = state.songMode && currentSec?.sectionIndex !== undefined
      ? (state.sectionPatterns?.[String(currentSec.sectionIndex)] || state.pattern)
      : state.pattern;

    const keysActive = (!stemTrack || stemTrack === 'keys') && state.melodyAdded && !state.mix.keys.mute && (!state.songMode || currentSec?.active?.keys !== false);
    const drumsActive = (!stemTrack || stemTrack === 'drums') && state.drumsAdded && !state.mix.drums.mute && (!state.songMode || currentSec?.active?.drums !== false);
    const chordsActive = (!stemTrack || stemTrack === 'chords') && state.chordAdded && !state.mix.chords.mute && (!state.songMode || currentSec?.active?.chords !== false);
    const vocalsActive = (!stemTrack || stemTrack === 'vocals') && state.vocalAdded && !state.mix.vocals.mute && (!state.songMode || currentSec?.active?.vocals !== false);

    if(keysActive){
      barPattern.forEach(note => {
        const step = note.x;
        const noteTime = barStartTime + stepOffsetSeconds(step, state.bpm, state.swing);
        const noteDur = melodyDurationSeconds(note.w, state.bpm);
        const noteVol = melodyGain(step, state.mix.keys.vol);
        renderOfflineTone(offCtx, offMasterInput, note.n, noteTime, noteDur, noteVol, state.instrument);
      });
    }

    if(chordsActive && state.chords?.bars){
      for(let beat = 0; beat < 4; beat++){
        const chordIndex = beat % state.chords.bars.length;
        const chord = state.chords.bars[chordIndex];
        const tones = chordTones[chord] || getChordNotes(chord);
        const chordTime = barStartTime + beat * (60 / state.bpm);
        tones.forEach(n => {
          renderOfflineTone(offCtx, offSidechainInput, n, chordTime, 0.78, 0.045 * state.mix.chords.vol, state.instrument === 'pluck' ? 'rhodes' : state.instrument);
        });
      }
    }

    if(vocalsActive && vocalBuffer){
      const vocalTake = (state.vocalTakes || []).find(take => take.url === vocalUrl) || { start: 0, end: 1, gain: 1 };
      const vSource = offCtx.createBufferSource();
      vSource.buffer = vocalBuffer;
      const vGain = offCtx.createGain();
      vGain.gain.value = state.mix.vocals.vol * Math.max(0, Number(vocalTake.gain) || 1);

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
      const vocalStart = Math.max(0, Math.min(1, Number(vocalTake.start) || 0));
      const vocalEnd = Math.max(vocalStart + 0.01, Math.min(1, Number(vocalTake.end) || 1));
      vSource.start(barStartTime, vocalStart * vocalBuffer.duration, (vocalEnd - vocalStart) * vocalBuffer.duration);
    }

    if(drumsActive){
      const baseStep = barDuration / 16;
      for(let s = 0; s < 16; s++){
        const stepTime = barStartTime + stepOffsetSeconds(s, state.bpm, state.swing);
        const chord = (state.chords?.bars?.length ? state.chords.bars : ['Am7'])[Math.floor(s / 4) % (state.chords?.bars?.length || 1)];

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
                const vel = drumVelocity(lane, s) * state.mix.drums.vol * rollGainMultiplier(roll, k) * (laneMix.vol ?? 1.0);
                dGain.gain.value = vel;
                if(offCtx.createStereoPanner && laneMix.pan !== 0){
                  const dPanner = offCtx.createStereoPanner();
                  dPanner.pan.value = laneMix.pan;
                  dSource.connect(dGain).connect(dPanner).connect(offDrumBusInput);
                } else {
                  dSource.connect(dGain).connect(offDrumBusInput);
                }
                dSource.start(subTime);
                const trim = Number(state.drumTrim?.[lane]) || 0;
                if(trim > 0){
                  try{ dSource.stop(subTime + trim); }catch{}
                }
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
  const stems = [];
  if(state.drumsAdded) stems.push('drums');
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
      bars.push({ barIndex: total + i, sectionName: section.name || `Section ${bars.length + 1}`, active: section.active || {}, sectionIndex: sections.indexOf(section) });
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
    const audible = track => !state.mix[track].mute && state.mix[track].vol > 0 && songBars[barIndex].active?.[track] !== false;
    const barPattern = state.songMode && songBars[barIndex].sectionIndex !== undefined
      ? (state.sectionPatterns?.[String(songBars[barIndex].sectionIndex)] || state.pattern)
      : state.pattern;
    const stepTick = step => Math.round(stepOffsetSeconds(step, state.bpm, state.swing) * state.bpm / 60 * ticks);

    if(state.melodyAdded && audible('keys')) barPattern.forEach(note => {
      const start = barStart + stepTick(note.x);
      const end = Math.min(totalTicks, start + Math.round(melodyDurationSeconds(note.w, state.bpm) * state.bpm / 60 * ticks));
      const velocity = Math.max(1, Math.round(127 * melodyGain(note.x, state.mix.keys.vol) / .14));
      events.push(
        { t: start, data: [0x90, midiNumber(note.n), Math.min(127,velocity)] },
        { t: end, data: [0x80, midiNumber(note.n), 0] }
      );
    });

    for (let s = 0; s < 16; s++) {
      const t = barStart + stepTick(s);
      const drumMap = {
        kick: { on: [0x99, 36, 100], off: [0x89, 36, 0] },
        snare: { on: [0x99, 38, 95], off: [0x89, 38, 0] },
        clap: { on: [0x99, 39, 90], off: [0x89, 39, 0] },
        hat: { on: [0x99, 42, 80], off: [0x89, 42, 0] },
        openhat: { on: [0x99, 46, 85], off: [0x89, 46, 0] },
        bass: { on: [0x92, 33, 105], off: [0x82, 33, 0] }
      };

      if(state.drumsAdded && audible('drums')) for(const lane of lanes){
        if(state.drums[lane]?.has(s)){
          if(state.drumMix?.[lane]?.vol === 0) continue;
          const roll = state.drumRolls?.[lane]?.[s] || 1;
          const info = drumMap[lane];
          if(info){
            const stepTicks = 120;
            for(let k = 0; k < roll; k++){
              const subT = t + Math.floor((stepTicks / roll) * k);
              const subOff = subT + Math.floor((stepTicks / roll) * 0.7);
              const pitch = lane === 'bass' && state.bassTuned !== false
                ? Math.round(69 + 12 * Math.log2(getChordRoot(state.chords.bars[Math.floor(s / 4) % state.chords.bars.length]) / 440))
                : info.on[1];
              const velocity = Math.min(127, Math.max(1, Math.round(127 * drumVelocity(lane,s) * state.mix.drums.vol * (state.drumMix?.[lane]?.vol ?? 1) * rollGainMultiplier(roll,k))));
              events.push({ t: subT, data: [info.on[0],pitch,velocity] }, { t: subOff, data: [info.off[0],pitch,0] });
            }
          }
        }
      }
    }

    if (state.chordAdded && audible('chords') && state.chords?.bars) {
      const chordBars = state.chords.bars;
      for(let beat = 0; beat < 4; beat++){
      const chordIndex = beat % chordBars.length;
      const chord = chordBars[chordIndex];
      const bars = chordTones[chord] || getChordNotes(chord);
      const chordStart = barStart + beat * ticks;
      const chordEnd = Math.min(totalTicks, chordStart + Math.round(.78 * state.bpm / 60 * ticks));
      bars.forEach(note => {
        events.push(
          { t: chordStart, data: [0x91, midiNumber(note), Math.min(127,Math.max(1,Math.round(100 * state.mix.chords.vol)))] },
          { t: chordEnd, data: [0x81, midiNumber(note), 0] }
        );
      });
      }
    }
  }

  events.sort((a,b)=>a.t-b.t||a.data[0]-b.data[0]);
  let last=0;const tempo=Math.round(60000000/state.bpm),body=[0,0xff,0x51,3,(tempo>>16)&255,(tempo>>8)&255,tempo&255];
  for(const event of events){body.push(...variableLength(event.t-last),...event.data);last=event.t}
  body.push(...variableLength(Math.max(0,totalTicks-last)),0xff,0x2f,0);
  const u32=n=>[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255];
  const bytes=[...new TextEncoder().encode('MThd'),0,0,0,6,0,0,0,1,(ticks>>8)&255,ticks&255,...new TextEncoder().encode('MTrk'),...u32(body.length),...body];
  const blob=new Blob([new Uint8Array(bytes)],{type:'audio/midi'}),a=document.createElement('a');
  a.href=URL.createObjectURL(blob);a.download=`${state.name.replace(/\s+/g,'-').toLowerCase()}.mid`;a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);notify(`Standard MIDI exported (${totalBars} bars) `);
}

async function exportJson(){
  if(exportJson.busy) return;
  exportJson.busy = true;
  try{
    const snapshot = projectSnapshot();
    for(const lane of lanes){
      if(snapshot.customSamples?.[lane] && !snapshot.customSampleAssets?.[lane]) throw new Error(`Reimport the missing ${lane} sample before making a complete backup.`);
    }
    notify('Preparing project and audio backup…');
    const project = await packProjectAssets(snapshot);
    downloadBlob(new Blob([JSON.stringify(project)], {type:'application/json'}), `${snapshot.name.replace(/[^a-z0-9_-]/gi,'-').toLowerCase()}.bmai.json`);
    notify('Project backup downloaded with your audio');
  }catch(error){
    notify(`Backup failed: ${error.message}`);
  }finally{
    exportJson.busy = false;
  }
}

function importJson(){
  const input=document.querySelector('#import-json-file');
  if(input) input.click();
}

async function handleJsonFile(e){
  const file=e.target.files?.[0];
  if(!file) return;
  e.target.value='';
  const currentId = state.id;
  try{
    if(file.size > 145 * 1024 * 1024) throw new Error('Project file exceeds the portable backup limit.');
    const data = validateProject(JSON.parse(await file.text()), {keys: allKeys, kits: Object.keys(sessionKits)});
    const project = await hydrateProjectAssets(data);
    if(state.id !== currentId) throw new Error('The active project changed. Import the file again.');
    // Import as a new project so an older backup never overwrites its original.
    project.id = crypto.randomUUID();
    if(playing) setPlaying(false);
    history=[]; future=[]; selectedNote=-1;
    applySnapshot(project);
    await projectAudioReady;
    saveProject();
    setView('home');
    notify(`Imported "${state.name}" as a new project`);
  }catch(error){
    notify(`Could not import project: ${error.message}`);
  }
}

function currentPack(){return catalog.packs.find(pack=>pack.id===packId)||catalog.packs[0]}
function currentGroup(){const pack=currentPack();return pack.groups.find(group=>group.id===groupId)||pack.groups[0]}
function visibleSounds(){const needle=query.trim().toLowerCase();if(!needle)return currentGroup().sounds;return currentPack().groups.flatMap(group=>group.sounds).filter(sound=>sound.name.toLowerCase().includes(needle))}
function renderLibrary(){
  const pack=currentPack();const group=currentGroup();const sounds=visibleSounds();
  document.querySelector('#library-count').textContent=`${catalog.count} CC0 sounds`;
  document.querySelector('#pack-row').innerHTML=catalog.packs.map(item=>`<button type="button" data-pack="${item.id}" class="${item.id===pack.id?'on':''}">${item.name}</button>`).join('');
  document.querySelector('#group-row').innerHTML=pack.groups.map(item=>`<button type="button" data-group="${item.id}" class="${!query&&item.id===group.id?'on':''}">${item.name}</button>`).join('');
  document.querySelector('#sound-groups').innerHTML=sounds.map(sound=>`<button type="button" class="sound-preview" data-url="${sound.url}"><span>${query?pack.name:group.name}</span><strong>${sound.name}</strong></button>`).join('')||'<p class="empty-sounds">No sounds match that search.</p>';
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
function normalizeVocalRec(rec){
  const bars = Number(rec?.bars);
  return {
    bars: bars === 0 || bars === 2 ? bars : 1,
    clicks: rec?.clicks !== false
  };
}
function vocalRecSettings(){ return normalizeVocalRec(state.vocalRec); }
function recHint(){
  const rec = vocalRecSettings();
  if(!rec.bars) return 'The microphone opens as soon as you press Record.';
  const cue = rec.clicks ? 'clicks' : 'a silent count on screen';
  const length = rec.bars === 1 ? 'One bar' : 'Two bars';
  return `${length} of ${cue} at ${state.bpm} BPM. The microphone opens on the next downbeat.`;
}
function recordingSetup(){
  const rec = vocalRecSettings();
  return disclosure('Recording', `<div class="rec-setup">
    <div class="kit-row">
      <span>Count-in</span>
      <button type="button" data-rec-bars="0" class="${rec.bars===0?'on':''}">Off</button>
      <button type="button" data-rec-bars="1" class="${rec.bars===1?'on':''}">1 bar</button>
      <button type="button" data-rec-bars="2" class="${rec.bars===2?'on':''}">2 bars</button>
    </div>
    <div class="kit-row">
      <span>Cue</span>
      <button type="button" data-rec-cue="clicks" class="${rec.clicks?'on':''}">Clicks</button>
    </div>
    <p class="rec-status" id="rec-status">${esc(recHint())}</p>
  </div>`);
}
function paintVocalRecChrome(){
  const btn = document.querySelector('#record-vocal');
  const status = document.querySelector('#rec-status');
  const box = document.querySelector('#vocal-drop-zone');
  const recording = !!(recorder && recorder.state === 'recording');
  const counting = !!(vocalArm && !recording);
  if(btn){
    btn.classList.toggle('is-recording', recording);
    btn.classList.toggle('is-counting', counting);
    if(recording) btn.textContent = 'Recording';
    else if(!counting) btn.textContent = 'Record';
  }
  if(box) box.classList.toggle('is-live', recording);
  if(status && !counting && !recording) status.textContent = recHint();
}
function setRecLive(text, mode){
  const status = document.querySelector('#rec-status');
  const btn = document.querySelector('#record-vocal');
  const box = document.querySelector('#vocal-drop-zone');
  if(status) status.textContent = text;
  if(btn){
    btn.classList.toggle('is-recording', mode === 'recording');
    btn.classList.toggle('is-counting', mode === 'counting');
    btn.textContent = mode === 'recording' ? 'Recording' : mode === 'counting' ? (vocalArm?.label || 'Count') : 'Record';
  }
  if(box) box.classList.toggle('is-live', mode === 'recording');
}
function scheduleClick(when, accent){
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(accent ? 1480 : 920, when);
  gain.gain.setValueAtTime(accent ? 0.16 : 0.08, when);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.028);
  osc.connect(gain).connect(audioContext.destination);
  osc.start(when);
  osc.stop(when + 0.04);
  return osc;
}
function releaseVocalTake(){
  if(vocalArm && (!recorder || recorder.state !== 'recording')){
    const arm = vocalArm;
    vocalArm = null;
    arm.cancelled = true;
    arm.clicks?.forEach(osc => { try { osc.stop(); } catch { /* already finished */ } });
    arm.stream?.getTracks().forEach(track => track.stop());
    paintVocalRecChrome();
    return;
  }
  if(recorder && recorder.state === 'recording') recorder.stop();
}
function beginVocalCapture(token){
  if(vocalArm !== token || token.cancelled){
    token.stream?.getTracks().forEach(track => track.stop());
    if(vocalArm === token) vocalArm = null;
    paintVocalRecChrome();
    return;
  }
  vocalChunks = [];
  recorder = new MediaRecorder(token.stream);
  recorder.ondataavailable = event => { if(event.data.size) vocalChunks.push(event.data); };
  recorder.onstop = () => {
    token.stream.getTracks().forEach(track => track.stop());
    if(vocalArm === token) vocalArm = null;
    const url = URL.createObjectURL(new Blob(vocalChunks, { type: recorder.mimeType || 'audio/webm' }));
    if(state.id !== token.projectId){ URL.revokeObjectURL(url); return; }
    useVocalSource(url, 'Recorded take');
  };
  recorder.start();
  setRecLive('Microphone is open. Press Stop when the line is done.', 'recording');
  notify('Microphone is open');
}
async function startVocal(){
  if(vocalArm || (recorder && recorder.state === 'recording')) return;
  const rec = vocalRecSettings();
  const beats = rec.bars * 4;
  const token = { cancelled: false, stream: null, label: '…', projectId: state.id };
  vocalArm = token;
  setRecLive(beats ? 'Allow the microphone. The count-in starts after that.' : 'Allow the microphone.', 'counting');
  if(playing) setPlaying(false);
  let stream;
  try{
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  }catch{
    if(vocalArm === token) vocalArm = null;
    paintVocalRecChrome();
    notify('Microphone permission is needed to record');
    return;
  }
  if(vocalArm !== token || token.cancelled){
    stream.getTracks().forEach(track => track.stop());
    return;
  }
  token.stream = stream;
  audioContext ||= new AudioContext();
  if(audioContext.state === 'suspended') await audioContext.resume();
  if(vocalArm !== token || token.cancelled){
    stream.getTracks().forEach(track => track.stop());
    return;
  }
  if(!beats){
    beginVocalCapture(token);
    return;
  }
  const beat = 60 / (Number(state.bpm) || 92);
  const startAt = audioContext.currentTime + 0.12;
  const recordAt = startAt + beats * beat;
  token.clicks = [];
  for(let i = 0; i < beats; i++){
    if(rec.clicks) token.clicks.push(scheduleClick(startAt + i * beat, i % 4 === 0));
  }
  let spoken = -1;
  const tick = () => {
    if(vocalArm !== token || token.cancelled) return;
    const now = audioContext.currentTime;
    if(now >= recordAt - 0.02){
      beginVocalCapture(token);
      return;
    }
    const beatIndex = Math.max(0, Math.min(beats - 1, Math.floor((now - startAt) / beat)));
    if(now >= startAt && beatIndex !== spoken){
      spoken = beatIndex;
      token.label = String((beatIndex % 4) + 1);
      const left = beats - beatIndex;
      setRecLive(`${token.label} · microphone opens in ${left} ${left === 1 ? 'beat' : 'beats'}`, 'counting');
    }
    requestAnimationFrame(tick);
  };
  setRecLive('Count-in', 'counting');
  requestAnimationFrame(tick);
}

function selectMelodyIdea(index){
  rememberMelodyDraft();
  const draft=state.melodyDrafts?.[index];
  if(!draft?.length){
    if(index===state.idea && state.pattern.length) return true;
    notify('Generate a melody first');
    return false;
  }
  history.push(cloneNotes(state.pattern));
  future=[];
  const changing=index!==state.idea;
  state.idea=index;
  state.pattern=cloneNotes(draft);
  if(changing) state.melodyAdded=false;
  selectedNote=-1;
  saveProject();
  renderApp();
  scrollPianoToNotes();
  setPlaying(true);
  return true;
}
function returnToSketch(message){
  saveProject();
  const keep=playing;
  setView('home');
  notify(message);
  if(!keep) setPlaying(true);
}
function commitMelody(){
  if(!state.pattern.length){
    notify('Generate or draw a melody first');
    return;
  }
  rememberMelodyDraft();
  state.melodyAdded=true;
  returnToSketch('Melody is in the project');
}
function commitDrums(){
  const hasHits=lanes.some(lane=>state.drums[lane]?.size);
  if(!hasHits){
    notify('Program a beat first');
    return;
  }
  state.drumsAdded=true;
  returnToSketch('Drums are in the project');
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
  const el = sel => target?.closest ? target.closest(sel) : target?.parentElement?.closest?.(sel);

  const dismissTour = el('[data-dismiss-tour]');
  if(dismissTour){ localStorage.setItem('bmai-tour-dismissed','1'); renderApp(); return true; }
  const dismissGuide = el('[data-dismiss-guide]');
  if(dismissGuide){ localStorage.setItem(`bmai-guide-${dismissGuide.dataset.dismissGuide}`,'1'); renderApp(); return true; }
  const openGuide = el('[data-open-guide]');
  if(openGuide){ localStorage.removeItem(`bmai-guide-${openGuide.dataset.openGuide}`); renderApp(); return true; }

  const viewBtn = el('[data-view]');
  if(viewBtn){ setView(viewBtn.dataset.view); return true; }

  const openBtn = el('[data-open]');
  if(openBtn){
    if(openBtn.dataset.open === 'library') openLibrary();
    else setView(openBtn.dataset.open);
    return true;
  }

  const startBtn = el('[data-start]');
  if(startBtn){
    applyKit(startBtn.dataset.start, true);
    state.chips = startBtn.dataset.start === 'rnb' ? ['R&B', 'Dark'] : startBtn.dataset.start === 'acoustic' ? ['Smooth'] : startBtn.dataset.start === 'trap' ? ['Dark'] : ['Simple'];
    saveProject();
    setView('drums');
    notify(`${sessionKits[state.kit].blurb} loaded`);
    return true;
  }

  const kitBtn = el('[data-kit]');
  if(kitBtn && sessionKits[kitBtn.dataset.kit]){
    applyKit(kitBtn.dataset.kit, true);
    saveProject();
    renderApp();
    notify(state.drumsAdded?`${sessionKits[state.kit].blurb} loaded.`:`${sessionKits[state.kit].blurb} loaded. Add drums when the pocket is right.`);
    return true;
  }

  const chipBtn = el('[data-chip]');
  if(chipBtn){
    const chip = chipBtn.dataset.chip;
    state.chips = state.chips.includes(chip) ? state.chips.filter(item => item !== chip) : [...state.chips, chip];
    saveProject();
    chipBtn.classList.toggle('selected');
    return true;
  }

  const addMelodyBtn = el('[data-add-melody]');
  if(addMelodyBtn){
    const index = Number(addMelodyBtn.dataset.addMelody);
    if(Number.isNaN(index) || !selectMelodyIdea(index)) return true;
    commitMelody();
    return true;
  }

  const ideaBtn = el('[data-idea]');
  if(ideaBtn){
    selectMelodyIdea(Number(ideaBtn.dataset.idea));
    return true;
  }

  const chordBtn = el('[data-chord]');
  if(chordBtn){
    const option = (progressions[state.key] || []).find(item => item.name === chordBtn.dataset.chord);
    if(option){
      state.chords = option;
      state.chordAdded = false;
      saveProject();
      renderApp();
      setPlaying(true);
    }
    return true;
  }

  const lyricBtn = el('[data-lyric]');
  if(lyricBtn){
    state.vocals = { ...state.vocals, title: lyricBtn.dataset.lyric, line: lyricBtn.dataset.line };
    saveProject();
    renderApp();
    return true;
  }

  const loadVocalBtn = el('[data-load-vocal]');
  if(loadVocalBtn){
    useVocalSource(loadVocalBtn.dataset.loadVocal, loadVocalBtn.dataset.vocalTitle);
    return true;
  }

  const pickVocalFileBtn = el('#pick-vocal-file');
  if(pickVocalFileBtn){
    document.querySelector('#vocal-file-input')?.click();
    return true;
  }

  const clearVocalBtn = el('#clear-vocal');
  if(clearVocalBtn){
    if(vocalUrl?.startsWith('blob:')) URL.revokeObjectURL(vocalUrl);
    vocalUrl = '';
    vocalBuffer = null;
    state.vocals = { ...state.vocals, url: '' };
    state.vocalAdded = false;
    saveProject();
    renderApp();
    notify('Vocal cleared');
    return true;
  }

  const libTabSoundsBtn = el('#lib-tab-sounds');
  if(libTabSoundsBtn){ setLibraryTab('sounds'); return true; }

  const libTabSourcesBtn = el('#lib-tab-sources');
  if(libTabSourcesBtn){ setLibraryTab('sources'); return true; }

  const chainBtn = el('[data-chain]');
  if(chainBtn){
    state.vocals = { ...state.vocals, chain: chainBtn.dataset.chain };
    saveProject();
    renderApp();
    return true;
  }

  const laneStepBtn = el('[data-lane]');
  if(laneStepBtn){
    const lane = laneStepBtn.dataset.lane;
    const step = Number(laneStepBtn.dataset.step);
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
    saveProject();
    renderApp();
    return true;
  }

  if(el('#quick-fix-beat') || el('#quick-fix-beat-action')){
    quickFixBeat();
    return true;
  }
  const fixIssueBtn = el('[data-fix-issue]');
  if(fixIssueBtn){
    quickFixBeat(fixIssueBtn.dataset.fixIssue);
    return true;
  }
  if(el('#undo-beat-fix')){
    undoBeatFix();
    return true;
  }
  if(el('#toggle-doctor-details')){
    doctorDetailsOpen = !doctorDetailsOpen;
    renderApp();
    return true;
  }

  const openSourcesBtn = el('#open-public-sources') || el('#lead-open-sources');
  if(openSourcesBtn){
    openLibrary('sources');
    return true;
  }

  const toggleLimiterBtn = el('#toggle-master-limiter');
  if(toggleLimiterBtn){
    state.masterLimiter = !(state.masterLimiter !== false);
    updateMasterLimiter();
    saveProject();
    renderApp();
    notify(state.masterLimiter ? 'Master Limiter & Maximizer enabled (-0.8dB Peak · +2.8dB Boost)' : 'Master Limiter bypassed (Clean headroom)');
    return true;
  }

  const toggleSidechainBtn = el('#toggle-sidechain');
  if(toggleSidechainBtn){
    state.sidechain = !(state.sidechain !== false);
    saveProject();
    renderApp();
    notify(state.sidechain ? 'Kick Sidechain Ducking enabled (Chords & Bass pump on kicks)' : 'Kick Sidechain bypassed (Flat)');
    return true;
  }

  const resetEqBtn = el('#reset-eq');
  if(resetEqBtn){
    state.eq = { low: 0, mid: 0, high: 0 };
    updateEQ();
    saveProject();
    renderApp();
    notify('Master EQ reset to Flat (0 dB)');
    return true;
  }

  const muteBtn = el('[data-mute]');
  if(muteBtn){
    state.mix[muteBtn.dataset.mute].mute = !state.mix[muteBtn.dataset.mute].mute;
    saveProject();
    renderApp();
    return true;
  }

  if(el('#regenerate')){ generateMelody(true); return true; }
  if(el('#generate')){
    const prompt = document.querySelector('#prompt');
    if(prompt) state.prompt = prompt.value;
    generateMelody(false);
    return true;
  }
  if(el('#humanize-drums')){ generateDrums(); return true; }
  if(el('#bec1c5-drums')){ commitDrums(); return true; }
  if(el('#generate-chords')){ generateChords(); return true; }
  if(el('#bec1c5-chords')){ state.chordAdded = true; returnToSketch('Chords are in the project'); return true; }
  if(el('#generate-vocals')){ generateVocals(); return true; }
  if(el('#bec1c5-vocal') || el('#use-melody')){
    if(el('#use-melody')){ commitMelody(); return true; }
    if(!vocalUrl && !vocalBuffer){ notify('Load or record a vocal first'); return true; }
    state.vocalAdded = true;
    returnToSketch('Vocals are in the project');
    return true;
  }
  if(el('#record-vocal')){ startVocal(); return true; }
  if(el('#stop-vocal')){ releaseVocalTake(); return true; }

  const recBarsBtn = el('[data-rec-bars]');
  if(recBarsBtn){
    state.vocalRec = { ...vocalRecSettings(), bars: Number(recBarsBtn.dataset.recBars) };
    saveProject();
    renderApp();
    return true;
  }
  const recCueBtn = el('[data-rec-cue]');
  if(recCueBtn){
    const next = vocalRecSettings();
    if(recCueBtn.dataset.recCue === 'clicks') next.clicks = !next.clicks;
    state.vocalRec = next;
    saveProject();
    renderApp();
    return true;
  }
  if(el('#play-vocal')){ playVocalOnce(); return true; }
  const selectTake = el('[data-select-take]');
  if(selectTake){
    const take = (state.vocalTakes || []).find(item => item.id === selectTake.dataset.selectTake);
    if(take){ vocalUrl = take.url; vocalBuffer = bufferCache.get(take.url) || null; state.vocals = {...state.vocals, url: take.url, title: take.title}; prepareVocalBuffer(take.url); saveProject(); renderApp(); playVocalOnce(); notify(`${take.title} selected`); }
    return true;
  }
  if(el('#bec1c5-project')){ commitMelody(); return true; }
  if(el('#preview')){ setPlaying(!playing); return true; }

  const instBtn = el('[data-inst]');
  if(instBtn){
    state.instrument = instBtn.dataset.inst;
    triggerSoundfontLoad(state.instrument);
    saveProject();
    renderApp();
    tone('C5', 0.45, 0.12, state.instrument);
    const instNames = { rhodes: 'Rhodes', piano: 'Piano', guitar: 'Guitar', strings: 'Strings', bass: 'Bass', brass: 'Brass', organ: 'Organ', flute: 'Flute', pad: 'Pad', analog: 'Analog', pluck: 'Pluck' };
    notify(`${instNames[state.instrument] || 'Keys'} loaded`);
    return true;
  }

  if(el('#export-midi')){ if(!projectHasMusic()){ notify('Add a part to this project before exporting'); return true; } exportMidi(); return true; }
  if(el('#export-json')){ saveProject(); exportJson(); return true; }
  if(el('#import-json') || el('#import-json-settings')){ importJson(); return true; }
  const openProjBtn = el('[data-open-project]');
  if(openProjBtn){ openProject(openProjBtn.dataset.openProject); return true; }
  if(el('#create-project')){ createProject(); return true; }
  if(el('#generate-starter')){ generateStarter(); return true; }
  if(el('#save-settings')){
    const nextKey=document.querySelector('#settings-key').value;
    state.name=document.querySelector('#settings-name').value||'Untitled idea';
    state.description=document.querySelector('#settings-description')?.value.trim()||state.description;
    state.bpm=normalizedBpm(document.querySelector('#settings-bpm').value);
    if(nextKey!==state.key){
      const from=scaleForKey(state.key);
      const to=scaleForKey(nextKey);
      state.pattern=state.pattern.map(note=>{
        let degree=from.indexOf(note.n);
        if(degree<0){
          const pitch=pitchOf(note.n);
          degree=from.reduce((best,name,index)=>Math.abs(pitchOf(name)-pitch)<Math.abs(pitchOf(from[best])-pitch)?index:best,0);
        }
        return {...note,n:to[degree]};
      });
      state.key=nextKey;
      state.chords=(progressions[nextKey]||[]).find(item=>item.name===state.chords.name)||progressions[nextKey][0];
    }
    saveProject();
    renderApp();
    notify('Project settings saved');
    return true;
  }
  if(el('#new-idea')){ startNewIdea(); return true; }
  if(el('#close-inspector')){ setInspectorOpen(false); return true; }
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
      selectSongSection(idx);
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
    if(!projectHasMusic()){ notify('Add a part to this project before exporting'); return true; }
    const btn = target.closest('#export-wav-master') || target;
    btn.disabled = true;
    btn.textContent = 'Rendering WAV...';
    notify('Rendering 16-bit Master WAV mixdown...');
    renderAudioWav().then(()=>{
      notify('Master WAV mixdown exported successfully');
    }).catch(err=>{
      console.error(err);
      notify(`WAV export failed: ${err.message}`);
    }).finally(()=>{
      btn.disabled = false;
      btn.textContent = 'Download Master (.wav)';
    });
    return true;
  }
  if(target.id==='export-wav-stems'||target.closest?.('#export-wav-stems')){
    if(!projectHasMusic()){ notify('Add a part to this project before exporting'); return true; }
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
document.querySelector('#open-rack').addEventListener('click',()=>{if(rackOpen) closeRack(); else openRack()});
document.querySelector('#rack').addEventListener('click',onRackClick);
document.querySelector('#focus-rail').addEventListener('click',event=>{
  const slot=event.target.closest('[data-rack-open]');
  if(slot) openRack(slot.dataset.rackOpen);
});
document.querySelector('#go-export').addEventListener('click',()=>setView('export'));
document.querySelector('#go-account').addEventListener('click',()=>setView('settings'));
document.querySelector('#play').addEventListener('click',()=>setPlaying(!playing));
document.querySelector('#stop').addEventListener('click',()=>setPlaying(false));
document.querySelector('#undo').addEventListener('click',()=>{
  if(projectUndo.length){ restoreProjectHistory('undo'); return; }
  if(!history.length){ notify('Nothing to undo'); return; }
  future.push(state.pattern.map(note=>({...note})));state.pattern=history.pop();rememberMelodyDraft();saveProject();renderPiano();notify('Undid note edit');
});
document.querySelector('#bpm').addEventListener('change',event=>{state.bpm=normalizedBpm(event.target.value);event.target.value=state.bpm;saveProject();if(playing)setPlaying(true)});
let swingLiveApply = 0;
document.querySelector('#swing').addEventListener('change',event=>{
  state.swing=Math.max(0,Math.min(60,Number(event.target.value)||0));
  const pot=document.querySelector('[data-swing]');
  if(pot){
    pot.value=state.swing;
    paintMixerControl(pot);
    const read=pot.closest('.phrase-swing')?.querySelector('b');
    if(read) read.textContent=`${state.swing}%`;
  }
  saveProject();
  if(playing) setPlaying(true);
  notify(`Swing set to ${state.swing}%`);
});
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
  paintMixerControl(event.target);
  if(event.target.dataset.takeField){
    const take = (state.vocalTakes || []).find(item => item.id === event.target.dataset.takeId);
    if(take){
      const field = event.target.dataset.takeField;
      const value = Number(event.target.value) / (field === 'gain' ? 100 : 100);
      if(field === 'start'){
        take.start = Math.min(value, Math.max(0, (take.end ?? 1) - .01));
        event.target.value = String(Math.round(take.start * 100));
      }
      if(field === 'end'){
        take.end = Math.max(value, Math.min(1, (take.start ?? 0) + .01));
        event.target.value = String(Math.round(take.end * 100));
      }
      if(field === 'gain'){
        take.gain = Math.max(0, Math.min(1.5, value));
        const levelRead = event.target.nextElementSibling;
        if(levelRead) levelRead.textContent = event.target.value;
      }
      const trim = event.target.closest('.take-trim');
      if(trim){
        trim.style.setProperty('--in', String(Math.round((take.start || 0) * 100)));
        trim.style.setProperty('--out', String(Math.round((take.end ?? 1) * 100)));
        const read = event.target.closest('label')?.querySelector('b');
        if(read) read.textContent = event.target.value;
      }
      saveProject();
      if(take.url === vocalUrl){
        if(field !== 'gain') drawVocalWaveform();
        playVocalOnce();
      }
    }
  }
  if(event.target.id==='prompt')state.prompt=event.target.value;
  if(event.target.dataset.swing){
    state.swing = Math.max(0, Math.min(60, Number(event.target.value) || 0));
    const swingEl = document.querySelector('#swing');
    if(swingEl) swingEl.value = state.swing;
    const read = event.target.closest('.phrase-swing')?.querySelector('b');
    if(read) read.textContent = `${state.swing}%`;
    saveProject();
    clearTimeout(swingLiveApply);
    swingLiveApply = setTimeout(() => { if(playing) setPlaying(true); }, 160);
  }
  if(event.target.dataset.vol){
    state.mix[event.target.dataset.vol].vol=Number(event.target.value)/100;
    const read = event.target.nextElementSibling;
    if(read) read.textContent = `${event.target.value}%`;
    saveProject();
  }
  if(event.target.dataset.laneVol){
    const lane = event.target.dataset.laneVol;
    state.drumMix = state.drumMix || {};
    state.drumMix[lane] = state.drumMix[lane] || { vol: 1.0, pan: 0 };
    state.drumMix[lane].vol = Number(event.target.value) / 100;
    const levelRead = event.target.nextElementSibling;
    if(levelRead) levelRead.textContent = event.target.value;
    saveProject();
  }
  if(event.target.dataset.lanePan){
    const lane = event.target.dataset.lanePan;
    state.drumMix = state.drumMix || {};
    state.drumMix[lane] = state.drumMix[lane] || { vol: 1.0, pan: 0 };
    state.drumMix[lane].pan = Number(event.target.value) / 100;
    const panRead = event.target.closest('.lane-pan')?.querySelector('b');
    if(panRead){
      const n = Number(event.target.value);
      panRead.textContent = n > 0 ? `${n}R` : n < 0 ? `${Math.abs(n)}L` : 'C';
    }
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
document.querySelectorAll('[data-roll]').forEach(button=>button.addEventListener('click',()=>{if(button.dataset.roll==='undo'&&history.length){future.push(state.pattern.map(note=>({...note})));state.pattern=history.pop();rememberMelodyDraft();renderPiano();notify('Undid note edit')}else if(button.dataset.roll==='redo'&&future.length){history.push(state.pattern.map(note=>({...note})));state.pattern=future.pop();rememberMelodyDraft();renderPiano();notify('Redid note edit')}else notify(button.dataset.roll==='snap'?'Snap set to 1/16':'Nothing to change')}));
document.querySelector('#close-library').addEventListener('click',()=>document.querySelector('#library-modal').hidden=true);
document.querySelector('#library-search').addEventListener('input',event=>{query=event.target.value;if(catalog)renderLibrary()});
document.querySelector('#library-modal').addEventListener('click',event=>{
  if(event.target.closest('#lib-tab-sources')){setLibraryTab('sources');return}
  if(event.target.closest('#lib-tab-sounds')){setLibraryTab('sounds');return}
  const pack=event.target.closest('[data-pack]');const group=event.target.closest('[data-group]');const kit=event.target.closest('[data-kit]');const sound=event.target.closest('.sound-preview');
  if(pack){packId=pack.dataset.pack;groupId=currentPack().groups[0].id;query='';document.querySelector('#library-search').value='';renderLibrary()}
  else if(group){groupId=group.dataset.group;query='';document.querySelector('#library-search').value='';renderLibrary()}
  else if(kit){applyKit(kit.dataset.kit,true);saveProject();renderApp();notify(state.drumsAdded?`${sessionKits[state.kit].blurb} loaded.`:`${sessionKits[state.kit].blurb} loaded. Add drums when the pocket is right.`)}
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
  if(event.key === 'Escape'){
    hideTooltip();
    if(rackOpen){ closeRack(); return; }
    const modal = document.querySelector('#library-modal');
    if(modal && !modal.hidden){ modal.hidden = true; return; }
    const keyList = document.querySelector('#key-list');
    if(keyList && !keyList.hidden){ setKeyMenuOpen(false); return; }
  }
  if(['INPUT','SELECT','TEXTAREA'].includes(event.target.tagName) || event.target.isContentEditable) return;
  if(rackOpen && (event.key==='ArrowRight' || event.key==='ArrowLeft')){
    const choices=rackChoices();
    if(choices.length){
      event.preventDefault();
      const index=Math.max(0, choices.indexOf(rackSlot));
      const next=event.key==='ArrowRight' ? (index+1)%choices.length : (index-1+choices.length)%choices.length;
      rackSlot=choices[next];
      renderRack();
    }
    return;
  }
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
  if(event.ctrlKey || event.metaKey){
    if(event.key.toLowerCase() === 'z'){
      if(event.shiftKey){
        if(projectRedo.length){ event.preventDefault(); restoreProjectHistory('redo'); return; }
        if(future.length){
          event.preventDefault();
          history.push(state.pattern.map(note=>({...note})));
          state.pattern = future.pop();
          rememberMelodyDraft();
          saveProject();
          renderPiano();
          notify('Redid note edit');
          return;
        }
      } else {
        if(projectUndo.length){ event.preventDefault(); restoreProjectHistory('undo'); return; }
        if(state.view === 'drums' && drumHistory.length){
          event.preventDefault();
          undoBeatFix();
          return;
        }
        if(history.length){
          event.preventDefault();
          future.push(state.pattern.map(note=>({...note})));
          state.pattern = history.pop();
          rememberMelodyDraft();
          saveProject();
          renderPiano();
          notify('Undid note edit');
          return;
        }
      }
    } else if(event.key.toLowerCase() === 'y'){
      if(future.length){
        event.preventDefault();
        history.push(state.pattern.map(note=>({...note})));
        state.pattern = future.pop();
        rememberMelodyDraft();
        saveProject();
        renderPiano();
        notify('Redid note edit');
        return;
      }
    }
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

window.addEventListener('hashchange',()=>{const view=location.hash.slice(1)||'home';if(views.includes(view)&&view!==state.view) setView(view)});
if(!state.committed && location.hash.slice(1) && location.hash.slice(1)!=='home') location.hash='home';
renderApp();
restoreProjectAudio();
if(saved?.id) saveProject();
