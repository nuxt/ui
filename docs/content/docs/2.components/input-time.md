---
title: InputTime
description: 'An input for selecting a time.'
category: form
links:
  - label: TimeField
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/time-field
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/InputTime.vue
---

## Usage

Use the `v-model` directive to control the selected date.

::component-code
---
cast:
  modelValue: TimeValue
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: [12, 30, 0]
---
::

Use the `default-value` prop to set the initial value when you do not need to control its state.

::component-code
---
cast:
  defaultValue: TimeValue
ignore:
  - defaultValue
external:
  - defaultValue
props:
  defaultValue: [12, 30, 0]
---
::

::framework-only
#nuxt
:::note{to="/docs/getting-started/integrations/i18n/nuxt#locale"}
This component uses the `@internationalized/date` package for locale-aware formatting. The time format is determined by the `locale` prop of the App component.
:::

#vue
:::note{to="/docs/getting-started/integrations/i18n/vue#locale"}
This component uses the `@internationalized/date` package for locale-aware formatting. The time format is determined by the `locale` prop of the App component.
:::
::

### Hour Cycle

Use the `hour-cycle` prop to change the hour cycle of the InputTime. Defaults to `12`.

::component-code
---
cast:
  defaultValue: TimeValue
ignore:
  - hourCycle
  - defaultValue
external:
  - defaultValue
props:
  hourCycle: 24
  defaultValue: [16, 30, 0]
---
::

### Color

Use the `color` prop to change the color of the InputTime.

::component-code
---
props:
  color: neutral
  highlight: true
---
::

::note
The `highlight` prop is used here to show the focus state. It's used internally when a validation error occurs.
::

### Variant

Use the `variant` prop to change the variant of the InputTime.

::component-code
---
props:
  variant: subtle
---
::

### Size

Use the `size` prop to change the size of the InputTime.

::component-code
---
props:
  size: xl
---
::

### Icon

Use the `icon` prop to show an [Icon](/docs/components/icon) inside the InputTime.

::component-code
---
props:
  icon: 'i-lucide-clock'
---
::

::note
Use the `leading` and `trailing` props to set the icon position or the `leading-icon` and `trailing-icon` props to set a different icon for each position.
::

### Avatar

Use the `avatar` prop to show an [Avatar](/docs/components/avatar) inside the InputTime.

::component-code
---
prettier: true
props:
  avatar:
    src: 'https://github.com/vuejs.png'
  size: md
  variant: outline
---
::

### Disabled

Use the `disabled` prop to disable the InputTime.

::component-code
---
props:
  disabled: true
---
::

## Examples

### Within a FormField

You can use the InputTime within a [FormField](/docs/components/form-field) component to display a label, help text, required indicator, etc.

::component-example
---
name: 'input-time-form-field-example'
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
