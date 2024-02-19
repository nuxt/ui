---
description: Display a dual range field
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/forms/DualRange.vue
---

## Usage

Use a `v-model` to make the DualRange reactive.

:component-example{component="dual-range-example"}

### Style

Use the `color` prop to change the visual style of the DualRange.

::component-card
---
props:
  color: 'primary'
---
::

### Size

Use the `size` prop to change the size of the DualRange.

::component-card
---
props:
  size: 'md'
---
::

### Disabled

Use the `disabled` prop to disable the DualRange.

::component-card
---
props:
  disabled: true
---
::

### Min and Max

Use the `min` and `max` prop to configure the DualRange limits.

::component-card
---
baseProps:
  model-value: [100, 200]
props:
  min: 0
  max: 1000
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

::callout{icon="i-heroicons-light-bulb"}
  The `name` and `id` props will both get a suffix of `-start` in the range start input and `-end` in the range end input.
::

:component-props

## Config

:component-preset
