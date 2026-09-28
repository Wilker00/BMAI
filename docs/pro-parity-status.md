# Pro parity status

Updated: 2026-09-28

Honest scope: browser guided studio with prosumer depth. BMAI is not a native DAW replacement and does not claim VST/AU/CLAP, ASIO, certified loudness metering, realtime cloud collaboration, stem separation, or AI vocals.

| Area | Status | Notes |
| --- | --- | --- |
| Starter templates / demo / tour / share pack | Done | Welcome/demo flow, local versions, Share Pack ZIP with master plus aligned stems, embedded audio packing via `packProjectAssets`, metadata sidecar, DAW open notes in the README. |
| First-party Plugin Rack | Done (audible) | EQ, compress, saturator, chorus, filter, and utility run in live playback and `renderAudioWav` through `src/track-fx-graph.js`. Bypass and order are audible. Not a VST host. |
| Per-channel sends | Done | SEND feeds the reverb bus. DLY feeds the delay bus. Cue remains a monitor preference. |
| Group buses | Done | Drums / music / vocals group volumes and mutes remain preserved. |
| Reference A/B + cue | Done | Import reference, A/B/blend modes, duck/listen UX, cue monitor and speaker mute preference. |
| Markers | Done | Add, list, rename, color, seek, delete; exported in Share Pack metadata. |
| Instrument rack UI | Done | ADSR, filter Hz, drive, unison controls persist on `track.patch`. |
| Sampler mapping | Done | Track sampler patch stores sample URL, root/low/high key, loop range, gain; sampler audio is included in asset packing. |
| Warp / slip / lock / mute | Handoff metadata | Clip fields can store warp mode, slip, lock, and mute. BMAI does not time-stretch. Finish warp in Ableton, FL, or Logic. |
| Take lanes / comping | Partial | Multiple takes persist and a clip can point at one take. There is no comping editor. |
| Pitch correction | Handoff metadata | Semitone / scale-snap fields can be stored on a clip. BMAI does not tune audio. |
| Sidechain | Partial | Kick duck (`state.sidechain`) is audible on chords and bass, live and in the WAV. Extra source-to-target routes in `proSession.sidechains` are saved for the DAW and are not a second ducker. |
| MIDI learn | Done | CC/note mapping metadata for vol/pan/send/mute/delay send. |
| Scenes | Done | Lightweight scene rows can launch section patterns. Playlist remains the main arrangement surface. |
| MIDI / stem import | Done | MIDI import creates a MIDI track/pattern; stem WAV import creates an aligned audio track. |
| LUFS + true-peak | Done (approx) | Export reports approximate LUFS/TP; explicitly not certified BS.1770. |
| Cloud publish / realtime collab | Deferred | Offline Share Pack and publish checklist instead; no fake URLs. |
| Bundle / runtime optimization | Done (polish) | Production build is chunk-split for a cleaner browser handoff and smaller initial payload. |
| VST / ASIO | Impossible in-browser | Settings/export copy directs users to FL/Logic/Ableton handoff. |
| AI SongStarter / stem split / AI vocals | Deferred | Not implemented unless separately requested. |

## Manual QA

- Cold open to template playback under 30 seconds.
- Audible send/group bus changes in Chrome.
- Reference A/B, cue monitor, and speaker mute behavior with headphones.
- Record two takes, run Calibrate, and confirm the next take uses the offset.
- Sampler playback from MIDI keyboard or piano roll.
- Insert EQ audibility and bypass in live playback and the exported WAV.
- MIDI learn with physical controller.
- Share Pack reopen on fresh browser profile with embedded audio.
