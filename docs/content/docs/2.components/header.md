---
title: Header
description: 'A responsive header component.'
category: layout
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Header.vue
---

## Usage

The Header component renders a `<header>` element.

::tip{to="/docs/getting-started/theme/css-variables#header"}
Its height is defined through a `--ui-header-height` CSS variable.
::

Use the `left`, `default` and `right` slots to customize the header and the `body` or `content` slots to customize the header menu.

::component-example
---
collapse: true
prettier: true
name: 'header-example'
class: '!px-0 !pt-0'
overflowHidden: true
props:
  class: 'w-full'
---
::

::note
In this example, we use the [NavigationMenu](/docs/components/navigation-menu) component to render the header links in the center.
::

### Title

Use the `title` prop to change the title of the header. Defaults to `Nuxt UI`.

::component-code
---
hide:
  - class
props:
  title: 'Nuxt UI'
  class: 'w-full'
class: '!px-0 !pt-0'
---
::

You can also use the `title` slot to add your own logo.

::tip{to="#props"}
You should still add the `title` prop to replace the default `aria-label` of the link.
::

::component-code
---
prettier: true
overflowHidden: true
hide:
  - class
props:
  class: 'w-full'
slots:
  title: |

    <Logo class="h-6 w-auto" />
class: '!px-0 !pt-0'
---

#title
:logo{class="h-6 w-auto"}
::

### To

Use the `to` prop to change the link of the title. Defaults to `/`.

::component-code
---
hide:
  - class
class: '!px-0 !pt-0'
props:
  to: '/docs'
  class: 'w-full'
---
::

You can also use the `left` slot to override the link entirely.

::component-code
---
prettier: true
overflowHidden: true
hide:
  - class
class: '!px-0 !pt-0'
props:
  class: 'w-full'
slots:
  left: |

    <NuxtLink to="/docs">
      <Logo class="h-6 w-auto" />
    </NuxtLink>
---

#left
::nuxt-link{to="/docs"}
:logo{class="h-6 w-auto"}
::
::

### Mode

Use the `mode` prop to change the mode of the header menu. Defaults to `modal`.

Use the `body` slot to fill the menu body (under the header) or the `content` slot to fill the entire menu.

::tip{to="#props"}
You can use the `menu` prop to customize the menu of the header, it will adapt depending on the mode you choose.
::

::component-example
---
collapse: true
iframe:
  height: 300px;
iframeMobile: true
overflowHidden: true
name: 'header-menu-example'
options:
  - name: 'mode'
    label: 'mode'
    default: 'drawer'
    items:
      - modal
      - slideover
      - drawer
props:
  class: 'w-full'
---
::

### Toggle

Use the `toggle` prop to customize the toggle button displayed on mobile.

You can pass any property from the [Button](/docs/components/button) component to customize it.

::component-example
---
collapse: true
iframe:
  height: 300px;
iframeMobile: true
overflowHidden: true
name: 'header-toggle-example'
props:
  class: 'w-full'
---
::

### Toggle Side

Use the `toggle-side` prop to change the side of the toggle button. Defaults to `right`.

::component-example
---
collapse: true
iframe:
  height: 300px;
iframeMobile: true
overflowHidden: true
name: 'header-toggle-side-example'
props:
  class: 'w-full'
---
::

## Examples

### Within `app.vue`

Use the Header component in your `app.vue` or in a layout:

```vue [app.vue]{28-51}
<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [{
  label: 'Docs',
  to: '/docs/getting-started',
  active: route.path.startsWith('/docs/getting-started')
}, {
  label: 'Components',
  to: '/docs/components',
  active: route.path.startsWith('/docs/components')
}, {
  label: 'Figma',
  to: 'https://go.nuxt.com/figma-ui',
  target: '_blank'
}, {
  label: 'Releases',
  to: 'https://github.com/nuxt/ui/releases',
  target: '_blank'
}])
</script>

<template>
  <UApp>
    <UHeader>
      <template #title>
        <Logo class="h-6 w-auto" />
      </template>

      <UNavigationMenu :items="items" />

      <template #right>
        <UColorModeButton />

        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/nuxt/ui"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
        />
      </template>

      <template #body>
        <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
      </template>
    </UHeader>

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

### Emits

:component-emits

## Theme

:component-theme

## Changelog

:component-changelog
