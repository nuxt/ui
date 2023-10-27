---
description: Display content that appears on hover next to an element.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/overlays/Tooltip.vue
---

## Usage

:component-example{component="tooltip-example"}

## Popper

Use the `popper` prop to customize the popper instance.

### Arrow

:component-example{component="tooltip-example-arrow"}

### Placement

:component-example{component="tooltip-example-placement"}

### Offset

:component-example{component="tooltip-example-offset"}

## Slots

### `text`

Use the `#text` slot to override the content of the text.

::component-card
---
slots:
  text: <span class="italic">Hello World!</span>
---

#text
  [Hello World!]{.italic}
::

## Props

:component-props

## Config

:component-preset
