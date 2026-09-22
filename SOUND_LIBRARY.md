# BMAI factory sound library

This project bundles samples only when the license allows redistribution inside the application. CC0 and public-domain recordings are included. Packs that are only “free for your music” (Splice, Loopmasters, 99Sounds, Goldbaby, and most trap kits) are not, because that does not allow shipping the files inside an app.

## What is bundled

700 production-focused sounds, about 306 MB.

| Pack | Sounds | License | Why it is here |
| --- | --- | --- | --- |
| Drum machines (`public/sounds/0x808`) | 169 | CC0 1.0 | Classic machines already in the app: TR-808, TR-909, TR-505, LinnDrum, CR-78, trap 808, and more. Source: https://github.com/averagenative/0x808 |
| Soulful starter kit | 4 | CC0 1.0 | The default drum-track kit. Source: https://github.com/Boochi44/free-drum-samples |
| Sonic Pi factory (`public/sounds/sonic-pi`) | 181 | CC0 1.0 | Curated DAW material: bass, drums, breaks, pads, ambience, guitar, tabla and rhythmic glitch. Phone, robot, bleep and novelty effects are excluded from the live library. Source: https://github.com/sonic-pi-net/sonic-pi (`etc/samples`) |
| Stargate DAW pack (`public/sounds/stargate`) | 346 | CC0 1.0 | Built so a DAW can redistribute it. Acoustic and electronic kits (Karoryfer, Freesound), Versilian Community percussion, loops, guitar FX, and long synth textures. Source: https://github.com/stargatedaw/stargate-sample-pack |

`public/sounds/catalog.json` is the index the sound library reads. `npm run dev` and `npm run build` regenerate it with `scripts/generate-sound-catalog.mjs`.

## Where stronger sounds live, and what was left out

The highest-quality orchestral and acoustic recordings that are actually CC0 are Versilian’s VSCO 2 Community Edition (about 3 GB) and the Versilian Community Sample Library (about 5 GB):

- https://versilian-studios.com/vsco-community/
- https://versilian-studios.com/vcsl/

A playable Versilian percussion subset already ships inside the Stargate pack. The full libraries are too large for this web app.

Do not import TidalCycles Dirt-Samples. They are widely used, but the repository does not have a clean license for every file. Use Clean-Samples only after checking each pack’s metadata.

## Playback

The sound library can preview every bundled file. These session kits also drive the drum track:

- Soulful — the original starter kit
- House, Electro, and Drum & bass — Sonic Pi one-shots
