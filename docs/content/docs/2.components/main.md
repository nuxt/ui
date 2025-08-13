---
title: Main
description: 'A main element that fills the available viewport height.'
category: layout
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Main.vue
---

## Usage

The Main component renders a `<main>` element that works together with the [Header](/docs/components/header) component to create a full-height layout that extends to the viewport's available height.

::note
The Header component defines its height through a `--ui-header-height` CSS variable, which you can customize by overriding it in your CSS:

```css
:root {
  --ui-header-height: --spacing(16);
}
```

::

## Examples

### Within `app.vue`

Use the Main component in your `app.vue` or in a layout:

```vue [app.vue]{5-9}
<template>
  <UApp>
    <UHeader />

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <UFooter />
  </UApp>
</template>
```

## API

### Props

:component-props

### Slots

:component-slots

## Theme

:component-theme

## Changelog

:component-changelog
