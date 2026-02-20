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
  },
  c: {
    language: 'c',
    entrypoint: 'main.c',
    files: [
      {
        path: 'main.c',
        content: `#include <stdio.h>

int main(void) {
  puts("Scratch C says hi.");
  return 0;
}
`
      },
      {
        path: 'Makefile',
        content: `CC ?= cc
CFLAGS ?= -Wall -Wextra -pedantic -std=c11
TARGET ?= app
SRC := main.c

all: $(TARGET)

$(TARGET): $(SRC)
\t$(CC) $(CFLAGS) $(SRC) -o $(TARGET)

run: $(TARGET)
\t./$(TARGET)

clean:
\trm -f $(TARGET)

.PHONY: all run clean
`
      }
    ]
  },
  cpp: {
    language: 'cpp',
    entrypoint: 'main.cpp',
    files: [
      {
        path: 'main.cpp',
        content: `#include <iostream>

int main() {
  std::cout << "Scratch C++ says hi." << std::endl;
  return 0;
}
`
      },
      {
        path: 'Makefile',
        content: `CXX ?= c++
CXXFLAGS ?= -Wall -Wextra -pedantic -std=c++17
TARGET ?= app
SRC := main.cpp

all: $(TARGET)

$(TARGET): $(SRC)
\t$(CXX) $(CXXFLAGS) $(SRC) -o $(TARGET)

run: $(TARGET)
\t./$(TARGET)

clean:
\trm -f $(TARGET)

.PHONY: all run clean
`
      }
    ]
  },
  java: {
    language: 'java',
    entrypoint: 'Main.java',
    files: [
      {
        path: 'Main.java',
        content: `public class Main {
  public static void main(String[] args) {
    System.out.println("Scratch Java says hi.");
  }
}
`
      }
    ]
  }
};

export function getTemplate(language: ScratchLanguage): ScratchTemplate {
  return templates[language];
}
