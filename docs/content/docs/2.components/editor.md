---
title: Editor
description: A rich text editor component based on TipTap with support for markdown, HTML, and JSON content types.
category: editor
links:
  - label: TipTap
    icon: i-custom-tiptap
    to: https://tiptap.dev/
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Editor.vue
navigation.badge: Soon
---

## Usage

The Editor component provides a powerful rich text editing experience built on [TipTap](https://tiptap.dev/). It supports multiple content formats (JSON, HTML, Markdown), customizable toolbars, drag-and-drop block reordering, slash commands, mentions, emoji picker, and extensible architecture for adding custom functionality.

::component-example
---
source: false
elevated: true
name: 'editor-example'
class: 'relative h-176 overflow-y-auto !p-0 rounded-b-md'
---
::

::callout{icon="i-simple-icons-github" to="https://github.com/nuxt/ui/blob/v4/docs/app/components/content/examples/editor/EditorExample.vue" aria-label="View source code"}
This example demonstrates a production-ready Editor component. Check out the source code on GitHub.
::

### Content

Use the `v-model` directive to control the value of the Editor.

::component-code
---
elevated: true
prettier: true
collapse: true
ignore:
  - modelValue.type
  - modelValue.content
  - class
external:
  - modelValue
class: 'p-8'
props:
  modelValue:
    type: 'doc'
    content:
      - type: 'heading'
        attrs:
          level: 1
        content:
          - type: 'text'
            text: 'Hello World'
      - type: 'paragraph'
        content:
          - type: 'text'
            text: 'This is a '
          - type: 'text'
            marks:
              - type: 'bold'
            text: 'rich text'
          - type: 'text'
            text: ' editor.'
  class: 'w-full min-h-21'
---
::

### Content Type

The Editor automatically detects the content format based on `v-model` type: strings are treated as `html`{lang="ts-type"} and objects as `json`{lang="ts-type"}.

You can explicitly set the format using the `content-type` prop: `json`{lang="ts-type"}, `html`{lang="ts-type"}, or `markdown`{lang="ts-type"}.

::component-code
---
elevated: true
prettier: true
ignore:
  - modelValue
  - contentType
  - class
external:
  - modelValue
class: 'p-8'
props:
  modelValue: |
    <h1>Hello World</h1>
    <p>This is a <strong>rich text</strong> editor.</p>
  contentType: 'html'
  class: 'w-full min-h-21'
---
::

### Extensions

The Editor includes the following extensions by default:

- [**StarterKit**](#starter-kit) - Core editing features (bold, italic, headings, lists, etc.)
- [**Placeholder**](#placeholder) - Show placeholder text (when placeholder prop is provided)
- **Image** - Insert and display images
- **Mention** - Add @ mentions support
- **Markdown** - Parse and serialize markdown (when content type is markdown)

::note
Each built-in extension can be configured using its corresponding prop (`starter-kit`, `placeholder`, `image`, `mention`, `markdown`) to customize its behavior with TipTap options.
::

You can use the `extensions` prop to add additional TipTap extensions to enhance the Editor's capabilities:

```vue
<script setup lang="ts">
import { Emoji } from '@tiptap/extension-emoji'
import TextAlign from '@tiptap/extension-text-align'

const value = ref('<h1>Hello World</h1>\n')
</script>

<template>
  <UEditor
    v-model="value"
    :extensions="[
      Emoji,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      })
    ]"
  />
</template>
```

::tip{to="#with-image-upload"}
Check out the image upload example for creating custom TipTap extensions.
::

### Placeholder

Use the `placeholder` prop to set a placeholder text that shows in empty paragraphs.

::component-code
---
elevated: true
prettier: true
ignore:
  - modelValue
  - contentType
  - placeholder
  - class
external:
  - modelValue
class: 'p-8'
props:
  modelValue: |
    <h1>Hello World</h1>
    <p></p>
  placeholder: 'Start writing...'
  class: 'w-full min-h-21'
---
::

::callout{icon="i-custom-tiptap" to="https://tiptap.dev/docs/editor/extensions/functionality/placeholder" target="_blank"}
Learn more about Placeholder extension in the TipTap documentation.
::

### Starter Kit

Use the `starter-kit` prop to configure the built-in TipTap StarterKit extension which includes common editor features like bold, italic, headings, lists, blockquotes, code blocks, and more.

```vue
<script setup lang="ts">
const value = ref('<h1>Hello World</h1>\n')
</script>

<template>
  <UEditor
    v-model="value"
    :starter-kit="{
      blockquote: false,
      headings: {
        levels: [1, 2, 3, 4]
      },
      dropcursor: {
        color: 'var(--ui-primary)',
        width: 2
      },
      link: {
        openOnClick: false
      }
    }"
  />
</template>
```

::callout{icon="i-custom-tiptap" to="https://tiptap.dev/docs/editor/extensions/functionality/starterkit" target="_blank"}
Learn more about StarterKit extension in the TipTap documentation.
::

### Handlers

Handlers wrap TipTap's built-in commands to provide a unified interface for editor actions. When you add a `kind` property to a [EditorToolbar](/docs/components/editor-toolbar) or [EditorSuggestionMenu](/docs/components/editor-suggestion-menu) item, the corresponding handler executes the TipTap command and manages its state (active, disabled, etc.).

#### Default handlers

The Editor component provides these default handlers, which you can reference in toolbar or suggestion menu items using the `kind` property:

| Handler | Description | Usage |
|---------|-------------|-------|
| `mark`{lang="ts-type"} | Toggle text marks (bold, italic, strike, code, underline) | Requires `mark` property in item |
| `textAlign`{lang="ts-type"} | Set text alignment (left, center, right, justify) | Requires `align` property in item |
| `heading`{lang="ts-type"} | Toggle heading levels (1-6) | Requires `level` property in item |
| `link`{lang="ts-type"} | Add, edit, or remove links | Prompts for URL if not provided |
| `image`{lang="ts-type"} | Insert images | Prompts for URL if not provided |
| `blockquote`{lang="ts-type"} | Toggle blockquotes | |
| `bulletList`{lang="ts-type"} | Toggle bullet lists | Handles list conversions |
| `orderedList`{lang="ts-type"} | Toggle ordered lists | Handles list conversions |
| `codeBlock`{lang="ts-type"} | Toggle code blocks | |
| `horizontalRule`{lang="ts-type"} | Insert horizontal rules | |
| `paragraph`{lang="ts-type"} | Set paragraph format | |
| `undo`{lang="ts-type"} | Undo last change | |
| `redo`{lang="ts-type"} | Redo last undone change | |
| `clearFormatting`{lang="ts-type"} | Remove all formatting | Works with selection or position |
| `duplicate`{lang="ts-type"} | Duplicate a node | Requires `pos` property in item |
| `delete`{lang="ts-type"} | Delete a node | Requires `pos` property in item |
| `moveUp`{lang="ts-type"} | Move a node up | Requires `pos` property in item |
| `moveDown`{lang="ts-type"} | Move a node down | Requires `pos` property in item |
| `suggestion`{lang="ts-type"} | Trigger suggestion menu | Inserts `/` character |
| `mention`{lang="ts-type"} | Trigger mention menu | Inserts `@` character |
| `emoji`{lang="ts-type"} | Trigger emoji picker | Inserts `:` character |

Here's how to use default handlers in toolbar or suggestion menu items:

```vue
<script setup lang="ts">
import type { EditorToolbarItem } from '@nuxt/ui'

const value = ref('<h1>Hello World</h1>\n')

const items: EditorToolbarItem[] = [
  { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold' },
  { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic' },
  { kind: 'heading', level: 1, icon: 'i-lucide-heading-1' },
  { kind: 'heading', level: 2, icon: 'i-lucide-heading-2' },
  { kind: 'textAlign', align: 'left', icon: 'i-lucide-align-left' },
  { kind: 'textAlign', align: 'center', icon: 'i-lucide-align-center' },
  { kind: 'bulletList', icon: 'i-lucide-list' },
  { kind: 'orderedList', icon: 'i-lucide-list-ordered' },
  { kind: 'blockquote', icon: 'i-lucide-quote' },
  { kind: 'link', icon: 'i-lucide-link' }
]
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="value">
    <UEditorToolbar :editor="editor" :items="items" />
  </UEditor>
</template>
```

#### Custom handlers

Use the `handlers` prop to extend or override the default handlers. Custom handlers are merged with the default handlers, allowing you to add new actions or modify existing behavior.

Each handler implements the `EditorHandler`{lang="ts-type"} interface:

```ts
interface EditorHandler {
  /* Checks if the command can be executed in the current editor state */
  canExecute: (editor: Editor, item?: any) => boolean
  /* Executes the command and returns a Tiptap chain */
  execute: (editor: Editor, item?: any) => any
  /* Determines if the item should appear active (used for toggle states) */
  isActive: (editor: Editor, item?: any) => boolean
  /* Optional additional check to disable the item (combined with `canExecute`) */
  isDisabled?: (editor: Editor, item?: any) => boolean
}
```

Here's an example of creating custom handlers:

```vue
<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import type { EditorCustomHandlers, EditorToolbarItem } from '@nuxt/ui'

const value = ref('<h1>Hello World</h1>\n')

const customHandlers = {
  highlight: {
    canExecute: (editor: Editor) => editor.can().toggleHighlight(),
    execute: (editor: Editor) => editor.chain().focus().toggleHighlight(),
    isActive: (editor: Editor) => editor.isActive('highlight'),
    isDisabled: (editor: Editor) => !editor.isEditable
  }
} satisfies EditorCustomHandlers

const items = [
  // Built-in handler
  { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold' },
  // Custom handler
  { kind: 'highlight', icon: 'i-lucide-highlighter' }
] satisfies EditorToolbarItem<typeof customHandlers>[]
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="value" :handlers="customHandlers">
    <UEditorToolbar :editor="editor" :items="items" />
  </UEditor>
</template>
```

::tip{to="#with-image-upload"}
Check out the image upload example for a complete implementation with custom handlers.
::

## Examples

### With toolbar

You can use the [EditorToolbar](/docs/components/editor-toolbar) component to add a `fixed`, `bubble`, or `floating` toolbar to the Editor with common formatting actions.

::component-example
---
elevated: true
collapse: true
prettier: true
name: 'editor-toolbar-example'
class: 'p-8'
---
::

### With drag handle

You can use the [EditorDragHandle](/docs/components/editor-drag-handle) component to add a draggable handle for reordering blocks.

::component-example
---
elevated: true
collapse: true
prettier: true
name: 'editor-drag-handle-example'
class: 'p-8'
---
::

### With suggestion menu

You can use the [EditorSuggestionMenu](/docs/components/editor-suggestion-menu) component to add slash commands for quick formatting and insertions.

::component-example
---
elevated: true
collapse: true
prettier: true
name: 'editor-suggestion-menu-example'
class: 'p-8'
---
::

### With mention menu

You can use the [EditorMentionMenu](/docs/components/editor-mention-menu) component to add @ mentions for tagging users or entities.

::component-example
---
elevated: true
collapse: true
prettier: true
name: 'editor-mention-menu-example'
class: 'p-8'
---
::

### With emoji menu

You can use the [EditorEmojiMenu](/docs/components/editor-emoji-menu) component to add emoji picker support.

::component-example
---
elevated: true
collapse: true
prettier: true
name: 'editor-emoji-menu-example'
class: 'p-8'
---
::

### With image upload

This example demonstrates how to create an image upload feature using the `extensions` prop to register a custom TipTap node and the `handlers` prop to define how the toolbar button triggers the upload flow.

1. Create a Vue component that uses the [FileUpload](/docs/components/file-upload) component:

::component-example
---
preview: false
collapse: true
name: 'editor-image-upload-node'
---
::

2. Create a custom TipTap extension to register the node:

::component-example
---
preview: false
collapse: true
lang: 'ts'
name: 'editor-image-upload'
---
::

::warning
If you encounter a `Adding different instances of a keyed plugin` error when creating a custom extension, you may need to add `prosemirror-state` to the vite `optimizeDeps` include list in your `nuxt.config.ts` file.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  vite: {
    optimizeDeps: {
      include: ['prosemirror-state']
    }
  }
})
```
::

3. Use the custom extension in the Editor:

::component-example
---
elevated: true
collapse: true
prettier: true
name: 'editor-image-upload-example'
class: '!p-0'
---
::

::callout{icon="i-custom-tiptap" to="https://tiptap.dev/docs/editor/extensions/custom-extensions" target="_blank"}
Learn more about creating custom extensions in the TipTap documentation.
::

## API

### Props

:component-props

### Slots

:component-slots

### Emits

:component-emits

### Expose

When accessing the component via a template ref, you can use the following:

| Name | Type |
| ---- | ---- |
| `editor`{lang="ts-type"} | `Ref<Editor \| undefined>`{lang="ts-type"} |

::callout{icon="i-custom-tiptap" to="https://tiptap.dev/docs/editor/api/editor" target="_blank"}
The exposed editor instance is the TipTap Editor API. Check the TipTap documentation for all available methods and properties.
::

## Theme

:component-theme

## Changelog

:component-changelog
