---
description: A flexible scroll container with virtualization support.
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
When virtualization is **disabled**, spacing uses theme configuration. When **enabled**, spacing has sensible defaults (`gap: 16`, `paddingStart: 16`, `paddingEnd: 16`) matching the theme. Override via the `virtualize` prop as needed.
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

### Masonry layouts

Create masonry (waterfall) layouts with variable height items using `lanes`. Items are automatically measured and positioned as they render.

::component-example
---
collapse: true
name: 'scroll-area-variable-height-example'
---
::

::note
Provide an accurate `estimateSize` close to the average item height for better initial rendering performance. Increase `overscan` for smoother scrolling at the cost of rendering more off-screen items.
::

### Responsive lanes

Implement responsive column/row counts using breakpoints or container width tracking.

```vue
<script setup lang="ts">
const { width } = useWindowSize()

const lanes = computed(() => {
  if (width.value < 640) return 1
  if (width.value < 1024) return 2
  return 3
})
</script>

<template>
  <UScrollArea :items="items" :virtualize="{ lanes }">
    <template #default="{ item }">
      <!-- your item content -->
    </template>
  </UScrollArea>
</template>
```

For container-based responsive behavior:

```vue
<script setup lang="ts">
const scrollArea = ref()
const { width } = useElementSize(scrollArea)

const lanes = computed(() => {
  // 2 lanes is the minimum, 6 lanes is the maximum, 300px is the goal width of each lane
  return Math.max(2, Math.min(6, Math.floor(width.value / 300)))
})
</script>

<template>
  <UScrollArea ref="scrollArea" :items="items" :virtualize="{ lanes }">
    <template #default="{ item }">{{ item }}</template>
  </UScrollArea>
</template>
```

::tip
Use [`useWindowSize`](https://vueuse.org/core/useWindowSize/) for viewport-based or [`useElementSize`](https://vueuse.org/core/useElementSize/) for container-based responsive lanes.
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

::component-example
---
prettier: true
collapse: true
name: 'scroll-area-infinite-scroll-example'
class: '!p-0'
---
::

::tip
The `@load-more` event fires when the user scrolls within `loadMoreThreshold` items from the end (default: 5). Use a loading flag to prevent multiple simultaneous requests and always use spread syntax (`[...items, ...newItems]`) for reactive updates.
::

### Custom content

Use the default slot without `items` for custom scrollable content.

::component-example
---
name: 'scroll-area-custom-example'
class: 'p-8'
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
