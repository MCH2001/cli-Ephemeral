import { describe, expect, it } from 'vitest';

import { getTemplate } from '../src/scratch/templates.js';

describe('getTemplate', () => {
  it('returns a TypeScript template with config files', () => {
    const template = getTemplate('ts');

    expect(template.entrypoint).toBe('index.ts');
    expect(template.files.some((file) => file.path === 'tsconfig.json')).toBe(true);
  });

  it('returns a Go template with go.mod', () => {
    const template = getTemplate('go');

    expect(template.entrypoint).toBe('main.go');
    expect(template.files.some((file) => file.path === 'go.mod')).toBe(true);
  });

  it('returns C and C++ templates with Makefile', () => {
    const cTemplate = getTemplate('c');
    const cppTemplate = getTemplate('cpp');

    expect(cTemplate.entrypoint).toBe('main.c');
    expect(cTemplate.files.some((file) => file.path === 'Makefile')).toBe(true);
    expect(cppTemplate.entrypoint).toBe('main.cpp');
    expect(cppTemplate.files.some((file) => file.path === 'Makefile')).toBe(true);
  });

  it('returns a Java template', () => {
    const template = getTemplate('java');

    expect(template.entrypoint).toBe('Main.java');
    expect(template.files.some((file) => file.path === 'Main.java')).toBe(true);
  });
});
