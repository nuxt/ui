---
title: InputNumber
description: Input numerical values with a customizable range.
links:
  - label: Number Field
    icon: i-custom-radix-vue
    to: https://www.radix-vue.com/components/number-field
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/InputNumber.vue
---

## Usage

Use the `v-model` directive to control the value of the InputNumber.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: 0
---
::

### Min and Max

Use the `min` and `max` props to set the minimum and maximum value of the InputNumber.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: 0
  min: 0
  max: 10
---
::

### Step

Use the `step` prop to set the step value of the InputNumber.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: 0 
  step: 2
---
::

### Orientation

Use the `orientation` prop to change the orientation of the InputNumber.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: 0
  orientation: vertical
---
::

### Placeholder

Use the `placeholder` prop to set a placeholder text.

::component-code
---
props:
  placeholder: 'Enter a number'
---
::

### Color

Use the `color` prop to change the ring color when the InputNumber is focused.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: 0
  color: neutral
  highlight: true
---
::

### Variant

Use the `variant` prop to change the variant of the InputNumber.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: 0
  variant: subtle
  color: neutral
  highlight: false
---
::

### Size

Use the `size` prop to change the size of the InputNumber.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: 0
  size: xl
---
::

### Icon

Use the `icon` prop to show an [Icon](/components/icon) inside the InputNumber.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: 0
  incrementIcon: 'i-lucide-arrow-right'
  decrementIcon: 'i-lucide-arrow-left'
---
::

## Examples

### Within a FormField

You can use the Input within a [FormField](/components/form-field) component to display a label, help text, required indicator, etc.

::component-example
---
collapse: true
name: 'input-number-form-field-example'
---
::

### With custom slot

::component-example
---
collapse: true
name: 'input-number-slots-example'
---
::

## API

### Props

:component-props

### Slots

:component-slots

### Emits

:component-emits

### Expose

When accessing the component via a template ref, you can use the following:

| Name                       | Type                                            |
|----------------------------|-------------------------------------------------|
| `inputRef`{lang="ts-type"} | `Ref<HTMLInputElement \| null>`{lang="ts-type"} |

## Theme

:component-theme
