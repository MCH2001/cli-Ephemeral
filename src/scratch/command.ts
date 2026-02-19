import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { cwd, stdin, stdout } from 'node:process';

import { launchEditor } from './editor.js';
import { copyDirectory, createScratchDirectory, pathExists, removeDirectory, writeTemplateFiles } from './fs.js';
import { resolveLanguageFromFlags } from './language.js';
import { promptText, promptYesNo } from './prompt.js';
import { getTemplate } from './templates.js';
import type { ScratchCliOptions, ScratchLanguage } from './types.js';

export function buildDefaultDestinationPath(language: ScratchLanguage, now: Date = new Date()): string {
  const date = [
    now.getUTCFullYear(),
    String(now.getUTCMonth() + 1).padStart(2, '0'),
    String(now.getUTCDate()).padStart(2, '0')
  ].join('');

  const time = [
    String(now.getUTCHours()).padStart(2, '0'),
    String(now.getUTCMinutes()).padStart(2, '0'),
    String(now.getUTCSeconds()).padStart(2, '0')
  ].join('');

  return path.resolve(cwd(), `scratch-${language}-${date}-${time}`);
}

async function resolveSaveDestination(
  initialDestination: string,
  language: ScratchLanguage,
  rl: ReturnType<typeof createInterface>
): Promise<string> {
  let destination = initialDestination;

  while (await pathExists(destination)) {
    const overwrite = await promptYesNo(
      rl,
      `Destination exists (${destination}). Overwrite it? [y/N]: `,
      false
    );

    if (overwrite) {
      await removeDirectory(destination);
      return destination;
    }

    destination = path.resolve(
      await promptText(rl, 'Enter another destination path: ', buildDefaultDestinationPath(language))
    );
  }

  return destination;
}

export async function runScratchCommand(options: ScratchCliOptions): Promise<void> {
  const language = resolveLanguageFromFlags(options);
  const template = getTemplate(language);
  const scratchDir = await createScratchDirectory(language);
  let preserveTemp = Boolean(options.keepTemp);

  await writeTemplateFiles(scratchDir, template.files);

  stdout.write(`Created ${language.toUpperCase()} scratchpad at ${scratchDir}\n`);
  stdout.write(`Entrypoint: ${template.entrypoint}\n`);

  const rl = createInterface({ input: stdin, output: stdout });

  try {
    const { waited, editor } = await launchEditor(scratchDir, options.editor);

    if (!waited) {
      stdout.write(
        `${editor.label} may not block until close. Press Enter here when you are done editing.\n`
      );
      await rl.question('Continue: ');
    }

    const shouldSave = await promptYesNo(rl, 'Save this scratchpad? [y/N]: ', false);
    if (!shouldSave) {
      stdout.write('Scratchpad discarded.\n');
      return;
    }

    const defaultDestination = options.dest
      ? path.resolve(options.dest)
      : buildDefaultDestinationPath(language);

    const requestedDestination = await promptText(
      rl,
      `Save destination [${defaultDestination}]: `,
      defaultDestination
    );

    const destination = await resolveSaveDestination(path.resolve(requestedDestination), language, rl);

    await copyDirectory(scratchDir, destination);
    stdout.write(`Saved scratchpad to ${destination}\n`);
  } catch (error) {
    if (!preserveTemp) {
      preserveTemp = true;
      stdout.write(`Session failed. Preserving temporary workspace at ${scratchDir}\n`);
    }
    throw error;
  } finally {
    rl.close();
    if (preserveTemp) {
      if (options.keepTemp) {
        stdout.write(`Temporary directory preserved (--keep-temp): ${scratchDir}\n`);
      } else {
        stdout.write(`Temporary directory preserved for recovery: ${scratchDir}\n`);
      }
    } else {
      await removeDirectory(scratchDir);
      stdout.write('Cleaned up temporary workspace.\n');
    }
  }
}
