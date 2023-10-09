<p align="center">
  <a href="https://levain.tech">
    <img src=".github/levain-logo.png" height="96">
    <h3 align="center">Levain Examples</h3>
  </a>
</p>

Our curated collection of examples and solutions. Use these starter patterns to build your own robust and scalable
crypto applications to streamline your development process.

Get started with templates by running `npx create-levain-app@latest` in your terminal.

## Levain Examples

Levain examples are self-contained projects that demonstrate a specific use case or feature of Levain.
They're a great way to get started with Levain and learn how some of the APIs work.

To isolate the examples from each other, each example should be its own directory and have its own `package.json` file.

## Levain Templates

Levain templates are a collection of pre-built use cases that can be used to quickly create a new project from the
command line or within the Levain Launchpad (https://app.levain.tech).
They're an extension of the examples that are available in this repository with bootstrapping capabilities.

### Adding & Managing Examples

Templates are published using `npm publish`, the nuances of `.gitingore`,
`files: []` in `package.json` and `.npmignore` are important to understand what files are published and what files are
ignored.

To better control what files are published, we recommend removing the `files: []` from the `package.json` and using
`.npmignore` to control what files are published.
`!.gitignore` should be added to the `.npmignore` file to ensure that the `.gitignore` file is published.
Any other files that should be ignored should be added to the `.npmignore` file.

### For Levainians

#### Publishing Templates

Examples (`./examples/*`) that have frontmatter and `template:` configured will be compatible with the Levain Launchpad
launcher.
This means that you can create a new project from the Levain Launchpad and select the example you want to start with
after whitelisting the example.
For more information on the available frontmatter options, see the `./examples/contented.config.mjs` file.

Accompanying prose should be added in the `README.md` as you would for any other project describing the example and how
to use it. The list of plugins for parsing and compiling the `README.md` is available in
the `./examples/contented.config.mjs` file.

> https://examples-frontmatter.levain.app contains all the examples and templates with prose compiled and rendered.

## Read the Docs

Levain examples are built on top of the Levain APIs. To learn more about the Levain APIs, check out
the [Levain Developer Docs](https://developer.levain.tech).

## Provide Feedback

- If you believe you have found a bug, please open an issue with detailed information on how to reproduce it.
- If you have any feedback or suggestions, feel free to open an issue within this repository or reach out to your
  Account Manager.
