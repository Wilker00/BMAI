// FL Studio QWERTY Typing Keyboard to Piano System
// Maps standard computer keyboard keys to musical notes
// White keys: Z X C V B N M (lower octave) and Q W E R T Y U I (upper octave)
// Black keys: S D G H J (lower sharps) and 2 3 5 6 7 (upper sharps)

export const KEYBOARD_NOTE_MAP = {
  // Lower Octave
  'z': { note: 'C', octaveOffset: 0 },
  's': { note: 'C#', octaveOffset: 0 },
  'x': { note: 'D', octaveOffset: 0 },
  'd': { note: 'D#', octaveOffset: 0 },
  'c': { note: 'E', octaveOffset: 0 },
  'v': { note: 'F', octaveOffset: 0 },
  'g': { note: 'F#', octaveOffset: 0 },
  'b': { note: 'G', octaveOffset: 0 },
  'h': { note: 'G#', octaveOffset: 0 },
  'n': { note: 'A', octaveOffset: 0 },
  'j': { note: 'A#', octaveOffset: 0 },
  'm': { note: 'B', octaveOffset: 0 },

  // Upper Octave
  'q': { note: 'C', octaveOffset: 1 },
  '2': { note: 'C#', octaveOffset: 1 },
  'w': { note: 'D', octaveOffset: 1 },
  '3': { note: 'D#', octaveOffset: 1 },
  'e': { note: 'E', octaveOffset: 1 },
  'r': { note: 'F', octaveOffset: 1 },
  '5': { note: 'F#', octaveOffset: 1 },
  't': { note: 'G', octaveOffset: 1 },
  '6': { note: 'G#', octaveOffset: 1 },
  'y': { note: 'A', octaveOffset: 1 },
  '7': { note: 'A#', octaveOffset: 1 },
  'u': { note: 'B', octaveOffset: 1 },
  'i': { note: 'C', octaveOffset: 2 }
};

export class FlTypingKeyboard {
  constructor({ baseOctave = 4, onNoteDown = null, onNoteUp = null } = {}) {
    this.baseOctave = baseOctave;
    this.enabled = true;
    this.onNoteDown = onNoteDown;
    this.onNoteUp = onNoteUp;
    this.activeKeys = new Set();
    this.boundKeyDown = this._handleKeyDown.bind(this);
    this.boundKeyUp = this._handleKeyUp.bind(this);
  }

  attach() {
    window.addEventListener('keydown', this.boundKeyDown);
    window.addEventListener('keyup', this.boundKeyUp);
  }

  detach() {
    window.removeEventListener('keydown', this.boundKeyDown);
    window.removeEventListener('keyup', this.boundKeyUp);
    this.activeKeys.clear();
  }

  toggle(forceState) {
    this.enabled = typeof forceState === 'boolean' ? forceState : !this.enabled;
    if (!this.enabled) this.activeKeys.clear();
    return this.enabled;
  }

  setBaseOctave(octave) {
    this.baseOctave = Math.max(1, Math.min(7, octave));
  }

  _isInputElement(target) {
    if (!target) return false;
    const tag = target.tagName ? target.tagName.toLowerCase() : '';
    return tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable;
  }

  _handleKeyDown(event) {
    if (!this.enabled) return;
    if (this._isInputElement(event.target)) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    const key = event.key.toLowerCase();
    const mapping = KEYBOARD_NOTE_MAP[key];
    if (!mapping) return;

    if (this.activeKeys.has(key)) return; // Prevent key repeat
    this.activeKeys.add(key);

    const fullNote = `${mapping.note}${this.baseOctave + mapping.octaveOffset}`;
    if (this.onNoteDown) {
      this.onNoteDown(fullNote, key);
    }
  }

  _handleKeyUp(event) {
    if (!this.enabled) return;
    if (this._isInputElement(event.target)) return;

    const key = event.key.toLowerCase();
    if (!this.activeKeys.has(key)) return;
    this.activeKeys.delete(key);

    const mapping = KEYBOARD_NOTE_MAP[key];
    if (!mapping) return;

    const fullNote = `${mapping.note}${this.baseOctave + mapping.octaveOffset}`;
    if (this.onNoteUp) {
      this.onNoteUp(fullNote, key);
    }
  }

  renderVisualStrip() {
    return `<div class="fl-typing-strip ${this.enabled ? 'active' : ''}" id="fl-typing-strip" title="Typing keyboard to piano (Ctrl+T): Play notes using computer keys">
      <span class="fl-typing-badge">KEYB</span>
      <span class="fl-typing-octave">OCT ${this.baseOctave}</span>
      <div class="fl-typing-keys-hint">
        <span class="fl-key-guide">Z-M: Oct ${this.baseOctave}</span>
        <span class="fl-key-guide">Q-I: Oct ${this.baseOctave + 1}</span>
      </div>
    </div>`;
  }
}
