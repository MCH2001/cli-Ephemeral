#!/usr/bin/env node

import { Command } from 'commander';

import { runScratchCommand } from './scratch/command.js';
import type { ScratchCliOptions } from './scratch/types.js';

const program = new Command();

program
  .name('scratch')
  .description('Create an ephemeral scratch workspace for TS, JS, Python, or Go.')
  .option('--ts', 'Use TypeScript (default).')
  .option('--js', 'Use JavaScript.')
  .option('--py', 'Use Python.')
  .option('--go', 'Use Go.')
  .option('--editor <command>', 'Override the editor command (example: "code --wait").')
  .option('--dest <path>', 'Destination directory to use when saving the scratchpad.')
  .option('--keep-temp', 'Do not remove the temporary workspace when the session ends.')
  .showHelpAfterError()
  .action(async (options: ScratchCliOptions) => {
    try {
      await runScratchCommand(options);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      process.stderr.write(`scratch failed: ${message}\n`);
      process.exitCode = 1;
    }
  });

await program.parseAsync(process.argv);
