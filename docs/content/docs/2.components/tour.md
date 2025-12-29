---
description: A guided tour component that highlights elements and displays step-by-step instructions.
category: overlay
links:
  - label: Popover
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/popover
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Tour.vue
---

## Usage

The Tour component allows you to create guided tours that highlight specific elements and display step-by-step instructions.

Each step in the tour can target an element by ID, CSS selector, or a ref function. Use the `steps` prop to define your tour steps.

### Steps

Each step in the tour requires a `target` property that can be:
- A string ID selector (e.g., `'#my-element'`)
- A CSS class selector (e.g., `'.my-class'`)
- A ref function that returns an HTMLElement (e.g., `() => myRef.value`)

Each step can also include:
- `title` - The step title
- `description` - A short description
- `body` - Additional body content
- `nextLabel`, `prevLabel`, `finishLabel` - Custom button labels
- `content` - Popover positioning options
- `dismissible` - Whether the step can be dismissed
- `arrow` - Whether to show an arrow

### Loop

Use the `loop` prop to automatically restart the tour when reaching the last step.

### Custom Labels

You can customize button labels for each step using `nextLabel`, `prevLabel`, and `finishLabel` properties on individual steps.

### Modal

Use the `modal` prop to control whether the tour blocks interaction with outside elements. When set to `true`, interaction with outside elements will be disabled and only tour content will be visible to screen readers.

## Examples

::component-example
---
name: 'tour-basic-example'
---
::

::component-example
---
name: 'tour-loop-example'
---
::

::component-example
---
name: 'tour-custom-labels-example'
---
::

::component-example
---
name: 'tour-modal-example'
---
::

## API

### Props

:component-props

### Slots

:component-slots

### Emits

:component-emits

## Theme

:component-theme

## Changelog

:component-changelog

