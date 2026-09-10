/** Keep the vendored atlas bound to one immutable Codex source revision. */
import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const source = JSON.parse(readFileSync(resolve(root, 'atlas-source.json'), 'utf8'));
export function checkAtlas(bytes) {
  if (bytes.length !== source.bytes || createHash('sha256').update(bytes).digest('hex') !== source.sha256) {
    throw new Error('Canonical atlas SHA-256 or byte count mismatch');
  }
  return source.sha256;
}
export function synchronize(bytes) {
  checkAtlas(bytes); // Validate before replacing the local file.
  writeFileSync(resolve(root, 'assets/spritesheet.webp'), bytes);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (!args.length || (args.length === 1 && args[0] === '--check')) {
    checkAtlas(readFileSync(resolve(root, 'assets/spritesheet.webp')));
  } else if (args.length === 2 && args[0] === '--source') {
    synchronize(readFileSync(resolve(args[1], source.path)));
  } else if (args.length === 1 && args[0] === '--download') {
    if (!/^[a-f0-9]{40}$/.test(source.commit) || source.repository !== 'f0909172434/deepseek-girl-codex-pet' || source.path !== 'pet/spritesheet.webp') {
      throw new Error('Unexpected canonical source');
    }
    const response = await fetch(`https://raw.githubusercontent.com/${source.repository}/${source.commit}/${source.path}`, {signal:AbortSignal.timeout(30000)});
    if (!response.ok) throw new Error(`Source download failed: ${response.status}`);
    synchronize(Buffer.from(await response.arrayBuffer()));
  } else {
    throw new Error('Usage: node scripts/sync-atlas.mjs [--check | --source CODEX_REPO | --download]');
  }
  console.log(`Canonical atlas verified: ${source.sha256}`);
}
