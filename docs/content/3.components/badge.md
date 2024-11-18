---
description: A short text to represent a status or a category.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Badge.vue
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
  color: neutral
slots:
  default: Badge
---
::

### Variant

Use the `variant` props to change the variant of the Badge.

::component-code
---
props:
  color: neutral
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

### Icon

Use the `icon` prop to show an [Icon](/components/icon) inside the Badge.

::component-code
---
props:
  icon: i-lucide-rocket
  size: md
  color: primary
  variant: solid
slots:
  default: Badge
---
::

Use the `leading` and `trailing` props to set the icon position or the `leading-icon` and `trailing-icon` props to set a different icon for each position.

::component-code
---
props:
  trailingIcon: i-lucide-arrow-right
  size: md
slots:
  default: Badge
---
::

### Avatar

Use the `avatar` prop to show an [Avatar](/components/avatar) inside the Badge.

::component-code
---
prettier: true
props:
  avatar:
    src: 'https://github.com/nuxt.png'
  size: md
  color: neutral
  variant: outline
slots:
  default: |

    Badge
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
