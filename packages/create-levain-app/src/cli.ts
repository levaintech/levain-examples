import { ProjectProgram } from './ProjectProgram';
import { TemplateProgram } from './TemplateProgram';

async function run(): Promise<void> {
  const config = await ProjectProgram.run();
  await TemplateProgram.run(config);
}

void run();
