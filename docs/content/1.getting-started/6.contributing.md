---
title: Contributing
description: Learn how to contribute to Nuxt UI.
navigation: false
---

Nuxt UI thrives thanks to its fantastic community ❤️, which contributes by submitting issues, creating pull requests, and offering valuable feedback.

Before reporting a bug or reporting a feature, please make sure that you have read through our documentation and existing [issues](https://github.com/nuxt/ui/issues).

## Submitting a Pull Request (PR)

### 1. Before You Start

Check if there's an existing issue describing the problem or feature request you're working on. If there is, please leave a comment on the issue to let us know you're working on it.

If there isn't, open a new issue to discuss the problem or feature.

### 2. Local Development Setup

To begin local development, follow these steps:

1. Clone the `nuxt/ui` repository to your local machine:

```sh
git clone https://github.com/nuxt/ui.git
```

2. Enable [Corepack](https://github.com/nodejs/corepack):

```sh
corepack enable
```

3. Install dependencies:

```sh
pnpm install
```

4. Generate type stubs:

```sh
pnpm run dev:prepare
```

5. Configure your local development environment:

- To work on the **documentation** located in the `docs` folder, run:

```sh
pnpm run dev
```

- To test the components using **playground**, run:

```sh
pnpm run play
```

#### IDE Setup

We recommend using VS Code along with the ESLint extension. You can enable auto-fix and formatting when saving your code. Here's how:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll": false,
    "source.fixAll.eslint": true
  }
}
```

You can also use the `lint` command:

```sh
pnpm run lint # check for linting errors
pnpm run lint:fix # fix linting errors
```

#### No Prettier

Since ESLint is already configured to format the code, there's no need for duplicating functionality with Prettier.

If you have Prettier installed in your editor, we recommend disabling it to avoid conflicts.

#### Type Checking

We use TypeScript for type checking. You can use the `typecheck` command to check for type errors:

```sh
pnpm run typecheck
```

### 3. Commit Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages, which allows a changelog to be auto-generated based on the commits. Please read the [guide](https://www.conventionalcommits.org/en/v1.0.0/#summary) through if you aren't familiar with it already.

#### Note

- `fix` and `feat` are for actual code changes (that might affect logic). For typo or document changes, use `docs` or `chore` instead:

~~`fix: typo`~~ -> `docs: fix typo`

- If you are working on a specific component, ensure that you specify the main scope of your commit in brackets. e.g.

```
feat(Alert): new component
chore(Table): improve accessibility
```

### 4. Making a Pull Request

- Follow along the [instructions](https://github.com/nuxt/ui/blob/main/.github/PULL_REQUEST_TEMPLATE.md?plain=1) provided when creating a PR

- Ensure your PR's title adheres to the [Conventional Commits](https://www.conventionalcommits.org/) since it will be used once the code is merged.

- Multiple commits are fine; no need to rebase or force push. We'll use `Squash and Merge` when merging.

- Ensure linting and make tests manually before submitting the PR. Avoid making unrelated changes.

### 5. After You've Made a Pull Request

We'll review it promptly. If assigned to a maintainer, they'll review it carefully. Ignore the red text; it's for tracking purposes.

## Project Structure

In this project, you'll find a variety of folders and files that serve different purposes. Here's an overview of the main ones:

- **Documentation - `docs`** :

The documentation is located in the `docs` folder. It's a Nuxt app that uses the `@nuxt/content` module to generate the documentation pages from Markdown files. Here's a breakdown of its structure:

```
docs/
├── components/
│   ├── examples/     # Components used in documentation as examples
│   └── themes/       # Components used in the examples page in the theming section
├── content/          # Documentation, separated into categories according to component types
│   ├── 1.getting-started/
│   │   ├── 1.index.md
│   │   ├── 2.installation.md
│   │   ├── ... etc
│   ├── 2.elements/         # The category of components, which are elements
│   │   ├── 1.accordion.md  # Docs for a single component (i.e., accordion)
│   │   ├── 2.alert.md
│   │   ├── ... etc
└── ... etc
```

- **Components - `src`** :

The components are located in the `src` folder. It's separated into categories according to component types. Here's a breakdown of its structure:

```
src/
├── runtime/
│   ├── composables/            # Composable functions used in components
│   ├── components/             # Components folder, separated into categories according to component types
│   │   ├── data/               # The category of components, which are data related
│   │   │   ├── table.vue/      # Table component
│   │   │   ├── elements/       # Elements category
│   │   │   │   ├── ...etc/
│   │   │   └── ... etc/
│   │   ├── plugins/            # Plugins used in components
│   │   ├── utils/              # Utility functions used on the components page (e.g., lodash)
│   │   ├── types/              # Types used in components
│   │   │   ├── accordion.d.ts/ # [componentName].d.ts type used for single component
│   │   │   ├── avatar.d.ts/
│   │   │   └── ... etc/
│   │   ├── ui.config.ts/       # Configuration file used to apply styles to every component
├── colors.ts/                  # Everything related to color functions (e.g., safelistByComponent, generateSafelist)
└── ... etc/                    # Other files and folders
```

## Thanks

Thank you again for being interested in this project! You are awesome! ❤️
