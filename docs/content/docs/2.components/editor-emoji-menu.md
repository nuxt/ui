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

The EditorEmojiMenu component must be used inside an [Editor](/docs/components/editor) component's default slot to provide emoji picker functionality.

Type `:` followed by an emoji name to search and insert emojis into your content.

::component-example
---
collapse: true
name: 'editor-emoji-menu-example'
class: 'min-h-80'
---
::

::note
The emoji menu filters items as you type emoji names or tags and supports keyboard navigation.
::

::callout{icon="i-custom-tiptap" to="https://tiptap.dev/docs/editor/extensions/functionality/emoji" target="_blank"}
This component requires the Emoji extension from TipTap to be added to the Editor's extensions prop.
::

### Items

Use the `items` prop to define the available emojis. Each item should include the emoji character, name, shortcodes, and optional tags.

::component-example
---
collapse: true
name: 'editor-emoji-menu-items-example'
class: 'min-h-80'
---
::

Each item should have:
- `name`{lang="ts-type"}: The emoji name (required)
- `emoji`{lang="ts-type"}: The emoji character to insert
- `shortcodes`{lang="ts-type"}: Array of shortcode strings for search
- `tags`{lang="ts-type"}: Array of tag strings for additional search terms
- `group`{lang="ts-type"}: Optional group name
- `fallbackImage`{lang="ts-type"}: Optional fallback image URL

::tip
You can use the `gitHubEmojis` export from `@tiptap/extension-emoji` for a complete emoji set.
::

### Trigger character

Use the `char` prop to change the trigger character. Defaults to `:`.

::component-example
---
collapse: true
name: 'editor-emoji-menu-char-example'
class: 'min-h-80'
---
::

### Options

Use the `options` prop to customize the positioning behavior using Floating UI options.

::component-example
---
collapse: true
name: 'editor-emoji-menu-options-example'
class: 'min-h-80'
---
::

::tip{to="https://floating-ui.com/docs/computeposition" target="_blank"}
The options are passed to Floating UI's `computePosition` function. You can configure strategy, placement, offset, flip, shift, and other positioning middleware.
::

## Examples

### GitHub emojis

Use the GitHub emoji set from TipTap for a comprehensive emoji picker.

::component-example
---
collapse: true
name: 'editor-emoji-menu-github-example'
class: 'min-h-80'
---
::

::note
This example uses the `gitHubEmojis` export from `@tiptap/extension-emoji` which includes over 1800 emojis.
::

### Custom emoji sets

Create your own custom emoji set with specific emojis for your use case.

::component-example
---
collapse: true
name: 'editor-emoji-menu-custom-example'
class: 'min-h-80'
---
::

::tip
Custom emoji sets are useful when you want to limit the available emojis or provide domain-specific emojis.
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
