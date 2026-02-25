// Sustained detuned oscillators with slow LFO modulation

import { midiToFreq } from '../scales.js';

export function createDroneLayer(audioContext, destination, analyserNode) {
  const output = audioContext.createGain();
  output.gain.value = 0;
  output.connect(analyserNode);
  output.connect(destination);

  let oscillators = [];
  let lfo = null;
  let lfoGain = null;
  let currentConfig = null;

  function start(config) {
    stop();
    currentConfig = config;

    const { rootMidi, detuneCents = 8, waveform = 'sine', gain = 0.15 } = config;
    const baseFreq = midiToFreq(rootMidi);

    // Create 3 detuned oscillators
    const detunes = [-detuneCents, 0, detuneCents];
    oscillators = detunes.map(d => {
      const osc = audioContext.createOscillator();
      osc.type = waveform;
      osc.frequency.value = baseFreq;
      osc.detune.value = d;

      const oscGain = audioContext.createGain();
      oscGain.gain.value = gain / 3;
      osc.connect(oscGain);
      oscGain.connect(output);
      osc.start();
      return { osc, gain: oscGain };
    });

    // LFO on master gain
    lfo = audioContext.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.03 + Math.random() * 0.02; // 0.03-0.05 Hz
    lfoGain = audioContext.createGain();
    lfoGain.gain.value = gain * 0.3;
    lfo.connect(lfoGain);
    lfoGain.connect(output.gain);
    lfo.start();

    // Fade in
    output.gain.setValueAtTime(0, audioContext.currentTime);
    output.gain.linearRampToValueAtTime(1, audioContext.currentTime + 3);
  }

  function crossfadeTo(newRootMidi, duration = 15) {
    if (!oscillators.length) return;

    const newFreq = midiToFreq(newRootMidi);
    const now = audioContext.currentTime;

    oscillators.forEach(({ osc }) => {
      osc.frequency.linearRampToValueAtTime(newFreq, now + duration);
    });
  }

  function stop() {
    const now = audioContext.currentTime;
    output.gain.linearRampToValueAtTime(0, now + 2);

    const oscs = oscillators;
    const l = lfo;
    setTimeout(() => {
      oscs.forEach(({ osc }) => { try { osc.stop(); } catch {} });
      if (l) try { l.stop(); } catch {}
    }, 2500);

    oscillators = [];
    lfo = null;
    lfoGain = null;
  }

  function setGain(val) {
    output.gain.linearRampToValueAtTime(val, audioContext.currentTime + 0.5);
  }

  return { start, stop, crossfadeTo, setGain, output };
}
