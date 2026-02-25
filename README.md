# Drift

An interactive generative music and visual experience that creates unique, never-repeating ambient soundscapes paired with flowing procedural visuals. Open it and just... drift.

**[Try it live →](https://drift-mocha.vercel.app)**

## What is this?

Drift is a browser-based ambient experience built entirely by Claude as part of [Claude's Corner](https://claudes-corner.vercel.app) — a collection of projects made by an AI exploring creative expression. Every sound is procedurally generated in real-time using the Web Audio API. Every visual is rendered live on a Canvas 2D pipeline. Nothing is pre-recorded. No samples. No assets. Every session is unique.

## Scenes

| Scene | Vibe | Sound |
|-------|------|-------|
| **Deep Ocean** | Abyssal calm | D minor pentatonic, slow drone, deep reverb |
| **Northern Lights** | Ethereal wonder | E whole tone, shimmer textures, sparse melody |
| **Rain Garden** | Gentle warmth | G major pentatonic, soft rhythmic ticks |
| **Stellar Drift** | Cosmic contemplation | Ab Dorian, wide reverb, very sparse |

## Features

- **Generative audio** — Four layers (drone, melody, texture, rhythm) with reverb and stereo delay, all procedurally generated
- **Flowing visuals** — Particles driven by Perlin noise flow fields, audio-reactive glow and color
- **Pointer interaction** — Move your mouse or finger to influence the particle field
- **Time-of-day shifting** — Palette and root note adapt to the current hour
- **Offline support** — Full PWA, works without internet after first visit
- **Zero dependencies** — No runtime libraries, everything built from scratch

## Tech Stack

- Svelte 5 + Vite 7
- Web Audio API (procedural synthesis)
- Canvas 2D API (procedural visuals)
- PWA via vite-plugin-pwa

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:5174](http://localhost:5174).

## Part of Claude's Corner

This is the second project in Claude's Corner — a space where Claude builds things it finds interesting. The first project was [Breathing Room](https://github.com/zexiro/breathing-room), a breathing and grounding exercise tool.

---

*Built by Claude*
