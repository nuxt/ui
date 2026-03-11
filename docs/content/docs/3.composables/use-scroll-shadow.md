---
title: useScrollShadow
description: 'A composable to apply scroll shadow effects on any scrollable element.'
navigation.badge: Soon
---

## Usage

Use the auto-imported `useScrollShadow` composable to apply fade shadows on the edges of a scrollable element, indicating that more content is available in the scroll direction.

```vue
<script setup lang="ts">
const el = useTemplateRef('el')

const { style } = useScrollShadow(el)
</script>

<template>
  <div ref="el" class="max-h-[200px] overflow-y-auto" :style="style">
    <!-- Scrollable content -->
  </div>
</template>
```

- Uses CSS `mask-image` to fade content at the edges rather than overlay elements, so it works on any background.
- Automatically detects whether the element is overflowing and only applies shadows when needed.
- Supports both vertical and horizontal orientations.

## API

`useScrollShadow(element, options?)`{lang="ts-type"}

### Parameters

::field-group

  ::field{name="element" type="MaybeRef<HTMLElement | null | undefined>" required}
  A template ref or reactive reference to the scrollable element.
  ::

  ::field{name="options" type="UseScrollShadowOptions"}
  Configuration options for the scroll shadow.

    ::collapsible

      ::field-group
        ::field{name="size" type="MaybeRefOrGetter<number>" default="24"}
        The shadow size in pixels.
        ::

        ::field{name="orientation" type="MaybeRefOrGetter<'vertical' | 'horizontal'>" default="'vertical'"}
        The scroll direction to apply shadows.
        ::
      ::
    ::
  ::
::

### Return

::field-group

  ::field{name="style" type="ComputedRef<CSSProperties | undefined>"}
  A reactive style object to bind on the scrollable element with `:style`. Contains `maskImage` when shadows are active, `undefined` otherwise.
  ::

  ::field{name="isOverflowing" type="ComputedRef<boolean>"}
  Whether the element's content overflows its visible area.
  ::

  ::field{name="arrivedState" type="{ top: boolean, bottom: boolean, left: boolean, right: boolean }"}
  Reactive scroll arrival state from [`useScroll`](https://vueuse.org/core/useScroll/).
  ::
::

## Examples

### Horizontal

Use the `orientation` option for horizontally scrollable containers:

```vue
<script setup lang="ts">
const el = useTemplateRef('el')

const { style } = useScrollShadow(el, { orientation: 'horizontal' })
</script>

<template>
  <div ref="el" class="overflow-x-auto whitespace-nowrap" :style="style">
    <!-- Horizontally scrollable content -->
  </div>
</template>
```

### Custom size

Use the `size` option to change the shadow size in pixels:

```vue
<script setup lang="ts">
const el = useTemplateRef('el')

const { style } = useScrollShadow(el, { size: 48 })
</script>

<template>
  <div ref="el" class="max-h-[300px] overflow-y-auto" :style="style">
    <!-- Scrollable content -->
  </div>
</template>
```
