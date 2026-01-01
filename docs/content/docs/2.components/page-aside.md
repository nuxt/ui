---
title: PageAside
description: 'A sticky aside to display your page navigation.'
category: page
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/PageAside.vue
---

## Usage

The PageAside component is a sticky `<aside>` element that is only displayed starting from the [`lg` breakpoint](https://tailwindcss.com/docs/breakpoints).

::tip{to="/docs/getting-started/theme/css-variables#header"}
The PageAside component uses the `--ui-header-height` CSS variable to position itself correctly below the `Header`.
::

Use it inside the `left` or `right` slot of the [Page](/docs/components/page) component:

```vue {4}
<template>
  <UPage>
    <template #left>
      <UPageAside />
    </template>
  </UPage>
</template>
```

## Examples

::note
While these examples use [Nuxt Content](https://content.nuxt.com), the components can be integrated with any content management system.
::

### Within a layout

Use the PageAside component in a layout to display the navigation:

```vue [layouts/docs.vue]{9-13}
<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
</script>

<template>
  <UPage>
    <template #left>
      <UPageAside>
        <UContentNavigation :navigation="navigation" />
      </UPageAside>
    </template>

    <slot />
  </UPage>
</template>
```

::note
In this example, we use the `ContentNavigation` component to display the navigation injected in `app.vue`.
::

## API

### Props

:component-props

### Slots

:component-slots

## Theme

:component-theme

## Changelog

:component-changelog
