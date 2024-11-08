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

Use the `defaultValue` prop to set the initial value when you do not need to control its state. The array should be the same length as the `length` prop.

::component-code
---
ignore:
  - defaultValue
props:
  defaultValue: ['1','2','3','4','5']
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
  type: 'text'
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

### Mask

Use the `mask` prop to treat the input like a password.

::component-code
---
ignore:
  - placeholder
  - defaultValue
props:
  mask: true
  placeholder: '0'
  defaultValue: ['1','2','3','4','5']
---
::

### Length

Use the `length` prop to change the amount of inputs.

::component-code
---
props:
  length: 6
---
::

## API

### Props

:component-props

### Emits

:component-emits

## Theme

:component-theme
