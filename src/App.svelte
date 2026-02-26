<script>
  import DriftCanvas from './components/DriftCanvas.svelte';
  import InfoOverlay from './components/InfoOverlay.svelte';
  import TransportBar from './components/TransportBar.svelte';
  import ScenePicker from './components/ScenePicker.svelte';
  import CaptureButton from './components/CaptureButton.svelte';
  import { pokeUI, playing, showInfo } from './lib/stores/drift.js';

  let canvasComponent;

  function getCanvas() {
    return canvasComponent?.getCanvas();
  }

  function onPointerDown() {
    if (!$showInfo) pokeUI();
  }

  function onKeydown(e) {
    if ($showInfo) return;
    if (e.key === ' ') {
      e.preventDefault();
      playing.update(v => !v);
      pokeUI();
    }
  }
</script>

<svelte:window onkeydown={onKeydown} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<main class="drift-app" onpointerdown={onPointerDown}>
  <DriftCanvas bind:this={canvasComponent} />
  <InfoOverlay />
  {#if !$showInfo}
    <TransportBar />
    <ScenePicker />
    <CaptureButton {getCanvas} />
    <footer class="codehawks-footer">
      A <a href="https://www.codehawks.co.uk" target="_blank" rel="noopener noreferrer">CodeHawks</a> project
    </footer>
  {/if}
</main>

<style>
  .drift-app {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .codehawks-footer {
    position: absolute;
    bottom: 0.5rem;
    right: 0.75rem;
    font-size: 0.65rem;
    color: var(--text-muted);
    pointer-events: auto;
    z-index: 5;
  }
  .codehawks-footer a {
    color: var(--text-muted);
    text-decoration: none;
  }
  .codehawks-footer a:hover {
    color: var(--text);
  }
</style>
