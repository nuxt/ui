---
description: Display a range field
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/forms/Range.vue
---

## Usage

Use a `v-model` to make the Range reactive.

:component-example{component="range-example"}

### Style

Use the `color` prop to change the visual style of the Range.

::component-card
---
baseProps:
  placeholder: 'Search...'
props:
  color: 'primary'
---
::

### Size

Use the `size` prop to change the size of the Range.

::component-card
---
props:
  size: 'md'
---
::

### Disabled

Use the `disabled` prop to disable the Range.

::component-card
---
props:
  disabled: true
---
::

### Min and Max

Use the `min` and `max` prop to configure the Range.

::component-card
---
props:
  min: 0
  max: 100
---
::

### Step

Use the `step` prop to change the step increment.

::component-card
---
props:
  step: 20
---
::

## Props

:component-props

## Config

:component-preset
