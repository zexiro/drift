import { writable, derived } from 'svelte/store';

export const playing = writable(false);
export const currentScene = writable('deep-ocean');
export const volume = writable(0.6);
export const showUI = writable(true);
export const showScenePicker = writable(false);
export const showInfo = writable(true);
export const showAbout = writable(false);

let hideTimer = null;

export function pokeUI() {
  showUI.set(true);
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => showUI.set(false), 4000);
}
