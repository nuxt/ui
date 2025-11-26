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

The Editor component provides a powerful rich text editing experience built on TipTap. It supports multiple content formats (JSON, HTML, Markdown), customizable toolbars, drag-and-drop block reordering, slash commands, mentions, emoji picker, and extensible architecture for adding custom functionality.

::component-example
---
source: false
elevated: true
name: 'editor-example'
class: 'relative h-176 overflow-y-auto !p-0 rounded-b-md'
---
::

::callout{icon="i-simple-icons-github" to="https://github.com/nuxt/ui/blob/v4/docs/app/components/content/examples/editor/EditorExample.vue" aria-label="View source code"}
This example demonstrates a production-ready editor setup. Check out the source code on GitHub.
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
externalTypes:
  - EditorContent
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

Use the `content-type` prop to set the format: `json`{lang="ts-type"} (default), `html`{lang="ts-type"}, or `markdown`{lang="ts-type"}. If not specified, strings are treated as HTML and objects as JSON.

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

You can use the `extensions` prop to add additional TipTap extensions to enhance the editor's capabilities:

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
See the Examples section to learn how to create your own custom extensions.
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

::note{to="https://tiptap.dev/docs/editor/extensions/functionality/placeholder#settings" target="_blank"}
Learn more about placeholder options in the TipTap documentation.
::

### Starter Kit

Use the `starter-kit` prop to configure the built-in TipTap StarterKit extension which includes common editor features.

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

::note{to="https://tiptap.dev/docs/editor/extensions/functionality/starterkit#included-extensions" target="_blank"}
The StarterKit includes extensions for bold, italic, strike, code, headings, lists, blockquotes, code blocks, horizontal rules, and more. Check the TipTap documentation for all available options.
::

### Handlers

Use the `handlers` prop to override or extend the default command handlers used by [EditorToolbar](/docs/components/editor-toolbar) and [EditorSuggestionMenu](/docs/components/editor-suggestion-menu) items through the `kind` field.

Each handler implements the `EditorHandler`{lang="ts-type"} interface:

```ts
interface EditorHandler {
  canExecute?: (editor: Editor, item?: any) => boolean
  execute: (editor: Editor, item?: any) => any
  isActive?: (editor: Editor, item?: any) => boolean
  isDisabled?: (editor: Editor, item?: any) => boolean
}
```

The Editor component provides the following default handlers:

- `mark`{lang="ts-type"} - Toggle text marks (bold, italic, strike, code, underline)
- `textAlign`{lang="ts-type"} - Set text alignment (left, center, right, justify)
- `heading`{lang="ts-type"} - Toggle heading levels (1-6)
- `link`{lang="ts-type"} - Add, edit, or remove links
- `image`{lang="ts-type"} - Insert images
- `blockquote`{lang="ts-type"} - Toggle blockquotes
- `bulletList`{lang="ts-type"} - Toggle bullet lists
- `orderedList`{lang="ts-type"} - Toggle ordered lists
- `codeBlock`{lang="ts-type"} - Toggle code blocks
- `horizontalRule`{lang="ts-type"} - Insert horizontal rules
- `paragraph`{lang="ts-type"} - Set paragraph format
- `undo`{lang="ts-type"} - Undo last change
- `redo`{lang="ts-type"} - Redo last undone change
- `clearFormatting`{lang="ts-type"} - Remove all formatting from selection
- `duplicate`{lang="ts-type"} - Duplicate a node
- `delete`{lang="ts-type"} - Delete a node
- `moveUp`{lang="ts-type"} - Move a node up
- `moveDown`{lang="ts-type"} - Move a node down
- `suggestion`{lang="ts-type"} - Trigger suggestion menu (/)
- `mention`{lang="ts-type"} - Trigger mention menu (@)
- `emoji`{lang="ts-type"} - Trigger emoji picker (:)

::tip{to="#with-image-upload"}
See the Examples section to learn how to create your own custom handlers.
::

## Examples

### With toolbar

You can use the [EditorToolbar](/docs/components/editor-toolbar) component to add a fixed, bubble, or floating toolbar to the editor with common formatting actions.

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

::component-example
---
elevated: true
collapse: true
prettier: true
name: 'editor-image-upload-example'
class: '!p-0'
---
::

1. Create a Vue component that uses the [FileUpload](/docs/components/file-upload) component:

::code-collapse

```vue [app/components/ImageUploadNode.vue]
<script setup lang="ts">
import type { NodeViewProps } from '@tiptap/vue-3'
import { NodeViewWrapper } from '@tiptap/vue-3'

const props = defineProps<NodeViewProps>()
const file = ref<File | null>(null)

watch(file, (newFile) => {
  if (!newFile) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const pos = props.getPos()
    props.editor.chain().focus()
      .deleteRange({ from: pos, to: pos + 1 })
      .setImage({ src: e.target?.result as string })
      .run()
  }
  reader.readAsDataURL(newFile)
})
</script>

<template>
  <NodeViewWrapper>
    <UFileUpload v-model="file" accept="image/*" />
  </NodeViewWrapper>
</template>
```

::

2. Create a custom TipTap extension to register the node:

::code-collapse

```ts [app/utils/image-upload.ts]
import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ImageUploadNode from '~/components/ImageUploadNode.vue'

declare module '@tiptap/vue-3' {
  interface Commands<ReturnType> {
    imageUpload: {
      insertImageUpload: () => ReturnType
    }
  }
}

export const ImageUpload = Node.create({
  name: 'imageUpload',
  group: 'block',
  atom: true,
  addAttributes() {
    return {}
  },
  parseHTML() {
    return [{
      tag: 'div[data-type="image-upload"]'
    }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'image-upload' })]
  },
  addNodeView() {
    return VueNodeViewRenderer(ImageUploadNode)
  },
  addCommands() {
    return {
      insertImageUpload: () => ({ commands }) => {
        return commands.insertContent({ type: this.name })
      }
    }
  }
})
```

::

3. Pass the extension and handlers to the Editor:

::code-collapse

```vue
<script setup lang="ts">
import type { EditorCustomHandlers, EditorToolbarItem } from '@nuxt/ui'
import type { Editor } from '@tiptap/vue-3'
import { ImageUpload } from '~/utils/image-upload'

const value = ref('')

const customHandlers = {
  imageUpload: {
    canExecute: (editor: Editor) => (editor.can() as any).insertContent({ type: 'imageUpload' }),
    execute: (editor: Editor) => editor.chain().focus().insertContent({ type: 'imageUpload' }),
    isActive: (editor: Editor) => editor.isActive('imageUpload'),
    isDisabled: undefined
  }
} satisfies EditorCustomHandlers

const items = [{
  kind: 'imageUpload',
  icon: 'i-lucide-image',
  label: 'Add image'
}] satisfies EditorToolbarItem<typeof customHandlers>[]
</script>

<template>
  <UEditor
    v-model="value"
    :extensions="[ImageUpload]"
    :handlers="customHandlers"
  >
    <UEditorToolbar :editor="editor" :items="items" />
  </UEditor>
</template>
```

::

::note
The `handlers` are automatically provided to [EditorToolbar](/docs/components/editor-toolbar) and [EditorSuggestionMenu](/docs/components/editor-suggestion-menu) which let you use `kind: 'imageUpload'` in your items.
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
