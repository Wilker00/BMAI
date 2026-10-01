// FL Studio Top Control Panel & Transport Bar
// Features the FL Fruit Logo, Menus, PAT/SONG Switch, LCD Tempo & Time,
// Master Visualizer Oscilloscope, CPU/RAM meter, and the FL Hint Bar.

export function renderFlFruitLogo(size = 20) {
  return `<svg class="fl-fruit-logo" width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="FL Studio Fruit Logo">
    <defs>
      <radialGradient id="flFruitGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#f5f5f5" />
        <stop offset="55%" stop-color="#a3a3a3" />
        <stop offset="100%" stop-color="#3a3a3a" />
      </radialGradient>
      <linearGradient id="flLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#d4d4d4" />
        <stop offset="100%" stop-color="#5c5c5c" />
      </linearGradient>
    </defs>
    <!-- Leaf -->
    <path d="M16 11 C15 4, 25 3, 27 6 C29 9, 21 14, 16 11 Z" fill="url(#flLeafGrad)" stroke="#3a3a3a" stroke-width="0.8" />
    <path d="M18 9 C22 8, 25 7, 26 6" stroke="#f5f5f5" stroke-width="0.6" stroke-linecap="round" />
    <!-- Fruit Body (Mango / Persimmon shape) -->
    <path d="M16 10 C9 10, 5 15, 6 22 C7 28, 14 30, 18 29 C24 28, 27 21, 25 15 C23 11, 19 10, 16 10 Z" fill="url(#flFruitGrad)" stroke="#1a1a1a" stroke-width="0.9" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))" />
    <!-- Highlight shine -->
    <ellipse cx="12" cy="16" rx="4" ry="2.2" transform="rotate(-30 12 16)" fill="rgba(255, 255, 255, 0.45)" />
    <!-- Stem tip -->
    <circle cx="16" cy="10.5" r="1.2" fill="#1a1a1a" />
  </svg>`;
}

export function renderFlTopMenuBar() {
  const menus = [
    {
      id: 'file', label: 'FILE', items: [
        { label: 'New from template…', action: 'file-new', shortcut: 'Ctrl+N' },
        { label: 'Open project…', action: 'file-open', shortcut: 'Ctrl+O' },
        { label: 'Save project', action: 'file-save', shortcut: 'Ctrl+S' },
        { label: 'Project info…', action: 'file-project-info', shortcut: 'F11' },
        { label: 'Export WAV audio…', action: 'file-export-wav', shortcut: 'Ctrl+R' },
        { label: 'Export MP3 audio…', action: 'file-export-mp3', shortcut: 'Shift+Ctrl+R' },
        { label: 'Export all playlist tracks (Stems)', action: 'file-export-stems' }
      ]
    },
    {
      id: 'edit', label: 'EDIT', items: [
        { label: 'Undo', action: 'edit-undo', shortcut: 'Ctrl+Z' },
        { label: 'Redo', action: 'edit-redo', shortcut: 'Ctrl+Y' },
        { label: 'Cut', action: 'edit-cut', shortcut: 'Ctrl+X' },
        { label: 'Copy', action: 'edit-copy', shortcut: 'Ctrl+C' },
        { label: 'Paste', action: 'edit-paste', shortcut: 'Ctrl+V' },
        { label: 'Delete selected', action: 'edit-delete', shortcut: 'Del' }
      ]
    },
    {
      id: 'add', label: 'ADD', items: [
        { label: 'Channel: 3xOSC Synthesizer', action: 'add-synth-3xosc' },
        { label: 'Channel: 808 Bass', action: 'add-synth-bass' },
        { label: 'Channel: Rhodes Keys', action: 'add-synth-keys' },
        { label: 'Channel: Ambient Pad', action: 'add-synth-pad' },
        { label: 'Audio Track (Vocal / Stem)', action: 'add-audio-track' },
        { label: 'Extra Drum Lane', action: 'add-drum-lane' }
      ]
    },
    {
      id: 'patterns', label: 'PATTERNS', items: [
        { label: 'Find first empty', action: 'pat-empty', shortcut: 'F4' },
        { label: 'Clone pattern', action: 'pat-clone' },
        { label: 'Rename / color…', action: 'pat-rename' },
        { label: 'Split by channel', action: 'pat-split' }
      ]
    },
    {
      id: 'view', label: 'VIEW', items: [
        { label: 'Playlist', action: 'view-playlist', shortcut: 'F5' },
        { label: 'Channel Rack', action: 'view-rack', shortcut: 'F6' },
        { label: 'Piano Roll', action: 'view-piano', shortcut: 'F7' },
        { label: 'Mixer Console', action: 'view-mixer', shortcut: 'F9' },
        { label: 'Browser Tree', action: 'view-browser', shortcut: 'Alt+F8' }
      ]
    },
    {
      id: 'options', label: 'OPTIONS', items: [
        { label: 'Audio settings…', action: 'opt-audio' },
        { label: 'MIDI settings…', action: 'opt-midi' },
        { label: 'General / Themes…', action: 'opt-general' }
      ]
    },
    {
      id: 'tools', label: 'TOOLS', items: [
        { label: 'Humanize drums & velocity', action: 'tool-humanize' },
        { label: 'Fix rhythm & timing', action: 'tool-fix' },
        { label: 'Purge unused audio clips', action: 'tool-purge' }
      ]
    },
    {
      id: 'help', label: 'HELP', items: [
        { label: 'Keyboard shortcuts…', action: 'help-shortcuts', shortcut: '?' },
        { label: 'Interactive Studio Tour…', action: 'help-tour' },
        { label: 'About BMAI Studio', action: 'help-about' }
      ]
    }
  ];

  return `<nav class="fl-menu-bar" role="menubar" aria-label="BMAI Studio Menu">
    ${menus.map(menu => `
      <div class="fl-menu-item" tabindex="0" role="menuitem" aria-haspopup="true" data-fl-menu="${menu.id}">
        <span class="fl-menu-title">${menu.label}</span>
        <div class="fl-dropdown-menu" role="menu">
          ${menu.items.map(item => `
            <button type="button" class="fl-dropdown-btn" data-fl-action="${item.action}" role="menuitem" data-fl-hint="${item.label}${item.shortcut ? ' (' + item.shortcut + ')' : ''}">
              <span class="fl-dropdown-label">${item.label}</span>
              ${item.shortcut ? `<span class="fl-dropdown-shortcut">${item.shortcut}</span>` : ''}
            </button>
          `).join('')}
        </div>
      </div>
    `).join('')}
  </nav>`;
}

