import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync, mkdirSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {root, verify} from './verify.mjs';

test('asset and package entries are present and valid', () => {
  assert.deepEqual(verify().dimensions, [1536,2288]);
});

test('changed atlas bytes fail verification', () => {
  const bytes = readFileSync(resolve(root, 'assets/spritesheet.webp'));
  bytes[bytes.length - 1] ^= 1;
  assert.throws(() => verify(bytes), /SHA-256/);
});

test('npm package contents and bytes repeat', () => {
  assert.ok(process.env.npm_execpath, 'Run with npm test to select the current npm CLI');
  mkdirSync(resolve(root, 'dist'), {recursive:true});
  const pack = () => JSON.parse(execFileSync(process.execPath, [process.env.npm_execpath, 'pack', '--json', '--pack-destination', 'dist'], {cwd:root, encoding:'utf8'}))[0];
  const first = pack();
  const bytes = readFileSync(resolve(root, 'dist', first.filename));
  const second = pack();
  assert.deepEqual(readFileSync(resolve(root, 'dist', second.filename)), bytes);
  const pkg = JSON.parse(readFileSync(resolve(root,'package.json'),'utf8'));
  assert.deepEqual(first.files.map(f=>f.path).sort(), [...pkg.files,'package.json'].sort());
  const digest = createHash('sha256').update(bytes).digest('hex');
  writeFileSync(resolve(root,'dist/SHA256SUMS'), `${digest}  ${first.filename}\n`);
  console.log(`${digest}  ${first.filename}`);
});
