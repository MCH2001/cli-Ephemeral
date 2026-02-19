import type { ScratchLanguage, ScratchTemplate } from './types.js';

const templates: Record<ScratchLanguage, ScratchTemplate> = {
  ts: {
    language: 'ts',
    entrypoint: 'index.ts',
    files: [
      {
        path: 'index.ts',
        content: `type User = {
  id: number;
  name: string;
};

const users: User[] = [
  { id: 1, name: 'Ada' },
  { id: 2, name: 'Linus' }
];

console.log(users.map((user) => user.name).join(', '));
`
      },
      {
        path: 'tsconfig.json',
        content: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "skipLibCheck": true
  }
}
`
      },
      {
        path: 'package.json',
        content: `{
  "name": "scratch-ts",
  "private": true,
  "type": "module"
}
`
      }
    ]
  },
  js: {
    language: 'js',
    entrypoint: 'index.js',
    files: [
      {
        path: 'index.js',
        content: `const now = new Date();
console.log('Scratch JS says hi:', now.toISOString());
`
      }
    ]
  },
  py: {
    language: 'py',
    entrypoint: 'main.py',
    files: [
      {
        path: 'main.py',
        content: `from datetime import datetime, timezone

message = f"Scratch Python says hi: {datetime.now(timezone.utc).isoformat()}"
print(message)
`
      }
    ]
  },
  go: {
    language: 'go',
    entrypoint: 'main.go',
    files: [
      {
        path: 'go.mod',
        content: `module scratch

go 1.22
`
      },
      {
        path: 'main.go',
        content: `package main

import (
  "fmt"
  "time"
)

func main() {
  fmt.Printf("Scratch Go says hi: %s\\n", time.Now().UTC().Format(time.RFC3339))
}
`
      }
    ]
  }
};

export function getTemplate(language: ScratchLanguage): ScratchTemplate {
  return templates[language];
}
