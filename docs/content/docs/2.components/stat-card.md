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
  class: 'w-full'
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
  class: 'w-full'
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
  class: 'w-full'
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
  class: 'w-full'
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
  class: 'w-full'
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
  class: 'w-full'
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
  class: 'w-full'
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
  class: 'w-full'
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
  class: 'w-full'
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
  class: 'w-full'
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
  class: 'w-full'
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
  class: 'w-full'
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
  class: 'w-full'
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
  class: 'w-full'
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
  class: 'w-full'
slots:
  trend: |
    <span class="text-xs text-muted">vs last month</span>
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
  class: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full'
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

