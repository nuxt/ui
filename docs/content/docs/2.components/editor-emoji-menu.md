---
title: EditorEmojiMenu
description: "An emoji picker menu that displays emoji suggestions when typing the : character in the editor."
category: editor
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/EditorEmojiMenu.vue
navigation.badge: Soon
---

## Usage

The EditorEmojiMenu component is used to display a menu of emoji suggestions when typing the `:` character in the editor. Emojis are inserted as text characters or custom nodes depending on the extension configuration. It must be used inside an [Editor](/docs/components/editor) component's default slot to have access to the editor instance.

Type `:` followed by an emoji name to search and insert emojis.

::component-example
---
elevated: true
collapse: true
name: 'editor-emoji-menu-example'
class: 'p-8'
---
::

::note
The menu filters items as you type and supports keyboard navigation (arrow keys, enter to select, escape to close).
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

::tip
Use the `gitHubEmojis` export from `@tiptap/extension-emoji` for a comprehensive emoji set with over 1800 emojis.
::

### Char

Use the `char` prop to change the trigger character. Defaults to `:`{lang="ts-type"}.

```vue
<template>
  <UEditorEmojiMenu :editor="editor" :items="items" char=";" />
</template>
```

### Options

Use the `options` prop to customize the positioning behavior using [Floating UI options](https://floating-ui.com/docs/computeposition#options).

```vue
<template>
  <UEditorEmojiMenu
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
