import { readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import execa from 'execa';
import pacote from 'pacote';
import { blue } from 'picocolors';

import { ProjectConfig } from './ProjectProgram';

export class TemplateProgram {
  static async run(projectConfig: ProjectConfig): Promise<void> {
    console.log(`  Downloading ${blue(projectConfig.template.packageName)} into ${blue(`./${projectConfig.path}`)}`);
    const installDir = join(process.cwd(), projectConfig.path);
    const packageSpec = `${projectConfig.template.packageName}@${projectConfig.version}`;
    await pacote.extract(packageSpec, installDir);

    await overridePackageJson(installDir, projectConfig);
    await overrideFiles(installDir);

    console.log(`  Installing dependencies...`);
    await execa('npm', ['install'], { cwd: installDir });

    console.log(`  cd \`${blue(`./${projectConfig.path}`)}\` to work with your new project.`);
    if (projectConfig.template.messages?.postInstall) {
      console.log(`  ${projectConfig.template.messages.postInstall}`);
    }
  }
}

/**
 * Override the package.json file in the template.
 */
async function overridePackageJson(installDir: string, projectConfig: ProjectConfig): Promise<void> {
  const packageJsonPath = join(installDir, 'package.json');
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'));
  packageJson.name = projectConfig.path;
  packageJson.private = true;
  packageJson.version = '0.0.0';
  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

/**
 * Override certain files in the template.
 */
async function overrideFiles(installDir: string): Promise<void> {
  // Move the .npmignore file to .gitignore due to npm's behavior of replacing .gitignore with .npmignore.
  await execa('mv', ['.npmignore', '.gitignore'], { cwd: installDir });

  // Remove the LICENSE file from the template such that it doesn't assume the user is using the MIT license.
  await rm(join(installDir, 'LICENSE'));
}
