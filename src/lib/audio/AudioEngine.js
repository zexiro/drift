// AudioEngine — singleton managing AudioContext, master bus, effect sends, and all layers

import { createReverb } from './effects/Reverb.js';
import { createDelay } from './effects/Delay.js';
import { createDroneLayer } from './layers/DroneLayer.js';
import { createMelodicLayer } from './layers/MelodicLayer.js';
import { createTextureLayer } from './layers/TextureLayer.js';
import { createRhythmLayer } from './layers/RhythmLayer.js';
import { createScheduler } from './scheduling.js';
import { noteToMidi } from './scales.js';

let instance = null;

export function getAudioEngine() {
  if (instance) return instance;

  let ctx = null;
  let masterGain = null;
  let reverb = null;
  let delay = null;
  let scheduler = null;
  let drone = null;
  let melody = null;
  let texture = null;
  let rhythm = null;
  let analysers = {};

  function init() {
    if (ctx) {
      if (ctx.state === 'suspended') ctx.resume();
      return;
    }

    ctx = new (window.AudioContext || window.webkitAudioContext)();

    masterGain = ctx.createGain();
    masterGain.gain.value = 0.6;
    masterGain.connect(ctx.destination);

    // Effect sends
    const reverbSend = ctx.createGain();
    reverbSend.gain.value = 0.6;
    reverb = createReverb(ctx, { decay: 4 });
    reverbSend.connect(reverb.input);
    reverb.output.connect(masterGain);

    const delaySend = ctx.createGain();
    delaySend.gain.value = 0.3;
    delay = createDelay(ctx, { time: 0.4, feedback: 0.3, wet: 0.4 });
    delaySend.connect(delay.input);
    delay.output.connect(masterGain);

    // Dry bus (layers connect here for dry signal)
    const dryBus = ctx.createGain();
    dryBus.connect(masterGain);

    // Combined send: layers go to dry + reverb + delay
    const layerBus = ctx.createGain();
    layerBus.connect(dryBus);
    layerBus.connect(reverbSend);
    layerBus.connect(delaySend);

    // Analysers for audio-reactive visuals
    const createAnalyser = (fftSize = 256) => {
      const a = ctx.createAnalyser();
      a.fftSize = fftSize;
      a.smoothingTimeConstant = 0.85;
      return a;
    };

    analysers = {
      drone: createAnalyser(),
      melody: createAnalyser(),
      texture: createAnalyser(),
      rhythm: createAnalyser(),
      master: createAnalyser(512),
    };

    masterGain.connect(analysers.master);

    // Scheduler
    scheduler = createScheduler(ctx);

    // Layers
    drone = createDroneLayer(ctx, layerBus, analysers.drone);
    melody = createMelodicLayer(ctx, layerBus, analysers.melody);
    texture = createTextureLayer(ctx, layerBus, analysers.texture);
    rhythm = createRhythmLayer(ctx, layerBus, analysers.rhythm);
  }

  function loadScene(sceneConfig) {
    init();

    const { audio } = sceneConfig;

    // Stop existing layers
    drone.stop();
    melody.stop(scheduler);
    texture.stop();
    rhythm.stop(scheduler);
    scheduler.stop();

    // Start new scene
    drone.start({
      rootMidi: noteToMidi(audio.rootNote, 3),
      detuneCents: audio.droneDetune || 8,
      waveform: audio.droneWaveform || 'sine',
      gain: audio.droneGain || 0.15,
    });

    melody.start({
      rootNote: audio.rootNote,
      scaleName: audio.scale,
      octaveLow: audio.melodyOctaveLow || 3,
      octaveHigh: audio.melodyOctaveHigh || 5,
      noteGain: audio.melodyGain || 0.08,
      waveform: audio.melodyWaveform || 'sine',
      noteInterval: audio.melodyInterval,
    }, scheduler);

    texture.start({
      filterFreq: audio.textureFilterFreq || 800,
      filterQ: audio.textureFilterQ || 1.5,
      gain: audio.textureGain || 0.12,
      shimmer: audio.shimmer || false,
    });

    rhythm.start({
      enabled: audio.rhythmEnabled || false,
      hitGain: audio.rhythmGain || 0.06,
      filterFreq: audio.rhythmFilterFreq || 1200,
      decay: audio.rhythmDecay || 0.15,
      interval: audio.rhythmInterval || 0.5,
    }, scheduler);

    // Set effect levels per scene
    if (audio.reverbDecay) reverb.setDecay(audio.reverbDecay);
    if (audio.reverbWet != null) reverb.setWet(audio.reverbWet);
    if (audio.delayTime) delay.setTime(audio.delayTime);
    if (audio.delayFeedback != null) delay.setFeedback(audio.delayFeedback);
    if (audio.delayWet != null) delay.setWet(audio.delayWet);

    scheduler.start();
  }

  function setVolume(vol) {
    if (masterGain) {
      masterGain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.1);
    }
  }

  function pause() {
    if (ctx && ctx.state === 'running') ctx.suspend();
    if (scheduler) scheduler.stop();
  }

  function resume() {
    if (ctx && ctx.state === 'suspended') ctx.resume();
    if (scheduler) scheduler.start();
  }

  function stop() {
    if (scheduler) scheduler.stop();
    if (drone) drone.stop();
    if (melody) melody.stop(scheduler);
    if (texture) texture.stop();
    if (rhythm) rhythm.stop(scheduler);
  }

  function getAnalyserData(name) {
    const analyser = analysers[name];
    if (!analyser) return null;
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    return data;
  }

  function getAmplitude(name) {
    const data = getAnalyserData(name);
    if (!data) return 0;
    let sum = 0;
    for (let i = 0; i < data.length; i++) sum += data[i];
    return sum / (data.length * 255);
  }

  instance = {
    init,
    loadScene,
    setVolume,
    pause,
    resume,
    stop,
    getAnalyserData,
    getAmplitude,
    get context() { return ctx; },
    get analysers() { return analysers; },
  };

  // Handle tab visibility
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (ctx && document.visibilityState === 'visible' && ctx.state === 'suspended') {
        ctx.resume();
      }
    });
  }

  return instance;
}
