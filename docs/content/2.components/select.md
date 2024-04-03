---
description: Display a select field.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/forms/Select.vue
---

## Usage

The Select component is a wrapper around the native `<select>` HTML element. For more advanced use cases like searching or multiple selection, consider using the [SelectMenu](/components/select-menu) component.

Use a `v-model` to make the Select reactive alongside the `options` prop to pass an array of strings or objects.

:component-example{component="select-example"}

When using objects, you can configure which field will be used for display through the `option-attribute` prop that defaults to `label` and which field will be used for comparison through the `value-attribute` prop that defaults to `value`.

Adding a `disabled` key to the objects will control the disabled state of the option.

:component-example{component="select-example-objects"}

### Style

Use the `color` and `variant` props to change the visual style of the Select.

::component-card
---
baseProps:
  options:
    - 'United States'
    - 'Canada'
    - 'Mexico'
props:
  color: 'primary'
  variant: 'outline'
---
::

Besides all the colors from the `ui.colors` object, you can also use the `white` (default) and `gray` colors with their pre-defined variants.

#### White

::component-card
---
baseProps:
  options:
    - 'United States'
    - 'Canada'
    - 'Mexico'
props:
  color: 'white'
  variant: 'outline'
excludedProps:
  - color
---
::

#### Gray

::component-card
---
baseProps:
  options:
    - 'United States'
    - 'Canada'
    - 'Mexico'
props:
  color: 'gray'
  variant: 'outline'
excludedProps:
  - color
---
::

### Size

Use the `size` prop to change the size of the Select.

::component-card
---
baseProps:
  options:
    - 'United States'
    - 'Canada'
    - 'Mexico'
props:
  size: 'sm'
---
::

### Placeholder

Use the `placeholder` prop to set a placeholder text.

::component-card
---
baseProps:
  options:
    - 'United States'
    - 'Canada'
    - 'Mexico'
props:
  placeholder: 'Search...'
---
::

### Icon

Use any icon from [Iconify](https://icones.js.org) by setting the `icon` prop by using this pattern: `i-{collection_name}-{icon_name}`.

Use the `trailing-icon` prop to set a different icon or change it globally in `ui.select.default.trailingIcon`. Defaults to `i-heroicons-chevron-down-20-solid`.

::component-card
---
baseProps:
  options:
    - 'United States'
    - 'Canada'
    - 'Mexico'
  placeholder: 'Search...'
props:
  icon: 'i-heroicons-magnifying-glass-20-solid'
  color: 'white'
  size: 'sm'
options:
  - name: color
    restriction: included
    values:
      - white
      - gray
excludedProps:
  - icon
---
::

### Disabled

Use the `disabled` prop to disable the Select.

::component-card
---
baseProps:
  options:
    - 'United States'
    - 'Canada'
    - 'Mexico'
  placeholder: 'Search...'
props:
  disabled: true
---
::

Add a `disabled` key with a truthy value to the `options` array of object to disable a single option.

### Loading

Use the `loading` prop to show a loading icon and disable the Input.

Use the `loading-icon` prop to set a different icon or change it globally in `ui.select.default.loadingIcon`. Defaults to `i-heroicons-arrow-path-20-solid`.

::component-card
---
baseProps:
  options:
    - 'United States'
    - 'Canada'
    - 'Mexico'
  placeholder: 'Search...'
props:
  loading: true
  icon: 'i-heroicons-magnifying-glass-20-solid'
excludedProps:
  - icon
---
::

### Padded

Use the `padded` prop to remove the padding of the Select.

::component-card
---
props:
  padded: false
baseProps:
  placeholder: 'Search...'
  options:
    - 'United States'
    - 'Canada'
    - 'Mexico'
  variant: 'none'
  class: 'w-full'
---
::

## Slots

### `leading`

Use the `#leading` slot to set the content of the leading icon.

::component-card
---
slots:
  leading: <UIcon name="i-heroicons-flag" class="w-5 h-5" />
baseProps:
  options:
    - 'United States'
    - 'Canada'
    - 'Mexico'
  placeholder: 'Search...'
---

#leading
  :u-icon{name="i-heroicons-flag" class="w-5 h-5"}
::

### `trailing`

Use the `#trailing` slot to set the content of the trailing icon.

::component-card
---
slots:
  trailing: <UIcon name="i-heroicons-arrows-up-down-20-solid" class="w-5 h-5" />
baseProps:
  placeholder: 'Search...'
---

#trailing
  :u-icon{name="i-heroicons-arrows-up-down-20-solid" class="w-5 h-5"}
::

## Props

:component-props

## Config

:component-preset
