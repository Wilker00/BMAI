import './style.css';
import './library.css';
import './workspace.css';
import './pages.css';
import './visibility-fixes.css';
import './responsive.css';

const notes = ['C6','B5','A#5','A5','G#5','G5','F#5','F5','E5','D#5','D5','C#5','C5','B4','A#4','A4','G#4','G4','F#4','F4','E4','D#4','D4','C#4','C4','B3','A#3','A3','G#3','G3','F#3','F3','E3','D#3','D3','C#3','C3'];
const white = n => !n.includes('#');
const lanes = ['kick','snare','hat','bass'];
const views = ['home','melody','drums','chords','vocals','mix','export','settings'];
const chordTones = {
  Am:['A3','C4','E4'], Am7:['A3','C4','E4','G4'], Am9:['A3','C4','E4','G4','B4'],
  Em:['E3','G3','B3'], F:['F3','A3','C4'], Fmaj7:['F3','A3','C4','E4'], Fmaj9:['F3','A3','C4','E4','G4'],
  C:['C3','E3','G3'], Cmaj7:['C3','E3','G3','B3'], Cmaj9:['C3','E3','G3','B3','D4'], C7:['C3','E3','G3','A#3'],
  G:['G3','B3','D4'], G7:['G3','B3','D4','F4'], G13:['G3','B3','D4','F4','E4'],
  Dm:['D3','F3','A3'], Dm7:['D3','F3','A3','C4'], Dm9:['D3','F3','A3','C4','E4'],
  Gm7:['G3','A#3','D4','F4'], Bb:['A#3','D4','F4'], Bbmaj7:['A#3','D4','F4','A4']
};
const progressions = {
  'A minor':[
    {name:'Moonlit', bars:['Am7','Fmaj7','Cmaj7','G'], feel:'Warm late-night lift'},
    {name:'Velvet', bars:['Am','Em','F','G'], feel:'Sparse and open'},
    {name:'Afterglow', bars:['Am9','Dm9','G13','Cmaj7'], feel:'Soft color around the vocal'}
  ],
  'C major':[
    {name:'Daylight', bars:['Cmaj7','Am7','Fmaj7','G'], feel:'Clear pop bed'},
    {name:'Easy', bars:['C','G','Am','F'], feel:'Straight and singable'},
    {name:'Glass', bars:['Cmaj9','Am7','Dm7','G7'], feel:'Bright with a little air'}
  ],
  'D minor':[
    {name:'Low room', bars:['Dm7','Bbmaj7','Fmaj7','C'], feel:'Moody and grounded'},
    {name:'Drive', bars:['Dm','Am','Bb','C'], feel:'Forward without crowding'},
    {name:'Smoke', bars:['Dm9','Gm7','C7','Fmaj7'], feel:'Darker color for a hook'}
  ],
  'F major':[
    {name:'Soft gold', bars:['Fmaj7','Dm7','Gm7','C'], feel:'Warm R&B bed'},
    {name:'Open road', bars:['F','C','Dm','Bb'], feel:'Simple and wide'},
    {name:'Silk', bars:['Fmaj9','Dm9','Gm7','C7'], feel:'Lush support under a lead'}
  ]
};
const kitNames = {rnb:'R&B', house:'House', trap:'Trap', dnb:'Drum & bass', acoustic:'Acoustic', dj:'DJ Set'};
const sessionKits = {
  rnb:{kick:'/sounds/0x808/909/kick-2.wav',snare:'/sounds/0x808/909/snare.wav',hat:'/sounds/0x808/909/hihat-closed-1.wav',bass:'/sounds/0x808/808-synth/808-sub-kick-short.wav',blurb:'R&B · 909 pocket',steps:{kick:[0,7,10,14],snare:[4,12],hat:[0,2,4,6,8,10,12,14],bass:[0,10]}},
  house:{kick:'/sounds/stargate/fugue-state-audio/drums/kicks/synthkit-kick.wav',snare:'/sounds/stargate/fugue-state-audio/drums/snares/synthkit-snare.wav',hat:'/sounds/stargate/karoryfer/hihats/hihat_BRD_tight.wav',bass:'/sounds/stargate/fugue-state-audio/drums/kicks/sdbkit-sub-a.wav',blurb:'House · studio kit',steps:{kick:[0,4,8,12],snare:[4,12],hat:[2,6,10,14],bass:[0,6,8,14]}},
  trap:{kick:'/sounds/0x808/trap-808/kick.wav',snare:'/sounds/0x808/trap-808/snare.wav',hat:'/sounds/0x808/trap-808/hihat-closed.wav',bass:'/sounds/0x808/808-synth/808-sub-kick-long.wav',blurb:'Trap · deep 808',steps:{kick:[0,6,11,14],snare:[4,12],hat:[0,2,4,6,7,8,10,12,14,15],bass:[0,8,14]}},
  dnb:{kick:'/sounds/stargate/fugue-state-audio/drums/kicks/distkit-kick.wav',snare:'/sounds/0x808/linndrum/snare-h.wav',hat:'/sounds/stargate/karoryfer/hihats/hihat_BRD_closed.wav',bass:'/sounds/0x808/808-synth/808-sub-kick.wav',blurb:'Drum & bass · broken kit',steps:{kick:[0,7,10],snare:[4,12],hat:[0,2,4,6,8,10,12,14],bass:[0,6,10,14]}},
  acoustic:{kick:'/sounds/stargate/karoryfer/kicks/kick_Szpaderski_24_open.wav',snare:'/sounds/stargate/karoryfer/snares/snare_Pearl_alumunum_14x8.wav',hat:'/sounds/stargate/karoryfer/hihats/hihat_BRD_closed.wav',bass:'/sounds/0x808/808-synth/808-sub-kick-short.wav',blurb:'Acoustic · recorded kit',steps:{kick:[0,8,10],snare:[4,12],hat:[0,2,4,6,8,10,12,14],bass:[0,8]}},
  dj:{kick:'/sounds/0x808/808-synth/808-sub-kick-long.wav',snare:'/sounds/sonic-pi/vinyl_scratch.flac',hat:'/sounds/sonic-pi/vinyl_backspin.flac',bass:'/sounds/0x808/trap-808/perc-sub.wav',blurb:'DJ Set · Scratches & 808',steps:{kick:[0,6,10],snare:[4,12],hat:[2,6,10,14],bass:[0,8,14]}}
};
const starterKit = {kick:'',snare:'',hat:'',bass:''};
const defaultMix = () => ({keys:{mute:false,vol:.8},drums:{mute:false,vol:.75},chords:{mute:false,vol:.5},vocals:{mute:false,vol:.7}});
const defaultDrums = () => ({kick:new Set([0,6,8,11,14]),snare:new Set([4,12]),hat:new Set([0,2,4,6,8,10,12,14]),bass:new Set([0,8])});

