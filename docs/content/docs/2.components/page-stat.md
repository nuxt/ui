---
title: PageStat
description: 'A pre-styled card component to display a statistic with an optional progress bar or sparkline.'
category: page
badge:
  label: Soon
  class: align-text-top
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/PageStat.vue
---

## Usage

Use the PageStat component to display a key metric with an icon, title, value and optional trend indicator.

::component-code
---
prettier: true
hide:
  - class
props:
  icon: 'i-lucide-users'
  title: 'Total Users'
  value: '12,345'
  trend: 12.5
  class: 'max-w-xl'
---
::

::tip
Use the [PageGrid](/docs/components/page-grid), [PageColumns](/docs/components/page-columns) or [PageList](/docs/components/page-list) components to display multiple PageStat in a layout.
::

### Icon

Use the `icon` prop to set the icon displayed next to the title.

::component-code
---
prettier: true
hide:
  - class
ignore:
  - title
  - value
props:
  icon: 'i-lucide-activity'
  title: 'Active Sessions'
  value: '1,234'
  class: 'max-w-xl'
---
::

### Title

Use the `title` prop to set the title of the stat.

::component-code
---
prettier: true
hide:
  - class
ignore:
  - icon
  - value
props:
  icon: 'i-lucide-dollar-sign'
  title: 'Revenue'
  value: '$125,430'
  class: 'max-w-xl'
---
::

### Value

Use the `value` prop to set the main value displayed. It accepts both a string and a number.

::component-code
---
prettier: true
hide:
  - class
ignore:
  - icon
  - title
props:
  icon: 'i-lucide-dollar-sign'
  title: 'Revenue'
  value: '$125,430'
  class: 'max-w-xl'
---
::

### Trend

Use the `trend` prop to display a percentage trend indicator. The `trend-direction` is inferred from the sign of the value (positive = up/green, negative = down/red).

::component-code
---
prettier: true
hide:
  - class
ignore:
  - icon
  - title
  - value
props:
  icon: 'i-lucide-shopping-cart'
  title: 'Sales'
  value: '$45,231'
  trend: -8.2
  class: 'max-w-xl'
---
::

::tip
You can explicitly set the `trend-direction` prop to override the automatic calculation.
::

::component-code
---
prettier: true
hide:
  - class
ignore:
  - icon
  - title
  - value
props:
  icon: 'i-lucide-dollar-sign'
  title: 'Expenses'
  value: '$12,500'
  trend: 15.3
  trendDirection: down
  class: 'max-w-xl'
---
::

### Progress

Use the `current` and `max` props to display a progress bar under the stat. The `show-label` prop controls whether to show the `current / max` label.

::component-code
---
external:
  - current
props:
  icon: 'i-lucide-dollar-sign'
  title: 'Monthly Budget'
  current: 8000
  max: 10000
  class: 'max-w-xl'
---
::

::tip
Use the `progress-color` prop to change the color of the progress bar independently from the `color` prop.
::

### Sparkline

Use the `data` prop to display a sparkline chart. The `show-area` prop fills the area under the line.

::component-code
---
ignore:
  - data
hide:
  - class
props:
  icon: 'i-lucide-trending-up'
  title: 'Sales Trend'
  value: '$45,231'
  data: [20, 35, 30, 45, 50, 40, 55, 60, 55, 65, 70, 75]
  showArea: true
  class: 'max-w-xl'
---
::

### Color

Use the `color` prop to change the color of the icon, trend indicator and sparkline.

::component-code
---
prettier: true
hide:
  - class
ignore:
  - icon
  - title
  - value
  - trend
props:
  color: success
  icon: 'i-lucide-check-circle'
  title: 'Completed'
  value: '98.5%'
  trend: 2.1
  class: 'max-w-xl'
---
::

### Size

Use the `size` prop to change the size of the stat.

::component-code
---
prettier: true
hide:
  - class
ignore:
  - icon
  - title
  - value
  - trend
props:
  size: lg
  icon: 'i-lucide-users'
  title: 'Users'
  value: '1,234'
  trend: 5.2
  class: 'max-w-xl'
---
::

### Variant

Use the `variant` prop to change the visual style of the stat.

::component-code
---
prettier: true
hide:
  - class
ignore:
  - icon
  - title
  - value
  - trend
props:
  variant: soft
  icon: 'i-lucide-users'
  title: 'Users'
  value: '1,234'
  trend: 5.2
  class: 'max-w-xl'
---
::

## API

### Props

:component-props

### Slots

:component-slots

## Theme

:component-theme

## Changelog

:component-changelog
