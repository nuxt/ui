---
title: EditorDragHandle
description: A draggable handle for reordering and selecting blocks in the editor.
category: editor
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/EditorDragHandle.vue
navigation.badge: New
---

## Usage

The EditorDragHandle component provides drag-and-drop functionality for reordering editor blocks using the `@tiptap/extension-drag-handle-vue-3` package.

::caution
It must be used inside an [Editor](/docs/components/editor) component's default slot to have access to the editor instance.
::

It extends the [Button](/docs/components/button) component, so you can pass any property such as `color`, `variant`, `size`, etc.

::component-example
---
collapse: true
elevated: true
name: 'editor-drag-handle-example'
class: 'p-8'
---
::

::callout{icon="i-custom-tiptap" to="https://tiptap.dev/docs/editor/extensions/functionality/drag-handle-vue" target="_blank"}
Learn more about the Drag Handle extension in the TipTap documentation.
::

### Icon

Use the `icon` prop to customize the drag handle icon.

```vue
<template>
  <UEditor v-slot="{ editor }">
    <UEditorDragHandle :editor="editor" icon="i-lucide-move" />
  </UEditor>
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
  <UEditor v-slot="{ editor }">
    <UEditorDragHandle
      :editor="editor"
      :options="{
        placement: 'left'
      }"
    />
  </UEditor>
</template>
```

## Examples

### With dropdown menu

Use the default slot to add a [DropdownMenu](/docs/components/dropdown-menu) with block-level actions like duplicate, delete, move up/down, or transform blocks into different types.

Listen to the `@node-change` event to track the currently hovered node and its position, then use `editor.chain().setMeta('lockDragHandle', open).run()`{lang="ts-type"} to lock the handle position while the menu is open.

::component-example
---
elevated: true
collapse: true
name: 'editor-drag-handle-dropdown-menu-example'
class: 'p-8'
---
::

::note
This example uses the `mapEditorItems` utility from `@nuxt/ui/utils/editor` to automatically map handler kinds (like `duplicate`, `delete`, `moveUp`, etc.) to their corresponding editor commands with proper state management.
::

### With suggestion menu

Use the default slot to add a [Button](/docs/components/button) next to the drag handle to open the [EditorSuggestionMenu](/docs/components/editor-suggestion-menu).

Call the `onClick` slot function to get the current node position, then use `handlers.suggestion?.execute(editor, { pos: node?.pos }).run()`{lang="ts-type"} to insert new blocks at that position.

::component-example
---
elevated: true
collapse: true
name: 'editor-drag-handle-suggestion-menu-example'
class: '!p-0'
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
