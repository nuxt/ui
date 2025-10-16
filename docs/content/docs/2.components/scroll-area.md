---
title: ScrollArea
description: A flexible scroll container with virtualization support for efficiently rendering large lists of any content type.
links:
  - label: TanStack Virtual
    icon: i-simple-icons-tanstack
    to: https://tanstack.com/virtual/latest
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/ScrollArea.vue
---

## Usage

Use the `ScrollArea` component to create scrollable containers for any type of content. It supports both vertical and horizontal scrolling, and can optionally virtualize large lists for better performance.

### Basic Vertical Scroll

::component-example
---
name: 'scroll-area-basic-example'
---

#component
  :scroll-area-basic-example

#code
```vue
<script setup lang="ts">
const items = ref(
  Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`,
    description: `Description for item ${i + 1}`
  }))
)
</script>

<template>
  <UScrollArea
    :items="items"
    class="h-96 border border-default rounded-lg p-4"
  >
    <template #default="{ item }">
      <UCard class="mb-4">
        <template #header>
          <h3 class="font-semibold">{{ item.title }}</h3>
        </template>
        <p class="text-sm text-muted">{{ item.description }}</p>
      </UCard>
    </template>
  </UScrollArea>
</template>
```
::

### Horizontal Scroll

Set `orientation="horizontal"` to enable horizontal scrolling.

::component-example
---
name: 'scroll-area-horizontal-example'
---

#component
  :scroll-area-horizontal-example

#code
```vue
<script setup lang="ts">
const images = ref(
  Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    url: `https://picsum.photos/300/200?random=${i}`,
    title: `Image ${i + 1}`
  }))
)
</script>

<template>
  <UScrollArea
    :items="images"
    orientation="horizontal"
    class="w-full border border-default rounded-lg p-4"
  >
    <template #default="{ item }">
      <div class="inline-block me-4">
        <img 
          :src="item.url" 
          :alt="item.title"
          class="w-[300px] h-[200px] rounded-lg object-cover"
        >
        <p class="mt-2 text-sm text-center">{{ item.title }}</p>
      </div>
    </template>
  </UScrollArea>
</template>
```
::

## Examples

### Virtualized Large List

Enable virtualization with the `virtualize` prop to efficiently handle large datasets. This renders only visible items, dramatically improving performance.

::component-example
---
name: 'scroll-area-virtualized-example'
---

#component
  :scroll-area-virtualized-example

#code
```vue
<script setup lang="ts">
const largeDataset = ref(
  Array.from({ length: 10000 }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`,
    description: `This is item ${i + 1} in a list of 10,000 items`
  }))
)
</script>

<template>
  <UScrollArea
    :items="largeDataset"
    virtualize
    class="h-96 border border-default rounded-lg p-4"
  >
    <template #default="{ item, index }">
      <div class="p-3 mb-2 bg-elevated rounded-lg">
        <div class="flex items-center justify-between">
          <span class="font-medium">{{ item.title }}</span>
          <span class="text-xs text-muted">Index: {{ index }}</span>
        </div>
        <p class="text-sm text-muted mt-1">{{ item.description }}</p>
      </div>
    </template>
  </UScrollArea>
</template>
```
::

### Variable Height Items

When using virtualization with items of varying heights, provide an `estimateSize` that represents the average item height for better initial rendering.

::component-example
---
name: 'scroll-area-variable-height-example'
---

#component
  :scroll-area-variable-height-example

#code
```vue
<script setup lang="ts">
const items = ref(
  Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    title: `Card ${i + 1}`,
    description: i % 3 === 0 
      ? `This is a longer description with more text to demonstrate variable height handling.`
      : `Short description.`
  }))
)
</script>

<template>
  <UScrollArea
    :items="items"
    virtualize
    :estimate-size="120"
    class="h-96 border border-default rounded-lg p-4"
  >
    <template #default="{ item }">
      <UCard class="mb-4">
        <template #header>
          <h3 class="font-semibold">{{ item.title }}</h3>
        </template>
        <p class="text-sm text-muted">{{ item.description }}</p>
      </UCard>
    </template>
  </UScrollArea>
</template>
```
::

### Custom Content

You can also use `ScrollArea` without the `items` prop for custom scrollable content.

::component-example
---
name: 'scroll-area-custom-example'
---

#component
  :scroll-area-custom-example

#code
```vue
<template>
  <UScrollArea class="h-64 border border-default rounded-lg p-4">
    <div class="space-y-4">
      <UCard>
        <template #header>
          <h3 class="font-semibold">Section 1</h3>
        </template>
        <p>Custom content without using the items prop.</p>
      </UCard>
      <UCard>
        <template #header>
          <h3 class="font-semibold">Section 2</h3>
        </template>
        <p>Any content can be placed here and it will be scrollable.</p>
      </UCard>
    </div>
  </UScrollArea>
</template>
```
::

### Custom Virtualization Options

Fine-tune virtualization behavior with custom options.

```vue
<template>
  <UScrollArea
    :items="items"
    :virtualize="{
      overscan: 20,
      estimateSize: 150
    }"
    class="h-96"
  >
    <template #default="{ item }">
      <!-- item content -->
    </template>
  </UScrollArea>
</template>
```

## API

### Props

:component-props

### Slots

:component-slots

## Theme

:component-theme

## Performance Notes

### When to Use Virtualization

- **Large Lists**: Lists with 100+ items
- **Complex Items**: Each item contains heavy components or images
- **Infinite Scroll**: Continuously loading data
- **Performance Critical**: Mobile devices or lower-end hardware

### When Not to Use Virtualization

- **Small Lists**: Less than 50 simple items
- **Known Heights**: All items have the same fixed height (consider CSS-only solutions)
- **Rare Scrolling**: Content is rarely scrolled through

### Virtualization Tips

1. **Estimate Size**: Provide an accurate `estimateSize` for better initial rendering and scroll behavior
2. **Overscan**: Increase `overscan` for smoother scrolling at the cost of rendering more items
3. **Variable Heights**: TanStack Virtual automatically measures and adjusts for variable heights, but a good estimate helps initial rendering
4. **Horizontal**: Works seamlessly with `orientation="horizontal"` for horizontal lists

## Changelog

:component-changelog
