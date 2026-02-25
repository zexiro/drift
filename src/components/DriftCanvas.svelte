<script>
  import { onMount, onDestroy } from 'svelte';
  import { createVisualEngine } from '../lib/visual/VisualEngine.js';
  import { createPointerTracker } from '../lib/interaction/pointer.js';
  import { initSceneManager } from '../lib/scenes/SceneManager.js';
  import { playing } from '../lib/stores/drift.js';

  let canvasEl;
  let engine = null;
  let pointerTracker = null;

  export function getEngine() { return engine; }
  export function getCanvas() { return canvasEl; }

  onMount(() => {
    engine = createVisualEngine();
    engine.init(canvasEl);
    initSceneManager(engine);

    pointerTracker = createPointerTracker(canvasEl, (ptr) => {
      engine.setPointer(ptr);
    });
  });

  onDestroy(() => {
    if (engine) engine.destroy();
    if (pointerTracker) pointerTracker.destroy();
  });

  $effect(() => {
    if (!engine) return;
    if ($playing) {
      engine.start();
    } else {
      engine.stop();
    }
  });
</script>

<canvas bind:this={canvasEl} class="drift-canvas"></canvas>

<style>
  .drift-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
