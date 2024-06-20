---
title: 'Keyboard Key'
description: Display a keyboard key in a text block.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/elements/Kbd.vue
navigation:
  title: 'Kbd'
---

## Usage

Use the default slot to set the text of the Kbd.

::component-card
---
code: K
---

K
::

You can also use the `value` prop:

::component-card
---
props:
  value: K
---
::

As explained in the [Shortcuts](/getting-started/shortcuts) page, you can use the `metaSymbol` property of the `useShortcuts` composable to display the meta key according to the user's OS.

:component-example{component="kbd-example"}

### Size

Use the `size` prop to change the size of the Kbd.

::component-card
---
props:
  size: 'sm'
code: 'U'
---

U
::

## Props

:component-props

## Config

:component-preset
