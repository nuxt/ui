---
title: Keyboard Key
description: Display a keyboard key in a text block.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/benjamincanac/ui3/tree/dev/src/runtime/components/Kbd.vue
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

You can pass special keys to the `value` prop that goes through the [`useKbd`](https://github.com/benjamincanac/ui3/blob/dev/src/runtime/composables/useKbd.ts) composable. For example, the `meta` key will display as `⌘` on macOS and `Ctrl` on other platforms.

::component-code
---
props:
  value: meta
items:
  value:
    - meta
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

### Style

Use the `variant` prop to change the style of the Kbd.

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
  size: md
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
