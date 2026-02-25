// Soft filtered noise bursts at regular intervals

export function createRhythmLayer(audioContext, destination, analyserNode) {
  const output = audioContext.createGain();
  output.gain.value = 0.7;
  output.connect(analyserNode);
  output.connect(destination);

  let schedulerEntry = null;
  let noiseBuffer = null;
  let config = null;

  function getNoiseBuffer() {
    if (noiseBuffer) return noiseBuffer;
    const size = audioContext.sampleRate;
    noiseBuffer = audioContext.createBuffer(1, size, audioContext.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < size; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return noiseBuffer;
  }

  function playHit(time) {
    if (!config) return;

    const { hitGain = 0.06, filterFreq = 1200, decay = 0.15 } = config;

    const source = audioContext.createBufferSource();
    source.buffer = getNoiseBuffer();

    const bp = audioContext.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = filterFreq + Math.random() * 200;
    bp.Q.value = 2;

    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(hitGain, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + decay);

    source.connect(bp);
    bp.connect(gain);
    gain.connect(output);
    source.start(time);
    source.stop(time + decay + 0.05);
  }

  function start(cfg, scheduler) {
    config = cfg;
    if (!config.enabled) return;

    const interval = () => config.interval || 0.5;
    schedulerEntry = scheduler.addCallback(playHit, interval, Math.random() * 0.5);
  }

  function stop(scheduler) {
    if (schedulerEntry) {
      scheduler.removeCallback(schedulerEntry);
      schedulerEntry = null;
    }
  }

  function updateConfig(cfg) {
    config = cfg;
  }

  function setGain(val) {
    output.gain.linearRampToValueAtTime(val, audioContext.currentTime + 0.5);
  }

  return { start, stop, updateConfig, setGain, output };
}
