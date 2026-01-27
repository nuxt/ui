---
title: InputDate
description: 'An input component for date selection.'
category: form
links:
  - label: DateField
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/date-field
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/InputDate.vue
---

## Usage

Use the `v-model` directive to control the selected date.

::component-code
---
cast:
  modelValue: DateValue
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: [2022, 2, 3]
---
::

Use the `default-value` prop to set the initial value when you do not need to control its state.

::component-code
---
cast:
  defaultValue: DateValue
ignore:
  - defaultValue
external:
  - defaultValue
props:
  defaultValue: [2022, 2, 6]
---
::

::framework-only
#nuxt
:::note{to="/docs/getting-started/integrations/i18n/nuxt#locale"}
This component uses the `@internationalized/date` package for locale-aware formatting. The date format is determined by the `locale` prop of the App component.
:::

#vue
:::note{to="/docs/getting-started/integrations/i18n/vue#locale"}
This component uses the `@internationalized/date` package for locale-aware formatting. The date format is determined by the `locale` prop of the App component.
:::
::

### Range

Use the `range` prop to select a range of dates.

::component-code
---
prettier: true
cast:
  modelValue: DateRange
ignore:
  - range
  - modelValue.start
  - modelValue.end
external:
  - modelValue
props:
  range: true
  modelValue:
    start: [2022, 2, 3]
    end: [2022, 2, 20]
---
::

### Color

Use the `color` prop to change the color of the InputDate.

::component-code
---
props:
  color: neutral
  highlight: true
---
::

### Variant

Use the `variant` prop to change the variant of the InputDate.

::component-code
---
props:
  variant: subtle
---
::

### Size

Use the `size` prop to change the size of the InputDate.

::component-code
---
props:
  size: xl
---
::

### Separator Icon

Use the `separator-icon` prop to change the icon of the range separator.

::component-code
---
props:
  range: true
  separatorIcon: 'i-lucide-arrow-right'
---
::

### Disabled

Use the `disabled` prop to disable the InputDate.

::component-code
---
props:
  disabled: true
---
::

## Examples

### With unavailable dates

Use the `is-date-unavailable` prop with a function to mark specific dates as unavailable.

::component-example
---
name: 'input-date-unavailable-dates-example'
---
::

### With min/max dates

Use the `min-value` and `max-value` props to limit the dates.

::component-example
---
name: 'input-date-min-max-dates-example'
---
::

### As a DatePicker

Use a [Calendar](/docs/components/calendar) and a [Popover](/docs/components/popover) component to create a date picker.

::component-example
---
name: 'input-date-date-picker-example'
---
::

### As a DateRangePicker

Use a [Calendar](/docs/components/calendar) and a [Popover](/docs/components/popover) component to create a date range picker.

::component-example
---
name: 'input-date-date-range-picker-example'
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
