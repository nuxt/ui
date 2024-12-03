---
title: RadioGroup
description: A set of radio buttons to select a single option from a list.
links:
  - label: RadioGroup
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/radio-group
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/RadioGroup.vue
---

## Usage

Use the `v-model` directive to control the value of the RadioGroup or the `default-value` prop to set the initial value when you do not need to control its state.

### Items

Use the `items` prop as an array of strings, numbers or booleans:

::component-code
---
prettier: true
ignore:
  - modelValue
  - items
external:
  - items
  - modelValue
props:
  modelValue: 'System'
  items:
    - 'System'
    - 'Light'
    - 'Dark'
---
::

You can also pass an array of objects with the following properties:

- `label?: string`{lang="ts-type"}
- `description?: string`{lang="ts-type"}
- [`value?: string`{lang="ts-type"}](#value-key)
- `disabled?: boolean`{lang="ts-type"}

::component-code
---
ignore:
  - modelValue
  - items
external:
  - items
  - modelValue
props:
  modelValue: 'system'
  items:
    - label: 'System'
      description: 'This is the first option.'
      value: 'system'
    - label: 'Light'
      description: 'This is the second option.'
      value: 'light'
    - label: 'Dark'
      description: 'This is the third option.'
      value: 'dark'
---
::

::caution
When using objects, you need to reference the `value` property of the object in the `v-model` directive or the `default-value` prop.
::

### Value Key

You can change the property that is used to set the value by using the `value-key` prop. Defaults to `value`.

::component-code
---
ignore:
  - modelValue
  - items
  - valueKey
external:
  - items
  - modelValue
props:
  modelValue: 'light'
  valueKey: 'id'
  items:
    - label: 'System'
      description: 'This is the first option.'
      id: 'system'
    - label: 'Light'
      description: 'This is the second option.'
      id: 'light'
    - label: 'Dark'
      description: 'This is the third option.'
      id: 'dark'
---
::

### Legend

Use the `legend` prop to set the legend of the RadioGroup.

::component-code
---
prettier: true
ignore:
  - defaultValue
  - items
external:
  - items
props:
  legend: 'Theme'
  defaultValue: 'System'
  items:
    - 'System'
    - 'Light'
    - 'Dark'
---
::

### Orientation

Use the `orientation` prop to change the orientation of the RadioGroup. Defaults to `vertical`.

::component-code
---
prettier: true
ignore:
  - defaultValue
  - items
external:
  - items
props:
  orientation: 'horizontal'
  defaultValue: 'System'
  items:
    - 'System'
    - 'Light'
    - 'Dark'
---
::

### Color

Use the `color` prop to change the color of the RadioGroup.

::component-code
---
prettier: true
ignore:
  - defaultValue
  - items
external:
  - items
props:
  color: neutral
  defaultValue: 'System'
  items:
    - 'System'
    - 'Light'
    - 'Dark'
---
::

### Size

Use the `size` prop to change the size of the RadioGroup.

::component-code
---
prettier: true
ignore:
  - defaultValue
  - items
external:
  - items
props:
  size: 'xl'
  defaultValue: 'System'
  items:
    - 'System'
    - 'Light'
    - 'Dark'
---
::

### Disabled

Use the `disabled` prop to disable the RadioGroup.

::component-code
---
prettier: true
ignore:
  - defaultValue
  - items
external:
  - items
props:
  disabled: true
  defaultValue: 'System'
  items:
    - 'System'
    - 'Light'
    - 'Dark'
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
