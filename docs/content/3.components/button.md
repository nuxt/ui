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
  color: neutral
slots:
  default: Button
---
::

### Variant

Use the `variant` prop to change the variant of the Button.

::component-code
---
props:
  color: neutral
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
  icon: i-lucide-rocket
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
  trailingIcon: i-lucide-arrow-right
  size: md
slots:
  default: Button
---
::

The `label` as prop or slot is optional so you can use the Button as an icon-only button.

::component-code
---
props:
  icon: i-lucide-search
  size: md
  color: primary
  variant: solid
---
::

### Avatar

Use the `avatar` prop to show an [Avatar](/components/avatar) inside the Button.

::component-code
---
prettier: true
props:
  avatar:
    src: 'https://github.com/nuxt.png'
  size: md
  color: neutral
  variant: outline
slots:
  default: |

    Button
---
::

The `label` as prop or slot is optional so you can use the Button as an avatar-only button.

::component-code
---
prettier: true
props:
  avatar:
    src: 'https://github.com/nuxt.png'
  size: md
  color: neutral
  variant: outline
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

Use the `loading-icon` prop to customize the loading icon. Defaults to `i-lucide-refresh-cw`.

::component-code
---
props:
  loading: true
  loadingIcon: 'i-lucide-repeat-2'
slots:
  default: Button
---
Button
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
  icon: i-lucide-rocket
  color: neutral
  variant: outline
  ui:
    leadingIcon: 'text-[var(--ui-primary)]'
slots:
  default: |

    Button
---
::

## API

### Props

:component-props

::callout{icon="i-simple-icons-github" to="https://github.com/nuxt/ui/blob/v3/src/runtime/components/Link.vue#L13"}
The `Button` component extends the `Link` component. Check out the source code on GitHub.
::

### Slots

:component-slots

## Theme

:component-theme
