// Stereo ping-pong delay

export function createDelay(audioContext, { time = 0.4, feedback = 0.35, wet = 0.3 } = {}) {
  const input = audioContext.createGain();
  const output = audioContext.createGain();
  const wetGain = audioContext.createGain();
  const dryGain = audioContext.createGain();

  wetGain.gain.value = wet;
  dryGain.gain.value = 1;

  const delayL = audioContext.createDelay(2);
  const delayR = audioContext.createDelay(2);
  delayL.delayTime.value = time;
  delayR.delayTime.value = time * 0.75; // Offset for stereo spread

  const fbL = audioContext.createGain();
  const fbR = audioContext.createGain();
  fbL.gain.value = feedback;
  fbR.gain.value = feedback;

  // Stereo merger
  const merger = audioContext.createChannelMerger(2);

  // Ping-pong routing
  input.connect(delayL);
  delayL.connect(fbL);
  fbL.connect(delayR);
  delayR.connect(fbR);
  fbR.connect(delayL);

  delayL.connect(merger, 0, 0);
  delayR.connect(merger, 0, 1);
  merger.connect(wetGain);

  input.connect(dryGain);
  wetGain.connect(output);
  dryGain.connect(output);

  return {
    input,
    output,
    setTime(t) {
      delayL.delayTime.linearRampToValueAtTime(t, audioContext.currentTime + 0.1);
      delayR.delayTime.linearRampToValueAtTime(t * 0.75, audioContext.currentTime + 0.1);
    },
    setFeedback(f) {
      fbL.gain.linearRampToValueAtTime(f, audioContext.currentTime + 0.1);
      fbR.gain.linearRampToValueAtTime(f, audioContext.currentTime + 0.1);
    },
    setWet(w) {
      wetGain.gain.linearRampToValueAtTime(w, audioContext.currentTime + 0.1);
    },
  };
}
