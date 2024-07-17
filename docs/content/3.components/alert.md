---
description: Display a callout to draw user attention.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/benjamincanac/ui3/tree/dev/src/runtime/components/Alert.vue
---

## Usage

Use the `title` prop to set the title of the Alert.

::component-code
---
props:
  title: 'Heads up!'
---
::

Use the `description` prop to set the description of the Alert.

::component-code
---
props:
  title: 'Heads up!'
  description: 'You can change the primary color in your app config.'
---
::

### Icon

Use the `icon` prop to show an [Icon](/components/icon).

::component-code
---
ignore:
  - title
  - description
props:
  title: 'Heads up!'
  description: 'You can change the primary color in your app config.'
  icon: 'i-heroicons-command-line'
---
::

### Avatar

Use the `avatar` prop to show an [Avatar](/components/avatar).

::component-code
---
ignore:
  - title
  - description
props:
  title: 'Heads up!'
  description: 'You can change the primary color in your app config.'
  avatar.src: 'https://avatars.githubusercontent.com/u/739984?v=4'
---
::

### Close

Use the `close` prop to display a [Button](/components/button) to dismiss the Alert.

::note
A `close` event will be emitted when the close button is clicked.
::

Use the `close-icon` prop to customize this icon. Defaults to `i-heroicons-x-mark-20-solid`.

::component-code
---
ignore:
  - title
  - description
  - close
props:
  title: 'Heads up!'
  description: 'You can change the primary color in your app config.'
  close: true
  close-icon: ''
---
::

::tip
You can customize this icon globally in your `app.config.ts` under `ui.icons.loading` key.
::

You can pass all the props of the [Button](/components/button) component to customize it.

::component-code
---
ignore:
  - title
  - description
  - close.color
  - close.variant
props:
  title: 'Heads up!'
  description: 'You can change the primary color in your app config.'
  close:
    color: primary
    variant: outline
    class: 'rounded-full'
---
::

### Actions

Use the `actions` prop to add some [Button](/components/button) actions to the Alert.

::component-code
---
ignore:
  - title
  - actions
props:
  title: 'Heads up!'
  description: 'You can change the primary color in your app config.'
  actions:
    - label: Action 1
    - label: Action 2
      color: gray
      variant: subtle
---
::

::tip
Actions will render differently when the description is not set. You can try to remove it.
::

### Style

Use the `color` and `variant` props to change the style of the Alert.

::component-code
---
ignore:
  - title
  - description
  - icon
props:
  color: gray
  variant: outline
  title: 'Heads up!'
  description: 'You can change the primary color in your app config.'
  icon: 'i-heroicons-command-line'
---
::

## API

### Props

:component-props

### Slots

:component-slots

### Events

:component-events

## Theme

:component-theme
