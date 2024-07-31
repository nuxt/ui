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
  modelValue: true
  label: Check me
---
::

Use the `default-value` prop to set the initial value when you do not need to control its state.

::component-code
---
ignore:
  - label
props:
  defaultValue: true
  label: Check me
---
::

### Indeterminate

Use the `indeterminate` prop to set the Checkbox to an [indeterminate state](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#indeterminate_state_checkboxes).

Use the `indeterminate-icon` prop to customize this icon. Defaults to `i-heroicons-minus-20-solid`.

::component-code
---
ignore:
  - label
props:
  indeterminate: true
  indeterminateIcon: ''
  label: Check me
---
::

::tip
You can customize this icon globally in your `app.config.ts` under `ui.icons.minus` key.
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
  icon: 'i-heroicons-heart'
  defaultValue: true
  label: Check me
---
::

::tip
You can customize this icon globally in your `app.config.ts` under `ui.icons.check` key.
::

### Color

Use the `color` prop to change the color of the Checkbox.

::component-code
---
ignore:
  - label
  - defaultValue
props:
  color: gray
  defaultValue: true
  label: Check me
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
  size: xl
  defaultValue: true
  label: Check me
---
::

### Required

Use the `required` prop to make the Checkbox required. This will add an asterisk to the label.

::component-code
---
ignore:
  - label
props:
  required: true
  label: Check me
---
::

### Disabled

Use the `disabled` prop to disable the Checkbox.

::component-code
---
ignore:
  - label
props:
  disabled: true
  label: Check me
---
::

## API

### Props

:component-props

### Slots

:component-slots

### Events

:component-events

## Theme

:component-theme
