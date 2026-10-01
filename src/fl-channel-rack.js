// FL Studio Channel Rack (Step Sequencer)
// Features 4-beat alternating pads, Pan/Vol rotary pots, mixer routing spinners,
// green mute/solo LEDs, "Split by Channel" action, Channel Sampler settings (Reverse, Normalize, Pitch, Cut/Cut By),
// and per-step Graph Editor (Velocity/Pitch/Pan).

export function renderFlChannelRack(state, {
  lanes = ['kick', 'snare', 'hat', 'clap'],
  totalSteps = 16,
  pulse = 4,
  currentStep = 0,
  playing = false,
  activeLane = 'kick',
  graphMode = 'velocity',
  isGraphOpen = false,
  activeSettingsLane = null
} = {}) {
  const currentPatternId = state.activePatternIds?.drums || 'drums-main';
  const patterns = state.patterns?.drums || [];
  const currentPattern = patterns.find(p => p.id === currentPatternId) || { name: 'Pattern 1' };
  const swing = Math.round(Number(state.swing ?? 18));

  return `<div class="fl-channel-rack" id="fl-channel-rack" role="region" aria-label="FL Channel Rack">
    <!-- Top Toolbar -->
    <div class="fl-rack-toolbar">
      <div class="fl-rack-toolbar-left">
        <span class="fl-rack-label">CHANNEL RACK</span>
        <div class="fl-pattern-selector-group">
          <select class="fl-rack-select" id="fl-rack-pattern-select" aria-label="Select pattern">
            ${patterns.map(p => `
              <option value="${p.id}" ${p.id === currentPatternId ? 'selected' : ''}>${p.name}</option>
            `).join('')}
          </select>
          <button type="button" class="fl-rack-icon-btn" id="fl-rack-new-pat" data-tip="New Pattern" data-fl-hint="Create new empty pattern (F4)">+</button>
          <button type="button" class="fl-rack-action-btn" id="fl-split-by-channel" data-fl-hint="Split by Channel: Automatically create separate patterns for each drum lane and place on arrangement">
            <span>SPLIT CHANNELS</span>
          </button>
        </div>
      </div>

      <div class="fl-rack-toolbar-right">
        <!-- Step Length Selector -->
        <div class="fl-length-group">
          <label class="fl-rack-mini-label">STEPS</label>
          <select class="fl-rack-select" id="fl-rack-steps-select">
            <option value="16" ${totalSteps === 16 ? 'selected' : ''}>16</option>
            <option value="32" ${totalSteps === 32 ? 'selected' : ''}>32</option>
            <option value="64" ${totalSteps === 64 ? 'selected' : ''}>64</option>
          </select>
        </div>

        <!-- Global Swing Pot -->
        <div class="fl-rack-swing-group">
          <label class="fl-rack-mini-label">SWING</label>
          <input type="range" min="0" max="60" value="${swing}" class="fl-rack-swing-slider" id="fl-rack-swing" data-fl-hint="Global groove swing (0-60%)">
          <output id="fl-rack-swing-out">${swing}%</output>
        </div>

        <!-- Graph Editor Toggle -->
        <button type="button" class="fl-rack-tool-btn ${isGraphOpen ? 'active' : ''}" id="fl-rack-toggle-graph" data-fl-hint="Toggle FL Graph Editor (Fine step velocity, pitch, pan)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/></svg>
        </button>
      </div>
    </div>

    <!-- Channels Container -->
    <div class="fl-rack-channels">
      ${lanes.map((lane, index) => {
        const laneSteps = state.drums?.[lane] || new Set();
        const mix = state.mix?.[lane] || { vol: 0.8, pan: 0, mute: false, solo: false };
        const isMuted = !!mix.mute;
        const volPct = Math.round((mix.vol ?? 0.8) * 100);
        const panPct = Math.round((mix.pan ?? 0) * 100);
        const mixerTarget = index + 1; // Assigned mixer track
        const isActive = activeLane === lane;
        const isSettingsOpen = activeSettingsLane === lane;

        // Channel Sampler params
        const chSettings = state.channelSettings?.[lane] || {
          reverse: false,
          normalize: true,
          pitch: 0,
          cut: 1,
          cutBy: 1
        };

        return `<div class="fl-channel-row ${isActive ? 'active-lane' : ''}" data-lane="${lane}">
          <!-- Left Channel Controls: Mute LED, Pan, Vol, Route Spinner, Channel Button -->
          <div class="fl-channel-strip">
            <!-- Mute / Solo LED -->
            <button type="button" class="fl-led-btn ${isMuted ? 'muted' : 'active'}" data-fl-mute="${lane}" data-fl-hint="Left-click to Mute | Right-click to Solo" aria-label="Mute ${lane}"></button>

            <!-- Mini Pan Knob -->
            <div class="fl-mini-pot-wrap" data-fl-hint="Pan: ${panPct === 0 ? 'Center' : panPct > 0 ? panPct + '% Right' : Math.abs(panPct) + '% Left'}">
              <input type="range" min="-100" max="100" value="${panPct}" class="fl-mini-knob pan" data-fl-pan="${lane}" aria-label="${lane} pan">
            </div>

            <!-- Mini Vol Knob -->
            <div class="fl-mini-pot-wrap" data-fl-hint="Volume: ${volPct}%">
              <input type="range" min="0" max="100" value="${volPct}" class="fl-mini-knob vol" data-fl-vol="${lane}" aria-label="${lane} volume">
            </div>

            <!-- Mixer Target Spinner -->
            <div class="fl-mixer-target-spinner" data-fl-hint="Routing: Insert ${mixerTarget} in FL Mixer">
              <span class="fl-spinner-val">${mixerTarget}</span>
            </div>

            <!-- Channel Button (Audition on click) -->
            <button type="button" class="fl-channel-btn ${isActive ? 'selected' : ''}" data-fl-audition="${lane}" data-fl-hint="Audition ${lane} sample / Open settings">
              <span class="fl-channel-name">${lane.toUpperCase()}</span>
            </button>

            <!-- Channel Settings Toggle Button -->
            <button type="button" class="fl-ch-settings-toggle ${isSettingsOpen ? 'open' : ''}" data-fl-toggle-settings="${lane}" data-fl-hint="Sampler settings: Reverse, Normalize, Pitch, Cut/Cut By, ADSR">
              <span class="fl-ch-cog">CFG</span>
            </button>

            <!-- Channel Context Menu Button -->
            <button type="button" class="fl-channel-menu-btn" data-fl-channel-menu="${lane}" data-fl-hint="Channel context menu (Fill 2/4/8, Clear, Humanize)">•••</button>
          </div>

          <!-- Step Pads: 4-Beat Alternating Blocks -->
          <div class="fl-step-pads" role="group" aria-label="${lane} steps">
            ${Array.from({ length: totalSteps }, (_, step) => {
              const isOn = laneSteps.has(step);
              const isNow = playing && currentStep === step;
              // FL 4-beat color block: 0..3 light, 4..7 dark, 8..11 light, 12..15 dark
              const blockIndex = Math.floor(step / 4);
              const isDarkBlock = blockIndex % 2 === 1;

              return `<button type="button"
                class="fl-step-pad ${isDarkBlock ? 'pad-dark' : 'pad-light'} ${isOn ? 'on' : ''} ${isNow ? 'playhead-now' : ''}"
                data-lane="${lane}"
                data-step="${step}"
                data-fl-hint="Step ${step + 1} (${lane}): ${isOn ? 'Active hit' : 'Empty'}"
                aria-pressed="${isOn}">
                <span class="fl-step-indicator"></span>
              </button>`;
            }).join('')}
          </div>
        </div>

        <!-- Channel Sampler Settings Drawer (Collapsible) -->
        ${isSettingsOpen ? `
          <div class="fl-channel-settings-drawer" data-lane="${lane}">
            <div class="fl-cs-head">
              <div class="fl-cs-head-left">
                <strong>${lane.toUpperCase()} — CHANNEL SETTINGS</strong>
                <div class="fl-cs-tabs">
                  <button type="button" class="fl-cs-tab ${(state.flCsTab || 'smp') === 'smp' ? 'active' : ''}" data-fl-cs-tab="smp" data-lane="${lane}">SMP</button>
                  <button type="button" class="fl-cs-tab ${(state.flCsTab || 'smp') === 'env' ? 'active' : ''}" data-fl-cs-tab="env" data-lane="${lane}">ENV</button>
                </div>
              </div>
              <div class="fl-cs-head-right">
                <button type="button" class="fl-cs-edison-btn" data-fl-open-edison="${lane}" title="Open sample in Edison editor">EDISON</button>
                <button type="button" class="fl-cs-close" data-fl-close-settings="${lane}">X</button>
              </div>
            </div>
            ${(state.flCsTab || 'smp') === 'env' ? `
              <div class="fl-cs-env-wrap">
                <div class="fl-adsr-panel" data-adsr-lane="${lane}">
                  <div class="fl-adsr-knobs-row">
                    <div class="fl-adsr-knob">
                      <label>ATT</label>
                      <input type="range" min="0" max="1000" step="5" value="${Math.round((state.flAdsr?.[lane]?.attack ?? 0.005) * 1000)}" class="fl-mini-knob" data-adsr-param="attack" data-adsr-lane="${lane}" />
                      <span>${Math.round((state.flAdsr?.[lane]?.attack ?? 0.005) * 1000)}ms</span>
                    </div>
                    <div class="fl-adsr-knob">
                      <label>HOLD</label>
                      <input type="range" min="0" max="1000" step="5" value="${Math.round((state.flAdsr?.[lane]?.hold ?? 0.05) * 1000)}" class="fl-mini-knob" data-adsr-param="hold" data-adsr-lane="${lane}" />
                      <span>${Math.round((state.flAdsr?.[lane]?.hold ?? 0.05) * 1000)}ms</span>
                    </div>
                    <div class="fl-adsr-knob">
                      <label>DEC</label>
                      <input type="range" min="10" max="2500" step="10" value="${Math.round((state.flAdsr?.[lane]?.decay ?? 0.25) * 1000)}" class="fl-mini-knob" data-adsr-param="decay" data-adsr-lane="${lane}" />
                      <span>${Math.round((state.flAdsr?.[lane]?.decay ?? 0.25) * 1000)}ms</span>
                    </div>
                    <div class="fl-adsr-knob">
                      <label>SUS</label>
                      <input type="range" min="0" max="100" step="1" value="${Math.round((state.flAdsr?.[lane]?.sustain ?? 0.7) * 100)}" class="fl-mini-knob" data-adsr-param="sustain" data-adsr-lane="${lane}" />
                      <span>${Math.round((state.flAdsr?.[lane]?.sustain ?? 0.7) * 100)}%</span>
                    </div>
                    <div class="fl-adsr-knob">
                      <label>REL</label>
                      <input type="range" min="10" max="3000" step="10" value="${Math.round((state.flAdsr?.[lane]?.release ?? 0.15) * 1000)}" class="fl-mini-knob" data-adsr-param="release" data-adsr-lane="${lane}" />
                      <span>${Math.round((state.flAdsr?.[lane]?.release ?? 0.15) * 1000)}ms</span>
                    </div>
                  </div>
                </div>
              </div>
            ` : `
              <div class="fl-cs-grid">
                <label class="fl-cs-toggle">
                  <input type="checkbox" data-fl-cs-param="reverse" data-lane="${lane}" ${chSettings.reverse ? 'checked' : ''}>
                  <span>REV (Reverse)</span>
                </label>
                <label class="fl-cs-toggle">
                  <input type="checkbox" data-fl-cs-param="normalize" data-lane="${lane}" ${chSettings.normalize ? 'checked' : ''}>
                  <span>NORM (Normalize)</span>
                </label>
                <div class="fl-cs-knob">
                  <label>PITCH (${chSettings.pitch > 0 ? '+' : ''}${chSettings.pitch} st)</label>
                  <input type="range" min="-12" max="12" value="${chSettings.pitch}" data-fl-cs-param="pitch" data-lane="${lane}">
                </div>
                <div class="fl-cs-cut-group">
                  <label>CUT: <input type="number" min="0" max="16" value="${chSettings.cut}" data-fl-cs-param="cut" data-lane="${lane}" class="fl-cs-num"></label>
                  <label>BY: <input type="number" min="0" max="16" value="${chSettings.cutBy}" data-fl-cs-param="cutBy" data-lane="${lane}" class="fl-cs-num"></label>
                </div>
              </div>
            `}
          </div>
        ` : ''}`;
      }).join('')}
    </div>

    <!-- Bottom Add Channel Bar -->
    <div class="fl-rack-footer">
      <button type="button" class="fl-rack-add-channel-btn" id="fl-rack-add-btn" data-fl-hint="Add new instrument or drum generator to Channel Rack">
        <span>+ Add Channel</span>
      </button>
      <span class="fl-rack-info-badge">${lanes.length} Channels · ${totalSteps} Steps</span>
    </div>

    <!-- Expandable Graph Editor Drawer -->
    ${isGraphOpen ? `
      <div class="fl-graph-editor-drawer" id="fl-graph-editor">
        <div class="fl-graph-toolbar">
          <span class="fl-graph-title">GRAPH EDITOR: ${activeLane.toUpperCase()}</span>
          <div class="fl-graph-tabs">
            <button type="button" class="fl-graph-tab ${graphMode === 'velocity' ? 'active' : ''}" data-graph-mode="velocity">Velocity</button>
            <button type="button" class="fl-graph-tab ${graphMode === 'pitch' ? 'active' : ''}" data-graph-mode="pitch">Pitch</button>
            <button type="button" class="fl-graph-tab ${graphMode === 'pan' ? 'active' : ''}" data-graph-mode="pan">Pan</button>
          </div>
        </div>
        <div class="fl-graph-bars-track">
          ${Array.from({ length: totalSteps }, (_, step) => {
            const laneSteps = state.drums?.[activeLane] || new Set();
            const isOn = laneSteps.has(step);
            const vel = state.drumVelocities?.[activeLane]?.[step] ?? 80;
            const height = isOn ? vel : 0;
            return `<div class="fl-graph-col" data-step="${step}" data-lane="${activeLane}">
              <div class="fl-graph-bar ${isOn ? 'active' : ''}" style="height: ${height}%"></div>
            </div>`;
          }).join('')}
        </div>
      </div>
    ` : ''}
  </div>`;
}
