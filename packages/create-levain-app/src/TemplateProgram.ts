import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { execa } from 'execa';
import pacote from 'pacote';
import { blue } from 'picocolors';

import { ProjectConfig } from './ProjectProgram';

export class TemplateProgram {
  static async run(projectConfig: ProjectConfig): Promise<void> {
    console.log(`  Downloading ${blue(projectConfig.template.packageName)} into ${blue(`./${projectConfig.path}`)}`);
    const installDir = join(process.cwd(), projectConfig.path);
    const packageSpec = `${projectConfig.template.packageName}@latest`;
    await pacote.extract(packageSpec, installDir);

    await overridePackageJson(installDir, projectConfig);

    console.log(`  Installing dependencies...`);
    await execa('npm', ['install'], { cwd: installDir });

    console.log(`  cd \`${blue(`./${projectConfig.path}`)}\` to work with your new project.`);
    if (projectConfig.template.messages?.postInstall) {
      console.log(`  ${projectConfig.template.messages.postInstall}`);
    }
  }
}

async function overridePackageJson(installDir: string, projectConfig: ProjectConfig): Promise<void> {
  const packageJsonPath = join(installDir, 'package.json');
  const packageJson = await import(packageJsonPath);
  packageJson.name = projectConfig.path;
  packageJson.private = true;
  packageJson.version = '0.0.0';
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}
