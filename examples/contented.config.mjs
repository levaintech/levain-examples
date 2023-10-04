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

/** @type {import('@contentedjs/contented').ContentedConfig} */
const config = {
  processor: {
    outDir: 'dist',
    pipelines: [
      {
        type: 'Example',
        pattern: '*/README.md',
        processor: MarkdownPipeline.withProcessor((processor) => {
          // Only enable a subset of plugins for levain-examples to keep the authoring experience simple.
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
          title: {
            type: 'string',
            required: true,
          },
          description: {
            type: 'string',
            required: true,
          },
          framework: {
            type: 'string',
            required: true,
          },
          publisher: {
            type: 'string',
            required: true,
          },
          template: {
            type: 'object',
            required: false,
          },
        },
        transform: (fileContent, filePath) => {
          return {
            ...fileContent,
            path: filePath.replace(/\/README\.md$/, ''),
            sections: [],
            headings: [],
          };
        },
      },
    ],
  },
};

export default config;
