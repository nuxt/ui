---
description: A textarea element to input multi-line text.
category: form
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

### Rows

Use the `rows` prop to set the number of rows. Defaults to `3`.

::component-code
---
props:
  rows: 12
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

### Icon

Use the `icon` prop to show an [Icon](/components/icon) inside the Textarea.

::component-code
---
prettier: true
ignore:
  - placeholder
props:
  icon: 'i-lucide-search'
  size: md
  variant: outline
  placeholder: 'Search...'
  rows: 1
---
::

Use the `leading` and `trailing` props to set the icon position or the `leading-icon` and `trailing-icon` props to set a different icon for each position.

::component-code
---
prettier: true
ignore:
  - placeholder
props:
  trailingIcon: i-lucide-at-sign
  placeholder: 'Enter your email'
  size: md
  rows: 1
---
::

### Avatar

Use the `avatar` prop to show an [Avatar](/components/avatar) inside the Textarea.

::component-code
---
prettier: true
ignore:
  - placeholder
props:
  avatar:
    src: 'https://github.com/nuxt.png'
  size: md
  variant: outline
  placeholder: 'Search...'
  rows: 1
---
::

### Loading

Use the `loading` prop to show a loading icon on the Textarea.

::component-code
---
ignore:
  - placeholder
props:
  loading: true
  trailing: false
  placeholder: 'Search...'
  rows: 1
---
::

### Loading Icon

Use the `loading-icon` prop to customize the loading icon. Defaults to `i-lucide-loader-circle`.

::component-code
---
ignore:
  - placeholder
props:
  loading: true
  loadingIcon: 'i-lucide-loader'
  placeholder: 'Search...'
  rows: 1
---
::

::framework-only
#nuxt
:::tip{to="/getting-started/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.loading` key.
:::

#vue
:::tip{to="/getting-started/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.loading` key.
:::
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

## Changelog

:component-changelog
