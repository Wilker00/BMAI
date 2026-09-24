import { readFile, writeFile, unlink } from 'node:fs/promises';

const files = [
  'src/style.css',
  'src/pages.css',
  'src/workspace.css',
  'src/library.css',
  'src/responsive.css',
  'src/main.js'
];

const tokens = `--bg:#0c0e11;--panel:#12161a;--panel2:#181d22;--line:#2c3339;--line-strong:#6d7880;--text:#e7ebef;--muted:#8e989f;--steel:#c5ced4;--steel-2:#9aa6ae;--ink:#14181c;--success:#8fbfa8;--warning:#d2b56a;--danger:#e07a84;--surface-1:#12171b;--surface-2:#181e23;--surface-3:#222a30;--radius-sm:5px;--radius-md:8px;--radius-lg:12px;--control-h:32px;--focus:#d5dde3`;

function rgbToHsl(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s, l };
}

function keep(h, s) {
  if (s < 0.08) return true;
  if (h >= 75 && h <= 170) return true;
  if (h >= 28 && h <= 58 && s >= 0.25) return true;
  if ((h <= 16 || h >= 348) && s >= 0.32) return true;
  return false;
}

function remapChannels(r, g, b) {
  const { h, s, l } = rgbToHsl(r, g, b);
  if (keep(h, s)) return null;
  return [l, l, l];
}

function hexByte(n) {
  return Math.round(Math.min(255, Math.max(0, n * 255))).toString(16).padStart(2, '0');
}

function rewriteHex(raw) {
  let body = raw.slice(1);
  if (body.length === 3 || body.length === 4) body = [...body].map(ch => ch + ch).join('');
  if (body.length !== 6 && body.length !== 8) return raw;
  const r = parseInt(body.slice(0, 2), 16) / 255;
  const g = parseInt(body.slice(2, 4), 16) / 255;
  const b = parseInt(body.slice(4, 6), 16) / 255;
  const next = remapChannels(r, g, b);
  if (!next) return raw;
  const alpha = body.length === 8 ? body.slice(6, 8) : '';
  return `#${hexByte(next[0])}${hexByte(next[1])}${hexByte(next[2])}${alpha}`;
}

function rewriteRgb(raw) {
  const match = raw.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/i);
  if (!match) return raw;
  const r = Number(match[1]) / 255;
  const g = Number(match[2]) / 255;
  const b = Number(match[3]) / 255;
  const next = remapChannels(r, g, b);
  if (!next) return raw;
  const a = match[4];
  const channels = next.map(n => Math.round(n * 255)).join(',');
  return a === undefined ? `rgb(${channels})` : `rgba(${channels},${a})`;
}

function stripGlows(css) {
  return css
    .replace(/,?\s*0 0 \d+px\s+(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))/g, '')
    .replace(/box-shadow:\s*;/g, 'box-shadow:none;')
    .replace(/box-shadow:\s*,/g, 'box-shadow:')
    .replace(/filter:\s*blur\([^)]+\)/g, 'filter:none');
}

let changed = 0;
for (const file of files) {
  let text = await readFile(file, 'utf8');
  const before = text;
  if (file === 'src/style.css') {
    text = text.replace(/:root\{[^}]+\}/, `:root{${tokens}}`);
  }
  text = text.replace(/#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b/g, rewriteHex);
  text = text.replace(/rgba?\([^)]+\)/gi, rewriteRgb);
  if (file.endsWith('.css')) text = stripGlows(text);
  if (text !== before) {
    await writeFile(file, text);
    changed++;
  }
}

const library = await readFile('src/library.css', 'utf8');
if (!library.includes('.library-modal[hidden]')) {
  await writeFile('src/library.css', `${library}\n.workspace-overlay[hidden],.library-modal[hidden]{display:none!important}\n`);
}

try { await unlink('src/theme.css'); } catch { /* already removed */ }
try { await unlink('src/visibility-fixes.css'); } catch { /* already removed */ }

const leftovers = [];
for (const file of ['src/style.css', 'src/pages.css', 'src/workspace.css', 'src/library.css', 'src/responsive.css', 'src/main.js']) {
  const text = await readFile(file, 'utf8');
  const found = text.match(/#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b|rgba?\([^)]+\)/gi) || [];
  for (const color of found) {
    let r; let g; let b;
    if (color.startsWith('#')) {
      let body = color.slice(1);
      if (body.length === 3 || body.length === 4) body = [...body].map(ch => ch + ch).join('');
      r = parseInt(body.slice(0, 2), 16) / 255;
      g = parseInt(body.slice(2, 4), 16) / 255;
      b = parseInt(body.slice(4, 6), 16) / 255;
    } else {
      const m = color.match(/[\d.]+/g);
      r = Number(m[0]) / 255; g = Number(m[1]) / 255; b = Number(m[2]) / 255;
    }
    const { h, s } = rgbToHsl(r, g, b);
    const purple = s >= 0.12 && h >= 250 && h <= 345;
    if (purple) leftovers.push(`${file} ${color} h${h.toFixed(0)} s${s.toFixed(2)}`);
  }
}
console.log(JSON.stringify({ changed, leftovers: leftovers.slice(0, 40), leftoverCount: leftovers.length }, null, 2));
