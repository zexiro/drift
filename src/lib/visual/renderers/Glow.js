// Bloom post-processing via offscreen canvas + scaled blur + additive compositing

export function createGlow() {
  let offscreen = null;
  let offCtx = null;
  let intensity = 0.4;
  let scale = 0.25; // Render glow at quarter resolution
  let enabled = true;

  function init(width, height) {
    if (typeof OffscreenCanvas !== 'undefined') {
      offscreen = new OffscreenCanvas(Math.floor(width * scale), Math.floor(height * scale));
    } else {
      offscreen = document.createElement('canvas');
      offscreen.width = Math.floor(width * scale);
      offscreen.height = Math.floor(height * scale);
    }
    offCtx = offscreen.getContext('2d');
  }

  function render(ctx, width, height) {
    if (!enabled || !offscreen) return;

    const sw = offscreen.width;
    const sh = offscreen.height;

    // Draw main canvas scaled down
    offCtx.clearRect(0, 0, sw, sh);
    offCtx.drawImage(ctx.canvas, 0, 0, sw, sh);

    // Apply blur via repeated scaled draws (cheap blur approximation)
    offCtx.globalAlpha = 0.6;
    for (let i = 0; i < 3; i++) {
      offCtx.drawImage(offscreen, -1, -1, sw + 2, sh + 2);
    }
    offCtx.globalAlpha = 1;

    // Composite back with additive blending
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = intensity;
    ctx.drawImage(offscreen, 0, 0, width, height);
    ctx.restore();
  }

  function setIntensity(i) { intensity = i; }
  function setEnabled(e) { enabled = e; }
  function resize(width, height) { init(width, height); }

  return { init, render, setIntensity, setEnabled, resize };
}
