// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Load a dotenv-style file into a target object.
 * Only handles simple KEY=VALUE lines — more than enough for our use.
 */
function loadEnvFile(filePath, target) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) target[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

/** Resolve the build mode from CLI --mode; default to 'production'. */
function resolveMode() {
  const idx = process.argv.indexOf('--mode');
  if (idx > 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  const eq = process.argv.find((a) => a.startsWith('--mode='));
  if (eq) return eq.slice('--mode='.length);
  return 'production';
}

const mode = resolveMode();
const env = {};
const root = process.cwd();
loadEnvFile(path.join(root, '.env'), env);
loadEnvFile(path.join(root, `.env.${mode}`), env);

// https://astro.build/config
export default defineConfig({
  site: env.PUBLIC_SITE_URL ?? 'https://www.ruisilvastudio.com',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    remotePatterns: [{ protocol: 'https' }],
  },
});