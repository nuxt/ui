---
description: Display a separator between content.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/layout/Divider.vue
---

## Usage

You can pass `label`, `icon` or `avatar` to the divider component.

### Label

::component-card
---
props:
  label: OR
---
::

### Icon

Use any icon from [Iconify](https://icones.js.org) by setting the `icon` prop by using this pattern: `i-{collection_name}-{icon_name}`.

::component-card
---
props:
  icon: 'i-simple-icons-github'
excludedProps:
  - icon
---
::

### Avatar

Use the [avatar](/components/avatar) prop as an `object` and configure it with any of its props.

::component-card
---
props:
  avatar:
    src: https://avatars.githubusercontent.com/u/739984?v=4
excludedProps:
  - avatar
---
::

### Orientation

You can change the orientation of the divider by setting the `orientation` prop to `horizontal` or `vertical`. Defaults to `horizontal`.

:component-example{component="divider-example-orientation"}

### Type

You can change the type of the divider by setting the `type` prop to `solid`, `dotted` or `dashed`. Defaults to `solid`.

::component-card{class="w-full"}
---
props:
  label: Nuxt UI
  type: dashed
excludedProps:
  - label
---
::

### Size

Use the `size` prop to change the size of the divider.

::component-card
---
props:
  label: Nuxt UI
  size: sm
excludedProps:
  - label
---
::

### Color

You can change the color of the content by using the `ui` prop

::component-card
---
props:
  label: Nuxt UI
  ui:
    label: text-primary-500 dark:text-primary-400
excludedProps:
  - label
  - ui
---
::

## Slots

### `default`

Use the `default` slot to add content to the divider.

:component-example{component="divider-example-default-slot"}

## Props

:component-props

## Config

:component-preset
