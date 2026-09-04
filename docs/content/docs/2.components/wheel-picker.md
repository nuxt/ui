---
title: WheelPicker
description: An iOS-style wheel for picking a single value from a list.
category: form
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/WheelPicker.vue
navigation.badge: Soon
---

## Usage

Use the `v-model` directive to control the value of the WheelPicker or the `default-value` prop to set the initial value when you do not need to control its state.

Scroll with the mouse wheel, drag with a pointer or use the keyboard — the selected item always snaps to the center.

::component-code
---
prettier: true
ignore:
  - modelValue
  - items
external:
  - items
  - modelValue
props:
  modelValue: 'Wednesday'
  items:
    - 'Monday'
    - 'Tuesday'
    - 'Wednesday'
    - 'Thursday'
    - 'Friday'
    - 'Saturday'
    - 'Sunday'
---
::

### Items

Use the `items` prop as an array of strings or numbers:

::component-code
---
prettier: true
ignore:
  - modelValue
  - items
external:
  - items
  - modelValue
props:
  modelValue: 5
  items:
    - 0
    - 1
    - 2
    - 3
    - 4
    - 5
    - 6
    - 7
    - 8
    - 9
---
::

You can also pass an array of objects with the following properties:

- `label?: string`{lang="ts-type"}
- `icon?: string`{lang="ts-type"}
- [`value?: string`{lang="ts-type"}](#value-key)
- `disabled?: boolean`{lang="ts-type"}
- `class?: any`{lang="ts-type"}
- `ui?: { item?: ClassNameValue, itemLeading?: ClassNameValue, itemLabel?: ClassNameValue }`{lang="ts-type"}

::component-code
---
prettier: true
ignore:
  - modelValue
  - items
external:
  - items
  - modelValue
props:
  modelValue: 'par'
  items:
    - label: 'London'
      value: 'lon'
    - label: 'Paris'
      value: 'par'
    - label: 'Tokyo'
      value: 'tok'
    - label: 'New York'
      value: 'nyc'
---
::

### Value Key

You can change the property that is used to set the value by using the `value-key` prop. Defaults to `value`.

::component-code
---
prettier: true
ignore:
  - modelValue
  - items
  - valueKey
external:
  - items
  - modelValue
props:
  modelValue: 2
  valueKey: 'id'
  items:
    - label: 'London'
      id: 1
    - label: 'Paris'
      id: 2
    - label: 'Tokyo'
      id: 3
---
::

### Icon

Use the `icon` property in the items to display an [Icon](/docs/components/icon) inside each option.

::component-code
---
prettier: true
ignore:
  - modelValue
  - items
external:
  - items
  - modelValue
props:
  modelValue: 'apple'
  items:
    - label: 'Apple'
      value: 'apple'
      icon: 'i-simple-icons-apple'
    - label: 'GitHub'
      value: 'github'
      icon: 'i-simple-icons-github'
    - label: 'Google'
      value: 'google'
      icon: 'i-simple-icons-google'
---
::

### Color

Use the `color` prop to change the color of the WheelPicker.

::component-code
---
prettier: true
ignore:
  - modelValue
  - items
external:
  - items
  - modelValue
props:
  color: neutral
  modelValue: 'Wednesday'
  items:
    - 'Monday'
    - 'Tuesday'
    - 'Wednesday'
    - 'Thursday'
    - 'Friday'
---
::

### Variant

Use the `variant` prop to change the appearance of the selection indicator.

::component-code
---
prettier: true
ignore:
  - modelValue
  - items
external:
  - items
  - modelValue
props:
  variant: line
  modelValue: 'Wednesday'
  items:
    - 'Monday'
    - 'Tuesday'
    - 'Wednesday'
    - 'Thursday'
    - 'Friday'
---
::

### Size

Use the `size` prop to change the size of the WheelPicker.

::component-code
---
prettier: true
ignore:
  - modelValue
  - items
external:
  - items
  - modelValue
props:
  size: xl
  modelValue: 'Wednesday'
  items:
    - 'Monday'
    - 'Tuesday'
    - 'Wednesday'
    - 'Thursday'
    - 'Friday'
---
::

### Orientation

Use the `orientation` prop to change the direction of the wheel. Defaults to `vertical`.

::component-code
---
prettier: true
ignore:
  - modelValue
  - items
external:
  - items
  - modelValue
props:
  orientation: horizontal
  modelValue: 'Wednesday'
  items:
    - 'Monday'
    - 'Tuesday'
    - 'Wednesday'
    - 'Thursday'
    - 'Friday'
---
::

### Visible Items

Use the `visible-items` prop to change how many items are visible at once. Use an odd number to keep the selected item centered. Defaults to `5`.

::component-code
---
prettier: true
ignore:
  - modelValue
  - items
external:
  - items
  - modelValue
props:
  visibleItems: 7
  modelValue: 'Wednesday'
  items:
    - 'Monday'
    - 'Tuesday'
    - 'Wednesday'
    - 'Thursday'
    - 'Friday'
    - 'Saturday'
    - 'Sunday'
---
::

### Item Height

Use the `item-height` prop to change the height (or width when horizontal) of each item, in pixels. Defaults to `32`.

::component-code
---
prettier: true
ignore:
  - modelValue
  - items
external:
  - items
  - modelValue
props:
  itemHeight: 48
  modelValue: 'Wednesday'
  items:
    - 'Monday'
    - 'Tuesday'
    - 'Wednesday'
    - 'Thursday'
    - 'Friday'
---
::

### Loop

Use the `loop` prop to make the wheel wrap around infinitely.

::component-code
---
prettier: true
ignore:
  - modelValue
  - items
external:
  - items
  - modelValue
props:
  loop: true
  modelValue: 'Wednesday'
  items:
    - 'Monday'
    - 'Tuesday'
    - 'Wednesday'
    - 'Thursday'
    - 'Friday'
    - 'Saturday'
    - 'Sunday'
---
::

### Sensitivity

Use the `sensitivity` prop to control how far the wheel travels per wheel-tick or drag. Values above `1` scroll faster, below `1` slower.

::component-code
---
prettier: true
ignore:
  - modelValue
  - items
external:
  - items
  - modelValue
props:
  sensitivity: 2
  modelValue: 'Wednesday'
  items:
    - 'Monday'
    - 'Tuesday'
    - 'Wednesday'
    - 'Thursday'
    - 'Friday'
---
::

### Readonly

Use the `readonly` prop to keep the wheel focusable while preventing its value from changing.

::component-code
---
prettier: true
ignore:
  - modelValue
  - items
external:
  - items
  - modelValue
props:
  readonly: true
  modelValue: 'Wednesday'
  items:
    - 'Monday'
    - 'Tuesday'
    - 'Wednesday'
    - 'Thursday'
    - 'Friday'
---
::

### Haptics

Use the `haptics` prop to trigger a short vibration each time the selection changes on supported devices. Motion and momentum automatically respect the user's `prefers-reduced-motion` setting.

::component-code
---
prettier: true
ignore:
  - modelValue
  - items
external:
  - items
  - modelValue
props:
  haptics: true
  modelValue: 'Wednesday'
  items:
    - 'Monday'
    - 'Tuesday'
    - 'Wednesday'
    - 'Thursday'
    - 'Friday'
---
::

### Disabled

Use the `disabled` prop to disable the WheelPicker.

::component-code
---
prettier: true
ignore:
  - modelValue
  - items
external:
  - items
  - modelValue
props:
  disabled: true
  modelValue: 'Wednesday'
  items:
    - 'Monday'
    - 'Tuesday'
    - 'Wednesday'
    - 'Thursday'
    - 'Friday'
---
::

You can also disable individual items using the `disabled` property.

::component-code
---
prettier: true
ignore:
  - modelValue
  - items
external:
  - items
  - modelValue
props:
  modelValue: 'par'
  items:
    - label: 'London'
      value: 'lon'
    - label: 'Paris'
      value: 'par'
    - label: 'Tokyo'
      value: 'tok'
      disabled: true
    - label: 'New York'
      value: 'nyc'
---
::

## Examples

### Date picker

Wrap several `WheelPicker` columns in a `WheelPickerGroup` to build a multi-column picker with a single shared frame and center indicator. The group shares its `item-height`, `visible-items`, `size` and `color` with every column so they stay aligned.

:component-example{name="wheel-picker-date-example"}

### Time picker

The same `WheelPickerGroup` composes hour, minute and period columns — set `loop` on the columns that should wrap.

:component-example{name="wheel-picker-time-example"}

### With countries

:component-example{name="wheel-picker-countries-example"}

### With custom slot

Use the `#item` slot to fully customize how each option is rendered.

:component-example{name="wheel-picker-slot-example"}

### Within a form

Use the WheelPicker within a [Form](/docs/components/form) to validate its value.

:component-example{name="wheel-picker-form-example"}

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
