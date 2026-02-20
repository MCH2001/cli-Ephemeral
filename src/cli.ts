#!/usr/bin/env node

import { Command } from 'commander';

import { runCleanupAllCommand, runCleanupCommand } from './scratch/cleanup.js';
import { runScratchCommand } from './scratch/command.js';
import type { ScratchCliOptions } from './scratch/types.js';

const program = new Command();

program
  .name('scratch')
  .description('Create an ephemeral scratch workspace for TS, JS, Python, Go, C, C++, or Java.')
  .option('--ts', 'Use TypeScript (default).')
  .option('--js', 'Use JavaScript.')
  .option('--py', 'Use Python.')
  .option('--go', 'Use Go.')
  .option('--c', 'Use C.')
  .option('--cpp', 'Use C++.')
  .option('--java', 'Use Java.')
  .option('--editor <command>', 'Override the editor command (example: "code --wait").')
  .option('--dest <path>', 'Destination directory to use when saving the scratchpad.')
  .option('--keep-temp', 'Do not remove the temporary workspace when the session ends.')
  .showHelpAfterError();

program
  .command('clean')
  .description('Delete a scratch temporary workspace by path.')
  .argument('<target>', 'Workspace path or any file path inside the workspace.')
  .showHelpAfterError()
  .action(async (target: string) => {
    try {
      await runCleanupCommand(target);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      process.stderr.write(`scratch clean failed: ${message}\n`);
      process.exitCode = 1;
    }
  });

program
  .command('clean-all')
  .description('Delete all scratch temporary workspaces in the OS temp directory.')
  .showHelpAfterError()
  .action(async () => {
    try {
      await runCleanupAllCommand();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      process.stderr.write(`scratch clean-all failed: ${message}\n`);
      process.exitCode = 1;
    }
  });

program
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
