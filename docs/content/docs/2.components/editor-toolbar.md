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

The EditorToolbar component must be used inside an [Editor](/docs/components/editor) component's default slot to have access to the editor instance. It provides formatting buttons that automatically sync their active state with the editor content.

::component-example
---
elevated: true
collapse: true
name: 'editor-toolbar-example'
class: 'p-8'
---
::

::note
Select some text in the editor to see the bubble toolbar appear with formatting options.
::

### Items

Use the `items` prop to define the toolbar buttons and dropdowns. Items are passed as an array of arrays, where each inner array represents a group of items separated by dividers.

Each item can be:

- An **editor item** with a `kind`{lang="ts-type"} property (e.g., `{ kind: 'bold', icon: 'i-lucide-bold' }`{lang="ts-type"})
- A **button item** with standard button props (e.g., `{ icon: 'i-lucide-save', onClick: () => {} }`{lang="ts-type"})
- A **dropdown item** with an `items`{lang="ts-type"} array for submenus

::component-example
---
elevated: true
collapse: true
name: 'editor-toolbar-items-example'
class: 'p-8'
---
::

::tip
Editor items automatically sync their active and disabled states with the editor. The toolbar uses handlers from the Editor component to execute commands.
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

::callout{icon="i-custom-tiptap" to="https://tiptap.dev/docs/editor/extensions/functionality/bubble-menu" target="_blank"}
The bubble and floating layouts use TipTap's BubbleMenu and FloatingMenu extensions. Check the TipTap documentation for advanced positioning options.
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

When using `bubble`{lang="ts-type"} or `floating`{lang="ts-type"} layouts, use the `options` prop to customize the positioning behavior using Floating UI options.

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

::tip{to="https://floating-ui.com/docs/computeposition" target="_blank"}
The options are passed to Floating UI's `computePosition` function. You can configure strategy, placement, offset, flip, shift, and other positioning middleware.
::

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
