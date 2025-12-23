---
title: ScrollArea
description: A flexible scroll container with virtualization support.
category: data
links:
  - label: TanStack Virtual
    avatar:
      src: https://github.com/tanstack.png
    to: https://tanstack.com/virtual/latest
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/ScrollArea.vue
navigation.badge: New
---

## Usage

The ScrollArea component creates scrollable containers with optional virtualization for large lists.

::component-example
---
collapse: true
overflowHidden: true
name: 'scroll-area-example'
class: '!p-0'
---
::

### Items

Use the `items` prop as an array and render each item using the default slot:

::component-example
---
collapse: true
overflowHidden: true
name: 'scroll-area-items-example'
class: '!p-0'
---
::

::tip{to="#with-default-slot"}
You can also use the default slot without the `items` prop to render custom scrollable content directly.
::

### Orientation

Use the `orientation` prop to change the scroll direction. Defaults to `vertical`.

::component-example
---
collapse: true
overflowHidden: true
name: 'scroll-area-orientation-example'
class: '!p-0'
options:
  - name: orientation
    label: orientation
    default: horizontal
    items:
      - vertical
      - horizontal
---
::

### Virtualize

Use the `virtualize` prop to render only the items currently in view, significantly boosting performance when working with large datasets.

::note
When virtualization is **enabled**, customize spacing via the `virtualize` prop options like `gap`, `paddingStart`, and `paddingEnd`. Otherwise, use the `ui` prop to apply classes like `gap p-4` on the `viewport` slot.
::

::component-example
---
collapse: true
overflowHidden: true
name: 'scroll-area-virtualize-example'
class: '!p-0'
options:
  - name: orientation
    label: orientation
    default: vertical
    items:
      - vertical
      - horizontal
---
::

## Examples

### As masonry layout

Use the `virtualize` prop with `lanes`, `gap`, and `estimateSize` options to create Pinterest-style masonry layouts with variable height items.

::component-example
---
collapse: true
overflowHidden: true
name: 'scroll-area-masonry-layout-example'
class: '!p-0'
options:
  - name: orientation
    label: orientation
    default: vertical
    items:
      - vertical
      - horizontal
  - name: lanes
    type: number
    label: lanes
    default: 3
  - name: gap
    type: number
    label: gap
    default: 16
---
::

::tip
For optimal performance, set `estimateSize` close to your average item height. Increasing `overscan` improves scrolling smoothness but renders more off-screen items.
::

### With responsive lanes

You can use the [`useWindowSize`](https://vueuse.org/core/useWindowSize/) (for viewport-based) or [`useElementSize`](https://vueuse.org/core/useElementSize/) (for container-based) composables to make the `lanes` reactive.

::component-example
---
collapse: true
overflowHidden: true
name: 'scroll-area-responsive-lanes-example'
class: '!p-0'
---
::

### With programmatic scroll

You can use the exposed `virtualizer` to programmatically control scroll position.

::component-example
---
collapse: true
overflowHidden: true
name: 'scroll-area-scroll-to-example'
class: '!p-0'
---
::

### With infinite scroll

You can use the [`useInfiniteScroll`](https://vueuse.org/core/useInfiniteScroll/) composable to load more data as the user scrolls.

::component-example
---
prettier: true
collapse: true
overflowHidden: true
name: 'scroll-area-infinite-scroll-example'
class: '!p-0'
---
::

### With default slot

You can use the default slot without the `items` prop to render custom scrollable content directly.

::component-example
---
name: 'scroll-area-default-slot-example'
class: '!p-0'
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
  scrollArea.value?.virtualizer?.scrollToIndex(index, { align: 'center' })
}
</script>

<template>
  <UScrollArea ref="scrollArea" :items="items" virtualize />
</template>
```

This will give you access to the following:

| Name | Type | Description |
| ---- | ---- | ----------- |
| `$el`{lang="ts-type"} | `HTMLElement`{lang="ts-type"} | The root element of the component. |
| `virtualizer`{lang="ts-type"} | `Ref<Virtualizer> \| undefined`{lang="ts-type"} | The [TanStack Virtual](https://tanstack.com/virtual/latest/docs/api/virtualizer) virtualizer instance (`undefined` if virtualization is disabled). |

## Theme

:component-theme

## Changelog

:component-changelog
