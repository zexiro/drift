import { writable } from 'svelte/store';

const STORAGE_KEY = 'drift-prefs';

const defaults = {
  lastScene: 'deep-ocean',
  volume: 0.6,
  reducedMotion: false,
};

function loadPrefs() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaults, ...JSON.parse(stored) } : { ...defaults };
  } catch {
    return { ...defaults };
  }
}

function createPreferences() {
  const { subscribe, set, update } = writable(loadPrefs());

  subscribe((value) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {}
  });

  return { subscribe, set, update, reset: () => set({ ...defaults }) };
}

export const preferences = createPreferences();
