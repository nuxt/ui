---
title: ColorModeSwitch
description: 'A switch to toggle between light and dark mode.'
category: color-mode
links:
  - label: Switch
    to: /docs/components/switch
    icon: i-simple-icons-nuxtdotjs
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/color-mode/ColorModeSwitch.vue
---

## Usage

The ColorModeSwitch component extends the [Switch](/docs/components/switch) component, so you can pass any property such as `color`, `size`, etc.

:component-code{prefix="color-mode"}

## Examples

### With custom icons

::framework-only
#nuxt
::div

Use the `app.config.ts` to customize the icon with the `ui.icons` property:

```ts [app.config.ts]
export default defineAppConfig({
  ui: {
    icons: {
      light: 'i-ph-sun',
      dark: 'i-ph-moon'
    }
  }
})
```

::

#vue
::div
Use the `vite.config.ts` to customize the icon with the `ui.icons` property:

```ts [vite.config.ts]
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'

export default defineConfig({
  plugins: [
    vue(),
    ui({
      ui: {
        icons: {
          light: 'i-ph-sun',
          dark: 'i-ph-moon'
        }
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
