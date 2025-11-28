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

Use the `items` prop to define the available emojis. Each item should include the emoji character, name, shortcodes, and optional tags.

::component-example
---
elevated: true
collapse: true
name: 'editor-emoji-menu-items-example'
class: 'p-8'
---
::

Each item supports these properties:

| Property | Description |
| -------- | ----------- |
| `name`{lang="ts-type"} | The emoji name used for searching (required) |
| `emoji`{lang="ts-type"} | The emoji character to insert |
| `shortcodes`{lang="ts-type"} | Array of shortcode strings for search (e.g., `['smile', 'happy']`) |
| `tags`{lang="ts-type"} | Array of tags for additional search terms |
| `group`{lang="ts-type"} | Optional group name for organization |
| `fallbackImage`{lang="ts-type"} | Fallback image URL for custom emojis |

::tip
Use the `gitHubEmojis` export from `@tiptap/extension-emoji` for a comprehensive emoji set with over 1800 emojis.
::

### Trigger character

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

## Examples

### With GitHub emojis

Use the GitHub emoji set from TipTap for a comprehensive collection.

::component-example
---
elevated: true
collapse: true
name: 'editor-emoji-menu-github-example'
class: 'p-8'
---
::

```ts
import { gitHubEmojis } from '@tiptap/extension-emoji'

const items = gitHubEmojis
```

### With custom emojis

Create a custom emoji set for your specific use case.

::component-example
---
elevated: true
collapse: true
name: 'editor-emoji-menu-custom-example'
class: 'p-8'
---
::

::tip
Custom sets are useful for limiting available emojis, adding brand-specific reactions, or domain-specific symbols.
::

## API

### Props

:component-props

## Theme

:component-theme

## Changelog

:component-changelog
