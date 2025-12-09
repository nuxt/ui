---
title: Introduction
description: 'Beautiful typography components and utilities to style your content with Nuxt UI.'
framework: nuxt
---

Nuxt UI brings beautiful, consistent styling to the **Prose components** provided by [@nuxtjs/mdc](https://github.com/nuxt-modules/mdc). The Nuxt MDC module transforms your markdown into semantic Vue components, and Nuxt UI applies its design system so your content automatically adapts to your application's theme.

::note{to="/docs/getting-started/integrations/content"}
For Nuxt Content installation and setup, check the **Content integration** guide.
::

## Usage

The typography system powered by Nuxt MDC's prose components and styled by Nuxt UI, provides multiple ways to render styled content:

1. **Markdown Rendering** - Use ContentRenderer or MDC component to render markdown with automatic prose styling
2. **Direct Vue Usage** - Import and use prose components directly in your Vue templates

### With ContentRenderer

The simplest way - your markdown is automatically styled when using [`<ContentRenderer>`](https://content.nuxt.com/components/content-renderer) component:

```vue [pages/\[...slug\\].vue]
<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(route.path, () => queryCollection('docs').path(route.path).first())
</script>

<template>
  <ContentRenderer :value="page" />
</template>
```

::note
When you write markdown, Nuxt MDC automatically maps each element to a styled prose component:
- `# Heading` → `<ProseH1>` (with accessible anchor links)
- `**bold**` → `<ProseStrong>` (styled according to your theme)
- `` `code` `` → `<ProseCode>` (with syntax highlighting)
- ...and all other markdown syntax is rendered as their corresponding prose components, ensuring consistent design and theming.
::

### With MDC component

For more control over markdown rendering, use the [`<MDC>`](https://github.com/nuxt-modules/mdc) component:

```vue
<script setup lang="ts">
const value = `# Hello World

Learn more about the **MDC** component in the [documentation](https://github.com/nuxt-modules/mdc).
`
</script>

<template>
  <MDC :value="value" />
</template>
```

::note
Use this approach when you need to:
- Render markdown content from external sources such as APIs or databases
- Inject dynamic or custom data into your markdown
- Build flexible, dynamic content systems
- Safely process and display user-generated markdown
::

### With Prose components

Use prose components directly in Vue templates for maximum control:

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

## MDC Syntax

You can include Vue components in markdown files using [MDC Syntax](https://content.nuxt.com/docs/files/markdown#mdc-syntax).

::code-preview

:::div{class="w-full *:first:mt-0 *:last:mb-0"}
Regular markdown with **bold** and *italic* text.

::::callout{icon="i-lucide-rocket" color="primary"}
Use MDC components for rich interactions!
::::

::::tabs

:::::tabs-item{label="Installation"}
Use pnpm add @nuxt/ui to install
:::::

:::::tabs-item{label="Usage"}
Import components and use them in your templates
:::::

::::

::::code-group

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
````

::::

:::

#code
````mdc
Regular markdown with **bold** and *italic* text.

::callout{icon="i-lucide-rocket" color="primary"}
Use MDC components for rich interactions!
::

::tabs

:::tabs-item{label="Installation"}
Use pnpm add @nuxt/ui to install
:::

:::tabs-item{label="Usage"}
Import components and use them in your templates
:::

::

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

## Theme

Override any prose component styling in your app configuration:

```ts [app.config.ts]
export default defineAppConfig({
  ui: {
    prose: {
      h1: {
        slots: {
          base: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'
        }
      },
      p: {
        base: 'leading-7 [&:not(:first-child)]:mt-6'
      }
    }
  }
})
```
