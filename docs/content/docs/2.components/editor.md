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
name: 'editor-example'
class: 'relative h-176 overflow-y-auto'
---
::

::callout{icon="i-simple-icons-github" to="https://github.com/nuxt/ui/blob/v4/docs/app/components/content/examples/editor/EditorExample.vue" aria-label="View source code"}
This example demonstrates a production-ready editor setup. Check out the source code on GitHub.
::

### Content

Use the `v-model` directive to control the value of the Editor.

::component-code
---
prettier: true
ignore:
  - modelValue
  - class
external:
  - modelValue
class: 'min-h-80'
props:
  contentType: 'markdown'
  modelValue: |
    # Hello World

    This is a **rich text** editor.
  class: 'w-full'
---
::

::tip
The Editor component exposes the TipTap editor instance via the default slot, which you can use to build custom toolbars and menus.
::

### Content Type

Use the `content-type` prop to set the format: `json`{lang="ts-type"} (default), `html`{lang="ts-type"}, or `markdown`{lang="ts-type"}. If not specified, strings are treated as HTML and objects as JSON.

::component-code
---
prettier: true
ignore:
  - modelValue
  - contentType
  - class
external:
  - modelValue
class: 'min-h-80'
props:
  contentType: 'html'
  modelValue: |
    <h1>Hello World</h1>
    <p>This is a <strong>rich text</strong> editor.</p>
  class: 'w-full'
---
::

::note
When using `markdown` content type, the Editor automatically includes the Markdown extension from TipTap.
::

### Placeholder

Use the `placeholder` prop to set a placeholder text that shows in empty paragraphs. You can also pass a `PlaceholderOptions`{lang="ts-type"} object from TipTap to customize the placeholder behavior.

::component-code
---
prettier: true
ignore:
  - modelValue
  - contentType
  - class
external:
  - modelValue
class: 'min-h-80'
props:
  contentType: 'markdown'
  modelValue: ''
  placeholder: 'Start writing...'
  class: 'w-full'
---
::

::tip{to="https://tiptap.dev/docs/editor/extensions/functionality/placeholder#settings" target="_blank"}
Learn more about placeholder options in the TipTap documentation.
::

### Starter Kit

Use the `starter-kit` prop to configure the built-in TipTap StarterKit extension which includes common editor features.

::component-code
---
prettier: true
collapse: true
ignore:
  - modelValue
  - starterKit.heading.levels
  - contentType
  - class
external:
  - modelValue
class: 'min-h-80'
props:
  contentType: 'markdown'
  modelValue: ''
  placeholder: 'Type # to create a heading...'
  starterKit:
    heading:
      levels: [1, 2, 3]
  class: 'w-full'
---
::

::tip{to="https://tiptap.dev/docs/editor/extensions/functionality/starterkit#included-extensions" target="_blank"}
The StarterKit includes extensions for bold, italic, strike, code, headings, lists, blockquotes, code blocks, horizontal rules, and more. Check the TipTap documentation for all available options.
::

### Extensions

Use the `extensions` prop to add custom TipTap extensions to enhance the editor's capabilities. Extensions can add new features, modify behavior, or provide additional formatting options.

```vue
<script setup lang="ts">
import { Emoji } from '@tiptap/extension-emoji'
import TextAlign from '@tiptap/extension-text-align'

const content = ref('')
</script>

<template>
  <UEditor
    v-model="content"
    :extensions="[
      Emoji,
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ]"
    placeholder="Type to add content..."
  />
</template>
```

::tip{to="#with-custom-extensions"}
See the Examples section for how to add custom extensions like emoji picker, text alignment, and file uploads with custom UI.
::

### Handlers

Use the `handlers` prop to override or extend the default command handlers that are used by toolbars and menus. Handlers define how editor commands are executed, checked for active state, and validated.

Each handler implements the `EditorHandler`{lang="ts-type"} interface:

```ts
interface EditorHandler {
  canExecute?: (editor: Editor, item?: any) => boolean
  execute: (editor: Editor, item?: any) => any
  isActive?: (editor: Editor, item?: any) => boolean
  isDisabled?: (editor: Editor, item?: any) => boolean
}
```

