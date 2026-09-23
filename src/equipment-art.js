const equipmentKinds = ['cassette', 'melody', 'drums', 'chords', 'vocals', 'headphones'];

const art = {
  cassette: `
    <rect x="4" y="18" width="56" height="30" rx="2.5" fill="#3a342c"/>
    <rect x="6" y="20" width="52" height="26" rx="1.5" fill="#1c1916"/>
    <rect x="11" y="25" width="16" height="11" fill="#c9862a"/>
    <rect x="37" y="25" width="16" height="11" fill="#c9862a"/>
    <circle cx="19" cy="30.5" r="3.4" fill="#5c3b16" stroke="#e2b15a" stroke-width="1.1"/>
    <circle cx="45" cy="30.5" r="3.4" fill="#5c3b16" stroke="#e2b15a" stroke-width="1.1"/>
    <path d="M22.4 29.2h19.2M22.4 31.8h19.2" stroke="#f0c36a" stroke-width="0.7"/>
    <rect x="24" y="38" width="16" height="5" fill="#d24a3a"/>
    <circle cx="9" cy="23" r="0.9" fill="#c4a574"/>
    <circle cx="55" cy="23" r="0.9" fill="#c4a574"/>
    <circle cx="9" cy="43" r="0.9" fill="#c4a574"/>
    <circle cx="55" cy="43" r="0.9" fill="#c4a574"/>
    <rect x="4" y="32" width="3" height="4" fill="#111"/>
    <rect x="57" y="32" width="3" height="4" fill="#111"/>`,
  melody: `
    <rect x="6" y="14" width="52" height="36" rx="2" fill="#6b3a22"/>
    <rect x="8" y="16" width="48" height="14" fill="#1a120e"/>
    <circle cx="16" cy="23" r="3.2" fill="#d98a3a" stroke="#f2c07a" stroke-width="1"/>
    <circle cx="16" cy="23" r="0.8" fill="#fff4e4"/>
    <path d="M16 20.2v1.2" stroke="#fff4e4" stroke-width="0.7"/>
    <circle cx="26" cy="23" r="3.2" fill="#3aaa6a" stroke="#b7e7c8" stroke-width="1"/>
    <circle cx="26" cy="23" r="0.8" fill="#f3fff6"/>
    <rect x="34" y="20" width="16" height="2" fill="#e23b4a"/>
    <rect x="34" y="24" width="10" height="2" fill="#e2b33a"/>
    <rect x="10" y="32" width="7" height="14" fill="#f4efe6"/>
    <rect x="18" y="32" width="7" height="14" fill="#e7e0d4"/>
    <rect x="26" y="32" width="7" height="14" fill="#f4efe6"/>
    <rect x="34" y="32" width="7" height="14" fill="#e7e0d4"/>
    <rect x="42" y="32" width="7" height="14" fill="#f4efe6"/>
    <rect x="15" y="32" width="4" height="8" fill="#1a1a1a"/>
    <rect x="23" y="32" width="4" height="8" fill="#1a1a1a"/>
    <rect x="39" y="32" width="4" height="8" fill="#1a1a1a"/>
    <rect x="47" y="32" width="4" height="8" fill="#1a1a1a"/>`,
  drums: `
    <ellipse cx="32" cy="42" rx="22" ry="7" fill="#4a2c16"/>
    <path d="M10 34v8c0 5 9.8 10 22 10s22-5 22-10v-8" fill="#8a4e28"/>
    <ellipse cx="32" cy="34" rx="22" ry="7.2" fill="#d2b56a"/>
    <ellipse cx="32" cy="33" rx="18.5" ry="5.6" fill="#f3efe6"/>
    <ellipse cx="32" cy="31.6" rx="11" ry="2.4" fill="#fffaf3"/>
    <rect x="13" y="36" width="2.4" height="8" rx="0.4" fill="#e2c07a"/>
    <rect x="48.6" y="36" width="2.4" height="8" rx="0.4" fill="#e2c07a"/>
    <rect x="21" y="40" width="2" height="7" fill="#c4a574"/>
    <rect x="41" y="40" width="2" height="7" fill="#c4a574"/>
    <path d="M18 14l6 16" stroke="#c9862a" stroke-width="1.6" stroke-linecap="butt"/>
    <path d="M46 12l-5 14" stroke="#e2b15a" stroke-width="1.6" stroke-linecap="butt"/>
    <circle cx="17.2" cy="13" r="1.3" fill="#f0d7a0"/>
    <circle cx="46.6" cy="11.2" r="1.3" fill="#f0d7a0"/>`,
  chords: `
    <rect x="6" y="14" width="52" height="36" fill="#6b3e24"/>
    <rect x="8" y="16" width="8" height="32" fill="#f7f3ea"/>
    <rect x="16" y="16" width="8" height="32" fill="#ebe4d6"/>
    <rect x="24" y="16" width="8" height="32" fill="#f7f3ea"/>
    <rect x="32" y="16" width="8" height="32" fill="#ebe4d6"/>
    <rect x="40" y="16" width="8" height="32" fill="#f7f3ea"/>
    <rect x="48" y="16" width="8" height="32" fill="#ebe4d6"/>
    <path d="M8 42h48" stroke="#d8cbb8" stroke-width="0.6"/>
    <rect x="13" y="16" width="5" height="18" fill="#1a1a1a"/>
    <rect x="21" y="16" width="5" height="18" fill="#1a1a1a"/>
    <rect x="37" y="16" width="5" height="18" fill="#1a1a1a"/>
    <rect x="45" y="16" width="5" height="18" fill="#1a1a1a"/>
    <rect x="6" y="14" width="52" height="3" fill="#8a5534"/>`,
  vocals: `
    <rect x="22" y="8" width="20" height="18" rx="2" fill="#e6d7c4"/>
    <rect x="24" y="10" width="16" height="14" fill="#b7a48e"/>
    <path d="M26 12h12M26 15h12M26 18h12M26 21h12" stroke="#f3e6d4" stroke-width="0.7"/>
    <rect x="26" y="26" width="12" height="16" rx="1" fill="#2c3138"/>
    <rect x="26" y="30" width="12" height="2.2" fill="#e23b4a"/>
    <rect x="28" y="35" width="8" height="1.2" fill="#6a7380"/>
    <path d="M32 42v6" stroke="#9aa3b0" stroke-width="2"/>
    <path d="M20 50h24" stroke="#6a7380" stroke-width="2"/>
    <path d="M18 22c-6 2-8 8-6 12" fill="none" stroke="#8a93a0" stroke-width="1.4"/>
    <path d="M46 22c6 2 8 8 6 12" fill="none" stroke="#8a93a0" stroke-width="1.4"/>`,
  headphones: `
    <path d="M14 30v-4c0-10 8-18 18-18s18 8 18 18v4" fill="none" stroke="#c4a574" stroke-width="5"/>
    <path d="M16 30v-4c0-8.5 7-15 16-15s16 6.5 16 15v4" fill="none" stroke="#e7d3a4" stroke-width="1.4"/>
    <rect x="8" y="28" width="12" height="20" rx="3" fill="#2a241c"/>
    <rect x="44" y="28" width="12" height="20" rx="3" fill="#2a241c"/>
    <rect x="10" y="31" width="8" height="14" rx="2" fill="#a33b32"/>
    <rect x="46" y="31" width="8" height="14" rx="2" fill="#a33b32"/>
    <rect x="11" y="33" width="2" height="10" fill="#e7b2ac"/>
    <rect x="47" y="33" width="2" height="10" fill="#e7b2ac"/>
    <rect x="18" y="34" width="3" height="6" rx="0.5" fill="#111"/>
    <rect x="43" y="34" width="3" height="6" rx="0.5" fill="#111"/>`
};

export function equipmentArt(kind = 'cassette', extra = '') {
  const key = equipmentKinds.includes(kind) ? kind : 'cassette';
  const classes = `equipment-art equipment-${key}${extra ? ' ' + extra : ''}`;
  return `<svg class="${classes}" viewBox="0 0 64 64" aria-hidden="true" focusable="false">${art[key]}</svg>`;
}

export function projectArtworkKind(seed) {
  let hash = 0;
  for (const char of String(seed || 'bmai')) hash = (Math.imul(hash, 31) + char.charCodeAt(0)) | 0;
  return equipmentKinds[(hash >>> 0) % equipmentKinds.length];
}
