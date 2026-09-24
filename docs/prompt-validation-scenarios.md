# Prompt validation scenarios — Phase 2–5 & Music-Making Gaps

Updated: 2026-09-24

Evidence from implementation + automated unit test suite. Hardware listening / physical mic overdub alignment are explicitly identified as manual QA checks.

## Scenario matrix

| # | Scenario | Status | Evidence |
|---|---|---|---|
| 1 | Independent piano/pad/lead/bass/drums/layered vocals | **Implemented & Tested** | Schema v3 `tracks[]`; playlist `+ Lead/Bass/Pad/Audio`; mix strips follow tracks; core four retained. Unit: `playlist-tracks.test.mjs`, `music-making-gaps.test.mjs` |
| 2 | Eight-bar phrase copy + transpose + per-chord edits | **Implemented & Tested** | Piano multi-select + box-select + transpose ±1/±12; chord symbol inputs / duration dropdowns / reorder arrows; note copy/paste. Unit: `music-making-gaps.test.mjs` (E19, E20). |
| 3 | Record against backing with correct alignment | **Implemented (code path & notice)** | Vocals **Overdub** mode keeps playback; take clip placed at `recordStartBar`. Browser latency limitation notice displayed in recording UI. (Acoustic verification: Manual QA). |
| 4 | Two different vocal files in sections | **Implemented & Tested** | Section place chips + per-clip `audioTakeId`. Preserved non-destructively. |
| 5 | Split/move/trim/fade + gap/overlap | **Implemented & Tested** | Split/join/dup/delete; snap; non-destructive offset preservation. Unit: `music-making-gaps.test.mjs` (C13), `arrangement-engine.test.mjs`. |
| 6 | Section changes without losing manual edits | **Implemented & Tested** | `mergePlaylistPreservingEdits` + extras kept on rebuild; automation points survive. Unit: `arrangement-engine.test.mjs`. |
| 7 | Track FX + automation save/reopen | **Implemented & Tested** | Per-track insert FX chain (EQ/compress/filter, bypass/order) in `tracks[].fx`; continuous track automation envelopes; schema v3 snapshot. Unit: `music-making-gaps.test.mjs` (B6, B7). |
| 8 | Live vs WAV/stems/MIDI | **Implemented & Tested** | Shared `arrangement-engine.js`; range export; multi-track stem export for all user tracks; General MIDI percussion mapping for extra lanes. Unit: `music-making-gaps.test.mjs` (D14). |
| 9 | Undo/redo across gestures | **Implemented & Tested** | Unified `projectUndo` (50 deep) captures clip ops, mix/FX, recording placement, and note edits. |
| 10 | Meter + multi-bar pattern matrix | **Implemented & Tested** | Meter-aware transport; loop region; seek on ruler; pattern 1/2/4/8 bars for melody, bass, and drums. Unit: `music-making-gaps.test.mjs` (A3). |
| 11 | Drums/bass depth (velocity, choke, extra lanes) | **Implemented & Tested** | Per-hit velocity/nudge; dynamic lanes; choke groups (8ms ramp-down voice stealing); dedicated bass pattern bank & per-track patch stickiness. Unit: `music-making-gaps.test.mjs` (A1, A2, A3, A4, A5). |
| 12 | Delivery & True-Peak Reporting | **Implemented & Tested** | Peak CTRL honest labeling (soft clipper / safety limiter); 4x oversampled true-peak estimation report (BS.1770 / EBU R128). Unit: `music-making-gaps.test.mjs` (D18). |

## Tests run

```bash
node --test tests/arrangement-engine.test.mjs tests/project-format.test.mjs tests/project-storage.test.mjs tests/transport.test.mjs tests/playlist-tracks.test.mjs tests/music-making-gaps.test.mjs
```
Result: 40 tests passing (0 failures).

## Explicitly Still Manual / Hardware QA

The following items are hardware-dependent and cannot be truthfully validated via headless Node test runners; they require manual QA in a browser environment with physical audio interfaces:
1. **Microphone acoustic timing vs backing:** Roundtrip audio interface / soundcard buffer latency varies across OS and browser drivers. Verify overdub alignment with headphones on actual hardware.
2. **True-peak DAC ear check:** Inter-sample peaks estimated via 4x cubic Hermite oversampling; verify audible behavior against true analog DAC output under intentional 0 dBFS saturation.
3. **Physical WebMIDI hardware controller input:** Verify physical MIDI keyboard velocity sensitivity, pitch wheel, and note-on/note-off timing with actual hardware connected.