#### Default Handlers

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
- `duplicate`{lang="ts-type"} - Duplicate a node (used by drag handle)
- `delete`{lang="ts-type"} - Delete a node (used by drag handle)
- `moveUp`{lang="ts-type"} - Move a node up (used by drag handle)
- `moveDown`{lang="ts-type"} - Move a node down (used by drag handle)
- `suggestion`{lang="ts-type"} - Trigger suggestion menu (slash commands)
- `mention`{lang="ts-type"} - Trigger mention menu (@)
- `emoji`{lang="ts-type"} - Trigger emoji picker (:)

#### Customizing Handlers

Here's an example of customizing the mark handler to add analytics tracking:

```vue
<script setup lang="ts">
import type { EditorHandlers } from '@nuxt/ui'
import type { Editor } from '@tiptap/vue-3'

const content = ref('')

const customHandlers: Partial<EditorHandlers> = {
  mark: {
    canExecute: (editor: Editor, item) => editor.can().toggleMark(item.mark),
    execute: (editor: Editor, item) => {
      if (item.mark === 'bold') {
        console.log('Bold command executed')
        // Add your custom logic here (analytics, notifications, etc.)
      }
      return editor.chain().focus().toggleMark(item.mark).run()
    },
    isActive: (editor: Editor, item) => editor.isActive(item.mark),
    isDisabled: undefined
  }
}
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="content"
    :handlers="customHandlers"
    placeholder="Start typing..."
  >
    <UEditorToolbar :editor="editor" :items="[[
      { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold' }
    ]]" />
  </UEditor>
</template>
```

::tip{to="#with-custom-handlers"}
See the Examples section for more practical use cases like adding notifications, custom validation, or integrating with external services.
::

### Editable

Use the `editable` prop to control whether the editor is editable or read-only. Defaults to `true`.

::component-code
---
prettier: true
ignore:
  - modelValue
  - class
  - contentType
external:
  - modelValue
class: 'min-h-80'
props:
  editable: false
  contentType: 'markdown'
  modelValue: |
    ## Read-only Editor

    This editor is in read-only mode. You can **select** and *copy* text, but you cannot edit it.
  class: 'w-full'
---
::

## Examples

### With toolbar

You can use the [EditorToolbar](/docs/components/editor-toolbar) component to add a fixed toolbar to the editor with common formatting actions.

::component-example
---
collapse: true
name: 'editor-toolbar-example'
class: 'min-h-80'
---
::

### With bubble menu

Use the EditorToolbar component with `layout="bubble"` to create a contextual toolbar that appears when text is selected.

::component-example
---
collapse: true
name: 'editor-bubble-menu-example'
class: 'min-h-80'
---
::

::note
The bubble menu automatically positions itself near the selected text and hides when the selection is cleared.
::

### With floating menu

Use the EditorToolbar component with `layout="floating"` to create a toolbar that appears on empty lines, providing quick access to block-level formatting.

::component-example
---
collapse: true
name: 'editor-floating-menu-example'
class: 'min-h-80'
---
::

### With drag handle

You can use the [EditorDragHandle](/docs/components/editor-drag-handle) component to add a draggable handle for reordering blocks.

::component-example
---
collapse: true
name: 'editor-drag-handle-example'
class: 'min-h-80'
---
::

::note
Click the drag handle to select the block, or drag it to reorder blocks in the editor.
::

### With suggestion menu

You can use the [EditorSuggestionMenu](/docs/components/editor-suggestion-menu) component to add slash commands for quick formatting and insertions.

::component-example
---
collapse: true
name: 'editor-suggestion-menu-example'
class: 'min-h-80'
---
::

::note
Type `/` to open the suggestion menu and browse available commands.
::

### With mention menu

You can use the [EditorMentionMenu](/docs/components/editor-mention-menu) component to add @ mentions for tagging users or entities.

::component-example
---
collapse: true
name: 'editor-mention-menu-example'
class: 'min-h-80'
---
::

