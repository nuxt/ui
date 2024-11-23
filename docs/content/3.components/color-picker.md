---
description: A component to select a color.
links: 
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/ColorPicker.vue
---

## Usage

Use the `v-model` directive to control the value of the ColorPicker.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: '00C16A'
---
::

Use the `default-value` prop to set the initial value when you do not need to control its state.

::component-code
---
ignore:
  - defaultValue
props:
  defaultValue: '00BCD4'
---
::

### RGB

Use the `format` prop to set `rgb` value of the ColorPicker.

::component-code
---
ignore:
  - modelValue.r
  - modelValue.g
  - modelValue.b
  - format
external:
  - modelValue
props:
  format: rgb
  modelValue:
    r: 0
    g: 193
    b: 106
---
::

### HSB

Use the `format` prop to set `hsb` value of the ColorPicker.

::component-code
---
ignore:
  - modelValue.h
  - modelValue.s
  - modelValue.b
  - format
external:
  - modelValue
props:
  format: hsb
  modelValue:
    h: 152.95
    s: 100
    b: 75.69
---
::

### Throttle

Use the `throttle` prop to set the throttle value of the ColorPicker.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  throttle: 100
  modelValue: '00C16A'
---
::

### Size

Use the `size` prop to set the size of the ColorPicker.

::component-code
---
props:
  size: md
---
::

### Disabled

Use the `disabled` prop to disable the ColorPicker.

::component-code
---
props:
  disabled: true
---
::

## Examples

### Color chooser

Combined [Button](/components/button) and [Popover](/components/popover) components to create a color chooser.

::component-example
---
name: 'color-picker-chooser-example'
---
::

## API

### Props

:component-props

### Emits

:component-emits

## Theme

:component-theme
