---
description: Display a checkbox field.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/forms/Checkbox.vue
---

## Usage

Use a `v-model` to make the Checkbox reactive.

:component-example{component="checkbox-example"}

### Label

Use the `label` prop to display a label on the right.

::component-card
---
props:
  label: 'Label'
---
::

### Style

Use the `color` prop to change the style of the Checkbox.

::component-card
---
baseProps:
  label: 'Label'
props:
  color: 'primary'
---
::

### Required

Use the `required` prop to display a red star next to the label of the Checkbox.

::component-card
---
props:
  label: 'Label'
  required: true
---
::

### Help

Use the `help` prop to display some text under the Checkbox.

::component-card
---
props:
  label: 'Label'
  help: 'Please check this box'
---
::

### Disabled

Use the `disabled` prop to disable the Checkbox.

::component-card
---
props:
  disabled: true
---
::

## Slots

### `label`

Use the `#label` slot to override the content of the label.

::component-card
---
slots:
  label: <span class="italic">Label</span>
---

#label
  [Label]{.italic}
::

### `help`

Like the `#label` slot, use the `#help` slot to override the content of the help text.

## Props

:component-props

## Config

:component-preset
