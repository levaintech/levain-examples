import {
  MarkdownPipeline,
  rehypeAutolinkHeadings,
  rehypeExternalLinks,
  rehypeShiki,
  rehypeSlug,
  rehypeStringify,
  rehypeToc,
  remarkFrontmatter,
  remarkFrontmatterCollect,
  remarkFrontmatterResolve,
  remarkFrontmatterValidate,
  remarkGfm,
  remarkParse,
  remarkRehype,
} from '@contentedjs/contented-pipeline-md';
import fs from 'node:fs/promises';
import path from 'node:path';

/** @type {import('@contentedjs/contented').ContentedConfig} */
const config = {
  preview: {
    name: 'Levain Examples Frontmatter',
    url: 'https://examples-frontmatter.levain.app',
    github: {
      url: 'https://github.com/levaintech/levain-examples',
    },
  },
  processor: {
    pipelines: [
      {
        type: 'Example',
        pattern: '*/README.md',
        /**
         * To reduce complexity,
         * only enable a subset of plugins for levain-examples to keep the authoring experience simple.
         */
        processor: MarkdownPipeline.withProcessor((processor) => {
          processor
            .use(remarkGfm)
            .use(remarkFrontmatter)
            .use(remarkParse)
            .use(remarkFrontmatterCollect)
            .use(remarkFrontmatterResolve)
            .use(remarkFrontmatterValidate)
            .use(remarkRehype)
            .use(rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] })
            .use(rehypeSlug)
            .use(rehypeAutolinkHeadings)
            .use(rehypeToc)
            .use(rehypeShiki)
            .use(rehypeStringify);
        }),
        fields: {
          /**
           * Title of the example.
           */
          title: {
            type: 'string',
            required: true,
          },
          /**
           * Description of the example, this will be used as the meta-description and og:description.
           */
          description: {
            type: 'string',
            required: true,
          },
          /**
           * Metadata framework to allow filtering by framework.
           * This is technology/framework used in the example, e.g. Next.js, Gatsby, etc.
           */
          framework: {
            type: 'string',
            required: true,
          },
          /**
           * Metadata publisher to allow filtering by publisher.
           * For Levainians this is "Levain", this is your company name or github username.
           */
          publisher: {
            type: 'string',
            required: true,
          },
          /**
           * Template Object for use within Levain Launchpad.
           */
          template: {
            type: 'object',
            required: false,
            resolve: async (value, context) => {
              if (!value) {
                return null;
              }

              const projectName = context.file.filePath.replace(/\/.+\.md$/, '');
              const projectPath = path.join(projectName, 'package.json');
              const packageJson = JSON.parse(await fs.readFile(projectPath, 'utf-8'));

              return {
                projectName: projectName,
                packageName: packageJson.name,
                prompts: value.prompts ?? [],
                messages: value.messages ?? {},
              };
            },
          },
          /**
           * Auto-generated link to edit the example on GitHub.
           * You can ignore this field since it's auto-generated.
           */
          editOnGitHubLink: {
            type: 'string',
            resolve: (_, { file }) => {
              return `https://github.com/levaintech/levain-examples/edit/main/examples/${file.data.contented.filePath}`;
            },
          },
        },
        transform: (fileContent) => {
          return {
            ...fileContent,
            path: fileContent.path.replace(/\/readme$/, ''),
            sections: [],
            headings: [],
          };
        },
      },
    ],
  },
};

export default config;