export function renderFlTransportHeader(state, { playing = false, activePatternName = 'Pattern 1', typingKeyboardOn = false } = {}) {
  const bpm = Number(state.bpm || 92);
  const songMode = state.flPlaybackMode === 'song'; // 'pat' or 'song'
  const timeSignature = state.meter || '4/4';
  const swing = Math.round(Number(state.swing ?? 18));
  const metronomeOn = !!state.metronome;
  const loopOn = !!state.transport?.loopEnabled;
  const masterPitch = Number(state.masterPitch) || 0;
  const countIn = !!state.countIn;

  return `<div class="fl-top-control-panel" role="region" aria-label="BMAI Studio Master Control">
    <!-- Top Row: Logo, Menu Bar, Project Title, Hint Bar -->
    <div class="fl-header-row-top">
      <div class="fl-logo-and-menus">
        <button type="button" class="fl-brand-badge" data-fl-hint="BMAI Studio - Home" data-action="go-home" aria-label="Open Projects home">
          ${renderFlFruitLogo(22)}
          <span class="fl-brand-text">BMAI</span>
        </button>
        ${renderFlTopMenuBar()}
      </div>

      <!-- Project name & status -->
      <div class="fl-project-info" data-fl-hint="Project Title and Save State">
        <strong class="fl-project-title" id="fl-project-title">${state.title || 'Untitled Project'}</strong>
        <span class="fl-save-indicator" id="fl-save-indicator" title="Auto-saved"></span>
      </div>

      <!-- Window shortcuts & CPU/RAM -->
      <div class="fl-header-sys-status">
        <div class="fl-sys-meter" data-fl-hint="CPU Load: 4% | Audio Engine Latency: 2.9ms">
          <span class="fl-sys-label">CPU</span>
          <div class="fl-meter-bar-track"><div class="fl-meter-bar-fill cpu" style="width: 12%"></div></div>
          <span class="fl-sys-val">4%</span>
        </div>
        <div class="fl-sys-meter" data-fl-hint="RAM Consumption: 240 MB">
          <span class="fl-sys-label">MEM</span>
          <div class="fl-meter-bar-track"><div class="fl-meter-bar-fill mem" style="width: 18%"></div></div>
          <span class="fl-sys-val">240M</span>
        </div>
      </div>
    </div>

    <!-- Second Row: Transport Strip, LCDs, PAT/SONG, Oscilloscope, Quick Windows -->
    <div class="fl-header-row-bottom">
      <!-- PAT / SONG mode selector -->
      <div class="fl-pat-song-toggle" data-fl-hint="Switch between Pattern playback mode and Song arrangement mode">
        <button type="button" class="fl-pat-btn ${!songMode ? 'active' : ''}" data-fl-playback-mode="pat" data-fl-hint="PAT: Play current pattern (${activePatternName})">PAT</button>
        <button type="button" class="fl-song-btn ${songMode ? 'active' : ''}" data-fl-playback-mode="song" data-fl-hint="SONG: Play full song arrangement timeline">SONG</button>
      </div>

      <!-- Play / Stop / Record buttons -->
      <div class="fl-transport-buttons">
        <button type="button" class="fl-btn-play ${playing ? 'playing' : ''}" id="fl-play" data-fl-hint="Start / Pause playback (Spacebar)" aria-label="Play">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </button>
        <button type="button" class="fl-btn-stop" id="fl-stop" data-fl-hint="Stop playback and return to start (Esc)" aria-label="Stop">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="2"/></svg>
        </button>
        <button type="button" class="fl-btn-record" id="fl-record" data-fl-hint="Record audio or automation (R)" aria-label="Record">
          <span class="fl-rec-dot"></span>
        </button>
      </div>

      <!-- Digital LCD Tempo Display -->
      <div class="fl-lcd-box fl-lcd-tempo" data-fl-hint="Tempo (BPM): Drag up/down or click to adjust song speed">
        <span class="fl-lcd-label">TEMPO</span>
        <div class="fl-lcd-readout">
          <span class="fl-lcd-num" id="fl-bpm-display">${bpm.toFixed(1)}</span>
        </div>
        <div class="fl-lcd-spinners">
          <button type="button" class="fl-lcd-spin-up" data-fl-bpm-adjust="1" data-fl-hint="Increase BPM by 1">▲</button>
          <button type="button" class="fl-lcd-spin-down" data-fl-bpm-adjust="-1" data-fl-hint="Decrease BPM by 1">▼</button>
        </div>
        <button type="button" class="fl-tap-tempo-btn" id="fl-tap-tempo" data-fl-hint="Tap tempo rhythmically to set BPM">TAP</button>
      </div>

      <!-- Digital LCD Song Position / Clock -->
      <div class="fl-lcd-box fl-lcd-time" data-fl-hint="Song Position (Bar : Beat : Step)">
        <span class="fl-lcd-label">POS</span>
        <div class="fl-lcd-readout lcd-green">
          <span class="fl-lcd-num" id="fl-time-display">001 : 01 : 00</span>
        </div>
        <span class="fl-lcd-sub">${timeSignature}</span>
      </div>

      <!-- Master Pitch Slider (-12 to +12 semitones) -->
      <div class="fl-pitch-box" data-fl-hint="Master Pitch: Transpose song playback (-12 to +12 semitones). Click value to reset to 0">
        <span class="fl-pitch-label">PITCH</span>
        <input type="range" min="-12" max="12" step="1" value="${masterPitch}" id="fl-master-pitch" class="fl-pitch-slider" />
        <button type="button" class="fl-pitch-reset" id="fl-pitch-reset" title="Reset Master Pitch to 0">${masterPitch > 0 ? '+' : ''}${masterPitch}</button>
      </div>

      <!-- Metronome, Count-In, Loop & Typing Keyboard -->
      <div class="fl-tool-switches">
        <button type="button" class="fl-switch-btn ${metronomeOn ? 'active' : ''}" id="fl-metronome" data-fl-hint="Metronome: Audible click track during playback" aria-pressed="${metronomeOn}">
          <span class="fl-icon-metro">MET</span>
        </button>
        <button type="button" class="fl-switch-btn ${countIn ? 'active' : ''}" id="fl-count-in" data-fl-hint="Count-In (Ctrl+P): 1-bar metronome pre-roll before recording starts" aria-pressed="${countIn}">
          <span>PRE</span>
        </button>
        <button type="button" class="fl-switch-btn ${loopOn ? 'active' : ''}" id="fl-loop" data-fl-hint="Loop playback region (Ctrl+B)" aria-pressed="${loopOn}">
          <span>LOOP</span>
        </button>
        <button type="button" class="fl-switch-btn ${typingKeyboardOn ? 'active' : ''}" id="fl-typing-toggle" data-fl-hint="Typing keyboard to piano (Ctrl+T): Play notes using computer keys" aria-pressed="${typingKeyboardOn}">
          <span>KEYB</span>
        </button>
      </div>

      <!-- Live Oscilloscope / Spectrum Analyzer Screen -->
      <div class="fl-oscilloscope-container" data-fl-hint="Master Output Oscilloscope / Spectral Peak Monitor">
        <div class="fl-scope-glass">
          <canvas id="fl-master-scope" class="fl-scope-canvas" width="160" height="28"></canvas>
        </div>
      </div>

      <!-- FL Quick Window Toggle Toolbar (F5, F6, F7, F9, Browser) -->
      <div class="fl-window-shortcuts" role="toolbar" aria-label="FL Windows">
        <button type="button" class="fl-win-btn ${state.view === 'studio' && (!state.studioUi || state.studioUi?.bottom === 'rack') ? 'active' : ''}" data-fl-view="rack" data-fl-hint="Channel Rack (Step Sequencer) [F6]" title="Channel Rack (F6)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 14h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z"/></svg>
        </button>
        <button type="button" class="fl-win-btn ${state.studioUi?.bottom === 'piano' ? 'active' : ''}" data-fl-view="piano" data-fl-hint="Piano Roll (Melody &amp; Chords) [F7]" title="Piano Roll (F7)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
        </button>
        <button type="button" class="fl-win-btn ${state.studioUi?.mode === 'arrange' || state.studioUi?.dockCollapsed ? 'active' : ''}" data-fl-view="playlist" data-fl-hint="Playlist (Arrangement &amp; Clips) [F5]" title="Playlist (F5)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
        </button>
        <button type="button" class="fl-win-btn ${state.studioUi?.bottom === 'mixer' ? 'active' : ''}" data-fl-view="mixer" data-fl-hint="Mixer Console &amp; Effects [F9]" title="Mixer (F9)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>
        </button>
        <button type="button" class="fl-win-btn" data-fl-view="browser" data-fl-hint="Sample &amp; Plugin Tree Browser [Alt+F8]" title="Browser (Alt+F8)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
        </button>
      </div>
    </div>

    <!-- Third Row: Iconic FL Hint Bar -->
    <div class="fl-hint-bar" id="fl-hint-bar">
      <div class="fl-hint-icon">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
      </div>
      <span class="fl-hint-text" id="fl-hint-text">Hover over any button, knob, or pad for info and shortcuts</span>
      <span class="fl-hint-value" id="fl-hint-value"></span>
    </div>
  </div>`;
}

