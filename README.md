# Ephemeral Scratchpad CLI

A production-grade CLI for spinning up disposable scratch workspaces in your OS temp directory.

## What it solves

When you need to test a tiny idea quickly, `scratch` gives you an instant workspace and a clean lifecycle:

1. Creates a temporary directory (`/tmp` on Unix-like systems).
2. Scaffolds a minimal language starter (`TypeScript`, `JavaScript`, `Python`, or `Go`).
3. Opens the workspace in your editor.
4. When you are done, prompts you to either save it somewhere permanent or discard it.

No desktop clutter, no manually creating throwaway folders.

If a save operation fails, the CLI preserves the temp workspace automatically so you do not lose edits.

## Install

```bash
npm install -g ephemeral-scratchpad-cli
```

For local development in this repo:

```bash
npm install
npm run build
npm link
```

Then run:

```bash
scratch --ts
```

## Usage

```bash
scratch [--ts|--js|--py|--go] [--editor "code --wait"] [--dest <path>] [--keep-temp]
```

### Flags

- `--ts`: TypeScript scratchpad (default)
- `--js`: JavaScript scratchpad
- `--py`: Python scratchpad
- `--go`: Go scratchpad
- `--editor <command>`: Override editor command
- `--dest <path>`: Default save path if you choose to keep the scratchpad
- `--keep-temp`: Keep the temp workspace after the session ends

## Editor behavior

Editor resolution order:

1. `--editor`
2. `SCRATCH_EDITOR`
3. `VISUAL`
4. `EDITOR`
5. `code -n --wait` (if available)
6. OS fallback (`open -W` on macOS, `cmd /c start /WAIT` on Windows, `xdg-open` on Linux)

For guaranteed close detection, prefer an editor command that supports wait semantics (for example: `code --wait`).

## Development

```bash
npm install
npm run check
```

## CI/CD

- `CI`: Runs lint, tests, and build on pull requests and pushes.
- `Release`: Runs on git tags matching `v*`; publishes to npm if `NPM_TOKEN` is configured and creates a GitHub Release.

Required secrets for publishing:

- `NPM_TOKEN`

## Suggested release flow

```bash
npm version patch
git push --follow-tags
```
