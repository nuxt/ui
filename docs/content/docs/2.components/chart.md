---
title: Chart
description: A chart to visualize data as lines, areas, bars or a donut.
category: data
keywords:
  - graph
  - line chart
  - bar chart
  - area chart
  - donut chart
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

The Chart component is built on top of [TanStack Charts](https://tanstack.com/charts/latest) and renders an SVG on the server.

TanStack Charts is an optional peer dependency, install it first:

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

Use the `data` prop to pass an array of objects, the `index` prop to set the key used for the x axis and the `categories` prop to set the series, each with the `key` of its values and an optional `label` and `color`.

::component-code
---
prettier: true
collapse: true
ignore:
  - data
  - index
  - categories
external:
  - data
externalTypes:
  - ChartData[]
hide:
  - aspectRatio
  - initialWidth
props:
  aspectRatio: 2.77
  initialWidth: 832
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
    - key: desktop
      label: Desktop
    - key: mobile
      label: Mobile
---
::

::note
You can also pass categories as strings, like `['desktop', 'mobile']`, when they read well as names.
::

::tip
Use the `aria-label` prop to name the chart for assistive technologies.
::

### Type

Use the `type` prop to change the type of chart. Defaults to `line`.

::note
With `donut`, each row of `data` is a slice. The `index` sets its label and the first key of `categories` its value.
::

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
external:
  - data
externalTypes:
  - ChartData[]
hide:
  - aspectRatio
  - initialWidth
props:
  aspectRatio: 2.77
  initialWidth: 832
  type: donut
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
    - key: desktop
      label: Desktop
    - key: mobile
      label: Mobile
---
::

### Stacked

Use the `stacked` prop to stack the series on top of each other.

::warning
This prop only works when `type` is `area` or `bar`.
::

::component-code
---
prettier: true
collapse: true
ignore:
  - data
  - index
  - categories
external:
  - data
externalTypes:
  - ChartData[]
hide:
  - aspectRatio
  - initialWidth
props:
  aspectRatio: 2.77
  initialWidth: 832
  type: bar
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
    - key: desktop
      label: Desktop
    - key: mobile
      label: Mobile
---
::

### Curve

Use the `curve` prop to change the shape of the line between values. Defaults to `linear`.

::warning
This prop only works when `type` is `line` or `area`.
::

::component-code
---
prettier: true
collapse: true
ignore:
  - data
  - index
  - categories
items:
  curve:
    - linear
    - monotone
    - step
external:
  - data
externalTypes:
  - ChartData[]
hide:
  - aspectRatio
  - initialWidth
props:
  aspectRatio: 2.77
  initialWidth: 832
  type: line
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
    - key: desktop
      label: Desktop
    - key: mobile
      label: Mobile
---
::

### Colors

Use the `colors` prop to set the color of each series with theme colors or any CSS color.

::note
The colors follow the `categories` order, or the `data` order with `donut`. A `color` set on a category takes precedence. When there are more series than colors, they repeat as lighter tints.
::

::component-code
---
prettier: true
collapse: true
ignore:
  - data
  - index
  - categories
  - colors
external:
  - data
externalTypes:
  - ChartData[]
hide:
  - aspectRatio
  - initialWidth
props:
  aspectRatio: 2.77
  initialWidth: 832
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
    - key: desktop
      label: Desktop
    - key: mobile
      label: Mobile
---
::

::tip{to="/docs/getting-started/theme/css-variables#chart"}
The colors default to the `--ui-chart-*` CSS variables, which you can customize in your `main.css` file.
::

### Points

Use the `points` prop to draw a dot at each value.

::warning
This prop only works when `type` is `line`.
::

::component-code
---
prettier: true
collapse: true
ignore:
  - data
  - index
  - categories
external:
  - data
externalTypes:
  - ChartData[]
hide:
  - aspectRatio
  - initialWidth
props:
  aspectRatio: 2.77
  initialWidth: 832
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
    - key: desktop
      label: Desktop
    - key: mobile
      label: Mobile
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
external:
  - data
externalTypes:
  - ChartData[]
hide:
  - aspectRatio
  - initialWidth
props:
  aspectRatio: 2.77
  initialWidth: 832
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
    - key: desktop
      label: Desktop
    - key: mobile
      label: Mobile
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
external:
  - data
externalTypes:
  - ChartData[]
hide:
  - aspectRatio
  - initialWidth
props:
  aspectRatio: 2.77
  initialWidth: 832
  xAxis: false
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
    - key: desktop
      label: Desktop
    - key: mobile
      label: Mobile
---
::

### Axis labels

Use the `x-label` and `y-label` props to display a title along each axis.

::component-code
---
prettier: true
collapse: true
ignore:
  - data
  - index
  - categories
external:
  - data
externalTypes:
  - ChartData[]
hide:
  - aspectRatio
  - initialWidth
props:
  aspectRatio: 2.77
  initialWidth: 832
  xLabel: Month
  yLabel: Visitors
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
    - key: desktop
      label: Desktop
    - key: mobile
      label: Mobile
---
::

### Legend

Use the `legend` prop to toggle the legend.

::note
The legend is displayed by default when there is more than one category, or more than one slice with `donut`.
::

::component-code
---
prettier: true
collapse: true
ignore:
  - data
  - index
  - categories
external:
  - data
externalTypes:
  - ChartData[]
hide:
  - aspectRatio
  - initialWidth
props:
  aspectRatio: 2.77
  initialWidth: 832
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
    - key: desktop
      label: Desktop
    - key: mobile
      label: Mobile
---
::

### Tooltip

Use the `tooltip` prop to customize or hide the [Tooltip](/docs/components/tooltip) displayed on the focused values. Defaults to `true`.

::tip{to="#with-tooltip-slot"}
You can also use the `#tooltip` slot to replace its content.
::

::component-code
---
prettier: true
collapse: true
ignore:
  - data
  - index
  - categories
external:
  - data
externalTypes:
  - ChartData[]
items:
  tooltip:
    - true
    - false
hide:
  - aspectRatio
  - initialWidth
props:
  aspectRatio: 2.77
  initialWidth: 832
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
    - key: desktop
      label: Desktop
    - key: mobile
      label: Mobile
---
::

### Thickness

Use the `thickness` prop to set the width of the ring in pixels. Defaults to `24`.

::warning
This prop only works when `type` is `donut`.
::

::component-code
---
prettier: true
collapse: true
ignore:
  - data
  - index
  - categories
external:
  - data
externalTypes:
  - ChartData[]
hide:
  - aspectRatio
  - initialWidth
props:
  aspectRatio: 2.77
  initialWidth: 832
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
    - key: desktop
      label: Desktop
    - key: mobile
      label: Mobile
---
::

### Size

Use the `height` prop to set the height of the chart in pixels. Defaults to `300`.

::tip
The chart follows the width of its container. Use the `aspect-ratio` prop to derive the height from the width, or the `width` prop to set a fixed width.
::

::note
With a fixed height, the chart fades in once its container is measured. With `aspect-ratio`, the chart rendered on the server is displayed right away.
::

::component-code
---
prettier: true
collapse: true
ignore:
  - data
  - index
  - categories
external:
  - data
externalTypes:
  - ChartData[]
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
    - key: desktop
      label: Desktop
    - key: mobile
      label: Mobile
---
::

## Examples

### With formatted values

Use the `format` prop to format the values on the y axis and in the tooltip.

::component-example
---
collapse: true
name: 'chart-format-example'
---
::

### With a chart definition

Use the `definition` prop to pass a complete [TanStack Charts definition](https://tanstack.com/charts/latest/docs/concepts/chart-definitions) when the other props are not enough.

::note{to="https://tanstack.com/charts/latest" target="_blank"}
A definition from the TanStack Charts examples renders as is, with the tooltip and the responsive sizing applied.
::

::component-example
---
collapse: true
name: 'chart-definition-example'
---
::

::tip{to="/docs/getting-started/theme/css-variables#chart"}
Series without an explicit color use the `--ui-chart-*` CSS variables. Colors set in the definition are kept.
::

::caution
When the definition brings its own `tooltip`, it is displayed in place of the `tooltip` prop.
::

::warning
Examples importing `d3-*` packages need them installed in your project.
::

### With center slot

Use the `#center` slot to display content in the middle of a `donut` chart.

::component-example
---
collapse: true
name: 'chart-center-slot-example'
---
::

### With tooltip slot

Use the `#tooltip` slot to replace the tooltip content. It receives the `title`, the `rows` with their `label`, `value` and `color`, and the focused `points`.

::component-example
---
collapse: true
name: 'chart-tooltip-slot-example'
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
