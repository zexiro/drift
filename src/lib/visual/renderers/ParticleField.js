// Flowing particles driven by noise flow field with pointer interaction

import { createNoise } from '../noise.js';

export function createParticleField(seed = Date.now()) {
  const noise = createNoise(seed);
  let particles = [];
  let time = 0;
  let particleCount = 350;
  let width = 0;
  let height = 0;
  let palette = [[125, 211, 252], [99, 102, 241], [200, 200, 255]];
  let flowScale = 0.003;
  let flowSpeed = 0.0002;
  let particleSpeed = 0.8;
  let trailAlpha = 0.03;
  let particleSizeBase = 2;
  let pointer = { x: -1, y: -1, vx: 0, vy: 0, active: false };
  let audioAmplitude = 0;

  function init(w, h, count) {
    width = w;
    height = h;
    particleCount = count || particleCount;
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        size: 1 + Math.random() * 2,
        colorIndex: Math.floor(Math.random() * palette.length),
        life: Math.random(),
        alpha: 0.3 + Math.random() * 0.5,
      });
    }
  }

  function update(dt) {
    time += dt * flowSpeed;
    const dtS = dt / 1000;

    for (const p of particles) {
      // Noise flow field
      const angle = noise.noise3D(p.x * flowScale, p.y * flowScale, time) * Math.PI * 2;
      const force = particleSpeed * (1 + audioAmplitude * 2);

      p.vx += Math.cos(angle) * force * dtS;
      p.vy += Math.sin(angle) * force * dtS;

      // Pointer interaction
      if (pointer.active) {
        const dx = pointer.x - p.x;
        const dy = pointer.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 1) {
          const strength = (1 - dist / 200) * 0.5;
          // Gentle swirl rather than direct attraction
          p.vx += (-dy / dist) * strength * pointer.vx * 0.01;
          p.vy += (dx / dist) * strength * pointer.vy * 0.01;
          // Mild attraction
          p.vx += dx / dist * strength * 0.3;
          p.vy += dy / dist * strength * 0.3;
        }
      }

      // Damping
      p.vx *= 0.96;
      p.vy *= 0.96;

      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      // Life cycle for subtle pulsing
      p.life += dtS * 0.1;
    }
  }

  function render(ctx, w, h) {
    for (const p of particles) {
      const color = palette[p.colorIndex % palette.length];
      const size = (p.size + particleSizeBase) * (1 + audioAmplitude * 0.5);
      const pulse = 0.6 + 0.4 * Math.sin(p.life * 2);
      const alpha = p.alpha * pulse;

      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${alpha})`;
      ctx.fill();
    }
  }

  function setPointer(ptr) { pointer = ptr; }
  function setPalette(p) { palette = p; }
  function setAudioAmplitude(a) { audioAmplitude = a; }
  function setFlowScale(s) { flowScale = s; }
  function setFlowSpeed(s) { flowSpeed = s; }
  function setParticleSpeed(s) { particleSpeed = s; }
  function setTrailAlpha(a) { trailAlpha = a; }
  function setParticleSizeBase(s) { particleSizeBase = s; }
  function getTrailAlpha() { return trailAlpha; }

  return {
    init, update, render, setPointer, setPalette, setAudioAmplitude,
    setFlowScale, setFlowSpeed, setParticleSpeed, setTrailAlpha, setParticleSizeBase,
    getTrailAlpha,
  };
}
