// Animated gradient backdrop

import { rgbString, lerpColor } from '../palette.js';

export function createGradientSky() {
  let palette = [[10, 10, 26], [20, 20, 50], [10, 15, 35]];
  let time = 0;
  let shiftSpeed = 0.0003;

  function update(dt) {
    time += dt * shiftSpeed;
  }

  function render(ctx, width, height) {
    // Slowly oscillating gradient center
    const cx = width * (0.5 + 0.2 * Math.sin(time * 0.7));
    const cy = height * (0.4 + 0.15 * Math.cos(time * 0.5));
    const radius = Math.max(width, height) * 0.9;

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);

    // Animate between palette colors
    const t = (Math.sin(time) + 1) / 2;
    const inner = lerpColor(palette[0], palette[1], t);
    const outer = lerpColor(palette[1], palette[2], t);

    gradient.addColorStop(0, rgbString(inner));
    gradient.addColorStop(0.6, rgbString(lerpColor(inner, outer, 0.5)));
    gradient.addColorStop(1, rgbString(outer));

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  function setPalette(p) {
    palette = p;
  }

  function setShiftSpeed(s) {
    shiftSpeed = s;
  }

  return { update, render, setPalette, setShiftSpeed };
}
