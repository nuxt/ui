---
title: Toggle
description: A button that can be pressed on or off.
category: element
keywords:
  - toggle button
  - pressed button
links:
  - label: Toggle
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/toggle
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Toggle.vue
navigation.badge: Soon
---

## Usage

Use the `v-model` directive to control the pressed state of the Toggle.

::component-code
---
ignore:
  - modelValue
  - icon
  - aria-label
external:
  - modelValue
props:
  modelValue: true
  icon: i-lucide-bold
  aria-label: Toggle bold
---
::

Use the `default-value` prop to set the initial value when you do not need to control its state.

::component-code
---
ignore:
  - defaultValue
  - icon
  - aria-label
props:
  defaultValue: true
  icon: i-lucide-bold
  aria-label: Toggle bold
---
::

::note
The Toggle component extends the [Button](/docs/components/button) component, so you can pass its properties such as `label`, `icon`, `size`, etc., except the link ones. It sets the `active` prop of the Button from its pressed state.
::

### Color

Use the `color` prop to set the color of the Toggle when not pressed. Defaults to `neutral`.

::component-code
---
items:
  color:
    - primary
    - secondary
    - success
    - info
    - warning
    - error
    - neutral
ignore:
  - label
props:
  color: neutral
  label: Bold
---
::

### Variant

Use the `variant` prop to set the variant of the Toggle when not pressed. Defaults to `ghost`.

::component-code
---
items:
  color:
    - primary
    - secondary
    - success
    - info
    - warning
    - error
    - neutral
  variant:
    - solid
    - outline
    - soft
    - subtle
    - ghost
    - link
ignore:
  - label
props:
  color: neutral
  variant: outline
  label: Bold
---
::

### Active Color

Use the `active-color` prop to set the color of the Toggle when pressed. Defaults to `primary`.

::component-code
---
items:
  activeColor:
    - primary
    - secondary
    - success
    - info
    - warning
    - error
    - neutral
ignore:
  - label
  - defaultValue
props:
  activeColor: neutral
  defaultValue: true
  label: Bold
---
::

### Active Variant

Use the `active-variant` prop to set the variant of the Toggle when pressed. Defaults to `soft`.

::component-code
---
items:
  activeColor:
    - primary
    - secondary
    - success
    - info
    - warning
    - error
    - neutral
  activeVariant:
    - solid
    - outline
    - soft
    - subtle
    - ghost
    - link
ignore:
  - label
  - defaultValue
props:
  activeColor: primary
  activeVariant: solid
  defaultValue: true
  label: Bold
---
::

### Disabled

Use the `disabled` prop to disable the Toggle.

::component-code
---
ignore:
  - label
props:
  disabled: true
  label: Bold
---
::

## Examples

### Style the pressed state

The Toggle renders `data-state="on"` when pressed, so you can style it with the `data-[state=on]` variant.

::component-code
---
ignore:
  - label
  - class
props:
  label: Bold
  class: 'data-[state=on]:ring data-[state=on]:ring-primary'
---
::

## API

### Props

:component-props

### Slots

:component-slots

### Emits

:component-emits

## Changelog

:component-changelog
