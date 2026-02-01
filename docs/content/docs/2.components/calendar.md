---
title: Calendar
description: A calendar component for selecting single dates, multiple dates or date ranges.
category: element
links:
  - label: Calendar
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/calendar
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Calendar.vue
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

### Multiple

Use the `multiple` prop to allow multiple selections.

::component-code
---
prettier: true
cast:
  modelValue: DateValue[]
ignore:
  - multiple
  - modelValue
external:
  - modelValue
props:
  multiple: true
  modelValue: [[2022, 2, 4], [2022, 2, 6], [2022, 2, 8]]
---
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

Use the `color` prop to change the color of the calendar.

::component-code
---
props:
  color: neutral
---
::

### Variant

Use the `variant` prop to change the variant of the calendar.

::component-code
---
cast:
  defaultValue: DateRange
hide:
  - range
  - defaultValue
  - defaultValue.start
  - defaultValue.end
props:
  variant: subtle
  range: true
  defaultValue:
    start: [2022, 2, 3]
    end: [2022, 2, 20]
---
::

### Size

Use the `size` prop to change the size of the calendar.

::component-code
---
props:
  size: xl
---
::

### Disabled

Use the `disabled` prop to disable the calendar.

::component-code
---
props:
  disabled: true
---
::

### Number Of Months

Use the `numberOfMonths` prop to change the number of months in the calendar.

::component-code
---
props:
  numberOfMonths: 3
---
::

### Month Controls

Use the `month-controls` prop to show the month controls. Defaults to `true`.

::component-code
---
props:
  monthControls: false
---
::

### Year Controls

Use the `year-controls` prop to show the year controls. Defaults to `true`.

::component-code
---
props:
  yearControls: false
---
::

### Fixed Weeks

Use the `fixed-weeks` prop to display the calendar with fixed weeks.

::component-code
---
props:
  fixedWeeks: false
---
::

### Week Numbers :badge{label="4.4+" class="align-text-top"}

Use the `week-numbers` prop to display week numbers in the calendar.

::component-code
---
props:
  weekNumbers: true
  fixedWeeks: true
---
::

## Examples

### With chip events

Use the [Chip](/docs/components/chip) component to add events to specific days.

::component-example
---
name: 'calendar-events-example'
---
::

### With disabled dates

Use the `is-date-disabled` prop with a function to mark specific dates as disabled.

::component-example
---
name: 'calendar-disabled-dates-example'
---
::

### With unavailable dates

Use the `is-date-unavailable` prop with a function to mark specific dates as unavailable.

::component-example
---
name: 'calendar-unavailable-dates-example'
---
::

### With min/max dates

Use the `min-value` and `max-value` props to limit the dates.

::component-example
---
name: 'calendar-min-max-dates-example'
---
::

### With other calendar systems

You can use other calenders from `@internationalized/date` to implement a different calendar system.

::component-example
---
name: 'calendar-other-system-example'
---
::

::note{to="https://react-spectrum.adobe.com/internationalized/date/Calendar.html#implementations"}
You can check all the available calendars on `@internationalized/date` docs.
::

### With external controls

You can control the calendar with external controls by manipulating the date passed in the `v-model`.

::component-example
---
name: 'calendar-external-controls-example'
---
::

### As a DatePicker

Use a [Button](/docs/components/button) and a [Popover](/docs/components/popover) component to create a date picker.

::component-example
---
name: 'calendar-date-picker-example'
---
::

### As a DateRangePicker

Use a [Button](/docs/components/button) and a [Popover](/docs/components/popover) component to create a date range picker.

::component-example
---
name: 'calendar-date-range-picker-example'
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