::note
Type `@` followed by a name to search and insert mentions.
::

### With emoji menu

You can use the [EditorEmojiMenu](/docs/components/editor-emoji-menu) component to add emoji picker support.

::component-example
---
collapse: true
name: 'editor-emoji-menu-example'
class: 'min-h-80'
---
::

::note
Type `:` followed by an emoji name to search and insert emojis.
::

### With custom extensions

You can add custom TipTap extensions to enhance the editor functionality.

::component-example
---
collapse: true
name: 'editor-custom-extensions-example'
class: 'min-h-96'
---
::

::tip
This example includes the Emoji extension for emoji picker support and the TextAlign extension for text alignment buttons.
::

### With custom handlers

You can provide custom handlers to override or extend the default command behavior.

::component-example
---
collapse: true
name: 'editor-custom-handlers-example'
class: 'min-h-80'
---
::

::note
Custom handlers allow you to customize how editor commands are executed, checked for active state, and validated.
::

### Custom toolbar item slots

You can override specific toolbar items using slots to add custom functionality. This is useful for complex interactions like link editing.

::component-example
---
collapse: true
name: 'editor-custom-toolbar-slot-example'
class: 'min-h-80'
---
::

In the example above, we use the `slot` property on a toolbar item and provide a matching template slot with custom UI:

```vue
<script setup lang="ts">
const toolbarItems = [[{
  kind: 'mark',
  mark: 'bold',
  icon: 'i-lucide-bold'
}, {
  slot: 'link' // Custom slot for link button
}]]
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="content">
    <UEditorToolbar :editor="editor" :items="toolbarItems">
      <template #link>
        <!-- Your custom link component here -->
        <EditorLinkPopover :editor="editor" />
      </template>
    </UEditorToolbar>
  </UEditor>
</template>
```

::tip
Use custom slots when you need more control over toolbar item behavior, such as popovers, modals, or complex forms.
::

### Custom handlers with extensions

You can add custom TipTap extensions and provide matching handlers to integrate them with the editor's toolbar and menus.

::component-example
---
collapse: true
name: 'editor-custom-extension-handler-example'
class: 'min-h-96'
---
::

The example above shows a complete custom ImageUpload extension with handlers. Here's how it works:

**1. Create a TipTap extension (`utils/editor/image-upload.ts`):**

```ts
import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ImageUploadNode from './ImageUploadNode.vue'

export const ImageUpload = Node.create({
  name: 'imageUpload',
  group: 'block',
  atom: true,

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

**2. Create custom handlers to connect the extension to your toolbar:**

```ts
const customHandlers: Partial<EditorHandlers> = {
  image: {
    canExecute: (editor: Editor) => editor.can().insertContent({ type: 'imageUpload' }),
    execute: (editor: Editor) => editor.chain().focus().insertImageUpload().run(),
    isActive: (editor: Editor) => editor.isActive('imageUpload'),
    isDisabled: undefined
  }
}
```

**3. Create the Vue component for the custom node (`ImageUploadNode.vue`):**

```vue
<script setup lang="ts">
import type { NodeViewProps } from '@tiptap/vue-3'
import { NodeViewWrapper } from '@tiptap/vue-3'

const props = defineProps<NodeViewProps>()
const file = ref<File | null>(null)

watch(file, async (newFile) => {
  if (!newFile) return

  // Convert file to data URL
  const reader = new FileReader()
  reader.onload = (e) => {
    const dataUrl = e.target?.result as string
    const pos = props.getPos()

    // Replace upload node with actual image
    props.editor
      .chain()
      .focus()
      .deleteRange({ from: pos, to: pos + 1 })
      .setImage({ src: dataUrl })
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

::callout{icon="i-custom-tiptap" to="https://tiptap.dev/docs/editor/extensions/custom-extensions" target="_blank"}
Learn more about creating custom extensions in the TipTap documentation.
::

::tip
Custom extensions with handlers unlock powerful functionality like file uploads, custom blocks, AI completions, and more. The ImageUpload example shows a complete implementation with a custom Vue component for the node view.
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
