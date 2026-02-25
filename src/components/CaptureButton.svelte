<script>
  import { showUI, pokeUI, currentScene } from '../lib/stores/drift.js';
  import { SCENES } from '../lib/scenes/scenes.js';

  let { getCanvas } = $props();

  let capturing = $state(false);

  async function capture() {
    const canvas = getCanvas();
    if (!canvas || capturing) return;
    capturing = true;
    pokeUI();

    const { captureScreenshot } = await import('../lib/capture/screenshot.js');
    const sceneName = SCENES[$currentScene]?.name || 'drift';
    await captureScreenshot(canvas, sceneName.toLowerCase().replace(/\s+/g, '-'));

    capturing = false;
  }
</script>

<button
  class="capture-btn"
  class:hidden={!$showUI}
  onclick={capture}
  disabled={capturing}
  aria-label="Capture screenshot"
>
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="2" y="4" width="16" height="12" rx="2"/>
    <circle cx="10" cy="10" r="3"/>
    <circle cx="15" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
</button>

<style>
  .capture-btn {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--overlay-bg);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.06);
    color: var(--text-muted);
    transition: opacity var(--ui-transition), transform var(--ui-transition), color 0.2s;
  }

  .capture-btn:hover {
    color: var(--accent);
  }

  .capture-btn.hidden {
    opacity: 0;
    pointer-events: none;
    transform: translateY(10px);
  }

  .capture-btn:disabled {
    opacity: 0.4;
  }
</style>
