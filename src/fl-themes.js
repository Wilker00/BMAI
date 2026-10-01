// FL Studio Theme System (Zero Emojis)
// Provides color palettes for Channel Rack, Mixer, Playlist, and Top Panel

export const FL_THEMES = {
  charcoal: {
    name: 'Charcoal Dark',
    vars: {
      '--fl-bg-rack': '#141414',
      '--fl-bg-strip': '#1a1a1a',
      '--fl-bg-strip-alt': '#141414',
      '--fl-bg-panel': '#222222',
      '--fl-bg-dark': '#0c0c0c',
      '--fl-border': '#3a3a3a',
      '--fl-border-light': '#5c5c5c',
      '--fl-led-green': '#7dba9a',
      '--fl-accent-orange': '#c8c8c8',
      '--fl-accent-cyan': '#f5f5f5',
      '--fl-text-main': '#f4f4f4',
      '--fl-text-muted': '#a3a3a3'
    }
  },
  midnight: {
    name: 'Midnight Blue',
    vars: {
      '--fl-bg-rack': '#0f172a',
      '--fl-bg-strip': '#1e293b',
      '--fl-bg-strip-alt': '#0f172a',
      '--fl-bg-panel': '#1e293b',
      '--fl-bg-dark': '#080d1a',
      '--fl-border': '#334155',
      '--fl-border-light': '#475569',
      '--fl-led-green': '#38bdf8',
      '--fl-accent-orange': '#38bdf8',
      '--fl-accent-cyan': '#7dd3fc',
      '--fl-text-main': '#f8fafc',
      '--fl-text-muted': '#94a3b8'
    }
  },
  classic: {
    name: 'FL Classic',
    vars: {
      '--fl-bg-rack': '#1e2227',
      '--fl-bg-strip': '#272d34',
      '--fl-bg-strip-alt': '#1e2227',
      '--fl-bg-panel': '#272d34',
      '--fl-bg-dark': '#13161a',
      '--fl-border': '#3c454f',
      '--fl-border-light': '#576371',
      '--fl-led-green': '#4ade80',
      '--fl-accent-orange': '#ff851b',
      '--fl-accent-cyan': '#38bdf8',
      '--fl-text-main': '#e2e8f0',
      '--fl-text-muted': '#94a3b8'
    }
  },
  contrast: {
    name: 'High Contrast',
    vars: {
      '--fl-bg-rack': '#000000',
      '--fl-bg-strip': '#111111',
      '--fl-bg-strip-alt': '#050505',
      '--fl-bg-panel': '#181818',
      '--fl-bg-dark': '#000000',
      '--fl-border': '#444444',
      '--fl-border-light': '#777777',
      '--fl-led-green': '#00ff66',
      '--fl-accent-orange': '#ffffff',
      '--fl-accent-cyan': '#00ffff',
      '--fl-text-main': '#ffffff',
      '--fl-text-muted': '#bbbbbb'
    }
  }
};

export function applyFlTheme(themeName) {
  const theme = FL_THEMES[themeName] || FL_THEMES.charcoal;
  const root = document.documentElement;
  if (!root) return;
  for (const [prop, val] of Object.entries(theme.vars)) {
    root.style.setProperty(prop, val);
  }
  try {
    localStorage.setItem('fl-theme-choice', themeName);
  } catch {}
}
