---
title: InputTags
description: Tag inputs render tags inside an input, followed by an actual text input.
links:
  - label: InputTags
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/tags-input
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/InputTags.vue
---

## Usage

Use the `v-model` directive to control the value of the InputTags.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: ['Apple']
---
::

Use the `default-value` prop to set the initial value when you do not need to control its state.

::component-code
---
ignore:
  - defaultValue
props:
  defaultValue: ['Apple']
---
::

### Placeholder

Use the `placeholder` prop to set a placeholder text.

::component-code
---
props:
  placeholder: 'Enter a number'
---
::

### Variants

You can use the `variant` prop to change the appearance of the InputTags. Available variants include `outline`, `soft`, and `subtle`.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: ['Apple']
  variant: subtle
  color: neutral
  highlight: false
---
::

### Sizes

Use the `size` prop to adjust the size of the InputTags. Available sizes include `xs`, `sm`, `md`, `lg`, and `xl`.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: ['Apple']
  size: xl
---
::

### Icon

Use the `icon` prop to show an [Icon](/components/icon) inside the InputTags.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue:
    - Apple
  icon: 'i-lucide-search'
---
::

### Disabled

Use the `disabled` prop to disable the InputTags.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: ['Apple']
  disabled: true
---
::

### Loading

Use the `loading` prop to show a loading icon on the InputTags.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue:
    - Apple
  loading: true
  trailing: false
---
::

### Loading Icon

Use the `loading-icon` prop to customize the loading icon. Defaults to `i-lucide-loader-circle`.

::component-code
---
prettier: true
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue:
    - Apple
  loading: true
  loadingIcon: 'i-lucide-loader'
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

## Examples

### Within a FormField

You can use the InputTags within a [FormField](/components/form-field) component to display a label, help text, required indicator, etc.

::component-example
---
name: 'input-tags-form-field-example'
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

| Name                       | Type                                            |
|----------------------------|-------------------------------------------------|
| `inputRef`{lang="ts-type"} | `Ref<HTMLInputElement \| null>`{lang="ts-type"} |

## Theme

:component-theme
