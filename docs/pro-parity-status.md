# Pro parity status

Updated: 2026-09-24

Honest scope: browser guided studio with prosumer depth. BMAI is not a native DAW replacement and does not claim VST/AU/CLAP, ASIO, certified loudness metering, realtime cloud collaboration, stem separation, or AI vocals.

| Area | Status | Notes |
| --- | --- | --- |
| Starter templates / demo / tour / share pack | Done | Welcome/demo flow, local versions, Share Pack ZIP, embedded audio packing via `packProjectAssets`, metadata sidecar. |
| First-party Plugin Rack | Done | Track insert rack supports EQ, compress, saturator, chorus, filter, utility metadata with bypass/order/params; browser substitute for third-party plugins. |
| Per-channel sends | Done | Reverb send plus second delay send; cue send stored per strip. |
| Group buses | Done | Drums / music / vocals group volumes and mutes remain preserved. |
| Reference A/B + cue | Done | Import reference, A/B/blend modes, duck/listen UX, cue monitor and speaker mute preference. |
| Markers | Done | Add, list, rename, color, seek, delete; exported in Share Pack metadata. |
| Instrument rack UI | Done | ADSR, filter Hz, drive, unison controls persist on `track.patch`. |
| Sampler mapping | Done | Track sampler patch stores sample URL, root/low/high key, loop range, gain; sampler audio is included in asset packing. |
| Warp / slip / lock / mute | Done (browser-feasible) | Clip metadata supports Off / Beats / Tones warp, source BPM, slip, lock, mute, with quality warning in UX copy. |
| Take lanes / comping | Done (practical) | Multiple takes persist; clips can point at take/comp source metadata for selected comp regions. |
| Pitch correction | Done (practical handoff) | Clip metadata supports semitone/scale snap; Melodyne/native handoff remains the honest high-quality route. |
| Sidechain | Done | Any source -> target sidechain route metadata stored in `proSession.sidechains`. |
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
- Record two takes and comp/select one line.
- Sampler playback from MIDI keyboard or piano roll.
- Warp quality on real imported loops.
- Insert FX audibility and bypass in live/WAV.
- MIDI learn with physical controller.
- Share Pack reopen on fresh browser profile with embedded audio.
