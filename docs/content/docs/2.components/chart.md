---
title: Chart
description: A chart to visualize data as lines, areas or bars.
category: data
keywords:
  - graph
  - line chart
  - bar chart
  - area chart
links:
  - label: TanStack Charts
    icon: i-simple-icons-tanstack
    to: https://tanstack.com/charts/latest
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Chart.vue
navigation.badge: Soon
---

## Usage

The Chart component is built on top of [TanStack Charts](https://tanstack.com/charts/latest). It renders an SVG on the server and follows your theme and color mode.

::warning
TanStack Charts is still in alpha, its API may change between minor releases.
::

### Data

Use the `data` prop to pass an array of objects, the `index` prop to set the key used for the x axis and the `categories` prop to set the keys plotted as series.

::component-code
---
prettier: true
ignore:
  - data
  - index
  - categories
props:
  data:
    - month: January
      desktop: 186
      mobile: 80
    - month: February
      desktop: 305
      mobile: 200
    - month: March
      desktop: 237
      mobile: 120
    - month: April
      desktop: 73
      mobile: 190
    - month: May
      desktop: 209
      mobile: 130
    - month: June
      desktop: 214
      mobile: 140
  index: month
  categories:
    - desktop
    - mobile
---
::

### Type

Use the `type` prop to change the type of chart. Defaults to `line`.

::component-code
---
prettier: true
ignore:
  - data
  - index
  - categories
props:
  type: bar
  data:
    - month: January
      desktop: 186
      mobile: 80
    - month: February
      desktop: 305
      mobile: 200
    - month: March
      desktop: 237
      mobile: 120
    - month: April
      desktop: 73
      mobile: 190
    - month: May
      desktop: 209
      mobile: 130
    - month: June
      desktop: 214
      mobile: 140
  index: month
  categories:
    - desktop
    - mobile
---
::

### Stacked

Use the `stacked` prop to stack the series on top of each other. Only applies to `area` and `bar` types.

::component-code
---
prettier: true
ignore:
  - data
  - index
  - categories
props:
  type: area
  stacked: true
  data:
    - month: January
      desktop: 186
      mobile: 80
    - month: February
      desktop: 305
      mobile: 200
    - month: March
      desktop: 237
      mobile: 120
    - month: April
      desktop: 73
      mobile: 190
    - month: May
      desktop: 209
      mobile: 130
    - month: June
      desktop: 214
      mobile: 140
  index: month
  categories:
    - desktop
    - mobile
---
::

### Curve

Use the `curve` prop to change the shape of the line between values, `linear`, `monotone` or `step`. Only applies to `line` and `area` types. Defaults to `linear`.

::component-code
---
prettier: true
ignore:
  - data
  - index
  - categories
props:
  curve: monotone
  data:
    - month: January
      desktop: 186
      mobile: 80
    - month: February
      desktop: 305
      mobile: 200
    - month: March
      desktop: 237
      mobile: 120
    - month: April
      desktop: 73
      mobile: 190
    - month: May
      desktop: 209
      mobile: 130
    - month: June
      desktop: 214
      mobile: 140
  index: month
  categories:
    - desktop
    - mobile
---
::

### Colors

Use the `colors` prop to set the color of each series, in `categories` order. It accepts theme colors or any CSS color. Defaults to `['primary', 'secondary', 'info', 'success', 'warning', 'error']`.

::component-code
---
prettier: true
ignore:
  - data
  - index
  - categories
props:
  colors:
    - success
    - '#8b5cf6'
  data:
    - month: January
      desktop: 186
      mobile: 80
    - month: February
      desktop: 305
      mobile: 200
    - month: March
      desktop: 237
      mobile: 120
    - month: April
      desktop: 73
      mobile: 190
    - month: May
      desktop: 209
      mobile: 130
    - month: June
      desktop: 214
      mobile: 140
  index: month
  categories:
    - desktop
    - mobile
---
::

### Points

Use the `points` prop to draw a dot at each value. Only applies to the `line` type.

::component-code
---
prettier: true
ignore:
  - data
  - index
  - categories
props:
  points: true
  data:
    - month: January
      desktop: 186
      mobile: 80
    - month: February
      desktop: 305
      mobile: 200
    - month: March
      desktop: 237
      mobile: 120
    - month: April
      desktop: 73
      mobile: 190
    - month: May
      desktop: 209
      mobile: 130
    - month: June
      desktop: 214
      mobile: 140
  index: month
  categories:
    - desktop
    - mobile
---
::

### Grid

Use the `grid` prop to toggle the horizontal grid lines. Defaults to `true`.

::component-code
---
prettier: true
ignore:
  - data
  - index
  - categories
props:
  grid: false
  data:
    - month: January
      desktop: 186
      mobile: 80
    - month: February
      desktop: 305
      mobile: 200
    - month: March
      desktop: 237
      mobile: 120
    - month: April
      desktop: 73
      mobile: 190
    - month: May
      desktop: 209
      mobile: 130
    - month: June
      desktop: 214
      mobile: 140
  index: month
  categories:
    - desktop
    - mobile
---
::

### Axis

Use the `x-axis` and `y-axis` props to toggle each axis. Both default to `true`.

::component-code
---
prettier: true
ignore:
  - data
  - index
  - categories
props:
  yAxis: false
  data:
    - month: January
      desktop: 186
      mobile: 80
    - month: February
      desktop: 305
      mobile: 200
    - month: March
      desktop: 237
      mobile: 120
    - month: April
      desktop: 73
      mobile: 190
    - month: May
      desktop: 209
      mobile: 130
    - month: June
      desktop: 214
      mobile: 140
  index: month
  categories:
    - desktop
    - mobile
---
::

### Legend

Use the `legend` prop to toggle the legend. Defaults to `true` when there is more than one category.

::component-code
---
prettier: true
ignore:
  - data
  - index
  - categories
props:
  legend: false
  data:
    - month: January
      desktop: 186
      mobile: 80
    - month: February
      desktop: 305
      mobile: 200
    - month: March
      desktop: 237
      mobile: 120
    - month: April
      desktop: 73
      mobile: 190
    - month: May
      desktop: 209
      mobile: 130
    - month: June
      desktop: 214
      mobile: 140
  index: month
  categories:
    - desktop
    - mobile
---
::

### Height

Use the `height` prop to set the height of the chart in pixels. Defaults to `300`.

::component-code
---
prettier: true
ignore:
  - data
  - index
  - categories
props:
  height: 200
  data:
    - month: January
      desktop: 186
      mobile: 80
    - month: February
      desktop: 305
      mobile: 200
    - month: March
      desktop: 237
      mobile: 120
    - month: April
      desktop: 73
      mobile: 190
    - month: May
      desktop: 209
      mobile: 130
    - month: June
      desktop: 214
      mobile: 140
  index: month
  categories:
    - desktop
    - mobile
---
::

## Examples

### With custom tooltip

Use the `#tooltip` slot to replace the tooltip content. It receives the hovered `points`, each with the `datum` it comes from and its `color`.

::component-example
---
name: 'chart-tooltip-slot-example'
---
::

### With a chart definition

Use the `definition` prop to pass a complete [TanStack Charts definition](https://tanstack.com/charts/latest/docs/concepts/chart-definitions) when the other props are not enough. The component still applies the theme and keeps the chart responsive.

::component-example
---
name: 'chart-definition-example'
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
