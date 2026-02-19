import type { Interface } from 'node:readline/promises';

export async function promptYesNo(
  rl: Interface,
  question: string,
  defaultValue: boolean
): Promise<boolean> {
  // Keep asking until an explicit yes/no (or empty default) is provided.
  while (true) {
    const answer = (await rl.question(question)).trim().toLowerCase();

    if (answer === '') {
      return defaultValue;
    }

    if (answer === 'y' || answer === 'yes') {
      return true;
    }

    if (answer === 'n' || answer === 'no') {
      return false;
    }

    process.stdout.write('Please answer with yes or no.\n');
  }
}

export async function promptText(
  rl: Interface,
  question: string,
  defaultValue?: string
): Promise<string> {
  const answer = (await rl.question(question)).trim();
  if (answer.length > 0) {
    return answer;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  return '';
}
