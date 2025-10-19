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
---

## Usage

Use the `ScrollArea` component to create scrollable containers for any type of content. It supports both vertical and horizontal scrolling, and can optionally virtualize large lists for better performance.

::component-example
---
name: 'scroll-area-basic-example'
class: 'p-8'
---
::

### Items

Use the `items` prop as an array and render each item using the default slot:

::component-example
---
name: 'scroll-area-basic-example'
class: 'p-8'
---
::

### Orientation

Use the `orientation` prop to change the scroll direction. Defaults to `vertical`.

::component-example
---
name: 'scroll-area-orientation-example'
class: 'p-8'
---
::

::note
Use your mouse to drag the scroll area horizontally or vertically depending on the orientation.
::

### Virtualize

Enable virtualization with the `virtualize` prop to efficiently handle large datasets. This renders only visible items, dramatically improving performance with thousands of items.

::component-example
---
name: 'scroll-area-virtualized-example'
class: 'p-8'
---
::

::tip
Virtualization is recommended for lists with 100+ items or when items contain heavy components.
::

## Examples

### With horizontal scroll

Set `orientation="horizontal"` to enable horizontal scrolling.

::component-example
---
name: 'scroll-area-horizontal-example'
class: 'p-8'
---
::

### With variable height items

When using virtualization with items of varying heights, provide an `estimateSize` that represents the average item height for better initial rendering.

::component-example
---
name: 'scroll-area-variable-height-example'
class: 'p-8'
---
::

::note
TanStack Virtual automatically measures and adjusts for variable heights, but providing a good estimate helps with initial rendering and scroll behavior.
::

### With custom content

You can use `ScrollArea` without the `items` prop for custom scrollable content.

::component-example
---
name: 'scroll-area-custom-example'
class: 'p-8'
---
::

### With masonry layout

Use the `lanes` option to create multi-column masonry layouts. This is perfect for image galleries and Pinterest-style layouts.

::component-example
---
name: 'scroll-area-masonry-example'
class: 'p-8'
---
::

::note
The `lanes` option works with both vertical (columns) and horizontal (rows) orientations.
::

### With responsive masonry

Use the `laneWidth`, `minLanes`, and `maxLanes` options to create responsive masonry layouts that automatically adjust the number of columns based on container size.

::component-example
---
name: 'scroll-area-responsive-masonry-example'
class: 'p-8'
---
::

::note
The container has `resize: both` applied so you can drag from the bottom-right corner to see the columns adjust automatically as the width changes.
::

### With custom virtualization options

Fine-tune virtualization behavior with custom options like `overscan`, `gap`, `paddingStart`, and `paddingEnd`.

```vue
<template>
  <UScrollArea
    :items="items"
    :virtualize="{
      estimateSize: 150,
      overscan: 20,
      gap: 16,
      paddingStart: 24,
      paddingEnd: 24
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
- **Static Heights**: All items have the same fixed height and there are few items
- **Rare Scrolling**: Content is rarely scrolled through

### Virtualization Tips

1. **Estimate Size**: Provide an accurate `estimateSize` for better initial rendering and scroll behavior
2. **Overscan**: Increase `overscan` (default: 12) for smoother scrolling at the cost of rendering more items
3. **Variable Heights**: TanStack Virtual automatically measures and adjusts for variable heights dynamically
4. **Gap & Padding**: Use `gap`, `paddingStart`, and `paddingEnd` for proper spacing in virtualized lists
5. **Masonry Layouts**: Use `lanes` for multi-column layouts, or `laneWidth` with `minLanes`/`maxLanes` for responsive layouts

## Changelog

:component-changelog
