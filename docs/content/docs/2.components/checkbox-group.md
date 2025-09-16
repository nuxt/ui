---
title: CheckboxGroup
description: A set of checklist buttons to select multiple option from a list.
category: form
links:
  - label: CheckboxGroup
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/checkbox#group-root
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/CheckboxGroup.vue
---


## Usage

Use the `v-model` directive to control the value of the CheckboxGroup or the `default-value` prop to set the initial value when you do not need to control its state.

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
  modelValue:
    - 'System'
  items:
    - 'System'
    - 'Light'
    - 'Dark'
---
::

### Items

Use the `items` prop as an array of strings or numbers:

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
  modelValue:
    - 'System'
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
- `class?: any`{lang="ts-type"}
- `ui?: { item?: ClassNameValue, container?: ClassNameValue, base?: ClassNameValue, 'indicator'?: ClassNameValue, icon?: ClassNameValue, wrapper?: ClassNameValue, label?: ClassNameValue, description?: ClassNameValue }`{lang="ts-type"}

::component-code
---
ignore:
  - modelValue
  - items
external:
  - items
  - modelValue
externalTypes:
  - CheckboxGroupItem[]
props:
  modelValue:
    - 'system'
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
externalTypes:
  - CheckboxGroupItem[]
props:
  modelValue:
    - 'light'
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

Use the `legend` prop to set the legend of the CheckboxGroup.

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
  defaultValue:
    - 'System'
  items:
    - 'System'
    - 'Light'
    - 'Dark'
---
::

### Color

Use the `color` prop to change the color of the CheckboxGroup.

::component-code
---
prettier: true
ignore:
  - defaultValue
  - items
external:
  - items
items:
  color:
    - primary
    - secondary
    - success
    - info
    - warning
    - error
    - neutral
props:
  color: neutral
  defaultValue:
    - 'System'
  items:
    - 'System'
    - 'Light'
    - 'Dark'
---
::

### Variant

Use the `variant` prop to change the variant of the CheckboxGroup.

::component-code
---
prettier: true
ignore:
  - defaultValue
  - items
external:
  - items
items:
  color:
    - primary
    - secondary
    - success
    - info
    - warning
    - error
    - neutral
  variant:
    - list
    - card
    - table
props:
  color: 'primary'
  variant: 'card'
  defaultValue:
    - 'System'
  items:
    - 'System'
    - 'Light'
    - 'Dark'
---
::

### Size

Use the `size` prop to change the size of the CheckboxGroup.

::component-code
---
prettier: true
ignore:
  - defaultValue
  - items
external:
  - items
items:
  variant:
    - list
    - card
    - table
props:
  size: 'xl'
  variant: 'list'
  defaultValue:
    - 'System'
  items:
    - 'System'
    - 'Light'
    - 'Dark'
---
::

### Orientation

Use the `orientation` prop to change the orientation of the CheckboxGroup. Defaults to `vertical`.

::component-code
---
prettier: true
ignore:
  - defaultValue
  - items
external:
  - items
items:
  variant:
    - list
    - card
    - table
props:
  orientation: 'horizontal'
  variant: 'list'
  defaultValue:
    - 'System'
  items:
    - 'System'
    - 'Light'
    - 'Dark'
---
::

### Indicator

Use the `indicator` prop to change the position or hide the indicator. Defaults to `start`.

::component-code
---
prettier: true
ignore:
  - defaultValue
  - items
external:
  - items
items:
  indicator:
    - start
    - end
    - hidden
  variant:
    - list
    - card
    - table
props:
  indicator: 'end'
  variant: 'card'
  defaultValue:
    - 'System'
  items:
    - 'System'
    - 'Light'
    - 'Dark'
---
::

### Disabled

Use the `disabled` prop to disable the CheckboxGroup.

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
  defaultValue:
    - 'System'
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

## Changelog

:component-changelog
