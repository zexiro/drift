// Palette and tone shifts based on current hour

import { getTimeWarmth, applyTimeShift } from '../visual/palette.js';

let currentHour = new Date().getHours();
let checkInterval = null;

export function getTimeAdjustedPalette(palette) {
  const warmth = getTimeWarmth(currentHour);
  return applyTimeShift(palette, warmth);
}

export function startTimeTracking(onHourChange) {
  currentHour = new Date().getHours();

  checkInterval = setInterval(() => {
    const newHour = new Date().getHours();
    if (newHour !== currentHour) {
      currentHour = newHour;
      if (onHourChange) onHourChange(currentHour);
    }
  }, 60000); // Check every minute
}

export function stopTimeTracking() {
  if (checkInterval) clearInterval(checkInterval);
}

export function getCurrentHour() {
  return currentHour;
}
