import { cpSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repositoryDirectory = fileURLToPath(new URL('../', import.meta.url));
const outputDirectory = path.join(repositoryDirectory, 'dist');
const sdlcSourceDirectory = path.join(repositoryDirectory, 'apps', 'sdlc', 'site');

rmSync(outputDirectory, { recursive: true, force: true });
mkdirSync(outputDirectory, { recursive: true });

for (const [packageName, outputPath] of [
  ['@nekurama/nekurama-site', outputDirectory],
  ['@nekurama/babai-site', path.join(outputDirectory, 'products', 'babai')],
]) {
  const args = ['--filter', packageName, 'build'];
  const result = spawnSync(
    process.platform === 'win32' ? (process.env.ComSpec ?? 'cmd.exe') : 'pnpm',
    process.platform === 'win32' ? ['/d', '/s', '/c', `pnpm ${args.join(' ')}`] : args,
    {
      cwd: repositoryDirectory,
      env: { ...process.env, SITE_OUTPUT_DIR: outputPath },
      stdio: 'inherit',
    },
  );

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`Build failed for ${packageName} (exit code ${result.status}).`);
  }
}

const sdlcOutputDirectory = path.join(outputDirectory, 'ideology', 'sdlc');
mkdirSync(path.dirname(sdlcOutputDirectory), { recursive: true });
cpSync(sdlcSourceDirectory, sdlcOutputDirectory, { recursive: true });
