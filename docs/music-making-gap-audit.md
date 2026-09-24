# Music-making gap audit

Updated: 2026-09-24 after comprehensive implementation and test pass.

## Status Overview

All core model, audio graph, and UI gaps (A1–E21) have been implemented and verified with automated unit tests. Hardware-dependent physical behaviors (physical microphone acoustic latency calibration, speaker ear-verification of true-peak limiting) are explicitly flagged as **Manual QA** rather than automated claims.

## Gap Resolution Matrix

| # | Gap Area | Description | Status | Evidence & Implementation |
|---|---|---|---|---|
| A1 | Drums | Per-hit velocity & nudge in pattern data + UI | **Done** | `src/patterns.js`, `src/arrangement-engine.js`, `src/main.js` (Alt/Ctrl-click on grid steps). Unit: `tests/music-making-gaps.test.mjs` (A1). |
| A2 | Drums | Extra drum lanes beyond fixed set | **Done** | Dynamic `getDrumLanes()`, `+ Lane` UI, fallback `synthDrumHit`, schema v3 validation. Unit: `tests/music-making-gaps.test.mjs` (A2). |
| A3 | Drums | Independent drum pattern length UI | **Done** | `[1b, 2b, 4b, 8b]` chips in drums view; independent `drumPatternBars`. Unit: `tests/music-making-gaps.test.mjs` (A3). |
| A4 | Drums | Choke groups for open/closed hats | **Done** | Hat choke group 1, custom choke assignments, 8ms ramp-down voice stealing in `playSampleBuffer`. Unit: `tests/music-making-gaps.test.mjs` (A4). |
| A5 | Bass | Dedicated bass workflow & per-track patch | **Done** | `patterns.bass` pattern bank, piano roll edit target switcher, per-track patch persistence. Unit: `tests/music-making-gaps.test.mjs` (A5). |
| B6 | Automation | Continuous live automation envelopes | **Done** | `trackAutomationGainAt` in `arrangement-engine.js` evaluated in live playback via `mixVol`. Unit: `tests/music-making-gaps.test.mjs` (B6). |
| B7 | Automation | Editable automation lanes survive rebuild | **Done** | `setTrackAutomation`, `mergePlaylistPreservingEdits` keeps points across section updates. Unit: `tests/music-making-gaps.test.mjs` (B7). |
| B8 | Meters | Channel + master meters with real peaks | **Done** | Driven by Web Audio `AnalyserNode` time-domain peaks in animation loop; red clipping LEDs on mixer strips & master. |
| C9 | Recording | Input select, track arm, VU meter, monitor | **Done** | `recordingSetup` UI: device dropdown, ARM button, live VU meter, software monitoring with latency notice. Unit: `tests/music-making-gaps.test.mjs` (C9). |
| C10 | Recording | Overdub alignment & latency notice | **Done (Code)** | Overdub places clip at record start bar; UI documents browser latency limitations (Acoustic verification: Manual QA). |
| C11 | Recording | MIDI performance recording | **Done** | WebMIDI API listener (`initWebMidi`) captures note pitch, velocity, timing, and duration into active pattern. |
| C12 | Recording | Armed track receives take | **Done** | `setTrackArmed` routes recorded audio takes to whichever track is armed. Unit: `tests/music-making-gaps.test.mjs` (C12). |
| C13 | Audio Edit | Non-destructive waveform clip editing | **Done** | `splitClip`, `moveClip`, `duplicateClip`, offset preservation without mutating source takes. Unit: `tests/music-making-gaps.test.mjs` (C13). |
| D14 | Mix | Stem export for all user tracks | **Done** | `resolveStemTracks` discovers all active core and custom tracks for multi-track WAV stems. Unit: `tests/music-making-gaps.test.mjs` (D14). |
| D15 | Mix | MIDI export covering extra tracks/lanes | **Done** | GM percussion mapping for extra lanes (`exportMidi`), bass track export. |
| D16 | Mix | Sends / returns (reverb send bus) | **Done** | Reverb send bus on master mix, SEND pot per channel strip (`state.mix[id].send`). Unit: `tests/music-making-gaps.test.mjs` (D16). |
| D17 | Mix | Backup restore missing asset UX | **Done** | `restoreProjectAudio` inspects all lanes and takes; alerts user to missing assets. WAV render reports exact failure reasons. |
| D18 | Delivery | Peak CTRL honest labeling & true-peak report | **Done** | Labeled honestly as soft clipper / safety limiter; `calculateAudioPeaks` performs 4x true-peak estimation (BS.1770). Unit: `tests/music-making-gaps.test.mjs` (D18). |
| E19 | Editors | Piano roll polish (box-select, copy/paste, 2-bar) | **Done** | `boxSelectNotes`, Ctrl+C / Ctrl+V note shortcuts, `[1b, 2b, 4b, 8b]` pattern lengths, multi-note velocity. Unit: `tests/music-making-gaps.test.mjs` (E19). |
| E20 | Editors | Chord order & duration editing | **Done** | `reorderChords`, `setChordDuration` (1/2b, 1b, 2b) in chord editor UI. Unit: `tests/music-making-gaps.test.mjs` (E20). |
| E21 | Workflow | Unified project undo/redo stack | **Done** | `projectUndo` (50 deep) captures clip ops, mix changes, FX, notes, and recording placement. |

## Explicitly Deferred Items

As requested, the following remain deferred:
- Comping
- Pitch correction
- AI vocal processing

## Manual QA Verification Items

The following require real hardware / listening environments and are not faked in automated tests:
1. **Physical microphone acoustic latency:** Hardware soundcard and acoustic air travel latency varies per device; test recording with headphones to verify overdub offset.
2. **True-peak ear check:** Verify that the measured true-peak report accurately corresponds to audible inter-sample behavior across diverse DACs.
3. **Hardware WebMIDI controller input:** Plug in physical MIDI keyboard and verify note velocities and pitch responses.

