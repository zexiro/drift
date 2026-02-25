// Lookahead scheduler for sample-accurate timing
// Uses the Web Audio clock with a setTimeout-based lookahead

const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD_S = 0.1;

export function createScheduler(audioContext) {
  let timerId = null;
  const callbacks = [];
  let running = false;

  function schedule() {
    const now = audioContext.currentTime;
    const horizon = now + SCHEDULE_AHEAD_S;

    for (const cb of callbacks) {
      while (cb.nextTime < horizon) {
        cb.fn(cb.nextTime);
        cb.nextTime += cb.interval();
      }
    }

    if (running) {
      timerId = setTimeout(schedule, LOOKAHEAD_MS);
    }
  }

  return {
    addCallback(fn, intervalFn, startOffset = 0) {
      const entry = {
        fn,
        interval: typeof intervalFn === 'function' ? intervalFn : () => intervalFn,
        nextTime: audioContext.currentTime + startOffset,
      };
      callbacks.push(entry);
      return entry;
    },

    removeCallback(entry) {
      const idx = callbacks.indexOf(entry);
      if (idx >= 0) callbacks.splice(idx, 1);
    },

    start() {
      if (running) return;
      running = true;
      // Reset next times
      const now = audioContext.currentTime;
      for (const cb of callbacks) {
        if (cb.nextTime < now) cb.nextTime = now;
      }
      schedule();
    },

    stop() {
      running = false;
      clearTimeout(timerId);
    },

    get isRunning() { return running; },
  };
}
