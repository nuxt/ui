---
description: An indicator showing the progress of a task.
links:
  - label: Progress
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/progress
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Progress.vue
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

::component-code
---
external:
  - modelValue
props:
  modelValue: 50
  status: true
---
::

### Indeterminate

When no `v-model` is set or the value is `null`, the Progress becomes _indeterminate_. The progress bar is animated as a `carousel`, but you can change it using the [`animation`](#animation) prop.

::component-code
---
external:
  - modelValue
props:
  modelValue: null
---
::

### Animation

Use the `animation` prop to change the animation of the Progress to an inverse carousel, a swinging bar or an elastic bar. Defaults to `carousel`.

::component-code
---
props:
  animation: swing
---
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

### Color

Use the `color` prop to change the color of the Slider.

::component-code
---
props:
  color: neutral
---
::

### Size

Use the `size` prop to change the size of the Slider.

::component-code
---
props:
  size: xl
---
::

### Inverted

Use the `inverted` prop to visually invert the Progress.

::component-code
---
props:
  inverted: true
  modelValue: 25
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
