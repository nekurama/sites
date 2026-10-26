import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryDirectory = fileURLToPath(new URL('../', import.meta.url));
const outputDirectory = path.join(repositoryDirectory, 'dist');
const pages = [
  'index.html',
  'privacy/index.html',
  'data-deletion/index.html',
  'products/babai/index.html',
  'products/babai/finance/index.html',
  'ideology/sdlc/index.html',
];

for (const page of pages) {
  const pagePath = path.join(outputDirectory, page);
  if (!statSync(pagePath, { throwIfNoEntry: false })?.isFile()) {
    throw new Error(`Combined site page is missing: dist/${page}`);
  }
}

const companyHtml = readFileSync(path.join(outputDirectory, 'index.html'), 'utf8');
const productsHtml = readFileSync(path.join(outputDirectory, 'products', 'index.html'), 'utf8');
const babaiHtml = readFileSync(path.join(outputDirectory, 'products', 'babai', 'index.html'), 'utf8');
const financeHtml = readFileSync(path.join(outputDirectory, 'products', 'babai', 'finance', 'index.html'), 'utf8');

if (!companyHtml.includes('Explore our products') || !companyHtml.includes('href="/products/"')) {
  throw new Error('Nekurama page is missing its product-neutral products link.');
}

if (/babai/i.test(companyHtml)) {
  throw new Error('Nekurama company page must not mention BABAI.');
}

const nekuramaMarkPath = '/brand/nekurama-line-art-mark.png';
if (!companyHtml.includes(`src="${nekuramaMarkPath}"`)) {
  throw new Error('Nekurama company page is missing its line-art brand mark.');
}

const nameEggMatch = companyHtml.match(/<details class="name-egg">([\s\S]*?)<\/details>/);
if (!nameEggMatch || /<details class="name-egg"[^>]*\bopen\b/.test(companyHtml)) {
  throw new Error('Nekurama name-origin Easter egg must exist and start collapsed.');
}
if (!nameEggMatch[1].includes('<summary aria-label="Reveal the story behind the Nekurama name">')
  || !nameEggMatch[1].includes('Watashi wa nekura na seikaku desu')
  || !nameEggMatch[1].includes('personal inspirations behind Nekurama')) {
  throw new Error('Nekurama name-origin Easter egg is missing its accessible trigger or approved story.');
}
if (/Watashi wa nekura|Nine-Tails fox|curious cat/i.test(companyHtml.split('<head>')[1]?.split('</head>')[0] ?? '')) {
  throw new Error('Nekurama name-origin Easter egg must stay out of page metadata.');
}

if (!productsHtml.includes('href="/products/babai/"')) {
  throw new Error('Nekurama products page is missing its BABAI path link.');
}

function assertOutputAsset(assetPath) {
  const diskPath = path.resolve(outputDirectory, `.${assetPath}`);
  if (!diskPath.startsWith(`${outputDirectory}${path.sep}`) || !statSync(diskPath, { throwIfNoEntry: false })?.isFile()) {
    throw new Error(`Referenced asset is missing from combined output: ${assetPath}`);
  }
  return diskPath;
}

function assertAssetMatchesSource(assetPath, sourcePath) {
  const outputAsset = readFileSync(assertOutputAsset(assetPath));
  const sourceAsset = readFileSync(path.join(repositoryDirectory, sourcePath));
  if (!sourceAsset.equals(outputAsset)) {
    throw new Error(`Combined asset differs from its source: ${assetPath}`);
  }
}

assertAssetMatchesSource(
  nekuramaMarkPath,
  'apps/nekurama/public/brand/nekurama-line-art-mark.png',
);

const babaiBrandIconPath = '/products/babai/brand/babai-monochrome-face.jpeg';
if (!babaiHtml.includes(`src="${babaiBrandIconPath}"`) || !financeHtml.includes(`src="${babaiBrandIconPath}"`)) {
  throw new Error('BABAI pages are missing their current brand icon reference.');
}
assertAssetMatchesSource(
  babaiBrandIconPath,
  'apps/babai/public/brand/babai-monochrome-face.jpeg',
);

