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

The EditorMentionMenu component displays a menu of user suggestions when typing the `@` character in the editor and inserts the selected mention using the `@tiptap/extension-mention` package.

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
name: 'editor-mention-menu-example'
class: 'p-8'
---
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

::note
You can also pass an array of arrays to the `items` prop to create separated groups of items.
::

### Char

Use the `char` prop to change the trigger character. Defaults to `@`{lang="ts-type"}.

```vue
<template>
  <UEditor v-slot="{ editor }">
    <UEditorMentionMenu :editor="editor" :items="channels" char="#" />
  </UEditor>
</template>
```

### Options

Use the `options` prop to customize the positioning behavior using [Floating UI options](https://floating-ui.com/docs/computeposition#options).

```vue
<template>
  <UEditor v-slot="{ editor }">
    <UEditorMentionMenu
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
