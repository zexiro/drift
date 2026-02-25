// Procedurally generated convolution reverb

export function createReverb(audioContext, { decay = 3, preDelay = 0.01 } = {}) {
  const convolver = audioContext.createConvolver();
  const wet = audioContext.createGain();
  wet.gain.value = 0.5;

  // Generate impulse response
  const sampleRate = audioContext.sampleRate;
  const length = sampleRate * decay;
  const impulse = audioContext.createBuffer(2, length, sampleRate);

  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    const preDelaySamples = Math.floor(preDelay * sampleRate);
    for (let i = preDelaySamples; i < length; i++) {
      const t = (i - preDelaySamples) / (length - preDelaySamples);
      // Exponential decay with some randomness for natural sound
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.5);
    }
  }

  convolver.buffer = impulse;
  convolver.connect(wet);

  return {
    input: convolver,
    output: wet,
    setWet(val) { wet.gain.linearRampToValueAtTime(val, audioContext.currentTime + 0.1); },
    setDecay(newDecay) {
      // Regenerate impulse for new decay
      const len = sampleRate * newDecay;
      const buf = audioContext.createBuffer(2, len, sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const data = buf.getChannelData(ch);
        for (let i = 0; i < len; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
        }
      }
      convolver.buffer = buf;
    },
  };
}
