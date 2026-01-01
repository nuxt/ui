---
title: EditorEmojiMenu
description: "An emoji picker menu that displays emoji suggestions when typing the : character in the editor."
category: editor
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/EditorEmojiMenu.vue
navigation.badge: New
---

## Usage

The EditorEmojiMenu component displays a menu of emoji suggestions when typing the `:` character in the editor and inserts the selected emoji. It works alongside the `@tiptap/extension-emoji` package to provide emoji support.

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
name: 'editor-emoji-menu-example'
class: 'p-8'
---
::

::warning
The `@tiptap/extension-emoji` package is not installed by default, you need to install it separately.
::

::callout{icon="i-custom-tiptap" to="https://tiptap.dev/docs/editor/extensions/nodes/emoji" target="_blank"}
Learn more about the Emoji extension in the TipTap documentation.
::

### Items

Use the `items` prop as an array of objects with the following properties:

- `name: string`{lang="ts-type"}
- `emoji: string`{lang="ts-type"}
- `shortcodes?: string[]`{lang="ts-type"}
- `tags?: string[]`{lang="ts-type"}
- `group?: string`{lang="ts-type"}
- `fallbackImage?: string`{lang="ts-type"}

::component-example
---
elevated: true
collapse: true
name: 'editor-emoji-menu-items-example'
class: 'p-8'
---
::

::note
You can also pass an array of arrays to the `items` prop to create separated groups of items.
::

### Char

Use the `char` prop to change the trigger character. Defaults to `:`{lang="ts-type"}.

```vue
<template>
  <UEditor v-slot="{ editor }">
    <UEditorEmojiMenu :editor="editor" :items="items" char=";" />
  </UEditor>
</template>
```

### Options

Use the `options` prop to customize the positioning behavior using [Floating UI options](https://floating-ui.com/docs/computeposition#options).

```vue
<template>
  <UEditor v-slot="{ editor }">
    <UEditorEmojiMenu
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
