---
description: A flexible scroll container with virtualization support for efficiently rendering large lists of any content type.
category: layout
links:
  - label: TanStack Virtual
    avatar:
      src: https://github.com/tanstack.png
    to: https://tanstack.com/virtual/latest
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/ScrollArea.vue
navigation.badge: Soon
---

## Usage

The ScrollArea component creates scrollable containers with optional virtualization for large lists.

::note
When virtualization is **disabled**, spacing and layout use theme configuration. When **enabled**, configure gap, padding, and lanes via the `virtualize` prop.
::

::component-example
---
collapse: true
name: 'scroll-area-example'
options:
  - name: orientation
    label: orientation
    default: vertical
    items:
      - vertical
      - horizontal
  - name: virtualize
    label: virtualize
    default: true
    items:
      - true
      - false
  - name: lanes
    type: number
    label: lanes
    default: 3
    visibleWhen:
      option: virtualize
      is: true
  - name: gap
    type: number
    label: gap
    default: 16
    visibleWhen:
      option: virtualize
      is: true
  - name: padding
    type: number
    label: padding
    default: 16
    visibleWhen:
      option: virtualize
      is: true
---
::

### Orientation

Use the `orientation` prop to change the scroll direction. Defaults to `vertical`.

::component-example
---
collapse: true
name: 'scroll-area-orientation-example'
options:
  - name: orientation
    label: orientation
    default: vertical
    items:
      - vertical
      - horizontal
---
::

### Virtualization

Use the `virtualize` prop to render only the items currently in view, significantly boosting performance when working with large datasets.

::note
Use virtualization for large lists (100+ items) or heavy components. Skip for small, simple lists (< 50 items).
::

::component-example
---
collapse: true
name: 'scroll-area-virtualize-example'
options:
  - name: itemCount
    label: itemCount
    default: 10000
---
::

## Examples

### Variable heights

Set an `estimateSize` (average item height) to improve initial rendering performance. The actual size of each item is measured automatically during rendering.

::component-example
---
collapse: true
name: 'scroll-area-variable-height-example'
---
::

::note
For optimal performance, provide an `estimateSize` close to the average item height. You can also increase `overscan` for smoother scrolling at the cost of rendering more off-screen items.
::

### Masonry layouts

Use the `lanes` prop for multi-column (vertical) or multi-row (horizontal) layouts.

```vue
<UScrollArea
  v-slot="{ item }"
  :items="items"
  :virtualize="{
    lanes: 3,
    gap: 16,
    estimateSize: 200
  }"
  class="h-96"
>
  <img :src="item.url" :alt="item.title" class="w-full" />
</UScrollArea>
```

::warning
For responsive layouts, implement your own resize logic to update `lanes` based on container width:

```vue
<script setup lang="ts">
const lanes = ref(useBreakpoints({
  sm: 1,
  md: 2,
  lg: 3
}))
</script>
```
::

### Programmatic scrolling

Use the exposed methods to programmatically control scroll position (requires virtualization):

::component-example
---
collapse: true
name: 'scroll-area-scroll-to-example'
options:
  - name: itemCount
    label: itemCount
    default: 10000
  - name: targetIndex
    label: targetIndex
    default: 500
---
::

### Infinite scroll

Use `@load-more` to load more data as the user scrolls (requires virtualization):

```vue
<script setup lang="ts">
const posts = ref([...initialPosts])
const loading = ref(false)

async function loadMore() {
  if (loading.value) return

  loading.value = true
  const morePosts = await fetchMorePosts()
  posts.value = [...posts.value, ...morePosts] // Use spread for immutable update
  loading.value = false
}
</script>

<template>
  <UScrollArea
    v-slot="{ item }"
    :items="posts"
    :virtualize="{ loadMoreThreshold: 5 }"
    @load-more="loadMore"
  >
    <UCard>{{ item.title }}</UCard>
  </UScrollArea>
</template>
```

::tip
Always use spread syntax (`[...items, ...newItems]`) for reactive updates instead of `.push()`, and use a loading flag to prevent multiple simultaneous requests.
::

### With default slot

Use the default slot without the `items` prop for custom scrollable content that doesn't require virtualization.

::component-example
---
collapse: true
name: 'scroll-area-default-slot-example'
---
::

## API

### Props

:component-props

### Slots

:component-slots

### Emits

:component-emits

### Expose

You can access the typed component instance using [`useTemplateRef`](https://vuejs.org/api/composition-api-helpers.html#usetemplateref).

```vue
<script setup lang="ts">
const scrollArea = useTemplateRef('scrollArea')

// Scroll to a specific item
function scrollToItem(index: number) {
  scrollArea.value?.scrollToIndex(index, { align: 'center' })
}
</script>

<template>
  <UScrollArea ref="scrollArea" :items="items" virtualize />
</template>
```

This will give you access to the following:

| Name | Type | Description |
| ---- | ---- | ----------- |
| `virtualizer`{lang="ts-type"} | `ComputedRef<Virtualizer \| null>`{lang="ts-type"} | The TanStack Virtual virtualizer instance (null if virtualization is disabled) |
| `scrollToOffset`{lang="ts-type"} | `(offset: number, options?: ScrollToOptions) => void`{lang="ts-type"} | Scroll to a specific pixel offset |
| `scrollToIndex`{lang="ts-type"} | `(index: number, options?: ScrollToOptions) => void`{lang="ts-type"} | Scroll to a specific item index |
| `getTotalSize`{lang="ts-type"} | `() => number`{lang="ts-type"} | Get the total size of all virtualized items in pixels |
| `measure`{lang="ts-type"} | `() => void`{lang="ts-type"} | Reset all previously measured item sizes |
| `getScrollOffset`{lang="ts-type"} | `() => number`{lang="ts-type"} | Get the current scroll offset in pixels |
| `isScrolling`{lang="ts-type"} | `() => boolean`{lang="ts-type"} | Check if the list is currently being scrolled |
| `getScrollDirection`{lang="ts-type"} | `() => 'forward' \| 'backward' \| null`{lang="ts-type"} | Get the current scroll direction |

::warning
Scroll methods are only available when virtualization is enabled. Calling them with `virtualize` set to `false` will result in a warning message.
::

## Theme

:component-theme

## Changelog

:component-changelog
