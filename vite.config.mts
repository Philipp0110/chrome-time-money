import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import webExtension from '@samrum/vite-plugin-web-extension';
import manifestJson from './manifest.json' with { type: 'json' };

const __dirname = dirname(fileURLToPath(import.meta.url));

const manifest = manifestJson as chrome.runtime.ManifestV3;

export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest,
    })
  ],
  base: './'
}); 