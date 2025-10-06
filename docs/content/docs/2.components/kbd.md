---
title: Kbd
description: A kbd element to display a keyboard key.
category: element
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Kbd.vue
---

## Usage

Use the default slot to set the value of the Kbd.

::component-code
---
slots:
  default: K
---
::

### Value

Use the `value` prop to set the value of the Kbd.

::component-code
---
props:
  value: K
---
::

You can pass special keys to the `value` prop that goes through the [`useKbd`](https://github.com/nuxt/ui/blob/v4/src/runtime/composables/useKbd.ts) composable. For example, the `meta` key displays as `⌘` on macOS and `Ctrl` on other platforms.

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

### Color

Use the `color` prop to change the color of the Kbd.

::component-code
---
props:
  color: neutral
slots:
  default: K
---
::

### Variant

Use the `variant` prop to change the variant of the Kbd.

::component-code
---
props:
  color: neutral
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

## Changelog

:component-changelog
