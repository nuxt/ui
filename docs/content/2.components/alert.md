---
description: Display an alert element to draw attention.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/elements/Alert.vue
---

## Usage

Pass a `title` to your Alert.

::component-card
---
props:
  title: 'Heads up!'
---
::

### Description

You can add a `description` in addition of the `title`.

::component-card
---
baseProps:
  title: 'Heads up!'
props:
  description: 'You can add components to your app using the cli.'
---
::

### Icon

Use any icon from [Iconify](https://icones.js.org) by setting the `icon` prop by using this pattern: `i-{collection_name}-{icon_name}` or change it globally in `ui.alert.default.icon`.

::component-card
---
baseProps:
  title: 'Heads up!'
props:
  icon: 'i-heroicons-command-line'
  description: 'You can add components to your app using the cli.'
excludedProps:
  - icon
---
::

### Avatar

Use the [avatar](/components/avatar) prop as an `object` and configure it with any of its props.

::component-card
---
baseProps:
  title: 'Heads up!'
props:
  description: 'You can add components to your app using the cli.'
  avatar:
    src: 'https://avatars.githubusercontent.com/u/739984?v=4'
excludedProps:
  - avatar
---
::

### Style

Use the `color` and `variant` props to change the visual style of the Alert.

- `color` can be any color from the `ui.colors` object or `white` (default).
- `variant` can be `solid` (default), `outline`, `soft` or `subtle`.

::component-card
---
baseProps:
  title: 'Heads up!'
  description: 'You can add components to your app using the cli.'
props:
  icon: 'i-heroicons-command-line'
  color: 'primary'
  variant: 'solid'
options:
  - name: color
    restriction: included
    values:
      - white
excludedProps:
  - icon
---
::

### Close

Use the `close-button` prop to hide or customize the close button on the Alert.

You can pass all the props of the [Button](/components/button) component to customize it through the `close-button` prop or globally through `ui.alert.default.closeButton`.

It defaults to `null` which means no close button will be displayed. A `close` event will be emitted when the close button is clicked.

::component-card
---
baseProps:
  title: 'Heads up!'
props:
  closeButton:
    icon: 'i-heroicons-x-mark-20-solid'
    color: 'gray'
    variant: 'link'
    padded: false
excludedProps:
  - closeButton
---
::

### Actions

Use the `actions` prop to add actions to the Alert.

Like for `closeButton`, you can pass all the props of the [Button](/components/button) component plus a `click` function in the action but also customize the default style for the actions globally through `ui.alert.default.actionButton`.

::component-card
---
baseProps:
  title: 'Heads up!'
props:
  actions:
    - label: Action 1
    - variant: 'ghost'
      color: 'gray'
      label: Action 2
excludedProps:
  - actions
---
::

Actions will render differently whether you have a `description` set.

::component-card
---
baseProps:
  title: 'Heads up!'
  description: 'You can add components to your app using the cli.'
props:
  actions:
    - variant: 'solid'
      color: 'primary'
      label: Action 1
    - variant: 'outline'
      color: 'primary'
      label: Action 2
excludedProps:
  - actions
---
::

## Slots

### `title` / `description`

Use the `#title` and `#description` slots to customize the Alert.

This can be handy when you want to display HTML content. To achieve this, you can define those slots and use the `v-html` directive.

:component-example{component="alert-example-html"}

### `icon`

Use the `#icon` slot to customize the displayed icon.

:component-example{component="alert-example-icon"}

### `avatar`

Use the `#avatar` slot to customize the displayable avatar.

:component-example{component="alert-example-avatar"}

### `actions`

Use the `#actions` slot to add custom user interaction elements.

## Props

:component-props

## Config

:component-preset
