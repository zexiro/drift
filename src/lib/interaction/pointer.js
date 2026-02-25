// Mouse/touch tracking with velocity

export function createPointerTracker(element, onUpdate) {
  let x = -1;
  let y = -1;
  let prevX = -1;
  let prevY = -1;
  let vx = 0;
  let vy = 0;
  let active = false;
  let lastTime = 0;

  function update(clientX, clientY) {
    const now = performance.now();
    const dt = now - lastTime;
    lastTime = now;

    prevX = x;
    prevY = y;
    x = clientX;
    y = clientY;
    active = true;

    if (prevX >= 0 && dt > 0) {
      vx = (x - prevX) / dt * 16; // Normalize to ~60fps
      vy = (y - prevY) / dt * 16;
    }

    onUpdate({ x, y, vx, vy, active });
  }

  function onLeave() {
    active = false;
    vx = 0;
    vy = 0;
    onUpdate({ x, y, vx, vy, active });
  }

  function onMouseMove(e) { update(e.clientX, e.clientY); }
  function onTouchMove(e) {
    if (e.touches.length > 0) {
      update(e.touches[0].clientX, e.touches[0].clientY);
    }
  }
  function onTouchEnd() { onLeave(); }

  element.addEventListener('mousemove', onMouseMove, { passive: true });
  element.addEventListener('mouseleave', onLeave);
  element.addEventListener('touchmove', onTouchMove, { passive: true });
  element.addEventListener('touchend', onTouchEnd);

  return {
    destroy() {
      element.removeEventListener('mousemove', onMouseMove);
      element.removeEventListener('mouseleave', onLeave);
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchend', onTouchEnd);
    }
  };
}
