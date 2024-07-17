---
description: Display an image element with fallback.
links:
  - label: Avatar
    icon: i-custom-radix-vue
    to: https://www.radix-vue.com/components/avatar.html
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/benjamincanac/ui3/tree/dev/src/runtime/components/Avatar.vue
---

## Usage

Use the `src` prop to set the image URL. You can pass any property from HTML `<img>` element such as `alt`, `loading`, etc.

::component-code
---
props:
  src: 'https://avatars.githubusercontent.com/u/739984?v=4'
---
::

### Size

Use the `size` prop to set the size of the Avatar.

::component-code
---
ignore:
  - src
props:
  src: 'https://avatars.githubusercontent.com/u/739984?v=4'
  size: md
---
::

### Icon

Use the `icon` prop to display a fallback [Icon](/components/icon).

::component-code
---
props:
  icon: 'i-heroicons-photo'
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

When no icon or text is provided, the **initials** of the `alt` prop will be used as fallback.

::component-code
---
props:
  alt: 'Benjamin Canac'
  size: md
---
::

::tip
The `alt` prop will be used as the `alt` attribute of the image.
::

## Examples

### With tooltip

You can use the [Tooltip](/components/tooltip) component to display a tooltip when hovering the Avatar.

:component-example{name="AvatarTooltipExample"}

### With chip

You can use the [Chip](/components/chip) component to display a chip around the Avatar.

:component-example{name="AvatarChipExample"}

## API

### Props

:component-props

## Theme

:component-theme
