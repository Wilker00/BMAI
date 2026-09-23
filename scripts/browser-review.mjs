import { writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

// Run against an isolated Chrome profile with --remote-debugging-port=9223.
const debugPort = process.env.BMAI_DEBUG_PORT || '9223';
const targets = await fetch(`http://127.0.0.1:${debugPort}/json/list`).then(r => r.json());
const target = targets.find(item => item.type === 'page');
if(!target) throw new Error('Start an isolated Chrome browser on debugging port 9223.');
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
let id = 0;
const pending = new Map();
const errors = [];
socket.onmessage = event => {
  const message = JSON.parse(event.data);
  if(message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails);
  const item = pending.get(message.id);
  if(item) { pending.delete(message.id); message.error ? item.reject(message.error) : item.resolve(message.result); }
};
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const callId = ++id;
  pending.set(callId, { resolve, reject });
  socket.send(JSON.stringify({ id: callId, method, params }));
});
const evaluate = async expression => {
  const result = await send('Runtime.evaluate', { expression, awaitPromise:true, returnByValue:true, userGesture:true });
  if(result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
};
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(expression) {
  for(let i = 0; i < 100; i++) { if(await evaluate(expression)) return; await delay(100); }
  throw new Error(`Timed out: ${expression}`);
}
try {
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate', {url:'http://127.0.0.1:5173/'});
  await until('!!document.querySelector("#stage")');
  if(process.argv.includes('--verify')) {
    const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
    const project = () => evaluate('JSON.parse(localStorage.getItem("bmai-project"))');
    const captureDownloads = () => evaluate(`window.__downloads = []; HTMLAnchorElement.prototype.click = function(){
      if(this.download && this.href.startsWith('blob:')) { const name=this.download; fetch(this.href).then(r=>r.blob()).then(async blob=>window.__downloads.push({name,type:blob.type,bytes:Array.from(new Uint8Array(await blob.arrayBuffer()))})); }
    }`);
    await click('#go-home');
    await evaluate('document.querySelector("#new-project-name").value="Review persistence A"');
    await click('#create-project');
    const originalId = (await project()).id;
    await click('.tool[data-view="drums"]');
    await until('!!document.querySelector("[data-lane-drop=kick]")');
    await evaluate(`(async()=>{
      const blob = await fetch('/sounds/0x808/909/snare.wav').then(r=>r.blob());
      const data = new DataTransfer(); data.items.add(new File([blob], 'review-custom.wav', {type:'audio/wav'}));
      document.querySelector('[data-lane-drop="kick"]').dispatchEvent(new DragEvent('drop',{bubbles:true,dataTransfer:data}));
    })()`);
    await until('JSON.parse(localStorage.getItem("bmai-project"))?.customSampleAssets?.kick?.startsWith("bmai-asset:")');
    await click('#add-drums');
    await click('.tool[data-view="vocals"]');
    await evaluate(`(async()=>{
      const blob = await fetch('/sounds/0x808/909/snare.wav').then(r=>r.blob());
      const data = new DataTransfer(); data.items.add(new File([blob], 'review-vocal.wav', {type:'audio/wav'}));
      const input=document.querySelector('#vocal-file-input'); input.files=data.files; input.dispatchEvent(new Event('change',{bubbles:true}));
    })()`);
    await until('JSON.parse(localStorage.getItem("bmai-project"))?.vocals?.url?.startsWith("bmai-asset:")');
    await click('#add-vocal');
    const before = await project();
    assert.equal(before.drumsAdded, true);
    assert.equal(before.vocalAdded, true);
    await send('Page.reload');
    await delay(300);
    await until('!!document.querySelector("#stage") && document.querySelector("#project-title").textContent==="Review persistence A"');
    const after = await project();
    assert.equal(after.customSampleAssets.kick, before.customSampleAssets.kick);
    assert.equal(after.vocals.url, before.vocals.url);
    const sizes = await evaluate(`(async()=>{
      const {resolveAudioAsset}=await import('/src/project-storage.js'); const p=JSON.parse(localStorage.getItem('bmai-project'));
      return Promise.all([p.customSampleAssets.kick,p.vocals.url].map(async ref=>(await resolveAudioAsset(ref)).size));
    })()`);
    assert.ok(sizes.every(size => size > 44));
    console.log('PASS: uploaded drums and vocals survive page reload with durable bytes');

    await click('#go-export');
    await captureDownloads();
    await click('#export-json');
    await until('window.__downloads?.length === 1');
    const backupDownload = await evaluate('window.__downloads[0]');
    const backup = JSON.parse(Buffer.from(backupDownload.bytes).toString());
    assert.equal(Object.keys(backup.audioAssets).length, 2);
    assert.equal(backup.drumsAdded, true);
    assert.equal(backup.vocalAdded, true);

    // Simulate a different device by removing only this isolated test profile's
    // audio database. The imported backup must reconstruct every media file.
    await evaluate(`new Promise((resolve,reject)=>{const r=indexedDB.deleteDatabase('bmai-audio-assets');r.onsuccess=()=>resolve(true);r.onerror=()=>reject(r.error);})`);
    await evaluate(`window.__backup=${JSON.stringify(backup)}`);
    await evaluate(`(()=>{const d=new DataTransfer();d.items.add(new File([JSON.stringify(window.__backup)],'review.bmai.json',{type:'application/json'}));const i=document.querySelector('#import-json-file');i.files=d.files;i.dispatchEvent(new Event('change',{bubbles:true}));})()`);
    await until(`JSON.parse(localStorage.getItem('bmai-project'))?.id !== ${JSON.stringify(originalId)}`);
    const imported = await project();
    assert.equal(imported.drumsAdded, true);
    assert.equal(imported.vocalAdded, true);
    assert.notEqual(imported.customSampleAssets.kick, before.customSampleAssets.kick);
    assert.ok(await evaluate(`(async()=>{const {resolveAudioAsset}=await import('/src/project-storage.js');return (await resolveAudioAsset(${JSON.stringify(imported.vocals.url)})).size>44})()`));
    console.log('PASS: downloaded project restores media in an empty audio database without overwriting original project');

    // Malformed import must leave the active project unchanged.
    await evaluate(`(()=>{const d=new DataTransfer();d.items.add(new File(['{"pattern":[],"drums":{},"bpm":-20}'],'bad.json'));const i=document.querySelector('#import-json-file');i.files=d.files;i.dispatchEvent(new Event('change',{bubbles:true}));})()`);
    await until('document.querySelector(".toast").textContent.includes("Could not import project")');
    assert.equal((await project()).id, imported.id);
    console.log('PASS: malformed import preserves active project');

    await click('#go-home');
    await evaluate('document.querySelector("#new-project-name").value="Review clean B"');
    await click('#create-project');
    const fresh = await project();
    assert.deepEqual(fresh.customSampleAssets, {});
    assert.equal(fresh.vocals.url, undefined);
    assert.equal(fresh.songMode, false);
    assert.deepEqual(fresh.eq,{low:0,mid:0,high:0});
    await click('.tool[data-view="drums"]');
    assert.equal(await evaluate('document.querySelector("[data-pick-lane=kick] .sample-name").textContent'), 'Add sample');
    await click('#go-home');
    await click(`[data-open-project="${imported.id}"]`);
    await click('.tool[data-view="drums"]');
    assert.equal(await evaluate('document.querySelector("[data-pick-lane=kick] .sample-name").textContent'), 'Replace');
    console.log('PASS: new projects start clean and reopening restores their own samples');

    for(const view of ['melody','drums','chords','vocals','mix','export','settings','home']) {
      await click(`.tools [data-view="${view}"]`);
      await delay(120);
      assert.ok(await evaluate('document.querySelector("#stage").textContent.length>20'));
    }
    await click('#go-export');
    await captureDownloads();
    await click('#export-wav-master');
    await until('window.__downloads?.some(d=>d.name.endsWith(".wav"))');
    const wav = await evaluate('window.__downloads.find(d=>d.name.endsWith(".wav"))');
    assert.equal(Buffer.from(wav.bytes.slice(0,4)).toString(), 'RIFF');
    assert.ok(wav.bytes.length > 100000);
    await click('#export-midi');
    await until('window.__downloads?.some(d=>d.name.endsWith(".mid"))');
    const midi = await evaluate('window.__downloads.find(d=>d.name.endsWith(".mid"))');
    assert.equal(Buffer.from(midi.bytes.slice(0,4)).toString(),'MThd');
    console.log('PASS: all eight views render; WAV and MIDI export valid container headers');
    await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
    await delay(150);
    console.log('Mobile layout:',await evaluate('JSON.stringify({viewport:innerWidth,document:document.documentElement.scrollWidth})'));
    await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  }
  if(process.argv.includes('--smoke')) {
    console.log(await evaluate('JSON.stringify({title:document.title,buttons:[...document.querySelectorAll("#stage button")].map(b=>({id:b.id,text:b.innerText})),body:document.querySelector("#stage").innerText.slice(0,2500)})'));
  }
  if(process.argv.includes('--drumchord')) {
    const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
    const project = () => evaluate('JSON.parse(localStorage.getItem("bmai-project"))');
    await evaluate('document.querySelector("#new-project-name").value="Drum chord runtime"');
    await click('#create-project');
    await click('.tool[data-view="drums"]');
    await until('!!document.querySelector("[data-lane=kick][data-step=0]")');
    const initial = await project();
    const kickBefore = initial.drums.kick || [];
    await click('[data-lane="kick"][data-step="1"]');
    const edited = await project();
    if((edited.drums.kick || []).includes(1) === (kickBefore || []).includes(1)) throw new Error('Drum step edit did not persist');
    await click('#humanize-drums');
    await delay(120);
    if(!(await project()).drumsAdded) throw new Error('Humanized drum pattern did not become active');
    await click('#add-drums');
    await click('.tool[data-view="chords"]');
    await until('!!document.querySelector("[data-chord]")');
    const firstChord = await evaluate('document.querySelector("[data-chord]").dataset.chord');
    await click('[data-chord]');
    await click('#add-chords');
    const withChord = await project();
    if(!withChord.chordAdded || !Array.isArray(withChord.chords?.bars) || withChord.chords.bars.length < 4) throw new Error('Chord selection did not persist a valid progression');
    await click('#play');
    await delay(700);
    const runtime = await evaluate('JSON.stringify({playing:document.querySelector("#play")?.classList.contains("is-playing"),audioState:window.__bmaiAudioState||null,playhead:document.querySelector("#playhead")?.style.left})');
    await click('#stop');
    await click('.tool[data-view="export"]');
    await click('#export-midi');
    await delay(300);
    console.log(JSON.stringify({firstChord,runtime,project:(await project())}));
  }
  if(process.argv.includes('--gallery')) {
    const views = ['home','melody','drums','chords','vocals','mix','export','settings'];
    for(const view of views){
      await evaluate(`document.querySelector('.tools [data-view="${view}"]')?.click()`);
      await delay(180);
      const capture = await send('Page.captureScreenshot', {format:'png'});
      await writeFile(`scratch/bmai-${view}.png`, Buffer.from(capture.data, 'base64'));
    }
  }
  const shot = await send('Page.captureScreenshot', {format:'png'});
  await writeFile('scratch/bmai-review-desktop.png', Buffer.from(shot.data, 'base64'));
  console.log(JSON.stringify({browserErrors:errors}));
  if(errors.length) process.exitCode = 1;
} finally { socket.close(); }
