---
title: 'Meter'
description: Display a gauge meter that fills or depletes.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/elements/Meter.vue
---

## Usage

Use the `value` prop from `0` to `100` to set a value for the meter bar.

::component-card
---
props:
  value: 25
---
::

::callout{icon="i-heroicons-light-bulb"}
Check out the [Range](/components/range) component for inputs
::

### Min & Max

By default, `min` is `0` and `max` is `100`. You can change either of these using their respective props, even for negative numbers.

::component-card
---
props:
  value: -25
  min: -50
  max: 50
---
::

### Indicator

You may show a percentage indicator on top of the meter using the `indicator` prop.

::component-card
---
props:
  value: 35
  indicator: true
---
::

### Label

Add a label below the meter using the `label` prop.

::component-card
---
baseProps:
  value: 86
props:
  label: Disk usage
---
::

### Icon

You may also add an icon to the start label using the `icon` prop.

::component-card
---
baseProps:
  value: 86
  label: Disk usage
props:
  icon: i-heroicons-server
excludedProps:
  - icon
---
::

### Size

Change the size of the meter bar using the `size` prop.

::component-card
---
baseProps:
  value: 75.4
props:
  size: 'md'
  indicator: true
  label: CPU Load
---
::

### Style

The `color` prop changes the visual style of the meter bar. The `color` can be any color from the `ui.colors` object.

::component-card
---
baseProps:
  value: 80
  indicator: true
  label: Memory usage
props:
  color: 'primary'
---
::

## Group

To group multiple meters into a group, adding all values, use the `MeterGroup` component.

- To change the overall minimum and maximum value, pass the `min` and `max` props respectively.
- To change size of all meters, use the `size` prop.
- To show an indicator for the overall amount, set the `indicator` prop or slot.
- To change the color of each meter, use the `color` prop.
- To show a label for each meter, use the `label` prop on each meter.
- To change the icon for each meter, use the `icon` prop.

::component-card{slug="UMeterGroup"}
---
baseProps:
  icon: i-heroicons-minus
props:
  min: 0
  max: 128
  size: 'md'
  indicator: true
code: |
  <UMeter :value="24" color="gray" label="System" />
    <UMeter :value="8" color="red" label="Apps" />
    <UMeter :value="12" color="yellow" label="Documents" />
    <UMeter :value="42" color="green" label="Multimedia" />
    <!-- Total: 86 -->
---

#default
:u-meter{:value="24" color="gray" label="System"}
:u-meter{:value="8" color="red" label="Apps"}
:u-meter{:value="12" color="yellow" label="Documents"}
:u-meter{:value="42" color="green" label="Multimedia"}
::

::callout{icon="i-heroicons-exclamation-triangle"}
When the Meters are grouped, their individual indicators and label slots are stripped away.
::

A Meter group can also be used with an [indicator slot](#indicator-1), and even individual meter icons.

:component-example{component="meter-group-example-slots"}

## Slots

### `indicator`

Use the `#indicator` slot to change the indicator shown at the top of the bar. It receives the current meter percent.

:component-example{component="meter-slot-indicator-example"}

### `label`

The `label` slot can be used to change how the label below the meter bar is shown. It receives the current meter percent.

:component-example{component="meter-slot-label-example"}

## Props

::tabs
  :component-props{label="Meter"}
  :component-props{label="MeterGroup" slug="UMeterGroup"}
::

## Config

::tabs
  :component-preset{label="Meter"}
  :component-preset{label="MeterGroup" slug="MeterGroup"}
::
