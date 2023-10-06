import { join } from 'node:path';

import pacote from 'pacote';
import { blue } from 'picocolors';

import { ProjectConfig } from './ProjectProgram';

export class TemplateProgram {
  static async run(projectConfig: ProjectConfig): Promise<void> {
    console.log(`  Installing ${blue(projectConfig.template.packageName)} into ${blue(`./${projectConfig.path}`)}`);
    const installDir = join(process.cwd(), projectConfig.path);
    const packageSpec = `${projectConfig.template.packageName}@latest`;
    await pacote.extract(packageSpec, installDir);

    console.log(`  cd \`${blue(`./${projectConfig.path}`)}\` to work with your new project.`);
    if (projectConfig.template.messages?.postInstall) {
      console.log(`  ${projectConfig.template.messages.postInstall}`);
    }
  }
}
