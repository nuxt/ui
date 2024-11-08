---
description: An input element to enter a pin.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/PinInput.vue
---

## Usage

Use the `v-model` directive to control the value of the PinInput.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: []
---
::

### Type

Use the `type` prop to change the input type. Defaults to `text`.

::component-code
---
items:
  type:
    - text
    - number
props:
  type: 'number'
---
::

### Placeholder

Use the `placeholder` prop to set a placeholder text.

::component-code
---
props:
  placeholder: '0'
---
::

### Color

Use the `color` prop to change the ring color when the PinInput is focused.

::component-code
---
ignore:
  - placeholder
props:
  color: neutral
  highlight: true
  placeholder: '0'
---
::

::note
The `highlight` prop is used here to show the focus state. It's used internally when a validation error occurs.
::

### Variant

Use the `variant` prop to change the variant of the PinInput.

::component-code
---
ignore:
  - placeholder
props:
  color: neutral
  variant: subtle
  highlight: false
  placeholder: '0'
---
::

### Size

Use the `size` prop to change the size of the PinInput.

::component-code
---
ignore:
  - placeholder
props:
  size: xl
  placeholder: '0'
---
::


### Disabled

Use the `disabled` prop to disable the PinInput.

::component-code
---
ignore:
  - placeholder
props:
  disabled: true
  placeholder: '0'
---
::

## API

### Props

:component-props

### Slots

:component-slots

### Emits

:component-emits

## Theme

:component-theme
