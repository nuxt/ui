---
description: Display a toggle field.
links:
  - label: 'Switch'
    icon: i-simple-icons-headlessui
    to: 'https://headlessui.com/v1/vue/switch'
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/forms/Toggle.vue
---

## Usage

Use a `v-model` to make the Toggle reactive.

:component-example{component="toggle-example"}

### Style

Use the `color` prop to change the style of the Toggle.

::component-card
---
props:
  color: 'primary'
---
::

### Size

Use the `size` prop to change the size of the Toggle.

::component-card
---
props:
  size: 'md'
---
::

### Icon

Use any icon from [Iconify](https://icones.js.org) by setting the `on-icon` and `off-icon` props by using this pattern: `i-{collection_name}-{icon_name}` or change it globally in `ui.toggle.default.onIcon` and `ui.toggle.default.offIcon`.

::component-card
---
props:
  onIcon: 'i-heroicons-check-20-solid'
  offIcon: 'i-heroicons-x-mark-20-solid'
excludedProps:
  - onIcon
  - offIcon
---
::

### Loading

Use the `loading` prop to show a loading icon and disable the Toggle.

Use the `loading-icon` prop to set a different icon or change it globally in `ui.toggle.default.loadingIcon`. Defaults to `i-heroicons-arrow-path-20-solid`.

::component-card
---
props:
  loading: true
---
::

### Disabled

Use the `disabled` prop to disable the Toggle.

::component-card
---
props:
  disabled: true
---
::


## Props

:component-props

## Config

:component-preset
