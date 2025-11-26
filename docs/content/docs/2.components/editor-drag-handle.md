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

The EditorDragHandle component must be used inside an [Editor](/docs/components/editor) component's default slot to provide drag-and-drop functionality for editor blocks. It allows users to reorder content by dragging blocks to new positions.

Hover over a block's left edge to reveal the drag handle.

::component-example
---
elevated: true
collapse: true
name: 'editor-drag-handle-example'
class: 'min-h-40 sm:py-8'
---
::

::note
The handle automatically positions itself to the left of block content and tracks the currently hovered block.
::

### Icon

Use the `icon` prop to customize the drag handle icon. Defaults to `appConfig.ui.icons.drag`.

```vue
<template>
  <UEditorDragHandle :editor="editor" icon="i-lucide-move" />
</template>
```

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

Use the `color` and `variant` props to customize the drag handle button styling.

```vue
<template>
  <UEditorDragHandle :editor="editor" color="primary" variant="soft" />
</template>
```

::tip
The handle inherits from Button component, so all color and variant combinations are available.
::

### Options

Use the `options` prop to customize the positioning behavior using Floating UI options.

```vue
<template>
  <UEditorDragHandle
    :editor="editor"
    :options="{
      placement: 'left',
      offset: 8
    }"
  />
</template>
```

::tip{to="https://floating-ui.com/docs/computeposition" target="_blank"}
The options are passed to Floating UI's `computePosition` function. You can configure strategy, placement, offset, flip, shift, and other positioning middleware.
::

## Examples

### With block actions

Use the default slot to add a dropdown menu with block-level actions like duplicate, move, or delete.

::component-example
---
elevated: true
collapse: true
name: 'editor-drag-handle-dropdown-example'
class: 'min-h-40 sm:py-8'
---
::

::tip
Access the current block via the `@node-change` event to perform operations on the selected node.
::

### With insert button

Add a button to insert new content at the current block position.

::component-example
---
elevated: true
collapse: true
name: 'editor-drag-handle-add-example'
class: 'min-h-40 sm:py-8'
---
::

::note
Use the `onClick` slot prop to get the current node and position, then insert content using the editor's chain commands.
::

### Tracking the active node

Listen to the `@node-change` event to track which block is currently being hovered.

::component-example
---
elevated: true
collapse: true
name: 'editor-drag-handle-node-change-example'
class: 'min-h-40 sm:py-8'
---
::

The event payload includes the node type and its position in the document:

```ts
interface NodeChangeEvent {
  node: Node
  pos: number
}
```

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
