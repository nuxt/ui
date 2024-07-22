---
description: Display togglable accordion panels.
links:
  - label: Disclosure
    icon: i-simple-icons-headlessui
    to: 'https://headlessui.com/v1/vue/disclosure'
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/elements/Accordion.vue
---

## Usage

Pass an array to the `items` prop of the Accordion component. Each item can have any property from the [Button](/components/button) component such as `label`, `icon`, `color`, `variant`, `size`, etc. but also:

- `slot` - A key to customize the item with a slot.
- `content` - The content to display in the panel by default.
- `disabled` - Determines whether the item is disabled or not.
- `defaultOpen` - Determines whether the item is initially open or closed.
- `closeOthers` - Determines whether the item click close others or not. **It only works with multiple mode**.

:component-example{component="accordion-example-basic"}

### Style

You can also pass any prop from the [Button](/components/button) component directly to the Accordion component to style the buttons.

::component-card
---
baseProps:
  items:
    - label: '1. What is Nuxt UI?'
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
    - label: '2. Getting Started'
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
    - label: '3. Theming'
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
    - label: '4. Components'
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
props:
  color: 'primary'
  variant: 'soft'
  size: 'sm'
options:
  - name: color
    restriction: included
    values:
      - gray
      - white
      - black
  - name: variant
    restriction: included
    values:
      - solid
      - outline
      - ghost
      - soft
      - link
  - name: size
    restriction: included
    values:
      - 2xs
      - xs
      - sm
      - md
      - lg
      - xl
---
::

### Icon

Use any icon from [Iconify](https://icones.js.org) by setting the `open-icon` and `close-icon` props by using this pattern: `i-{collection_name}-{icon_name}` or change it globally in `ui.accordion.default.openIcon` and `ui.accordion.default.closeIcon`.

You can also set them to `null` to hide the icons.

::component-card
---
baseProps:
  items:
    - label: '1. What is Nuxt UI?'
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
    - label: '2. Getting Started'
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
    - label: '3. Theming'
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
    - label: '4. Components'
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
props:
  openIcon: 'i-heroicons-plus'
  closeIcon: 'i-heroicons-minus'
excludedProps:
  - openIcon
  - closeIcon
---
::

### Multiple

Use the `multiple` prop to to allow multiple elements to be opened at the same time.

::component-card
---
baseProps:
  items:
    - label: 'What is Nuxt UI?'
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
    - label: 'Getting Started'
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
    - label: 'Theming'
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
    - label: 'Components'
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
props:
  multiple: true
excludedProps:
  - defaultOpen
---
::

### Open

Use the `default-open` prop to open all items by default. Works better when the `multiple` prop is set to `true`.

::component-card
---
baseProps:
  items:
    - label: 'What is Nuxt UI?'
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
    - label: 'Getting Started'
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
    - label: 'Theming'
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
    - label: 'Components'
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
props:
  defaultOpen: true
  multiple: true
excludedProps:
  - defaultOpen
  - multiple
---
::

## Slots

You can use slots to customize the buttons and items content of the Accordion.

### `default`

Use the `#default` slot to customize the trigger buttons. You will have access to the `item`, `index`, `open` properties and `close` method in the slot scope.

:component-example{component="accordion-example-default-slot"}

### `item`

Use the `#item` slot to customize the items content or pass a `slot` property to customize a specific item. You will have access to the `item`, `index`, `open` properties and `close` method in the slot scope.

:component-example{component="accordion-example-item-slot"}

## Props

:component-props

## Config

:component-preset
