---
description: An img element with fallback and Nuxt Image support.
links:
  - label: Avatar
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/avatar
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Avatar.vue
---

## Usage

::tip
The Avatar uses the `NuxtImg` component when [`@nuxt/image`](https://github.com/nuxt/image) is installed, falling back to `img` otherwise.
::

### Src

Use the `src` prop to set the image URL. You can pass any property from HTML `<img>` element such as `alt`, `loading`, etc.

::component-code
---
props:
  src: 'https://github.com/benjamincanac.png'
---
::

### Size

Use the `size` prop to set the size of the Avatar.

::component-code
---
ignore:
  - src
props:
  src: 'https://github.com/benjamincanac.png'
  size: xl
---
::

::note
The `<img>` element's `width` and `height` are automatically set based on the `size` prop.
::

### Icon

Use the `icon` prop to display a fallback [Icon](/components/icon).

::component-code
---
props:
  icon: 'i-lucide-image'
  size: md
---
::

### Text

Use the `text` prop to display a fallback text.

::component-code
---
props:
  text: '+1'
  size: md
---
::

### Alt

When no icon or text is provided, the **initials** of the `alt` prop is used as fallback.

::component-code
---
props:
  alt: 'Benjamin Canac'
  size: md
---
::

::note
The `alt` prop is passed to the `img` element as the `alt` attribute.
::

## Examples

### With tooltip

You can use a [Tooltip](/components/tooltip) component to display a tooltip when hovering the Avatar.

:component-example{name="avatar-tooltip-example"}

### With chip

You can use a [Chip](/components/chip) component to display a chip around the Avatar.

:component-example{name="avatar-chip-example"}

## API

### Props

:component-props

## Theme

:component-theme
