---
description: A calendar to select a date.
links: 
  - label: Calendar
    icon: i-custom-radix-vue
    to: https://www.radix-vue.com/components/calendar.html
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Calendar.vue
---

## Usage

Use the `v-model` directive to control the selected date.

::component-code
---
external:
  - modelValue
props:
  modelValue: new Date('2025-01-01')
---
::

### Range

Use the `range` prop to select a range of dates.

::component-code
---
ignore:
  - range
external:
  - modelValue
props:
  range: true
  modelValue: { start: new Date('2025-01-01'), end: new Date('2025-01-02') }
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

### Size

Use the `size` prop to change the size of the calendar.

::component-code
---
props:
  size: md
---
::

### Year Controls

Use the `year-controls` prop to show the year controls.

::component-code
---
props:
  yearControls: true
---
::

### Fixed Weeks

Use the `fixedWeeks` prop to display the calendar with fixed weeks.

::component-code
---
props:
  fixedWeeks: true
---
::

## Examples

### Events Calendar

::component-example
---
name: 'calendar-events-example'
---
::

### Disabled Dates

::component-example
---
name: 'calendar-disabled-dates-example'
---
::

### Unavailable Dates

::component-example
---
name: 'calendar-unavailable-dates-example'
---
::

### Min/Max Dates

::component-example
---
name: 'calendar-min-max-dates-example'
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
