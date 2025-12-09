---
description: 'A grid layout for your pages with left and right columns.'
category: page
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Page.vue
---

## Usage

The Page component helps you create layouts with optional left and right columns. It's perfect for building documentation sites and other content-focused pages.

```vue {2,6}
<template>
  <UPage>
    <template #left />

    <template #right />
  </UPage>
</template>
```

::tip
The page will display as a centered single column layout if no slots are specified.
::

## Examples

::note
While these examples use [Nuxt Content](https://content.nuxt.com), the components can be integrated with any content management system.
::

### Within a layout

Use the Page component in a layout with the `left` slot to display a navigation:

```vue [layouts/docs.vue] {9-13}
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

### Within a page

Use the Page component in a page with the `right` slot to display a table of contents:

```vue [pages/\[...slug\\].vue]{29-31}
<script setup lang="ts">
const route = useRoute()

definePageMeta({
  layout: 'docs'
})

const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('docs').path(route.path).first()
})

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('content', route.path)
})
</script>

<template>
  <UPage>
    <UPageHeader :title="page.title" :description="page.description" />

    <UPageBody>
      <ContentRenderer :value="page" />

      <USeparator />

      <UContentSurround :surround="surround" />
    </UPageBody>

    <template #right>
      <UContentToc :links="page.body.toc.links" />
    </template>
  </UPage>
</template>
```

::note
In this example, we use the `ContentToc` component to display the table of contents.
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
