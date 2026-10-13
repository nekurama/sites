import { defineConfig } from 'astro/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const outputDirectory = process.env.SITE_OUTPUT_DIR
  ? path.resolve(process.env.SITE_OUTPUT_DIR)
  : fileURLToPath(new URL('./dist/', import.meta.url));

export default defineConfig({
  base: '/products/babai/',
  output: 'static',
  outDir: outputDirectory,
  build: {
    format: 'directory',
    emptyOutDir: !process.env.SITE_OUTPUT_DIR,
  },
});
