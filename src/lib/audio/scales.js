// Musical scales and frequency mapping

// Semitone intervals from root
export const SCALES = {
  'minor-pentatonic': [0, 3, 5, 7, 10],
  'major-pentatonic': [0, 2, 4, 7, 9],
  'dorian':           [0, 2, 3, 5, 7, 9, 10],
  'mixolydian':       [0, 2, 4, 5, 7, 9, 10],
  'whole-tone':       [0, 2, 4, 6, 8, 10],
};

// Note name to MIDI number (octave 4)
const NOTE_MAP = { C: 60, Db: 61, D: 62, Eb: 63, E: 64, F: 65, Gb: 66, G: 67, Ab: 68, A: 69, Bb: 70, B: 71 };

export function noteToMidi(name, octave = 4) {
  return NOTE_MAP[name] + (octave - 4) * 12;
}

export function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function noteToFreq(name, octave = 4) {
  return midiToFreq(noteToMidi(name, octave));
}

// Get all frequencies in a scale across octave range
export function getScaleFrequencies(rootNote, scaleName, octaveLow = 3, octaveHigh = 5) {
  const intervals = SCALES[scaleName];
  if (!intervals) return [];

  const rootMidi = noteToMidi(rootNote, 0);
  const freqs = [];

  for (let oct = octaveLow; oct <= octaveHigh; oct++) {
    for (const interval of intervals) {
      const midi = rootMidi + oct * 12 + interval;
      freqs.push({ midi, freq: midiToFreq(midi) });
    }
  }

  return freqs;
}

// Pick a note from scale with weighted random (favors 1, 3, 5)
export function pickScaleNote(rootNote, scaleName, octaveLow = 3, octaveHigh = 5) {
  const intervals = SCALES[scaleName];
  if (!intervals) return null;

  // Weight: first degree = 3, third/fifth = 2, others = 1
  const weights = intervals.map((_, i) => {
    if (i === 0) return 3;
    if (i === 2 || i === 4) return 2;
    return 1;
  });

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * totalWeight;
  let degreeIndex = 0;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) { degreeIndex = i; break; }
  }

  const octave = octaveLow + Math.floor(Math.random() * (octaveHigh - octaveLow + 1));
  const midi = noteToMidi(rootNote, octave) + intervals[degreeIndex];
  return { midi, freq: midiToFreq(midi) };
}

// Time-of-day root note selection
const WARM_ROOTS = ['C', 'D', 'G', 'A'];
const COOL_ROOTS = ['Eb', 'Ab', 'Bb', 'Db'];

export function getRootForTime(hour = new Date().getHours()) {
  const warmth = 0.5 + 0.5 * Math.cos((hour - 12) * Math.PI / 12);
  const pool = warmth > 0.5 ? WARM_ROOTS : COOL_ROOTS;
  return pool[Math.floor(Math.random() * pool.length)];
}
