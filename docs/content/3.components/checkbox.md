---
description: An input element to toggle between checked and unchecked states.
links:
  - label: Checkbox
    icon: i-custom-radix-vue
    to: https://www.radix-vue.com/components/checkbox.html
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/benjamincanac/ui3/tree/dev/src/runtime/components/Checkbox.vue
---

## Usage

Use the `v-model` directive to control the checked state of the Checkbox.

::component-code
---
external:
  - modelValue
ignore:
  - label
props:
  label: Check me
  modelValue: true
---
::

Use the `default-value` prop to set the initial value of the Checkbox when you do not need to control its state.

::component-code
---
ignore:
  - label
props:
  label: Check me
  defaultValue: true
---
::

Use the `indeterminate` prop to set the Checkbox to an [indeterminate state](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#indeterminate_state_checkboxes).

::component-code
---
ignore:
  - label
props:
  label: Check me
  indeterminate: true
---
::

### Label

Use the `label` prop to set the label of the Checkbox.

::component-code
---
props:
  label: Check me
---
::

### Description

Use the `description` prop to set the description of the Checkbox.

::component-code
---
ignore:
  - label
props:
  label: Check me
  description: 'This is a checkbox.'
---
::

### Icon

Use the `icon` prop to set the icon of the Checkbox when it is checked. Defaults to `i-heroicons-check-20-solid`.

::component-code
---
ignore:
  - label
  - defaultValue
props:
  label: Check me
  icon: 'i-heroicons-heart'
  defaultValue: true
---
::

::tip
You can customize this icon globally in your `app.config.ts` under `ui.icons.check` key.
::

### Style

Use the `color` prop to change the style of the Checkbox.

::component-code
---
ignore:
  - label
  - defaultValue
props:
  label: Check me
  color: gray
  defaultValue: true
---
::

### Size

Use the `size` prop to change the size of the Checkbox.

::component-code
---
ignore:
  - label
  - defaultValue
props:
  label: Check me
  size: xl
  defaultValue: true
---
::

### Disabled

::component-code
---
ignore:
  - label
props:
  label: Check me
  disabled: true
---
::

## Examples

## API

### Props

:component-props

### Slots

:component-slots

### Events

:component-events

## Theme

:component-theme
