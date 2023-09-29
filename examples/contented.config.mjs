/** @type {import('@contentedjs/contented').ContentedConfig} */
const config = {
  processor: {
    outDir: '.contented',
    pipelines: [
      {
        type: 'Example',
        pattern: '*/README.md',
        processor: 'md',
        fields: {
          framework: {
            type: 'string',
            required: false,
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
