import fs from 'node:fs';
import path from 'node:path';

import ExampleIndex from '@levain-examples/examples/dist/Example/index.json';
import { green } from 'picocolors';
import prompts from 'prompts';

import { isFolderEmpty } from './utils/FolderEmpty';
import { isNpmNameValid } from './utils/NpmNameValid';

// @ts-ignore - this file will always be present
import { version } from '../package.json';

export interface ProjectConfig {
  path: string;
  version: string;
  template: {
    packageName: string;
    projectName: string;
    messages: {
      postInstall?: string;
    };
  };
}

export class ProjectProgram {
  static async run(): Promise<ProjectConfig> {
    const res = await prompts([
      {
        type: 'text',
        name: 'path',
        message: 'What is your project named?',
        initial: 'my-app',
        validate: (name) => {
          const validation = isNpmNameValid(path.basename(path.resolve(name)));
          if (!validation.valid) {
            return `Invalid project name: ${validation.problems![0]}`;
          }

          const resolvedProjectPath = path.resolve(name);
          const root = path.resolve(resolvedProjectPath);
          const appName = path.basename(root);
          const folderExists = fs.existsSync(root);
          if (folderExists) {
            const empty = isFolderEmpty(root);
            if (!empty.valid) {
              return `The directory ${green(
                appName,
              )} contains files that could conflict with the project setup. Try using a different project name or delete the files mentioned above.`;
            }
          }

          return true;
        },
      },
      {
        type: 'select',
        name: 'packageName',
        message: 'Select a template',
        choices: ExampleIndex.filter((example) => example.fields.template).map((example) => {
          const template = example.fields.template!;
          return {
            title: template.projectName,
            value: template.packageName,
          };
        }),
      },
    ]);

    return {
      path: res.path,
      version,
      template: ExampleIndex.find((example) => example.fields.template?.packageName === res.packageName)?.fields
        .template!,
    };
  }
}
