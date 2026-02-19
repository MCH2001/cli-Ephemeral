export type ScratchLanguage = 'ts' | 'js' | 'py' | 'go';

export interface ScratchCliOptions {
  ts?: boolean;
  js?: boolean;
  py?: boolean;
  go?: boolean;
  editor?: string;
  keepTemp?: boolean;
  dest?: string;
}

export interface ScratchTemplateFile {
  path: string;
  content: string;
  executable?: boolean;
}

export interface ScratchTemplate {
  language: ScratchLanguage;
  entrypoint: string;
  files: ScratchTemplateFile[];
}
