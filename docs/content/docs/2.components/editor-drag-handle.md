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

The EditorDragHandle component wraps TipTap's [Drag Handle extension](https://tiptap.dev/docs/editor/extensions/functionality/drag-handle) to provide drag-and-drop functionality for editor blocks. It must be used inside an [Editor](/docs/components/editor) component's default slot to have access to the editor instance.

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

Use the `options` prop to customize the positioning behavior using [Floating UI options](https://floating-ui.com/docs/computeposition#options).

::note
The offset is automatically calculated to center the handle for small blocks and align it to the top for taller blocks.
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

## Examples

### With dropdown menu

Use the default slot to add a dropdown menu with block-level actions and listen to the `@node-change` event to track the currently hovered node.

::component-example
---
elevated: true
collapse: true
name: 'editor-drag-handle-dropdown-menu-example'
class: 'p-8'
---
::

::note
Use the `mapEditorItems` utility from `@nuxt/ui/utils/editor` to automatically map handler kinds (like `duplicate`, `delete`, `moveUp`, etc.) to their corresponding editor commands with proper state management.
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
