# BMAI: DAW market comparison and product priorities

Research snapshot: September 22, 2026. Competitor claims below were checked against official product pages and help documentation on this date. They describe advertised capabilities, not an independent assessment of audio quality. Subscription, edition, hardware, and platform restrictions can apply. No claim is made that a feature originated in 2026 merely because it appears on a current page.

The BMAI baseline is a source review of `src/main.js` before improvements made during this review. References use function names so they survive line-number changes. Recommendations and positioning are analysis, not verified demand or customer research.

## Recommendation

BMAI has a useful starting point as a guided beat sketchpad: choose an idea, edit individual musical parts, record a vocal, and export to a larger production workflow. Its strongest opportunity is to make that path fast, understandable, and dependable. Completing that path is a better near-term investment than trying to reproduce the full feature set of a desktop DAW.

The working product promise should be: **Create an editable beat, shape a short arrangement, record a hook, and reopen or export everything reliably.** Validate this promise with beginner producers and vocalists before broadening the scope.

## What BMAI already implements

| Area | Observed implementation | Relevant limitation |
| --- | --- | --- |
| Musical starting points | Four melody drafts, scale-based note generation, genre drum kits, preset chord progressions | `buildMelodyPhrase` and `generateDrums` use rules and randomness. `generateChords` selects a preset. These are not evidence of a prompt-understanding AI model. |
| Editing | Piano-roll note placement/movement/resizing, drum steps and rolls, instrument choices, key and tempo controls | Core melody and drum patterns use a 16-step loop. A general multitrack clip editor is absent from the reviewed implementation. |
| Arrangement | Intro/Verse/Hook/Outro sections with bar counts and track activation | Sections refer to the same global musical parts; they do not hold independent verse/hook melodies, drum patterns, or vocal clips. |
| Recording | Microphone capture, recording setup/count-in, uploaded audio, waveform display, vocal processing presets | One current vocal source; no take lanes, comping, or general vocal-region placement/editing. |
| Mixing | Four part faders/mutes, drum lane volume/pan, master EQ/filter/reverb/delay, limiter and kick ducking controls | No general automation lanes or freely configurable per-track processing/routing. DSP accuracy requires separate validation. |
| Project storage | Project list and snapshots in `localStorage`; JSON import/export | Recorded vocals are represented by temporary blob URLs in the reviewed code. Durable media storage, version restoration, and storage-failure handling need attention. |
| Handoff | Master WAV, separate stem WAVs, MIDI, and JSON export code | The existence of export code does not establish playback/render equivalence or round-trip fidelity. Verify these explicitly. |
| Creative guidance | Beat analysis and suggested fixes; melody and drum-specific histories | No shared undo/redo history covering all project actions. Suggested fixes should remain audible, explainable, and reversible. |

Code anchors: `state`, `buildMelodyPhrase`, `generateDrums`, `generateChords`, `generateVocals`, `arrangement`, `projectSnapshot`, `saveProject`, `stageVocals`, `stageMix`, `renderAudioWav`, `exportMidi`, `beginVocalCapture`, `pushDrumHistory`.

## Competitor feature matrix

