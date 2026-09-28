# Prompt validation scenarios — Phase 2–5 & Music-Making Gaps

Updated: 2026-09-28

Evidence from implementation + automated unit test suite. Hardware listening / physical mic overdub alignment are explicitly identified as manual QA checks.

## Scenario matrix

| # | Scenario | Status | Evidence |
|---|---|---|---|
| 1 | Independent piano/pad/lead/bass/drums/layered vocals | **Implemented & Tested** | Schema v3 `tracks[]`; playlist `+ Lead/Bass/Pad/Audio`; mix strips follow tracks; core four retained. Unit: `playlist-tracks.test.mjs`, `music-making-gaps.test.mjs` |
| 2 | Eight-bar phrase copy + transpose + per-chord edits | **Implemented & Tested** | Piano multi-select + box-select + transpose ±1/±12; chord symbol inputs / duration dropdowns / reorder arrows; note copy/paste. Unit: `music-making-gaps.test.mjs` (E19, E20). |
| 3 | Record against backing with correct alignment | **Implemented (code path & notice)** | Overdub places the take at `recordStartBar` plus `proSession.latencyOffsetMs`. Calibrate writes that offset from a click/clap. Acoustic check remains manual. |
| 4 | Two different vocal files in sections | **Implemented & Tested** | Section place chips + per-clip `audioTakeId`. Preserved non-destructively. |
| 5 | Split/move/trim/fade + gap/overlap | **Implemented & Tested** | Split/join/dup/delete; snap; non-destructive offset preservation. Unit: `music-making-gaps.test.mjs` (C13), `arrangement-engine.test.mjs`. |
| 6 | Section changes without losing manual edits | **Implemented & Tested** | `mergePlaylistPreservingEdits` + extras kept on rebuild; automation points survive. Unit: `arrangement-engine.test.mjs`. |
| 7 | Track FX + automation save/reopen | **Implemented & Tested** | Inserts persist on `tracks[].fx` and run through `connectFxChain` in live playback and `renderAudioWav`. EQ energy, bypass, utility silence, mute, solo, and automation gain: `tests/track-fx-graph.test.mjs`. Envelope persistence: `music-making-gaps.test.mjs` (B6, B7). |
| 8 | Live vs WAV/stems/MIDI | **Implemented & Tested** | Live and offline export share `arrangement-engine.js` and `connectFxChain`. Share Pack ZIP includes aligned stem WAVs. MIDI mapping: `music-making-gaps.test.mjs` (D14). A full sample-by-sample live-versus-WAV identity check is still a listening pass, not a Node claim. |
| 9 | Undo/redo across gestures | **Implemented & Tested** | Unified `projectUndo` (50 deep) captures clip ops, mix/FX, recording placement, and note edits. |
| 10 | Meter + multi-bar pattern matrix | **Implemented & Tested** | Meter-aware transport; loop region; seek on ruler; pattern 1/2/4/8 bars for melody, bass, and drums. Unit: `music-making-gaps.test.mjs` (A3). |
| 11 | Drums/bass depth (velocity, choke, extra lanes) | **Implemented & Tested** | Per-hit velocity/nudge; dynamic lanes; choke groups (8ms ramp-down voice stealing); dedicated bass pattern bank & per-track patch stickiness. Unit: `music-making-gaps.test.mjs` (A1, A2, A3, A4, A5). |
| 12 | Delivery & True-Peak Reporting | **Implemented & Tested** | Peak CTRL honest labeling (soft clipper / safety limiter); 4x oversampled true-peak estimation report (BS.1770 / EBU R128). Unit: `music-making-gaps.test.mjs` (D18). |

## Tests run

```bash
npm test
```

## Explicitly Still Manual / Hardware QA

The following items are hardware-dependent and cannot be truthfully validated via headless Node test runners; they require manual QA in a browser environment with physical audio interfaces:
1. **Microphone acoustic timing vs backing:** Roundtrip audio interface / soundcard buffer latency varies across OS and browser drivers. Verify overdub alignment with headphones on actual hardware.
2. **True-peak DAC ear check:** Inter-sample peaks estimated via 4x cubic Hermite oversampling; verify audible behavior against true analog DAC output under intentional 0 dBFS saturation.
3. **Physical WebMIDI hardware controller input:** Verify physical MIDI keyboard velocity sensitivity, pitch wheel, and note-on/note-off timing with actual hardware connected.
