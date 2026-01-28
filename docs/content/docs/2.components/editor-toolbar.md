---
title: EditorToolbar
description: A customizable toolbar for editor actions that can be displayed as fixed, bubble, or floating menu.
category: editor
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/EditorToolbar.vue
navigation.badge: New
---

## Usage

The EditorToolbar component displays a toolbar of formatting buttons that automatically sync their active state with the editor content. It supports three layout modes using the `@tiptap/vue-3/menus` package:
- `fixed`{lang="ts-type"} (always visible)
- `bubble`{lang="ts-type"} (appears on text selection)
- `floating`{lang="ts-type"} (appears on empty lines)

::caution
It must be used inside an [Editor](/docs/components/editor) component's default slot to have access to the editor instance.
::

::component-example
---
elevated: true
collapse: true
name: 'editor-toolbar-example'
class: 'p-8'
---
::

::callout{icon="i-custom-tiptap"}
The bubble and floating layouts use TipTap's [BubbleMenu](https://tiptap.dev/docs/editor/extensions/functionality/bubble-menu) and [FloatingMenu](https://tiptap.dev/docs/editor/extensions/functionality/floating-menu) extensions.
::

### Items

Use the `items` prop as an array of objects with the following properties:

- `label?: string`{lang="ts-type"}
- `icon?: string`{lang="ts-type"}
- `color?: "error" | "primary" | "secondary" | "success" | "info" | "warning" | "neutral"`{lang="ts-type"}
- `activeColor?: "error" | "primary" | "secondary" | "success" | "info" | "warning" | "neutral"`{lang="ts-type"}
- `variant?: "solid" | "outline" | "soft" | "ghost" | "link" | "subtle"`{lang="ts-type"}
- `activeVariant?: "solid" | "outline" | "soft" | "ghost" | "link" | "subtle"`{lang="ts-type"}
- `size?: "xs" | "sm" | "md" | "lg" | "xl"`{lang="ts-type"}
- [`kind?: "mark" | "textAlign" | "heading" | "link" | "image" | "blockquote" | "bulletList" | "orderedList" | "taskList" | "codeBlock" | "horizontalRule" | "paragraph" | "undo" | "redo" | "clearFormatting" | "duplicate" | "delete" | "moveUp" | "moveDown" | "suggestion" | "mention" | "emoji"`{lang="ts-type"}](/docs/components/editor#handlers)
- `disabled?: boolean`{lang="ts-type"}
- `loading?: boolean`{lang="ts-type"}
- `active?: boolean`{lang="ts-type"}
- `tooltip?: TooltipProps`{lang="ts-type"}
- [`slot?: string`{lang="ts-type"}](#with-link-popover)
- `onClick?: (e: MouseEvent) => void`{lang="ts-type"}
- `items?: EditorToolbarItem[] | EditorToolbarItem[][]`{lang="ts-type"}
- `class?: any`{lang="ts-type"}

You can pass any property from the [Button](/docs/components/button#props) component such as `color`, `variant`, `size`, etc.

::component-example
---
elevated: true
collapse: true
name: 'editor-toolbar-items-example'
class: 'p-8'
---
::

::note
You can also pass an array of arrays to the `items` prop to create separated groups of items.
::

::tip
Each item can take an `items` array of objects with the same properties as the `items` prop to create a [DropdownMenu](/docs/components/dropdown-menu).
::

### Layout

Use the `layout` prop to change how the toolbar is displayed. Defaults to `fixed`{lang="ts-type"}.

::component-example
---
elevated: true
collapse: true
name: 'editor-toolbar-layout-example'
class: 'p-8'
options:
  - name: layout
    label: Layout
    default: bubble
    items:
      - fixed
      - bubble
      - floating
---
::

### Options

When using `bubble`{lang="ts-type"} or `floating`{lang="ts-type"} layouts, use the `options` prop to customize the positioning behavior using [Floating UI options](https://floating-ui.com/docs/computeposition#options).

```vue
<template>
  <UEditor v-slot="{ editor }">
    <UEditorToolbar
      :editor="editor"
      :items="items"
      layout="bubble"
      :options="{
        placement: 'top',
        offset: 8,
        flip: { padding: 8 },
        shift: { padding: 8 }
      }"
    />
  </UEditor>
</template>
```

### Should Show

When using `bubble`{lang="ts-type"} or `floating`{lang="ts-type"} layouts, use the `should-show` prop to control when the toolbar appears. This function receives context about the editor state and returns a boolean.

```vue
<template>
  <UEditor v-slot="{ editor }">
    <UEditorToolbar
      :editor="editor"
      :items="items"
      layout="bubble"
      :should-show="({ view, state }) => {
        const { selection } = state
        const { from, to } = selection
        const text = state.doc.textBetween(from, to)
        return view.hasFocus() && !selection.empty && text.length > 10
      }"
    />
  </UEditor>
</template>
```

## Examples

### With image toolbar

Use the `should-show` prop to create context-specific toolbars that appear only for certain node types. This example shows a `bubble` toolbar with download and delete actions that only appears when an image is selected.

::component-example
---
elevated: true
collapse: true
name: 'editor-toolbar-image-example'
class: 'p-8'
---
::

### With link popover

This example demonstrates how to create a custom link popover using the `slot` property on toolbar items and the [Popover](/docs/components/popover) component.

1. Create a Vue component that wraps a [Popover](/docs/components/popover) with link editing functionality:

::component-example
---
preview: false
collapse: true
name: 'editor-link-popover'
---
::

2. Use the custom component in the toolbar with a named slot:

::component-example
---
elevated: true
collapse: true
name: 'editor-toolbar-custom-slot-example'
class: 'p-8'
---
::

## API

### Props

:component-props

### Slots

:component-slots

## Theme

:component-theme

## Changelog

:component-changelog
