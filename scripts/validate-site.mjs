import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryDirectory = fileURLToPath(new URL('../', import.meta.url));
const outputDirectory = path.join(repositoryDirectory, 'dist');
const pages = [
  'index.html',
  'products/babai/index.html',
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

if (!companyHtml.includes('Explore our products') || !companyHtml.includes('href="/products/"')) {
  throw new Error('Nekurama page is missing its product-neutral products link.');
}

if (/babai/i.test(companyHtml)) {
  throw new Error('Nekurama company page must not mention BABAI.');
}

if (!companyHtml.includes('src="/brand/nekurama-line-art-mark.jpeg"')) {
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

const markSource = readFileSync(path.join(repositoryDirectory, 'apps', 'sdlc', 'site', 'brand-assets', 'nekurama-line-art-mark.jpeg'));
const markCopyPath = path.join(outputDirectory, 'brand', 'nekurama-line-art-mark.jpeg');
const markCopy = readFileSync(markCopyPath);
if (!markSource.equals(markCopy)) {
  throw new Error('Nekurama company mark copy differs from its source asset.');
}

if (!productsHtml.includes('href="/products/babai/"')) {
  throw new Error('Nekurama products page is missing its BABAI path link.');
}

if (!companyHtml.includes('href="/favicon.svg"') || !babaiHtml.includes('href="/favicon.svg"')) {
  throw new Error('Company and BABAI pages must reference the Nekurama favicon.');
}

if (!statSync(path.join(outputDirectory, 'favicon.svg'), { throwIfNoEntry: false })?.isFile()) {
  throw new Error('Nekurama favicon is missing from combined output.');
}

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
  const diskPath = path.resolve(outputDirectory, `.${assetPath}`);
  if (!diskPath.startsWith(`${outputDirectory}${path.sep}`) || !statSync(diskPath, { throwIfNoEntry: false })?.isFile()) {
    throw new Error(`BABAI asset is missing from combined output: ${assetPath}`);
  }
}

function listFiles(directory, prefix = '') {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.join(prefix, entry.name);
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(fullPath, relativePath) : [relativePath];
  });
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

console.log(`Validated ${pages.length} combined pages, ${babaiAssetPaths.length} BABAI asset(s), and ${sourceFiles.length} byte-identical SDLC file(s).`);
