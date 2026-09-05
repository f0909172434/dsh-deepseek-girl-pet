/** Verify the distributed asset and declared package files without starting a host. */
import {readFileSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export function verify(atlas = readFileSync(resolve(root, 'assets/spritesheet.webp'))) {
  const [expected, file] = readFileSync(resolve(root, 'SHA256SUMS'), 'utf8').trim().split(/\s+/);
  if (file !== 'assets/spritesheet.webp' || createHash('sha256').update(atlas).digest('hex') !== expected) {
    throw new Error('Atlas SHA-256 mismatch');
  }
  if (atlas.toString('ascii', 0, 4) !== 'RIFF' || atlas.toString('ascii', 8, 12) !== 'WEBP' || atlas.readUInt32LE(4) + 8 !== atlas.length) {
    throw new Error('Invalid WebP container');
  }
  let dimensions;
  for (let p = 12; p + 8 <= atlas.length;) {
    const size = atlas.readUInt32LE(p + 4);
    if (p + 8 + size > atlas.length) throw new Error('Truncated WebP chunk');
    if (atlas.toString('ascii', p, p + 4) === 'VP8L') {
      if (size < 5 || atlas[p + 8] !== 0x2f) throw new Error('Invalid lossless WebP');
      const bits = atlas.readUInt32LE(p + 9);
      dimensions = [1 + (bits & 0x3fff), 1 + ((bits >>> 14) & 0x3fff)];
      break;
    }
    p += 8 + size + (size & 1);
  }
  if (dimensions?.join('x') !== '1536x2288') throw new Error('Unexpected atlas dimensions');
  const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
  for (const path of pkg.files) if (!existsSync(resolve(root, path))) throw new Error(`Missing package file: ${path}`);
  for (const path of Object.values(pkg.exports)) if (!existsSync(resolve(root, path))) throw new Error(`Missing export: ${path}`);
  return {version:pkg.version, sha256:expected, dimensions, scope:'Package integrity; no live Harness session is exercised'};
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) console.log(JSON.stringify(verify(), null, 2));
