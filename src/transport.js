// One timing definition for live playback, fallback scheduling, and export.
// Tone 15 moves an odd sixteenth by 2/3 of its length times Transport.swing.
const TONE_SWING_SCALE = 0.65;

export function normalizedBpm(value) {
  const bpm = Number(value);
  return Number.isFinite(bpm) && bpm > 0 ? Math.max(40, Math.min(240, bpm)) : 92;
}

export function sixteenthSeconds(bpm) {
  return 15 / normalizedBpm(bpm);
}

export function toneSwingAmount(swing) {
  const value = Number(swing);
  return (Number.isFinite(value) ? Math.max(0, Math.min(60, value)) : 0) / 100 * TONE_SWING_SCALE;
}

export function swingOffsetSeconds(step, bpm, swing) {
  return step % 2 === 1 ? sixteenthSeconds(bpm) * (2 / 3) * toneSwingAmount(swing) : 0;
}

export function stepOffsetSeconds(step, bpm, swing) {
  return step * sixteenthSeconds(bpm) + swingOffsetSeconds(step, bpm, swing);
}

export function melodyDurationSeconds(width, bpm) {
  const step = sixteenthSeconds(bpm);
  return Math.max(step * 0.75, Number(width) * step * 0.92);
}

export function melodyGain(step, trackVolume) {
  const accent = step % 8 === 0 ? 1 : step % 4 === 0 ? 0.84 : 0.66;
  return 0.14 * accent * trackVolume;
}

export function rollGainMultiplier(roll, index) {
  return roll > 1 ? 0.85 + 0.15 * (index / roll) : 1;
}
