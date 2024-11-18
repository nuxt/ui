---
title: Calendar
description: A calendar to select a date.
links: 
  - label: Calendar
    icon: i-custom-radix-vue
    to: https://www.radix-vue.com/components/calendar.html
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Calendar.vue
navigation.badge: New
---

## Usage

Use the `v-model` directive to control the selected date.

::component-code
---
---
::

### Range

Use the `range` prop to select a range of dates.

::component-code
---
ignore:
  - range
props:
  range: true
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

Add a different color to each day.

::component-example
---
name: 'calendar-events-example'
---
::

### Disabled Dates

Mark the interval between `10` and `16` as disabled

::component-example
---
name: 'calendar-disabled-dates-example'
---
::

### Unavailable Dates

Mark the interval between `10` and `16` as unavailable

::component-example
---
name: 'calendar-unavailable-dates-example'
---
::

### Min/Max Dates

Limit the dates between `2023-09-01` and `2023-09-30`

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
