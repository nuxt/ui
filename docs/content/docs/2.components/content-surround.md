---
title: ContentSurround
description: 'A pair of prev and next links to navigate between pages.'
category: content
framework: nuxt
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/content/ContentSurround.vue
---

::warning{to="/docs/getting-started/content"}
This component is only available when the `@nuxt/content` module is installed.
::

## Usage

Use the `surround` prop with the `surround`{lang="ts-type"} value you get when fetching a page surround.

::component-example
---
name: 'content-surround-example'
props:
  class: 'w-full'
---
::

### Prev / Next

Use the `prev-icon` and `next-icon` props to customize the buttons [Icon](/docs/components/icon).

::component-code{prefix="content"}
---
prettier: true
collapse: true
ignore:
  - surround
external:
  - surround
props:
  prevIcon: 'i-lucide-chevron-left'
  nextIcon: 'i-lucide-chevron-right'
  surround:
  - title: ContentSearchButton
    path: /components/content-search-button
    stem: 3.components/content-search-button
    description: A pre-styled Button to open the ContentSearch modal.
  - title: ContentToc
    path: /components/content-toc
    stem: 3.components/content-toc
    description: A sticky Table of Contents with customizable slots.
---
::

## Examples

### Within a page

Use the ContentSurround component in a page to display the prev and next links:

```vue [pages/\[...slug\\].vue]{19}
<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(route.path, () => queryCollection('docs').path(route.path).first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}
</script>

<template>
  <UPage v-if="page">
    <UPageHeader :title="page.title" />

    <UPageBody>
      <ContentRenderer v-if="page.body" :value="page" />

      <USeparator v-if="surround?.filter(Boolean).length" />

      <UContentSurround :surround="(surround as any)" />
    </UPageBody>

    <template v-if="page?.body?.toc?.links?.length" #right>
      <UContentToc :links="page.body.toc.links" />
    </template>
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
