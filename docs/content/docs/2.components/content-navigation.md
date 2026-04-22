---
title: ContentNavigation
description: 'An accordion-style navigation component for organizing page links.'
category: content
framework: nuxt
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/content/ContentNavigation.vue
---

::warning{to="/docs/getting-started/integrations/content"}
This component is only available when the `@nuxt/content` module is installed.
::

## Usage

Use the `navigation` prop with the `navigation`{lang="ts-type"} value you get when fetching the navigation of your app.

::component-example
---
name: 'content-navigation-example'
class: 'h-96 overflow-y-auto'
overflowHidden: true
props:
  class: 'w-full'
---
::

### Type

Set the `type` prop to `single` to only allow one item to be open at a time. Defaults to `multiple`.

::component-code{prefix="content"}
---
prettier: true
collapse: true
external:
  - navigation
externalTypes:
  - ContentNavigationLink[]
items:
  type:
  - 'single'
  - 'multiple'
hide:
  - class
  - navigation
props:
  class: 'w-full'
  type: 'single'
  navigation:
    - title: 'Guide'
      icon: 'i-lucide-book-open'
      path: '#getting-started'
      children:
        - title: 'Introduction'
          path: '#introduction'
          active: true
        - title: 'Installation'
          path: '#installation'
    - title: 'Composables'
      icon: 'i-lucide-database'
      path: '#composables'
      children:
        - title: 'defineShortcuts'
          path: '#defineshortcuts'
        - title: 'useModal'
          path: '#usemodal'
---
::

### Color

Use the `color` prop to change the color of the navigation links.

::component-code{prefix="content"}
---
prettier: true
collapse: true
external:
  - navigation
externalTypes:
  - ContentNavigationLink[]
hide:
  - class
  - navigation
props:
  class: 'w-full'
  color: 'neutral'
  navigation:
    - title: 'Guide'
      icon: 'i-lucide-book-open'
      path: '#getting-started'
      children:
      - title: 'Introduction'
        path: '#introduction'
        active: true
      - title: 'Installation'
        path: '#installation'
    - title: 'Composables'
      icon: 'i-lucide-database'
      path: '#composables'
      children:
      - title: 'defineShortcuts'
        path: '#defineshortcuts'
      - title: 'useModal'
        path: '#usemodal'
---
::

### Variant

Use the `variant` prop to change the variant of the navigation links.

::component-code{prefix="content"}
---
prettier: true
collapse: true
external:
  - navigation
externalTypes:
  - ContentNavigationLink[]
hide:
  - class
  - navigation
items:
  variant:
  - 'link'
  - 'pill'
props:
  class: 'w-full'
  variant: 'link'
  navigation:
    - title: 'Guide'
      icon: 'i-lucide-book-open'
      path: '#getting-started'
      children:
      - title: 'Introduction'
        path: '#introduction'
        active: true
      - title: 'Installation'
        path: '#installation'
    - title: 'Composables'
      icon: 'i-lucide-database'
      path: '#composables'
      children:
      - title: 'defineShortcuts'
        path: '#defineshortcuts'
      - title: 'useModal'
        path: '#usemodal'
---
::

### Highlight

Use the `highlight` prop to display a highlighted border for the active link.

Use the `highlight-color` prop to change the color of the border. It defaults to the `color` prop.

::component-code{prefix="content"}
---
prettier: true
collapse: true
external:
  - navigation
externalTypes:
  - ContentNavigationLink[]
hide:
  - class
  - navigation
props:
  class: 'w-full'
  highlight: true
  highlightColor: 'primary'
  color: 'primary'
  variant: 'pill'
  navigation:
    - title: 'Guide'
      icon: 'i-lucide-book-open'
      path: '#getting-started'
      children:
      - title: 'Introduction'
        path: '#introduction'
        active: true
      - title: 'Installation'
        path: '#installation'
    - title: 'Composables'
      icon: 'i-lucide-database'
      path: '#composables'
      children:
      - title: 'defineShortcuts'
        path: '#defineshortcuts'
      - title: 'useModal'
        path: '#usemodal'
---
::

### Trailing Icon

::component-code{prefix="content"}
---
prettier: true
collapse: true
external:
  - navigation
externalTypes:
  - ContentNavigationLink[]
hide:
  - class
  - navigation
props:
  class: 'w-full'
  trailingIcon: 'i-lucide-arrow-up'
  navigation:
    - title: 'Guide'
      icon: 'i-lucide-book-open'
      path: '#getting-started'
      children:
      - title: 'Introduction'
        path: '#introduction'
        active: true
      - title: 'Installation'
        path: '#installation'
    - title: 'Composables'
      icon: 'i-lucide-database'
      path: '#composables'
      children:
      - title: 'defineShortcuts'
        path: '#defineshortcuts'
      - title: 'useModal'
        path: '#usemodal'
---
::

## Examples

### Within a layout

Use the ContentNavigation component inside a [PageAside](/docs/components/page-aside) component within a layout to display the navigation of the page:

```vue [layouts/docs.vue]{11}
<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
</script>

<template>
  <UPage>
    <template #left>
      <UPageAside>
        <UContentNavigation :navigation="navigation" highlight />
      </UPageAside>
    </template>

    <slot />
  </UPage>
</template>
```

### Within a header

Use the ContentNavigation component inside the `content` slot of a [Header](/docs/components/header) component to display the navigation of the page on mobile:

```vue [components/Header.vue]{9-11}
<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
</script>

<template>
  <UHeader>
    <template #body>
      <UContentNavigation :navigation="navigation" highlight />
    </template>
  </UHeader>
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

:component-changelog{prefix="content"}
