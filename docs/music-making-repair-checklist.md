# Music-making repair checklist

Updated: 2026-09-24 (Comprehensive Gaps A–E Implementation)

## Phase 1 — musical correctness

| Requirement | Status | Evidence |
| --- | --- | --- |
| Vocal clips use their own take audio | **Implemented** | Shared take buffer resolution |
| Zero take gain = silence | **Implemented + tested** | `arrangement-engine.test.mjs` |
| Timeline gaps / overlaps | **Implemented + tested** | `arrangement-engine.test.mjs` |
| Section rebuild preserves edits | **Implemented + tested** | `mergePlaylistPreservingEdits` |
| Multi-bar chords / shared live-WAV-MIDI | **Implemented** | `arrangement-engine.js` |
| Meter-aware metro / count-in | **Implemented** | `beatsPerBar` |
| Note-drag undo / limiter honesty | **Implemented** | history on pointerdown; Peak CTRL label |

## Phase 2 — tracks / transport / arrangement

| Requirement | Status | Notes |
| --- | --- | --- |
| Independent audio/instrument tracks | **Implemented** | Schema v3 `tracks`; add/dup/delete/rename/reorder; per-track mix + patch defaults |
| Pause / stop / seek / loop region | **Implemented** | Pause keeps playhead; seek on ruler; loop toggle + wrap |
| Zoom / rulers / snap / multi-clip ops | **Implemented** | Zoom ±; snap select; split/join/copy/paste/dup/delete |
| Preserve arrangement across save | **Implemented** | schemaVersion 3 |

## Phase 3 — editors & drums / bass depth

| Requirement | Status | Notes |
| --- | --- | --- |
| Piano multi-select / box-select / copy-paste | **Implemented + tested** | Shift-select; `boxSelectNotes`; Ctrl+C / Ctrl+V; ±1/±12; 2-bar flexible lengths |
| Chord symbol editor & duration/order | **Implemented + tested** | Editable inputs; `setChordDuration`; `reorderChords`; convert to MIDI |
| Drums depth: velocity, nudge, choke groups, extra lanes, independent length | **Implemented + tested** | Per-hit velocity & nudge; hat choke group 8ms ramp-down voice stealing; dynamic lanes (+Lane); independent `[1b, 2b, 4b, 8b]` |
| Dedicated bass workflow | **Implemented + tested** | Dedicated `patterns.bass` pattern bank; editor target switch in melody stage; per-track patch stickiness |

## Phase 4 — recording / audio

| Requirement | Status | Notes |
| --- | --- | --- |
| Input device select, track arm, level meter, software monitor | **Implemented + tested** | Device selector; track ARM; Web Audio `AnalyserNode` input meter; monitoring toggle with latency disclaimer |
| Overdub placement & alignment disclaimer | **Implemented (code)** | Overdub mode; clip at record start bar; latency disclaimer (acoustic check: manual QA) |
| WebMIDI performance recording | **Implemented** | WebMIDI listener records live velocity, timing, and note durations into active pattern |
| Non-destructive waveform clip editing | **Implemented + tested** | Precise trim/split/move/dup/fades preserving source take offsets |

## Phase 5 — mix / delivery

| Requirement | Status | Notes |
| --- | --- | --- |
| Continuous live automation envelopes & lanes | **Implemented + tested** | `trackAutomationGainAt` evaluated in `mixVol`; survives rebuild |
| Channel & master meters with clipping feedback | **Implemented** | Driven by real `AnalyserNode` time-domain peaks; red clipping LEDs |
| Multi-track stem export for all user tracks | **Implemented + tested** | `resolveStemTracks` discovers core and user custom tracks |
| MIDI export covering extra tracks & lanes | **Implemented** | GM percussion mapping for extra lanes; dedicated bass track |
| Reverb sends / returns | **Implemented + tested** | Master reverb send bus; SEND pot per channel strip |
| Honest Peak CTRL & True-Peak Report | **Implemented + tested** | Soft clipper / safety limiter label; 4x true-peak estimation report (BS.1770) |
| Unified undo/redo stack | **Implemented** | 50-step `projectUndo` capturing clips, mix, FX, notes, and takes |

## Validation

See [prompt-validation-scenarios.md](./prompt-validation-scenarios.md) and [music-making-gap-audit.md](./music-making-gap-audit.md).

## Tests

```bash
node --test tests/arrangement-engine.test.mjs tests/project-format.test.mjs tests/project-storage.test.mjs tests/transport.test.mjs tests/playlist-tracks.test.mjs tests/music-making-gaps.test.mjs
```
All 40 unit tests passing cleanly.
