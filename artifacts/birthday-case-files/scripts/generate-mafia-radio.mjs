import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const sampleRate = 44100;
const bpm = 72;
const beatSeconds = 60 / bpm;
const beats = 32;
const duration = beatSeconds * beats;
const sampleCount = Math.round(sampleRate * duration);
const left = new Float32Array(sampleCount);
const right = new Float32Array(sampleCount);

const chords = [
  { notes: [48, 51, 55, 62], bass: [36, 43, 46, 43] }, // Cm9
  { notes: [44, 48, 51, 55], bass: [32, 39, 43, 39] }, // Abmaj7
  { notes: [50, 53, 56, 60], bass: [38, 45, 48, 45] }, // Dm7b5
  { notes: [43, 47, 50, 53, 56], bass: [31, 38, 41, 38] }, // G7b9
];

const midiFrequency = (note) => 440 * 2 ** ((note - 69) / 12);
const panGains = (pan) => [Math.cos(((pan + 1) * Math.PI) / 4), Math.sin(((pan + 1) * Math.PI) / 4)];

function addVoice({ beat, note, length, gain, pan = 0, voice = 'piano', delay = 0 }) {
  const start = Math.round((beat * beatSeconds + delay) * sampleRate);
  const count = Math.min(Math.round(length * beatSeconds * sampleRate), sampleCount - start);
  const [panLeft, panRight] = panGains(pan);
  const baseFrequency = midiFrequency(note);

  for (let i = 0; i < count; i++) {
    const t = i / sampleRate;
    const phase = 2 * Math.PI * baseFrequency * t;
    let tone;
    let envelope;

    if (voice === 'bass') {
      tone = Math.sin(phase) * 0.76 + Math.sin(phase * 2) * 0.17 + Math.sin(phase * 3) * 0.07;
      envelope = Math.exp(-t / 0.33) * Math.min(1, t / 0.008);
    } else if (voice === 'brass') {
      const vibrato = Math.sin(2 * Math.PI * 4.7 * t) * 0.006;
      const vibratingPhase = phase + vibrato * phase;
      tone =
        Math.sin(vibratingPhase) * 0.65 +
        Math.sin(vibratingPhase * 2) * 0.22 +
        Math.sin(vibratingPhase * 3) * 0.09 +
        Math.sin(vibratingPhase * 4) * 0.04;
      envelope = Math.min(1, t / 0.055) * Math.min(1, (length * beatSeconds - t) / 0.16);
    } else {
      tone = Math.sin(phase) * 0.78 + Math.sin(phase * 2) * 0.16 + Math.sin(phase * 3) * 0.06;
      envelope = Math.exp(-t / 0.29) * Math.min(1, t / 0.004);
    }

    const sample = tone * Math.max(0, envelope) * gain;
    const index = start + i;
    left[index] += sample * panLeft;
    right[index] += sample * panRight;
  }
}

let noiseState = 0x51f15e;
function randomNoise() {
  noiseState = (noiseState * 16807) % 2147483647;
  return (noiseState / 1073741823.5) - 1;
}

function addBrush(beat, gain, durationSeconds, pan = 0) {
  const start = Math.round(beat * beatSeconds * sampleRate);
  const count = Math.min(Math.round(durationSeconds * sampleRate), sampleCount - start);
  const [panLeft, panRight] = panGains(pan);
  let previous = 0;

  for (let i = 0; i < count; i++) {
    const noise = randomNoise();
    const filtered = noise - previous * 0.72;
    previous = noise;
    const t = i / sampleRate;
    const sample = filtered * Math.exp(-t / 0.042) * gain;
    const index = start + i;
    left[index] += sample * panLeft;
    right[index] += sample * panRight;
  }
}

function addKick(beat) {
  const start = Math.round(beat * beatSeconds * sampleRate);
  const count = Math.min(Math.round(0.22 * sampleRate), sampleCount - start);
  for (let i = 0; i < count; i++) {
    const t = i / sampleRate;
    const frequency = 74 - 32 * Math.min(1, t / 0.14);
    const sample = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t / 0.075) * 0.065;
    left[start + i] += sample * 0.707;
    right[start + i] += sample * 0.707;
  }
}

for (let beat = 0; beat < beats; beat++) {
  const bar = Math.floor(beat / 4);
  const chord = chords[Math.floor(bar / 2)];
  const beatInBar = beat % 4;
  addVoice({
    beat,
    note: chord.bass[beatInBar],
    length: 0.72,
    gain: 0.18,
    voice: 'bass',
  });

  if (beatInBar === 0 || beatInBar === 2) {
    chord.notes.forEach((note, index) => {
      addVoice({
        beat,
        note,
        length: 0.68,
        gain: 0.042,
        pan: -0.22,
        delay: index * 0.012,
      });
    });
  }

  if (beatInBar === 0 || beatInBar === 2) addKick(beat);
  if (beatInBar === 1 || beatInBar === 3) addBrush(beat, 0.035, 0.24, 0.12);
  addBrush(beat + 0.5, 0.007, 0.085, beat % 2 ? 0.35 : -0.35);
}

const melody = [
  [0, 67, 1.1], [1.5, 70, 0.55], [3, 72, 0.85],
  [4.5, 75, 0.9], [6, 74, 0.55], [7, 72, 0.95],
  [9, 70, 1.1], [11, 67, 0.7], [12, 65, 0.9],
  [14, 67, 0.65], [15, 70, 0.75], [17, 74, 1.1],
  [18.5, 75, 0.8], [20, 74, 0.7], [21, 72, 0.9],
  [23, 70, 1.05], [24.5, 67, 0.8], [26, 65, 0.85],
  [28, 67, 0.8], [29.5, 70, 0.8], [31, 67, 0.75],
];

for (const [beat, note, length] of melody) {
  addVoice({ beat, note, length, gain: 0.082, pan: 0.18, voice: 'brass' });
}

for (let i = 0; i < sampleCount; i++) {
  const t = i / sampleRate;
  const fadeIn = Math.min(1, t / 0.18);
  const fadeOut = Math.min(1, (duration - t) / 0.35);
  const envelope = fadeIn * fadeOut;
  const l = Math.tanh(left[i] * 1.45) * envelope;
  const r = Math.tanh(right[i] * 1.45) * envelope;
  left[i] = Math.max(-1, Math.min(1, l));
  right[i] = Math.max(-1, Math.min(1, r));
}

const dataSize = sampleCount * 4;
const wav = Buffer.alloc(44 + dataSize);
wav.write('RIFF', 0);
wav.writeUInt32LE(36 + dataSize, 4);
wav.write('WAVE', 8);
wav.write('fmt ', 12);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(2, 22);
wav.writeUInt32LE(sampleRate, 24);
wav.writeUInt32LE(sampleRate * 4, 28);
wav.writeUInt16LE(4, 32);
wav.writeUInt16LE(16, 34);
wav.write('data', 36);
wav.writeUInt32LE(dataSize, 40);

for (let i = 0; i < sampleCount; i++) {
  wav.writeInt16LE(Math.round(left[i] * 32767), 44 + i * 4);
  wav.writeInt16LE(Math.round(right[i] * 32767), 46 + i * 4);
}

const outputPath = fileURLToPath(new URL('../public/mafia-radio.wav', import.meta.url));
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, wav);
console.info(`Wrote ${duration.toFixed(1)} seconds of original instrumental radio music to ${outputPath}`);
