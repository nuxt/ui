---
description: Display a chip indicator on any component.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/elements/Chip.vue
---

## Usage

Wrap any component with the `Chip` component to display a chip indicator.

::component-card
---
code: >-

  <UButton icon="i-heroicons-inbox" color="gray" />
---

#default
:u-button{icon="i-heroicons-inbox" color="gray"}
::

### Size

Use the `size` prop to change the size of the chip.

::component-card
---
props:
  size: '2xl'
code: >-

    <UButton icon="i-heroicons-inbox" color="gray" />
---

#default
:u-button{icon="i-heroicons-inbox" color="gray"}
::

### Color

Use the `color` prop to change the color of the chip.

::component-card
---
props:
  color: 'red'
code: >-

    <UButton icon="i-heroicons-inbox" color="gray" />
---

#default
:u-button{icon="i-heroicons-inbox" color="gray"}
::

### Position

Use the `position` prop to change the position of the chip.

::component-card
---
props:
  position: 'bottom-right'
code: >-

    <UButton icon="i-heroicons-inbox" color="gray" />
---

#default
:u-button{icon="i-heroicons-inbox" color="gray"}
::

### Text

Use the `text` prop to display text in the chip.

::component-card
---
props:
  text: '3'
  size: '2xl'
excludedProps:
  - size
code: >-

    <UButton icon="i-heroicons-inbox" color="gray" />
---

#default
:u-button{icon="i-heroicons-inbox" color="gray"}
::

### Show

Use the `show` prop to conditionally display the chip.

:component-example{component="chip-example-show"}

### Inset

Use the `inset` prop to display the chip inside the component. This is useful when dealing with rounded components.

::component-card
---
props:
  inset: true
code: >-

  <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" alt="Avatar" />
---

#default
:u-avatar{src="https://avatars.githubusercontent.com/u/739984?v=4" alt="Avatar"}
::

## Slots

### `content`

Use the `#content` slot to fully customize the chip.

:component-example{component="chip-example-content-slot"}

## Props

:component-props

## Config

:component-preset
