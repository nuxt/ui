---
title: CodeGroup
description: "Group multiple code examples in tabbed interfaces for easy comparison."
framework: nuxt
category: components
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/prose/CodeGroup.vue
---

## Usage

Wrap your code blocks around a `code-group` component to group them together in tabs.

::code-preview{class="[&>div]:_:my-0 [&>div]:_:w-full"}

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

::note{to="/docs/typography/code#code-blocks"}
Like the `ProsePre` component, the `CodeGroup` handles filenames, icons and copy button.
::

## Icon Position

Use the `iconPosition` attribute to position the icon on the right side of the label.

::code-preview{class="[&>div]:_:my-0 [&>div]:_:w-full"}

:::code-group

```ts [Script|logos:typescript|right]
console.log("Hello World");
```

```vue [Component|logos:vue]
<template>
  <h1>Hello World</h1>
</template>
```

:::

#code

````mdc
::code-group

```ts [Script|logos:typescript|right]
console.log('Hello World')
```

```vue [Component|logos:vue]
<template>
  <h1>Hello World</h1>
</template>
```

::
````

::

## API

### Props

:component-props{prose}

### Slots

:component-slots{prose}

## Theme

:component-theme{prose}

## Changelog

:component-changelog{prefix="prose"}
