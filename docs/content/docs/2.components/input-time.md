---
title: InputTime
description: "An input for selecting a time."
category: form
links:
  - label: TimeField
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/time-field
  - label: TimeRangeField
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/time-range-field
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/InputTime.vue
---

## Usage

Use the `v-model` directive to control the selected time.

::component-code
---
cast:
  modelValue: TimeValue
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: [12, 30, 0]
---
::

Use the `default-value` prop to set the initial value when you do not need to control its state.

::component-code
---
cast:
  defaultValue: TimeValue
ignore:
  - defaultValue
external:
  - defaultValue
props:
  defaultValue: [9, 45, 0]
---
::

### Time Range

Use the `range` prop to enable time range selection with start and end times.

::component-code
---
prettier: true
cast:
  modelValue: TimeRange
ignore:
  - range
  - modelValue.start
  - modelValue.end
external:
  - modelValue
props:
  range: true
  modelValue:
    start: [9, 0, 0]
    end: [17, 30, 0]
---
::

Use the `default-value` prop to set the initial time range when you do not need to control its state.

::component-code
---
prettier: true
cast:
  defaultValue: TimeRange
ignore:
  - range
  - defaultValue.start
  - defaultValue.end
external:
  - defaultValue
props:
  range: true
  defaultValue:
    start: [8, 0, 0]
    end: [16, 30, 0]
---
:::

#vue
:::note{to="/docs/getting-started/integrations/i18n/vue#locale"}
This component uses the `@internationalized/date` package for locale-aware formatting. The time format is determined by the `locale` prop of the App component.
:::
::

### Color

Use the `color` prop to change the color of the InputTime.

::component-code
---
props:
  color: neutral
  highlight: true
---
::

::note
The `highlight` prop is used here to show the focus state. It's used internally when a validation error occurs.
::

### Variant

Use the `variant` prop to change the variant of the InputTime.

::component-code
---
props:
  variant: subtle
---
::

### Size

Use the `size` prop to change the size of the InputTime.

::component-code
---
props:
  size: xl
---
::

### Icon

Use the `icon` prop to show an [Icon](/docs/components/icon) inside the InputTime.

::component-code
---
props:
  icon: 'i-lucide-clock'
---
::

::note
Use the `leading` and `trailing` props to set the icon position or the `leading-icon` and `trailing-icon` props to set a different icon for each position.
::

### Avatar

Use the `avatar` prop to show an [Avatar](/docs/components/avatar) inside the InputTime.

::component-code
---
prettier: true
props:
  avatar:
    src: 'https://github.com/vuejs.png'
    loading: lazy
    size: md
    variant: outline
---
::

### Disabled

Use the `disabled` prop to disable the InputTime.

::component-code
---
props:
  disabled: true
---
::

### Class

Use the `class` prop to tweak the root element without touching the theming API.

::component-code
---
props:
  class: 'rounded-full border border-dashed border-default/40'
---
::

### UI

Use the `ui` prop to override slot-level styles.

::component-code
---
prettier: true
ignore:
  - ui
props:
  ui:
    segment: 'font-mono text-primary'
    leadingIcon: 'text-muted'
---
::

## Examples

### Time Range with Different Variants

Combine `range` with the `variant` prop to present multiple styles side by side.

::component-example
---
name: 'input-time-range-variants-example'
---
::

### Time range with icons

Add icons to emphasize the start and end time fields.

::component-example
---
name: 'input-time-range-icons-example'
---
::

### Time range with custom separator

Provide a custom separator UI for range inputs.

::component-example
---
name: 'input-time-range-separator-example'
---
::

### Within a FormField

Use InputTime inside a [FormField](/docs/components/form-field) to inherit labels, descriptions, and validation messages.

::component-example
---
name: 'input-time-form-field-example'
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
