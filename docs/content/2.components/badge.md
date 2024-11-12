---
description: Display a short text to represent a status or a category.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/elements/Badge.vue
---

## Usage

Use the default slot to set the text of the Badge.

::component-card
---
code: Badge
---

Badge
::

You can also use the `label` prop:

::component-card
---
props:
  label: Badge
---
::

### Style

Use the `color` and `variant` props to change the visual style of the Badge.

- `variant` can be `solid` (default), `outline`, `soft` or `subtle`.

::component-card
---
props:
  color: 'primary'
  variant: 'solid'
code: Badge
---

Badge
::

Besides all the colors from the `ui.colors` object, you can also use the `white` and `black` colors with their pre-defined variants.

#### White

::component-card
---
props:
  color: 'white'
  variant: 'solid'
options:
  - name: variant
    restriction: expected
    values:
      - solid
excludedProps:
  - color
code: Badge
---

Badge
::

#### Gray

::component-card
---
props:
  color: 'gray'
  variant: 'solid'
options:
  - name: variant
    restriction: expected
    values:
      - solid
excludedProps:
  - color
code: Badge
---

Badge
::

#### Black

::component-card
---
props:
  color: 'black'
  variant: 'solid'
options:
  - name: variant
    restriction: only
    values:
      - solid
excludedProps:
  - color
code: Badge
---

Badge
::

### Size

Use the `size` prop to change the size of the Badge.

::component-card
---
props:
  size: 'sm'
code: Badge
---

Badge
::

### Rounded

To customize the border radius of the Badge, you can use the `ui` prop.

::component-card
---
props:
  ui:
    rounded: 'rounded-full'
excludedProps:
  - ui
code: Badge
---

Badge
::

::callout{icon="i-heroicons-light-bulb"}
You can customize the whole [preset](#preset) by using the `ui` prop.
::

### Icon

Use any icon from [Iconify](https://icones.js.org) by setting the `icon` prop by using this pattern: `i-{collection_name}-{icon_name}`.

Use the `leading` and `trailing` props to set the icon position or the `leading-icon` and `trailing-icon` props to set a different icon for each position.

::component-card
---
props:
  icon: 'i-heroicons-rocket-launch'
  size: 'sm'
  color: 'primary'
  variant: 'solid'
  label: Badge
  trailing: false
options:
  - name: variant
    restriction: only
    values:
      - solid
excludedProps:
  - icon
  - label
---
::

## Slots

### `leading`

Use the `#leading` slot to set the content of the leading icon.

::component-card
---
slots:
  leading: <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" size="3xs" />
baseProps:
  color: 'gray'
props:
  label: Badge
  color: 'gray'
excludedProps:
  - color
---

#leading
  :u-avatar{src="https://avatars.githubusercontent.com/u/739984?v=4" size="3xs"}
::

### `trailing`

Use the `#trailing` slot to set the content of the trailing icon.

::component-card
---
slots:
  trailing: <UIcon name="i-heroicons-rocket-launch" class="w-4 h-4" />
props:
  label: Badge
  color: 'gray'
excludedProps:
  - color
---

#trailing
  :u-icon{name="i-heroicons-rocket-launch" class="w-4 h-4"}
::

## Props

:component-props

## Config

:component-preset
