---
title: EditorMentionMenu
description: A mention menu that displays user suggestions when typing the @ character in the editor.
category: editor
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/EditorMentionMenu.vue
navigation.badge: Soon
---

## Usage

The EditorMentionMenu component is used to display a menu of user suggestions when typing the `@` character in the editor. Mentions are inserted as inline elements that can be styled and linked. It must be used inside an [Editor](/docs/components/editor) component's default slot to have access to the editor instance.

Type `@` followed by a name to search and insert mentions.

::component-example
---
elevated: true
collapse: true
name: 'editor-mention-menu-example'
class: 'p-8'
---
::

::note
The menu filters items as you type and supports keyboard navigation (arrow keys, enter to select, escape to close).
::

::callout{icon="i-custom-tiptap" to="https://tiptap.dev/docs/editor/extensions/nodes/mention" target="_blank"}
Learn more about the Mention extension in the TipTap documentation.
::

### Items

Use the `items` prop as an array of objects with the following properties:

- `label: string`{lang="ts-type"}
- `avatar?: AvatarProps`{lang="ts-type"}
- `icon?: string`{lang="ts-type"}
- `description?: string`{lang="ts-type"}
- `disabled?: boolean`{lang="ts-type"}

::component-example
---
elevated: true
collapse: true
name: 'editor-mention-menu-items-example'
class: 'p-8'
---
::

::tip
Use avatars for user mentions and icons for entities like teams, channels, or tags.
::

### Char

Use the `char` prop to change the trigger character. Defaults to `@`{lang="ts-type"}.

```vue
<template>
  <UEditorMentionMenu :editor="editor" :items="channels" char="#" />
</template>
```

::tip
Use `#` for channels or tags, `+` for adding team members, etc.
::

### Options

Use the `options` prop to customize the positioning behavior using [Floating UI options](https://floating-ui.com/docs/computeposition#options).

```vue
<template>
  <UEditorMentionMenu
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