function esc(value){return String(value??'').replace(/[&<>"']/g,c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));}
function loadProject(){try{return JSON.parse(localStorage.getItem('bmai-project'))}catch{return null}}
const saved = loadProject();

const state = {
  view: views.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'home',
  id: saved?.id || crypto.randomUUID(),
  name: saved?.name || 'Untitled idea',
  description: saved?.description || 'A one-bar loop with a melody and a drum kit.',
  bpm: saved?.bpm || 92,
  key: saved?.key || 'A minor',
  prompt: saved?.prompt || 'late-night R&B, warm and a little dark',
  chips: saved?.chips || ['R&B','Dark'],
  pattern: saved?.pattern?.length ? saved.pattern : [],
  kit: sessionKits[saved?.kit] ? saved.kit : 'rnb',
  drums: defaultDrums(),
  chords: saved?.chords || progressions['A minor'][0],
  chordAdded: !!saved?.chordAdded,
  drumsAdded: !!saved?.drumsAdded,
  vocals: saved?.vocals || {title:'Soft hook',line:'keep the night close, don’t say it loud',chain:'Modern R&B'},
  vocalAdded: !!saved?.vocalAdded,
  idea: 0,
  instrument: saved?.instrument || 'rhodes',
  swing: saved?.swing !== undefined ? Number(saved.swing) : 18,
  mix: saved?.mix || defaultMix(),
  melodyAdded: saved?.melodyAdded != null ? !!saved.melodyAdded : !!(saved?.pattern?.length),
  drumPunch: saved?.drumPunch !== false,
  customSamples: saved?.customSamples || { kick: '', snare: '', hat: '', bass: '' },
  fx: saved?.fx || { reverb: 0.22, delay: 0.15, filter: 0 },
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
if (saved?.drums) for (const lane of lanes) state.drums[lane] = new Set(saved.drums[lane] || []);

const chordRoots = {
  Am: 55.0, Am7: 55.0, Am9: 55.0,
  Em: 41.2,
  F: 43.65, Fmaj7: 43.65, Fmaj9: 43.65,
  C: 65.41, Cmaj7: 65.41, Cmaj9: 65.41, C7: 65.41,
  G: 49.0, G7: 49.0, G13: 49.0,
  Dm: 73.42, Dm7: 73.42, Dm9: 73.42,
  Gm7: 49.0,
  Bb: 58.27, Bbmaj7: 58.27
};

let history = [];
let future = [];
let playing = false;
let timer;
let sequenceStep = 0;
let metronomeOn = false;
let audioContext;
const bufferCache = new Map();
let vocalBuffer = null;
const customBuffers = { kick: null, snare: null, hat: null, bass: null };
let activePickingLane = null;
let drumBusInput = null;
let drumPunchShaper = null;
let drumBusGain = null;
let drumBypassGain = null;

let masterInputGain = null;
let masterOutputGain = null;
let masterFilterNode = null;
let masterAnalyserNode = null;
let reverbGain = null;
let delayNode = null;
let delayGain = null;
let delayFeedback = null;
let reverbConvolver = null;
let animId = null;

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

  masterInputGain.connect(masterFilterNode);
  masterInputGain.connect(delayNode);
  masterInputGain.connect(reverbConvolver);

  masterFilterNode.connect(masterOutputGain);
  masterOutputGain.connect(masterAnalyserNode);
  masterAnalyserNode.connect(audioContext.destination);

  updateFilterRouting();
  return masterInputGain;
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
    const res = await fetch(url);
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
    const res = await fetch(blobUrl);
    const arr = await res.arrayBuffer();
    vocalBuffer = await audioContext.decodeAudioData(arr);
    return vocalBuffer;
  }catch{
    return null;
  }
}

function playSampleBuffer(buf, volume = 0.75, isDrum = false, playbackRate = 1.0){
  if(!buf || !audioContext) return;
  if(audioContext.state === 'suspended') audioContext.resume();
  const source = audioContext.createBufferSource();
  source.buffer = buf;
  if(playbackRate && playbackRate !== 1.0){
    source.playbackRate.value = Math.max(0.25, Math.min(4.0, playbackRate));
  }
  const gain = audioContext.createGain();
  gain.gain.value = Math.max(0, Math.min(1, volume));
  if(isDrum){
    const bus = initDrumBus();
    if(bus){
      source.connect(gain).connect(bus);
    } else {
      source.connect(gain).connect(initMasterChain() || audioContext.destination);
    }
  } else {
    source.connect(gain).connect(initMasterChain() || audioContext.destination);
  }
  source.start();
}
let catalog = null;
let packId = 'featured';
let groupId = 'picks';
let query = '';
let previewAudio = null;
let recorder = null;
let vocalUrl = '';
let vocalChunks = [];

const soundfontCache = {};
const soundfontLoading = {};

function triggerSoundfontLoad(instId){
  const sfMap = {
    guitar: 'acoustic_guitar_nylon',
    strings: 'string_ensemble_1',
    organ: 'church_organ',
    flute: 'flute',
    piano: 'acoustic_grand_piano'
  };
  const sfName = sfMap[instId];
  if(!sfName || soundfontCache[sfName] || soundfontLoading[sfName]) return;
  soundfontLoading[sfName] = true;
  const script = document.createElement('script');
  script.src = `https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/${sfName}-mp3.js`;
  script.async = true;
  script.onload = () => {
    if(window.MIDI?.Soundfont?.[sfName]){
      soundfontCache[sfName] = window.MIDI.Soundfont[sfName];
    }
  };
  script.onerror = () => { soundfontLoading[sfName] = false; };
  document.head.appendChild(script);
}

function playSoundfontNote(ctx, dest, sfName, note, time, duration, volume){
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

function noteFrequency(note){const match=note.match(/([A-G])(#?)(\d)/);const pitch={C:0,D:2,E:4,F:5,G:7,A:9,B:11}[match[1]]+(match[2]?1:0)+(Number(match[3])+1)*12;return 440*2**((pitch-69)/12)}
function voice(ctx,dest,note,time,duration,volume,instrument='rhodes'){
  const freq=noteFrequency(note);
  if(!freq||isNaN(freq)) return;
  const midi=69+12*Math.log2(freq/440);
  const high=Math.min(1,Math.max(0,(midi-50)/30));
  const hold=Math.max(.09,duration);

  const sfMap = { guitar:'acoustic_guitar_nylon', strings:'string_ensemble_1', organ:'church_organ', flute:'flute' };
  const sfName = sfMap[instrument];
  if(sfName && ctx === audioContext && playSoundfontNote(ctx, dest, sfName, note, time, hold, volume)){
    return;
  }

  const out=ctx.createGain();
  out.gain.setValueAtTime(Math.max(volume*(1.12-high*.32),.0001),time);
  out.gain.exponentialRampToValueAtTime(.0001,time+hold+.05);
  out.connect(dest);
  const filter=ctx.createBiquadFilter();
  filter.type='lowpass';
  filter.connect(out);
  const start=(type,hz,gain,len,detune=0)=>{
    if(hz>18000||gain<=0) return;
    const osc=ctx.createOscillator();
    osc.type=type;
    osc.frequency.value=hz;
    osc.detune.value=detune;
    const g=ctx.createGain();
    g.gain.setValueAtTime(Math.max(gain,.0001),time);
    g.gain.exponentialRampToValueAtTime(.0001,time+len);
    osc.connect(g).connect(filter);
    osc.start(time);
    osc.stop(time+len+.04);
  };

  if(instrument==='guitar'){
    filter.frequency.setValueAtTime(2400+high*1800,time);
    filter.frequency.exponentialRampToValueAtTime(600+high*400,time+hold*.6);
    filter.Q.value=.9;
    start('triangle',freq,.65,hold*.9);
    start('sine',freq*2,.24,hold*.5);
    start('sawtooth',freq*3,.12,.08);
    return;
  }
  if(instrument==='strings'){
    filter.frequency.value=1200+high*1000;
    filter.Q.value=.6;
    const attack=Math.min(.18,hold*.35);
    const osc1=ctx.createOscillator(); osc1.type='sawtooth'; osc1.frequency.value=freq; osc1.detune.value=-7;
    const osc2=ctx.createOscillator(); osc2.type='sawtooth'; osc2.frequency.value=freq; osc2.detune.value=7;
    const g=ctx.createGain();
    g.gain.setValueAtTime(.001,time);
    g.gain.linearRampToValueAtTime(.42,time+attack);
    g.gain.exponentialRampToValueAtTime(.01,time+hold+.15);
    osc1.connect(g); osc2.connect(g);
    g.connect(filter);
    osc1.start(time); osc2.start(time);
    osc1.stop(time+hold+.2); osc2.stop(time+hold+.2);
    return;
  }
  if(instrument==='organ'){
    filter.frequency.value=3500+high*1000;
    filter.Q.value=.5;
    start('sine',freq*.5,.35,hold);
    start('sine',freq,.55,hold);
    start('sine',freq*1.5,.22,hold);
    start('sine',freq*2,.28,hold);
    return;
  }
  if(instrument==='flute'){
    filter.frequency.setValueAtTime(1400+freq*.8,time);
    filter.Q.value=.6;
    start('sine',freq,.72,hold);
    start('sine',freq*2,.15,hold*.7);
    start('triangle',freq*3,.06,.1);
    return;
  }

  if(instrument==='analog'){
    filter.frequency.setValueAtTime(freq*(3.2+high*2.4),time);
    filter.frequency.exponentialRampToValueAtTime(Math.max(220,freq*(.7+high)),time+hold);
    filter.Q.value=1.05;
    start('sawtooth',freq,.28,hold,-8);
    start('sawtooth',freq,.28,hold,8);
    start('sine',freq,high<.45?.4:.16,hold);
    return;
  }
  if(instrument==='pluck'){
    filter.frequency.setValueAtTime(freq*(6+high*5),time);
    filter.frequency.exponentialRampToValueAtTime(Math.max(280,freq*1.4),time+.12);
    filter.Q.value=2.2;
    start('triangle',freq,.7,.12+hold*.35);
    start('sine',freq*2,.28,.08+high*.05);
    start('sine',freq*3.2,.16,.05);
    return;
  }
  if(instrument==='piano'){
    filter.frequency.setValueAtTime(1800+high*2800,time);
    filter.frequency.exponentialRampToValueAtTime(500+high*700,time+hold);
    filter.Q.value=.7;
    start('triangle',freq,.7,hold);
    start('sine',freq*2,.28,hold*.85);
    start('sine',freq*4.1,.32,.06);
    return;
  }
  if(instrument==='bass'){
    filter.frequency.value=900+high*700;
    start('sine',freq*1.5,.9,.03);
    const osc=ctx.createOscillator();
    osc.type='sine';
    osc.frequency.setValueAtTime(freq*1.5,time);
    osc.frequency.exponentialRampToValueAtTime(freq,time+.03);
    const g=ctx.createGain();
    g.gain.setValueAtTime(.9,time);
    g.gain.exponentialRampToValueAtTime(.01,time+hold);
    osc.connect(g).connect(filter);
    osc.start(time);
    osc.stop(time+hold+.05);
    return;
  }
  if(instrument==='brass'){
    filter.frequency.setValueAtTime(700+freq*.4,time);
    filter.frequency.exponentialRampToValueAtTime(2200+high*1600,time+.07);
    filter.frequency.exponentialRampToValueAtTime(900+high*600,time+hold);
    filter.Q.value=1.8;
    start('sawtooth',freq,.34,hold,-9);
    start('sawtooth',freq,.34,hold,9);
    return;
  }
  if(instrument==='pad'){
    filter.frequency.value=900+high*1400;
    filter.Q.value=.8;
    const osc=ctx.createOscillator();
    osc.type='triangle';
    osc.frequency.value=freq;
    const g=ctx.createGain();
    const attack=Math.min(.16,hold*.4);
    g.gain.setValueAtTime(.0001,time);
    g.gain.linearRampToValueAtTime(.62,time+attack);
    g.gain.exponentialRampToValueAtTime(.01,time+hold+.1);
    osc.connect(g).connect(filter);
    osc.start(time);
    osc.stop(time+hold+.12);
    return;
  }

  filter.frequency.setValueAtTime(900+freq*(1.1+high*1.6),time);
  filter.frequency.exponentialRampToValueAtTime(280+freq*(.35+high*.5),time+hold);
  filter.Q.value=.55+high*.25;
  start('sine',freq,.72-high*.22,hold);
  start('sine',freq*2,.14+high*.16,hold*.8);
  start('sine',freq*3.98,.12+high*.28,.07+high*.05);
  start('sine',freq*5.04,high*.12,.04);
}
function tone(note,duration=.32,volume=.08,instrument=state.instrument||'rhodes'){
  audioContext||=new AudioContext();
  if(audioContext.state==='suspended') audioContext.resume();
  voice(audioContext,initMasterChain()||audioContext.destination,note,audioContext.currentTime,duration,volume,instrument);
}

function getChordRoot(chordStr){
  if(!chordStr) return 55.0;
  if(chordRoots[chordStr]) return chordRoots[chordStr];
  const m = chordStr.match(/^([A-G][b#]?)/);
  const rootNote = m ? m[1] : 'A';
  const rootMap = { 'C': 65.41, 'C#': 69.30, 'Db': 69.30, 'D': 73.42, 'D#': 77.78, 'Eb': 77.78, 'E': 82.41, 'F': 43.65, 'F#': 46.25, 'Gb': 46.25, 'G': 49.00, 'G#': 51.91, 'Ab': 51.91, 'A': 55.00, 'A#': 58.27, 'Bb': 58.27, 'B': 61.74 };
  return rootMap[rootNote] || 55.0;
}

function hit(name,volume=.75){
  audioContext ||= new AudioContext();
  if(audioContext.state === 'suspended') audioContext.resume();

  let playbackRate = 1.0;
  if(name === 'bass' && state.bassTuned !== false){
    const root = getChordRoot(currentChord());
    playbackRate = root / 65.41;
  }

  if(customBuffers[name]){
    playSampleBuffer(customBuffers[name], volume, true, playbackRate);
    return;
  }
  const url = starterKit[name];
  if(!url) return;
  const buf = bufferCache.get(url);
  if(buf){
    playSampleBuffer(buf, volume, true, playbackRate);
  } else {
    const voice = new Audio(url);
    voice.volume = Math.max(0, Math.min(1, volume));
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
    source.start();
  } else {
    const voice = new Audio(vocalUrl);
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

  if(activeDrums && mixVol('drums')) for(const name of lanes) if(state.drums[name].has(step)) hit(name,drumVelocity(name,step)*mixVol('drums'));
  if(activeKeys && mixVol('keys') && state.pattern.length){
    const sixteenth=60/state.bpm/4;
    state.pattern.filter(note=>note.x===step).forEach(note=>{
      const hold=Math.max(sixteenth*.75,note.w*sixteenth*.92);
      const accent=note.x%8===0?1:note.x%4===0?.84:.66;
      tone(note.n,hold,.14*accent*mixVol('keys'),state.instrument);
    });
  }
  if(activeChords && state.chordAdded&&mixVol('chords')&&step%4===0) (chordTones[currentChord()]||[]).forEach(note=>tone(note,.78,.045*mixVol('chords'),state.instrument==='pluck'?'rhodes':state.instrument));
  if(activeVocals && state.vocalAdded&&step===0) playVocalOnce();
  if(metronomeOn&&step%4===0) tone(step===0?'C6':'C5',.05,.035,'pluck');
}

function projectSnapshot(){
  return {
    id:state.id,name:state.name,description:state.description,updated:Date.now(),
    bpm:state.bpm,key:state.key,prompt:state.prompt,chips:state.chips,pattern:state.pattern,idea:state.idea,
    instrument:state.instrument,swing:state.swing,
    drumPunch:state.drumPunch!==false,customSamples:state.customSamples||{},
    fx:state.fx||{reverb:0.22,delay:0.15,filter:0},
    bassTuned:state.bassTuned!==false,
    songMode:!!state.songMode,
    songSection:state.songSection||0,
    sections:state.sections||[],
    kit:state.kit,    drums:Object.fromEntries(lanes.map(lane=>[lane,[...state.drums[lane]]])),
    chords:state.chords,chordAdded:state.chordAdded,drumsAdded:!!state.drumsAdded,vocals:state.vocals,vocalAdded:state.vocalAdded,
    mix:state.mix,melodyAdded:state.melodyAdded
  };
}
function loadProjects(){try{const list=JSON.parse(localStorage.getItem('bmai-projects'));return Array.isArray(list)?list:[]}catch{return []}}
function writeProjects(list){localStorage.setItem('bmai-projects',JSON.stringify(list))}
function saveProject(){
  const snapshot=projectSnapshot();
  localStorage.setItem('bmai-project',JSON.stringify(snapshot));
  const list=loadProjects();
  const index=list.findIndex(project=>project.id===snapshot.id);
  if(index>=0) list[index]=snapshot; else list.unshift(snapshot);
  writeProjects(list);
  const status=document.querySelector('.project span:last-child');
  if(status) status.textContent='Saved just now';
}
function applySnapshot(project){
  state.id=project.id;
  state.name=project.name||'Untitled idea';
  state.description=project.description||'';
  state.bpm=project.bpm||92;
  state.key=project.key||'A minor';
  state.prompt=project.prompt||'late-night R&B, warm and a little dark';
  state.chips=project.chips||['R&B'];
  state.pattern=project.pattern?.length?project.pattern.map(note=>({...note})):[];
  state.idea=project.idea||0;
  state.instrument=project.instrument||'rhodes';
  state.swing=project.swing!==undefined?Number(project.swing):18;
  state.drumPunch=project.drumPunch!==false;
  state.customSamples=project.customSamples||{};
  state.fx=project.fx||{reverb:0.22,delay:0.15,filter:0};
  state.bassTuned=project.bassTuned!==false;
  state.songMode=!!project.songMode;
  state.songSection=project.songSection||0;
  if(Array.isArray(project.sections)&&project.sections.length) state.sections=project.sections;
  updateDrumBusRouting();
  updateFilterRouting();
  state.chords=project.chords||progressions[state.key]?.[0]||progressions['A minor'][0];
  state.chordAdded=!!project.chordAdded;
  state.drumsAdded=!!project.drumsAdded;
  state.vocals=project.vocals||{title:'Soft hook',line:'keep the night close, don’t say it loud',chain:'Modern R&B'};
  state.vocalAdded=!!project.vocalAdded;
  state.mix=project.mix||defaultMix();
  state.melodyAdded=!!project.melodyAdded||!!(project.pattern&&project.pattern.length);
  for(const lane of lanes) state.drums[lane]=new Set(project.drums?.[lane]||[]);
  applyKit(sessionKits[project.kit]?project.kit:'rnb');
}
function openProject(id){
  const project=loadProjects().find(item=>item.id===id);
  if(!project) return;
  if(playing) setPlaying(false);
  history=[]; future=[];
  applySnapshot(project);
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
  state.id=crypto.randomUUID();
  state.name=name;
  state.description=description||`${kitNames[kit]} loop, ready to edit.`;
  state.bpm=92;
  state.key='A minor';
  state.prompt=description||'late-night R&B, warm and a little dark';
  state.chips=['R&B'];
  state.pattern=[];
  state.idea=0;
  state.chords=progressions['A minor'][0];
  state.chordAdded=false;
  state.drumsAdded=false;
  state.vocalAdded=false;
  state.melodyAdded=false;
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
  if(resetSteps) for(const lane of lanes) state.drums[lane]=new Set(kit.steps[lane]);
  const genreSwings = { rnb: 18, trap: 12, house: 8, acoustic: 15, dnb: 0, dj: 16 };
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
  shell.style.gridTemplateRows=pianoOn?'59px 56px minmax(0,1fr) minmax(220px,34vh) 29px':'59px 56px minmax(0,1fr) 29px';
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
const keyScales={'A minor':['A4','C5','D5','E5','G5','A5'],'C major':['C4','D4','E4','G4','A4','C5'],'D minor':['D4','F4','G4','A4','C5','D5'],'F major':['F4','G4','A4','C5','D5','F5']};
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
  state.drumsAdded=true;
  saveProject();renderApp();notify('Beat humanized with ghost notes & dynamic groove');
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
      <div class="tempo"><label>BPM <input id="bpm" type="number" min="40" max="240" value="92" /></label><span class="divider"></span><label class="key-menu">KEY <button type="button" class="key-trigger" id="key" aria-haspopup="listbox" aria-expanded="false"><span id="key-value">A minor</span></button><ul class="key-list" id="key-list" hidden role="listbox"><li><button type="button" data-key="A minor" role="option">A minor</button></li><li><button type="button" data-key="C major" role="option">C major</button></li><li><button type="button" data-key="D minor" role="option">D minor</button></li><li><button type="button" data-key="F major" role="option">F major</button></li></ul></label><span class="divider"></span><label title="MPC 16th swing groove">SWING <input id="swing" type="number" min="0" max="60" value="18" style="width:36px;" />%</label><span class="divider"></span><button class="metronome" id="metronome" type="button">♩</button></div>
      <div class="transport-right"><canvas id="audio-visualizer" class="spectrum-canvas" width="105" height="24" title="Real-time Audio Spectrum Visualizer"></canvas><span class="divider"></span><span>4 / 4</span><span class="divider"></span><span>♬ 1/16</span></div>
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
          <p class="piano-hint">Drag a note to move it. Drag the bright edge to change length. Click empty grid to add.</p>
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
    <div class="library-modal" id="library-modal" hidden><div class="library-card"><div class="library-head"><div><span>SOUND &amp; INSTRUMENT LIBRARY</span><h2 id="library-count">Public CC0 &amp; Royalty-Free Sounds</h2></div><button id="close-library">×</button></div>
    <div class="library-tabs"><button type="button" class="lib-tab active" id="lib-tab-sounds">📦 Factory Sounds &amp; Kits</button><button type="button" class="lib-tab" id="lib-tab-sources">🌐 Free Public Sources &amp; Packs</button></div>
    <div id="lib-view-sounds"><p>Production-ready drums, scratches, DJ tools, and textures. Preview any sound or load a beat kit.</p><div class="kit-row"><span>Beat style</span><button type="button" data-kit="rnb" class="on">R&amp;B</button><button type="button" data-kit="house">House</button><button type="button" data-kit="trap">Trap</button><button type="button" data-kit="dnb">Drum &amp; bass</button><button type="button" data-kit="acoustic">Acoustic</button><button type="button" data-kit="dj">DJ Set</button></div><div class="library-tools"><input id="library-search" type="search" placeholder="Search kicks, scratches, bass, pads, breaks…" aria-label="Search sounds" /></div><div class="pack-row" id="pack-row"></div><div class="group-row" id="group-row"></div><div class="sound-groups" id="sound-groups"></div><div class="library-meta"><span id="library-status"></span><span>CC0 only · novelty effects excluded</span></div></div>
    <div id="lib-view-sources" hidden><div class="sources-intro"><h3>Download Free Music Sets, Scratches &amp; Instruments</h3><p>Download free sound packs from these open, public repositories and drag &amp; drop the <code>.wav</code> or <code>.mp3</code> files directly onto BMAI's <strong>Kick</strong>, <strong>Snare</strong>, <strong>Hi-Hat</strong>, or <strong>Bass</strong> lanes.</p></div>
    <div class="sources-grid">
      <div class="source-card"><div class="source-header"><span class="source-badge">75,000+ SAMPLES</span><h4>SampleRadar (MusicRadar)</h4></div><p>Official library of over 75,000 100% royalty-free professional 24-bit .wav samples. Includes dedicated packs for Hip Hop Breaks, Scratch Kits, Vintage Keys, and 808s.</p><div class="source-tags"><span>Free WAVs</span><span>Hip-Hop Breaks</span><span>Scratch Kits</span><span>808 Bass</span></div><div class="source-actions"><a href="https://www.musicradar.com/news/tech/free-music-samples-royalty-free-loops-hits-and-multis-to-download" target="_blank" rel="noopener noreferrer" class="source-link-btn">Visit SampleRadar ↗</a><span class="source-tip">Drag unzipped WAVs to drum lanes</span></div></div>
      <div class="source-card"><div class="source-header"><span class="source-badge cc0">CREATIVE COMMONS 0</span><h4>Freesound.org (CC0 Filtered)</h4></div><p>Massive collaborative database filtered for Creative Commons 0 (Public Domain) audio. Thousands of vinyl scratches, vocal chants, DJ drops, and vintage drum machines.</p><div class="source-tags"><span>CC0 Public Domain</span><span>Vinyl Scratches</span><span>DJ Drops</span><span>Vocal Shouts</span></div><div class="source-actions"><a href="https://freesound.org/search/?q=license:creative_commons_0" target="_blank" rel="noopener noreferrer" class="source-link-btn">Search Freesound CC0 ↗</a><span class="source-tip">Search "vinyl scratch" or "amen break"</span></div></div>
      <div class="source-card"><div class="source-header"><span class="source-badge archive">AUDIO ARCHIVE</span><h4>Internet Archive Breakbeat &amp; DJ Archives</h4></div><p>Historic funk breakbeats (Amen Break, Think Break), speech recordings, and public domain vinyl recordings curated by audio archivists.</p><div class="source-tags"><span>Classic Breaks</span><span>Funk Drums</span><span>Speech Drops</span><span>Vintage Vinyl</span></div><div class="source-actions"><a href="https://archive.org/details/audio" target="_blank" rel="noopener noreferrer" class="source-link-btn">Open Internet Archive ↗</a><span class="source-tip">Search "breakbeat collection"</span></div></div>
      <div class="source-card"><div class="source-header"><span class="source-badge soundfont">128 INSTRUMENTS</span><h4>FluidR3 General MIDI SoundFonts</h4></div><p>Open-source General MIDI sound library by Frank Wen &amp; Gleitz. Sampled acoustic guitars, orchestral strings, church organs, and flutes packaged for web audio.</p><div class="source-tags"><span>Sampled Instruments</span><span>Acoustic Guitar</span><span>Orchestral Strings</span><span>Flute</span></div><div class="source-actions"><a href="https://github.com/gleitz/midi-js-soundfonts" target="_blank" rel="noopener noreferrer" class="source-link-btn">View on GitHub ↗</a><span class="source-tip">Playable directly in BMAI Piano Roll!</span></div></div>
      <div class="source-card"><div class="source-header"><span class="source-badge" style="background:#2d1b38;color:#ff9bd8;">FREE VOCALS &amp; ACAPELLAS</span><h4>ccMixter &amp; Looperman Vocals</h4></div><p>Over 30,000 free royalty-free vocal acapellas, singing lines, rap verses, and spoken word recordings. Download free WAVs and drag straight into BMAI's AI Vocals tab.</p><div class="source-tags"><span>Free Acapellas</span><span>Singing Hooks</span><span>Rap Stems</span><span>Spoken Word</span></div><div class="source-actions"><a href="https://ccmixter.org/browse" target="_blank" rel="noopener noreferrer" class="source-link-btn">Browse ccMixter ↗</a><a href="https://www.looperman.com/acapellas" target="_blank" rel="noopener noreferrer" class="source-link-btn" style="background:#28293d;">Looperman ↗</a></div></div>
    </div></div>
    </div></div>
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
    <div class="arrangement drum-track ${(!isTrackActive('drums')||state.mix.drums.mute)?'muted-track':''}" data-arrange-track="drums"><div class="track-label"><span class="track-icon">◌</span><div><strong>Drums</strong><small id="drum-kit-label">${esc(kit.blurb)}</small></div></div><div class="clip drum-clip"><span>Kick · Snare · Hat · Bass</span><div class="mini-notes"></div></div></div>
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
    <p class="page-lead">Drag &amp; drop your own <code>.wav</code> or <code>.mp3</code> samples onto any drum lane for commercial sound, or program the stock kit below. Need free samples? Browse <a href="#" id="lead-open-sources" style="color:#b391ff;text-decoration:underline;">SampleRadar, Freesound &amp; Archive.org</a>.</p>
    <div class="drum-top-bar">
      <div class="kit-row page-kits">${Object.entries(sessionKits).map(([id])=>`<button type="button" data-kit="${id}" class="${state.kit===id?'on':''}">${kitNames[id]}</button>`).join('')}</div>
      <button type="button" class="punch-btn ${isPunch?'on':''}" id="toggle-drum-punch" title="Analog soft-clipper saturation on drum bus">
        <span class="punch-led"></span> DRUM PUNCH (SOFT CLIP)
      </button>
    </div>
    <div class="drum-lanes">${lanes.map(lane=>{
      const hasCustom = !!customBuffers[lane];
      const sampleName = state.customSamples?.[lane] || 'Stock kit';
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
        </div>
        <div class="steps">${Array.from({length:16},(_,step)=>`<button class="step ${state.drums[lane].has(step)?'on':''} ${step%4===0?'beat':''} ${playing&&sequenceStep===step?'now':''}" data-lane="${lane}" data-step="${step}" aria-label="${lane} step ${step+1}"></button>`).join('')}</div>
      </div>`;
    }).join('')}</div>
    <div class="take-actions"><button class="page-btn hot" id="humanize-drums">Humanize beat</button><button class="page-btn" data-open="library">Browse kits</button><button class="page-btn" id="open-public-sources">🌐 Free Sound Packs</button></div>
    ${arrangement()}
  </div>`;
}
function stageChords(){
  const options=progressions[state.key]||progressions['A minor'];
  return `<div class="page-stack">
    ${backToProject()}
    <div class="stage-header"><div><p class="eyebrow">AI CHORDS</p><h1>Build a harmonic bed in ${esc(state.key)}.</h1></div><span class="session-pill">${esc(state.chords.bars.join(' · '))}</span></div>
    <p class="page-lead">One chord per beat, inside the same one-bar loop. The progression is included when you export MIDI.</p>
    <div class="ideas">${options.map(option=>`<article class="idea ${option.name===state.chords.name?'chosen':''}" data-chord="${esc(option.name)}"><div class="idea-number">${esc(option.bars[0])}</div><div class="idea-text"><strong>${esc(option.name)}</strong><span>${esc(option.feel)}</span></div></article>`).join('')}</div>
    <div class="chord-bars">${state.chords.bars.map((bar,i)=>`<div class="chord-bar"><span>BEAT ${i+1}</span><b>${esc(bar)}</b></div>`).join('')}</div>
    <div class="take-actions"><button class="page-btn hot" id="generate-chords">Regenerate in this key</button><button class="page-btn" id="add-chords">Add chords to project</button></div>
    ${arrangement()}
  </div>`;
}
const factoryVocals = [
  { name: 'Life Goes On', url: '/sounds/stargate/microlag/One-Shots/Vocals/Life_Goes_On.wav', tag: 'Melodic Hook · Soul' },
  { name: 'Fantastic', url: '/sounds/stargate/microlag/One-Shots/Vocals/Fantastic.wav', tag: 'Smooth Vocal Lead' },
  { name: 'December', url: '/sounds/stargate/microlag/One-Shots/Vocals/December.wav', tag: 'Singing Phrase · R&B' },
  { name: 'I Hope It\'s Not Over', url: '/sounds/stargate/microlag/One-Shots/Vocals/I_Hope_It\'s_Not_Over.wav', tag: 'Emotional Refrain' },
  { name: 'One Two Three Let\'s Go', url: '/sounds/stargate/microlag/One-Shots/Vocals/One_Two_Three_Let\'s_Go.wav', tag: 'Hype Drop · Energy' },
  { name: 'Check This Out', url: '/sounds/stargate/microlag/One-Shots/Vocals/Vocal_Check_This_Out.wav', tag: 'DJ Drop · Hip-Hop' },
  { name: 'Word Up', url: '/sounds/stargate/microlag/One-Shots/Vocals/Word_Up.wav', tag: 'Classic DJ Shout' },
  { name: 'Praise The Lord', url: '/sounds/stargate/microlag/One-Shots/Vocals/Praise_The_Lord.wav', tag: 'Gospel Hook' },
  { name: 'That\'s Insane', url: '/sounds/stargate/microlag/One-Shots/Vocals/That\'s_Insane.wav', tag: 'Trap Energy Shout' },
  { name: 'Pretty Cool', url: '/sounds/stargate/microlag/One-Shots/Vocals/Pretty_Cool.wav', tag: 'Chill Phrase' },
  { name: 'Excuse Me', url: '/sounds/stargate/microlag/One-Shots/Vocals/Excuse_Me.wav', tag: 'Vocal Transition' },
  { name: 'Shine Muscat', url: '/sounds/stargate/microlag/One-Shots/Vocals/Shine_Muscat_Is_Bussin.wav', tag: 'Catchphrase Drop' }
];

function stageVocals(){
  const chains=['Modern R&B','Dark rap','Lo-fi'];
  const ideas=[state.vocals,
    {title:'Low refrain',line:'I still hear that hallway echo'},
    {title:'Lift',line:'wait for the drop, then let it bloom'}
  ].filter((idea,index,list)=>list.findIndex(item=>item.title===idea.title)===index).slice(0,3);
  return `<div class="page-stack">
    ${backToProject()}
    <div class="stage-header"><div><p class="eyebrow">AI VOCALS</p><h1>Choose a free hook, drop, or record a take.</h1></div><span class="session-pill">${esc(state.vocals.chain)}</span></div>
    <p class="page-lead">Select from 12 built-in CC0 vocal hooks &amp; drops below, drag &amp; drop an audio file (.wav, .mp3), or record with your microphone.</p>

    <div class="ideas-head"><span>12 FREE BUILT-IN VOCAL HOOKS &amp; DROPS</span><span class="hint">Click any vocal to audition &amp; load</span></div>
    <div class="factory-vocals-grid">${factoryVocals.map(v=>`<button type="button" class="vocal-card ${vocalUrl===v.url?'chosen':''}" data-load-vocal="${esc(v.url)}" data-vocal-title="${esc(v.name)}"><span class="vocal-icon">🎙️</span><div class="vocal-info"><strong>${esc(v.name)}</strong><span>${esc(v.tag)}</span></div></button>`).join('')}</div>

    <div class="take-box vocal-drop-box" id="vocal-drop-zone">
      <div>
        <strong>${vocalUrl ? esc(state.vocals.title || 'Vocal loaded') : 'Microphone or Custom Vocal File'}</strong>
        <p>${vocalUrl ? 'This vocal is active in your project, loops in Song Mode, and is included in your WAV master &amp; stems export.' : 'Record with your microphone, click any preset vocal above, or drag &amp; drop an audio file (.wav, .mp3).'}</p>
      </div>
      <div class="take-actions">
        <button class="page-btn hot" id="record-vocal">Record mic</button>
        <button class="page-btn" id="stop-vocal">Stop</button>
        <button class="page-btn" id="play-vocal" ${vocalUrl?'':'disabled'}>▷ Play vocal</button>
        <button class="page-btn" id="pick-vocal-file">Upload .wav / .mp3</button>
        ${vocalUrl?`<button class="page-btn" id="clear-vocal">Clear vocal</button>`:''}
        <button class="page-btn" id="add-vocal">Add vocals to project</button>
      </div>
    </div>

    <div class="ideas-head" style="margin-top:16px;"><span>VOCAL CHAIN (DSP)</span><span class="hint">Tone processing</span></div>
    <div class="kit-row chain-row">${chains.map(chain=>`<button type="button" data-chain="${esc(chain)}" class="${state.vocals.chain===chain?'on':''}">${esc(chain)}</button>`).join('')}</div>

    ${arrangement()}
  </div>`;
}
function stageMix(){
  const rows=[['keys','Keys'],['drums','Drums'],['chords','Chords'],['vocals','Vocals']];
  const filterVal = Number(state.fx?.filter ?? 0);
  const filterTag = filterVal === 0 ? 'Bypass' : (filterVal < 0 ? `Lowpass ${filterVal}` : `Highpass +${filterVal}`);

  return `<div class="page-stack">
    <div class="stage-header"><div><p class="eyebrow">MIX</p><h1>Balance the idea before you export.</h1></div><span class="session-pill">Local faders &amp; DSP FX</span></div>
    <p class="page-lead">Mute or pull down any track, shape the space with Reverb &amp; Delay, or sweep the Master DJ filter.</p>

    <div class="fx-rack-card">
      <div class="fx-rack-header">
        <div class="fx-rack-title">
          <span class="fx-badge">DSP RACK</span>
          <strong>Studio Effects &amp; Master Filter</strong>
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

    <div class="mix-stack">${rows.map(([id,name])=>`<div class="mix-row"><strong>${name}</strong><button data-mute="${id}" class="${state.mix[id].mute?'on':''}">${state.mix[id].mute?'Muted':'Mute'}</button><input type="range" min="0" max="100" value="${Math.round(state.mix[id].vol*100)}" data-vol="${id}" /><small>${Math.round(state.mix[id].vol*100)}</small></div>`).join('')}</div>
    ${arrangement()}
  </div>`;
}
function stageExport(){
  return `<div class="page-stack">
    <div class="stage-header"><div><p class="eyebrow">EXPORT</p><h1>Take the idea into another DAW or release it.</h1></div><span class="session-pill">WAV + MIDI + JSON</span></div>

    <div class="export-card featured-export">
      <div class="export-badge-pill">STUDIO AUDIO (WAV)</div>
      <h3>Master Audio Mixdown (.wav)</h3>
      <p>Pristine 16-bit 44.1kHz stereo audio file with drum punch, pitched 808s, and studio effects applied. Ready for TikTok, YouTube, CapCut, Instagram, or direct listening.</p>
      <div class="export-actions">
        <button class="page-btn hot" id="export-wav-master">Download Master (.wav)</button>
        <button class="page-btn" id="export-wav-stems">Download Stems (.wav)</button>
      </div>
    </div>

    <div class="export-card"><h3>Standard MIDI</h3><p>Complete 4-bar loop: Melody (Ch 1), Chords (Ch 2), Bass (Ch 3), and GM Drums (Ch 10), ready for Ableton, FL Studio, Logic, or GarageBand.</p><div class="export-actions"><button class="page-btn hot" id="export-midi">Download .mid</button></div></div>
    <div class="export-card"><h3>BMAI project</h3><p>JSON snapshot of tempo, key, drums, chords, mix, and the vocal line so you can reopen or share this session.</p><div class="export-actions"><button class="page-btn hot" id="export-json">Download .json</button><button class="page-btn" id="import-json">Import .json</button></div></div>
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
      <label>Key<select id="settings-key">${['A minor','C major','D minor','F major'].map(key=>`<option ${key===state.key?'selected':''}>${key}</option>`).join('')}</select></label>
      <label>Time signature<select id="settings-meter"><option>4 / 4</option></select></label>
    </div>
    <div class="take-actions"><button class="page-btn hot" id="save-settings">Save settings</button><button class="page-btn" id="import-json-settings">Import project</button><button class="page-btn" id="new-idea">Start a new idea</button></div>
  </div>`;
}

function inspectorCard(eyebrow,art,body){
  return `<div class="inspector-title"><span>${esc(eyebrow)}</span><button id="close-inspector" type="button" aria-label="Close panel">×</button></div><div class="preset-art"><div class="orb"></div><span>${esc(art)}</span></div>${body}`;
}
function inspectorFor(){
  if(state.view==='home') return inspectorCard('THIS PROJECT',state.key,`<h2>${esc(state.name)}</h2><p class="description">${esc(state.description)}</p><div class="details"><div><span>INSIDE</span><strong>${esc(contentsLine(projectSnapshot()))}</strong></div></div>`);
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
let selectedNote = -1;

function placeNoteEl(el,p){
  const y=notes.indexOf(p.n);
  el.style.top=`${Math.max(0,y)*16+1}px`;
  el.style.left=`${p.x*6.25}%`;
  el.style.width=`${Math.max(p.w*6.25-0.4,2)}%`;
  el.classList.toggle('short',p.w<2);
  const label=el.querySelector('.note-pitch');
  if(label) label.textContent=p.w>=2?p.n:'';
  el.title=`${p.n} · beat ${Math.floor(p.x/4)+1} · ${p.w} ${p.w===1?'step':'steps'}`;
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

function renderPiano(){
  const keyboard=document.querySelector('#keyboard'); const grid=document.querySelector('#grid'); const wrap=document.querySelector('#piano-wrap');
  if(!keyboard||!grid) return;
  const scale=scaleForKey();
  const scaleNames=new Set(scale.map(item=>item.replace(/\d+$/,'')));
  keyboard.innerHTML=notes.map(n=>{
    const name=n.replace(/\d+$/,'');
    const on=scale.includes(n)||scaleNames.has(name);
    return `<button type="button" class="key ${white(n)?'white':'black'}${on?' in-scale':''}" data-note="${n}"><span>${n}</span></button>`;
  }).join('');
  const rows=notes.map((n,i)=>`${white(n)?'#161722':'#101119'} ${i*16}px ${(i+1)*16}px`).join(',');
  grid.style.background=`repeating-linear-gradient(90deg,transparent 0 calc(25% - 1px),#3c3d4c 0 25%),repeating-linear-gradient(90deg,transparent 0 calc(6.25% - 1px),#2a2b38 0 6.25%),linear-gradient(${rows})`;
  grid.querySelectorAll('.note').forEach(el=>el.remove());
  state.pattern.forEach((p,i)=>{
    const y=notes.indexOf(p.n);
    if(y<0) return;
    const el=document.createElement('div');
    el.className='note';
    el.dataset.i=i;
    if(selectedNote===i) el.classList.add('selected');
    placeNoteEl(el,p);

    const label=document.createElement('span');
    label.className='note-pitch';
    label.textContent=p.n;
    el.append(label);

    const handle=document.createElement('span');
    handle.className='note-handle';
    handle.title='Drag to change length';
    el.append(handle);
    grid.append(el);
  });
  updatePianoChrome();

  if(wrap&&!document.querySelector('#piano-section')?.hidden){
    if(!wrap.dataset.scrolled){
      scrollPianoToNotes();
      wrap.dataset.scrolled='true';
    }
  }
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
  document.querySelectorAll('.tool[data-view]').forEach(button=>button.classList.toggle('active',button.dataset.view===state.view));
  document.querySelectorAll('.nav-link, .settings').forEach(button=>button.classList.toggle('on',button.dataset.view===state.view));
  document.querySelector('#piano-section').hidden=!['melody','chords'].includes(state.view);
  const wrap=document.querySelector('#piano-wrap');
  if(wrap && !document.querySelector('#piano-section').hidden) delete wrap.dataset.scrolled;
  const instNames={rhodes:'Rhodes EP',piano:'Grand Piano',guitar:'Acoustic Guitar',strings:'Strings',bass:'808 Bass',brass:'Synth Brass',organ:'Organ',flute:'Flute',pad:'Lofi Pad',analog:'Analog Poly',pluck:'Crystal Pluck'};
  document.querySelector('#piano-label').textContent=state.view==='chords'?`Chords · ${state.chords.name} · 1 bar`:`Keys (${instNames[state.instrument]||'Rhodes EP'}) · ${melodyIdeas[state.idea].name} · 1 bar`;
  const pianoInstEl=document.querySelector('#piano-inst');
  if(pianoInstEl) pianoInstEl.value=state.instrument||'rhodes';
  document.querySelector('#status-line').innerHTML=`<b>Ready</b> · 1 bar loop · ${esc(state.key)} · ${state.swing}% swing`;
  document.querySelectorAll('[data-kit]').forEach(button=>button.classList.toggle('on',button.dataset.kit===state.kit));
  renderPiano();
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
    placePlayhead(0);
    document.querySelectorAll('.step.now').forEach(step=>step.classList.remove('now'));
    document.querySelectorAll('.note.playing').forEach(el=>el.classList.remove('playing'));
    if(state.songMode){
      state.songSection = 0;
      updateSectionUI();
    }
    return;
  }
  audioContext||=new AudioContext();
  audioContext.resume();
  initMasterChain();
  initVisualizer();
  sequenceStep=0;
  songBarCount=0;
  playDrumStep(sequenceStep);
  placePlayhead(sequenceStep);

  function scheduleNext(){
    if(!playing) return;
    const baseStepMs=60000/state.bpm/4;
    const swingFactor=((state.swing||0)/100)*0.45;
    const nextStepDelay=(sequenceStep%2===0)?baseStepMs*(1+swingFactor):baseStepMs*(1-swingFactor);

    timer=setTimeout(()=>{
      if(!playing) return;
      const nextStep=(sequenceStep+1)%16;
      if(nextStep === 0 && state.songMode && state.sections?.length){
        songBarCount++;
        const currentSec = state.sections[state.songSection] || state.sections[0];
        if(songBarCount >= (currentSec.bars || 1)){
          songBarCount = 0;
          state.songSection = (state.songSection + 1) % state.sections.length;
          updateSectionUI();
        }
      }
      sequenceStep=nextStep;
      playDrumStep(sequenceStep);
      placePlayhead(sequenceStep);
      document.querySelectorAll('.step').forEach(step=>step.classList.toggle('now',Number(step.dataset.step)===sequenceStep));
      scheduleNext();
    },Math.max(15,nextStepDelay));
  }
  scheduleNext();
}

function renderOfflineTone(ctx, dest, note, time, duration, volume, instrument){
  voice(ctx, dest, note, time, duration, volume, instrument);
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

  offMasterInput.connect(offFilter);
  offMasterInput.connect(offReverb);
  offMasterInput.connect(offDelay);
  offFilter.connect(offMasterOutput);
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

    const keysActive = (!stemTrack || stemTrack === 'keys') && state.pattern.length && !state.mix.keys.mute && (!state.songMode || currentSec?.active?.keys !== false);
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
        const chord = state.chords.bars[beat % state.chords.bars.length];
        const tones = chordTones[chord] || [];
        const chordTime = barStartTime + beat * (60 / state.bpm);
        tones.forEach(n => {
          renderOfflineTone(offCtx, offMasterInput, n, chordTime, 0.68, 0.05 * state.mix.chords.vol, state.instrument);
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

        for(const lane of lanes){
          if(state.drums[lane].has(s)){
            let playbackRate = 1.0;
            if(lane === 'bass' && state.bassTuned !== false){
              const root = getChordRoot(chord);
              playbackRate = root / 65.41;
            }
            const buf = customBuffers[lane] || bufferCache.get(starterKit[lane]);
            if(buf){
              const dSource = offCtx.createBufferSource();
              dSource.buffer = buf;
              if(playbackRate !== 1.0) dSource.playbackRate.value = playbackRate;
              const dGain = offCtx.createGain();
              dGain.gain.value = drumVelocity(lane, s) * state.mix.drums.vol;
              dSource.connect(dGain).connect(offDrumBusInput);
              dSource.start(stepTime);
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
function exportMidi(){
  const ticks=480,events=[];
  // 4-bar loop: 4 * 1920 = 7680 ticks
  for(let b=0; b<4; b++){
    const barStart = b * 1920;
    // Channel 0 (0x90): Melody / Keys
    state.pattern.forEach(note => {
      const start = barStart + note.x * 120;
      const end = start + note.w * 120 - 15;
      events.push(
        { t: start, data: [0x90, midiNumber(note.n), 96] },
        { t: end, data: [0x80, midiNumber(note.n), 0] }
      );
    });
    // Channel 9 (0x99): General MIDI Drums (Kick 36, Snare 38, Hat 42) & Channel 2 (0x92): Bass
    for(let s=0; s<16; s++){
      const t = barStart + s * 120;
      const offT = t + 80;
      if(state.drums.kick.has(s)) events.push({ t, data: [0x99, 36, 100] }, { t: offT, data: [0x89, 36, 0] });
      if(state.drums.snare.has(s)) events.push({ t, data: [0x99, 38, 95] }, { t: offT, data: [0x89, 38, 0] });
      if(state.drums.hat.has(s)) events.push({ t, data: [0x99, 42, 80] }, { t: offT, data: [0x89, 42, 0] });
      if(state.drums.bass.has(s)) events.push({ t, data: [0x92, 33, 105] }, { t: t + 110, data: [0x82, 33, 0] });
    }
  }

  // Channel 1 (0x91): Chords
  if(state.chordAdded && state.chords?.bars){
    state.chords.bars.forEach((bar, index) => {
      const tones = chordTones[bar] || [];
      const start = index * 1920;
      const end = start + 1880;
      tones.forEach(note => {
        events.push(
          { t: start, data: [0x91, midiNumber(note), 80] },
          { t: end, data: [0x81, midiNumber(note), 0] }
        );
      });
    });
  }

  events.sort((a,b)=>a.t-b.t||a.data[0]-b.data[0]);
  let last=0;const tempo=Math.round(60000000/state.bpm),body=[0,0xff,0x51,3,(tempo>>16)&255,(tempo>>8)&255,tempo&255];
  for(const event of events){body.push(...variableLength(event.t-last),...event.data);last=event.t}
  body.push(0,0xff,0x2f,0);
  const u32=n=>[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255];
  const bytes=[...new TextEncoder().encode('MThd'),0,0,0,6,0,0,0,1,(ticks>>8)&255,ticks&255,...new TextEncoder().encode('MTrk'),...u32(body.length),...body];
  const blob=new Blob([new Uint8Array(bytes)],{type:'audio/midi'}),a=document.createElement('a');
  a.href=URL.createObjectURL(blob);a.download=`${state.name.replace(/\s+/g,'-').toLowerCase()}.mid`;a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);notify('Standard MIDI file exported (Keys, Chords, Bass & Drums)');
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
function playPreview(button){if(previewAudio)previewAudio.pause();document.querySelectorAll('.sound-preview').forEach(item=>item.classList.remove('is-playing'));previewAudio=new Audio(button.dataset.url);previewAudio.volume=.75;button.classList.add('is-playing');previewAudio.play().catch(()=>{});previewAudio.addEventListener('ended',()=>button.classList.remove('is-playing'))}
function setLibraryTab(tab){
  const tabSounds = document.querySelector('#lib-tab-sounds');
  const tabSources = document.querySelector('#lib-tab-sources');
  const viewSounds = document.querySelector('#lib-view-sounds');
  const viewSources = document.querySelector('#lib-view-sources');
  if(!tabSounds || !tabSources || !viewSounds || !viewSources) return;
  if(tab === 'sources'){
    tabSounds.classList.remove('active');
    tabSources.classList.add('active');
    viewSounds.hidden = true;
    viewSources.hidden = false;
  } else {
    tabSounds.classList.add('active');
    tabSources.classList.remove('active');
    viewSounds.hidden = false;
    viewSources.hidden = true;
  }
}

async function openLibrary(initialTab = 'sounds'){
  const modal = document.querySelector('#library-modal');
  if(!modal) return;
  modal.hidden = false;
  setLibraryTab(initialTab);
  if(catalog){
    renderLibrary();
    return;
  }
  document.querySelector('#sound-groups').innerHTML = '<p class="empty-sounds">Loading library…</p>';
  try {
    catalog = await fetch('/sounds/catalog.json').then(response => response.json());
    renderLibrary();
  } catch(e) {
    document.querySelector('#sound-groups').innerHTML = '<p class="empty-sounds">Failed to load local catalog.</p>';
  }
}
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
    base.map((note,i)=>({...note,n:scale[(scale.length-1)-(i%scale.length)]}))
  ];
  history.push(base);
  state.pattern=variants[index].map(note=>({...note}));
  state.idea=index;
  state.melodyAdded=true;saveProject();renderApp();scrollPianoToNotes();
}

function onAction(target){
  if(target.dataset.view){setView(target.dataset.view);return true}
  if(target.dataset.open==='library'){openLibrary();return true}
  if(target.dataset.open){setView(target.dataset.open);return true}
  if(target.dataset.start){applyKit(target.dataset.start,true);state.chips=target.dataset.start==='rnb'?['R&B','Dark']:target.dataset.start==='acoustic'?['Smooth']:target.dataset.start==='trap'?['Dark']:['Simple'];saveProject();setView('drums');notify(`${sessionKits[state.kit].blurb} loaded`);return true}
  if(target.dataset.kit&&sessionKits[target.dataset.kit]){applyKit(target.dataset.kit,true);state.drumsAdded=true;saveProject();renderApp();notify(`${sessionKits[state.kit].blurb} loaded`);return true}
  if(target.dataset.chip){const chip=target.dataset.chip;state.chips=state.chips.includes(chip)?state.chips.filter(item=>item!==chip):[...state.chips,chip];saveProject();target.classList.toggle('selected');return true}
  if(target.dataset.idea){applyIdea(Number(target.dataset.idea));document.querySelectorAll('.idea').forEach(el=>el.classList.remove('chosen'));target.closest('.idea').classList.add('chosen');return true}
  if(target.dataset.chord){const option=(progressions[state.key]||[]).find(item=>item.name===target.dataset.chord);if(option){state.chords=option;saveProject();renderApp()}return true}
  if(target.dataset.lyric){state.vocals={...state.vocals,title:target.dataset.lyric,line:target.dataset.line};saveProject();renderApp();return true}
  if(target.dataset.chain){state.vocals={...state.vocals,chain:target.dataset.chain};saveProject();renderApp();return true}
  if(target.dataset.lane){const step=Number(target.dataset.step);if(state.drums[target.dataset.lane].has(step))state.drums[target.dataset.lane].delete(step);else state.drums[target.dataset.lane].add(step);state.drumsAdded=true;saveProject();target.classList.toggle('on');return true}
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
  if(target.id==='pick-vocal-file'){document.querySelector('#vocal-file-input')?.click();return true}
  if(target.id==='clear-vocal'){
    vocalUrl = '';
    vocalBuffer = null;
    state.vocalAdded = false;
    saveProject();
    renderApp();
    notify('Vocal track cleared');
    return true;
  }
  if(target.dataset.loadVocal || target.closest?.('[data-load-vocal]')){
    const btn = target.dataset.loadVocal ? target : target.closest('[data-load-vocal]');
    const url = btn.dataset.loadVocal;
    const title = btn.dataset.vocalTitle || 'Vocal Hook';
    vocalUrl = url;
    prepareVocalBuffer(url).then(()=>{
      state.vocalAdded = true;
      state.vocals.title = title;
      saveProject();
      renderApp();
      playVocalOnce();
      notify(`Loaded preset vocal: "${title}"`);
    });
    return true;
  }
  if(target.id==='add-project'||target.dataset.addMelody!==undefined){state.melodyAdded=true;saveProject();notify('Melody added to the project');return true}
  if(target.id==='preview'){setPlaying(!playing);return true}
  if(target.id==='open-public-sources'||target.id==='lead-open-sources'){openLibrary('sources');return true}
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
document.querySelector('#metronome').addEventListener('click',event=>{metronomeOn=!metronomeOn;event.currentTarget.classList.toggle('metronome-on',metronomeOn);notify(metronomeOn?'Metronome enabled':'Metronome disabled')});
document.querySelector('#stage').addEventListener('click',event=>onAction(event.target.closest('button, article, [data-view], [data-open]')||event.target));
document.querySelector('#inspector').addEventListener('click',event=>onAction(event.target.closest('button')||event.target));
document.querySelector('#stage').addEventListener('input',event=>{
  if(event.target.id==='prompt')state.prompt=event.target.value;
  if(event.target.dataset.vol){
    state.mix[event.target.dataset.vol].vol=Number(event.target.value)/100;
    event.target.nextElementSibling.textContent=event.target.value;
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
const pianoInstSelect=document.querySelector('#piano-inst');
if(pianoInstSelect){
  pianoInstSelect.addEventListener('change',event=>{
    state.instrument=event.target.value;
    triggerSoundfontLoad(state.instrument);
    saveProject();
    renderApp();
    tone('C5',.45,.12,state.instrument);
    const instNames={rhodes:'Neo-Soul Rhodes',piano:'Acoustic Grand Piano',guitar:'FluidR3 Acoustic Guitar',strings:'FluidR3 Strings Ensemble',bass:'808 Sub Bass',brass:'80s Synth Brass',organ:'FluidR3 Church Organ',flute:'FluidR3 Concert Flute',pad:'Lofi Ambient Pad',analog:'Analog Poly',pluck:'Crystal Pluck'};
    notify(`${instNames[state.instrument]||'Keyboard'} loaded`);
  });
}
document.querySelector('#close-library').addEventListener('click',()=>document.querySelector('#library-modal').hidden=true);
document.querySelector('#library-search').addEventListener('input',event=>{query=event.target.value;if(catalog)renderLibrary()});
document.querySelector('#library-modal').addEventListener('click',event=>{
  const tabSounds = event.target.closest('#lib-tab-sounds');
  const tabSources = event.target.closest('#lib-tab-sources');
  if(tabSounds){ setLibraryTab('sounds'); return; }
  if(tabSources){ setLibraryTab('sources'); return; }

  const pack=event.target.closest('[data-pack]');const group=event.target.closest('[data-group]');const kit=event.target.closest('[data-kit]');const sound=event.target.closest('.sound-preview');
  if(pack){packId=pack.dataset.pack;groupId=currentPack().groups[0].id;query='';document.querySelector('#library-search').value='';renderLibrary()}
  else if(group){groupId=group.dataset.group;query='';document.querySelector('#library-search').value='';renderLibrary()}
  else if(kit){applyKit(kit.dataset.kit,true);saveProject();renderApp();notify(`${sessionKits[state.kit].blurb} loaded`)}
  else if(sound) playPreview(sound);
});

const importInput=document.querySelector('#import-json-file');
if(importInput) importInput.addEventListener('change',handleJsonFile);

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

const vocalFileInput=document.querySelector('#vocal-file-input');
if(vocalFileInput){
  vocalFileInput.addEventListener('change',async event=>{
    const file=event.target.files?.[0];
    if(file){
      if(vocalUrl && vocalUrl.startsWith('blob:')) URL.revokeObjectURL(vocalUrl);
      vocalUrl=URL.createObjectURL(file);
      await prepareVocalBuffer(vocalUrl);
      state.vocalAdded=true;
      state.vocals.title=file.name.replace(/\.[^/.]+$/, '');
      saveProject();
      renderApp();
      playVocalOnce();
      notify(`Loaded vocal: "${state.vocals.title}"`);
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
    const vocalDrop=e.target.closest('#vocal-drop-zone');
    if(laneEl){
      e.preventDefault();
      e.dataTransfer.dropEffect='copy';
      document.querySelectorAll('[data-lane-drop]').forEach(el=>{
        if(el!==laneEl) el.classList.remove('drag-over');
      });
      laneEl.classList.add('drag-over');
    } else if(vocalDrop){
      e.preventDefault();
      e.dataTransfer.dropEffect='copy';
      vocalDrop.classList.add('drag-over');
    }
  });

  stageEl.addEventListener('dragleave',e=>{
    const laneEl=e.target.closest('[data-lane-drop]');
    const vocalDrop=e.target.closest('#vocal-drop-zone');
    if(laneEl&&!laneEl.contains(e.relatedTarget)){
      laneEl.classList.remove('drag-over');
    }
    if(vocalDrop&&!vocalDrop.contains(e.relatedTarget)){
      vocalDrop.classList.remove('drag-over');
    }
  });

  stageEl.addEventListener('drop',async e=>{
    const laneEl=e.target.closest('[data-lane-drop]');
    const vocalDrop=e.target.closest('#vocal-drop-zone');
    if(laneEl){
      e.preventDefault();
      laneEl.classList.remove('drag-over');
      const lane=laneEl.dataset.laneDrop;
      const file=e.dataTransfer.files?.[0];
      if(file&&lane){
        await loadCustomSample(lane,file);
      }
    } else if(vocalDrop){
      e.preventDefault();
      vocalDrop.classList.remove('drag-over');
      const file=e.dataTransfer.files?.[0];
      if(file){
        if(vocalUrl && vocalUrl.startsWith('blob:')) URL.revokeObjectURL(vocalUrl);
        vocalUrl=URL.createObjectURL(file);
        await prepareVocalBuffer(vocalUrl);
        state.vocalAdded=true;
        state.vocals.title=file.name.replace(/\.[^/.]+$/, '');
        saveProject();
        renderApp();
        playVocalOnce();
        notify(`Loaded vocal: "${state.vocals.title}"`);
      }
    }
  });
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
function bindPianoEditor(){
  const grid=document.querySelector('#grid');
  const wrap=document.querySelector('#piano-wrap');
  const remove=document.querySelector('#remove-note');
  if(remove&&!remove.dataset.bound){
    remove.dataset.bound='true';
    remove.addEventListener('click',removeSelectedNote);
  }
  if(wrap&&!wrap.dataset.keysBound){
    wrap.dataset.keysBound='true';
    wrap.addEventListener('click',event=>{
      const key=event.target.closest('.key');
      if(!key) return;
      const noteName=key.dataset.note;
      if(noteName) tone(noteName,.32,.12);
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
      document.querySelectorAll('.note').forEach(n=>n.classList.toggle('selected',n===noteEl));
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
bindPianoEditor();

document.addEventListener('keydown',event=>{
  if(['INPUT','SELECT','TEXTAREA'].includes(event.target.tagName)) return;
  if(event.code==='Space'){event.preventDefault();setPlaying(!playing);return}
  if((event.key==='Delete'||event.key==='Backspace')&&selectedNote>=0&&state.pattern[selectedNote]){
    event.preventDefault();
    removeSelectedNote();
  }
});
window.addEventListener('hashchange',()=>{const view=location.hash.slice(1);if(views.includes(view)&&view!==state.view){state.view=view;renderApp()}});
renderApp();
if(saved) saveProject();
