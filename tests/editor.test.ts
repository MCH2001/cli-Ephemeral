import { describe, expect, it } from 'vitest';

import { inferWaitBehavior, parseCommandString } from '../src/scratch/editor.js';

describe('parseCommandString', () => {
  it('splits commands and arguments', () => {
    expect(parseCommandString('code --wait')).toEqual(['code', '--wait']);
  });

  it('handles quoted arguments', () => {
    expect(parseCommandString('"/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code" --wait')).toEqual([
      '/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code',
      '--wait'
    ]);
  });

  it('throws on empty values', () => {
    expect(() => parseCommandString('')).toThrow(/Invalid editor command/);
  });
});

describe('inferWaitBehavior', () => {
  it('recognizes VS Code wait flags', () => {
    expect(inferWaitBehavior('code', ['--wait'])).toBe(true);
    expect(inferWaitBehavior('code', [])).toBe(false);
  });

  it('recognizes open and xdg-open defaults', () => {
    expect(inferWaitBehavior('open', ['-W'])).toBe(true);
    expect(inferWaitBehavior('xdg-open', [])).toBe(false);
  });
});
