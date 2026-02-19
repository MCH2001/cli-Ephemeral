import { describe, expect, it } from 'vitest';

import { buildDefaultDestinationPath } from '../src/scratch/command.js';

describe('buildDefaultDestinationPath', () => {
  it('creates deterministic destination names from time values', () => {
    const date = new Date('2026-02-19T15:04:05.000Z');
    const destination = buildDefaultDestinationPath('py', date);

    expect(destination).toMatch(/scratch-py-20260219-150405$/);
  });
});
