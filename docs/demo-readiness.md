# Demo readiness

Updated: 2026-09-24

## 5-10 minute script

1. Open app, load demo project or a starter template. Music should play within 30 seconds.
2. Press Space, switch Song mode, scrub/seek the playlist ruler, and launch a Scene.
3. Open Mix, move SEND, DLY, and a group bus; bypass an insert.
4. Import a reference, toggle A Master / B Reference / Blend.
5. Record two takes, select or comp one line, and show latency/punch honesty.
6. Load a sampler sample and play it from piano/MIDI.
7. Import one MIDI file and one stem WAV.
8. Export Share Pack; show `metadata.json`, project JSON, master WAV, and README.
9. Open Help / `?` and show shortcuts.

## Must say honestly

- No third-party VST/AU/CLAP or ASIO in the browser.
- LUFS/true-peak is approximate and not certified BS.1770.
- Cloud/realtime collab is deferred; Share Pack is offline-first.
- AI vocals, AI stem split, and AI SongStarter are deferred unless requested separately.

## Current verification

- `npm test` passes 51 tests.
- `npm run build` succeeds.
- Production bundle is split into logical chunks, eliminating the previous large-single-chunk warning for a cleaner demo handoff.
