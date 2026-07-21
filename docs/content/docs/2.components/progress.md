---
description: An indicator showing the progress of a task.
category: element
links:
  - label: Progress
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/progress
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Progress.vue
---

## Usage

Use the `v-model` directive to control the value of the Progress.

::component-code
---
external:
  - modelValue
props:
  modelValue: 50
---
::

### Variant

Use the `variant` prop to change the style of the Progress. Defaults to `linear`.

::component-code
---
ignore:
  - class
external:
  - modelValue
props:
  modelValue: 50
  variant: circular
  class: 'justify-center'
---
::

::note
The `circular` variant is rendered as an SVG, so the `track` slot is used for the background circle instead of the `base` background.
::

### Thickness

Use the `thickness` prop to change the stroke width of the `circular` variant, in pixels. Defaults to `auto`, which derives the thickness from the [`size`](#size) prop.

::component-code
---
ignore:
  - class
  - variant
external:
  - modelValue
props:
  modelValue: 50
  variant: circular
  thickness: 4
  class: 'justify-center'
---
::

### Max

Use the `max` prop to set the maximum value of the Progress.

::component-code
---
external:
  - modelValue
props:
  modelValue: 3
  max: 4
---
::

Use the `max` prop with an array of strings to display the active step under the bar, the maximum value of the Progress is the length of the array.

::component-code
---
prettier: true
ignore:
  - max
external:
  - modelValue
props:
  modelValue: 3
  max:
    - 'Waiting...'
    - 'Cloning...'
    - 'Migrating...'
    - 'Deploying...'
    - 'Done!'
---
::

### Status

Use the `status` prop to display the current Progress value above the bar.
With the `circular` variant, the status is displayed in the center of the circle instead.

::component-code
---
ignore:
  - class
external:
  - modelValue
props:
  modelValue: 50
  variant: linear
  status: true
  class: 'justify-center'
---
::

Use the `#status` slot to customize the content, it receives the current `percent` value.

```vue
<template>
  <UProgress v-model="value" variant="circular">
    <template #status="{ percent }">
      <span class="text-lg font-semibold text-highlighted">{{ percent }}%</span>
    </template>
  </UProgress>
</template>
```

### Indeterminate

When no `v-model` is set or the value is `null`, the Progress becomes _indeterminate_. The progress bar is animated as a `carousel`, but you can change it using the [`animation`](#animation) prop. \
The `circular` variant is indeterminate under the same conditions, which makes it suitable as a loading spinner.

::component-code
---
ignore:
  - class
external:
  - modelValue
props:
  modelValue: null
  variant: linear
  class: 'justify-center'
---
::

### Animation

Use the `animation` prop to change the animation of the Progress to an inverse carousel, a swinging bar or an elastic bar. Defaults to `carousel`. \
Each animation has a `circular` equivalent.

::component-code
---
ignore:
  - class
props:
  animation: swing
  variant: linear
  class: 'justify-center'
---
::

::tip
With the `linear` variant, the animation is automatically disabled when the user prefers reduced motion, the indeterminate bar is displayed as a full width pulse instead.
::

### Orientation

Use the `orientation` prop to change the orientation of the Progress. Defaults to `horizontal`.

::component-code
---
ignore:
  - class
props:
  orientation: vertical
  class: 'h-48'
---
::

::note
The `circular` variant is always a circle, so the `orientation` prop only controls the axis along which the [steps](#max) are laid out next to it.
::

### Color

Use the `color` prop to change the color of the Progress.

::component-code
---
props:
  color: neutral
  variant: linear
---
::

### Size

Use the `size` prop to change the size of the Progress. With the `circular` variant, the `size` prop controls the diameter of the circle and the default stroke width, which you can override with the [`thickness`](#thickness) prop.

::component-code
---
ignore:
  - class
props:
  size: xl
  variant: linear
  class: 'justify-center'
---
::

### Inverted

Use the `inverted` prop to visually invert the Progress. With the `circular` variant, this reverses the direction in which the circle is filled.

::component-code
---
ignore:
  - class
props:
  inverted: true
  variant: linear
  modelValue: 25
  class: 'justify-center'
---
::

## API

### Props

:component-props

### Slots

:component-slots

### Emits

:component-emits

## Theme

:component-theme

## Changelog

:component-changelog
