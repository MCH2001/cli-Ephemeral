# Ephemeral Scratchpad CLI

A production-grade CLI for spinning up disposable scratch workspaces in your OS temp directory.

## What it solves

When you need to test a tiny idea quickly, `scratch` gives you an instant workspace and a clean lifecycle:

1. Creates a temporary directory (`/tmp` on Unix-like systems).
2. Scaffolds a minimal language starter (`TypeScript`, `JavaScript`, `Python`, `Go`, `C`, `C++`, or `Java`).
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
scratch [--ts|--js|--py|--go|--c|--cpp|--java] [--editor "code --wait"] [--dest <path>] [--keep-temp]
scratch clean <path>
scratch clean-all
```

### Flags

- `--ts`: TypeScript scratchpad (default)
- `--js`: JavaScript scratchpad
- `--py`: Python scratchpad
- `--go`: Go scratchpad
- `--c`: C scratchpad (includes a simple `Makefile`)
- `--cpp`: C++ scratchpad (includes a simple `Makefile`)
- `--java`: Java scratchpad
- `--editor <command>`: Override editor command
- `--dest <path>`: Default save path if you choose to keep the scratchpad
- `--keep-temp`: Keep the temp workspace after the session ends

### Cleanup command

Use `scratch clean <path>` to remove a scratch workspace that was preserved with `--keep-temp` or after a failed session.

- `<path>` can be either the workspace directory itself or any file inside that workspace.
- The command only deletes workspaces named `scratch-*` inside your OS temp directory for safety.

Use `scratch clean-all` to remove all scratch workspaces in your OS temp directory in one command.

- This only removes directories named `scratch-ts-*`, `scratch-js-*`, `scratch-py-*`, `scratch-go-*`, `scratch-c-*`, `scratch-cpp-*`, or `scratch-java-*`.

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
npm ci
npm run check
```

## CI/CD

- `CI`: Runs deterministic install (`npm ci`), then `npm run check` (typecheck, tests, build) and `npm pack --dry-run`.
- `Release`: Runs on git tags matching `v*`; executes the same verification gate, requires `NPM_TOKEN`, then publishes to npm and creates a GitHub Release.

Required secrets for publishing:

- `NPM_TOKEN`

## Suggested release flow

```bash
npm version patch
git push --follow-tags
```
