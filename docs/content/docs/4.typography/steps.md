---
title: Steps
description: 'Transform headings into numbered step-by-step guides and tutorials.'
framework: nuxt
category: components
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/prose/Steps.vue
---

## Usage

Wrap your headings with the Steps component to display a list of steps.

Use the `level` prop to define which heading will be used for the steps.

:::code-preview{class="[&>div]:*:w-full"}
::steps{level="4"}

#### Add the Nuxt UI module in your `nuxt.config.ts`

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxt/ui']
})
```

#### Import Tailwind CSS in your CSS

```css [assets/css/main.css]
@import "tailwindcss";
```

#### Start your development server

```bash
npm run dev
```

::

#code

````mdc
::steps{level="4"}

#### Add the Nuxt UI module in your `nuxt.config.ts`

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxt/ui']
})
```

#### Import Tailwind CSS in your CSS

```css [assets/css/main.css]
@import "tailwindcss";
```

#### Start your development server

```bash
npm run dev
```

::
````

:::

## API

### Props

:component-props{prose}

### Slots

:component-slots{prose}

## Theme

:component-theme{prose}

## Changelog

:component-changelog{prefix="prose"}
