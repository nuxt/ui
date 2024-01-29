---
title: 'Progress'
description: Show a horizontal bar to indicate task progression.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/elements/Progress.vue
---

## Usage

Pass an integer as the `value` from `0` to `100` to the Progress bar component.

::component-card
---
props:
  value: 70
---
::

::callout{icon="i-heroicons-light-bulb"}
Check out the [Range](/components/range) component for forms.
::

### Max

You may also set the `max` number to set the maximum progress value, which will be relative to 100% percent.

::component-card
---
props:
  value: 2
  max: 5
options:
  - name: max
    restriction: only
    values:
      - 3
      - 4
      - 5
      - 6
      - 7
---
::

### Steps

You can set an array of named steps in the `max` prop to show the active step, at the same time it sets the maximum value.

The first step is always shown at `0%`, making the last `100%`.

::component-card
---
props:
  value: 0
  max:
    - Waiting to start
    - Cloning...
    - Migrating...
    - Deployed!
excludedProps:
  - max
---
::

### Progress indicator

You can add a numeric indicator, which will show the percent on top the progress track.

::component-card
---
props:
  value: 20
  indicator: true
---
::

### Indeterminate

By not setting a `value`, or setting it as `null`, the progress bar becomes _indeterminate_. The bar will be animated as a carousel, but you can change it using the `animation` prop for an inverse carousel, a swinging bar or an elastic bar.

::component-card
---
baseProps:
  value: null
props:
  animation: 'carousel'
options:
  - name: animation
    restriction: only
    values:
      - 'carousel'
      - 'carousel-inverse'
      - 'swing'
      - 'elastic'
---
::

### Size

Use the `size` prop to change the size of the progress bar.

::component-card
---
baseProps:
  value: 70
props:
  size: 'md'
  indicator: false
excludedProps:
  - value
---
::

### Style

Use the `color` prop to change the visual style of the Progress bar. The `color` can be any color from the `ui.colors` object.

::component-card
---
baseProps:
  value: 70
props:
  color: 'primary'
  indicator: false
excludedProps:
  - modelValue
---
::

## Slots

### `indicator`

You can use the `#indicator` slot to show a custom indicator above the progress bar. It receives the current `percent` of progress.

:component-example{component="progress-example-slot-indicator"}

### `step-<index>`

Use the `#step-<index>` to alter the HTML being shown for each step.

:component-example{component="progress-example-slot-step"}

## Props

:component-props

## Config

:component-preset
