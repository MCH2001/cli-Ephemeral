import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { stdout } from 'node:process';

import { pathExists, removeDirectory } from './fs.js';

const SCRATCH_WORKSPACE_PATTERN = /^scratch-(ts|js|py|go|c|cpp|java)-/;

function isWithinDirectory(root: string, target: string): boolean {
  const relative = path.relative(root, target);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function findScratchWorkspace(target: string, tempRoot: string): string | null {
  if (!isWithinDirectory(tempRoot, target)) {
    return null;
  }

  let current = target;
  while (isWithinDirectory(tempRoot, current)) {
    const baseName = path.basename(current);
    if (SCRATCH_WORKSPACE_PATTERN.test(baseName)) {
      return current;
    }

    if (current === tempRoot) {
      break;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }

  return null;
}

export async function runCleanupCommand(targetInput: string): Promise<void> {
  const tempRoot = path.resolve(os.tmpdir());
  const targetPath = path.resolve(targetInput);

  if (!isWithinDirectory(tempRoot, targetPath)) {
    throw new Error(`Target must be inside your OS temp directory (${tempRoot}).`);
  }

  const workspace = findScratchWorkspace(targetPath, tempRoot);
  if (workspace === null) {
    throw new Error('Target must point to a scratch workspace (scratch-*) or a file inside it.');
  }

  if (!(await pathExists(workspace))) {
    throw new Error(`Scratch workspace does not exist: ${workspace}`);
  }

  await removeDirectory(workspace);
  stdout.write(`Deleted scratch workspace: ${workspace}\n`);
}

export async function runCleanupAllCommand(tempRootInput: string = os.tmpdir()): Promise<void> {
  const tempRoot = path.resolve(tempRootInput);
  const entries = await fs.readdir(tempRoot, { withFileTypes: true });
  const workspaces = entries
    .filter((entry) => entry.isDirectory() && SCRATCH_WORKSPACE_PATTERN.test(entry.name))
    .map((entry) => path.join(tempRoot, entry.name));

  if (workspaces.length === 0) {
    stdout.write(`No scratch workspaces found in: ${tempRoot}\n`);
    return;
  }

  for (const workspace of workspaces) {
    await removeDirectory(workspace);
    stdout.write(`Deleted scratch workspace: ${workspace}\n`);
  }

  const suffix = workspaces.length === 1 ? '' : 's';
  stdout.write(`Deleted ${workspaces.length} scratch workspace${suffix} from: ${tempRoot}\n`);
}
