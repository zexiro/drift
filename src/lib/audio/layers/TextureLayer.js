// Filtered noise atmospherics + optional shimmer

export function createTextureLayer(audioContext, destination, analyserNode) {
  const output = audioContext.createGain();
  output.gain.value = 0;
  output.connect(analyserNode);
  output.connect(destination);

  let noiseSource = null;
  let filter = null;
  let filterLfo = null;
  let shimmerOscs = [];

  function createNoiseBuffer() {
    const size = audioContext.sampleRate * 4;
    const buffer = audioContext.createBuffer(2, size, audioContext.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < size; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    }
    return buffer;
  }

  function start(config) {
    stop();

    const { filterFreq = 800, filterQ = 1.5, gain = 0.12, shimmer = false } = config;

    // Filtered noise
    noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = createNoiseBuffer();
    noiseSource.loop = true;

    filter = audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = filterFreq;
    filter.Q.value = filterQ;

    // Slow LFO on filter frequency — sweep limited to stay warm
    filterLfo = audioContext.createOscillator();
    filterLfo.type = 'sine';
    filterLfo.frequency.value = 0.02 + Math.random() * 0.03;
    const lfoGain = audioContext.createGain();
    lfoGain.gain.value = Math.min(filterFreq * 0.3, 300);
    filterLfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    filterLfo.start();

    const noiseGain = audioContext.createGain();
    noiseGain.gain.value = gain;

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(output);
    noiseSource.start();

    // Optional shimmer: mid-high sines with heavy reverb send
    // Capped at 2400 Hz to stay comfortable
    if (shimmer) {
      for (let i = 0; i < 3; i++) {
        const osc = audioContext.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 800 + Math.random() * 1600;
        osc.detune.value = Math.random() * 10 - 5;
        const g = audioContext.createGain();
        g.gain.value = 0.008;
        // Slow amplitude modulation
        const mod = audioContext.createOscillator();
        mod.type = 'sine';
        mod.frequency.value = 0.05 + Math.random() * 0.1;
        const modGain = audioContext.createGain();
        modGain.gain.value = 0.01;
        mod.connect(modGain);
        modGain.connect(g.gain);
        mod.start();

        osc.connect(g);
        g.connect(output);
        osc.start();
        shimmerOscs.push({ osc, mod, gain: g });
      }
    }

    // Fade in
    output.gain.setValueAtTime(0, audioContext.currentTime);
    output.gain.linearRampToValueAtTime(1, audioContext.currentTime + 4);
  }

  function stop() {
    const now = audioContext.currentTime;
    output.gain.linearRampToValueAtTime(0, now + 2);

    const ns = noiseSource;
    const fl = filterLfo;
    const sh = shimmerOscs;

    setTimeout(() => {
      if (ns) try { ns.stop(); } catch {}
      if (fl) try { fl.stop(); } catch {}
      sh.forEach(s => {
        try { s.osc.stop(); } catch {}
        try { s.mod.stop(); } catch {}
      });
    }, 2500);

    noiseSource = null;
    filter = null;
    filterLfo = null;
    shimmerOscs = [];
  }

  function setGain(val) {
    output.gain.linearRampToValueAtTime(val, audioContext.currentTime + 0.5);
  }

  return { start, stop, setGain, output };
}
