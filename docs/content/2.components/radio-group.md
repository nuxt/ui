---
title: RadioGroup
description: Display a set of radio buttons.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/forms/RadioGroup.vue
---

## Usage

Use a `v-model` to make the RadioGroup reactive.

:component-example{component="radio-group-example"}

Alternatively, you can use individual Radio components:

:component-example{component="radio-example"}

::callout{icon="i-heroicons-light-bulb"}
If using the RadioGroup component, you can customize the Radio options by using the `uiRadio` prop.
::

### Legend

Use the `legend` prop to add a legend to the RadioGroup.

::component-card
---
baseProps:
  options: [{ value: 'email', label: 'Email' }, { value: 'sms', label: 'Phone (SMS)' }, { value: 'push', label: 'Push notification' }]
  modelValue: 'sms'
props:
  legend: 'Legend'
---
::

### Style

Use the `color` prop to change the style of the RadioGroup.

::component-card
---
baseProps:
  options: [{ value: 'email', label: 'Email' }, { value: 'sms', label: 'Phone (SMS)' }, { value: 'push', label: 'Push notification' }]
  modelValue: 'sms'
props:
  color: 'primary'
---
::

::callout{icon="i-heroicons-light-bulb"}
This prop also work on the Radio component.
::

### Disabled

Use the `disabled` prop to disable the RadioGroup.

::component-card
---
baseProps:
  options: [{ value: 'email', label: 'Email' }, { value: 'sms', label: 'Phone (SMS)' }, { value: 'push', label: 'Push notification', disabled: true }]
  modelValue: 'sms'
props:
  disabled: true
---
::

::callout{icon="i-heroicons-light-bulb"}
This prop also work on the Radio component and you can set the `disabled` field in the `options` to disable a specific Radio.
::

### Label

Use the `label` prop to display a label on the right of the Radio.

::component-card{slug="URadio"}
---
props:
  label: 'Label'
---
::

### Required

Use the `required` prop to display a red star next to the label of the Radio.

::component-card{slug="URadio"}
---
props:
  label: 'Label'
  required: true
---
::

### Help

Use the `help` prop to display some text under the Radio.

::component-card{slug="URadio"}
---
props:
  label: 'Label'
  help: 'Please choose one'
---
::

## Slots

### `label`

Use the `#label` slot to override the label of each option.

:component-example{component="radio-group-label-example"}

Alternatively, you can do the same with individual Radio:

::component-card{slug="URadio"}
---
slots:
  label: <span class="italic">Label</span>
---

#label
  [Label]{.italic}
::

### `help`

Like the `#label` slot, use the `#help` slot to override the content of the help text.

### `legend`

Use the `#legend` slot to override the content of the legend.

::component-card
---
baseProps:
  options: [{ value: 'email', label: 'Email' }, { value: 'sms', label: 'Phone (SMS)' }, { value: 'push', label: 'Push notification' }]
  modelValue: 'sms'
slots:
  legend: <span class="italic">Legend</span>
---

#legend
  [Legend]{.italic}
::

## Props

::tabs
  :component-props{label="Radio" slug="URadio"}
  :component-props{label="RadioGroup"}
::

## Config

::callout{icon="i-heroicons-light-bulb"}
Use the `ui` prop to override the radio group config and the `uiRadio` prop to override the radio config.
::

::tabs
  :component-preset{label="Radio (uiRadio)" slug="Radio"}
  :component-preset{label="RadioGroup (ui)"}
::
