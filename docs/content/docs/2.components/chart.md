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

Install the `@tanstack/charts` package to use it:

::code-group{sync="pm"}

```bash [pnpm]
pnpm add @tanstack/charts
```

```bash [yarn]
yarn add @tanstack/charts
```

```bash [npm]
npm install @tanstack/charts
```

```bash [bun]
bun add @tanstack/charts
```

::

### Data

Use the `data` prop to pass an array of objects, the `index` prop to set the key used for the x axis and the `categories` prop to set the keys plotted as series.

::component-code
---
prettier: true
collapse: true
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

Use the `type` prop to change the type of chart, `line`, `area`, `bar` or `donut`. Defaults to `line`.

With `donut`, each row of `data` is a slice: `index` sets its label and the first key of `categories` its value.

::component-code
---
prettier: true
collapse: true
ignore:
  - data
  - index
  - categories
items:
  type:
    - line
    - area
    - bar
    - donut
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
collapse: true
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
collapse: true
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

Use the `colors` prop to set the color of each series, in `categories` order. It accepts theme colors or any CSS color. Defaults to the [`--ui-chart-*`](/docs/getting-started/theme/css-variables#chart) CSS variables. When there are more series than colors, the colors repeat as lighter tints.

::component-code
---
prettier: true
collapse: true
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
collapse: true
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
collapse: true
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
collapse: true
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
collapse: true
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

### Tooltip

A [Tooltip](/docs/components/tooltip) shows the focused values on hover and keyboard navigation. Use the `tooltip` prop to customize it with any of its props, or set it to `false` to hide it.

::component-code
---
prettier: true
collapse: true
ignore:
  - data
  - index
  - categories
props:
  tooltip: false
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

### Thickness

Use the `thickness` prop to set the width of the ring in pixels. Only applies to the `donut` type. Defaults to `24`.

::component-code
---
prettier: true
collapse: true
ignore:
  - data
  - index
  - categories
props:
  type: donut
  thickness: 12
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
collapse: true
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

### With center content

Use the `#center` slot to display content in the middle of a `donut` chart.

::component-example
---
collapse: true
name: 'chart-donut-example'
---
::

### With formatted values

Use the `format` prop to format the values on the y axis and in the tooltip.

::component-example
---
collapse: true
name: 'chart-format-example'
---
::

### With custom tooltip

Use the `#tooltip` slot to replace the tooltip content. It receives the `title`, the `rows` with their `label`, `value` and `color`, and the focused `points`.

::component-example
---
collapse: true
name: 'chart-tooltip-slot-example'
---
::

### With a chart definition

Use the `definition` prop to pass a complete [TanStack Charts definition](https://tanstack.com/charts/latest/docs/concepts/chart-definitions) when the other props are not enough. A definition from the [TanStack Charts](https://tanstack.com/charts/latest) examples renders as is, with the theme colors, the tooltip and the responsive sizing applied.

Use the `height`, `aspect-ratio` and `width` props to size it, and the `select`, `focus-change` and `focus-group-change` events to react to the focused points.

::component-example
---
collapse: true
name: 'chart-definition-example'
---
::

::note
When the definition brings its own `tooltip`, it is displayed in place of the `tooltip` prop. Examples importing `d3-*` packages need them installed in your project.
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
