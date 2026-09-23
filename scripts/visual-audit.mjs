import { writeFile, mkdir } from 'node:fs/promises';

const debugPort = process.env.BMAI_DEBUG_PORT || '9223';
const targets = await fetch(`http://127.0.0.1:${debugPort}/json/list`).then(r => r.json());
const target = targets.find(item => item.type === 'page');
if (!target) throw new Error('Start Chrome with remote debugging on port 9223.');
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
let id = 0;
const pending = new Map();
const errors = [];
socket.onmessage = event => {
  const message = JSON.parse(event.data);
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails?.text || 'exception');
  const item = pending.get(message.id);
  if (item) { pending.delete(message.id); message.error ? item.reject(message.error) : item.resolve(message.result); }
};
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const callId = ++id;
  pending.set(callId, { resolve, reject });
  socket.send(JSON.stringify({ id: callId, method, params }));
});
const evaluate = async expression => {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true, userGesture: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
};
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
await send('Runtime.enable');
await send('Page.enable');
await send('Console.enable');
socket.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (message.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(message.params.type)) {
    errors.push(message.params.args.map(arg => arg.value || arg.description || arg.type).join(' '));
  }
});
const prefix = process.argv[2] || 'before';
const sizes = [
  { name: 'desktop', width: 1440, height: 1000, mobile: false },
  { name: 'mobile', width: 390, height: 844, mobile: true }
];
const views = ['home', 'melody', 'drums', 'chords', 'vocals', 'mix', 'export', 'settings'];
await mkdir('scratch/audit', { recursive: true });
const notes = [];
try {
  for (const size of sizes) {
    await send('Emulation.setDeviceMetricsOverride', { width: size.width, height: size.height, deviceScaleFactor: 1, mobile: size.mobile });
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/' });
    await delay(700);
    for (let i = 0; i < 40; i++) {
      if (await evaluate('!!document.querySelector("#stage")')) break;
      await delay(100);
    }
    for (const view of views) {
      await evaluate(`document.querySelector('.tools [data-view="${view}"], .sidebar-bottom [data-view="${view}"]')?.click()`);
      await delay(220);
      const metrics = await evaluate(`JSON.stringify({
        view: ${JSON.stringify(view)},
        scrollW: document.documentElement.scrollWidth,
        innerW: innerWidth,
        stage: (document.querySelector('#stage')?.innerText || '').slice(0, 280),
        purpleHits: [...document.querySelectorAll('*')].slice(0, 0)
      })`);
      notes.push({ size: size.name, ...JSON.parse(metrics) });
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      await writeFile(`scratch/audit/${prefix}-${size.name}-${view}.png`, Buffer.from(shot.data, 'base64'));
    }
    await evaluate(`document.querySelector('.library')?.click()`);
    await delay(400);
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    await writeFile(`scratch/audit/${prefix}-${size.name}-library.png`, Buffer.from(shot.data, 'base64'));
    await evaluate(`document.querySelector('#close-library')?.click()`);
  }
  console.log(JSON.stringify({ shots: notes.length + 2, errors, overflow: notes.filter(n => n.scrollW > n.innerW + 8).map(n => `${n.size}:${n.view}:${n.scrollW}`) }, null, 2));
} finally {
  socket.close();
}
