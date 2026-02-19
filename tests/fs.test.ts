import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  copyDirectory,
  createScratchDirectory,
  pathExists,
  removeDirectory,
  writeTemplateFiles
} from '../src/scratch/fs.js';

const createdDirs: string[] = [];

afterEach(async () => {
  await Promise.all(createdDirs.splice(0).map((dir) => removeDirectory(dir)));
});

describe('fs helpers', () => {
  it('creates a temporary scratch directory', async () => {
    const dir = await createScratchDirectory('js');
    createdDirs.push(dir);

    expect(path.basename(dir)).toMatch(/^scratch-js-/);
  });

  it('writes and copies template files', async () => {
    const sourceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'scratch-test-source-'));
    const destinationRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'scratch-test-dest-'));
    const destination = path.join(destinationRoot, 'saved');

    createdDirs.push(sourceRoot, destinationRoot);

    await writeTemplateFiles(sourceRoot, [
      {
        path: 'nested/hello.txt',
        content: 'hello world\n'
      }
    ]);

    await copyDirectory(sourceRoot, destination);

    const copied = await fs.readFile(path.join(destination, 'nested/hello.txt'), 'utf8');
    expect(copied).toBe('hello world\n');
    expect(await pathExists(path.join(destination, 'nested/hello.txt'))).toBe(true);
  });
});
