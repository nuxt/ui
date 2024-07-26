---
description: A short text to represent a status or a category.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/benjamincanac/ui3/tree/dev/src/runtime/components/Badge.vue
---

## Usage

### Label

Use the default slot to set the label of the Badge.

::component-code
---
slots:
  default: Badge
---
::

You can achieve the same result by using the `label` prop.

::component-code
---
props:
  label: Badge
---
::

### Color

Use the `color` prop to change the color of the Badge.

::component-code
---
props:
  color: gray
slots:
  default: Badge
---
::

### Variant

Use the `variant` props to change the variant of the Badge.

::component-code
---
props:
  color: gray
  variant: outline
slots:
  default: Badge
---
::

### Size

Use the `size` prop to change the size of the Badge.

::component-code
---
props:
  size: lg
slots:
  default: Badge
---
::

## Examples

### `class` prop

Use the `class` prop to override the base styles of the Badge.

::component-code
---
props:
  class: 'font-bold rounded-full'
slots:
  default: Badge
---
::

## API

### Props

:component-props

### Slots

:component-slots

## Theme

:component-theme
