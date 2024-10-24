---
description: An input to select a numeric value within a range.
links:
  - label: Slider
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/slider
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Slider.vue
---

## Usage

Use the `v-model` directive to control the value of the Slider.

::component-code
---
external:
  - modelValue
props:
  modelValue: 50
---
::

Use the `default-value` prop to set the initial value when you do not need to control its state.

::component-code
---
ignore:
  - defaultValue
props:
  defaultValue: 50
---
::

### Min / Max

Use the `min` and `max` props to set the minimum and maximum values of the Slider. Defaults to `0` and `100`.

::component-code
---
ignore:
  - defaultValue
props:
  min: 0
  max: 50
  defaultValue: 50
---
::

### Step

Use the `step` prop to set the increment value of the Slider. Defaults to `1`.

::component-code
---
ignore:
  - defaultValue
props:
  step: 10
  defaultValue: 50
---
::

### Multiple

Use the `v-model` directive or the `default-value` prop with an array of values to create a range Slider.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: [25, 75]
---
::

Use the `min-steps-between-thumbs` prop to limit the minimum distance between the thumbs.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: [25, 50, 75]
  minStepsBetweenThumbs: 10
---
::

### Orientation

Use the `orientation` prop to change the orientation of the Slider. Defaults to `horizontal`.

::component-code
---
ignore:
  - defaultValue
  - class
props:
  orientation: vertical
  defaultValue: 50
  class: 'h-48'
---
::

### Color

Use the `color` prop to change the color of the Slider.

::component-code
---
ignore:
  - defaultValue
props:
  color: neutral
  defaultValue: 50
---
::

### Size

Use the `size` prop to change the size of the Slider.

::component-code
---
ignore:
  - defaultValue
props:
  size: xl
  defaultValue: 50
---
::

### Disabled

Use the `disabled` prop to disable the Slider.

::component-code
---
ignore:
  - defaultValue
props:
  disabled: true
  defaultValue: 50
---
::

### Inverted

Use the `inverted` prop to visually invert the Slider.

::component-code
---
ignore:
  - defaultValue
props:
  inverted: true
  defaultValue: 25
---
::

## API

### Props

:component-props

### Emits

:component-emits

## Theme

:component-theme
