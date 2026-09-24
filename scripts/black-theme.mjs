import { readFile, writeFile } from 'node:fs/promises';

const files = ['src/style.css', 'src/pages.css', 'src/workspace.css', 'src/library.css', 'src/responsive.css', 'src/components.css', 'src/main.js'];

function rgbToHsl(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  return { h, s, l };
}

function semantic(h, s) {
  if (s < 0.18) return false;
  if (h >= 75 && h <= 170) return true;
  if (h >= 25 && h <= 55) return true;
  if (h <= 16 || h >= 348) return true;
  return false;
}

function targetLightness(l) {
  if (l >= 0.88) return l;
  if (l >= 0.68) return 0.96;
  if (l >= 0.5) return Math.min(0.64, Math.max(0.56, l));
  if (l >= 0.32) return 0.2;
  if (l >= 0.18) return 0.09;
  if (l >= 0.08) return 0.035;
  return 0;
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
  const { h, s, l } = rgbToHsl(r, g, b);
  if (semantic(h, s)) return raw;
  const next = targetLightness(l);
  const alpha = body.length === 8 ? body.slice(6) : '';
  return `#${hexByte(next)}${hexByte(next)}${hexByte(next)}${alpha}`;
}

function flattenGradients(css) {
  return css
    .replace(/(?<!repeating-)linear-gradient\((?:[^()]|\([^)]*\))*\)/g, match => {
      const hex = match.match(/#[0-9a-fA-F]{3,8}/);
      return hex ? hex[0] : '#000';
    })
    .replace(/radial-gradient\((?:[^()]|\([^)]*\))*\)/g, match => {
      const hex = match.match(/#[0-9a-fA-F]{3,8}/);
      return hex ? hex[0] : '#000';
    });
}

const tokens = `--bg:#000;--panel:#070707;--panel2:#0c0c0c;--line:#242424;--line-strong:#3a3a3a;--text:#f4f4f4;--muted:#8f8f8f;--steel:#f4f4f4;--steel-2:#cfcfcf;--ink:#000;--success:#7dba9a;--warning:#d2b56a;--danger:#e07a84;--surface-1:#070707;--surface-2:#0e0e0e;--surface-3:#141414;--radius-sm:4px;--radius-md:6px;--radius-lg:8px;--control-h:32px;--focus:#f4f4f4;--font:"Segoe UI",system-ui,sans-serif;--mono:ui-monospace,"Cascadia Mono","Segoe UI Mono",monospace`;

for (const file of files) {
  let text = await readFile(file, 'utf8');
  if (file.endsWith('.css')) {
    text = text.replace(/@import url\([^)]+\);\s*/, '');
    text = flattenGradients(text);
    text = text.replace(/#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g, rewriteHex);
    text = text.replace(/:root\{[^}]+\}/, `:root{${tokens}}`);
    text = text.replace(/'Inter',Arial,sans-serif/g, 'var(--font)');
    text = text.replace(/Inter,Arial,sans-serif/g, 'var(--font)');
    text = text.replace(/Manrope,sans-serif/g, 'var(--font)');
    text = text.replace(/'DM Mono', ?monospace/g, 'var(--mono)');
    text = text.replace(/'DM Mono'/g, 'var(--mono)');
    text = text.replace(/"DM Mono", monospace/g, 'var(--mono)');
    text = text.replace(/font-family:'DM Mono'/g, 'font-family:var(--mono)');
  } else {
    text = text.replace(/10px "DM Mono", monospace/g, '10px ui-monospace, monospace');
  }
  await writeFile(file, text);
}

const gradients = [];
for (const file of ['src/style.css', 'src/pages.css', 'src/workspace.css', 'src/library.css', 'src/components.css']) {
  const text = await readFile(file, 'utf8');
  const found = text.match(/(?<!repeating-)(linear|radial)-gradient\(/g) || [];
  if (found.length) gradients.push(`${file}:${found.length}`);
}
console.log(JSON.stringify({ gradients }, null, 2));