export function renderFlSessionControls(state, { activePatternName = 'Pattern 1', typingKeyboardOn = false } = {}) {
  const songMode = state.flPlaybackMode === 'song';
  const masterPitch = Number(state.masterPitch) || 0;
  const countIn = !!state.countIn;
  const loopOn = !!state.transport?.loopEnabled;
  return `<div class="fl-pat-song-toggle" data-fl-hint="Switch between pattern playback and the full song">
      <button type="button" class="fl-pat-btn ${!songMode ? 'active' : ''}" data-fl-playback-mode="pat" data-fl-hint="PAT: Play current pattern (${activePatternName})">PAT</button>
      <button type="button" class="fl-song-btn ${songMode ? 'active' : ''}" data-fl-playback-mode="song" data-fl-hint="SONG: Play the arrangement">SONG</button>
    </div>
    <button type="button" class="fl-btn-record" id="fl-record" data-fl-hint="Record audio (R)" aria-label="Record"><span class="fl-rec-dot"></span></button>
    <label class="fl-pitch-box" data-fl-hint="Master pitch, -12 to +12 semitones. Click the value to reset.">
      <span class="fl-pitch-label">Pitch</span>
      <input type="range" min="-12" max="12" step="1" value="${masterPitch}" id="fl-master-pitch" class="fl-pitch-slider" aria-label="Master pitch" />
      <button type="button" class="fl-pitch-reset" id="fl-pitch-reset" title="Reset master pitch">${masterPitch > 0 ? '+' : ''}${masterPitch}</button>
    </label>
    <div class="fl-tool-switches">
      <button type="button" class="fl-switch-btn ${countIn ? 'active' : ''}" id="fl-count-in" data-fl-hint="Count-in: one bar of clicks before recording" aria-pressed="${countIn}">PRE</button>
      <button type="button" class="fl-switch-btn ${loopOn ? 'active' : ''}" id="fl-loop" data-fl-hint="Loop the playback region" aria-pressed="${loopOn}">LOOP</button>
      <button type="button" class="fl-switch-btn ${typingKeyboardOn ? 'active' : ''}" id="fl-typing-toggle" data-fl-hint="Typing keyboard: play notes from the computer keyboard" aria-pressed="${typingKeyboardOn}">KEYB</button>
    </div>`;
}
