import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import type { ScratchLanguage, ScratchTemplateFile } from './types.js';

export async function createScratchDirectory(language: ScratchLanguage): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), `scratch-${language}-`));
}

export async function writeTemplateFiles(rootDir: string, files: ScratchTemplateFile[]): Promise<void> {
  for (const file of files) {
    const fullPath = path.join(rootDir, file.path);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, file.content, 'utf8');
    if (file.executable) {
      await fs.chmod(fullPath, 0o755);
    }
  }
}

export async function pathExists(target: string): Promise<boolean> {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

export async function copyDirectory(source: string, destination: string): Promise<void> {
  await fs.cp(source, destination, {
    recursive: true,
    force: false,
    errorOnExist: true,
    preserveTimestamps: true
  });
}

export async function removeDirectory(target: string): Promise<void> {
  await fs.rm(target, { recursive: true, force: true });
}
