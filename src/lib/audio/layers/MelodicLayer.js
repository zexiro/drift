// Sparse evolving melody notes from current scale

import { pickScaleNote, midiToFreq } from '../scales.js';

// ~1047 Hz (C6) — comfortable ceiling for ambient melody
const MAX_MELODY_FREQ = 1050;
const MAX_MELODY_MIDI = 84; // C6

export function createMelodicLayer(audioContext, destination, analyserNode) {
  const output = audioContext.createGain();
  output.gain.value = 0.7;
  output.connect(analyserNode);
  output.connect(destination);

  let schedulerEntry = null;
  let config = null;
  let lastMidi = null;

  function playNote(time) {
    if (!config) return;

    const { rootNote, scaleName, octaveLow = 3, octaveHigh = 5, noteGain = 0.08, waveform = 'sine' } = config;

    // Prefer stepwise motion from last note, clamped to comfortable range
    let note;
    if (lastMidi && Math.random() < 0.65) {
      const step = (Math.random() < 0.5 ? 1 : -1) * (Math.random() < 0.7 ? 1 : 2);
      let targetMidi = lastMidi + step;
      // Clamp to max comfortable frequency
      if (targetMidi > MAX_MELODY_MIDI) targetMidi = lastMidi - Math.abs(step);
      note = { midi: targetMidi, freq: midiToFreq(targetMidi) };
    } else {
      note = pickScaleNote(rootNote, scaleName, octaveLow, octaveHigh);
    }

    if (!note) return;
    // Hard clamp — skip notes above comfortable threshold
    if (note.freq > MAX_MELODY_FREQ) return;
    lastMidi = note.midi;

    // Create note with ADSR envelope
    const osc = audioContext.createOscillator();
    osc.type = waveform;
    osc.frequency.value = note.freq;

    const gain = audioContext.createGain();
    const attack = 0.3 + Math.random() * 0.4;
    const sustain = 1 + Math.random() * 2;
    const release = 1 + Math.random() * 1.5;

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(noteGain, time + attack);
    gain.gain.linearRampToValueAtTime(noteGain * 0.6, time + attack + sustain);
    gain.gain.linearRampToValueAtTime(0, time + attack + sustain + release);

    osc.connect(gain);
    gain.connect(output);
    osc.start(time);
    osc.stop(time + attack + sustain + release + 0.1);
  }

  function start(cfg, scheduler) {
    config = cfg;
    lastMidi = null;

    const interval = () => config.noteInterval || (2 + Math.random() * 6);
    schedulerEntry = scheduler.addCallback(playNote, interval, Math.random() * 3);
  }

  function stop(scheduler) {
    if (schedulerEntry) {
      scheduler.removeCallback(schedulerEntry);
      schedulerEntry = null;
    }
    output.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
    setTimeout(() => output.gain.value = 0.7, 1500);
  }

  function updateConfig(cfg) {
    config = cfg;
    lastMidi = null;
  }

  function setGain(val) {
    output.gain.linearRampToValueAtTime(val, audioContext.currentTime + 0.5);
  }

  return { start, stop, updateConfig, setGain, output };
}
