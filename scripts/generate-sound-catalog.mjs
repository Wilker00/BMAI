import { readdir, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const root = join(process.cwd(), 'public', 'sounds');
const output = join(root, 'catalog.json');
const files = [];
const title = value => value.replace(/[-_]+/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) await walk(fullPath);
    if (entry.isFile() && /\.(wav|flac|mp3|ogg)$/i.test(entry.name) && !/8bit|bleep|robot|zap/i.test(entry.name)) {
      const path = relative(root, fullPath).split(sep).join('/');
      const parts = path.split('/');
      const filename = parts.pop();
      files.push({ path, parts, filename });
    }
  }
}

await walk(root);
const packNames = { '0x808':'Drum machines', 'bmai-starter-kit':'BMAI starter kit', 'sonic-pi':'Sonic Pi', stargate:'Stargate DAW' };
const sonicGroups = { ambi:'Ambience', arovane:'Arovane', bass:'Bass', bd:'Kicks', drum:'Drum hits', elec:'Electronic', glitch:'Glitch', guit:'Guitar', hat:'Hi-hats', loop:'Loops', mehackit:'Workshop', misc:'Textures', perc:'Percussion', ride:'Rides', sn:'Snares', tabla:'Tabla', tbd:'The Black Dog', vinyl:'Vinyl' };
const machineGroups = { '505':'TR-505', '808':'TR-808', '808-synth':'808 synth', '909':'TR-909', cassette:'Cassette', 'cr-78-real':'CR-78', hihats:'Hi-hats', kicks:'Kicks', linndrum:'LinnDrum', mrk2:'MRK-2', 'paint-can-808':'Paint-can 808', pearl:'Pearl', percussion:'Percussion', sc8850:'SC-8850', snares:'Snares', 'trap-808':'Trap 808', 'tube-808':'Tube 808', 'volca-modular':'Volca modular' };
const groupName = (packId, groupId) => {
  if (packId === 'sonic-pi' && sonicGroups[groupId]) return sonicGroups[groupId];
  if (packId === '0x808' && machineGroups[groupId]) return machineGroups[groupId];
  return title(groupId.split('/').join(' · '));
};
const packs = new Map();
for (const file of files) {
  const packId = file.parts[0] || 'factory';
  const rest = file.parts.slice(1);
  const stem = file.filename.replace(/\.[^.]+$/, '');
  const groupId = rest.length ? rest.join('/') : (packId === 'sonic-pi' ? stem.split('_')[0] : 'sounds');
  if (!packs.has(packId)) packs.set(packId, new Map());
  const groups = packs.get(packId);
  if (!groups.has(groupId)) groups.set(groupId, []);
  groups.get(groupId).push({ name:title(stem), url:`/sounds/${file.path}` });
}

