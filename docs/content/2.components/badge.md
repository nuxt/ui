---
description: Display a short text to represent a status or a category.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/Badge.vue
---

## Usage

Use the default slot to set the label of the Badge.

::component-code
---
slots:
  default: Badge
---

Badge
::

You can achieve the same result by using the `label` prop.

::component-code
---
props:
  label: Badge
---
::

### Style

Use the `color` and `variant` props to change the style of the Badge.

::component-code
---
slots:
  default: Badge
props:
  color: primary
  variant: solid
---

Badge
::

::tip
Try out the `gray` color for a neutral style.
::

### Size

Use the `size` prop to change the size of the Badge.

::component-code
---
slots:
  default: Badge
props:
  size: md
---

Badge
::

## API

### Props

:component-props

### Slots

:component-slots

## Theme

:component-theme
