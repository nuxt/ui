---
title: PageBody
description: 'The main content of your page.'
category: page
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/PageBody.vue
---

## Usage

The PageBody component wraps your main content and adds some padding for consistent spacing.

Use it inside the default slot of the [Page](/docs/components/page) component, after the [PageHeader](/docs/components/page-header) component:

```vue {5}
<template>
  <UPage>
    <UPageHeader />

    <UPageBody />
  </UPage>
</template>
```

## Examples

::note
While these examples use [Nuxt Content](https://content.nuxt.com), the components can be integrated with any content management system.
::

### Within a page

Use the PageBody component in a page to display the content of the page:

```vue [pages/\[...slug\\].vue]{21-27}
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
In this example, we use the [`ContentRenderer`](https://content.nuxt.com/docs/components/content-renderer) component from `@nuxt/content` to render the content of the page.
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
