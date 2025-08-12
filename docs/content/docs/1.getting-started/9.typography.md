---
title: Typography
description: 'Nuxt UI provides beautiful typography components and utilities to style your content.'
framework: nuxt
navigation.icon: i-lucide-type
---

## Usage

When using Nuxt UI with [Nuxt Content](https://content.nuxt.com/), you get access to a set of pre-styled prose components.

When using the [`<ContentRenderer>`](https://content.nuxt.com/docs/components/content-renderer) component, your markdown content will be automatically styled with beautiful typography and consistent spacing. This includes headings, paragraphs, lists, tables, code blocks and more - no additional configuration required.

::note{to="https://content.nuxt.com/docs/getting-started/installation" target="_blank"}
You can follow `@nuxt/content` installation guide to get started.
::

## Prose Components

Prose components are replacements for HTML typography tags introduced by the [`@nuxtjs/mdc`](https://github.com/nuxt-modules/mdc) module, Nuxt UI overrides each one to provide a consistent look and feel.

::note{to="https://content.nuxt.com/docs/components/prose" target="_blank"}
You can learn more about Prose components in the Nuxt Content documentation.
::

::tip
You can use the prose components directly in your templates using the `Prose` prefix.

```vue
<template>
  <ProseTable>
    <ProseThead>
      <ProseTr>
        <ProseTh>Prop</ProseTh>
        <ProseTh>Default</ProseTh>
      </ProseTr>
    </ProseThead>
    <ProseTbody>
      <ProseTr>
        <ProseTd>
          <ProseCode>color</ProseCode>
        </ProseTd>
        <ProseTd>
          <ProseCode>neutral</ProseCode>
        </ProseTd>
      </ProseTr>
    </ProseTbody>
  </ProseTable>
</template>
```

::

### `h1`

::tabs{class="gap-0"}

::code-preview{label="Preview" class="[&>div]:*:my-0"}

# Nuxt UI

#code

```mdc
# Nuxt UI
```

::

:component-theme{slug="h1" prose label="Theme"}

::

### `h2`

::tabs{class="gap-0"}

::code-preview{label="Preview" class="[&>div]:*:my-0"}

## What's new in v3?

#code

```mdc
## What's new in v3?
```

::

:component-theme{slug="h2" prose label="Theme"}

::

### `h3`

::tabs{class="gap-0"}

::code-preview{label="Preview" class="[&>div]:*:my-0"}

### Tailwind CSS v4

#code

```mdc
### Tailwind CSS v4
```

::

:component-theme{slug="h3" prose label="Theme"}

::

### `h4`

::tabs{class="gap-0"}

::code-preview{label="Preview" class="[&>div]:*:my-0"}

#### Install Nuxt UI

#code

```mdc
#### Install Nuxt UI
```

::

:component-theme{slug="h4" prose label="Theme"}

::

### `p`

::tabs{class="gap-0"}

::code-preview{label="Preview" class="[&>div]:*:my-0"}
Nuxt UI Pro is a collection of Vue components, composables and utils built on top of Nuxt UI, oriented on structure and layout and designed to be used as building blocks for your app.

#code

```mdc
Nuxt UI Pro is a collection of Vue components, composables and utils built on top of Nuxt UI, oriented on structure and layout and designed to be used as building blocks for your app.
```

::

:component-theme{slug="p" prose label="Theme"}

::

### `a`

::tabs{class="gap-0"}

::code-preview{label="Preview" class="[&>div]:*:my-0"}
[Nuxt documentation](https://nuxt.com)

#code

```mdc
[Nuxt documentation](https://nuxt.com)
```

::

:component-theme{slug="a" prose label="Theme"}

::

### `blockquote`

::tabs{class="gap-0"}

::code-preview{label="Preview"}
> While Nuxt UI is free and open source, Nuxt UI Pro is a premium product that helps sustain Nuxt OSS development, check out the License section to learn more.

#code

```mdc
> While Nuxt UI is free and open source, Nuxt UI Pro is a premium product that helps sustain Nuxt OSS development, check out the License section to learn more.
```

::

:component-theme{slug="blockquote" prose label="Theme"}

::

### `strong`

::tabs{class="gap-0"}

::code-preview{label="Preview" class="[&>div]:*:my-0"}
**Strong text**

#code

```mdc
**Strong text**
```

::

:component-theme{slug="strong" prose label="Theme"}

::

### `em`

::tabs{class="gap-0"}

::code-preview{label="Preview" class="[&>div]:*:my-0"}
*Emphasized text*

#code

```mdc
*Emphasized text*
```

::

:component-theme{slug="em" prose label="Theme"}

::

### `ul`

::tabs{class="gap-0"}

::code-preview{label="Preview" class="[&>div]:*:my-0"}

- I'm a list item.
- I'm another list item.
- I'm the last list item.

#code

```mdc
- I'm a list item.
- I'm another list item.
- I'm the last list item.
```

::

::component-theme{slug="ul" prose label="Theme"}
---
extra:
  - li
---
::

::

### `ol`

::tabs{class="gap-0"}

::code-preview{label="Preview" class="[&>div]:*:my-0"}

1. I'm a list item.
2. I'm another list item.
3. I'm the last list item.

#code

```mdc
1. I'm a list item.
2. I'm another list item.
3. I'm the last list item.
```

::

::component-theme{slug="ol" prose label="Theme"}
---
extra:
  - li
---
::

::

### `hr`

::tabs{class="gap-0"}

::code-preview{label="Preview" class="[&>div]:*:my-0 [&>div]:*:w-full"}
:hr

#code

```mdc
---
```

::

:component-theme{slug="hr" prose label="Theme"}

::

### `table`

::tabs{class="gap-0"}

::code-preview{label="Preview" class="[&>div]:*:my-0 [&>div]:*:w-full"}

| Prop    | Default   | Type                     |
|---------|-----------|--------------------------|
| `name`  |           | `string`{lang="ts-type"} |
| `size`  | `md`      | `string`{lang="ts-type"} |
| `color` | `neutral` | `string`{lang="ts-type"} |

#code

```mdc
| Prop    | Default   | Type                     |
|---------|-----------|--------------------------|
| `name`  |           | `string`{lang="ts-type"} |
| `size`  | `md`      | `string`{lang="ts-type"} |
| `color` | `neutral` | `string`{lang="ts-type"} |
```

::

::component-theme{slug="table" prose label="Theme"}
---
extra:
  - thead
  - tbody
  - tr
  - th
  - td
---
::

::

### `img`

::code-preview
![Nuxt Social Image](https://nuxt.com/new-social.jpg)

#code

```mdc
![Nuxt Social Image](https://nuxt.com/new-social.jpg)
```

::

::note
If [`@nuxt/image`](https://image.nuxt.com/get-started/installation) is installed, the `<NuxtImg>` component will be used instead of the native `img` tag.
::

::tabs{class="gap-0"}

:component-props{name="img" prose label="Props"}

:component-theme{slug="img" prose label="Theme"}

::

### `code`

::code-preview{class="[&>div]:*:my-0"}
`inline code`

#code

```mdc
`inline code`
```

::

You can use the `color` prop to specify the color of the code block. Defaults to `neutral`.

::code-preview{class="[&>div]:*:my-0"}
`inline code`{color="error"}

#code

```mdc
`inline code`{color="error"}
```

::

You can use the `lang` prop to specify the language of the code block.

::code-preview{label="Preview" class="[&>div]:*:my-0"}
`nuxt.config.ts`{lang="ts-type"}

#code

```mdc
`nuxt.config.ts`{lang="ts-type"}
```

::

::tabs{class="gap-0"}

:component-props{name="code" prose label="Props"}

:component-theme{slug="code" prose label="Theme"}

::

### `pre`

Code-blocks are rendered by the `ProsePre` component of `@nuxtjs/mdc` and [code highlighting](https://content.nuxt.com/docs/files/markdown#code-highlighting) is done underneath by [Shiki](https://github.com/shikijs/shiki).

::tip
By default for syntax highlighting, `material-theme-lighter` and `material-theme-palenight` VSCode themes are used for light & dark mode respectively. You can change this in your `nuxt.config.ts` through the [`content.build.markdown.highlight`](https://content.nuxt.com/docs/getting-started/configuration#highlight) key.
::

::code-preview{class="[&>div]:*:my-0 [&>div]:*:w-full"}

```ts
export default defineNuxtConfig({
  modules: ['@nuxt/ui']
})
```

#code

````mdc
```ts
export default defineNuxtConfig({
  modules: ['@nuxt/ui']
})
```
````

::

When writing a code-block, you can specify a filename that will be displayed on top of the code block. An icon will be automatically displayed based on the extension or the name.

::code-preview{class="[&>div]:*:my-0 [&>div]:*:w-full"}

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxt/ui']
})
```

#code

````mdc
```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxt/ui']
})
```
````

::

::tip
Some icons are already defined by default, but you can add more in your `app.config.ts` through the `uiPro.prose.codeIcon` key:

```ts [app.config.ts]
export default defineAppConfig({
  uiPro: {
    prose: {
      codeIcon: {
        terminal: 'i-ph-terminal-window-duotone'
      }
    }
  }
})
```

::

Every code-block has a built-in copy button that will copy the code to your clipboard.

::tip
You can change the icon in your `app.config.ts` through the `ui.icons.copy` and `ui.icons.copyCheck` keys:

```ts [app.config.ts]
export default defineAppConfig({
  ui: {
    icons: {
      copy: 'i-lucide-copy',
      copyCheck: 'i-lucide-copy-check'
    }
  }
})
```

::

::tabs{class="gap-0"}

:component-props{name="pre" prose label="Props"}

::component-theme{slug="pre" prose label="Theme"}
---
extra:
  - codeIcon
---
::

::

## Vue Components

Nuxt UI Pro also provides a set of Vue components to help you write your content using the [MDC syntax](https://content.nuxt.com/docs/files/markdown#mdc-syntax).

### `Accordion`

Use the `accordion` and `accordion-item` components to display an [Accordion](/docs/components/accordion) in your content.

::code-preview{class="[&>div]:*:my-0"}

:::accordion

::accordion-item{label="What are the main considerations when upgrading to Nuxt UI v3?" icon="i-lucide-circle-help"}
The transition to v3 involves significant changes, including new component structures, updated theming approaches, and revised TypeScript definitions. We recommend a careful, incremental upgrade process, starting with thorough testing in a development environment.
::

::accordion-item{label="Is Nuxt UI v3 compatible with standalone Vue projects?" icon="i-lucide-circle-help"}
Nuxt UI is now compatible with Vue! You can follow the [installation guide](/docs/getting-started/installation/vue) to get started.
::

::accordion-item{label="What about Nuxt UI Pro?" icon="i-lucide-circle-help"}
We've also rebuilt Nuxt UI Pro from scratch and released a `v3.0.0-alpha.x` package but it only contains the components to build this documentation yet. This will be a free update, so the license you buy now will be valid for v3. We're actively working to finish the rewrite of all Nuxt UI Pro components.
::

:::

#code

```mdc
::accordion

::accordion-item{label="What are the main considerations when upgrading to Nuxt UI v3?" icon="i-lucide-circle-help"}
The transition to v3 involves significant changes, including new component structures, updated theming approaches, and revised TypeScript definitions. We recommend a careful, incremental upgrade process, starting with thorough testing in a development environment.
::

::accordion-item{label="Is Nuxt UI v3 compatible with standalone Vue projects?" icon="i-lucide-circle-help"}
Nuxt UI is now compatible with Vue! You can follow the [installation guide](/docs/getting-started/installation/vue) to get started.
::

::accordion-item{label="What about Nuxt UI Pro?" icon="i-lucide-circle-help"}
We've also rebuilt Nuxt UI Pro from scratch and released a `v3.0.0-alpha.x` package but it only contains the components to build this documentation yet. This will be a free update, so the license you buy now will be valid for v3. We're actively working to finish the rewrite of all Nuxt UI Pro components.
::

::
```

::

::tabs{class="gap-0"}

:component-props{name="accordion" prose label="Props"}

::component-theme{slug="accordion" prose label="Theme"}
---
extra:
  - accordionItem
---
::

::

### `Badge`

Use markdown in the default slot of the `badge` component to display a [Badge](/docs/components/badge) in your content.

::tabs{class="gap-0"}

::code-preview{label="Preview"}

:::badge
**v3.0.0**
:::

#code

```mdc
::badge
**v3.0.0**
::
```

::

:component-theme{slug="badge" prose label="Theme"}

::

### `Callout`

Use markdown in the default slot of the `callout` component to add eye-catching context to your content.

Use the `icon` and `color` props to customize it. You can also pass any property from the [`<NuxtLink>`](https://nuxt.com/docs/api/components/nuxt-link) component.

::component-code{slug="callout" prose}
---
prettier: true
props:
  icon: i-lucide-square-play
  color: neutral
  to: '/docs/getting-started/installation/pro/nuxt'
  class: 'w-full my-0'
hide:
  - class
slots:
  default: This is a `callout` with full **markdown** support.
---

Learn how to install `@nuxt/ui` in your project.
::

You can also use the `note`, `tip`, `warning` and `caution` shortcuts with pre-defined icons and colors.

::code-preview{label="Preview"}

:::div{class="flex flex-col gap-4 w-full"}

::note{class="w-full my-0"}
Here's some additional information for you.
::

::tip{class="w-full my-0"}
Here's a helpful suggestion.
::

::warning{class="w-full my-0"}
Be careful with this action as it might have unexpected results.
::

::caution{class="w-full my-0"}
This action cannot be undone.
::

:::

#code

```mdc
::note
Here's some additional information.
::

::tip
Here's a helpful suggestion.
::

::warning
Be careful with this action as it might have unexpected results.
::

::caution
This action cannot be undone.
::
```

::

### `Card`

Use markdown in the default slot of the `card` component to highlight your content.

Use the `title`, `icon` and `color` props to customize it. You can also pass any property from the [`<NuxtLink>`](https://nuxt.com/docs/api/components/nuxt-link).

::component-code{slug="card" prose}
---
hide:
  - class
ignore:
  - target
props:
  class: 'my-0 w-96'
  title: Startup
  icon: i-lucide-users
  color: primary
  to: 'https://nuxt.lemonsqueezy.com'
  target: '_blank'
slots:
  default: Best suited for small teams, startups and agencies with up to 5 developers.
---

Best suited for small teams, startups and agencies with up to 5 developers.
::

### `CardGroup`

Wrap your `card` components with the `card-group` component to group them together in a grid layout.

::code-preview

:::card-group{class="w-full my-0"}

::card
---
title: Dashboard
icon: i-simple-icons-github
to: https://github.com/nuxt-ui-pro/dashboard
target: _blank
---
A dashboard with multi-column layout.
::

::card
---
title: SaaS
icon: i-simple-icons-github
to: https://github.com/nuxt-ui-pro/saas
target: _blank
---
A template with landing, pricing, docs and blog.
::

::card
---
title: Docs
icon: i-simple-icons-github
to: https://github.com/nuxt-ui-pro/docs
target: _blank
---
A documentation with `@nuxt/content`.
::

::card
---
title: Landing
icon: i-simple-icons-github
to: https://github.com/nuxt-ui-pro/landing
target: _blank
---
A landing page you can use as starting point.
::

:::

#code

```mdc
::card-group

::card
---
title: Dashboard
icon: i-simple-icons-github
to: https://github.com/nuxt-ui-pro/dashboard
target: _blank
---
A dashboard with multi-column layout.
::

::card
---
title: SaaS
icon: i-simple-icons-github
to: https://github.com/nuxt-ui-pro/saas
target: _blank
---
A template with landing, pricing, docs and blog.
::

::card
---
title: Docs
icon: i-simple-icons-github
to: https://github.com/nuxt-ui-pro/docs
target: _blank
---
A documentation with `@nuxt/content`.
::

::card
---
title: Landing
icon: i-simple-icons-github
to: https://github.com/nuxt-ui-pro/landing
target: _blank
---
A landing page you can use as starting point.
::

::
```

::

::tabs{class="gap-0"}

:component-theme{slug="card-group" prose label="Theme"}

::

### `CodeCollapse`

Wrap your code-block with a `code-collapse` component to display a collapsible code block.

::code-preview{class="[&>div]:*:my-0 [&>div]:*:w-full"}

::code-collapse{class="[&>div]:my-0"}

```css [main.css]
@import "tailwindcss";
@import "@nuxt/ui";

@theme static {
  --font-sans: 'Public Sans', sans-serif;

  --breakpoint-3xl: 1920px;

  --color-green-50: #EFFDF5;
  --color-green-100: #D9FBE8;
  --color-green-200: #B3F5D1;
  --color-green-300: #75EDAE;
  --color-green-400: #00DC82;
  --color-green-500: #00C16A;
  --color-green-600: #00A155;
  --color-green-700: #007F45;
  --color-green-800: #016538;
  --color-green-900: #0A5331;
  --color-green-950: #052E16;
}
```

::

#code

````mdc
::code-collapse

```css [main.css]
@import "tailwindcss";
@import "@nuxt/ui";

@theme static {
  --font-sans: 'Public Sans', sans-serif;

  --breakpoint-3xl: 1920px;

  --color-green-50: #EFFDF5;
  --color-green-100: #D9FBE8;
  --color-green-200: #B3F5D1;
  --color-green-300: #75EDAE;
  --color-green-400: #00DC82;
  --color-green-500: #00C16A;
  --color-green-600: #00A155;
  --color-green-700: #007F45;
  --color-green-800: #016538;
  --color-green-900: #0A5331;
  --color-green-950: #052E16;
}
```

::
````

::

::tabs{class="gap-0"}

:component-props{name="code-collapse" prose label="Props"}

:component-theme{slug="code-collapse" prose label="Theme"}

::

### `CodeGroup`

Wrap your code-blocks around a `code-group` component to group them together in tabs.

::code-preview{class="[&>div]:*:my-0 [&>div]:*:w-full"}

:::code-group

```bash [pnpm]
pnpm add @nuxt/ui
```

```bash [yarn]
yarn add @nuxt/ui
```

```bash [npm]
npm install @nuxt/ui
```

```bash [bun]
bun add @nuxt/ui
```

:::

#code

````mdc
::code-group

```bash [pnpm]
pnpm add @nuxt/ui
```

```bash [yarn]
yarn add @nuxt/ui
```

```bash [npm]
npm install @nuxt/ui
```

```bash [bun]
bun add @nuxt/ui
```

::
````

::

::note{to="#pre"}
Like the `ProsePre` component, the `CodeGroup` handles filenames, icons and copy button.
::

::tabs{class="gap-0"}

:component-props{name="code-group" prose label="Props"}

:component-theme{slug="code-group" prose label="Theme"}

::

### `CodePreview`

Wrap a code-block with the `code-preview` component to display a preview of an MDC component and its code using the `code` slot.

::code-preview{class="[&>div]:*:my-0 [&>div]:*:w-full" label="Preview"}

::code-preview{class="[&>div]:*:my-0"}
`inline code`

#code

```mdc
`inline code`
```

::

#code

````mdc
::code-preview
`inline code`

#code
```mdc
`inline code`
```
::
````

::

::tabs{class="gap-0"}

:component-props{name="code-preview" prose label="Props"}

:component-theme{slug="code-preview" prose label="Theme"}

::

### `CodeTree`

Wrap your code-blocks with a `code-tree` component in any particular order to display a tree view of your files.

::code-preview{class="[&>div]:*:my-0 [&>div]:*:w-full"}

::code-tree{defaultValue="app/app.config.ts"}

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],

  css: ['~/assets/css/main.css']
})

```

```css [app/assets/css/main.css]
@import "tailwindcss";
@import "@nuxt/ui";
```

```ts [app/app.config.ts]
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'sky',
      colors: 'slate'
    }
  }
})
```

```vue [app/app.vue]
<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
```

```json [package.json]
{
  "name": "nuxt-app",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare",
    "typecheck": "nuxt typecheck"
  },
  "dependencies": {
    "@iconify-json/lucide": "^1.2.18",
    "@nuxt/ui": "^4.0.0",
    "nuxt": "^3.16.0"
  },
  "devDependencies": {
    "typescript": "^5.8.2",
    "vue-tsc": "^2.2.10"
  }
}
```

```json [tsconfig.json]
{
  "extends": "./.nuxt/tsconfig.json"
}
```

````md [README.md]
# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
````

::

#code

::code-collapse{class="[&>div>pre]:rounded-t-none [&>div]:my-0"}

`````mdc
::code-tree{defaultValue="app/app.config.ts"}

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],

  css: ['~/assets/css/main.css']
})

```

```css [app/assets/css/main.css]
@import "tailwindcss";
@import "@nuxt/ui";
```

```ts [app/app.config.ts]
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'sky',
      colors: 'slate'
    }
  }
})
```

```vue [app/app.vue]
<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
```

```json [package.json]
{
  "name": "nuxt-app",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare",
    "typecheck": "nuxt typecheck"
  },
  "dependencies": {
    "@iconify-json/lucide": "^1.2.18",
    "@nuxt/ui": "^4.0.0",
    "nuxt": "^3.16.0"
  },
  "devDependencies": {
    "typescript": "^5.8.2",
    "vue-tsc": "^2.2.10"
  }
}
```

```json [tsconfig.json]
{
  "extends": "./.nuxt/tsconfig.json"
}
```

````md [README.md]
# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
````

::
`````

::

::

::note{to="#pre"}
Like the `ProsePre` component, the `CodeTree` handles filenames, icons and copy button.
::

::tabs{class="gap-0"}

:component-props{name="code-tree" prose label="Props"}

:component-theme{slug="code-tree" prose label="Theme"}

::

### `Collapsible`

Wrap your content with the `collapsible` component to display a [Collapsible](/docs/components/collapsible) in your content.

::code-preview{class="[&>div]:*:w-full [&>div]:*:my-0"}

::collapsible

| Prop    | Default   | Type                     |
|---------|-----------|--------------------------|
| `name`  |           | `string`{lang="ts-type"} |
| `size`  | `md`      | `string`{lang="ts-type"} |
| `color` | `neutral` | `string`{lang="ts-type"} |

::

#code

```mdc
::collapsible

| Prop    | Default   | Type                     |
|---------|-----------|--------------------------|
| `name`  |           | `string`{lang="ts-type"} |
| `size`  | `md`      | `string`{lang="ts-type"} |
| `color` | `neutral` | `string`{lang="ts-type"} |

::
```

::

::tabs{class="gap-0"}

:component-props{name="collapsible" prose label="Props"}

:component-theme{slug="collapsible" prose label="Theme"}

::

### `Field`

A field, prop or parameter to display in your content.

::code-preview
::field{name="name" type="string" required class="w-full"}
The `description` can be set as prop or in the default slot with full **markdown** support.
::

#code

```mdc
::field{name="name" type="string" required}
The `description` can be set as prop or in the default slot with full **markdown** support.
::
```

::

::tabs{class="gap-0"}

:component-props{name="field" prose label="Props"}

:component-theme{slug="field" prose label="Theme"}

::

### `FieldGroup`

Group fields together in a list.

::code-preview

::field-group{class="my-0"}

  ::field{name="analytics" type="boolean"}
  Default to `false` - Enables analytics for your project (coming soon).
  ::

  ::field{name="blob" type="boolean"}
  Default to `false` - Enables blob storage to store static assets, such as images, videos and more.
  ::

  ::field{name="cache" type="boolean"}
  Default to `false` - Enables cache storage to cache your server route responses or functions using Nitro's `cachedEventHandler` and `cachedFunction`
  ::

  ::field{name="database" type="boolean"}
  Default to `false` - Enables SQL database to store your application's data.
  ::

::

#code

```mdc
::field-group
  ::field{name="analytics" type="boolean"}
    Default to `false` - Enables analytics for your project (coming soon).
  ::

  ::field{name="blob" type="boolean"}
    Default to `false` - Enables blob storage to store static assets, such as images, videos and more.
  ::

  ::field{name="cache" type="boolean"}
    Default to `false` - Enables cache storage to cache your server route responses or functions using Nitro's `cachedEventHandler` and `cachedFunction`
  ::

  ::field{name="database" type="boolean"}
    Default to `false` - Enables SQL database to store your application's data.
  ::
::
```

::

::tabs{class="gap-0"}

:component-theme{slug="field-group" prose label="Theme"}

::

### `Icon`

Use the `icon` component to display an [Icon](/docs/components/icon) in your content.

::code-preview
:icon{name="i-simple-icons-nuxtdotjs"}

#code

```mdc
:icon{name="i-simple-icons-nuxtdotjs"}
```

::

::tabs{class="gap-0"}

:component-props{name="icon" prose label="Props"}

:component-theme{slug="icon" prose label="Theme"}

::

### `Kbd`

Use the `kbd` component to display a [Kbd](/docs/components/kbd) in your content.

::code-preview{class="[&>div]:*:my-0"}
:kbd{value="meta"} :kbd{value="K"}

#code

```mdc
:kbd{value="meta"} :kbd{value="K"}
```

::

::tabs{class="gap-0"}

:component-props{name="kbd" prose label="Props"}

:component-theme{slug="kbd" prose label="Theme"}

::

### `Tabs`

Use the `tabs` and `tabs-item` components to display [Tabs](/docs/components/tabs) in your content.

::code-preview{class="[&>div]:*:my-0"}

:::tabs{class="w-full"}

:::tabs-item{label="Code" icon="i-lucide-code"}

```mdc
::callout
Lorem velit voluptate ex reprehenderit ullamco et culpa.
::
```

:::

:::tabs-item{label="Preview" icon="i-lucide-eye"}

::callout
Lorem velit voluptate ex reprehenderit ullamco et culpa.
::

:::

:::

#code

````mdc
::tabs

:::tabs-item{label="Code" icon="i-lucide-code"}

```mdc
::callout
Lorem velit voluptate ex reprehenderit ullamco et culpa.
::
```

:::

:::tabs-item{label="Preview" icon="i-lucide-eye"}

::callout
Lorem velit voluptate ex reprehenderit ullamco et culpa.
::

:::

::
````

::

::tabs{class="gap-0"}

:component-props{name="tabs" prose label="Props"}

::component-theme{slug="tabs" prose label="Theme"}
---
extra:
  - tabsItem
---
::

::

### `Steps`

Wrap your headings with the Steps component to display a list of steps.

Use the `level` prop to define which heading will be used for the steps.

:::code-preview
::steps{level="4"}

#### Add the Nuxt UI Pro module in your `nuxt.config.ts`{lang="ts-type"}

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxt/ui']
})
```

#### Import Tailwind CSS and Nuxt UI Pro in your CSS

```css [assets/css/main.css]
@import "tailwindcss";
@import "@nuxt/ui";
```

::
#code

````mdc
::steps{level="4"}

#### Add the Nuxt UI Pro module in your `nuxt.config.ts`{lang="ts-type"}

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxt/ui']
})
```

#### Import Tailwind CSS and Nuxt UI Pro in your CSS

```css [assets/css/main.css]
@import "tailwindcss";
@import "@nuxt/ui";
```

::
````

:::

::tabs{class="gap-0"}

:component-props{name="steps" prose label="Props"}

:component-theme{slug="steps" prose label="Theme"}

::
