---
title: RadioGroup
description: A set of radio buttons to select a single option from a list.
links:
  - label: RadioGroup
    icon: i-custom-radix-vue
    to: https://www.radix-vue.com/components/radio-group.html
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/benjamincanac/ui3/tree/dev/src/runtime/components/RadioGroup.vue
---

## Usage

Use the `items` prop as an array of objects with the following properties:

- `label?: string`{lang="ts-type"}
- `description?: string`{lang="ts-type"}
- `value?: string`{lang="ts-type"}
- `disabled?: boolean`{lang="ts-type"}

Use the `v-model` directive to control the value of the RadioGroup.

::component-code
---
external:
  - modelValue
  - items
props:
  modelValue: '1'
  items:
    - label: 'Option 1'
      description: 'This is the first option.'
      value: '1'
    - label: 'Option 2'
      description: 'This is the second option.'
      value: '2'
    - label: 'Option 3'
      description: 'This is the third option.'
      value: '3'
---
::

Use the `default-value` prop to set the initial value when you do not need to control its state.

::component-code
---
external:
  - items
props:
  defaultValue: '1'
  items:
    - label: 'Option 1'
      description: 'This is the first option.'
      value: '1'
    - label: 'Option 2'
      description: 'This is the second option.'
      value: '2'
    - label: 'Option 3'
      description: 'This is the third option.'
      value: '3'
---
::

### Legend

Use the `legend` prop to set the legend of the RadioGroup.

::component-code
---
ignore:
  - defaultValue
external:
  - items
props:
  defaultValue: '1'
  legend: 'Legend'
  items:
    - label: 'Option 1'
      description: 'This is the first option.'
      value: '1'
    - label: 'Option 2'
      description: 'This is the second option.'
      value: '2'
    - label: 'Option 3'
      description: 'This is the third option.'
      value: '3'
---
::

### Orientation

Use the `orientation` prop to change the orientation of the RadioGroup. Defaults to `vertical`.

::component-code
---
ignore:
  - defaultValue
external:
  - items
props:
  defaultValue: '1'
  orientation: 'horizontal'
  items:
    - label: 'Option 1'
      description: 'This is the first option.'
      value: '1'
    - label: 'Option 2'
      description: 'This is the second option.'
      value: '2'
    - label: 'Option 3'
      description: 'This is the third option.'
      value: '3'
---
::

### Color

Use the `color` prop to change the color of the RadioGroup.

::component-code
---
ignore:
  - defaultValue
external:
  - items
props:
  defaultValue: '1'
  color: 'gray'
  items:
    - label: 'Option 1'
      description: 'This is the first option.'
      value: '1'
    - label: 'Option 2'
      description: 'This is the second option.'
      value: '2'
    - label: 'Option 3'
      description: 'This is the third option.'
      value: '3'
---
::

### Size

Use the `size` prop to change the size of the RadioGroup.

::component-code
---
ignore:
  - defaultValue
external:
  - items
props:
  defaultValue: '1'
  size: 'xl'
  items:
    - label: 'Option 1'
      description: 'This is the first option.'
      value: '1'
    - label: 'Option 2'
      description: 'This is the second option.'
      value: '2'
    - label: 'Option 3'
      description: 'This is the third option.'
      value: '3'
---
::

### Disabled

Use the `disabled` prop to disable the RadioGroup.

::component-code
---
ignore:
  - defaultValue
external:
  - items
props:
  defaultValue: '1'
  disabled: true
  items:
    - label: 'Option 1'
      description: 'This is the first option.'
      value: '1'
    - label: 'Option 2'
      description: 'This is the second option.'
      value: '2'
    - label: 'Option 3'
      description: 'This is the third option.'
      value: '3'
---
::

## API

### Props

:component-props

### Slots

:component-slots

### Events

:component-events

## Theme

:component-theme
