import './styles/global.css';
import { mount } from 'svelte';
import App from './App.svelte';
import { inject } from '@vercel/analytics';

const app = mount(App, { target: document.getElementById('app') });

// Initialize Vercel Analytics
inject();

// Register PWA service worker
if ('serviceWorker' in navigator) {
  import('virtual:pwa-register').then(({ registerSW }) => {
    registerSW({ immediate: true });
  }).catch(() => {
    // PWA registration not available in dev mode
  });
}

export default app;
