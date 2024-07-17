---
description: Create a button with icon or link capabilities.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/benjamincanac/ui3/tree/dev/src/runtime/components/Button.vue
---

## Usage

Use the default slot to set the label of the Button.

::component-code
---
slots:
  default: Button
---
::

You can achieve the same result by using the `label` prop.

::component-code
---
props:
  label: Button
---
::

### Link

You can pass any property from [NuxtLink](https://nuxt.com/docs/api/components/nuxt-link#props) component such as `to`, `target`, etc.

::component-code
---
ignore:
  - label
  - target
props:
  to: https://github.com/nuxt/ui
  target: _blank
slots:
  default: Button
---
::

### Style

Use the `color` and `variant` props to change the style of the Button.

::component-code
---
props:
  color: gray
  variant: solid
slots:
  default: Button
---
::

### Size

Use the `size` prop to change the size of the Button.

::component-code
---
props:
  size: md
slots:
  default: Button
---
::

### Icon

Use the `icon` prop to show an [Icon](/components/icon) inside the Button.

::component-code
---
props:
  icon: i-heroicons-rocket-launch
  size: md
  color: primary
  variant: solid
slots:
  default: Button
---
::

Use the `leading` and `trailing` props to set the icon position or the `leading-icon` and `trailing-icon` props to set a different icon for each position.

::component-code
---
props:
  leading-icon: ''
  trailing-icon: i-heroicons-arrow-right
  size: md
slots:
  default: Button
---
::

The `label` as prop or slot is optional so you can use the Button as an icon-only button.

::component-code
---
props:
  icon: i-heroicons-magnifying-glass
  size: md
  color: primary
  variant: solid
---
::

### Loading

Use the `loading` prop to show a loading icon and disable the Button.

Use the `loading-icon` prop to customize this icon. Defaults to `i-heroicons-arrow-path-20-solid`.

::component-code
---
props:
  loading: true
  loading-icon: ''
  trailing: false
slots:
  default: Button
---

Button
::

::tip
You can customize this icon globally in your `app.config.ts` under `ui.icons.loading` key.
::

### Disabled

Use the `disabled` prop to disable the Button.

::component-code
---
props:
  disabled: true
slots:
  default: Button
---

Button
::

## Examples

### `class` prop

Use the `class` prop to override the base styles of the Button.

::component-code
---
props:
  class: 'font-bold rounded-full'
slots:
  default: Button
---
::

### `ui` prop

Use the `ui` prop to override the slots styles of the Button.

::component-code
---
ignore:
  - ui
props:
  icon: i-heroicons-rocket-launch
  color: gray
  variant: outline
  ui:
    leadingIcon: 'text-primary-500 dark:text-primary-400'
slots:
  default: Button
---
::

## API

### Props

::component-props
---
ignore:
  - to
  - target
  - activeClass
  - inactiveClass
  - exactActiveClass
  - ariaCurrentValue
  - href
  - rel
  - noRel
  - prefetch
  - noPrefetch
  - prefetchedClass
  - replace
  - exact
  - exactQuery
  - exactHash
  - external
  - active
---
::

::callout{icon="i-simple-icons-github" to="https://github.com/benjamincanac/ui3/blob/dev/src/runtime/components/Link.vue#L13"}
The `Button` component extends the `Link` component. Check out the source code on GitHub.
::

### Slots

:component-slots

## Theme

:component-theme