const featuredUrls = ['0x808/909/kick-2.wav','stargate/karoryfer/snares/snare_Pearl_alumunum_14x8.wav','stargate/karoryfer/hihats/hihat_BRD_tight.wav','0x808/808-synth/808-sub-kick-long.wav','stargate/fugue-state-audio/drums/kicks/synthkit-kick.wav','0x808/linndrum/snare-h.wav','sonic-pi/tbd_pad_1.flac','sonic-pi/arovane_beat_a.flac'];
const byPath = new Map(files.map(file => [file.path, { name:title(file.filename.replace(/\.[^.]+$/, '')), url:`/sounds/${file.path}` }]));
const djToolsPack = {
  id: 'dj-tools',
  name: 'DJ Tools & Scratches',
  license: 'CC0',
  groups: [
    {
      id: 'scratches',
      name: 'Vinyl Scratches & FX',
      sounds: [
        { name: 'Vinyl Scratch', url: '/sounds/sonic-pi/vinyl_scratch.flac' },
        { name: 'Vinyl Backspin', url: '/sounds/sonic-pi/vinyl_backspin.flac' },
        { name: 'Vinyl Rewind', url: '/sounds/sonic-pi/vinyl_rewind.flac' },
        { name: 'Vinyl Hiss Crackle', url: '/sounds/sonic-pi/vinyl_hiss.flac' }
      ]
    },
    {
      id: 'drops',
      name: 'Vocal Drops & Hype',
      sounds: [
        { name: 'Life Goes On (Melodic Hook)', url: '/sounds/stargate/microlag/One-Shots/Vocals/Life_Goes_On.wav' },
        { name: 'Fantastic (Smooth Lead)', url: '/sounds/stargate/microlag/One-Shots/Vocals/Fantastic.wav' },
        { name: 'December (R&B Singing)', url: '/sounds/stargate/microlag/One-Shots/Vocals/December.wav' },
        { name: "I Hope It's Not Over (Refrain)", url: "/sounds/stargate/microlag/One-Shots/Vocals/I_Hope_It's_Not_Over.wav" },
        { name: "One Two Three Let's Go (Hype)", url: "/sounds/stargate/microlag/One-Shots/Vocals/One_Two_Three_Let's_Go.wav" },
        { name: 'Check This Out (DJ Drop)', url: '/sounds/stargate/microlag/One-Shots/Vocals/Vocal_Check_This_Out.wav' },
        { name: 'Word Up (DJ Shout)', url: '/sounds/stargate/microlag/One-Shots/Vocals/Word_Up.wav' },
        { name: 'Praise The Lord (Gospel Hook)', url: '/sounds/stargate/microlag/One-Shots/Vocals/Praise_The_Lord.wav' },
        { name: "That's Insane (Energy Shout)", url: "/sounds/stargate/microlag/One-Shots/Vocals/That's_Insane.wav" },
        { name: 'Pretty Cool (Chill Phrase)', url: '/sounds/stargate/microlag/One-Shots/Vocals/Pretty_Cool.wav' },
        { name: 'Excuse Me (Transition)', url: '/sounds/stargate/microlag/One-Shots/Vocals/Excuse_Me.wav' },
        { name: 'Shine Muscat (Catchphrase)', url: '/sounds/stargate/microlag/One-Shots/Vocals/Shine_Muscat_Is_Bussin.wav' }
      ]
    },
    {
      id: 'breakbeats',
      name: 'Classic Breakbeats',
      sounds: [
        { name: 'Loop Amen Break', url: '/sounds/sonic-pi/loop_amen.flac' },
        { name: 'Loop Amen Full', url: '/sounds/sonic-pi/loop_amen_full.flac' },
        { name: 'Loop Breakbeat Pocket', url: '/sounds/sonic-pi/loop_breakbeat.flac' }
      ]
    },
    {
      id: 'dj-fx',
      name: 'Sub Drops & Risers',
      sounds: [
        { name: 'Laser Drop FX', url: '/sounds/stargate/microlag/One-Shots/FX/Alien_Shotgun_G.wav' },
        { name: '808 Sub Drop Long', url: '/sounds/0x808/808-synth/808-sub-kick-long.wav' },
        { name: 'Riser Sweep', url: '/sounds/stargate/fugue-state-audio/synth-fx/whatsinthere.wav' },
        { name: 'Dark Woosh FX', url: '/sounds/sonic-pi/ambi_dark_woosh.flac' },
        { name: 'Ambi Swoosh', url: '/sounds/sonic-pi/ambi_swoosh.flac' }
      ]
    }
  ]
};
const result = [
  { id:'featured', name:'Featured', license:'CC0', groups:[{ id:'picks', name:'Start here', sounds:featuredUrls.map(url => byPath.get(url)).filter(Boolean) }] },
  djToolsPack
];
for (const [packId, groups] of packs) {
  result.push({ id:packId, name:packNames[packId] || title(packId), license:'CC0', groups:[...groups].map(([id,sounds]) => ({ id, name:groupName(packId, id), sounds:sounds.sort((a,b)=>a.name.localeCompare(b.name)) })).sort((a,b)=>a.name.localeCompare(b.name)) });
}

await writeFile(output, `${JSON.stringify({ count:files.length, packs:result })}\n`);
console.log(`BMAI catalog: ${files.length} sounds indexed in ${result.length} packs`);
