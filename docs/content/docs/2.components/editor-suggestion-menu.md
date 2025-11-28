---
title: EditorSuggestionMenu
description: A command menu that displays formatting and action suggestions when typing the / character in the editor.
category: editor
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/EditorSuggestionMenu.vue
navigation.badge: Soon
---

## Usage

The EditorSuggestionMenu component is used to display a menu of formatting and action suggestions when typing a trigger character in the editor. It must be used inside an [Editor](/docs/components/editor) component's default slot to have access to the editor instance.

Type `/` in the editor to open the suggestion menu.

::component-example
---
elevated: true
collapse: true
name: 'editor-suggestion-menu-example'
class: 'p-8'
---
::

::note
The menu supports keyboard navigation (arrow keys, enter to select, escape to close) and filters items as you type.
::

### Items

Use the `items` prop as an array of objects with the following properties:

- `kind?: "textAlign" | "heading" | "link" | "image" | "blockquote" | "bulletList" | "orderedList" | "codeBlock" | "horizontalRule" | "paragraph" | "clearFormatting" | "duplicate" | "delete" | "moveUp" | "moveDown" | "suggestion" | "mention" | "emoji"`{lang="ts-type"}
- `label?: string`{lang="ts-type"}
- `description?: string`{lang="ts-type"}
- `icon?: string`{lang="ts-type"}
- `type?: "label" | "separator"`{lang="ts-type"}
- `disabled?: boolean`{lang="ts-type"}

::note{to="/docs/components/editor#handlers"}
The `kind` property references a handler defined in the [Editor](/docs/components/editor) component. Handlers wrap TipTap commands and manage their state (active, disabled, etc.). The Editor provides default handlers for common actions (`heading`, `blockquote`, `bulletList`, etc.), but you can add custom handlers using the `handlers` prop on the Editor component.
::

::tip
When using the `kind` property for editor-specific actions, additional properties may be required:

- For `kind: "textAlign"`{lang="ts-type"}: `align: "left" | "center" | "right" | "justify"`{lang="ts-type"}
- For `kind: "heading"`{lang="ts-type"}: `level: 1 | 2 | 3 | 4 | 5 | 6`{lang="ts-type"}
- For `kind: "link"`{lang="ts-type"}: `href?: string`{lang="ts-type"}
- For `kind: "image"`{lang="ts-type"}: `src?: string`{lang="ts-type"}
::

::component-example
---
elevated: true
collapse: true
name: 'editor-suggestion-menu-items-example'
class: 'p-8'
---
::

::note
You can also pass an array of arrays to the `items` prop to create separated groups of items.
::

::tip
Use `type: 'label'` for section headers and `type: 'separator'` for visual dividers to organize commands into logical groups for better discoverability.
::

### Char

Use the `char` prop to change the trigger character. Defaults to `/`{lang="ts-type"}.

```vue
<template>
  <UEditorSuggestionMenu :editor="editor" :items="items" char=">" />
</template>
```

::tip
Common alternatives include `>` for block commands or `+` for insertions.
::

### Options

Use the `options` prop to customize the positioning behavior using [Floating UI options](https://floating-ui.com/docs/computeposition#options).

```vue
<template>
  <UEditorSuggestionMenu
    :editor="editor"
    :items="items"
    :options="{
      placement: 'bottom-start',
      offset: 4
    }"
  />
</template>
```

## API

### Props

:component-props

## Theme

:component-theme

## Changelog

:component-changelog
