---
title: ColorModeButton
description: 'A Button to switch between light and dark mode.'
category: color-mode
links:
  - label: Button
    to: /docs/components/button
    icon: i-simple-icons-nuxtdotjs
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/color-mode/ColorModeButton.vue
---

## Usage

The ColorModeButton component extends the [Button](/docs/components/button) component, so you can pass any property such as `color`, `variant`, `size`, etc.

:component-code{prefix="color-mode"}

::note
The button defaults to `color="neutral"` and `variant="ghost"`.
::

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

### With fallback slot

As the button is wrapped in a [ClientOnly](https://nuxt.com/docs/api/components/client-only) component, you can pass a `fallback` slot to display a placeholder while the component is loading.

::component-code{prefix="color-mode"}
---
prettier: true
slots:
  fallback: |

    <UButton loading variant="ghost" color="neutral" />
---

#fallback
:u-button{variant="ghost" color="neutral" loading}
::

## API

### Props

:component-props

::callout{icon="i-simple-icons-mdnwebdocs" to="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attributes" target="_blank"}
This component also supports all native `<button>` HTML attributes.
::

### Slots

:component-slots

## Changelog

:component-changelog{prefix="color-mode"}
