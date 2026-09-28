# Demo readiness

Updated: 2026-09-28

## 5-10 minute script

1. Open app, load demo project or a starter template. Music should play within 30 seconds.
2. Press Space, switch Song mode, scrub/seek the playlist ruler, and launch a Scene.
3. Open Mix, move SEND, DLY, and a group bus; bypass an insert.
4. Import a reference, toggle A Master / B Reference / Blend.
5. Record two takes, select one, and place it on the arrangement; comping is not implemented. Show latency/punch honesty.
6. Load a sampler sample and play it from piano/MIDI.
7. Import one MIDI file and one stem WAV.
8. Export Share Pack; show `metadata.json`, project JSON, master WAV, `stems/`, and the Ableton/FL/Logic section in the README.
9. Open Help / `?` and show shortcuts.

## Must say honestly

- No third-party VST/AU/CLAP or ASIO in the browser.
- LUFS/true-peak is approximate and not certified BS.1770.
- Cloud/realtime collab is deferred; Share Pack is offline-first.
- AI vocals, AI stem split, and an AI SongStarter model are not in the product. New phrases follow key, style, and chords.
- Warp, pitch correction, and custom sidechain routes are handoff notes. Kick duck and track inserts are in the audio.

## Current verification

- `npm test` passes 63 tests.
- `npm run build` succeeds.
- Production bundle is split into logical chunks, eliminating the previous large-single-chunk warning for a cleaner demo handoff.
