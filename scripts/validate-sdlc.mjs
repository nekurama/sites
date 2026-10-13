import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const siteDirectory = path.resolve(fileURLToPath(new URL('../apps/sdlc/site/', import.meta.url)));
const entryPoint = path.join(siteDirectory, 'index.html');
const requiredImage = 'brand-assets/nekurama-line-art-mark.jpeg';

if (!existsSync(entryPoint)) {
  throw new Error(`SDLC entry point is missing: ${path.relative(process.cwd(), entryPoint)}`);
}

const html = readFileSync(entryPoint, 'utf8');
const localSources = [...html.matchAll(/\bsrc\s*=\s*["']([^"']+)["']/gi)]
  .map((match) => match[1])
  .filter((source) => !/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(source));

if (!localSources.includes(requiredImage)) {
  throw new Error(`SDLC entry point no longer references required image: ${requiredImage}`);
}

for (const source of localSources) {
  const assetPath = path.resolve(siteDirectory, decodeURIComponent(source.split(/[?#]/, 1)[0]));
  if (!assetPath.startsWith(`${siteDirectory}${path.sep}`) || !existsSync(assetPath)) {
    throw new Error(`SDLC local asset is missing or outside the site source: ${source}`);
  }
}

console.log(`Validated SDLC entry point and ${localSources.length} local source asset(s).`);
