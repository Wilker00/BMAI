import { equipmentArt } from './equipment-art.js';

const equipmentIcons = {
  folder: 'cassette',
  music_note: 'melody',
  album: 'drums',
  piano: 'chords',
  mic: 'vocals',
  library_music: 'cassette',
  equalizer: 'headphones',
};

const icons = {
  undo: '<path d="M8 8H4v4"/><path d="M4 8a8 8 0 1 1-1 4"/>',
  redo: '<path d="M16 8h4v4"/><path d="M20 8a8 8 0 1 0 1 4"/>',
  ios_share: '<path d="M12 4v11"/><path d="M8 8l4-4 4 4"/><path d="M5 13v6h14v-6"/>',
  play_arrow: '<path d="M8 6.5v11l10-5.5-10-5.5z" fill="currentColor" stroke="none"/>',
  stop: '<rect x="7" y="7" width="10" height="10" rx="1.2" fill="currentColor" stroke="none"/>',
  timer: '<circle cx="12" cy="13" r="7"/><path d="M12 10v3.5l2 1.5"/><path d="M9 4h6"/>',
  chevron_left: '<path d="M14 6l-6 6 6 6"/>',
  folder: '<path d="M3 7.5h6l2 2H21v9.5H3z"/>',
  music_note: '<path d="M10 17.5a2.5 2.5 0 1 1-2-2.45V6l10-2v9.2"/><circle cx="16" cy="13.2" r="2.4"/>',
  album: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.2"/><path d="M12 4v3M12 17v3M4 12h3M17 12h3"/>',
  piano: '<rect x="4" y="5" width="16" height="14" rx="1.5"/><path d="M8 5v7M12 5v7M16 5v7"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0"/><path d="M12 17v4M8 21h8"/>',
  library_music: '<path d="M5 5h10v14H5z"/><path d="M15 8h4v11H9"/><path d="M8 14.5a1.4 1.4 0 1 0 .4 2.8V10l4-1v4.2"/>',
  equalizer: '<path d="M5 18V10M12 18V6M19 18v-5"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M5.8 5.8l1.6 1.6M16.6 16.6l1.6 1.6M18.2 5.8l-1.6 1.6M7.4 16.6l-1.6 1.6"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  volume_up: '<path d="M4 10h4l5-4v12l-5-4H4z"/><path d="M16 9.5a3.5 3.5 0 0 1 0 5"/><path d="M18.2 7.2a6.5 6.5 0 0 1 0 9.6"/>',
  volume_off: '<path d="M4 10h4l5-4v12l-5-4H4z"/><path d="M17 9l5 6M22 9l-5 6"/>',
  arrow_back: '<path d="M19 12H6"/><path d="M11 7l-5 5 5 5"/>',
  add: '<path d="M12 5v14M5 12h14"/>',
  upload: '<path d="M12 16V6"/><path d="M8 10l4-4 4 4"/><path d="M5 18h14"/>',
  swap_horiz: '<path d="M4 8h13l-3-3"/><path d="M20 16H7l3 3"/>'
};

export function icon(name, extra = '') {
  if (Object.hasOwn(equipmentIcons, name)) return equipmentArt(equipmentIcons[name], `equipment-icon${extra ? ' ' + extra : ''}`);
  const body = icons[name] || icons.close;
  const solid = body.includes('fill="currentColor"') ? ' solid' : '';
  return `<svg class="ico${solid}${extra ? ' ' + extra : ''}" viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`;
}
