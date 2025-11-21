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

The EditorToolbar component must be used inside an [Editor](/docs/components/editor) component's default slot to have access to the editor instance.

Use the `items` prop to define the toolbar buttons and dropdowns. Each item can be an editor command (with a `kind` property) or a regular button.

::component-example
---
collapse: true
name: 'editor-toolbar-basic-example'
class: 'min-h-80'
---
::

### Items

The `items` prop accepts an array of toolbar items or an array of arrays for grouping items with separators.

Each item can be:

- An **editor item** with a `kind`{lang="ts-type"} property (e.g., `{ kind: 'bold', icon: 'i-lucide-bold' }`{lang="ts-type"})
- A **button item** with standard button props (e.g., `{ icon: 'i-lucide-save', onClick: () => {} }`{lang="ts-type"})
- A **dropdown item** with an `items`{lang="ts-type"} array for submenus

::component-example
---
collapse: true
name: 'editor-toolbar-items-example'
class: 'min-h-80'
---
::

::tip
Editor items automatically sync their active and disabled states with the editor. The toolbar uses handlers from the Editor component to execute commands.
::

### Layout

Use the `layout` prop to change how the toolbar is displayed. Defaults to `fixed`.

Available layouts:
- `fixed`{lang="ts-type"} (default): always visible toolbar
- `bubble`{lang="ts-type"}: contextual menu that appears on text selection
- `floating`{lang="ts-type"}: menu that appears on empty blocks

::component-example
---
collapse: true
name: 'editor-toolbar-layout-example'
class: 'min-h-80'
---
::

::callout{icon="i-custom-tiptap" to="https://tiptap.dev/docs/editor/extensions/functionality/bubble-menu" target="_blank"}
The bubble and floating layouts use TipTap's BubbleMenu and FloatingMenu extensions. Check the TipTap documentation for advanced positioning options.
::

### Should show

When using `bubble` or `floating` layouts, use the `should-show` prop to control when the toolbar appears.

::component-example
---
collapse: true
name: 'editor-toolbar-should-show-example'
class: 'min-h-80'
---
::

::note
The `should-show` function receives the editor, view, state, and other useful properties to determine visibility.
::

### Options

When using `bubble` or `floating` layouts, use the `options` prop to customize the positioning behavior using Floating UI options.

::component-example
---
collapse: true
name: 'editor-toolbar-options-example'
class: 'min-h-80'
---
::

::tip{to="https://floating-ui.com/docs/computeposition" target="_blank"}
The options are passed to Floating UI's `computePosition` function. You can configure strategy, placement, offset, flip, shift, and other positioning middleware.
::

### Color and variant

Use the `color` and `variant` props to customize the toolbar button styles.

::component-code
---
prettier: true
collapse: true
ignore:
  - editor
  - items
  - class
external:
  - editor
  - items
class: 'min-h-80'
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
prettier: true
collapse: true
ignore:
  - editor
  - items
  - class
external:
  - editor
  - items
class: 'min-h-80'
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
prettier: true
collapse: true
ignore:
  - editor
  - items
  - class
external:
  - editor
  - items
class: 'min-h-80'
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

### Fixed toolbar in navbar

You can place a fixed toolbar in a navbar or header for a consistent interface.

::component-example
---
collapse: true
name: 'editor-toolbar-navbar-example'
class: 'min-h-96'
---
::

### Bubble menu on text selection

Use `layout="bubble"` to create a contextual toolbar that appears when text is selected.

::component-example
---
collapse: true
name: 'editor-toolbar-bubble-example'
class: 'min-h-80'
---
::

::note
The bubble menu automatically positions itself near the selection and includes flip and shift middleware for optimal positioning.
::

### Floating menu for empty blocks

Use `layout="floating"` to create a menu that appears on empty lines.

::component-example
---
collapse: true
name: 'editor-toolbar-floating-example'
class: 'min-h-80'
---
::

::tip
Combine with the `should-show` prop to control when the floating menu appears, such as only on empty paragraphs.
::

### With custom button slots

You can use slots to customize specific toolbar items.

::component-example
---
collapse: true
name: 'editor-toolbar-custom-slot-example'
class: 'min-h-80'
---
::

::tip{to="#slots"}
Use the `#item` slot to customize all items, or `#{{ item.slot }}` to customize a specific item.
::

### With dropdown menus

Create dropdown menus by adding an `items` property to toolbar items.

::component-example
---
collapse: true
name: 'editor-toolbar-dropdown-example'
class: 'min-h-80'
---
::

::note
Dropdowns automatically show the active child item's icon when an option is selected.
::

### Image-specific toolbar

Create context-specific toolbars that appear only for certain node types.

::component-example
---
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
