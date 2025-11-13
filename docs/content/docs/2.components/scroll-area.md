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

Use the `ScrollArea` component to create scrollable containers with optional virtualization for large lists.

- **Non-virtualized**: Gap and padding are controlled via theme (Tailwind classes)
- **Virtualized**: Gap, padding, and layout options (like `lanes`) are configured via the `virtualize` prop

::component-example
---
name: 'scroll-area-basic-example'
class: 'p-8'
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
    label: lanes
    default: 3
    visibleWhen:
      option: virtualize
      is: true
  - name: gap
    label: gap
    default: 12
    visibleWhen:
      option: virtualize
      is: true
  - name: padding
    label: padding
    default: 12
    visibleWhen:
      option: virtualize
      is: true
---
::

### Orientation

Use the `orientation` prop to change the scroll direction. Defaults to `vertical`.

::component-example
---
name: 'scroll-area-orientation-example'
class: 'p-8'
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

Enable virtualization to render only visible items, dramatically improving performance with large lists.

::component-example
---
name: 'scroll-area-virtualized-example'
class: 'p-8'
options:
  - name: itemCount
    label: itemCount
    default: 10000
---
::

::tip
Use virtualization for lists with 100+ items or when items contain heavy components (images, complex UI).
::

## Examples

### Variable heights

Provide `estimateSize` (average height) for better initial rendering. Items are automatically measured as they render.

::component-example
---
name: 'scroll-area-variable-height-example'
class: 'p-8'
---
::

### Custom content

Use the default slot without `items` for custom scrollable content.

::component-example
---
name: 'scroll-area-custom-example'
class: 'p-8'
---
::

### Masonry layouts

Use `lanes` for multi-column (vertical) or multi-row (horizontal) layouts.

```vue
<UScrollArea
  :items="items"
  :virtualize="{
    lanes: 3,
    gap: 12,
    estimateSize: 200
  }"
  class="h-96"
>
  <template #default="{ item }">
    <img :src="item.url" :alt="item.title" class="w-full" />
  </template>
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

### Virtualization options

Common options for the `virtualize` prop:

| Option | Default | Description |
|--------|---------|-------------|
| `estimateSize` | `100` | Estimated item size in pixels |
| `overscan` | `12` | Items to render outside visible area |
| `gap` | `0` | Gap between items (pixels) |
| `paddingStart` | `0` | Padding at start (pixels) |
| `paddingEnd` | `0` | Padding at end (pixels) |
| `lanes` | - | Columns (vertical) or rows (horizontal) |
| `loadMoreThreshold` | `5` | Items from end to trigger `@load-more` |
| `enabled` | `true` | Enable/disable virtualization |

See [TanStack Virtual docs](https://tanstack.com/virtual/latest/docs/api/virtualizer#options) for all available options.

### Programmatic scrolling

Use exposed methods to control scrolling:

::component-example
---
name: 'scroll-area-scroll-to-example'
class: 'p-8'
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

async function loadMore() {
  const morePosts = await fetchMorePosts()
  posts.value = [...posts.value, ...morePosts] // Immutable update
}
</script>

<template>
  <UScrollArea
    :items="posts"
    :virtualize="{ loadMoreThreshold: 5 }"
    @load-more="loadMore"
  >
    <template #default="{ item }">
      <UCard>{{ item.title }}</UCard>
    </template>
  </UScrollArea>
</template>
```

::tip
Use a loading flag to prevent multiple simultaneous requests.
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

::note
All scroll methods require virtualization to be enabled. They will log a warning if called when `virtualize` is `false`.
::

## Theme

:component-theme

### Non-virtualized styling

Customize gap and padding via theme or `ui` prop:

```vue
<UScrollArea :items="items" :ui="{ viewport: 'gap-6 p-6' }">
  <template #default="{ item }">{{ item }}</template>
</UScrollArea>
```

Or globally in `app.config.ts`:

```ts
export default defineAppConfig({
  ui: {
    scrollArea: {
      slots: { viewport: 'gap-4 p-4' }
    }
  }
})
```

## Best Practices

### When to virtualize

**Use virtualization for:**

- Lists with 100+ items
- Items with heavy components or images
- Infinite scroll implementations
- Mobile/low-end devices

**Skip virtualization for:**

- Small lists (< 50 simple items)
- Rarely scrolled content

### Performance tips

**Accurate estimates**

Provide `estimateSize` close to average item height for better initial rendering.

**Overscan**

Increase `overscan` for smoother scrolling at the cost of rendering more off-screen items.

**Immutable updates**

Use spread syntax for reactive updates:

```ts
// Recommended
items.value = [...items.value, ...newItems]

// Avoid - may not trigger reactivity
items.value.push(...newItems)
```

**Responsive lanes**

Implement your own resize logic to update `lanes` based on viewport width.

**Loading states**

Use flags to prevent multiple simultaneous `@load-more` calls.

## Changelog

:component-changelog
