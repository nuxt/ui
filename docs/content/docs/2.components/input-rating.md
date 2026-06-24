---
title: InputRating
description: A component to display and collect ratings from users.
category: form
links:
  - label: Rating
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/rating
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/InputRating.vue
navigation.badge: Soon
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

### Length

Use the `length` prop to set the number of stars. Defaults to `5`.

::component-code
---
external:
  - modelValue
props:
  length: 10
  modelValue: 7.5
  step: 0.5
---
::

### Step

Use the `step` prop to control the granularity of each star. Set it to `0.5` to allow half-star ratings.

::component-code
---
external:
  - modelValue
props:
  step: 0.5
  modelValue: 3.5
---
::

### Clearable

Use the `clearable` prop to allow users to clear the rating by clicking on the currently selected value. Defaults to `false`.

::component-code
---
external:
  - modelValue
props:
  clearable: true
  modelValue: 3
---
::

### Hoverable

Use the `hoverable` prop to control whether the rating previews the value when hovering over the stars. Defaults to `true`.

::component-code
---
external:
  - modelValue
props:
  hoverable: false
  modelValue: 3
---
::

### Icon

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

### Empty Icon

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

### Size

Use the `size` prop to change the size of the stars.

::component-code
---
items:
  size:
    - xs
    - sm
    - md
    - lg
    - xl
external:
  - modelValue
props:
  size: md
  modelValue: 4
---
::

### Orientation

Use the `orientation` prop to change the orientation of the rating. Defaults to `horizontal`.

::component-code
---
external:
  - modelValue
props:
  orientation: horizontal
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

### Readonly

Use the `readonly` prop to display a rating without allowing user interaction. Unlike `disabled`, it maintains normal appearance (full opacity, default cursor). Use when you want to display a rating that cannot be changed but should look normal.

::component-code
---
external:
  - modelValue
props:
  readonly: true
  modelValue: 4.5
---
::

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
