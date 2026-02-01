---
title: EditorSuggestionMenu
description: A command menu that displays formatting and action suggestions when typing the / character in the editor.
category: editor
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/EditorSuggestionMenu.vue
navigation.badge: New
---

## Usage

The EditorSuggestionMenu component displays a menu of formatting and action suggestions when typing a trigger character in the editor and executes the corresponding [handler](/docs/components/editor#handlers) when an item is selected.

::note
It uses the `useEditorMenu` composable built on top of TipTap's [Suggestion](https://tiptap.dev/docs/editor/api/utilities/suggestion) utility to filter items as you type and support keyboard navigation (arrow keys, enter to select, escape to close).
::

::caution
It must be used inside an [Editor](/docs/components/editor) component's default slot to have access to the editor instance.
::

::component-example
---
elevated: true
collapse: true
name: 'editor-suggestion-menu-example'
class: 'p-8'
---
::

### Items

Use the `items` prop as an array of objects with the following properties:

- [`kind?: "textAlign" | "heading" | "link" | "image" | "blockquote" | "bulletList" | "orderedList" | "taskList" | "codeBlock" | "horizontalRule" | "paragraph" | "clearFormatting" | "duplicate" | "delete" | "moveUp" | "moveDown" | "suggestion" | "mention" | "emoji"`{lang="ts-type"}](/docs/components/editor#handlers)
- `label?: string`{lang="ts-type"}
- `description?: string`{lang="ts-type"}
- `icon?: string`{lang="ts-type"}
- `type?: "label" | "separator"`{lang="ts-type"}
- `disabled?: boolean`{lang="ts-type"}

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
  <UEditor v-slot="{ editor }">
    <UEditorSuggestionMenu :editor="editor" :items="items" char=">" />
  </UEditor>
</template>
```

### Options

Use the `options` prop to customize the positioning behavior using [Floating UI options](https://floating-ui.com/docs/computeposition#options).

```vue
<template>
  <UEditor v-slot="{ editor }">
    <UEditorSuggestionMenu
      :editor="editor"
      :items="items"
      :options="{
        placement: 'bottom-start',
        offset: 4
      }"
    />
  </UEditor>
</template>
```

## API

### Props

:component-props

## Theme

:component-theme

## Changelog

:component-changelog
