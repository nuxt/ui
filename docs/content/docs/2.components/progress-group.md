---
title: ProgressGroup
description: A progress bar split into multiple segments that add up to a total.
category: element
navigation:
  badge: Soon
keywords:
  - meter
  - meter group
  - segmented progress
  - stacked bar
  - breakdown
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/ProgressGroup.vue
---

## Usage

Use the ProgressGroup component to display multiple values as segments of a single progress bar.

::component-code
---
collapse: true
ignore:
  - items
  - max
  - class
external:
  - items
externalTypes:
  - ProgressGroupItem[]
props:
  max: 128
  items:
    - label: 'System'
      value: 24
      color: 'neutral'
      icon: 'i-lucide-cog'
    - label: 'Apps'
      value: 8
      color: 'error'
      icon: 'i-lucide-app-window'
    - label: 'Documents'
      value: 12
      color: 'warning'
      icon: 'i-lucide-file'
    - label: 'Multimedia'
      value: 42
      color: 'success'
      icon: 'i-lucide-film'
  class: 'w-96'
---
::

### Items

Use the `items` prop as an array of objects with the following properties:

- `label?: string`{lang="ts-type"}
- `icon?: string`{lang="ts-type"}
- `value?: number`{lang="ts-type"}
- `color?: "primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral" | (string & {})`{lang="ts-type"}
- `slot?: string`{lang="ts-type"}
- `class?: any`{lang="ts-type"}
- `ui?: { segment?: ClassNameValue, indicator?: ClassNameValue, item?: ClassNameValue, itemLeadingIcon?: ClassNameValue, itemLeadingDot?: ClassNameValue, itemLabel?: ClassNameValue, itemTrailing?: ClassNameValue }`{lang="ts-type"}

::component-code
---
collapse: true
ignore:
  - items
  - class
external:
  - items
externalTypes:
  - ProgressGroupItem[]
props:
  items:
    - label: 'Compute'
      value: 42
      color: 'primary'
    - label: 'Storage'
      value: 18
      color: 'info'
    - label: 'Bandwidth'
      value: 9
      color: 'warning'
  class: 'w-96'
---
::

::note
Items without an `icon` get a colored dot in the list instead.
::

### Max

Use the `max` prop to set the value all items add up to. Defaults to `100`.

::component-code
---
collapse: true
ignore:
  - items
  - class
external:
  - items
externalTypes:
  - ProgressGroupItem[]
props:
  max: 512
  items:
    - label: 'Used'
      value: 128
      color: 'primary'
    - label: 'Reserved'
      value: 64
      color: 'neutral'
  class: 'w-96'
---
::

::note
Values are clamped between `0` and `max`, and segments that add up to more than `max` share the track proportionally.
::

### Status

Use the `status` prop to display the summed value above the bar.

::component-code
---
collapse: true
ignore:
  - items
  - class
external:
  - items
externalTypes:
  - ProgressGroupItem[]
props:
  status: true
  max: 128
  items:
    - label: 'System'
      value: 24
      color: 'neutral'
    - label: 'Apps'
      value: 8
      color: 'error'
    - label: 'Multimedia'
      value: 42
      color: 'success'
  class: 'w-96'
---
::

::tip
The status tracks the end of the bar, use `:ui="{ status: 'w-full' }"` to make it span the full width instead.
::

### Color

Use the `color` prop to change the color of every segment that doesn't set its own.

::component-code
---
collapse: true
ignore:
  - items
  - class
external:
  - items
externalTypes:
  - ProgressGroupItem[]
props:
  color: neutral
  items:
    - label: 'Read'
      value: 42
    - label: 'Write'
      value: 18
  class: 'w-96'
---
::

::tip
Both this prop and each item's `color` accept any CSS color value, which is handy for palettes outside the theme.
::

### Size

Use the `size` prop to change the size of the ProgressGroup.

::component-code
---
collapse: true
ignore:
  - items
  - class
external:
  - items
externalTypes:
  - ProgressGroupItem[]
props:
  size: xl
  items:
    - label: 'Read'
      value: 42
      color: 'primary'
    - label: 'Write'
      value: 18
      color: 'info'
  class: 'w-96'
---
::

### Orientation

Use the `orientation` prop to change the orientation of the ProgressGroup. Defaults to `horizontal`.

::component-code
---
collapse: true
ignore:
  - items
  - class
external:
  - items
externalTypes:
  - ProgressGroupItem[]
props:
  orientation: vertical
  items:
    - label: 'Read'
      value: 42
      color: 'primary'
    - label: 'Write'
      value: 18
      color: 'info'
  class: 'h-48'
---
::

## Examples

### With custom colors

Give each item a CSS color to build a breakdown outside the theme palette.

::component-example
---
collapse: true
name: progress-group-custom-color-example
---
::

### With status slot

Use the `#status` slot to replace the summed percentage with your own content.

::component-example
---
collapse: true
name: progress-group-status-example
---
::

### With item slots

Use the `#item-label` and `#item-trailing` slots to change what each entry displays. Both receive the `item`, its `index` and its `percent`.

::component-example
---
collapse: true
name: progress-group-item-example
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
