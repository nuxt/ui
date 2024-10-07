---
description: A textarea element to input multi-line text.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Textarea.vue
---

## Usage

Use the `v-model` directive to control the value of the Textarea.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: ''
---
::

### Placeholder

Use the `placeholder` prop to set a placeholder text.

::component-code
---
props:
  placeholder: 'Type something...'
---
::

### Color

Use the `color` prop to change the ring color when the Textarea is focused.

::component-code
---
ignore:
  - placeholder
props:
  color: neutral
  highlight: true
  placeholder: 'Type something...'
---
::

::note
The `highlight` prop is used here to show the focus state. It's used internally when a validation error occurs.
::

### Variant

Use the `variant` prop to change the variant of the Textarea.

::component-code
---
ignore:
  - placeholder
props:
  color: neutral
  variant: subtle
  highlight: false
  placeholder: 'Type something...'
---
::

### Size

Use the `size` prop to change the size of the Textarea.

::component-code
---
ignore:
  - placeholder
props:
  size: xl
  placeholder: 'Type something...'
---
::

### Disabled

Use the `disabled` prop to disable the Textarea.

::component-code
---
ignore:
  - placeholder
props:
  disabled: true
  placeholder: 'Type something...'
---
::

### Rows

Use the `rows` prop to set the number of rows. Defaults to `3`.

::component-code
---
props:
  rows: 12
---
::

### Autoresize

Use the `autoresize` prop to enable autoresizing the height of the Textarea.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: 'This is a long text that will autoresize the height of the Textarea.'
  autoresize: true
---
::

Use the `maxrows` prop to set the maximum number of rows when autoresizing. If set to `0`, the Textarea will grow indefinitely.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: 'This is a long text that will autoresize the height of the Textarea with a maximum of 4 rows.'
  maxrows: 4
  autoresize: true
---
::

## API

### Props

:component-props

### Slots

:component-slots

### Emits

:component-emits

### Expose

When accessing the component via a template ref, you can use the following:

| Name | Type |
| ---- | ---- |
| `textareaRef`{lang="ts-type"} | `Ref<HTMLTextAreaElement \| null>`{lang="ts-type"} |

## Theme

:component-theme
