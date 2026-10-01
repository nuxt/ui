<script setup lang="ts">
import { Markdown } from '@comark/vue'
import shiki from '@comark/vue/plugins/shiki'

const markdown = ref(`
# Typography

Every prose component rendered through comark. Use it to check spacing, colors and dark mode in one place.

## Headers and text

### Paragraphs

Nuxt UI ships **125+ components** built on *Reka UI* and Tailwind CSS. Read the [installation guide](https://ui.nuxt.com/docs/getting-started/installation/nuxt) or run \`npx nuxi module add ui\` to get started.

Inline components sit in the flow of a paragraph: press :kbd{value="meta"} :kbd{value="K"} to open the command palette, the latest release is :badge[v4.0.0] and :icon{name="i-simple-icons-nuxtdotjs"} renders as an icon.

### Blockquote

> Typography adapts to your theme settings, so headings, links and code keep the same rhythm across the whole app.

### Horizontal rule

---

## Lists and tables

### Unordered list

- Components are tree shaken by default.
- Themes are built with Tailwind Variants.
  - Slots map to \`data-slot\` attributes.
  - Variants are typed end to end.
- Every component ships with tests.

### Ordered list

1. Install the module.
2. Import the CSS.
   1. Add \`@import "tailwindcss";\`
   2. Add \`@import "@nuxt/ui";\`
3. Wrap your app with \`UApp\`.

### Table

| Prop    | Default   | Type                     |
|---------|-----------|--------------------------|
| \`name\`  |           | \`string\`{lang="ts-type"} |
| \`size\`  | \`md\`      | \`string\`{lang="ts-type"} |
| \`color\` | \`neutral\` | \`string\`{lang="ts-type"} |

## Images and embeds

![Nuxt UI v4](https://nuxt.com/assets/blog/nuxt-ui-v4.png)

## Code

### Code block

\`\`\`ts [nuxt.config.ts]{2-3}
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css']
})
\`\`\`

### Code diff

\`\`\`diff [nuxt.config.ts]
export default defineNuxtConfig({
  modules: [
-   '@nuxt/ui-pro'
+   '@nuxt/ui'
  ]
})
\`\`\`

### Code group

::code-group

\`\`\`bash [pnpm]
pnpm add @nuxt/ui
\`\`\`

\`\`\`bash [yarn]
yarn add @nuxt/ui
\`\`\`

\`\`\`bash [npm]
npm install @nuxt/ui
\`\`\`

\`\`\`bash [bun]
bun add @nuxt/ui
\`\`\`

::

### Code collapse

::code-collapse

\`\`\`css [app/assets/css/main.css]
@import "tailwindcss";
@import "@nuxt/ui";

@theme static {
  --font-sans: 'Public Sans', sans-serif;

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
\`\`\`

::

### Code preview

::code-preview
:kbd{value="meta"} :kbd{value="K"}

#code

\`\`\`md
:kbd{value="meta"} :kbd{value="K"}
\`\`\`
::

### Code tree

::code-tree{default-value="app/app.vue"}

\`\`\`vue [app/app.vue]
<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
\`\`\`

\`\`\`vue [app/pages/index.vue]
<template>
  <UButton label="Click me" />
</template>
\`\`\`

\`\`\`ts [app/app.config.ts]
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    }
  }
})
\`\`\`

\`\`\`json [package.json]
{
  "name": "nuxt-app",
  "private": true,
  "type": "module"
}
\`\`\`

::

### Code tree expanded

::code-tree{default-value="app/app.vue" expand-all}

\`\`\`vue [app/app.vue]
<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
\`\`\`

\`\`\`vue [app/pages/index.vue]
<template>
  <UButton label="Click me" />
</template>
\`\`\`

\`\`\`ts [server/api/hello.ts]
export default defineEventHandler(() => ({ hello: 'world' }))
\`\`\`

::

## Components

### Accordion

::accordion

:::accordion-item{label="Is Nuxt UI free to use?" icon="i-lucide-circle-help"}
Yes, Nuxt UI is free and open source under the MIT license.
:::

:::accordion-item{label="Does it work without Nuxt?" icon="i-lucide-circle-help"}
Yes, the Vite plugin brings the same components to a standalone Vue app.
:::

:::accordion-item{label="Is it production ready?" icon="i-lucide-circle-help"}
Yes, it ships with tests, regular releases and active maintenance.
:::

::

### Badge

::badge
**v4.0.0**
::

### Callout

::callout
This is a \`callout\` with full **markdown** support.
::

::callout{icon="i-lucide-rocket" color="info" to="https://ui.nuxt.com/docs/getting-started/installation/nuxt" target="_blank"}
Learn how to install \`@nuxt/ui\` in your project.
::

::note
Here's some additional information for you.
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

### Card

::card{title="Dashboard" icon="i-lucide-layout-dashboard" to="https://github.com/nuxt-ui-templates/dashboard" target="_blank"}
A dashboard with a multi column layout.
::

### Card group

::card-group

:::card{title="SaaS" icon="i-lucide-rocket" to="https://github.com/nuxt-ui-templates/saas" target="_blank"}
A template with landing, pricing, docs and blog.
:::

:::card{title="Docs" icon="i-lucide-book-open" to="https://github.com/nuxt-ui-templates/docs" target="_blank"}
A documentation site powered by \`@nuxt/content\`.
:::

:::card{title="Landing" icon="i-lucide-layout-template" to="https://github.com/nuxt-ui-templates/landing" target="_blank"}
A landing page you can use as a starting point.
:::

::

### Collapsible

::collapsible

| Prop    | Default   | Type                     |
|---------|-----------|--------------------------|
| \`name\`  |           | \`string\`{lang="ts-type"} |
| \`size\`  | \`md\`      | \`string\`{lang="ts-type"} |
| \`color\` | \`neutral\` | \`string\`{lang="ts-type"} |

::

### Field

::field{name="name" type="string" required}
The \`description\` can be set as a prop or in the default slot with full **markdown** support.
::

### Field group

::field-group

:::field{name="analytics" type="boolean"}
Defaults to \`false\`. Enables analytics for your project.
:::

:::field{name="blob" type="boolean"}
Defaults to \`false\`. Enables blob storage for static assets.
:::

:::field{name="database" type="boolean"}
Defaults to \`false\`. Enables a SQL database to store your data.
:::

::

### Icon

:icon{name="i-simple-icons-nuxtdotjs"} :icon{name="i-simple-icons-vuedotjs"} :icon{name="i-simple-icons-tailwindcss"}

### Kbd

Press :kbd{value="meta"} :kbd{value="K"} to open the command palette.

### Prompt

::prompt{description="Build a dashboard layout with Nuxt UI." icon="i-lucide-layout-dashboard" actions='["cursor", "claude"]'}
You are a Nuxt UI expert. Help me build a dashboard layout with a collapsible sidebar and a sticky top navbar.

Requirements:
- Use \`UDashboardPanel\`, \`UDashboardSidebar\` and \`UDashboardNavbar\`
- Use semantic color tokens like \`bg-elevated\` and \`text-muted\`
- The sidebar should include navigation links with icons using \`UNavigationMenu\`
- The layout must collapse the sidebar on mobile
::

### Steps

::steps{level="4"}

#### Add the Nuxt UI module in your \`nuxt.config.ts\`

\`\`\`ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxt/ui']
})
\`\`\`

#### Import Tailwind CSS in your CSS

\`\`\`css [app/assets/css/main.css]
@import "tailwindcss";
@import "@nuxt/ui";
\`\`\`

#### Start your development server

\`\`\`bash
npm run dev
\`\`\`

::

### Tabs

::tabs

:::tabs-item{label="Code" icon="i-lucide-code"}

\`\`\`md
::callout
Callouts add eye catching context to your content.
::
\`\`\`

:::

:::tabs-item{label="Preview" icon="i-lucide-eye"}

::::callout
Callouts add eye catching context to your content.
::::

:::

::
`)
</script>

<template>
  <div class="p-8 max-w-2xl mx-auto">
    <Markdown :value="markdown" :plugins="[shiki()]" />
  </div>
</template>
