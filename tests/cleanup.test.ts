import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { runCleanupAllCommand, runCleanupCommand } from '../src/scratch/cleanup.js';
import { createScratchDirectory, pathExists, removeDirectory } from '../src/scratch/fs.js';

const createdPaths: string[] = [];

afterEach(async () => {
  await Promise.all(createdPaths.splice(0).map((target) => removeDirectory(target)));
});

describe('runCleanupCommand', () => {
  it('removes the workspace when given a file inside a scratch directory', async () => {
    const scratchDir = await createScratchDirectory('py');
    createdPaths.push(scratchDir);

    const entrypoint = path.join(scratchDir, 'main.py');
    await fs.writeFile(entrypoint, 'print("hi")\n', 'utf8');

    await runCleanupCommand(entrypoint);

    expect(await pathExists(scratchDir)).toBe(false);
  });

  it('rejects temp paths that are not scratch workspaces', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'not-scratch-'));
    createdPaths.push(tempDir);

    await expect(runCleanupCommand(tempDir)).rejects.toThrow(
      /Target must point to a scratch workspace/
    );
    expect(await pathExists(tempDir)).toBe(true);
  });

  it('rejects paths outside the OS temp directory', async () => {
    await expect(runCleanupCommand(path.resolve('README.md'))).rejects.toThrow(
      /Target must be inside your OS temp directory/
    );
  });
});

describe('runCleanupAllCommand', () => {
  it('removes every scratch workspace within the provided temp root', async () => {
    const isolatedTempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'scratch-clean-all-'));
    createdPaths.push(isolatedTempRoot);

    const firstWorkspace = path.join(isolatedTempRoot, 'scratch-py-first');
    const secondWorkspace = path.join(isolatedTempRoot, 'scratch-ts-second');
    const thirdWorkspace = path.join(isolatedTempRoot, 'scratch-cpp-third');
    const unrelatedDir = path.join(isolatedTempRoot, 'not-scratch-workspace');

    await fs.mkdir(firstWorkspace, { recursive: true });
    await fs.mkdir(secondWorkspace, { recursive: true });
    await fs.mkdir(thirdWorkspace, { recursive: true });
    await fs.mkdir(unrelatedDir, { recursive: true });

    await runCleanupAllCommand(isolatedTempRoot);

    expect(await pathExists(firstWorkspace)).toBe(false);
    expect(await pathExists(secondWorkspace)).toBe(false);
    expect(await pathExists(thirdWorkspace)).toBe(false);
    expect(await pathExists(unrelatedDir)).toBe(true);
  });
});
