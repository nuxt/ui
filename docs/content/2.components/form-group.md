---
title: FormGroup
description: Display a label and additional informations around a form element.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/forms/FormGroup.vue
---


## Usage

Use the FormGroup component around an [Input](/components/input), [Textarea](/components/textarea), [Select](/components/select) or a [SelectMenu](/components/select-menu) with a `label`. The `<label>` will automatically be associated with the form element so it gets focused on click.

::component-card
---
props:
  label: 'Email'
code: >-

  <UInput placeholder="you@example.com" icon="i-heroicons-envelope" />
---

#default
:u-input{placeholder="you@example.com" icon="i-heroicons-envelope"}
::

### Required

Use the `required` prop to indicate that the form element is required.

::component-card
---
props:
  label: 'Email'
  required: true
code: >-

  <UInput placeholder="you@example.com" icon="i-heroicons-envelope" />
---

#default
:u-input{placeholder="you@example.com" icon="i-heroicons-envelope"}
::

### Description

Use the `description` prop to display a description below the label.

::component-card
---
props:
  label: 'Email'
  description: "We'll only use this for spam."
code: >-

  <UInput placeholder="you@example.com" icon="i-heroicons-envelope" />
---

#default
:u-input{placeholder="you@example.com" icon="i-heroicons-envelope"}
::

### Hint

Use the `hint` prop to display a hint above the form element.

::component-card
---
props:
  label: 'Email'
  hint: 'Optional'
code: >-

  <UInput placeholder="you@example.com" icon="i-heroicons-envelope" />
---

#default
:u-input{placeholder="you@example.com" icon="i-heroicons-envelope"}
::

### Help

Use the `help` prop to display an help message below the form element.

::component-card
---
props:
  label: 'Email'
  help: 'We will never share your email with anyone else.'
code: >-

  <UInput placeholder="you@example.com" icon="i-heroicons-envelope" />
---

#default
:u-input{placeholder="you@example.com" icon="i-heroicons-envelope"}
::

### Error

Use the `error` prop to display an error message below the form element.

When used together with the `help` prop, the `error` prop will take precedence.

:component-example{component="form-group-error-example"}

::callout{icon="i-heroicons-light-bulb"}
  The `error` prop will automatically set the `color` prop of the form element to `red`.
::

You can also use the `error` prop as a boolean to mark the form element as invalid.

::component-card
---
props:
  label: 'Email'
  error: true
excludedProps:
  - ui
  - error
  - label
code: >-

  <UInput placeholder="you@example.com" />
---

#default
:u-input{model-value="benjamincanac" placeholder="you@example.com"}
::

::callout{icon="i-heroicons-light-bulb" to="/components/form"}
  Learn more about form validation in the `Form` component.
::

### Size

Use the `size` prop to change the size of the label and the form element.

::component-card
---
props:
  size: 'xl'
  label: 'Email'
  hint: 'Optional'
  description: "We'll only use this for spam."
  help: 'We will never share your email with anyone else.'
excludedProps:
  - label
  - hint
  - description
  - help
code: >-

  <UInput placeholder="you@example.com" icon="i-heroicons-envelope" />
---

#default
:u-input{placeholder="you@example.com" icon="i-heroicons-envelope"}
::

::callout{icon="i-heroicons-exclamation-triangle"}
  This will only work with form elements that support the `size` prop.
::

### Eager Validation

By default, validation is only triggered after the initial `blur` event. This is to prevent the form from being validated as the user is typing. You can override this behavior by setting the `eager-validation` prop to `true`

:component-example{component="form-group-eager-validation-example"}

## Slots

### `label`

Use the `#label` slot to set the custom content for label.

::component-card
---
slots:
  label: <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" size="3xs" />
  default: <UInput model-value="benjamincanac" placeholder="you@example.com" />
---

#label
  :u-avatar{src="https://avatars.githubusercontent.com/u/739984?v=4" size="3xs" class="mr-2 inline-flex"}

#default
  :u-input{model-value="benjamincanac" placeholder="you@example.com"}
::

### `description`

Use the `#description` slot to set the custom content for description.

::component-card
---
slots:
  description: Write only valid email address <UIcon name="i-heroicons-information-circle" />
  default: <UInput model-value="benjamincanac" placeholder="you@example.com" />
props:
  label: 'Email'
---

#description
  Write only valid email address :u-icon{name="i-heroicons-information-circle" class="align-middle"}

#default
  :u-input{model-value="benjamincanac" placeholder="you@example.com"}
::

### `hint`

Use the `#hint` slot to set the custom content for hint.

::component-card
---
slots:
  hint: <UIcon name="i-heroicons-arrow-right-20-solid" />
  default: <UInput model-value="benjamincanac" placeholder="you@example.com" />
props:
  label: 'Step 1'
---

#hint
  :u-icon{name="i-heroicons-arrow-right-20-solid"}

#default
  :u-input{model-value="benjamincanac" placeholder="you@example.com"}
::

### `help`

Use the `#help` slot to set the custom content for help.

::component-card
---
slots:
  help: Here are some examples <UIcon name="i-heroicons-information-circle" />
  default: <UInput model-value="benjamincanac" placeholder="you@example.com" />
props:
  label: 'Email'
---

#help
  Here are some examples :u-icon{name="i-heroicons-information-circle" class="align-middle"}

#default
  :u-input{model-value="benjamincanac" placeholder="you@example.com"}
::

### `error`

Use the `#error` slot to set the custom content for error.

::component-example
---
component: 'form-group-error-slot-example'
componentProps:
  class: 'w-60'
---
::

## Props

:component-props

## Config

:component-preset
