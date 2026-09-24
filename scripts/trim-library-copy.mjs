import { readFile, writeFile } from 'node:fs/promises';
let source = await readFile('src/main.js', 'utf8');
const replacements = [
  ['CURATED FACTORY LIBRARY', 'LIBRARY'],
  ['<p>Production-ready drums, basses, loops and textures. Preview any sound or load a beat kit.</p>', ''],
  ['<div class="sources-intro"><h3>Download free packs, scratches, and instruments</h3><p>Grab a royalty-free pack, then drop the wav or mp3 onto a drum lane, or pick Guitar, Strings, Organ, Flute, or Grand Piano in the piano roll.</p></div>', '<div class="sources-intro"><h3>Free sources</h3></div>'],
  ['Factory Sounds &amp; Kits', 'Sounds'],
  ['Free Public Sources', 'Sources']
];
for (const [from, to] of replacements) {
  if (!source.includes(from)) throw new Error(`Missing: ${from.slice(0, 80)}`);
  source = source.replace(from, to);
}
source = source.replace(/ style="background:#2d1b38;color:#ff9bd8;"/g, '');
await writeFile('src/main.js', source);
console.log('trimmed');
