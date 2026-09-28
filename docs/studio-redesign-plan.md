# BMAI Studio visual redesign plan

## Goal

Make the path from beat to song visible: create or choose a pattern, edit its notes or steps, place it in the arrangement, and refine a selected clip. The timeline must stay the main canvas. A producer should be able to see the active task and the next action without scanning three competing tool panels.

## Audit of the running app

Observed in the local demo project at a 1774 × 705 viewport on 28 September 2026. The reference capture is [studio-audit-current.png](studio-audit-current.png).

| Finding | Evidence in current UI | Consequence |
| --- | --- | --- |
| Core editor is below the visible area | The Studio Channel Rack begins near y=1212. `applyStudioLayout()` allocates another shell row for `#piano-section`; `.studio-page` also has a large minimum height and `.main-stage` hides overflow. | The beat editor can appear absent even though it rendered. |
| Four action bands compete | Global top bar, transport, Studio mode bar, and playlist toolbar each contain controls. | The timeline gets less height and the primary action is hard to spot. |
| Track selection appears twice | Playlist headers list tracks, and the Inspector lists every track again. | The right panel spends width on navigation rather than properties of the selected item. |
| Pattern actions repeat | Each pattern bank contains New, Dup, Unique, and a selected pattern chip. | The left Browser looks like a form instead of a source picker. |
| Clip content is hard to read | Clip names repeat across bars; a one bar label can wrap or truncate. | Sections and musical variation are difficult to scan. |
| Type and surfaces have little hierarchy | Most labels use tiny monospace text; nearly every group has its own dark border and box. | The screen feels dense even where space is available. |

## Reference patterns

