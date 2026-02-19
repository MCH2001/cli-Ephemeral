import type { ScratchCliOptions, ScratchLanguage } from './types.js';

export function resolveLanguageFromFlags(options: ScratchCliOptions): ScratchLanguage {
  const selected: ScratchLanguage[] = [];

  if (options.ts) {
    selected.push('ts');
  }
  if (options.js) {
    selected.push('js');
  }
  if (options.py) {
    selected.push('py');
  }
  if (options.go) {
    selected.push('go');
  }

  if (selected.length === 0) {
    return 'ts';
  }

  if (selected.length > 1) {
    throw new Error('Choose exactly one language flag: --ts, --js, --py, or --go.');
  }

  return selected[0];
}
