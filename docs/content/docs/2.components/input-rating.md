---
description: A component to display and collect ratings from users.
category: form
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/InputRating.vue
---

## Usage

Use the `v-model` directive to control the rating value of the InputRating component.

::component-code
---
external:
  - modelValue
props:
  modelValue: 3
---
::

Use the `default-value` prop to set the initial value when you do not need to control its state.

::component-code
---
ignore:
  - defaultValue
props:
  defaultValue: 3
---
::

### Half Stars

Use the `allow-half` prop to enable half-star ratings. When enabled, clicking on the left half of a star will set a half-star value.

::component-code
---
external:
  - modelValue
props:
  allowHalf: true
  modelValue: 3.5
---
::

### Readonly

Use the `readonly` prop to display a rating without allowing user interaction. This is useful for displaying existing ratings. The component maintains its normal appearance but prevents user interaction.

::component-code
---
props:
  readonly: true
  modelValue: 4.5
---
::

### Custom Icons

Use the `icon` prop to customize the icon used for stars. Defaults to `i-lucide-star`.

::component-code
---
external:
  - modelValue
props:
  icon: 'i-lucide-heart'
  modelValue: 4
---
::

Use the `empty-icon` prop to customize the icon used for empty stars. If not provided, uses the same icon as `icon`.

::component-code
---
external:
  - modelValue
props:
  icon: 'i-lucide-star'
  emptyIcon: 'i-lucide-star-off'
  modelValue: 3
---
::

::framework-only
#nuxt
:::tip{to="/docs/getting-started/integrations/icons/nuxt#theme"}
You can customize the default star icon globally in your `app.config.ts` under `ui.icons.star` key.
:::

#vue
:::tip{to="/docs/getting-started/integrations/icons/vue#theme"}
You can customize the default star icon globally in your `vite.config.ts` under `ui.icons.star` key.
:::
::

### Max Value

Use the `max` prop to set the maximum number of stars. Defaults to `5`.

::component-code
---
external:
  - modelValue
props:
  max: 10
  modelValue: 7.5
  allowHalf: true
---
::

### Color

Use the `color` prop to change the color of the filled stars.

::component-code
---
external:
  - modelValue
props:
  color: primary
  modelValue: 4
---
::

::component-code
---
external:
  - modelValue
props:
  color: success
  modelValue: 4
---
::

::component-code
---
external:
  - modelValue
props:
  color: warning
  modelValue: 4
---
::

::component-code
---
external:
  - modelValue
props:
  color: error
  modelValue: 4
---
::

### Size

Use the `size` prop to change the size of the stars.

::component-code
---
external:
  - modelValue
props:
  size: xs
  modelValue: 4
---
::

::component-code
---
external:
  - modelValue
props:
  size: sm
  modelValue: 4
---
::

::component-code
---
external:
  - modelValue
props:
  size: md
  modelValue: 4
---
::

::component-code
---
external:
  - modelValue
props:
  size: lg
  modelValue: 4
---
::

::component-code
---
external:
  - modelValue
props:
  size: xl
  modelValue: 4
---
::

### Disabled

Use the `disabled` prop to disable the InputRating component. When disabled, the component has reduced opacity (75%) and shows a `not-allowed` cursor to indicate it's not interactive.

::component-code
---
external:
  - modelValue
props:
  disabled: true
  modelValue: 3
---
::

### Readonly vs Disabled

Both `readonly` and `disabled` prevent user interaction, but they have different visual appearances:

- **`readonly`**: Maintains normal appearance (full opacity, default cursor). Use when you want to display a rating that cannot be changed but should look normal.
- **`disabled`**: Shows reduced opacity (75%) and a `not-allowed` cursor. Use when you want to clearly indicate that the rating is temporarily unavailable or inactive.

::component-code
---
external:
  - modelValue
props:
  readonly: true
  modelValue: 4.5
---
::

::component-code
---
external:
  - modelValue
props:
  disabled: true
  modelValue: 4.5
---
::

### Focus Ring

The InputRating component displays a focus ring by default for accessibility purposes, helping keyboard users identify the focused element. If you need to remove the focus ring for design reasons, you can override it using the `ui` prop:

::component-code
---
external:
  - modelValue
props:
  modelValue: 3
  ui:
    star: 'focus-within:ring-0 focus-within:ring-offset-0'
---
::

::note
Removing the focus ring may impact accessibility for keyboard users. Consider providing alternative visual indicators when removing the default focus ring.
::

## Examples

### With Form Integration

The InputRating component integrates seamlessly with forms and supports form validation.

::component-code
---
hide:
  - class
ignore:
  - class
external:
  - modelValue
props:
  name: rating
  required: true
  modelValue: 0
---
::

### Reading the Value

You can read the `modelValue` externally to use it in your application logic.

```vue
<script setup lang="ts">
const rating = ref(0)

watch(rating, (value) => {
  console.log('Rating changed:', value)
  // Save to database, update state, etc.
})
</script>

<template>
  <UInputRating v-model="rating" />
  <p>Current rating: {{ rating }}</p>
</template>
```

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

