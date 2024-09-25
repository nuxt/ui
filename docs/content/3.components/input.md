---
description: An input element to enter text.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Input.vue
---

## Usage

Use the `v-model` directive to control the value of the Input.

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

### Type

Use the `type` prop to change the input type. Defaults to `text`.

Some types have been implemented in their own components such as [Checkbox](/components/checkbox), [Radio](/components/radio-group), etc. and others have been styled like `file` for example.

::component-code
---
items:
  type:
    - text
    - password
    - number
    - search
    - file
props:
  type: 'number'
---
::

::callout{icon="i-simple-icons-mdnwebdocs" to="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types" target="_blank"}
You can check all the available types on the MDN Web Docs.
::

### Placeholder

Use the `placeholder` prop to set a placeholder text.

::component-code
---
props:
  placeholder: 'Search...'
---
::

### Color

Use the `color` prop to change the ring color when the Input is focused.

::component-code
---
ignore:
  - placeholder
props:
  color: gray
  highlight: true
  placeholder: 'Search...'
---
::

::note
The `highlight` prop is used here to show the focus state. It's used internally when a validation error occurs.
::

### Variant

Use the `variant` prop to change the variant of the Input.

::component-code
---
ignore:
  - placeholder
props:
  color: gray
  variant: subtle
  highlight: false
  placeholder: 'Search...'
---
::

### Size

Use the `size` prop to change the size of the Input.

::component-code
---
ignore:
  - placeholder
props:
  size: xl
  placeholder: 'Search...'
---
::

### Icon

Use the `icon` prop to show an [Icon](/components/icon) inside the Input.

::component-code
---
prettier: true
ignore:
  - placeholder
props:
  icon: 'i-heroicons-magnifying-glass'
  size: md
  variant: outline
  placeholder: 'Search...'
---
::

Use the `leading` and `trailing` props to set the icon position or the `leading-icon` and `trailing-icon` props to set a different icon for each position.

::component-code
---
prettier: true
ignore:
  - placeholder
props:
  trailingIcon: i-heroicons-at-symbol
  placeholder: 'Enter your email'
  size: md
---
::

### Loading

Use the `loading` prop to show a loading icon on the Input.

::component-code
---
ignore:
  - placeholder
props:
  loading: true
  trailing: false
  placeholder: 'Search...'
---
::

### Loading Icon

Use the `loading-icon` prop to customize the loading icon. Defaults to `i-heroicons-arrow-path-20-solid`.

::component-code
---
ignore:
  - placeholder
props:
  loading: true
  loadingIcon: 'i-heroicons-arrow-path-rounded-square'
  placeholder: 'Search...'
---
::

::tip{to="/getting-started/icons#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.loading` key.
::

### Disabled

Use the `disabled` prop to disable the Input.

::component-code
---
ignore:
  - placeholder
props:
  disabled: true
  placeholder: 'Search...'
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
| `inputRef`{lang="ts-type"} | `Ref<HTMLInputElement \| null>`{lang="ts-type"} |

## Theme

:component-theme
