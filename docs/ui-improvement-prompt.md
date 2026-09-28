# BMAI UI improvement brief

## Implementation prompt

Improve the first-run path for a beginner producer. Let them describe a short beat idea, show which supported cues BMAI recognized, and create a playable editable starter that opens directly in Studio. Translate only explicit cues the local rule-based generator supports, such as kit/style, mood, sparse or busy density, low or high register, variation, BPM, and a named key. Keep the mapping visible and let the user override tempo, key, and kit. Do not describe this as AI or imply that arbitrary prose is understood. Preserve the existing starter templates and demo path.

Keep selection, playback, and editing states clear. Remove or relabel controls that only store preferences and have no audible effect. Clearly identify deferred features. Keep the first screen short, keyboard-friendly, usable on narrow screens, and consistent with the monochrome studio visual style.

## Local UI audit

| Area | Current status | Suggested next work |
| --- | --- | --- |
| First-run starter | Welcome overlay had demo and studio buttons; a `generateStarter()` path existed without visible prompt fields. | Expose the prompt, show supported matches, and start the resulting project in Studio. |
| Vocal inspector | Retune and Humanize sliders only saved local preference values; pitch correction is documented as deferred. | Removed these misleading sliders and show the current limitation. |
| Take lanes | Multiple takes persist and users can select one, but there is no comping editor. | Keep take selection clear; consider comping only after timeline editing is validated. |
| Clip editing | Playlist supports selection, move, resize, split, join, duplicate, delete, and basic fades/automation. | Make selected clip details easier to find and inspect in context. |
| Library | Search, packs, groups, favorites, recents, lane assignment, and musical preview controls exist. | Add keyboard audition and a persistent preview player; improve direct placement onto a focused track. |
| Warp / tuning / custom routing | Some values are stored as DAW handoff metadata; the corresponding processing is not available in BMAI. | Keep those controls labeled as handoff-only; avoid presenting them as active DSP. |

## Research notes

- Ableton's browser supports preview and direct loading into the selected track. Its Clip View keeps selected clip content and relevant properties together. [Browser guide](https://www.ableton.com/en/live-manual/12/working-with-the-browser/), [Clip View guide](https://www.ableton.com/en/manual/clip-view/).
- Suno Studio's library has search/filter, keyboard audition, a persistent mini-player, and drag-to-timeline placement. Its editor describes direct timeline split/disable actions and take lanes. [Library guide](https://help.suno.com/en/articles/13670849), [Clip editing guide](https://help.suno.com/en/articles/13670977), [Studio 2.0 guide](https://help.suno.com/en/articles/13670529).

These are workflow references, not a request to copy proprietary visual design or to match the feature scope of a full DAW.

## Studio consistency pass

- Removed the duplicate editor destinations from the global sidebar while Studio is open; its mode bar is now the single place to switch between arrange, melody, drums, chords, vocals, and mixer.
- Applied one panel hierarchy to the Browser, Playlist, Inspector, and bottom dock, and brought the desktop toolbar into a consistent row with horizontal overflow when space is tight.
- Restored track identity with restrained track-color accents on playlist labels, clips, and the focused track state, while keeping the surrounding UI monochrome.
- On narrow screens, keep the timeline first and stack the Browser and Inspector after it.
- Kept Browser, work area, and Inspector mounted while switching between Arrange and focused editors, so mode changes retain song context.
- Added an empty-song next step and made Draw place the active drum, melody, bass, or chord pattern on an empty compatible lane at the current snap position. Audio lanes still require an imported take.
- Renamed playlist action groups to describe their contents and fixed the source-pattern label mapping for bass and pad tracks.

The playlist now has a direct pattern-to-song action, but this is an initial workflow improvement. Before calling the editor FL Studio-like, the next pass should validate note placement and piano-roll editing, selected-clip properties, and the arrangement-to-pattern edit loop in a running browser session.
