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

::tip{to="/docs/getting-started/theme/css-variables#header"}
The Main component uses the `--ui-header-height` CSS variable to position itself correctly below the `Header`.
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
