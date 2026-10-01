const icons = {
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/>',
  redo: '<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"/>',
  ios_share: '<path d="M12 3v12"/><path d="m8 7 4-4 4 4"/><path d="M5 13v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6"/>',
  play_arrow: '<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',
  pause: '<rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="1.5" fill="currentColor" stroke="none"/>',
  timer: '<circle cx="12" cy="14" r="7"/><path d="M12 10.5V14l2.4 1.5"/><path d="M9 3h6"/><path d="m16.2 6.2 1.3-1.3"/>',
  chevron_left: '<path d="m15 18-6-6 6-6"/>',
  folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  music_note: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  album: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.4"/>',
  drums: '<ellipse cx="12" cy="15" rx="8" ry="3"/><path d="M4 15v2.2C4 19.4 7.6 21 12 21s8-1.6 8-3.8V15"/><path d="M7 6.2 14.2 12"/><path d="M17 6.2 9.8 12"/>',
  piano: '<rect x="4" y="4" width="16" height="16" rx="1.5"/><path d="M8 4v8"/><path d="M12 4v8"/><path d="M16 4v8"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0"/><path d="M12 17v3"/><path d="M8 20h8"/>',
  library_music: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M9 8h6"/><path d="M9 12h6"/>',
  equalizer: '<path d="M6 20v-7"/><circle cx="6" cy="10" r="2"/><path d="M12 20V9"/><circle cx="12" cy="6" r="2"/><path d="M18 20v-4"/><circle cx="18" cy="13" r="2"/>',
  dashboard: '<rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.2"/><rect x="13" y="3.5" width="7.5" height="4.5" rx="1.2"/><rect x="13" y="10" width="7.5" height="10.5" rx="1.2"/><rect x="3.5" y="13" width="7.5" height="7.5" rx="1.2"/>',
  settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  check: '<path d="M4.5 12.5 9 17l10.5-11"/>',
  close: '<path d="M6 6 18 18"/><path d="m18 6-12 12"/>',
  volume_up: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.2 6a8 8 0 0 1 0 12"/>',
  volume_off: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="m22 9-6 6"/><path d="m16 9 6 6"/>',
  arrow_back: '<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>',
  add: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  upload: '<path d="M12 16V5"/><path d="m7 10 5-5 5 5"/><path d="M5 19h14"/>',
  swap_horiz: '<path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/>',
  star: '<path d="M11.5 2.8a.55.55 0 0 1 1 0l2.2 4.5a2 2 0 0 0 1.5 1.1l5 .7a.55.55 0 0 1 .3.94l-3.6 3.5a2 2 0 0 0-.6 1.8l.85 4.9a.55.55 0 0 1-.8.58l-4.4-2.3a2 2 0 0 0-1.9 0l-4.4 2.3a.55.55 0 0 1-.8-.58l.85-4.9a2 2 0 0 0-.6-1.8L2.5 10a.55.55 0 0 1 .3-.94l5-.7a2 2 0 0 0 1.5-1.1z"/>',
  schedule: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l2.5 1.5"/>',
  flash_on: '<path d="M13 2 4.5 13.5H11L10 22 19.5 10H13z" fill="currentColor" stroke="none"/>',
  headphones: '<path d="M3 14a9 9 0 0 1 18 0"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/>',
  save: '<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>',
  content_copy: '<rect x="8" y="8" width="12" height="12" rx="1.5"/><path d="M4 16V5.5A1.5 1.5 0 0 1 5.5 4H16"/>',
  warning: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>'
};

export function icon(name, extra = '') {
  const body = icons[name] || icons.close;
  const solid = body.includes('fill="currentColor"') ? ' solid' : '';
  return `<svg class="ico${solid}${extra ? ' ' + extra : ''}" viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`;
}
