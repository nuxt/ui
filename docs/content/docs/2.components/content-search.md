---
title: ContentSearch
description: 'A ready to use CommandPalette to add to your documentation.'
category: content
framework: nuxt
links:
  - label: CommandPalette
    to: /docs/components/command-palette
    icon: i-simple-icons-nuxtdotjs
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/content/ContentSearch.vue
---

::warning{to="/docs/getting-started/integrations/content"}
This component is only available when the `@nuxt/content` module is installed.
::

## Usage

The ContentSearch component extends the [CommandPalette](/docs/components/command-palette) component with built-in [`@nuxt/content`](https://content.nuxt.com) search support, navigation grouping and color mode commands. It supports both client-side [Fuse.js](https://www.fusejs.io/) filtering and server-side [FTS5 full-text search](https://www.sqlite.org/fts5.html). You can pass any CommandPalette property such as `icon`, `placeholder`, etc.

::component-example
---
iframe:
  height: 500px;
iframeMobile: true
overflowHidden: true
source: false
name: 'content-search-example'
---
::

::note
You can open the CommandPalette by pressing :kbd{value="meta"} :kbd{value="K" class="ms-px"}, by using the [ContentSearchButton](/docs/components/content-search-button) component or by using the `useContentSearch` composable: `const { open } = useContentSearch()`{lang="ts"}.
::

::tip
It is recommended to wrap the `ContentSearch` component in a [ClientOnly](https://nuxt.com/docs/api/components/client-only) component so it's not rendered on the server.
::

### Navigation

Use the `navigation` prop with [`queryCollectionNavigation`](https://content.nuxt.com/docs/utils/query-collection-navigation) to group search results by section:

```vue [app.vue] {2, 9}
<script setup lang="ts">
const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('content'))
</script>

<template>
  <UApp>
    <ClientOnly>
      <LazyUContentSearch
        :navigation="navigation"
      />
    </ClientOnly>
  </UApp>
</template>
```

### Files

Use the `files` prop with [`queryCollectionSearchSections`](https://content.nuxt.com/docs/utils/query-collection-search-sections) to load all search sections upfront and use client-side [Fuse.js](https://www.fusejs.io/) filtering:

```vue [app.vue] {4-8, 16}
<script setup lang="ts">
const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('content'))

const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs', {
  ignoredTags: ['style']
}), {
  server: false
})
</script>

<template>
  <UApp>
    <ClientOnly>
      <LazyUContentSearch
        :navigation="navigation"
        :files="files"
        :fuse="{ resultLimit: 20, fuseOptions: { threshold: 0.2 } }"
      />
    </ClientOnly>
  </UApp>
</template>
```

::tip
Use the `fuse` prop to configure [useFuse](https://vueuse.org/integrations/useFuse) options passed to the underlying [CommandPalette](/docs/components/command-palette) such as `resultLimit` (default `12`) and `fuseOptions.threshold` (default `0.1`).
::

### Search :badge{label="Soon" class="align-text-top"}

Use the `search` prop with [`useSearchCollection`](https://content.nuxt.com/docs/utils/use-search-collection) for server-side [FTS5 full-text search](https://www.sqlite.org/fts5.html) with highlighted snippets instead of client-side filtering:

::warning
Requires `@nuxt/content` v3.14+.
::

```vue [app.vue] {4-7, 24-25}
<script setup lang="ts">
const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('content'))

const { search, status, init } = useSearchCollection('content', {
  immediate: false,
  ignoredTags: ['style']
})

const { open } = useContentSearch()

// Defer index initialization until the user opens the palette when using `immediate: false`
watch(open, (value) => {
  if (value && status.value === 'idle') {
    init()
  }
})
</script>

<template>
  <UApp>
    <ClientOnly>
      <LazyUContentSearch
        :navigation="navigation"
        :search="search"
        :search-status="status"
      />
    </ClientOnly>
  </UApp>
</template>
```

::tip
Pass `search-status` so the component can automatically re-trigger the search once the index becomes ready. Use `search-delay` (default `100ms`) to control how long typing must pause before the search fires. The `fuse.resultLimit` option caps the total results returned across all groups (search results, links, theme, etc.).
::

::note
When using the `search` prop, you don't need to pass `files`. The component calls the async search function on each keystroke instead of Fuse.js. Results are automatically mapped and grouped by navigation with highlighted snippets. Unlike the `files` approach which loads all search sections upfront and lets you browse navigation items before typing, the `search` prop only returns results after a query is entered.
::

### Shortcut

Use the `shortcut` prop to change the shortcut used in [defineShortcuts](/docs/composables/define-shortcuts) to open the ContentSearch component. Defaults to `meta_k` (:kbd{value="meta"} :kbd{value="K"}).

```vue [app.vue]{5}
<template>
  <UApp>
    <ClientOnly>
      <LazyUContentSearch
        shortcut="meta_k"
      />
    </ClientOnly>
  </UApp>
</template>
```

### Links

Use the `links` prop to add a group of quick-access links at the top of the command palette:

```vue [app.vue] {21}
<script setup lang="ts">
const links = [{
  label: 'Docs',
  icon: 'i-lucide-book',
  to: '/docs/getting-started'
}, {
  label: 'Components',
  icon: 'i-lucide-box',
  to: '/docs/components'
}, {
  label: 'Showcase',
  icon: 'i-lucide-presentation',
  to: '/showcase'
}]
</script>

<template>
  <UApp>
    <ClientOnly>
      <LazyUContentSearch
        :links="links"
      />
    </ClientOnly>
  </UApp>
</template>
```

### Color Mode

By default, a group of commands will be added to the command palette so you can switch between light and dark mode. This will only take effect if the `colorMode` is not forced in a specific page which can be achieved through `definePageMeta`:

```vue [pages/index.vue]
<script setup lang="ts">
definePageMeta({
  colorMode: 'dark'
})
</script>
```

You can disable this behavior by setting the `color-mode` prop to `false`:

```vue [app.vue]{5}
<template>
  <UApp>
    <ClientOnly>
      <LazyUContentSearch
        :color-mode="false"
      />
    </ClientOnly>
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

### Expose

When accessing the component via a template ref, you can use the following:

| Name | Type |
| ---- | ---- |
| `commandPaletteRef`{lang="ts-type"} | `Ref<InstanceType<typeof UCommandPalette> \| null>`{lang="ts-type"} |

## Theme

:component-theme

## Changelog

:component-changelog{prefix="content"}
