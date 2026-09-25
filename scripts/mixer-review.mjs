import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.BMAI_REVIEW_URL || 'http://127.0.0.1:5174';
const debug = process.env.BMAI_DEBUG_PORT || '9223';
async function connect(url) {
  const socket = new WebSocket(url);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let id = 0;
  const pending = new Map();
  const errors = [];
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if(message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails);
    const entry = pending.get(message.id);
    if(entry) {
      pending.delete(message.id);
      message.error ? entry.reject(message.error) : entry.resolve(message.result);
    }
  };
  return { socket, errors, send: (method, params = {}) => new Promise((resolve, reject) => {
    pending.set(++id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  }) };
}
const version = await fetch(`http://127.0.0.1:${debug}/json/version`).then(r => r.json());
const browser = await connect(version.webSocketDebuggerUrl);
const { browserContextId } = await browser.send('Target.createBrowserContext');
let page;
try {
  const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank', browserContextId });
  const targets = await fetch(`http://127.0.0.1:${debug}/json/list`).then(r => r.json());
  page = await connect(targets.find(target => target.id === targetId).webSocketDebuggerUrl);
  const evaluate = async expression => {
    const result = await page.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true, userGesture: true });
    if(result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  };
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  const input = (selector, value, event = 'input') => evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    element.value = ${JSON.stringify(value)};
    element.dispatchEvent(new Event(${JSON.stringify(event)}, { bubbles: true }));
  })()`);
  await page.send('Runtime.enable');
  await page.send('Page.enable');
  await page.send('Page.addScriptToEvaluateOnNewDocument', { source: "localStorage.setItem('bmai-welcome-seen','1');localStorage.setItem('bmai-tour-seen','1')" });
  await page.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await page.send('Page.navigate', { url: base });
  for(let i=0; i<100; i++) {
    if(await evaluate('!!document.querySelector("#create-project")')) break;
    await delay(100);
  }
  await input('#new-project-name', 'Mixer layout review');
  await click('#create-project');
  await click('.tools [data-view="mix"]');
  assert.equal(await evaluate('document.querySelectorAll(".mixer-page .channel-strip").length'), 4);
  await input('[data-vol="keys"]', '42');
  await input('[data-group-vol="music"]', '0');
  await click('[data-mute="keys"]');
  assert.equal(await evaluate('document.querySelector("[data-group-vol=music]").value'), '0');
  assert.equal(await evaluate('document.querySelector("[data-vol=keys]").value'), '42');
  assert.equal(await evaluate('document.querySelector("[data-mute=keys]").getAttribute("aria-pressed")'), 'true');
  await click('[data-mute="keys"]');
  await click('[data-mixer-panel="monitoring"] summary');
  await delay(100);
  await click('[data-toggle-cue]');
  assert.equal(await evaluate('document.querySelector("[data-mixer-panel=monitoring]").open'), true);
  await input('[data-fx-track]', 'chords', 'change');
  await click('[data-track-fx-add="eq"]');
  assert.equal(await evaluate('document.querySelector("[data-fx-track]").value'), 'chords');
  assert.equal(await evaluate('document.querySelector("#track-fx-list [data-track-fx-bypass]").dataset.trackFxBypass'), 'chords');
  await mkdir('scratch', { recursive: true });
  for(const [name,width,height] of [['desktop',1440,1000],['laptop',1024,768],['mobile',390,844]]) {
    await page.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width<600 });
    for(let i=0; i<50; i++) {
      if(await evaluate('innerWidth') === width) break;
      await delay(100);
    }
    await delay(250);
    const metrics = await evaluate(`(() => {
      const mixer=document.querySelector('.mixer-page'), console=mixer.querySelector('.mix-console');
      return { viewport:innerWidth, document:document.documentElement.scrollWidth, mixer:mixer.getBoundingClientRect().width, faders:console.getBoundingClientRect().top };
    })()`);
    assert.ok(metrics.document <= width + 1, `${name} overflows: ${JSON.stringify(metrics)}`);
    const shot = await page.send('Page.captureScreenshot', { format: 'png' });
    await writeFile(`scratch/mixer-${name}.png`, Buffer.from(shot.data,'base64'));
    console.log(name, metrics);
  }
  assert.deepEqual(page.errors, []);
  console.log('PASS: volume, mute, zero bus level, disclosure state, insert selection, responsive layout; no browser exceptions');
} finally {
  page?.socket.close();
  await browser.send('Target.disposeBrowserContext', { browserContextId });
  browser.socket.close();
}
