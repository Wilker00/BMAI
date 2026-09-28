const GUIDE_KEY = page => `bmai-guide-${page}`;

export const guides = {
  home: {
    kicker: 'Start',
    title: 'Projects',
    steps: ['Create or open a project.', 'Set tempo in the transport.', 'Open Studio for the all-in-one arrange view.', 'Add parts, then export.']
  },
  studio: {
    kicker: 'Produce',
    title: 'Studio',
    steps: ['Song is the arrangement. Beat opens the step editor under the timeline.', 'Create a beat, draw it on the drums lane, then double-click the clip to edit steps.', 'Browser picks patterns and sounds. Inspector shows the selected clip or track.', 'Add track, section, marker, or audio from the Add menu.']
  },
  melody: {
    kicker: 'Arrange',
    title: 'Arrangement',
    steps: ['New phrases follow key, style, and the chord track. This is not an AI prompt.', 'Lock selected notes, then rewrite the rest.', 'Edit the piano roll, then use it in the project.', 'Song sections unlock after two parts.']
  },
  drums: {
    kicker: 'Drums',
    title: 'Drums',
    steps: ['Click a step to place a hit. Shift-click for rolls.', 'Lock a lane to keep it when the beat is rewritten.', 'Add sample loads WAV, MP3, OGG, or FLAC.', 'Fix repairs the pocket. Use in project commits it.']
  },
  chords: {
    kicker: 'Chords',
    title: 'Chords',
    steps: ['Pick a progression to preview it.', 'Regenerate for another option in this key.', 'Use in project to include it in playback and export.']
  },
  vocals: {
    kicker: 'Vocals',
    title: 'Vocals',
    steps: ['Audition a built-in hook or import a vocal.', 'One take plays at a time. Comping is not available yet.', 'Pitch correction is not applied here. Record uses the count-in, then Use in project.']
  },
  mix: {
    kicker: 'Mix',
    title: 'Mix',
    steps: ['Track EQ bands, compression, saturation, chorus, filter, and utility are audible live and in the WAV.', 'SEND is reverb. DLY is the delay send. Kick sidechain is the audible duck.', 'Clip warp set to beats or tones follows the project tempo. Pitch correction and extra sidechain routes are handoff notes.']
  },
  export: {
    kicker: 'Export',
    title: 'Export',
    steps: ['Share Pack includes the master, aligned stems, and a DAW open guide.', 'MIDI is notes only.', 'Download project keeps samples for another browser.']
  },
  settings: {
    kicker: 'Session',
    title: 'Settings',
    steps: ['Project name and key are stored with every save.', 'Swing and drum punch apply globally to all parts.', 'Danger zone lets you reset or start a completely new idea.']
  }
};

export function guideDismissed(page) {
  try { return localStorage.getItem(GUIDE_KEY(page)) === '1'; }
  catch { return false; }
}

export function pageHeader({ kicker, title, meta, guide }) {
  const help = guide
    ? `<button type="button" class="help-btn" data-open-guide="${guide}" data-tip="Show the ${guides[guide]?.title || 'page'} guide" aria-label="Help">Help</button>`
    : '';
  const pill = meta ? `<span class="session-pill">${meta}</span>` : '';
  return `<header class="stage-header"><div><p class="eyebrow">${kicker}</p><h1>${title}</h1></div><div class="header-tools">${help}${pill}</div></header>`;
}

export function miniGuide(page) {
  const guide = guides[page];
  if (!guide || guideDismissed(page)) return '';
  return `<aside class="mini-guide" data-guide="${page}" role="region" aria-label="${guide.title} guide"><div><p class="tour-kicker">${guide.kicker}</p><ol>${guide.steps.map(step => `<li>${step}</li>`).join('')}</ol></div><button type="button" class="tour-dismiss" data-dismiss-guide="${page}">Got it</button></aside>`;
}

export function actionBar(label, buttons) {
  return `<div class="take-actions action-bar" role="toolbar" aria-label="${label} actions"><span class="action-bar-label">${label}</span>${buttons}</div>`;
}

