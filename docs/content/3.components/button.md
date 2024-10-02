---
description: A button element that can act as a link or trigger an action.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Button.vue
---

## Usage

### Label

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

You can pass any property from the [Link](/components/link#props) component such as `to`, `target`, etc.

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

### Color

Use the `color` prop to change the color of the Button.

::component-code
---
props:
  color: gray
slots:
  default: Button
---
::

### Variant

Use the `variant` prop to change the variant of the Button.

::component-code
---
props:
  color: gray
  variant: outline
slots:
  default: Button
---
::

### Size

Use the `size` prop to change the size of the Button.

::component-code
---
props:
  size: xl
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
  trailingIcon: i-heroicons-arrow-right
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

::component-code
---
props:
  loading: true
  trailing: false
slots:
  default: Button
---
Button
::

Use the `loading-auto` prop to show the loading icon automatically while the `@click` promise is pending.

:component-example{name="button-loading-auto-example"}

This also works with the [Form](/components/form) component.

:component-example{name="button-loading-auto-form-example"}

### Loading Icon

Use the `loading-icon` prop to customize the loading icon. Defaults to `i-heroicons-arrow-path-20-solid`.

::component-code
---
props:
  loading: true
  loadingIcon: 'i-heroicons-arrow-path-rounded-square'
slots:
  default: Button
---
Button
::

::tip{to="/getting-started/icons#theme"}
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
prettier: true
ignore:
  - ui
  - color
  - variant
  - icon
props:
  icon: i-heroicons-rocket-launch
  color: gray
  variant: outline
  ui:
    leadingIcon: 'text-primary-500 dark:text-primary-400'
slots:
  default: |

    Button
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
  - prefetchOn
  - noPrefetch
  - prefetchedClass
  - replace
  - exact
  - exactQuery
  - exactHash
  - external
  - active
  - onClick
---
::

::callout{icon="i-simple-icons-github" to="https://github.com/nuxt/ui/blob/v3/src/runtime/components/Link.vue#L13"}
The `Button` component extends the `Link` component. Check out the source code on GitHub.
::

### Slots

:component-slots

## Theme

:component-theme