- FL Studio makes the Channel Rack the pattern creation surface and the Playlist the song assembly surface; a pattern clip opens its editor directly. [Channel Rack](https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/channelrack.htm), [Playlist](https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/playlist.htm)
- Ableton puts the song on a linear Arrangement canvas and allows the Browser and Mixer to be shown or hidden. [Arrangement View](https://www.ableton.com/en/manual/arrangement-view/), [Browser](https://www.ableton.com/en/live-manual/12/working-with-the-browser/)
- Bitwig's Inspector follows the selected track, clip, or note; double clicking a note clip opens the detail editor. [Inspector](https://www.bitwig.com/userguide/latest/meet_inspector_panel/), [Detail Editor](https://www.bitwig.com/userguide/latest/working_with_note_events/)
- Suno Studio opens clip detail in a bottom dock while keeping the arrangement visible. [Editing Clips in Studio](https://help.suno.com/en/articles/13670977)

These are interaction references. BMAI should keep its own visual identity and simpler feature scope.

## Proposed workspace

```text
Project name                              Play · BPM · Key · Loop · Export
──────────────────────────────────────────────────────────────────────────
Song / Beat          Select · Draw · Split     Snap · Zoom     + Add
┌───────────┬──────────────────────────────────────────────────────────────┐
│ Browser   │ Song timeline: sections, tracks, clips, playhead           │
│ toggle    │                                                              │
│ Patterns  │                                                              │
│ Sounds    │                                                              │
└───────────┴──────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────────────┐
│ Selected clip: step sequencer / piano roll / audio editor / mixer       │
└──────────────────────────────────────────────────────────────────────────┘
```

- **Song** opens the arrangement. **Beat** opens the step editor for the selected drum pattern. A double click on any pattern clip opens the correct editor in the bottom dock while the arrangement remains visible. A back control returns to the previous edit context.
- The Browser is a collapsible source picker. Its Patterns tab has a compact list by type, a clear active pattern, search, and one **New pattern** action. Duplicate and Make unique go in the selected pattern's menu.
- The Inspector is closed by default for an unselected song and opens with properties for the selected clip or track. It does not repeat the track list. Mixer and FX controls appear under a Track or Mix tab when relevant.
- The playlist toolbar holds direct editing tools and snap/zoom. **+ Add** opens a menu for track, section, marker, and imported audio. Playback mode belongs beside transport.
- The bottom editor is the only Studio detail dock. It can collapse, resize, and remember its height. The global piano section is hidden while Studio owns this dock.

## Visual system

Art direction: a calm production desk with warm graphite surfaces, soft white type, and a restrained mint action color. The song's tracks supply the vivid colors. Avoid a colored border around every panel; reserve brightness for the playhead, selection, and the action that moves the song forward. Start the mockup with canvas `#0D1113`, panel `#171D20`, raised menu `#222B2E`, text `#EDF2F0`, muted text `#A5B2AF`, and BMAI action `#79D8BD`; adjust after viewing the mockup at normal monitor brightness.

| Element | Direction |
| --- | --- |
| Typography | Use the existing UI sans face for labels and headings. Reserve monospace for bar numbers, BPM, key names, and time values. Target 14px controls, 12px secondary text, and 18px section titles. |
| Surfaces | Use one canvas background, one panel surface, and one raised menu surface. Remove most nested borders; use space and dividers to separate regions. |
| Color | Keep dark neutrals and the existing track hues. Use each hue for a small track rail and clip body; reserve one BMAI accent for selection and primary actions. |
| Clips | Show one name per clip, a compact note or waveform preview, clear resize handles, and a stronger selected state. Show section names in a single ruler. |
| Controls | Give primary actions one filled style. Use icon plus tooltip for secondary actions; show text labels where icon meaning is unclear. |
| Density | Build comfortable and compact modes from the same tokens. Default to comfortable. Side panels collapse automatically when width is tight. |

## Implementation order

1. **Fix the canvas height.** Make Studio own the available shell height; hide the separate piano row in Studio, remove the large Studio minimum height, and make timeline and dock share the remaining height. The entire rack header and at least the 16 step grid must be reachable at 1366 × 768.
2. **Clarify the workflow.** Replace six equally weighted top modes with Song and Beat as the primary destinations. Open melody, chords, vocals, and mixer through selected clip or track actions. Wire clip double click to the correct editor and show the active pattern in the local toolbar.
3. **Remove duplicates.** Turn the Browser pattern banks into a compact source list. Remove the Inspector track list. Consolidate add controls into one menu. Keep selected clip properties in a contextual Inspector.
4. **Apply the visual system.** Refactor Studio and playlist CSS tokens, typography, clip rendering, track headers, tool states, spacing, and empty states. Build one focused mockup first, then apply its rules to Song, Beat, and clip editing.
5. **Validate real tasks.** Review at 1774 × 705, 1366 × 768, 1440 × 900, and a narrow viewport. Walk through new project → create beat → place pattern → edit notes → duplicate section → adjust mix → export. Check that no core control is clipped, selected state is obvious, and keyboard focus remains visible.

## Acceptance criteria

- A new producer can find **Create beat**, place that beat in the song, and reopen its step editor from the resulting clip without reading help text.
- The arrangement remains visible when editing a selected clip and takes most of the horizontal space.
- At 1366 × 768, the active editor is visible or one explicit click away; no important panel is hidden by shell overflow.
- Browser, timeline, and Inspector each have one distinct job. Track selection exists in the timeline; clip and track settings exist in the Inspector.
- The visual system is consistent across Song, Beat, pattern editing, and Mix at desktop and narrow widths.

## Main code areas

- `src/main.js`: `applyStudioLayout()`, `stageStudio()`, `studioBrowserPane()`, `studioToolsPane()`, `studioBottomDock()`, `playlistTimeline()`, clip interaction handlers.
- `src/studio.css`, `src/playlist.css`, `src/pages.css`, `src/responsive.css`: shell sizing, workspace grid, typography, dock, playlist, breakpoint behavior.
- `src/ui.js`: shared button, menu, disclosure, and tooltip styles where Studio can reuse them.
