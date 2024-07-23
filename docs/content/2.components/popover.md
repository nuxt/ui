---
description: Display a non-modal dialog that floats around a trigger element.
links:
  - label: 'Popover'
    icon: i-simple-icons-headlessui
    to: 'https://headlessui.com/v1/vue/popover'
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/overlays/Popover.vue
---

## Usage

:component-example{component="popover-example"}

### Mode

Use the `mode` prop to switch between `click` and `hover` modes.

:component-example{component="popover-example-mode"}

### Manual

Use a `v-model:open` to manually control the state. In this example, press :shortcut{value="O"} to toggle the popover.

:component-example{component="popover-example-open"}

### Overlay

:component-example{component="popover-example-overlay"}

## Popper

Use the `popper` prop to customize the popper instance.

### Arrow

:component-example{component="popover-example-arrow"}

### Placement

:component-example{component="popover-example-placement"}

### Offset

:component-example{component="popover-example-offset"}

## Slots

### `panel`

Use the `#panel` slot to fill the content of the panel. You will have access to the `open` property and the `close` method in the slot scope.

:component-example{component="popover-example-slot"}

## Props

:component-props

## Config

:component-preset
