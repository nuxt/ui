---
title: ColorModeTabs
description: 'A Tabs to switch between system, light and dark mode.'
category: color-mode
links:
  - label: Tabs
    to: /docs/components/tabs
    icon: i-simple-icons-nuxtdotjs
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v5/src/runtime/components/color-mode/ColorModeTabs.vue
---

## Usage

The ColorModeTabs component extends the [Tabs](/docs/components/tabs) component, so you can pass any property such as `color`, `variant`, `size`, etc.

:component-code{prefix="color-mode"}

::note
The tabs default to `color="neutral"`.
::

## Examples

### Icon only

Use the `ui` prop to hide the labels visually. They stay available to assistive technologies.

::component-code{prefix="color-mode"}
---
props:
  ui:
    label: 'sr-only'
---
::

### With custom icons

::framework-only
#nuxt
::div

Use the `app.config.ts` to customize the icon with the `ui.icons` property:

```ts [app/app.config.ts]
export default defineAppConfig({
  ui: {
    icons: {
      system: 'i-lucide-laptop',
      light: 'i-lucide-sun-medium',
      dark: 'i-lucide-moon-star'
    }
  }
})
```

::

#vue
::div
Use the `icons` option in your `vite.config.ts` to customize the icon:

```ts [vite.config.ts]
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'

export default defineConfig({
  plugins: [
    vue(),
    ui({
      icons: {
        light: 'i-lucide-sun-medium',
        dark: 'i-lucide-moon-star'
      }
    })
  ]
})
```

::

::

## API

### Props

:component-props

## Changelog

:component-changelog{prefix="color-mode"}
