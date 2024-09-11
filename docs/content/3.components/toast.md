---
description: A succinct message to provide information or feedback to the user.
links:
  - label: Toast
    icon: i-custom-radix-vue
    to: https://www.radix-vue.com/components/toast.html
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Toast.vue
navigation:
  badge:
    label: Todo
---

## Usage

Use the [useToast](/composables/use-toast) composable to display a toast in your application.

::important
Make sure to wrap your app with the [App](/components/app) component which uses our [Toaster](https://github.com/nuxt/ui/blob/v3/src/runtime/components/Toaster.vue) component which uses the [ToastProvider](https://www.radix-vue.com/components/toast.html#provider) component from Radix Vue.
::

::tip{to="/components/app#props"}
You can check the `App` component `toaster` prop to see how to configure the Toaster globally.
::

### Title

### Description

### Icon

### Avatar

### Color

### Variant

### Close

### Actions

## Examples

## API

### Props

::component-props
---
ignore:
  - as
  - open
  - defaultOpen
  - to
  - target
  - active
  - activeClass
  - inactiveClass
  - exactActiveClass
  - ariaCurrentValue
  - href
  - rel
  - noRel
  - prefetch
  - prefetchOn
  - noPrefetch
  - prefetchedClass
  - replace
  - exact
  - exactQuery
  - exactHash
  - external
---
::

<!-- ### Slots

:component-slots

### Emits

:component-emits -->

## Theme

:component-theme
