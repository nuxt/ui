---
description: Display a textarea field.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/forms/Textarea.vue
---

## Usage

Use a `v-model` to make the Textarea reactive.

:component-example{component="textarea-example"}

### Style

Use the `color` and `variant` props to change the visual style of the Textarea.

::component-card
---
baseProps:
  placeholder: 'Search...'
props:
  color: 'primary'
  variant: 'outline'
---
::

Besides all the colors from the `ui.colors` object, you can also use the `white` (default) and `gray` colors with their pre-defined variants.

#### White

::component-card
---
baseProps:
  placeholder: 'Search...'
props:
  color: 'white'
  variant: 'outline'
excludedProps:
  - color
---
::

#### Gray

::component-card
---
baseProps:
  placeholder: 'Search...'
props:
  color: 'gray'
  variant: 'outline'
excludedProps:
  - color
---
::

### Size

Use the `size` prop to change the size of the Textarea.

::component-card
---
baseProps:
props:
  size: 'sm'
---
::

### Placeholder

Use the `placeholder` prop to set a placeholder text.

::component-card
---
props:
  placeholder: 'Search...'
---
::

### Rows

Use the `rows` prop to set the number of rows of the Textarea.

::component-card
---
baseProps:
  placeholder: 'Search...'
props:
  rows: 1
---
::

### Disabled

Use the `disabled` prop to disable the Textarea.

::component-card
---
baseProps:
  placeholder: 'Search...'
props:
  disabled: true
---
::

### Autoresize

Use the `autoresize` prop to enable the autoresize. Writing more lines than the `rows` prop will make the Textarea grow up.

::component-card
---
baseProps:
  placeholder: 'Search...'
  modelValue: 'Here is an autoresize Textarea, write new lines to make the Textarea grow up...'
props:
  autoresize: true
---
::

Use the `maxrows` prop to set a maximum number of rows when autoresizing. If set to `0`, the Textarea will infinitely grow up.
::component-card
---
baseProps:
  placeholder: 'Search...'
  modelValue: 'Here is an autoresize Textarea, write new lines to make the Textarea grow up at a maximum of 5 rows...'
props:
  autoresize: true
  maxrows: 5
---
::

### Resize

Use the `resize` prop to enable the resize control.

::component-card
---
baseProps:
  placeholder: 'Search...'
props:
  resize: true
---
::

### Padded

Use the `padded` prop to remove the padding of the Textarea.

::component-card
---
props:
  padded: false
baseProps:
  placeholder: 'Search...'
  variant: 'none'
  class: 'w-full'
---
::

## Props

:component-props

## Config

:component-preset
