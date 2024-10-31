---
title: Keyboard Key
description: A kbd element to display a keyboard key.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Kbd.vue
navigation:
  title: Kbd
---

## Usage

### Value

Use the default slot to set the value of the Kbd.

::component-code
---
slots:
  default: K
---
::

You can achieve the same result by using the `value` prop.

::component-code
---
props:
  value: K
---
::

You can pass special keys to the `value` prop that goes through the [`useKbd`](https://github.com/nuxt/ui/blob/v3/src/runtime/composables/useKbd.ts) composable. For example, the `meta` key displays as `⌘` on macOS and `⊞` on other platforms.

::component-code
---
props:
  value: meta
items:
  value:
    - meta
    - win
    - command
    - shift
    - ctrl
    - option
    - alt
    - enter
    - delete
    - backspace
    - escape
    - tab
    - capslock
    - arrowup
    - arrowright
    - arrowdown
    - arrowleft
    - pageup
    - pagedown
    - home
    - end
---
::

### Variant

Use the `variant` prop to change the variant of the Kbd.

::component-code
---
props:
  variant: solid
slots:
  default: K
---
::

### Size

Use the `size` prop to change the size of the Kbd.

::component-code
---
props:
  size: lg
slots:
  default: K
---
::

## Examples

### `class` prop

Use the `class` prop to override the base styles of the Badge.

::component-code
---
props:
  class: 'font-bold rounded-full'
  variant: subtle
slots:
  default: K
---
::

## API

### Props

:component-props

### Slots

:component-slots

## Theme

:component-theme
