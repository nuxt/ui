---
title: InputNumber
description: Input numerical values with a customizable range.
links:
  - label: Number Field
    icon: i-custom-reka-ui
    to: https://www.reka-ui.com/components/input-number
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/InputNumber.vue
navigation.badge: New
---

::note
This component relies on the [`@internationalized/number`](https://react-spectrum.adobe.com/internationalized/number/index.html) package which provides utilities for formatting and parsing numbers across locales and numbering systems.
::

## Usage

Use the `v-model` directive to control the value of the InputNumber.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: 5
---
::

Use the `default-value` prop to set the initial value when you do not need to control its state.

::component-code
---
ignore:
  - defaultValue
props:
  defaultValue: 5
---
::

### Min / Max

Use the `min` and `max` props to set the minimum and maximum values of the InputNumber.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: 5
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
  modelValue: 5
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
  modelValue: 5
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
  modelValue: 5
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
  modelValue: 5
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
  modelValue: 5
  size: xl
---
::

### Disabled

Use the `disabled` prop to disable the InputNumber.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: 5
  disabled: true
---
::

### Increment / Decrement

Use the `increment` and `decrement` props to customize the increment and decrement buttons with any [Button](/components/button) props. Defaults to `{ variant: 'link' }`{lang="ts-type"}.

::component-code
---
prettier: true
ignore:
  - modelValue
  - increment.size
  - increment.color
  - increment.variant
  - decrement.size
  - decrement.color
  - decrement.variant
external:
  - modelValue
props:
  modelValue: 5
  increment:
    color: neutral
    variant: solid
    size: xs
  decrement:
    color: neutral
    variant: solid
    size: xs
---
::

### Increment / Decrement Icons

Use the `increment-icon` and `decrement-icon` props to customize the buttons [Icon](/components/icon). Defaults to `i-lucide-plus` / `i-lucide-minus`.

::component-code
---
prettier: true
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: 5
  incrementIcon: 'i-lucide-arrow-right'
  decrementIcon: 'i-lucide-arrow-left'
---
::

## Examples

### With decimal format

Use the `format-options` prop to customize the format of the value.

::component-example
---
name: 'input-number-decimal-example'
---
::

### With percentage format

Use the `format-options` prop with `style: 'percent'` to customize the format of the value.

::component-example
---
name: 'input-number-percentage-example'
---
::

### With currency format

Use the `format-options` prop with `style: 'currency'` to customize the format of the value.

::component-example
---
name: 'input-number-currency-example'
---
::

### Within a FormField

You can use the InputNumber within a [FormField](/components/form-field) component to display a label, help text, required indicator, etc.

::component-example
---
name: 'input-number-form-field-example'
---
::

### With slots

Use the `#increment` and `#decrement` slots to customize the buttons.

::component-example
---
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
