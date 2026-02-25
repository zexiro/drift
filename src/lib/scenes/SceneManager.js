// Scene loading and crossfade transitions

import { SCENES } from './scenes.js';
import { getAudioEngine } from '../audio/AudioEngine.js';
import { currentScene } from '../stores/drift.js';

let visualEngine = null;
let activeSceneId = null;
let transitioning = false;

export function initSceneManager(visEngine) {
  visualEngine = visEngine;
}

export function loadScene(sceneId) {
  const scene = SCENES[sceneId];
  if (!scene || sceneId === activeSceneId) return;

  if (transitioning) return;

  if (!activeSceneId) {
    // First load — no transition
    activeSceneId = sceneId;
    currentScene.set(sceneId);
    visualEngine.loadScene(scene);
    getAudioEngine().loadScene(scene);
    return;
  }

  // Crossfade transition
  transitioning = true;
  const audio = getAudioEngine();

  // Fade out current audio
  audio.setVolume(0);

  // Load new scene visuals immediately (visual crossfade via CSS opacity on canvas)
  setTimeout(() => {
    visualEngine.loadScene(scene);
    audio.loadScene(scene);

    // Fade audio back in
    setTimeout(() => {
      audio.setVolume(0.6); // Will be overridden by volume store
      activeSceneId = sceneId;
      currentScene.set(sceneId);
      transitioning = false;
    }, 500);
  }, 2000);
}

export function getCurrentScene() {
  return activeSceneId ? SCENES[activeSceneId] : null;
}