const faviconReferences = [
  [companyHtml, '/favicon.svg'],
  [productsHtml, '/favicon.svg'],
  [babaiHtml, '/products/babai/favicon.svg'],
  [financeHtml, '/favicon.svg'],
];
for (const [html, expectedPath] of faviconReferences) {
  const iconLink = [...html.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => match[0])
    .find((tag) => /\brel=["']icon["']/i.test(tag));
  const iconPath = iconLink?.match(/\bhref=["']([^"']+)["']/i)?.[1];
  if (iconPath !== expectedPath) {
    throw new Error(`Page must reference its current favicon at ${expectedPath}.`);
  }
  assertOutputAsset(iconPath);
}
assertAssetMatchesSource('/favicon.svg', 'apps/nekurama/public/favicon.svg');
assertAssetMatchesSource('/products/babai/favicon.svg', 'apps/babai/public/favicon.svg');

if (!babaiHtml.includes('href="/"')) {
  throw new Error('BABAI page is missing its Nekurama root link.');
}

const babaiAssetPaths = [...babaiHtml.matchAll(/\b(?:href|src)="(\/products\/babai\/[^"]+)"/g)]
  .map((match) => match[1])
  .filter((assetPath) => !assetPath.endsWith('/'));

if (babaiAssetPaths.length === 0) {
  throw new Error('BABAI page does not reference assets below /products/babai/.');
}

for (const assetPath of babaiAssetPaths) {
  assertOutputAsset(assetPath);
}

const robotsMeta = [...financeHtml.matchAll(/<meta\b[^>]*>/gi)]
  .map((match) => match[0])
  .find((tag) => /\bname=["']robots["']/i.test(tag));
const robotsContent = robotsMeta?.match(/\bcontent=["']([^"']+)["']/i)?.[1]
  .split(',')
  .map((directive) => directive.trim().toLowerCase());
if (!robotsContent?.includes('noindex') || !robotsContent.includes('nofollow')) {
  throw new Error('Finance planner must declare both noindex and nofollow.');
}

function listFiles(directory, prefix = '') {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.join(prefix, entry.name);
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(fullPath, relativePath) : [relativePath];
  });
}

function normalizeUrlPath(urlPath) {
  return urlPath.replace(/\/index\.html$/i, '/').replace(/\/+$/, '') || '/';
}

const financeUrlPath = '/products/babai/finance';
const financeOutputPath = path.join('products', 'babai', 'finance', 'index.html');
for (const relativePath of listFiles(outputDirectory).filter((filePath) => filePath.endsWith('.html'))) {
  if (relativePath === financeOutputPath) {
    continue;
  }

  const html = readFileSync(path.join(outputDirectory, relativePath), 'utf8');
  for (const [, href] of html.matchAll(/\bhref=["']([^"']+)["']/gi)) {
    const linkedPath = normalizeUrlPath(new URL(href, `https://nekurama.invalid/${relativePath}`).pathname);
    if (linkedPath === financeUrlPath) {
      throw new Error(`Finance planner must not be linked from another public page: ${relativePath}`);
    }
  }
}

const sdlcSourceDirectory = path.join(repositoryDirectory, 'apps', 'sdlc', 'site');
const sdlcOutputDirectory = path.join(outputDirectory, 'ideology', 'sdlc');
const sourceFiles = listFiles(sdlcSourceDirectory).sort();
const outputFiles = listFiles(sdlcOutputDirectory).sort();

if (JSON.stringify(sourceFiles) !== JSON.stringify(outputFiles)) {
  throw new Error('SDLC output file list does not match its source.');
}

for (const relativePath of sourceFiles) {
  const source = readFileSync(path.join(sdlcSourceDirectory, relativePath));
  const output = readFileSync(path.join(sdlcOutputDirectory, relativePath));
  if (!source.equals(output)) {
    throw new Error(`SDLC output differs from its source: ${relativePath}`);
  }
}

console.log(`Validated ${pages.length} combined pages, finance indexing and links, ${babaiAssetPaths.length} BABAI asset(s), brand assets, favicons, and ${sourceFiles.length} byte-identical SDLC file(s).`);
