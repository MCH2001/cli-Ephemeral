import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';

export interface EditorInvocation {
  command: string;
  args: string[];
  waitsForExit: boolean;
  label: string;
}

export function parseCommandString(commandString: string): string[] {
  const matches = commandString.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g);
  if (!matches || matches.length === 0) {
    throw new Error(`Invalid editor command: "${commandString}"`);
  }

  return matches.map((token) => {
    const first = token[0];
    const last = token[token.length - 1];
    if ((first === '"' && last === '"') || (first === '\'' && last === '\'')) {
      return token.slice(1, -1);
    }
    return token;
  });
}

function commandExists(command: string): boolean {
  const lookupBin = process.platform === 'win32' ? 'where' : 'which';
  const result = spawnSync(lookupBin, [command], { stdio: 'ignore' });
  return result.status === 0;
}

export function inferWaitBehavior(command: string, args: string[]): boolean {
  const executable = path.basename(command).toLowerCase();
  const normalizedArgs = args.map((arg) => arg.toLowerCase());

  if (executable === 'code' || executable === 'code-insiders') {
    return normalizedArgs.includes('--wait') || normalizedArgs.includes('-w');
  }

  if (executable === 'open') {
    return normalizedArgs.includes('-w');
  }

  if (executable === 'cmd') {
    return normalizedArgs.includes('/wait');
  }

  if (['vim', 'vi', 'nvim', 'nano', 'hx', 'emacs'].includes(executable)) {
    return true;
  }

  if (executable === 'xdg-open' || executable === 'start') {
    return false;
  }

  return false;
}

export function resolveEditorInvocation(override?: string): EditorInvocation {
  const configured = override ?? process.env.SCRATCH_EDITOR ?? process.env.VISUAL ?? process.env.EDITOR;

  if (configured) {
    const [command, ...args] = parseCommandString(configured);
    return {
      command,
      args,
      waitsForExit: inferWaitBehavior(command, args),
      label: command
    };
  }

  if (commandExists('code')) {
    return {
      command: 'code',
      args: ['-n', '--wait'],
      waitsForExit: true,
      label: 'Visual Studio Code'
    };
  }

  if (process.platform === 'darwin' && commandExists('open')) {
    return {
      command: 'open',
      args: ['-W'],
      waitsForExit: true,
      label: 'default macOS editor'
    };
  }

  if (process.platform === 'win32') {
    return {
      command: 'cmd',
      args: ['/c', 'start', '', '/WAIT'],
      waitsForExit: true,
      label: 'default Windows editor'
    };
  }

  if (commandExists('xdg-open')) {
    return {
      command: 'xdg-open',
      args: [],
      waitsForExit: false,
      label: 'default Linux editor'
    };
  }

  throw new Error(
    'No editor could be resolved. Set SCRATCH_EDITOR, VISUAL, or EDITOR to a command such as "code --wait".'
  );
}

export async function launchEditor(
  scratchDir: string,
  override?: string
): Promise<{ waited: boolean; editor: EditorInvocation }> {
  const editor = resolveEditorInvocation(override);

  await new Promise<void>((resolve, reject) => {
    const child = spawn(editor.command, [...editor.args, scratchDir], {
      stdio: 'inherit',
      shell: false
    });

    child.on('error', (error) => {
      reject(new Error(`Failed to open editor (${editor.command}): ${(error as Error).message}`));
    });

    child.on('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`Editor exited due to signal: ${signal}`));
        return;
      }
      if (code !== 0) {
        reject(new Error(`Editor exited with code ${code}`));
        return;
      }
      resolve();
    });
  });

  return { waited: editor.waitsForExit, editor };
}
