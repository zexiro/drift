// Canvas lifecycle, rAF loop, renderer orchestration

import { createGradientSky } from './renderers/GradientSky.js';
import { createNoiseField } from './renderers/NoiseField.js';
import { createParticleField } from './renderers/ParticleField.js';
import { createGlow } from './renderers/Glow.js';
import { getAudioEngine } from '../audio/AudioEngine.js';

export function createVisualEngine() {
  let canvas = null;
  let ctx = null;
  let width = 0;
  let height = 0;
  let rafId = null;
  let lastTime = 0;
  let running = false;
  let reducedMotion = false;

  const sky = createGradientSky();
  const noiseField = createNoiseField();
  const particles = createParticleField();
  const glow = createGlow();

  // Performance adaptation
  let frameTimes = [];
  let isMobile = false;
  let glowEnabled = true;

  function init(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d', { alpha: false });

    isMobile = /Mobi|Android/i.test(navigator.userAgent);
    glowEnabled = !isMobile;

    resize();
    window.addEventListener('resize', resize);

    // Check reduced motion preference
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion = mq.matches;
    mq.addEventListener('change', (e) => { reducedMotion = e.matches; });
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = isMobile ? 200 : 350;
    particles.init(width, height, count);
    glow.init(width, height);
  }

  function frame(timestamp) {
    if (!running) return;

    const dt = lastTime ? timestamp - lastTime : 16;
    lastTime = timestamp;

    // Performance monitoring
    frameTimes.push(dt);
    if (frameTimes.length > 60) {
      const avg = frameTimes.reduce((a, b) => a + b) / frameTimes.length;
      if (avg > 20 && glowEnabled) {
        glowEnabled = false;
        glow.setEnabled(false);
      }
      frameTimes = [];
    }

    // Get audio amplitude for reactive visuals
    const audioEngine = getAudioEngine();
    const masterAmp = audioEngine.getAmplitude('master');
    const droneAmp = audioEngine.getAmplitude('drone');
    particles.setAudioAmplitude(masterAmp);

    // Update
    if (!reducedMotion) {
      sky.update(dt);
      noiseField.update(dt);
      particles.update(dt);
    }

    // Render pipeline (back to front)
    sky.render(ctx, width, height);

    if (!reducedMotion) {
      noiseField.render(ctx, width, height);

      // Trail effect: semi-transparent clear
      const bgColor = '10,10,26';
      ctx.fillStyle = `rgba(${bgColor},${particles.getTrailAlpha()})`;
      ctx.fillRect(0, 0, width, height);

      particles.render(ctx, width, height);

      if (glowEnabled) {
        glow.setIntensity(0.3 + droneAmp * 0.4);
        glow.render(ctx, width, height);
      }
    }

    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    lastTime = 0;
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
  }

  function loadScene(sceneConfig) {
    const { visual } = sceneConfig;

    sky.setPalette(visual.skyPalette);
    sky.setShiftSpeed(visual.skyShiftSpeed || 0.0003);
    noiseField.setPalette(visual.noisePalette || [visual.skyPalette[1]]);
    noiseField.setOpacity(visual.noiseOpacity || 0.04);
    particles.setPalette(visual.particlePalette);
    particles.setFlowScale(visual.flowScale || 0.003);
    particles.setFlowSpeed(visual.flowSpeed || 0.0002);
    particles.setParticleSpeed(visual.particleSpeed || 0.8);
    particles.setTrailAlpha(visual.trailAlpha || 0.03);
    particles.setParticleSizeBase(visual.particleSize || 2);
    glow.setIntensity(visual.glowIntensity || 0.4);
  }

  function setPointer(ptr) {
    particles.setPointer(ptr);
  }

  function destroy() {
    stop();
    window.removeEventListener('resize', resize);
  }

  function getCanvas() { return canvas; }

  return { init, start, stop, loadScene, setPointer, destroy, getCanvas };
}
