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

The EditorDragHandle component wraps TipTap's [Drag Handle extension](https://tiptap.dev/docs/editor/extensions/functionality/drag-handle#page-title) and must be used inside an [Editor](/docs/components/editor) component's default slot to provide drag-and-drop functionality for editor blocks.

::component-example
---
elevated: true
name: 'editor-drag-handle-example'
class: 'p-8'
---
::

::note
The EditorDragHandle component extends the [Button](/docs/components/button) component, so you can pass any property such as `color`, `variant`, `size`, etc.
::

### Icon

Use the `icon` prop to customize the drag handle icon.

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

### Options

Use the `options` prop to customize the positioning behavior. Defaults to `{ strategy: 'absolute', placement: 'left-start' }`.

::note
The offset is calculated automatically to center the handle vertically for small blocks and align it to the top for blocks taller than 40px.
::

```vue
<template>
  <UEditorDragHandle
    :editor="editor"
    :options="{
      placement: 'left'
    }"
  />
</template>
```

::callout{icon="i-simple-icons-floatingui" to="https://floating-ui.com/docs/computeposition#options" target="_blank"}
The options are passed to Floating UI's `computePosition` function to configure positioning middleware.
::

## Examples

### With block actions

Use the default slot to add a dropdown menu with block-level actions.

::component-example
---
elevated: true
collapse: true
name: 'editor-drag-handle-dropdown-example'
class: 'p-8'
---
::

::note
Listen to the `@node-change` event to track the currently hovered node. Use the `mapEditorItems` utility from `@nuxt/ui/utils/editor` to automatically map handler kinds (like `duplicate`, `delete`, `moveUp`, etc.) to their corresponding editor commands with proper state management.
::

### With insert button

Add a button to insert new content at the current block position.

::component-example
---
elevated: true
collapse: true
name: 'editor-drag-handle-add-example'
class: 'p-8'
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
