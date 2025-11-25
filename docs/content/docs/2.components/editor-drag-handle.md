---
title: EditorDragHandle
description: A draggable handle for reordering and selecting blocks in the editor.
category: editor
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/EditorDragHandle.vue
navigation.badge: Soon
---

## Usage

The EditorDragHandle component must be used inside an [Editor](/docs/components/editor) component's default slot to provide drag-and-drop functionality for editor blocks.

Use it to add a draggable handle that appears on hover, allowing users to reorder blocks in the editor.

::component-example
---
collapse: true
name: 'editor-drag-handle-example'
class: 'min-h-80'
---
::

::note
The drag handle automatically positions itself to the left of the block content and hides when not hovering.
::

### Icon

Use the `icon` prop to customize the drag handle icon. Defaults to `appConfig.ui.icons.drag`.

::component-example
---
collapse: true
name: 'editor-drag-handle-icon-example'
class: 'min-h-80'
---
::

::framework-only
#nuxt
:::tip{to="/docs/getting-started/integrations/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.drag` key.
:::

#vue
:::tip{to="/docs/getting-started/integrations/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.drag` key.
:::
::

### Color and variant

Use the `color` and `variant` props to customize the drag handle button appearance.

::component-example
---
collapse: true
name: 'editor-drag-handle-color-example'
class: 'min-h-80'
---
::

### Options

Use the `options` prop to customize the positioning behavior using Floating UI options.

::component-example
---
collapse: true
name: 'editor-drag-handle-options-example'
class: 'min-h-80'
---
::

::callout{icon="i-lucide-info" to="https://floating-ui.com/docs/computeposition" target="_blank"}
The options are passed to Floating UI's `computePosition` function. You can configure placement, offset, flip, shift, and other positioning middleware.
::

## Examples

### With dropdown menu

You can use the default slot to add custom buttons or menus alongside the drag handle.

::component-example
---
collapse: true
name: 'editor-drag-handle-dropdown-example'
class: 'min-h-80'
---
::

::tip
This example shows how to use a dropdown menu to provide block-level actions like duplicate, move, or delete.
::

### With add button

Use the `onClick` function from the slot props to handle click events and trigger actions.

::component-example
---
collapse: true
name: 'editor-drag-handle-add-example'
class: 'min-h-80'
---
::

::note
The `onClick` function returns the current node and its position in the document, which you can use to insert content or perform other operations.
::

### Node change events

Listen to the `@node-change` event to track which node is currently being hovered or selected.

::component-example
---
collapse: true
name: 'editor-drag-handle-node-change-example'
class: 'min-h-80'
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
