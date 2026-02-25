<script>
  import { showScenePicker, currentScene, pokeUI } from '../lib/stores/drift.js';
  import { preferences } from '../lib/stores/preferences.js';
  import { loadScene } from '../lib/scenes/SceneManager.js';
  import { SCENES, SCENE_IDS } from '../lib/scenes/scenes.js';

  function selectScene(id) {
    loadScene(id);
    preferences.update(p => ({ ...p, lastScene: id }));
    showScenePicker.set(false);
    pokeUI();
  }

  function close() {
    showScenePicker.set(false);
  }

  function onKeydown(e) {
    if (e.key === 'Escape') close();
  }
</script>

<svelte:window onkeydown={onKeydown} />

{#if $showScenePicker}
  <!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
  <div class="picker-overlay" onclick={close}>
    <!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events a11y_interactive_supports_focus -->
    <div class="picker" onclick={(e) => e.stopPropagation()} role="dialog" aria-label="Choose a scene" tabindex="-1">
      <h2 class="picker-title">Scenes</h2>
      <div class="scene-grid">
        {#each SCENE_IDS as id}
          {@const scene = SCENES[id]}
          <button
            class="scene-card"
            class:active={$currentScene === id}
            onclick={() => selectScene(id)}
          >
            <div class="scene-preview" style="background: linear-gradient(135deg, rgb({scene.visual.skyPalette[0].join(',')}), rgb({scene.visual.particlePalette[0].join(',')}))"></div>
            <div class="scene-label">
              <span class="scene-name">{scene.name}</span>
              <span class="scene-desc">{scene.description}</span>
            </div>
          </button>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  .picker-overlay {
    position: fixed;
    inset: 0;
    z-index: 80;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .picker {
    background: var(--overlay-bg);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
  }

  .picker-title {
    font-size: 0.85rem;
    font-weight: 400;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .scene-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  .scene-card {
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.06);
    transition: border-color 0.2s, transform 0.2s;
    text-align: left;
  }

  .scene-card:hover {
    border-color: rgba(255, 255, 255, 0.15);
    transform: scale(1.02);
  }

  .scene-card.active {
    border-color: var(--accent-dim);
  }

  .scene-preview {
    height: 60px;
    width: 100%;
  }

  .scene-label {
    padding: 0.6rem 0.8rem;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .scene-name {
    font-size: 0.85rem;
    color: var(--text);
  }

  .scene-desc {
    font-size: 0.7rem;
    color: var(--text-muted);
  }

  @media (max-width: 400px) {
    .scene-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
