---
description: Display a list of actions in a dropdown menu.
links:
  - label: Menu
    icon: i-simple-icons-headlessui
    to: https://headlessui.com/v1/vue/menu
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/elements/Dropdown.vue
---

## Usage

Pass an array of arrays to the `items` prop of the Dropdown component. Each array represents a group of items. Each item can have the following properties:

- `label` - The label of the item.
- `labelClass` - The class of the item label.
- `icon` - The icon of the item.
- `iconClass` - The class of the item icon.
- `avatar` - The avatar of the item. You can pass all the props of the [Avatar](/components/avatar) component.
- `shortcuts` - The shortcuts of the item.
- `slot` - The slot of the item.
- `disabled` - Whether the item is disabled.
- `class` - The class of the item.
- `click` - The click handler of the item.

You can also pass any property from the [NuxtLink](https://nuxt.com/docs/api/components/nuxt-link#props) component such as `to`, `exact`, etc.

:component-example{component="dropdown-example-basic"}

### Mode

Use the `mode` prop to switch between `click` and `hover` modes.

:component-example{component="dropdown-example-mode"}

### Manual

Use a `v-model:open` to manually control the state. In this example, press :shortcut{value="O"} to toggle the dropdown.

:component-example{component="dropdown-example-open"}

## Popper

Use the `popper` prop to customize the popper instance.

### Arrow

:component-example{component="dropdown-example-arrow"}

### Placement

:component-example{component="dropdown-example-placement"}

### Offset

:component-example{component="dropdown-example-offset"}

## Slots

### `item`

Use the `#item` slot to customize the items content or pass a `slot` property to customize a specific item. You will have access to the `item` property in the slot scope.

:component-example{component="dropdown-example-slot"}

## Props

:component-props

## Config

:component-preset
