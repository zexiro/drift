<script>
  import { playing, volume, showUI, showScenePicker, pokeUI, currentScene } from '../lib/stores/drift.js';
  import { preferences } from '../lib/stores/preferences.js';
  import { getAudioEngine } from '../lib/audio/AudioEngine.js';
  import { SCENES } from '../lib/scenes/scenes.js';

  function togglePlay() {
    const audio = getAudioEngine();
    if ($playing) {
      audio.pause();
      playing.set(false);
    } else {
      audio.resume();
      playing.set(true);
    }
    pokeUI();
  }

  function onVolumeChange(e) {
    const v = parseFloat(e.target.value);
    volume.set(v);
    getAudioEngine().setVolume(v);
    preferences.update(p => ({ ...p, volume: v }));
    pokeUI();
  }

  function toggleScenePicker() {
    showScenePicker.update(v => !v);
    pokeUI();
  }

  function onPointerMove() {
    pokeUI();
  }

  $effect(() => {
    // Sync volume from preferences on first load
    const v = $volume;
    getAudioEngine().setVolume(v);
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="transport"
  class:hidden={!$showUI}
  onpointermove={onPointerMove}
>
  <button class="transport-btn" onclick={togglePlay} aria-label={$playing ? 'Pause' : 'Play'}>
    {#if $playing}
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <rect x="4" y="3" width="4" height="14" rx="1"/>
        <rect x="12" y="3" width="4" height="14" rx="1"/>
      </svg>
    {:else}
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <polygon points="5,3 17,10 5,17"/>
      </svg>
    {/if}
  </button>

  <div class="scene-name">
    <button class="scene-btn" onclick={toggleScenePicker}>
      {SCENES[$currentScene]?.name || 'Select Scene'}
    </button>
  </div>

  <div class="volume-control">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" class="volume-icon">
      <path d="M2 5h2l4-3v12l-4-3H2a1 1 0 01-1-1V6a1 1 0 011-1z"/>
      {#if $volume > 0.3}
        <path d="M11 4a5 5 0 010 8" fill="none" stroke="currentColor" stroke-width="1.2"/>
      {/if}
      {#if $volume > 0}
        <path d="M10 6a2.5 2.5 0 010 4" fill="none" stroke="currentColor" stroke-width="1.2"/>
      {/if}
    </svg>
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      value={$volume}
      oninput={onVolumeChange}
      aria-label="Volume"
    />
  </div>
</div>

<style>
  .transport {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 50;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.6rem 1.2rem;
    background: var(--overlay-bg);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 100px;
    transition: opacity var(--ui-transition), transform var(--ui-transition);
  }

  .transport.hidden {
    opacity: 0;
    pointer-events: none;
    transform: translateX(-50%) translateY(10px);
  }

  .transport-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    color: var(--accent);
    transition: background 0.2s;
  }

  .transport-btn:hover {
    background: rgba(125, 211, 252, 0.1);
  }

  .scene-name {
    min-width: 120px;
    text-align: center;
  }

  .scene-btn {
    font-size: 0.85rem;
    letter-spacing: 0.05em;
    color: var(--text);
    opacity: 0.8;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    transition: opacity 0.2s, background 0.2s;
  }

  .scene-btn:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.05);
  }

  .volume-control {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .volume-icon {
    color: var(--text-muted);
    flex-shrink: 0;
  }

  input[type="range"] {
    width: 80px;
    height: 4px;
    -webkit-appearance: none;
    appearance: none;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 2px;
    outline: none;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--accent);
    cursor: pointer;
  }

  input[type="range"]::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--accent);
    cursor: pointer;
    border: none;
  }
</style>
