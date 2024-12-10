---
title: PinInput
description: An input element to enter a pin.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/PinInput.vue
navigation.badge: New
---

## Usage

Use the `v-model` directive to control the value of the PinInput.

::component-code
---
prettier: true
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: []
---
::

Use the `default-value` prop to set the initial value when you do not need to control its state.

::component-code
---
prettier: true
ignore:
  - defaultValue
props:
  defaultValue: ['1','2','3']
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

::note
When `type` is set to `number`, it will only accept numeric characters.
::

### Mask

Use the `mask` prop to treat the input like a password.

::component-code
---
prettier: true
ignore:
  - placeholder
  - defaultValue
props:
  mask: true
  defaultValue: ['1','2','3','4','5']
---
::

### OTP

Use the `otp` prop to enable One-Time Password functionality. When enabled, mobile devices can automatically detect and fill OTP codes from SMS messages or clipboard content, with autocomplete support.

::component-code
---
props:
  otp: true
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

### Placeholder

Use the `placeholder` prop to set a placeholder text.

::component-code
---
props:
  placeholder: '○'
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
  placeholder: '○'
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
  placeholder: '○'
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
  placeholder: '○'
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
  placeholder: '○'
---
::

## API

### Props

:component-props

### Emits

:component-emits

## Theme

:component-theme
