---
description: Display an input field.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/forms/Input.vue
---

## Usage

Use a `v-model` to make the Input reactive.

:component-example{component="input-example"}

### Style

Use the `color` and `variant` props to change the visual style of the Input.

::component-card
---
baseProps:
  placeholder: 'Search...'
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
  placeholder: 'Search...'
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
  placeholder: 'Search...'
props:
  color: 'gray'
  variant: 'outline'
excludedProps:
  - color
---
::

### Size

Use the `size` prop to change the size of the Input.

::component-card
---
props:
  size: 'sm'
---
::

### Type

Use the `type` prop to change the input type, the default `type` is set to `text`, you can check all the available types at [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types).

Some types have been implemented in their own components, such as [Checkbox](/components/checkbox), [Radio](/components/radio-group), etc. and others have been styled like `file` for example.

::component-card
---
baseProps:
  icon: 'i-heroicons-folder'
props:
  type: 'file'
  size: sm
options:
  - name: type
    restriction: included
    values:
      - file
      - password
      - number
---
::

### Placeholder

Use the `placeholder` prop to set a placeholder text.

::component-card
---
props:
  placeholder: 'Search...'
---
::

### Icon

Use any icon from [Iconify](https://icones.js.org) by setting the `icon` prop by using this pattern: `i-{collection_name}-{icon_name}`.

Use the `leading` and `trailing` props to set the icon position or the `leading-icon` and `trailing-icon` props to set a different icon for each position.

::component-card
---
baseProps:
  placeholder: 'Search...'
props:
  icon: 'i-heroicons-magnifying-glass-20-solid'
  size: 'sm'
  color: 'white'
  trailing: false
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

Use the `disabled` prop to disable the Input.

::component-card
---
baseProps:
  placeholder: 'Search...'
props:
  disabled: true
---
::

### Loading

Use the `loading` prop to show a loading icon in the Input.

Use the `loading-icon` prop to set a different icon or change it globally in `ui.input.default.loadingIcon`. Defaults to `i-heroicons-arrow-path-20-solid`.

::component-card
---
baseProps:
  placeholder: 'Searching...'
props:
  loading: true
  icon: 'i-heroicons-magnifying-glass-20-solid'
excludedProps:
  - icon
---
::

### Padded

Use the `padded` prop to remove the padding of the Input.

::component-card
---
props:
  padded: false
baseProps:
  placeholder: 'Search...'
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
  leading: <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" size="2xs" />
baseProps:
  placeholder: 'Search...'
---

#leading
  :u-avatar{src="https://avatars.githubusercontent.com/u/739984?v=4" size="2xs"}
::

### `trailing`

Use the `#trailing` slot to set the content of the trailing icon.

::component-card
---
slots:
  trailing: <span class="text-gray-500 dark:text-gray-400 text-xs">EUR</span>
baseProps:
  placeholder: 'Search...'
---

#trailing
  [EUR]{class="text-gray-500 dark:text-gray-400 text-xs"}
::

You can for example create a clearable Input by injecting a [Button](/components/button) in the `trailing` slot that displays when some text is entered.

:component-example{component="input-example-clearable"}

::callout{icon="i-heroicons-exclamation-triangle-20-solid"}
As leading and trailing icons are wrapped around a `pointer-events-none` class, if you inject a clickable element in the slot, you need to remove this class to make it clickable by adding `:ui="{ icon: { trailing: { pointer: '' } } }"` to the Input.
::

## Props

:component-props

## Config

:component-preset
