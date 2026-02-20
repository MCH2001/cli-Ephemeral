import { describe, expect, it } from 'vitest';

import { resolveLanguageFromFlags } from '../src/scratch/language.js';

describe('resolveLanguageFromFlags', () => {
  it('defaults to TypeScript when no language is selected', () => {
    expect(resolveLanguageFromFlags({})).toBe('ts');
  });

  it('returns a selected language', () => {
    expect(resolveLanguageFromFlags({ js: true })).toBe('js');
    expect(resolveLanguageFromFlags({ py: true })).toBe('py');
    expect(resolveLanguageFromFlags({ go: true })).toBe('go');
    expect(resolveLanguageFromFlags({ c: true })).toBe('c');
    expect(resolveLanguageFromFlags({ cpp: true })).toBe('cpp');
    expect(resolveLanguageFromFlags({ java: true })).toBe('java');
  });

  it('throws if multiple language flags are selected', () => {
    expect(() => resolveLanguageFromFlags({ ts: true, py: true })).toThrow(
      /Choose exactly one language flag/
    );
  });
});