export function btn(label, { id = '', hot = false, tip = '', attrs = '', type = 'button' } = {}) {
  const tipAttr = tip ? ` data-tip="${tip.replace(/"/g, '&quot;')}"` : '';
  const idAttr = id ? ` id="${id}"` : '';
  return `<button type="${type}" class="page-btn${hot ? ' hot action-primary' : ''}"${idAttr}${tipAttr}${attrs ? ` ${attrs}` : ''}>${label}</button>`;
}

export function disclosure(summary, body, { open = false, className = 'help-disclosure' } = {}) {
  return `<details class="${className}"${open ? ' open' : ''}><summary>${summary}</summary><div class="disclosure-body">${body}</div></details>`;
}

export function menuPop(summaryHtml, itemsHtml, { className = 'studio-menu', summaryClass = 'studio-tool-btn', label = '' } = {}) {
  const named = label ? ` aria-label="${label.replace(/"/g, '&quot;')}"` : '';
  return `<details class="${className}"><summary class="${summaryClass}"${named}>${summaryHtml}</summary><div class="studio-menu-pop">${itemsHtml}</div></details>`;
}

export function clickCard(className, attrs, body) {
  return `<button type="button" class="idea click-card ${className}" ${attrs}>${body}</button>`;
}

let tipEl = null;
let tipTimer = 0;
let tipAnchor = null;

function ensureTip() {
  if (tipEl) return tipEl;
  tipEl = document.createElement('div');
  tipEl.id = 'bmai-tip';
  tipEl.className = 'bmai-tip';
  tipEl.setAttribute('role', 'tooltip');
  tipEl.hidden = true;
  document.body.append(tipEl);
  return tipEl;
}

export function hideTooltip() {
  clearTimeout(tipTimer);
  if (tipAnchor) tipAnchor.removeAttribute('aria-describedby');
  tipAnchor = null;
  if (tipEl) tipEl.hidden = true;
}

export function tooltipOpen() {
  return !!tipAnchor;
}

function placeTooltip(anchor) {
  const text = anchor?.getAttribute?.('data-tip');
  if (!text) return;
  const tip = ensureTip();
  tip.textContent = text;
  tip.hidden = false;
  if (tipAnchor && tipAnchor !== anchor) tipAnchor.removeAttribute('aria-describedby');
  anchor.setAttribute('aria-describedby', 'bmai-tip');
  tipAnchor = anchor;
  const margin = 8;
  const rect = anchor.getBoundingClientRect();
  const width = tip.offsetWidth;
  const height = tip.offsetHeight;
  let top = rect.top - height - 8;
  if (top < margin) top = Math.min(rect.bottom + 8, window.innerHeight - height - margin);
  if (top + height > window.innerHeight - margin) top = Math.max(margin, window.innerHeight - height - margin);
  let left = rect.left + rect.width / 2 - width / 2;
  left = Math.min(Math.max(margin, left), Math.max(margin, window.innerWidth - width - margin));
  tip.style.top = `${Math.round(top)}px`;
  tip.style.left = `${Math.round(left)}px`;
}

export function mountTooltips() {
  ensureTip();
  document.addEventListener('mouseover', event => {
    const anchor = event.target.closest?.('[data-tip]');
    if (!anchor) return;
    clearTimeout(tipTimer);
    tipTimer = setTimeout(() => placeTooltip(anchor), 280);
  });
  document.addEventListener('mouseout', event => {
    const anchor = event.target.closest?.('[data-tip]');
    if (!anchor) return;
    if (event.relatedTarget?.closest?.('[data-tip]') === anchor) return;
    hideTooltip();
  });
  document.addEventListener('focusin', event => {
    const anchor = event.target.closest?.('[data-tip]');
    if (!anchor) return;
    clearTimeout(tipTimer);
    placeTooltip(anchor);
  });
  document.addEventListener('focusout', event => {
    if (event.target.closest?.('[data-tip]')) hideTooltip();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') hideTooltip();
  });
  window.addEventListener('scroll', () => { if (tipAnchor) placeTooltip(tipAnchor); }, true);
  window.addEventListener('resize', () => { if (tipAnchor) placeTooltip(tipAnchor); });
}