| Product | Verified advertised capabilities relevant to BMAI | Gap or lesson for BMAI |
| --- | --- | --- |
| Ableton Live 12 | MIDI generators accept constraints; MIDI transformations reshape existing notes; scale-aware editing, sound similarity search, sample audition in project key/tempo, and stem separation in Suite. [Official features](https://www.ableton.com/en/live/all-new-features/) | Add meaningful controls over variations, preserving notes the user likes. Improve auditioning in musical context. Stem separation is a later expansion. |
| FL Studio | Pattern sequencing, piano roll, a clip/pattern Playlist, recording and audio editing, mixer routing, and instrument/effect hosting. Its chord tool can preserve selected chords while replacing others. [Official features](https://www.image-line.com/fl-studio/features), [Chord Progression manual](https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/pianoroll_chordprogression.htm) | Patterns need to become reusable song building blocks. Copy/duplicate, partial regeneration, and section variation matter more than adding more preset buttons. |
| Logic Pro | Session Players follow a Chord Track and respond to musical controls. Apple also advertises Chord ID, Stem Splitter, Mastering Assistant, Smart Tempo, pitch correction, and comping. [Official product page](https://www.apple.com/logic-pro/) | Generate bass, harmony, and melody in shared musical context. Make recorded material fit the arrangement through placement and editing before attempting advanced automatic correction. |
| BandLab | Cloud-synced projects, MIDI editing, automation, project revision history, SongStarter ideas, and Splitter with audio/MIDI handoff. [Studio guide](https://blog.bandlab.com/studio-faq/), [Project history](https://help.bandlab.com/hc/en-us/articles/4402292152857-Navigating-the-Project-Page), [AI tools](https://blog.bandlab.com/bandlab-ai-tools-best-ai-music-generator/), [Splitter help](https://help.bandlab.com/hc/en-us/articles/16560236938777-Using-BandLab-Splitter) | Browser users can already expect saved work, reversibility, editable suggestions, and sharing. BMAI must offer a clearer focused workflow rather than relying on browser access or generation alone. |
| Soundtrap | Browser recording, MIDI editing, a sampler/beatmaker, live collaboration, project comments, cloud autosave, vocal tuning, and automation. Restoration and some production features depend on plan; automation is unavailable on mobile according to its help page. [Product page](https://www.soundtrap.com/), [Automation help](https://support.soundtrap.com/hc/en-us/articles/205662071-How-to-Use-Track-Automations-in-Soundtrap), [Version restoration](https://support.soundtrap.com/hc/en-us/articles/115002725805-How-to-Restore-Previous-Project-Versions-in-Soundtrap) | Reliable saving is foundational. Lightweight volume/filter automation and asynchronous sharing could extend a dependable core; real-time collaboration can wait. |
| Suno Studio | Browser multitrack arrangement/editing, audio recording, stem extraction, and generated instrumental parts within an existing song. Official export help describes WAV mix/range/multitrack export and MIDI from extracted stems. Studio requires Premier according to the introduction. [Studio introduction](https://help.suno.com/en/articles/7940161), [Export help](https://help.suno.com/en/articles/13925249) | Editable output and DAW handoff already exist in an AI-oriented competitor. BMAI's proposed distinction should be understandable note-level control and a guided workflow, not an unsupported claim that editable AI music is unique. |

The recurring pattern in these sources is assistance integrated with editing. **Product inference:** a generator becomes useful when a musician can keep a good phrase, change a specific part, compare alternatives, and continue working without losing control.

## Prioritized improvements

| Priority | Improvement | Smallest useful scope | Proposed acceptance check |
| --- | --- | --- | --- |
| P0 | Durable project and media recovery | Persist imported/recorded audio alongside versioned project data; expose save errors; package media with project export | Record a vocal, close the page, reopen, and hear the same take. Transfer an exported project to a fresh browser profile and recover all parts. |
| P0 | Trustworthy playback and exports | Share scheduling/render definitions where practical; validate instrument, pan, swing, rolls, effects, section timing, and vocal offsets | A fixture project renders every expected event at the expected time; preview and export agree on arrangement and processing. Imported MIDI has correct tempo and note lengths. |
| P0 | Honest, usable guidance | Describe procedural ideas accurately; ensure the prompt's advertised effect matches implementation; keep clear preview/commit states | Users can predict what Generate, Preview, Use this, and Undo will change. No control silently overwrites an unrelated part. |
| P1 | Project-wide undo/redo | One bounded action history across melody, drums, chords, mix, sections, and media assignments | A musician can undo five different types of edits in reverse order, redo them, and save the restored state. |
| P1 | Real song variation | Named patterns or clips; duplicate a section; edit a copy independently; reorder sections | Changing the hook drums leaves the verse unchanged. A short song exports with all section variations intact. |
| P1 | Better note and groove control | Note velocity, selected-note operations, duplicate, useful quantize/snap choices, multi-bar patterns | A producer can create and humanize a four-bar phrase without regenerating the whole idea. |
| P1 | Constrained generation | Lock a lane or selected notes; expose density, variation, register, and section energy; retain seed/version for comparison | “Keep the kick, vary the hats” changes only hats. Bass and melody suggestions honor the chosen key and chord context. |
| P1 | Usable vocal takes | Keep multiple takes; choose one; trim start/end; set placement and gain | A singer can keep a good take while trying another and place it once in the hook rather than retriggering it every loop. |
| P2 | Targeted mixing and automation | Track solo, useful meters, per-track pan, simple volume/filter curves | A transition or fade plays and exports consistently; a muted or soloed part behaves predictably. |
| P2 | Faster sound selection | Favorites, recent sounds, tags, musical-context preview, auditable asset metadata | A user finds and swaps a suitable sound without disrupting playback or losing the original choice. |
| P2 | Project handoff and sharing | Self-contained project file; one stem archive with aligned files and metadata; optional read-only preview link later | Another producer can import the stems at the same start point and reconstruct tempo/key/section intent. |

P0 means a release blocker for trusting the core workflow; P1 means the next useful product increment; P2 means expansion after the core path is validated. These are recommended priorities, not estimated delivery dates.

## Boundaries for the next MVP iteration

Defer native plugin hosting, a large social network, live multiuser editing, a large proprietary sample marketplace, automatic mastering, and a full stem-separation service. Each adds substantial surface area before it proves the core value of the current product. Prefer a narrow, measured implementation over marketing claims about professional mastering quality.

If a model-backed assistant is introduced, have it propose structured musical edits that pass validation before being applied. Return notes, rhythms, chords, and parameters that the user can inspect. Start with one well-defined task such as producing a hook variation while preserving locked parts. Evaluate musical usefulness, latency, cost per accepted suggestion, and undo behavior before expanding.

## Validation before committing to the roadmap

Run a small observed pilot with the intended audience. Ask each participant to start a beat, make a meaningful edit, create a verse/hook difference, record or import a vocal, reopen the project, and export it. Track task completion, time to first useful loop, suggestions kept, export/reopen failures, and where the user becomes confused. These proposed measures establish whether BMAI's focused workflow is valuable; competitor feature lists cannot establish that by themselves.

This research does not establish comparative audio quality, model quality, pricing advantage, legal rights to third-party samples, or real-world performance. Those require targeted verification rather than extrapolation from product pages.
