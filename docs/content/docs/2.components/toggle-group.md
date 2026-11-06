---
title: ToggleGroup
description: A set of buttons that can be pressed on or off.
category: element
keywords:
  - segmented control
  - button group
  - toggle buttons
links:
  - label: ToggleGroup
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/toggle-group
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/ToggleGroup.vue
navigation.badge: Soon
---

## Usage

Use the `v-model` directive to control the pressed items of the ToggleGroup.

::component-code
---
ignore:
  - modelValue
  - items
external:
  - items
  - modelValue
externalTypes:
  - ToggleGroupItem[]
props:
  modelValue: 'left'
  items:
    - value: 'left'
      icon: 'i-lucide-align-left'
      aria-label: 'Align left'
    - value: 'center'
      icon: 'i-lucide-align-center'
      aria-label: 'Align center'
    - value: 'right'
      icon: 'i-lucide-align-right'
      aria-label: 'Align right'
---
::

Use the `default-value` prop to set the initial value when you do not need to control its state.

::component-code
---
ignore:
  - defaultValue
  - items
external:
  - items
externalTypes:
  - ToggleGroupItem[]
props:
  defaultValue: 'left'
  items:
    - value: 'left'
      icon: 'i-lucide-align-left'
      aria-label: 'Align left'
    - value: 'center'
      icon: 'i-lucide-align-center'
      aria-label: 'Align center'
    - value: 'right'
      icon: 'i-lucide-align-right'
      aria-label: 'Align right'
---
::

### Items

Use the `items` prop as an array of objects that accept the [Button](/docs/components/button) props except the link ones, plus a `value` that defaults to the index as a string, so the model holds strings too:

- `value?: AcceptableValue`{lang="ts-type"}
- `label?: string`{lang="ts-type"}
- `icon?: string`{lang="ts-type"}
- `disabled?: boolean`{lang="ts-type"}
- `class?: any`{lang="ts-type"}
- `ui?: ButtonProps['ui']`{lang="ts-type"}

::component-code
---
ignore:
  - items
  - defaultValue
external:
  - items
externalTypes:
  - ToggleGroupItem[]
props:
  defaultValue: 'week'
  items:
    - label: 'Day'
      value: 'day'
    - label: 'Week'
      value: 'week'
    - label: 'Month'
      value: 'month'
---
::

### Multiple

Set the `type` prop to `multiple` to allow several items to be pressed at once. The model value is then an array.

::component-code
---
ignore:
  - items
  - defaultValue
external:
  - items
externalTypes:
  - ToggleGroupItem[]
props:
  type: 'multiple'
  defaultValue:
    - 'bold'
    - 'italic'
  items:
    - value: 'bold'
      icon: 'i-lucide-bold'
      aria-label: 'Toggle bold'
    - value: 'italic'
      icon: 'i-lucide-italic'
      aria-label: 'Toggle italic'
    - value: 'underline'
      icon: 'i-lucide-underline'
      aria-label: 'Toggle underline'
---
::

### Orientation

Use the `orientation` prop to change the orientation of the ToggleGroup. Defaults to `horizontal`.

::component-code
---
ignore:
  - items
  - defaultValue
external:
  - items
externalTypes:
  - ToggleGroupItem[]
props:
  orientation: 'vertical'
  defaultValue: 'week'
  items:
    - label: 'Day'
      value: 'day'
    - label: 'Week'
      value: 'week'
    - label: 'Month'
      value: 'month'
---
::

### Attached

Use the `attached` prop to attach the items together, like in a [FieldGroup](/docs/components/field-group).

::component-code
---
ignore:
  - items
  - defaultValue
external:
  - items
externalTypes:
  - ToggleGroupItem[]
props:
  attached: true
  variant: outline
  activeVariant: subtle
  defaultValue: 'week'
  items:
    - label: 'Day'
      value: 'day'
    - label: 'Week'
      value: 'week'
    - label: 'Month'
      value: 'month'
---
::

### Color

Use the `color` and `active-color` props to set the color of the items when not pressed and when pressed. Defaults to `neutral` and `primary`.

::component-code
---
items:
  color:
    - primary
    - secondary
    - success
    - info
    - warning
    - error
    - neutral
  activeColor:
    - primary
    - secondary
    - success
    - info
    - warning
    - error
    - neutral
ignore:
  - items
  - defaultValue
external:
  - items
externalTypes:
  - ToggleGroupItem[]
props:
  color: neutral
  activeColor: neutral
  defaultValue: 'week'
  items:
    - label: 'Day'
      value: 'day'
    - label: 'Week'
      value: 'week'
    - label: 'Month'
      value: 'month'
---
::

### Variant

Use the `variant` and `active-variant` props to set the variant of the items when not pressed and when pressed. Defaults to `ghost` and `soft`.

::component-code
---
items:
  variant:
    - solid
    - outline
    - soft
    - subtle
    - ghost
    - link
  activeVariant:
    - solid
    - outline
    - soft
    - subtle
    - ghost
    - link
ignore:
  - items
  - defaultValue
external:
  - items
externalTypes:
  - ToggleGroupItem[]
props:
  variant: outline
  activeVariant: subtle
  defaultValue: 'week'
  items:
    - label: 'Day'
      value: 'day'
    - label: 'Week'
      value: 'week'
    - label: 'Month'
      value: 'month'
---
::

### Size

Use the `size` prop to set the size of the items.

::component-code
---
items:
  size:
    - xs
    - sm
    - md
    - lg
    - xl
ignore:
  - items
  - defaultValue
external:
  - items
externalTypes:
  - ToggleGroupItem[]
props:
  size: xl
  defaultValue: 'week'
  items:
    - label: 'Day'
      value: 'day'
    - label: 'Week'
      value: 'week'
    - label: 'Month'
      value: 'month'
---
::

### Disabled

Use the `disabled` prop to disable the ToggleGroup.

::component-code
---
ignore:
  - items
  - defaultValue
external:
  - items
externalTypes:
  - ToggleGroupItem[]
props:
  disabled: true
  defaultValue: 'week'
  items:
    - label: 'Day'
      value: 'day'
    - label: 'Week'
      value: 'week'
    - label: 'Month'
      value: 'month'
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
