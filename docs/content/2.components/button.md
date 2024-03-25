---
description: Create a button with icon or link capabilities.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/elements/Button.vue
---

## Usage

Use the default slot to set the text of the Button.

::component-card
---
code: Button
---

Button
::

You can also use the `label` prop.

::component-card
---
props:
  label: Button
---
::

### Style

Use the `color` and `variant` props to change the visual style of the Button.

::component-card
---
props:
  color: 'primary'
  variant: 'solid'
code: Button
---

Button
::

Besides all the colors from the `ui.colors` object, you can also use the `white`, `gray` and `black` colors with their pre-defined variants.

#### White

::component-card
---
backgroundClass: 'bg-gray-50 dark:bg-gray-800'
props:
  color: 'white'
  variant: 'solid'
options:
  - name: variant
    restriction: expected
    values:
      - solid
      - ghost
excludedProps:
  - color
code: Button
---

Button
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
      - ghost
      - link
excludedProps:
  - color
code: Button
---

Button
::

#### Black

::component-card
---
props:
  color: 'black'
  variant: 'solid'
options:
  - name: variant
    restriction: expected
    values:
      - solid
      - link
excludedProps:
  - color
code: Button
---

Button
::

### Size

Use the `size` prop to change the size of the Button.

::component-card
---
props:
  size: 'sm'
code: Button
---

Button
::

### Rounded

To customize the border radius of the Button, you can use the `ui` prop.

::component-card
---
props:
  ui:
    rounded: 'rounded-full'
excludedProps:
  - ui
code: Button
---

Button
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
  icon: 'i-heroicons-pencil-square'
  size: 'sm'
  color: 'primary'
  variant: 'solid'
  label: Button
  trailing: false
excludedProps:
  - icon
  - label
---
::

The `label` as prop or slot is optional so you can use the Button as an icon-only button.

::component-card
---
props:
  icon: 'i-heroicons-pencil-square'
  size: 'sm'
  color: 'primary'
  square: true
  variant: 'solid'
excludedProps:
  - icon
  - square
---
::

### Disabled

Use the `disabled` prop to disable the Button.

::component-card
---
props:
  disabled: true
code: Button
---

Button
::

### Loading

Use the `loading` prop to show a loading icon and disable the Button.

Use the `loading-icon` prop to set a different icon or change it globally in `ui.button.default.loadingIcon`. Defaults to `i-heroicons-arrow-path-20-solid`.

::component-card
---
props:
  loading: true
code: Button
---

Button
::

### Block

Use the `block` prop to make the Button fill the width of its container.

::component-card
---
props:
  block: true
code: Button
---

Button
::

### Link

Use the `to` prop to make the Button a link.

::component-card
---
props:
  to: 'https://volta.net'
  target: '_blank'
code: Button
---

Button
::

You can also pass any property from the [NuxtLink](https://nuxt.com/docs/api/components/nuxt-link#props) component such as `target`, `exact`, etc.

### Padded

Use the `padded` prop to remove the padding of the Button.

::component-card
---
props:
  padded: false
baseProps:
  color: 'gray'
  variant: 'link'
  icon: 'i-heroicons-x-mark-20-solid'
---
::

### Square

Use the `square` prop to force the Button to have the same padding horizontally and vertically.

::component-card
---
props:
  square: true
baseProps:
  label: 'Button'
  color: 'gray'
  variant: 'solid'
---
::

### Truncate

Use the `truncate` prop to truncate the label of the Button.

::component-card
---
props:
  truncate: true
  class: 'w-20'
  label: 'Button with a long text'
excludedProps:
  - class
---
::

## Group

To stack buttons as a group, use the `ButtonGroup` component.

- To size all the buttons equally, pass the `size` prop
- To change the orientation of the buttons, set the `orientation` prop to `vertical`
- To adjust the rounded or the shadow around buttons, customize with `ui.buttonGroup.rounded` or `ui.buttonGroup.shadow`

::component-card{slug="UButtonGroup"}
---
props:
  size: 'sm'
  orientation: 'horizontal'
code: |
  <UButton label="Action" color="white" />
    <UButton icon="i-heroicons-chevron-down-20-solid" color="gray" />
---

#default
:u-button{label="Action" color="white"}
:u-button{icon="i-heroicons-chevron-down-20-solid" color="gray"}
::

This can also work with an [Input](/components/input) component for example:

::component-card{slug="UButtonGroup"}
---
props:
  size: 'sm'
  orientation: 'horizontal'
code: |
  <UInput />
  <UButton icon="i-heroicons-clipboard-document" color="gray" />
---

#default
:u-input
:u-button{icon="i-heroicons-clipboard-document" color="gray"}
::

## Slots

### `leading`

Use the `#leading` slot to set the content of the leading icon.

::component-card
---
slots:
  leading: <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" size="2xs" />
baseProps:
  color: 'gray'
props:
  label: Button
  color: 'gray'
excludedProps:
  - color
---

#leading
  :u-avatar{src="https://avatars.githubusercontent.com/u/739984?v=4" size="2xs"}
::

### `trailing`

Use the `#trailing` slot to set the content of the trailing icon.

::component-card
---
slots:
  trailing: <UIcon name="i-heroicons-arrow-right-20-solid" class="w-5 h-5" />
props:
  label: Button
  color: 'gray'
excludedProps:
  - color
---

#trailing
  :u-icon{name="i-heroicons-arrow-right-20-solid" class="w-5 h-5"}
::

## Props

::tabs
  :component-props{label="Button"}
  :component-props{label="ButtonGroup" slug="UButtonGroup"}
::

## Config

::tabs
  :component-preset{label="Button"}
  :component-preset{label="ButtonGroup" slug="ButtonGroup"}
::
