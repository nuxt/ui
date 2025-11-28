---
title: EditorToolbar
description: A customizable toolbar for editor actions that can be displayed as fixed, bubble, or floating menu.
category: editor
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/EditorToolbar.vue
navigation.badge: Soon
---

## Usage

The EditorToolbar component is used to display a toolbar of formatting buttons that automatically sync their active state with the editor content. It must be used inside an [Editor](/docs/components/editor) component's default slot to have access to the editor instance.

::component-example
---
elevated: true
collapse: true
name: 'editor-toolbar-example'
class: 'p-8'
---
::

### Items

Use the `items` prop as an array of objects with the following properties:

- `label?: string`{lang="ts-type"}
- `icon?: string`{lang="ts-type"}
- `color?: "error" | "primary" | "secondary" | "success" | "info" | "warning" | "neutral"`{lang="ts-type"}
- `variant?: "solid" | "outline" | "soft" | "ghost" | "link" | "subtle"`{lang="ts-type"}
- `size?: "xs" | "sm" | "md" | "lg" | "xl"`{lang="ts-type"}
- `kind?: "mark" | "textAlign" | "heading" | "link" | "image" | "blockquote" | "bulletList" | "orderedList" | "codeBlock" | "horizontalRule" | "paragraph" | "undo" | "redo" | "clearFormatting" | "duplicate" | "delete" | "moveUp" | "moveDown" | "suggestion" | "mention" | "emoji"`{lang="ts-type"}
- `disabled?: boolean`{lang="ts-type"}
- `loading?: boolean`{lang="ts-type"}
- `active?: boolean`{lang="ts-type"}
- [`slot?: string`{lang="ts-type"}](#with-custom-button-slots)
- `onClick?: (e: MouseEvent) => void`{lang="ts-type"}
- [`items?: EditorToolbarItem[] | EditorToolbarItem[][]`{lang="ts-type"}](#with-dropdown-menus)
- `class?: any`{lang="ts-type"}

::note{to="/docs/components/editor#handlers"}
The `kind` property references a handler defined in the [Editor](/docs/components/editor) component. Handlers wrap TipTap commands and manage their state (active, disabled, etc.). The Editor provides default handlers for common actions (`mark`, `heading`, `link`, etc.), but you can add custom handlers using the `handlers` prop on the Editor component.
::

::tip
When using the `kind` property for editor-specific actions, additional properties may be required:

- For `kind: "mark"`{lang="ts-type"}: `mark: "bold" | "italic" | "strike" | "code" | "underline"`{lang="ts-type"}
- For `kind: "textAlign"`{lang="ts-type"}: `align: "left" | "center" | "right" | "justify"`{lang="ts-type"}
- For `kind: "heading"`{lang="ts-type"}: `level: 1 | 2 | 3 | 4 | 5 | 6`{lang="ts-type"}
- For `kind: "link"`{lang="ts-type"}: `href?: string`{lang="ts-type"}
- For `kind: "image"`{lang="ts-type"}: `src?: string`{lang="ts-type"}
- For `kind: "duplicate" | "delete" | "moveUp" | "moveDown"`{lang="ts-type"}: `pos: number`{lang="ts-type"}
- For `kind: "clearFormatting" | "suggestion"`{lang="ts-type"}: `pos?: number`{lang="ts-type"}
::

You can pass any property from the [Button](/docs/components/button#props) component such as `color`, `variant`, `size`, etc. but also `active-color` and `active-variant` as items with a `kind` property automatically sync their active state with the editor.

::component-example
---
elevated: true
collapse: true
name: 'editor-toolbar-items-example'
class: 'p-8 h-176 overflow-y-auto'
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

| Layout | Description |
| ------ | ----------- |
| `fixed`{lang="ts-type"} | Always visible toolbar, typically placed above the editor |
| `bubble`{lang="ts-type"} | Contextual menu that appears when text is selected |
| `floating`{lang="ts-type"} | Menu that appears on empty lines or blocks |

::component-example
---
elevated: true
collapse: true
name: 'editor-toolbar-layout-example'
class: 'p-8'
---
::

::callout{icon="i-custom-tiptap"}
The bubble and floating layouts use TipTap's [BubbleMenu](https://tiptap.dev/docs/editor/extensions/functionality/bubble-menu) and [FloatingMenu](https://tiptap.dev/docs/editor/extensions/functionality/floating-menu) extensions. Check the TipTap documentation for advanced positioning options.
::

### Should show

When using `bubble`{lang="ts-type"} or `floating`{lang="ts-type"} layouts, use the `should-show` prop to control when the toolbar appears. This function receives context about the editor state and returns a boolean.

::component-example
---
elevated: true
collapse: true
name: 'editor-toolbar-should-show-example'
class: 'p-8'
---
::

### Options

When using `bubble`{lang="ts-type"} or `floating`{lang="ts-type"} layouts, use the `options` prop to customize the positioning behavior using [Floating UI options](https://floating-ui.com/docs/computeposition#options).

```vue
<template>
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
</template>
```

### Color and variant

Use the `color` and `variant` props to customize the toolbar button styles.

::component-code
---
elevated: true
prettier: true
collapse: true
ignore:
  - editor
  - items
  - class
external:
  - editor
  - items
class: 'p-8'
props:
  color: 'primary'
  variant: 'soft'
  editor: {}
  items: [[{ kind: 'mark', mark: 'bold', icon: 'i-lucide-bold' }]]
---
::

Use the `active-color` and `active-variant` props to customize the active state styling.

::component-code
---
elevated: true
prettier: true
collapse: true
ignore:
  - editor
  - items
  - class
external:
  - editor
  - items
class: 'p-8'
props:
  activeColor: 'success'
  activeVariant: 'solid'
  editor: {}
  items: [[{ kind: 'mark', mark: 'bold', icon: 'i-lucide-bold' }]]
---
::

### Size

Use the `size` prop to change the size of toolbar buttons. Defaults to `sm`.

::component-code
---
elevated: true
prettier: true
collapse: true
ignore:
  - editor
  - items
  - class
external:
  - editor
  - items
class: 'p-8'
items:
  size:
    - xs
    - sm
    - md
    - lg
props:
  size: 'md'
  editor: {}
  items: [[{ kind: 'mark', mark: 'bold', icon: 'i-lucide-bold' }]]
---
::

## Examples

### Within a card

Place a fixed toolbar in a card header for a document-style editing interface.

::component-example
---
elevated: true
collapse: true
name: 'editor-toolbar-navbar-example'
class: 'min-h-96'
---
::

### Bubble menu on text selection

Use `layout="bubble"` to create a contextual toolbar that appears when text is selected.

::component-example
---
elevated: true
collapse: true
name: 'editor-toolbar-bubble-example'
class: 'p-8'
---
::

::note
The bubble menu automatically positions itself near the selection and includes flip and shift middleware for optimal positioning.
::

### Floating menu for empty blocks

Use `layout="floating"` to create a menu that appears on empty lines.

::component-example
---
elevated: true
collapse: true
name: 'editor-toolbar-floating-example'
class: 'p-8'
---
::

::tip
Combine with the `should-show` prop to control when the floating menu appears, such as only on empty paragraphs.
::

### With custom button slots

You can use slots to customize specific toolbar items.

::component-example
---
elevated: true
collapse: true
name: 'editor-toolbar-custom-slot-example'
class: 'p-8'
---
::

Use the `slot` property on an item to specify a named slot, then provide a matching template:

```vue
<UEditorToolbar :editor="editor" :items="[[{ slot: 'link' }]]">
  <template #link>
    <MyCustomLinkButton :editor="editor" />
  </template>
</UEditorToolbar>
```

### With dropdown menus

Create dropdown menus by adding an `items` property to toolbar items.

::component-example
---
elevated: true
collapse: true
name: 'editor-toolbar-dropdown-example'
class: 'p-8'
---
::

::note
Dropdowns automatically show the active child item's icon when an option is selected.
::

### Image-specific toolbar

Create context-specific toolbars that appear only for certain node types.

::component-example
---
elevated: true
collapse: true
name: 'editor-toolbar-image-example'
class: 'min-h-96'
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
