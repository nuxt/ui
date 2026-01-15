---
title: InputTimeRange
description: 'An input for selecting a time range.'
category: form
links:
  - label: TimeRangeField
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/time-range-field
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/InputTimeRange.vue
---

## Usage

Use the `v-model` directive to control the selected time range.

::component-code
---
cast:
  modelValue: TimeRange
ignore:
  - modelValue.start
  - modelValue.end
external:
  - modelValue
props:
  modelValue:
    start: [9, 0, 0]
    end: [17, 30, 0]
---
::

Use the `default-value` prop to set the initial value when you do not need to control its state.

::component-code
---
cast:
  defaultValue: TimeRange
ignore:
  - defaultValue.start
  - defaultValue.end
external:
  - defaultValue
props:
  defaultValue:
    start: [9, 0, 0]
    end: [17, 30, 0]
---
::

::note
This component relies on the [`@internationalized/date`](https://react-spectrum.adobe.com/internationalized/date/index.html) package which provides objects and functions for representing and manipulating dates and times in a locale-aware manner. Format of time depends on the [`locale`](/docs/getting-started/integrations/i18n) installed in your application.
::

### Hour Cycle

Use the `hour-cycle` prop to change the hour cycle of the InputTimeRange. Defaults to `12`.

::component-code
---
cast:
  defaultValue: TimeRange
ignore:
  - hourCycle
  - defaultValue.start
  - defaultValue.end
external:
  - defaultValue
props:
  hourCycle: 24
  defaultValue:
    start: [9, 30, 0]
    end: [18, 0, 0]
---
::

### Granularity

Use the `granularity` prop to change the granularity of the InputTimeRange.

::component-code
---
cast:
  defaultValue: TimeRange
ignore:
  - granularity
  - defaultValue.start
  - defaultValue.end
external:
  - defaultValue
props:
  granularity: second
  defaultValue:
    start: [9, 30, 45]
    end: [17, 15, 30]
---
::

### Color

Use the `color` prop to change the color of the InputTimeRange.

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

Use the `variant` prop to change the variant of the InputTimeRange.

::component-code
---
props:
  variant: subtle
---
::

### Size

Use the `size` prop to change the size of the InputTimeRange.

::component-code
---
props:
  size: xl
---
::

### Icon

Use the `icon` prop to show an [Icon](/docs/components/icon) inside the InputTimeRange.

::component-code
---
props:
  icon: 'i-lucide-clock'
---
::

::note
Use the `leading` and `trailing` props to set the icon position or the `leading-icon` and `trailing-icon` props to set a different icon for each position.
::

### Separator Icon

Use the `separator-icon` prop to change the icon of the range separator.

::component-code
---
props:
  separatorIcon: 'i-lucide-arrow-right'
---
::

### Avatar

Use the `avatar` prop to show an [Avatar](/docs/components/avatar) inside the InputTimeRange.

::component-code
---
prettier: true
props:
  avatar:
    src: 'https://github.com/vuejs.png'
  size: md
  variant: outline
---
::

### Disabled

Use the `disabled` prop to disable the InputTimeRange.

::component-code
---
props:
  disabled: true
---
::

## Examples

### Within a FormField

You can use the InputTimeRange within a [FormField](/docs/components/form-field) component to display a label, help text, required indicator, etc.

::component-example
---
name: 'input-time-range-form-field-example'
---
::

### With min/max times

Use the `min-value` and `max-value` props to limit the selectable times.

::component-example
---
name: 'input-time-range-min-max-example'
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
