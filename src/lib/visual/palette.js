// Color palette generation with time-of-day shifting

export function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex(r, g, b) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function lerpColor(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

export function rgbString(rgb, alpha = 1) {
  return alpha < 1
    ? `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`
    : `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
}

// Time-of-day warmth factor: 0 = cool (night), 1 = warm (midday)
export function getTimeWarmth(hour = new Date().getHours()) {
  // Peaks at noon, lowest at midnight
  return 0.5 + 0.5 * Math.cos((hour - 12) * Math.PI / 12);
}

// Shift a palette toward warm or cool based on time
export function applyTimeShift(palette, warmth) {
  const warmTint = [20, 10, -10];
  const coolTint = [-10, -5, 15];
  const tint = warmTint.map((w, i) => w * warmth + coolTint[i] * (1 - warmth));

  return palette.map(color => [
    Math.max(0, Math.min(255, color[0] + tint[0])),
    Math.max(0, Math.min(255, color[1] + tint[1])),
    Math.max(0, Math.min(255, color[2] + tint[2])),
  ]);
}
