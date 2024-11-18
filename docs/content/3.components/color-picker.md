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
props:
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

### Inline

Use the `inline` prop to display the ColorPicker inline.

::component-code
---
props:
  inline: true
---
::

## Examples

### With RGB value

Default color format to use in value binding is `hex` and other possible values can be `rgb` using the format property.

::component-example
---
name: 'color-picker-rgb-example'
---
::

### With input control

You can use the `#trigger` slot to display a custom trigger.

::component-example
---
name: 'color-picker-trigger-example'
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
