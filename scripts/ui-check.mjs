const debugPort = process.env.BMAI_DEBUG_PORT || '9223';
const targets = await fetch(`http://127.0.0.1:${debugPort}/json/list`).then(r => r.json());
const target = targets.find(item => item.type === 'page');
if (!target) throw new Error('Chrome debugging port is not open.');
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
let id = 0;
const pending = new Map();
socket.onmessage = event => {
  const message = JSON.parse(event.data);
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
try {
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/' });
  await delay(800);
  await evaluate(`document.querySelector('.tools [data-view="drums"]').click()`);
  await delay(200);
  const help = await evaluate(`(() => {
    const button = document.querySelector('[data-open-guide="drums"]');
    button.focus();
    button.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    const tip = document.querySelector('#bmai-tip');
    const rect = tip.getBoundingClientRect();
    return { active: document.activeElement?.className || '', text: tip.textContent, hidden: tip.hidden, top: rect.top, left: rect.left, inView: rect.top >= 0 && rect.left >= 0 && rect.bottom <= innerHeight && rect.right <= innerWidth };
  })()`);
  await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`);
  await delay(30);
  const afterEsc = await evaluate(`document.querySelector('#bmai-tip').hidden`);
  const lane = await evaluate(`(() => {
    const remove = document.querySelector('[data-reset-sample="kick"]');
    const add = document.querySelector('[data-pick-lane="snare"] .sample-name');
    return {
      remove: remove ? remove.textContent : null,
      removeOverflow: remove ? remove.scrollWidth > remove.clientWidth + 1 : null,
      add: add?.textContent || null
    };
  })()`);
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await delay(200);
  const mobile = await evaluate(`JSON.stringify({
    doc: document.documentElement.scrollWidth,
    view: innerWidth,
    transport: document.querySelector('.transport').scrollWidth,
    tools: document.querySelector('.tools').scrollWidth,
    key: document.querySelector('#key-value').textContent
  })`);
  const unnamed = await evaluate(`[...document.querySelectorAll('button')].filter(b => !b.getAttribute('aria-label') && !b.textContent.trim() && b.offsetParent).map(b => b.id || b.className).slice(0, 12)`);
  console.log(JSON.stringify({ help, afterEsc, lane, mobile: JSON.parse(mobile), unnamed }, null, 2));
} finally { socket.close(); }
