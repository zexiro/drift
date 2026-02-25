// Perlin noise background texture overlay

import { createNoise } from '../noise.js';

export function createNoiseField(seed = Date.now()) {
  const noise = createNoise(seed);
  let time = 0;
  let gridSize = 40;
  let opacity = 0.04;
  let palette = [[60, 80, 120]];

  function update(dt) {
    time += dt * 0.0001;
  }

  function render(ctx, width, height) {
    const cols = Math.ceil(width / gridSize);
    const rows = Math.ceil(height / gridSize);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const n = noise.noise3D(x * 0.08, y * 0.08, time);
        const val = (n + 1) / 2; // Normalize to 0-1

        const color = palette[0];
        const alpha = val * opacity;

        ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${alpha})`;
        ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
      }
    }
  }

  function setPalette(p) { palette = p; }
  function setGridSize(s) { gridSize = s; }
  function setOpacity(o) { opacity = o; }

  return { update, render, setPalette, setGridSize, setOpacity };
}
