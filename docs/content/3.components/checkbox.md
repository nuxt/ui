---
description: An input element to toggle between checked and unchecked states.
links:
  - label: Checkbox
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/checkbox
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Checkbox.vue
---

## Usage

Use the `v-model` directive to control the checked state of the Checkbox.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: true
---
::

Use the `default-value` prop to set the initial value when you do not need to control its state.

::component-code
---
ignore:
  - defaultValue
props:
  defaultValue: true
---
::

### Indeterminate

Use the `indeterminate` value in the `v-model` directive or `default-value` prop to set the Checkbox to an [indeterminate state](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#indeterminate_state_checkboxes).

::component-code
---
ignore:
  - defaultValue
props:
  defaultValue: 'indeterminate'
---
::

### Indeterminate Icon

Use the `indeterminate-icon` prop to customize the indeterminate icon. Defaults to `i-lucide-minus`.

::component-code
---
ignore:
  - defaultValue
props:
  defaultValue: 'indeterminate'
  indeterminateIcon: 'i-lucide-plus'
---
::

::framework-only
#nuxt
:::tip{to="/getting-started/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.minus` key.
:::

#vue
:::tip{to="/getting-started/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.minus` key.
:::
::

### Label

Use the `label` prop to set the label of the Checkbox.

::component-code
---
props:
  label: Check me
---
::

When using the `required` prop, an asterisk is added next to the label.

::component-code
---
ignore:
  - label
props:
  required: true
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

Use the `icon` prop to set the icon of the Checkbox when it is checked. Defaults to `i-lucide-check`.

::component-code
---
ignore:
  - label
  - defaultValue
props:
  icon: 'i-lucide-heart'
  defaultValue: true
  label: Check me
---
::

::framework-only
#nuxt
:::tip{to="/getting-started/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.check` key.
:::

#vue
:::tip{to="/getting-started/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.check` key.
:::
::

### Color

Use the `color` prop to change the color of the Checkbox.

::component-code
---
ignore:
  - label
  - defaultValue
props:
  color: neutral
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

### Emits

:component-emits

## Theme

:component-theme
