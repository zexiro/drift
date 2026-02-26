<script>
  import { showAbout } from '../lib/stores/drift.js';

  function close() {
    showAbout.set(false);
  }
</script>

{#if $showAbout}
  <div class="about-overlay" role="dialog" aria-label="About Drift">
    <button class="close-btn" onclick={close} aria-label="Close">&times;</button>
    <div class="about-content">
      <h1 class="title">About Drift</h1>
      <p class="lede">An interactive generative music and visual experience</p>

      <section>
        <h2>What is Drift?</h2>
        <p>
          Drift creates never-repeating ambient soundscapes paired with flowing
          procedural visuals. Every sound is synthesized in real-time, every
          visual rendered live — nothing is pre-recorded. Each moment you spend
          with Drift is entirely unique, an ephemeral composition that will
          never exist again.
        </p>
      </section>

      <section>
        <h2>How it works</h2>
        <p>
          Four audio layers — drone, melody, texture, and rhythm — are woven
          together through real-time synthesis to create an ever-evolving
          ambient soundscape. The visuals are driven by Perlin noise flow
          fields, generating organic particle movements that respond to your
          pointer interaction.
        </p>
      </section>

      <section>
        <h2>Scenes</h2>
        <p>Drift features four distinct audio-visual environments:</p>
        <ul>
          <li><strong>Deep Ocean</strong> — Submerged tones and drifting currents in the abyss</li>
          <li><strong>Northern Lights</strong> — Shimmering harmonics beneath an aurora sky</li>
          <li><strong>Rain Garden</strong> — Gentle percussive drops among lush foliage</li>
          <li><strong>Stellar Drift</strong> — Vast cosmic pads and sparkling celestial dust</li>
        </ul>
      </section>

      <section>
        <h2>Built at Claude's Corner</h2>
        <p>
          Drift is part of
          <a href="https://claudescorner.dev" target="_blank" rel="noopener noreferrer">Claude's Corner</a>,
          built by
          <a href="https://claude.ai" target="_blank" rel="noopener noreferrer">Claude</a>.
          View the source on
          <a href="https://github.com/zexiro/drift" target="_blank" rel="noopener noreferrer">GitHub</a>.
        </p>
      </section>

      <button class="return-btn" onclick={close}>Return to Drift</button>
    </div>
  </div>
{/if}

<style>
  .about-overlay {
    position: fixed;
    inset: 0;
    z-index: 90;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    background: var(--overlay-bg);
    backdrop-filter: blur(20px);
    overflow-y: auto;
    animation: fadeIn 0.4s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .close-btn {
    position: fixed;
    top: 1.25rem;
    right: 1.25rem;
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 1.75rem;
    cursor: pointer;
    line-height: 1;
    padding: 0.25rem 0.5rem;
    z-index: 91;
    transition: color 0.2s ease;
  }

  .close-btn:hover {
    color: var(--text);
  }

  .about-content {
    max-width: 640px;
    width: 100%;
    padding: 4rem 2rem 3rem;
    color: var(--text);
  }

  .title {
    font-size: 2.25rem;
    font-weight: 200;
    letter-spacing: 0.15em;
    color: var(--text);
    margin-bottom: 0.5rem;
  }

  .lede {
    font-size: 1rem;
    color: var(--text-muted);
    letter-spacing: 0.05em;
    margin-bottom: 2.5rem;
  }

  section {
    margin-bottom: 2rem;
  }

  h2 {
    font-size: 1.1rem;
    font-weight: 400;
    letter-spacing: 0.08em;
    color: var(--accent);
    margin-bottom: 0.75rem;
  }

  p {
    font-size: 0.9rem;
    line-height: 1.7;
    color: var(--text);
    opacity: 0.85;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0.75rem 0 0;
  }

  li {
    font-size: 0.9rem;
    line-height: 1.7;
    color: var(--text);
    opacity: 0.85;
    padding: 0.25rem 0;
    padding-left: 1rem;
    position: relative;
  }

  li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.85rem;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--accent-dim);
  }

  section a {
    color: var(--accent);
    text-decoration: none;
    transition: opacity 0.2s ease;
  }

  section a:hover {
    opacity: 0.8;
    text-decoration: underline;
  }

  .return-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1.5rem;
    padding: 0.85rem 2rem;
    border: 1px solid var(--accent-dim);
    border-radius: 100px;
    color: var(--accent);
    font-size: 0.9rem;
    letter-spacing: 0.08em;
    background: rgba(125, 211, 252, 0.05);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .return-btn:hover {
    background: rgba(125, 211, 252, 0.12);
    border-color: var(--accent);
    transform: scale(1.03);
  }
</style>
