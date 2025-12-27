---
description: A component to display key statistics and metrics in a dashboard.
category: element
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/StatCard.vue
---

## Usage

Use the StatCard component to display key metrics with an icon, title, value, and optional trend indicator.

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
  trendDirection: up
  class: 'max-w-xl'
---
::

### With Trend Down

Use the `trend-direction` prop set to `down` to display a negative trend.

::component-code
---
prettier: true
hide:
  - class
props:
  icon: 'i-lucide-shopping-cart'
  title: 'Sales'
  value: '$45,231'
  trend: 8.2
  trendDirection: down
  class: 'max-w-xl'
---
::

### Without Trend

You can omit the `trend` prop to hide the trend indicator.

::component-code
---
prettier: true
hide:
  - class
props:
  icon: 'i-lucide-dollar-sign'
  title: 'Revenue'
  value: '$125,430'
  class: 'max-w-xl'
---
::

### Icon

Use the `icon` prop to set the icon displayed in the card.

::component-code
---
prettier: true
hide:
  - class
props:
  icon: 'i-lucide-activity'
  title: 'Active Sessions'
  value: '1,234'
  trend: 15.3
  class: 'max-w-xl'
---
::

### Color

Use the `color` prop to change the color of the icon and trend indicator.

::component-code
---
prettier: true
hide:
  - class
props:
  color: success
  icon: 'i-lucide-check-circle'
  title: 'Completed'
  value: '98.5%'
  trend: 2.1
  class: 'max-w-xl'
---
::

::component-code
---
prettier: true
hide:
  - class
props:
  color: warning
  icon: 'i-lucide-alert-triangle'
  title: 'Pending'
  value: '23'
  trend: 5.4
  class: 'max-w-xl'
---
::

::component-code
---
prettier: true
hide:
  - class
props:
  color: error
  icon: 'i-lucide-x-circle'
  title: 'Failed'
  value: '12'
  trend: 3.2
  trendDirection: down
  class: 'max-w-xl'
---
::

### Progress Bar

Use the `current` and `max` props to display a progress bar. The `show-label` prop controls whether to show the "current / max" label.

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

Without label:

::component-code
---
external:
  - current
props:
  icon: 'i-lucide-hard-drive'
  title: 'Storage Used'
  current: 65
  max: 100
  showLabel: false
  class: 'max-w-xl'
---
::

With trend:

::component-code
---
external:
  - current
props:
  icon: 'i-lucide-target'
  title: 'Sales Target'
  current: 7500
  max: 10000
  trend: 12.5
  trendDirection: up
  class: 'max-w-xl'
---
::

### Sparkline Chart

Use the `data` prop to display a sparkline chart. The `show-area` prop controls whether to show the area under the line.

::component-code
---
external:
  - data
props:
  icon: 'i-lucide-trending-up'
  title: 'Sales Trend'
  value: '$45,231'
  data: [20, 35, 30, 45, 50, 40, 55, 60, 55, 65, 70, 75]
  class: 'max-w-xl'
---
::

With area:

::component-code
---
external:
  - data
props:
  icon: 'i-lucide-bar-chart'
  title: 'Growth'
  value: '24.5%'
  data: [15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70]
  showArea: true
  class: 'max-w-xl'
---
::

With trend:

::component-code
---
external:
  - data
props:
  icon: 'i-lucide-line-chart'
  title: 'Performance'
  value: '98.5%'
  data: [85, 90, 88, 92, 95, 97, 98]
  trend: 12.5
  trendDirection: up
  showArea: true
  class: 'max-w-xl'
---
::

### Size

Use the `size` prop to change the size of the stat card.

::component-code
---
prettier: true
hide:
  - class
props:
  size: xs
  icon: 'i-lucide-users'
  title: 'Users'
  value: '1,234'
  trend: 5.2
  class: 'max-w-xl'
---
::

::component-code
---
prettier: true
hide:
  - class
props:
  size: sm
  icon: 'i-lucide-users'
  title: 'Users'
  value: '1,234'
  trend: 5.2
  class: 'max-w-xl'
---
::

::component-code
---
prettier: true
hide:
  - class
props:
  size: md
  icon: 'i-lucide-users'
  title: 'Users'
  value: '1,234'
  trend: 5.2
  class: 'max-w-xl'
---
::

::component-code
---
prettier: true
hide:
  - class
props:
  size: lg
  icon: 'i-lucide-users'
  title: 'Users'
  value: '1,234'
  trend: 5.2
  class: 'max-w-xl'
---
::

::component-code
---
prettier: true
hide:
  - class
props:
  size: xl
  icon: 'i-lucide-users'
  title: 'Users'
  value: '1,234'
  trend: 5.2
  class: 'max-w-xl'
---
::

### Variant

Use the `variant` prop to change the visual style of the card.

::component-code
---
prettier: true
hide:
  - class
props:
  variant: solid
  icon: 'i-lucide-users'
  title: 'Users'
  value: '1,234'
  trend: 5.2
  class: 'max-w-xl'
---
::

::component-code
---
prettier: true
hide:
  - class
props:
  variant: soft
  icon: 'i-lucide-users'
  title: 'Users'
  value: '1,234'
  trend: 5.2
  class: 'max-w-xl'
---
::

## Examples

### Custom Slots

You can customize any part of the stat card using slots.

::component-code
---
prettier: true
hide:
  - class
props:
  icon: 'i-lucide-trending-up'
  title: 'Growth'
  value: '24.5%'
  class: 'max-w-xl'
slots:
  trend: |
    vs last month
---
::

### Dashboard Grid

StatCard components work great in a grid layout for dashboards.

::component-code
---
prettier: true
hide:
  - class
external:
  - class
props:
  class: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl'
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

