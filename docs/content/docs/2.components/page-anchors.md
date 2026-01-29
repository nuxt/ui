---
title: PageAnchors
description: 'A list of anchors to be displayed in the page.'
category: page
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/PageAnchors.vue
---

## Usage

Use the PageAnchors component to display a list of links.

::component-code
---
collapse: true
prettier: true
ignore:
  - links
external:
  - links
externalTypes:
  - PageAnchor[]
props:
  links:
    - label: 'Documentation'
      icon: i-lucide-book-open
      to: /docs/getting-started
    - label: 'Components'
      icon: i-lucide-box
      to: /docs/components
    - label: 'Figma Kit'
      icon: i-simple-icons-figma
      to: https://go.nuxt.com/figma-ui
      target: _blank
    - label: 'Releases'
      icon: i-simple-icons-github
      to: https://github.com/nuxt/ui/releases
      target: _blank
---
::

### Links

Use the `links` prop as an array of objects with the following properties:

- `label: string`{lang="ts-type"}
- `icon?: string`{lang="ts-type"}
- `class?: any`{lang="ts-type"}
- `ui?: { item?: ClassNameValue, link?: ClassNameValue, linkLabel?: ClassNameValue, linkLabelExternalIcon?: ClassNameValue, linkLeading?: ClassNameValue, linkLeadingIcon?: ClassNameValue }`{lang="ts-type"}

You can pass any property from the [Link](/docs/components/link#props) component such as `to`, `target`, etc.

::component-code
---
prettier: true
ignore:
  - links
external:
  - links
externalTypes:
  - PageAnchor[]
props:
  links:
    - label: 'Documentation'
      icon: i-lucide-book-open
      to: /docs/getting-started
    - label: 'Components'
      icon: i-lucide-box
      to: /docs/components
    - label: 'Figma Kit'
      icon: i-simple-icons-figma
      to: https://go.nuxt.com/figma-ui
      target: _blank
    - label: 'Releases'
      icon: i-simple-icons-github
      to: https://github.com/nuxt/ui/releases
      target: _blank
---
::

## Examples

::note
While these examples use [Nuxt Content](https://content.nuxt.com), the components can be integrated with any content management system.
::

### Within a layout

Use the PageAnchors component inside the [PageAside](/docs/components/page-aside) component to display a list of links above the navigation.

```vue [layouts/docs.vue]{35}
<script setup lang="ts">
import type { PageAnchor } from '@nuxt/ui'
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<ContentNavigationItem[]>('navigation')

const links: PageAnchor[] = [{
  label: 'Documentation',
  icon: 'i-lucide-book-open',
  to: '/docs/getting-started'
}, {
  label: 'Components',
  icon: 'i-lucide-box',
  to: '/docs/components'
}, {
  label: 'Figma Kit',
  icon: 'i-simple-icons-figma',
  to: 'https://go.nuxt.com/figma-ui',
  target: '_blank'
}, {
  label: 'Releases',
  icon: 'i-lucide-rocket',
  to: 'https://github.com/nuxt/ui/releases',
  target: '_blank'
}]
</script>

<template>
  <UPage>
    <template #left>
      <UPageAside>
        <UPageAnchors :links="links" />

        <USeparator type="dashed" />

        <UContentNavigation :navigation="navigation" />
      </UPageAside>
    </template>

    <slot />
  </UPage>
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
