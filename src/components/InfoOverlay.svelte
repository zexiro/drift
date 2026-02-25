<script>
  import { showInfo, playing } from '../lib/stores/drift.js';
  import { getAudioEngine } from '../lib/audio/AudioEngine.js';
  import { loadScene } from '../lib/scenes/SceneManager.js';
  import { preferences } from '../lib/stores/preferences.js';

  function begin() {
    const audio = getAudioEngine();
    audio.init();
    const lastScene = $preferences.lastScene || 'deep-ocean';
    loadScene(lastScene);
    playing.set(true);
    showInfo.set(false);
  }
</script>

{#if $showInfo}
  <div class="info-overlay" role="dialog" aria-label="Welcome">
    <div class="info-content">
      <h1 class="title">Drift</h1>
      <p class="subtitle">generative ambient soundscapes</p>
      <button class="begin-btn" onclick={begin}>
        <span class="begin-icon">&#9654;</span>
        <span>Tap to begin</span>
      </button>
      <p class="hint">Move your cursor to interact with the particles</p>
    </div>
  </div>
{/if}

<style>
  .info-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(10, 10, 26, 0.92);
    backdrop-filter: blur(20px);
    animation: fadeIn 0.6s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .info-content {
    text-align: center;
    max-width: 400px;
    padding: 2rem;
  }

  .title {
    font-size: 3.5rem;
    font-weight: 200;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--text);
    margin-bottom: 0.5rem;
  }

  .subtitle {
    font-size: 0.9rem;
    color: var(--text-muted);
    letter-spacing: 0.15em;
    margin-bottom: 3rem;
  }

  .begin-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 2.5rem;
    border: 1px solid var(--accent-dim);
    border-radius: 100px;
    color: var(--accent);
    font-size: 1rem;
    letter-spacing: 0.1em;
    transition: all 0.3s ease;
    background: rgba(125, 211, 252, 0.05);
  }

  .begin-btn:hover {
    background: rgba(125, 211, 252, 0.12);
    border-color: var(--accent);
    transform: scale(1.03);
  }

  .begin-icon {
    font-size: 0.8rem;
  }

  .hint {
    margin-top: 2.5rem;
    font-size: 0.75rem;
    color: var(--text-muted);
    opacity: 0.6;
  }
</style>
