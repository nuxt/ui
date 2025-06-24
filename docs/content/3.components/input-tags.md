---
title: InputTags
description: An input element that displays interactive tags.
category: form
links:
  - label: InputTags
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/tags-input
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/InputTags.vue
navigation.badge: Soon
---

## Usage

Use the `v-model` directive to control the value of the InputTags.

::component-code
---
prettier: true
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: ['Vue']
---
::

Use the `default-value` prop to set the initial value when you do not need to control its state.

::component-code
---
prettier: true
ignore:
  - defaultValue
props:
  defaultValue: ['Vue']
---
::

### Placeholder

Use the `placeholder` prop to set a placeholder text.

::component-code
---
props:
  placeholder: 'Enter tags...'
---
::

### Color

Use the `color` prop to change the ring color when the InputTags is focused.

::component-code
---
prettier: true
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: ['Vue']
  color: neutral
  highlight: true
---
::

::note
The `highlight` prop is used here to show the focus state. It's used internally when a validation error occurs.
::

### Variants

Use the `variant` prop to change the appearance of the InputTags.

::component-code
---
prettier: true
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: ['Vue']
  variant: subtle
  color: neutral
  highlight: false
---
::

### Sizes

Use the `size` prop to adjust the size of the InputTags.

::component-code
---
prettier: true
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: ['Vue']
  size: xl
---
::

### Icon

Use the `icon` prop to show an [Icon](/components/icon) inside the InputTags.

::component-code
---
prettier: true
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: ['Vue']
  icon: 'i-lucide-search'
  size: md
  variant: outline
---
::

::note
Use the `leading` and `trailing` props to set the icon position or the `leading-icon` and `trailing-icon` props to set a different icon for each position.
::

### Avatar

Use the `avatar` prop to show an [Avatar](/components/avatar) inside the InputTags.

::component-code
---
prettier: true
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: ['Vue']
  avatar:
    src: 'https://github.com/vuejs.png'
  size: md
  variant: outline
---
::

### Delete Icon

Use the `delete-icon` prop to customize the delete [Icon](/components/icon) in the tags. Defaults to `i-lucide-x`.

::component-code
---
prettier: true
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: ['Vue']
  deleteIcon: 'i-lucide-trash'
---
::

::framework-only
#nuxt
:::tip{to="/getting-started/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.close` key.
:::

#vue
:::tip{to="/getting-started/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.close` key.
:::
::

### Loading

Use the `loading` prop to show a loading icon on the InputTags.

::component-code
---
prettier: true
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: ['Vue']
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
  modelValue: ['Vue']
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

### Disabled

Use the `disabled` prop to disable the InputTags.

::component-code
---
prettier: true
ignore:
  - modelValue
external:
  - modelValue
props:
  modelValue: ['Vue']
  disabled: true
---
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
| -------------------------- | ----------------------------------------------- |
| `inputRef`{lang="ts-type"} | `Ref<InstanceType<typeof TagsInputInput> \| null>`{lang="ts-type"} |

## Theme

:component-theme
