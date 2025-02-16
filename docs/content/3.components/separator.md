---
description: Separates content horizontally or vertically.
links:
  - label: Separator
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/separator
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Separator.vue
---

## Usage

Use the Separator component as-is to separate content.

::component-code
---
class: 'p-8'
---
::

### Orientation

Use the `orientation` prop to change the orientation of the Separator. Defaults to `horizontal`.

::component-code
---
ignore:
  - class
class: 'p-8'
props:
  orientation: vertical
  class: 'h-48'
---
::

### Label

Use the `label` prop to display a label in the middle of the Separator.

::component-code
---
class: 'p-8'
props:
  label: 'Hello World'
---
::

### Icon

Use the `icon` prop to display an icon in the middle of the Separator.

::component-code
---
class: 'p-8'
props:
  icon: 'i-simple-icons-nuxtdotjs'
---
::

### Avatar

Use the `avatar` prop to display an avatar in the middle of the Separator.

::component-code
---
prettier: true
class: 'p-8'
props:
  avatar:
    src: 'https://github.com/nuxt.png'
---
::

### Color

Use the `color` prop to change the color of the Separator. Defaults to `neutral`.

::component-code
---
class: 'p-8'
props:
  color: primary
  type: solid
---
::

### Type

Use the `type` prop to change the type of the Separator. Defaults to `solid`.

::component-code
---
class: 'p-8'
props:
  type: dashed
---
::

### Size

Use the `size` prop to change the size of the Separator. Defaults to `xs`.

::component-code
---
class: 'p-8'
props:
  size: lg
---
::

## API

### Props

:component-props

### Slots

:component-slots

## Theme

:component-theme
