---
title: Build a Notion-like Editor with Nuxt UI and TipTap
description: Learn how to build a Notion-like WYSIWYG editor with AI-powered completions, slash commands, mentions, tables, task lists, drag-and-drop, and syntax-highlighted code blocks using Nuxt UI and TipTap.
navigation: false
image: /assets/blog/building-nuxt-editor.png
authors:
  - name: Benjamin Canac
    avatar:
      src: https://github.com/benjamincanac.png
    to: https://x.com/benjamincanac
date: 2025-01-08T10:00:00.000Z
category: Tutorial
---

Building a Notion-like editor has traditionally been one of the most complex frontend challenges. This guide walks through creating a full-featured WYSIWYG editor using Nuxt UI's purpose-built components powered by [TipTap](https://tiptap.dev). Each step is explained in detail so you understand how every piece works together.

## What we're building

By the end of this tutorial, you'll have a Notion-like editor with:

- **Markdown support** for seamless content authoring
- **Fixed and bubble toolbars** for formatting actions
- **Image toolbar** that appears when selecting images
- **Table toolbar** with row/column controls
- **Slash commands** for quick block insertions (type `/`)
- **@ mentions** for tagging users
- **Emoji picker** with GitHub emoji support (type `:`)
- **Drag-and-drop** block reordering
- **Tables** with full spreadsheet-like functionality
- **Task lists** with interactive checkboxes
- **Syntax-highlighted code blocks** powered by Shiki
- **Image upload** with custom TipTap extension
- **AI completion** with ghost text suggestions and text transformations

::callout{icon="i-simple-icons-github" to="https://github.com/nuxt-ui-templates/editor" target="_blank"}
Check out the complete **Editor template** on GitHub for a production-ready implementation with real-time collaboration.
::

## Prerequisites

Before we start, make sure you have:

- Node.js 20+ installed
- Basic familiarity with Vue and Nuxt

## Project setup

Start by creating a new Nuxt project:

```bash
npx nuxi@latest init nuxt-editor
cd nuxt-editor
```

### Installing dependencies

Install Nuxt UI:

::code-group{sync="pm"}
```bash [pnpm]
pnpm add @nuxt/ui tailwindcss
```

```bash [yarn]
yarn add @nuxt/ui tailwindcss
```

```bash [npm]
npm install @nuxt/ui tailwindcss
```

```bash [bun]
bun add @nuxt/ui tailwindcss
```
::

### Configuration

Update your `nuxt.config.ts` to register the modules:

::code-tree-intersection
```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],

  css: ['~/assets/css/main.css']
})
```
::

Create the main CSS file to import Tailwind CSS and Nuxt UI:

::code-tree-intersection
```css [app/assets/css/main.css]
@import "tailwindcss";
@import "@nuxt/ui";
```
::

### Setting up the app

Nuxt UI requires wrapping your app with `UApp` for overlays to work properly:

::code-tree-intersection
```vue [app/app.vue]
<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
```
::

## Building the basic editor

Let's start with a simple editor page that uses markdown content:

::code-tree-intersection
```vue [app/pages/index.vue]
<script setup lang="ts">
const value = ref(`# Welcome to the Editor

This is a **rich text** editor built with Nuxt UI and TipTap.

Try editing this content!`)
</script>

<template>
  <UEditor
    v-model="value"
    content-type="markdown"
    placeholder="Start writing..."
    class="min-h-96"
  />
</template>
```
::

The `UEditor` component provides a powerful editing experience out of the box. The `content-type` prop tells it to work with markdown, and the `v-model` handles two-way binding with your content.

::tip
If you encounter ProseMirror-related errors such as `Adding different instances of a keyed plugin`, add the following to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  vite: {
    optimizeDeps: {
      include: [
        'prosemirror-state',
        'prosemirror-transform',
        'prosemirror-model',
        'prosemirror-view'
      ]
    }
  }
})
```

This ensures Vite pre-bundles ProseMirror dependencies to avoid loading multiple instances.
::

## Adding the fixed toolbar

A toolbar provides quick access to formatting actions. Let's add a fixed toolbar at the top of the editor with common formatting options.

First, create a composable to define the toolbar items:

::code-tree-intersection
:::code-collapse

```ts [app/composables/useFixedToolbarItems.ts]
import type { EditorToolbarItem } from '@nuxt/ui'

export function useFixedToolbarItems() {
  const fixedToolbarItems: EditorToolbarItem[][] = [[{
    kind: 'undo',
    icon: 'i-lucide-undo',
    tooltip: { text: 'Undo' }
  }, {
    kind: 'redo',
    icon: 'i-lucide-redo',
    tooltip: { text: 'Redo' }
  }], [{
    icon: 'i-lucide-heading',
    tooltip: { text: 'Headings' },
    items: [{
      kind: 'heading',
      level: 1,
      icon: 'i-lucide-heading-1',
      label: 'Heading 1'
    }, {
      kind: 'heading',
      level: 2,
      icon: 'i-lucide-heading-2',
      label: 'Heading 2'
    }, {
      kind: 'heading',
      level: 3,
      icon: 'i-lucide-heading-3',
      label: 'Heading 3'
    }]
  }, {
    icon: 'i-lucide-list',
    tooltip: { text: 'Lists' },
    items: [{
      kind: 'bulletList',
      icon: 'i-lucide-list',
      label: 'Bullet List'
    }, {
      kind: 'orderedList',
      icon: 'i-lucide-list-ordered',
      label: 'Ordered List'
    }]
  }, {
    kind: 'blockquote',
    icon: 'i-lucide-text-quote',
    tooltip: { text: 'Blockquote' }
  }, {
    kind: 'codeBlock',
    icon: 'i-lucide-square-code',
    tooltip: { text: 'Code Block' }
  }], [{
    kind: 'mark',
    mark: 'bold',
    icon: 'i-lucide-bold',
    tooltip: { text: 'Bold' }
  }, {
    kind: 'mark',
    mark: 'italic',
    icon: 'i-lucide-italic',
    tooltip: { text: 'Italic' }
  }, {
    kind: 'mark',
    mark: 'underline',
    icon: 'i-lucide-underline',
    tooltip: { text: 'Underline' }
  }, {
    kind: 'mark',
    mark: 'strike',
    icon: 'i-lucide-strikethrough',
    tooltip: { text: 'Strikethrough' }
  }, {
    kind: 'mark',
    mark: 'code',
    icon: 'i-lucide-code',
    tooltip: { text: 'Code' }
  }], [{
    slot: 'link',
    icon: 'i-lucide-link'
  }, {
    kind: 'image',
    icon: 'i-lucide-image',
    tooltip: { text: 'Image' }
  }]]

  return { fixedToolbarItems }
}
```

:::
::

Now update the page to use the composable:

::code-tree-intersection
```vue [app/pages/index.vue]
<script setup lang="ts">
const value = ref(`# Welcome to the Editor

This is a **rich text** editor built with Nuxt UI and TipTap.

Try editing this content!`)

const { fixedToolbarItems } = useFixedToolbarItems()
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="value"
    content-type="markdown"
    placeholder="Start writing..."
    class="min-h-96"
  >
    <UEditorToolbar
      :editor="editor"
      :items="fixedToolbarItems"
      class="border-b border-default sticky top-0 px-4 py-2 bg-default"
    />
  </UEditor>
</template>
```
::

**Toolbar Item Structure**

Each item can have a `kind` property that references a built-in handler (like `mark`, `heading`, `bulletList`), an `icon`, a `tooltip`, and optional nested `items` for dropdown menus.

**Grouped Items**

By passing an array of arrays, items are visually separated into groups. This helps organize related actions together.

### Adding a link popover

For a better link editing experience, let's create a custom popover component instead of using the browser's prompt:

::code-tree-intersection
:::code-collapse

```vue [app/components/EditorLinkPopover.vue]
<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  editor: Editor
}>()

const open = ref(false)
const url = ref('')

const active = computed(() => props.editor.isActive('link'))
const disabled = computed(() => {
  if (!props.editor.isEditable) return true
  const { selection } = props.editor.state
  return selection.empty && !props.editor.isActive('link')
})

watch(() => props.editor, (editor, _, onCleanup) => {
  if (!editor) return

  const updateUrl = () => {
    const { href } = editor.getAttributes('link')
    url.value = href || ''
  }

  updateUrl()
  editor.on('selectionUpdate', updateUrl)

  onCleanup(() => {
    editor.off('selectionUpdate', updateUrl)
  })
}, { immediate: true })

function setLink() {
  if (!url.value) return

  const { selection } = props.editor.state
  const isEmpty = selection.empty

  let chain = props.editor.chain().focus().extendMarkRange('link').setLink({ href: url.value })

  if (isEmpty) {
    chain = chain.insertContent({ type: 'text', text: url.value })
  }

  chain.run()
  open.value = false
}

function removeLink() {
  props.editor
    .chain()
    .focus()
    .extendMarkRange('link')
    .unsetLink()
    .run()

  url.value = ''
  open.value = false
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault()
    setLink()
  }
}
</script>

<template>
  <UPopover v-model:open="open" :ui="{ content: 'p-0.5' }">
    <UTooltip text="Link">
      <UButton
        icon="i-lucide-link"
        color="neutral"
        variant="ghost"
        size="sm"
        :active="active"
        :disabled="disabled"
      />
    </UTooltip>

    <template #content>
      <UInput
        v-model="url"
        autofocus
        type="url"
        variant="none"
        placeholder="Paste a link..."
        @keydown="handleKeyDown"
      >
        <div class="flex items-center mr-0.5">
          <UButton
            icon="i-lucide-corner-down-left"
            variant="ghost"
            size="sm"
            :disabled="!url && !active"
            @click="setLink"
          />

          <USeparator orientation="vertical" class="h-6 mx-1" />

          <UButton
            icon="i-lucide-trash"
            color="neutral"
            variant="ghost"
            size="sm"
            :disabled="!url && !active"
            @click="removeLink"
          />
        </div>
      </UInput>
    </template>
  </UPopover>
</template>
```

:::
::

Now update the page to use the custom link popover slot (we already defined `slot: 'link'` in the toolbar items):

::code-tree-intersection
```vue [app/pages/index.vue]
<script setup lang="ts">
const value = ref(`# Welcome to the Editor

This is a **rich text** editor built with Nuxt UI and TipTap.

Try editing this content!`)

const { fixedToolbarItems } = useFixedToolbarItems()
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="value"
    content-type="markdown"
    placeholder="Start writing..."
    class="min-h-96"
  >
    <UEditorToolbar
      :editor="editor"
      :items="fixedToolbarItems"
      class="border-b border-default sticky top-0 px-4 py-2 bg-default"
    >
      <template #link>
        <EditorLinkPopover :editor="editor" />
      </template>
    </UEditorToolbar>
  </UEditor>
</template>
```
::

## Adding the bubble toolbar

A bubble toolbar appears when text is selected, providing quick access to formatting options without leaving the content area.

Create a composable for the bubble toolbar items:

::code-tree-intersection
:::code-collapse

```ts [app/composables/useBubbleToolbarItems.ts]
import type { EditorToolbarItem } from '@nuxt/ui'

export function useBubbleToolbarItems() {
  const bubbleToolbarItems: EditorToolbarItem[][] = [[{
    label: 'Turn into',
    trailingIcon: 'i-lucide-chevron-down',
    activeColor: 'neutral',
    activeVariant: 'ghost',
    tooltip: { text: 'Turn into' },
    content: { align: 'start' },
    ui: { label: 'text-xs' },
    items: [{
      type: 'label',
      label: 'Turn into'
    }, {
      kind: 'paragraph',
      label: 'Paragraph',
      icon: 'i-lucide-type'
    }, {
      kind: 'heading',
      level: 1,
      icon: 'i-lucide-heading-1',
      label: 'Heading 1'
    }, {
      kind: 'heading',
      level: 2,
      icon: 'i-lucide-heading-2',
      label: 'Heading 2'
    }, {
      kind: 'heading',
      level: 3,
      icon: 'i-lucide-heading-3',
      label: 'Heading 3'
    }, {
      kind: 'bulletList',
      icon: 'i-lucide-list',
      label: 'Bullet List'
    }, {
      kind: 'orderedList',
      icon: 'i-lucide-list-ordered',
      label: 'Ordered List'
    }, {
      kind: 'blockquote',
      icon: 'i-lucide-text-quote',
      label: 'Blockquote'
    }, {
      kind: 'codeBlock',
      icon: 'i-lucide-square-code',
      label: 'Code Block'
    }]
  }], [{
    kind: 'mark',
    mark: 'bold',
    icon: 'i-lucide-bold',
    tooltip: { text: 'Bold' }
  }, {
    kind: 'mark',
    mark: 'italic',
    icon: 'i-lucide-italic',
    tooltip: { text: 'Italic' }
  }, {
    kind: 'mark',
    mark: 'underline',
    icon: 'i-lucide-underline',
    tooltip: { text: 'Underline' }
  }, {
    kind: 'mark',
    mark: 'strike',
    icon: 'i-lucide-strikethrough',
    tooltip: { text: 'Strikethrough' }
  }, {
    kind: 'mark',
    mark: 'code',
    icon: 'i-lucide-code',
    tooltip: { text: 'Code' }
  }], [{
    slot: 'link',
    icon: 'i-lucide-link'
  }]]

  return { bubbleToolbarItems }
}
```

:::
::

Update the page to add the bubble toolbar:

::code-tree-intersection
```vue [app/pages/index.vue]
<script setup lang="ts">
const value = ref(`# Welcome to the Editor

This is a **rich text** editor built with Nuxt UI and TipTap.

Try editing this content!`)

const { fixedToolbarItems } = useFixedToolbarItems()
const { bubbleToolbarItems } = useBubbleToolbarItems()
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="value"
    content-type="markdown"
    placeholder="Start writing..."
    class="min-h-96"
  >
    <UEditorToolbar
      :editor="editor"
      :items="fixedToolbarItems"
      class="border-b border-default sticky top-0 px-4 py-2 bg-default"
    >
      <template #link>
        <EditorLinkPopover :editor="editor" />
      </template>
    </UEditorToolbar>

    <UEditorToolbar
      :editor="editor"
      :items="bubbleToolbarItems"
      layout="bubble"
      :should-show="({ editor, view, state }) => {
        if (editor.isActive('image')) return false
        const { selection } = state
        return view.hasFocus() && !selection.empty
      }"
    >
      <template #link>
        <EditorLinkPopover :editor="editor" />
      </template>
    </UEditorToolbar>
  </UEditor>
</template>
```
::

The `should-show` prop controls when the bubble toolbar appears. In this case, it shows when text is selected and the view has focus, but not when an image is selected.

## Adding the image toolbar

When working with images, you can add a context-specific bubble toolbar that appears only when an image is selected.

Create a composable for the image toolbar items:

::code-tree-intersection
:::code-collapse

```ts [app/composables/useImageToolbarItems.ts]
import type { EditorToolbarItem } from '@nuxt/ui'
import type { Editor } from '@tiptap/vue-3'

export function useImageToolbarItems() {
  const imageToolbarItems = (editor: Editor): EditorToolbarItem[][] => {
    const node = editor.state.doc.nodeAt(editor.state.selection.from)

    return [[{
      icon: 'i-lucide-download',
      to: node?.attrs?.src,
      download: true,
      tooltip: { text: 'Download' }
    }, {
      icon: 'i-lucide-refresh-cw',
      tooltip: { text: 'Replace' },
      onClick: () => {
        const { state } = editor
        const pos = state.selection.from
        const currentNode = state.doc.nodeAt(pos)

        if (currentNode && currentNode.type.name === 'image') {
          editor.chain().focus().deleteRange({ from: pos, to: pos + currentNode.nodeSize }).insertContentAt(pos, { type: 'imageUpload' }).run()
        }
      }
    }], [{
      icon: 'i-lucide-trash',
      tooltip: { text: 'Delete' },
      onClick: () => {
        const { state } = editor
        const pos = state.selection.from
        const currentNode = state.doc.nodeAt(pos)

        if (currentNode && currentNode.type.name === 'image') {
          editor.chain().focus().deleteRange({ from: pos, to: pos + currentNode.nodeSize }).run()
        }
      }
    }]]
  }

  return { imageToolbarItems }
}
```

:::
::

Update the page to add the image toolbar:

::code-tree-intersection
```vue [app/pages/index.vue]
<script setup lang="ts">
const value = ref(`# Welcome to the Editor

This is a **rich text** editor built with Nuxt UI and TipTap.

Try editing this content!`)

const { fixedToolbarItems } = useFixedToolbarItems()
const { bubbleToolbarItems } = useBubbleToolbarItems()
const { imageToolbarItems } = useImageToolbarItems()
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="value"
    content-type="markdown"
    placeholder="Start writing..."
    class="min-h-96"
  >
    <UEditorToolbar
      :editor="editor"
      :items="fixedToolbarItems"
      class="border-b border-default sticky top-0 px-4 py-2 bg-default"
    >
      <template #link>
        <EditorLinkPopover :editor="editor" />
      </template>
    </UEditorToolbar>

    <UEditorToolbar
      :editor="editor"
      :items="bubbleToolbarItems"
      layout="bubble"
      :should-show="({ editor, view, state }) => {
        if (editor.isActive('image')) return false
        const { selection } = state
        return view.hasFocus() && !selection.empty
      }"
    >
      <template #link>
        <EditorLinkPopover :editor="editor" />
      </template>
    </UEditorToolbar>

    <UEditorToolbar
      :editor="editor"
      :items="imageToolbarItems(editor)"
      layout="bubble"
      :should-show="({ editor, view }) => editor.isActive('image') && view.hasFocus()"
    />
  </UEditor>
</template>
```
::

This creates a contextual toolbar that only appears when an image is selected, providing actions to download, replace, or delete the image.

## Adding tables

Tables bring spreadsheet-like functionality to your editor with row/column controls and cell selection.

First, install the Table extension:

::code-group{sync="pm"}
```bash [pnpm]
pnpm add @tiptap/extension-table
```

```bash [yarn]
yarn add @tiptap/extension-table
```

```bash [npm]
npm install @tiptap/extension-table
```

```bash [bun]
bun add @tiptap/extension-table
```
::

Create a composable for the table toolbar items:

::code-tree-intersection
:::code-collapse

```ts [app/composables/useTableToolbarItems.ts]
import type { EditorToolbarItem } from '@nuxt/ui'
import type { Editor } from '@tiptap/vue-3'

export function useTableToolbarItems() {
  const tableToolbarItems = (editor: Editor): EditorToolbarItem[][] => [[{
    icon: 'i-lucide-plus',
    tooltip: { text: 'Add column after' },
    onClick: () => editor.chain().focus().addColumnAfter().run()
  }, {
    icon: 'i-lucide-minus',
    tooltip: { text: 'Delete column' },
    onClick: () => editor.chain().focus().deleteColumn().run()
  }], [{
    icon: 'i-lucide-plus',
    tooltip: { text: 'Add row after' },
    onClick: () => editor.chain().focus().addRowAfter().run()
  }, {
    icon: 'i-lucide-minus',
    tooltip: { text: 'Delete row' },
    onClick: () => editor.chain().focus().deleteRow().run()
  }], [{
    icon: 'i-lucide-trash',
    tooltip: { text: 'Delete table' },
    onClick: () => editor.chain().focus().deleteTable().run()
  }]]

  return { tableToolbarItems }
}
```

:::
::

Update the page to add table support:

::code-tree-intersection
```vue [app/pages/index.vue]
<script setup lang="ts">
import { TableKit } from '@tiptap/extension-table'

const value = ref(`# Welcome to the Editor

This is a **rich text** editor built with Nuxt UI and TipTap.

Try editing this content!`)

const { fixedToolbarItems } = useFixedToolbarItems()
const { bubbleToolbarItems } = useBubbleToolbarItems()
const { imageToolbarItems } = useImageToolbarItems()
const { tableToolbarItems } = useTableToolbarItems()
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="value"
    content-type="markdown"
    :extensions="[TableKit]"
    placeholder="Start writing..."
    class="min-h-96"
  >
    <UEditorToolbar
      :editor="editor"
      :items="fixedToolbarItems"
      class="border-b border-default sticky top-0 px-4 py-2 bg-default"
    >
      <template #link>
        <EditorLinkPopover :editor="editor" />
      </template>
    </UEditorToolbar>

    <UEditorToolbar
      :editor="editor"
      :items="bubbleToolbarItems"
      layout="bubble"
      :should-show="({ editor, view, state }) => {
        if (editor.isActive('image')) return false
        const { selection } = state
        return view.hasFocus() && !selection.empty
      }"
    >
      <template #link>
        <EditorLinkPopover :editor="editor" />
      </template>
    </UEditorToolbar>

    <UEditorToolbar
      :editor="editor"
      :items="imageToolbarItems(editor)"
      layout="bubble"
      :should-show="({ editor, view }) => editor.isActive('image') && view.hasFocus()"
    />

    <UEditorToolbar
      :editor="editor"
      :items="tableToolbarItems(editor)"
      layout="bubble"
      :should-show="({ editor, view }) => editor.isActive('table') && view.hasFocus()"
    />
  </UEditor>
</template>
```
::

You can also add a table insertion button to your fixed toolbar or slash commands:

```ts
// Add to fixedToolbarItems or suggestionItems
{
  icon: 'i-lucide-table',
  label: 'Table',
  onClick: () => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()
}
```

## Adding task lists

Task lists provide interactive checklists, perfect for to-do lists and project management.

Install the TaskList and TaskItem extensions:

::code-group{sync="pm"}
```bash [pnpm]
pnpm add @tiptap/extension-task-list @tiptap/extension-task-item
```

```bash [yarn]
yarn add @tiptap/extension-task-list @tiptap/extension-task-item
```

```bash [npm]
npm install @tiptap/extension-task-list @tiptap/extension-task-item
```

```bash [bun]
bun add @tiptap/extension-task-list @tiptap/extension-task-item
```
::

Add the extensions and update your toolbar/suggestion items:

```ts
import { TaskList } from '@tiptap/extension-task-list'
import { TaskItem } from '@tiptap/extension-task-item'

// Add to extensions
const extensions = [
  TaskList,
  TaskItem.configure({ nested: true })
]

// Add to toolbar or suggestion items
{
  kind: 'taskList',
  icon: 'i-lucide-list-checks',
  label: 'Task List'
}
```

## Adding syntax-highlighted code blocks

For beautiful syntax highlighting in code blocks, use the CodeBlockShiki extension powered by [Shiki](https://shiki.style).

Install the extension:

::code-group{sync="pm"}
```bash [pnpm]
pnpm add tiptap-extension-code-block-shiki
```

```bash [yarn]
yarn add tiptap-extension-code-block-shiki
```

```bash [npm]
npm install tiptap-extension-code-block-shiki
```

```bash [bun]
bun add tiptap-extension-code-block-shiki
```
::

Configure the extension with your preferred themes:

::code-tree-intersection
```ts [app/pages/index.vue]
import { CodeBlockShiki } from 'tiptap-extension-code-block-shiki'

// Add to extensions with theme configuration
const extensions = [
  CodeBlockShiki.configure({
    defaultTheme: 'github-dark',
    themes: {
      light: 'github-light',
      dark: 'github-dark'
    }
  })
]
```
::

::tip
You can use any [Shiki theme](https://shiki.style/themes) for syntax highlighting. Popular choices include `github-dark`, `one-dark-pro`, `dracula`, and `nord`.
::

## Adding drag handle

The drag handle allows users to reorder blocks by dragging them. It also provides a dropdown menu for additional actions.

Create a composable for the drag handle items:

::code-tree-intersection
:::code-collapse

```ts [app/composables/useHandleItems.ts]
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Editor, JSONContent } from '@tiptap/vue-3'
import { upperFirst } from 'scule'
import { mapEditorItems } from '@nuxt/ui/utils/editor'

export function useHandleItems() {
  const selectedNode = ref<{ node: JSONContent, pos: number }>()

  const handleItems = (editor: Editor): DropdownMenuItem[][] => {
    if (!selectedNode.value?.node?.type) {
      return []
    }

    return mapEditorItems(editor, [[
      {
        type: 'label',
        label: upperFirst(selectedNode.value.node.type)
      },
      {
        label: 'Turn into',
        icon: 'i-lucide-repeat-2',
        children: [
          { kind: 'paragraph', label: 'Paragraph', icon: 'i-lucide-type' },
          { kind: 'heading', level: 1, label: 'Heading 1', icon: 'i-lucide-heading-1' },
          { kind: 'heading', level: 2, label: 'Heading 2', icon: 'i-lucide-heading-2' },
          { kind: 'heading', level: 3, label: 'Heading 3', icon: 'i-lucide-heading-3' },
          { kind: 'bulletList', label: 'Bullet List', icon: 'i-lucide-list' },
          { kind: 'orderedList', label: 'Ordered List', icon: 'i-lucide-list-ordered' },
          { kind: 'blockquote', label: 'Blockquote', icon: 'i-lucide-text-quote' },
          { kind: 'codeBlock', label: 'Code Block', icon: 'i-lucide-square-code' }
        ]
      },
      {
        kind: 'clearFormatting',
        pos: selectedNode.value?.pos,
        label: 'Reset formatting',
        icon: 'i-lucide-rotate-ccw'
      }
    ], [
      {
        kind: 'duplicate',
        pos: selectedNode.value?.pos,
        label: 'Duplicate',
        icon: 'i-lucide-copy'
      }
    ], [
      {
        kind: 'moveUp',
        pos: selectedNode.value?.pos,
        label: 'Move up',
        icon: 'i-lucide-arrow-up'
      },
      {
        kind: 'moveDown',
        pos: selectedNode.value?.pos,
        label: 'Move down',
        icon: 'i-lucide-arrow-down'
      }
    ], [
      {
        kind: 'delete',
        pos: selectedNode.value?.pos,
        label: 'Delete',
        icon: 'i-lucide-trash'
      }
    ]]) as DropdownMenuItem[][]
  }

  return { selectedNode, handleItems }
}
```

:::
::

Update the page to add the drag handle:

::code-tree-intersection
```vue [app/pages/index.vue]
<script setup lang="ts">
import { TableKit } from '@tiptap/extension-table'

const value = ref(`# Welcome to the Editor

This is a **rich text** editor built with Nuxt UI and TipTap.

Try editing this content!`)

const { fixedToolbarItems } = useFixedToolbarItems()
const { bubbleToolbarItems } = useBubbleToolbarItems()
const { imageToolbarItems } = useImageToolbarItems()
const { tableToolbarItems } = useTableToolbarItems()
const { selectedNode, handleItems } = useHandleItems()
</script>

<template>
  <UEditor
    v-slot="{ editor, handlers }"
    v-model="value"
    content-type="markdown"
    :extensions="[TableKit]"
    placeholder="Start writing..."
    class="min-h-96"
  >
    <UEditorToolbar
      :editor="editor"
      :items="fixedToolbarItems"
      class="border-b border-default sticky top-0 px-4 py-2 bg-default"
    >
      <template #link>
        <EditorLinkPopover :editor="editor" />
      </template>
    </UEditorToolbar>

    <UEditorToolbar
      :editor="editor"
      :items="bubbleToolbarItems"
      layout="bubble"
      :should-show="({ editor, view, state }) => {
        if (editor.isActive('image')) return false
        const { selection } = state
        return view.hasFocus() && !selection.empty
      }"
    >
      <template #link>
        <EditorLinkPopover :editor="editor" />
      </template>
    </UEditorToolbar>

    <UEditorToolbar
      :editor="editor"
      :items="imageToolbarItems(editor)"
      layout="bubble"
      :should-show="({ editor, view }) => editor.isActive('image') && view.hasFocus()"
    />

    <UEditorToolbar
      :editor="editor"
      :items="tableToolbarItems(editor)"
      layout="bubble"
      :should-show="({ editor, view }) => editor.isActive('table') && view.hasFocus()"
    />

    <UEditorDragHandle v-slot="{ ui, onClick }" :editor="editor" @node-change="selectedNode = $event">
      <UButton
        icon="i-lucide-plus"
        color="neutral"
        variant="ghost"
        size="sm"
        :class="ui.handle()"
        @click="(e) => {
          e.stopPropagation()
          const selected = onClick()
          handlers.suggestion?.execute(editor, { pos: selected?.pos }).run()
        }"
      />

      <UDropdownMenu
        v-slot="{ open }"
        :modal="false"
        :items="handleItems(editor)"
        :content="{ side: 'left' }"
        :ui="{ content: 'w-48', label: 'text-xs' }"
        @update:open="editor.chain().setMeta('lockDragHandle', $event).run()"
      >
        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          icon="i-lucide-grip-vertical"
          :active="open"
          :class="ui.handle()"
        />
      </UDropdownMenu>
    </UEditorDragHandle>
  </UEditor>
</template>
```
::

The drag handle provides two buttons:
- A **plus button** that opens the suggestion menu for inserting new blocks
- A **grip button** that shows a dropdown menu with actions like duplicate, move, and delete

## Adding slash commands

Slash commands provide a quick way to insert blocks and formatting by typing `/`.

Create a composable for the suggestion items:

::code-tree-intersection
:::code-collapse

```ts [app/composables/useSuggestionItems.ts]
import type { EditorSuggestionMenuItem } from '@nuxt/ui'

export function useSuggestionItems() {
  const suggestionItems: EditorSuggestionMenuItem[][] = [[{
    type: 'label',
    label: 'Style'
  }, {
    kind: 'paragraph',
    label: 'Paragraph',
    icon: 'i-lucide-type'
  }, {
    kind: 'heading',
    level: 1,
    label: 'Heading 1',
    icon: 'i-lucide-heading-1'
  }, {
    kind: 'heading',
    level: 2,
    label: 'Heading 2',
    icon: 'i-lucide-heading-2'
  }, {
    kind: 'heading',
    level: 3,
    label: 'Heading 3',
    icon: 'i-lucide-heading-3'
  }, {
    kind: 'bulletList',
    label: 'Bullet List',
    icon: 'i-lucide-list'
  }, {
    kind: 'orderedList',
    label: 'Numbered List',
    icon: 'i-lucide-list-ordered'
  }, {
    kind: 'blockquote',
    label: 'Blockquote',
    icon: 'i-lucide-text-quote'
  }, {
    kind: 'codeBlock',
    label: 'Code Block',
    icon: 'i-lucide-square-code'
  }], [{
    type: 'label',
    label: 'Insert'
  }, {
    kind: 'mention',
    label: 'Mention',
    icon: 'i-lucide-at-sign'
  }, {
    kind: 'emoji',
    label: 'Emoji',
    icon: 'i-lucide-smile-plus'
  }, {
    kind: 'horizontalRule',
    label: 'Horizontal Rule',
    icon: 'i-lucide-separator-horizontal'
  }]]

  return { suggestionItems }
}
```

:::
::

Update the page to add the suggestion menu:

::code-tree-intersection
```vue [app/pages/index.vue]
<script setup lang="ts">
import { TableKit } from '@tiptap/extension-table'

const value = ref(`# Welcome to the Editor

This is a **rich text** editor built with Nuxt UI and TipTap.

Try editing this content!`)

const { fixedToolbarItems } = useFixedToolbarItems()
const { bubbleToolbarItems } = useBubbleToolbarItems()
const { imageToolbarItems } = useImageToolbarItems()
const { tableToolbarItems } = useTableToolbarItems()
const { selectedNode, handleItems } = useHandleItems()
const { suggestionItems } = useSuggestionItems()
</script>

<template>
  <UEditor
    v-slot="{ editor, handlers }"
    v-model="value"
    content-type="markdown"
    :extensions="[TableKit]"
    placeholder="Start writing..."
    class="min-h-96"
  >
    <UEditorToolbar
      :editor="editor"
      :items="fixedToolbarItems"
      class="border-b border-default sticky top-0 px-4 py-2 bg-default"
    >
      <template #link>
        <EditorLinkPopover :editor="editor" />
      </template>
    </UEditorToolbar>

    <UEditorToolbar
      :editor="editor"
      :items="bubbleToolbarItems"
      layout="bubble"
      :should-show="({ editor, view, state }) => {
        if (editor.isActive('image')) return false
        const { selection } = state
        return view.hasFocus() && !selection.empty
      }"
    >
      <template #link>
        <EditorLinkPopover :editor="editor" />
      </template>
    </UEditorToolbar>

    <UEditorToolbar
      :editor="editor"
      :items="imageToolbarItems(editor)"
      layout="bubble"
      :should-show="({ editor, view }) => editor.isActive('image') && view.hasFocus()"
    />

    <UEditorToolbar
      :editor="editor"
      :items="tableToolbarItems(editor)"
      layout="bubble"
      :should-show="({ editor, view }) => editor.isActive('table') && view.hasFocus()"
    />

    <UEditorDragHandle v-slot="{ ui, onClick }" :editor="editor" @node-change="selectedNode = $event">
      <UButton
        icon="i-lucide-plus"
        color="neutral"
        variant="ghost"
        size="sm"
        :class="ui.handle()"
        @click="(e) => {
          e.stopPropagation()
          const selected = onClick()
          handlers.suggestion?.execute(editor, { pos: selected?.pos }).run()
        }"
      />

      <UDropdownMenu
        v-slot="{ open }"
        :modal="false"
        :items="handleItems(editor)"
        :content="{ side: 'left' }"
        :ui="{ content: 'w-48', label: 'text-xs' }"
        @update:open="editor.chain().setMeta('lockDragHandle', $event).run()"
      >
        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          icon="i-lucide-grip-vertical"
          :active="open"
          :class="ui.handle()"
        />
      </UDropdownMenu>
    </UEditorDragHandle>

    <UEditorSuggestionMenu :editor="editor" :items="suggestionItems" />
  </UEditor>
</template>
```
::

::tip
Type `/` anywhere in the editor to open the suggestion menu. You can filter items by continuing to type.
::

## Adding mentions and emojis

Mentions allow users to tag people using `@`, while the emoji picker lets users insert emojis using `:`.

First, install the emoji extension:

::code-group{sync="pm"}
```bash [pnpm]
pnpm add @tiptap/extension-emoji
```

```bash [yarn]
yarn add @tiptap/extension-emoji
```

```bash [npm]
npm install @tiptap/extension-emoji
```

```bash [bun]
bun add @tiptap/extension-emoji
```
::

Create composables for mentions and emojis:

::code-tree-intersection
```ts [app/composables/useMentionItems.ts]
import type { EditorMentionMenuItem } from '@nuxt/ui'

export function useMentionItems() {
  const mentionItems: EditorMentionMenuItem[] = [{
    label: 'benjamincanac',
    avatar: { src: 'https://avatars.githubusercontent.com/u/739984?v=4' }
  }, {
    label: 'HugoRCD',
    avatar: { src: 'https://avatars.githubusercontent.com/u/71938701?v=4' }
  }, {
    label: 'romhml',
    avatar: { src: 'https://avatars.githubusercontent.com/u/25613751?v=4' }
  }, {
    label: 'sandros94',
    avatar: { src: 'https://avatars.githubusercontent.com/u/13056429?v=4' }
  }, {
    label: 'hywax',
    avatar: { src: 'https://avatars.githubusercontent.com/u/149865959?v=4' }
  }]

  return { mentionItems }
}
```
::

::code-tree-intersection
```ts [app/composables/useEmojiItems.ts]
import type { EditorEmojiMenuItem } from '@nuxt/ui'
import { gitHubEmojis } from '@tiptap/extension-emoji'

export function useEmojiItems() {
  const emojiItems: EditorEmojiMenuItem[] = gitHubEmojis.filter(emoji =>
    !emoji.name.startsWith('regional_indicator_')
  )

  return { emojiItems }
}
```
::

Update the page to add mentions and emoji menus:

::code-tree-intersection
```vue [app/pages/index.vue]
<script setup lang="ts">
import { TableKit } from '@tiptap/extension-table'
import { Emoji } from '@tiptap/extension-emoji'

const value = ref(`# Welcome to the Editor

This is a **rich text** editor built with Nuxt UI and TipTap.

Try editing this content!`)

const { fixedToolbarItems } = useFixedToolbarItems()
const { bubbleToolbarItems } = useBubbleToolbarItems()
const { imageToolbarItems } = useImageToolbarItems()
const { tableToolbarItems } = useTableToolbarItems()
const { selectedNode, handleItems } = useHandleItems()
const { suggestionItems } = useSuggestionItems()
const { mentionItems } = useMentionItems()
const { emojiItems } = useEmojiItems()
</script>

<template>
  <UEditor
    v-slot="{ editor, handlers }"
    v-model="value"
    content-type="markdown"
    :extensions="[TableKit, Emoji]"
    placeholder="Start writing..."
    class="min-h-96"
  >
    <UEditorToolbar
      :editor="editor"
      :items="fixedToolbarItems"
      class="border-b border-default sticky top-0 px-4 py-2 bg-default"
    >
      <template #link>
        <EditorLinkPopover :editor="editor" />
      </template>
    </UEditorToolbar>

    <UEditorToolbar
      :editor="editor"
      :items="bubbleToolbarItems"
      layout="bubble"
      :should-show="({ editor, view, state }) => {
        if (editor.isActive('image')) return false
        const { selection } = state
        return view.hasFocus() && !selection.empty
      }"
    >
      <template #link>
        <EditorLinkPopover :editor="editor" />
      </template>
    </UEditorToolbar>

    <UEditorToolbar
      :editor="editor"
      :items="imageToolbarItems(editor)"
      layout="bubble"
      :should-show="({ editor, view }) => editor.isActive('image') && view.hasFocus()"
    />

    <UEditorToolbar
      :editor="editor"
      :items="tableToolbarItems(editor)"
      layout="bubble"
      :should-show="({ editor, view }) => editor.isActive('table') && view.hasFocus()"
    />

    <UEditorDragHandle v-slot="{ ui, onClick }" :editor="editor" @node-change="selectedNode = $event">
      <UButton
        icon="i-lucide-plus"
        color="neutral"
        variant="ghost"
        size="sm"
        :class="ui.handle()"
        @click="(e) => {
          e.stopPropagation()
          const selected = onClick()
          handlers.suggestion?.execute(editor, { pos: selected?.pos }).run()
        }"
      />

      <UDropdownMenu
        v-slot="{ open }"
        :modal="false"
        :items="handleItems(editor)"
        :content="{ side: 'left' }"
        :ui="{ content: 'w-48', label: 'text-xs' }"
        @update:open="editor.chain().setMeta('lockDragHandle', $event).run()"
      >
        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          icon="i-lucide-grip-vertical"
          :active="open"
          :class="ui.handle()"
        />
      </UDropdownMenu>
    </UEditorDragHandle>

    <UEditorSuggestionMenu :editor="editor" :items="suggestionItems" />
    <UEditorMentionMenu :editor="editor" :items="mentionItems" />
    <UEditorEmojiMenu :editor="editor" :items="emojiItems" />
  </UEditor>
</template>
```
::

::note
The `@tiptap/extension-emoji` package includes `gitHubEmojis`, a comprehensive list of GitHub-style emojis that you can use directly.
::

## Custom image upload extension

For a better image upload experience, let's create a custom TipTap extension that uses the `UFileUpload` component:

### Creating the upload node component

::code-tree-intersection
:::code-collapse

```vue [app/components/EditorImageUploadNode.vue]
<script setup lang="ts">
import type { NodeViewProps } from '@tiptap/vue-3'
import { NodeViewWrapper } from '@tiptap/vue-3'

const props = defineProps<NodeViewProps>()

const file = ref<File | null>(null)
const loading = ref(false)

watch(file, async (newFile) => {
  if (!newFile) return

  loading.value = true

  const reader = new FileReader()
  reader.onload = async (e) => {
    const dataUrl = e.target?.result as string
    if (!dataUrl) {
      loading.value = false
      return
    }

    // Simulate upload delay (replace with actual upload logic)
    await new Promise(resolve => setTimeout(resolve, 1000))

    const pos = props.getPos()
    if (typeof pos !== 'number') {
      loading.value = false
      return
    }

    props.editor
      .chain()
      .focus()
      .deleteRange({ from: pos, to: pos + 1 })
      .setImage({ src: dataUrl })
      .run()

    loading.value = false
  }
  reader.readAsDataURL(newFile)
})
</script>

<template>
  <NodeViewWrapper>
    <UFileUpload
      v-model="file"
      accept="image/*"
      label="Upload an image"
      description="SVG, PNG, JPG or GIF (max. 2MB)"
      :preview="false"
      class="min-h-48"
    >
      <template #leading>
        <UAvatar
          :icon="loading ? 'i-lucide-loader-circle' : 'i-lucide-image'"
          size="xl"
          :ui="{ icon: [loading && 'animate-spin'] }"
        />
      </template>
    </UFileUpload>
  </NodeViewWrapper>
</template>
```

:::
::

### Creating the TipTap extension

::code-tree-intersection
:::code-collapse

```ts [app/extensions/ImageUpload.ts]
import { Node, mergeAttributes } from '@tiptap/core'
import type { NodeViewRenderer } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ImageUploadNodeComponent from '~/components/EditorImageUploadNode.vue'

declare module '@tiptap/core' {
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
  draggable: true,

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

  addNodeView(): NodeViewRenderer {
    return VueNodeViewRenderer(ImageUploadNodeComponent)
  },

  addCommands() {
    return {
      insertImageUpload: () => ({ commands }) => {
        return commands.insertContent({ type: this.name })
      }
    }
  }
})

export default ImageUpload
```

:::
::

### Adding the custom handler

Create a composable for custom handlers:

::code-tree-intersection
:::code-collapse

```ts [app/composables/useCustomHandlers.ts]
import type { EditorCustomHandlers } from '@nuxt/ui'
import type { Editor } from '@tiptap/vue-3'

export function useCustomHandlers() {
  const customHandlers = {
    imageUpload: {
      canExecute: (editor: Editor) => editor.can().insertContent({ type: 'imageUpload' }),
      execute: (editor: Editor) => editor.chain().focus().insertContent({ type: 'imageUpload' }),
      isActive: (editor: Editor) => editor.isActive('imageUpload'),
      isDisabled: undefined
    }
  } satisfies EditorCustomHandlers

  return { customHandlers }
}
```

:::
::

Update the fixed toolbar composable to use the custom handler:

```ts
// In useFixedToolbarItems.ts, update the image item:
{
  kind: 'imageUpload',
  icon: 'i-lucide-image',
  tooltip: { text: 'Image' }
}
```

Update the page to use the extension and handlers:

::code-tree-intersection
```vue [app/pages/index.vue]
<script setup lang="ts">
import { TableKit } from '@tiptap/extension-table'
import { Emoji } from '@tiptap/extension-emoji'
import { ImageUpload } from '~/extensions/ImageUpload'

const value = ref(`# Welcome to the Editor

This is a **rich text** editor built with Nuxt UI and TipTap.

Try editing this content!`)

const { fixedToolbarItems } = useFixedToolbarItems()
const { bubbleToolbarItems } = useBubbleToolbarItems()
const { imageToolbarItems } = useImageToolbarItems()
const { tableToolbarItems } = useTableToolbarItems()
const { selectedNode, handleItems } = useHandleItems()
const { suggestionItems } = useSuggestionItems()
const { mentionItems } = useMentionItems()
const { emojiItems } = useEmojiItems()
const { customHandlers } = useCustomHandlers()
</script>

<template>
  <UEditor
    v-slot="{ editor, handlers }"
    v-model="value"
    content-type="markdown"
    :extensions="[TableKit, Emoji, ImageUpload]"
    :handlers="customHandlers"
    placeholder="Start writing..."
    class="min-h-96"
  >
    <UEditorToolbar
      :editor="editor"
      :items="fixedToolbarItems"
      class="border-b border-default sticky top-0 px-4 py-2 bg-default"
    >
      <template #link>
        <EditorLinkPopover :editor="editor" />
      </template>
    </UEditorToolbar>

    <UEditorToolbar
      :editor="editor"
      :items="bubbleToolbarItems"
      layout="bubble"
      :should-show="({ editor, view, state }) => {
        if (editor.isActive('image')) return false
        const { selection } = state
        return view.hasFocus() && !selection.empty
      }"
    >
      <template #link>
        <EditorLinkPopover :editor="editor" />
      </template>
    </UEditorToolbar>

    <UEditorToolbar
      :editor="editor"
      :items="imageToolbarItems(editor)"
      layout="bubble"
      :should-show="({ editor, view }) => editor.isActive('image') && view.hasFocus()"
    />

    <UEditorToolbar
      :editor="editor"
      :items="tableToolbarItems(editor)"
      layout="bubble"
      :should-show="({ editor, view }) => editor.isActive('table') && view.hasFocus()"
    />

    <UEditorDragHandle v-slot="{ ui, onClick }" :editor="editor" @node-change="selectedNode = $event">
      <UButton
        icon="i-lucide-plus"
        color="neutral"
        variant="ghost"
        size="sm"
        :class="ui.handle()"
        @click="(e) => {
          e.stopPropagation()
          const selected = onClick()
          handlers.suggestion?.execute(editor, { pos: selected?.pos }).run()
        }"
      />

      <UDropdownMenu
        v-slot="{ open }"
        :modal="false"
        :items="handleItems(editor)"
        :content="{ side: 'left' }"
        :ui="{ content: 'w-48', label: 'text-xs' }"
        @update:open="editor.chain().setMeta('lockDragHandle', $event).run()"
      >
        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          icon="i-lucide-grip-vertical"
          :active="open"
          :class="ui.handle()"
        />
      </UDropdownMenu>
    </UEditorDragHandle>

    <UEditorSuggestionMenu :editor="editor" :items="suggestionItems" />
    <UEditorMentionMenu :editor="editor" :items="mentionItems" />
    <UEditorEmojiMenu :editor="editor" :items="emojiItems" />
  </UEditor>
</template>
```
::

::tip
In a real application, you would upload the image to a storage service (like S3, Cloudflare R2, or NuxtHub Blob) and use the returned URL instead of a data URL.
::

## AI completion

For AI-powered features like ghost text suggestions and text transformations, you can integrate the Vercel AI SDK. This requires additional setup.

### Installing AI dependencies

::code-group{sync="pm"}
```bash [pnpm]
pnpm add ai @ai-sdk/gateway @ai-sdk/vue
```

```bash [yarn]
yarn add ai @ai-sdk/gateway @ai-sdk/vue
```

```bash [npm]
npm install ai @ai-sdk/gateway @ai-sdk/vue
```

```bash [bun]
bun add ai @ai-sdk/gateway @ai-sdk/vue
```
::

### Creating the completion extension

::code-tree-intersection
:::code-collapse

```ts [app/extensions/Completion.ts]
import { Extension } from '@tiptap/core'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import type { Editor } from '@tiptap/vue-3'
import { useDebounceFn } from '@vueuse/core'

export interface CompletionOptions {
  debounce?: number
  autoTrigger?: boolean
  triggerCharacters?: string[]
  onTrigger?: (editor: Editor) => void
  onAccept?: () => void
  onDismiss?: () => void
}

export interface CompletionStorage {
  suggestion: string
  position: number | undefined
  visible: boolean
  debouncedTrigger: ((editor: Editor) => void) | null
  setSuggestion: (text: string) => void
  clearSuggestion: () => void
}

export const completionPluginKey = new PluginKey('completion')

export const Completion = Extension.create<CompletionOptions, CompletionStorage>({
  name: 'completion',

  addOptions() {
    return {
      debounce: 250,
      autoTrigger: false,
      triggerCharacters: ['/', ':', '@'],
      onTrigger: undefined,
      onAccept: undefined,
      onDismiss: undefined
    }
  },

  addStorage() {
    return {
      suggestion: '',
      position: undefined as number | undefined,
      visible: false,
      debouncedTrigger: null as ((editor: Editor) => void) | null,
      setSuggestion(text: string) {
        this.suggestion = text
      },
      clearSuggestion() {
        this.suggestion = ''
        this.position = undefined
        this.visible = false
      }
    }
  },

  addProseMirrorPlugins() {
    const storage = this.storage

    return [
      new Plugin({
        key: completionPluginKey,
        props: {
          decorations(state) {
            if (!storage.visible || !storage.suggestion || storage.position === undefined) {
              return DecorationSet.empty
            }

            const widget = Decoration.widget(storage.position, () => {
              const span = document.createElement('span')
              span.className = 'completion-suggestion'
              span.textContent = storage.suggestion
              span.style.cssText = 'color: var(--ui-text-muted); opacity: 0.6; pointer-events: none;'
              return span
            }, { side: 1 })

            return DecorationSet.create(state.doc, [widget])
          }
        }
      })
    ]
  },

  addKeyboardShortcuts() {
    return {
      'Mod-j': ({ editor }) => {
        if (this.storage.visible) {
          this.storage.clearSuggestion()
          this.options.onDismiss?.()
        }
        this.storage.debouncedTrigger?.(editor as Editor)
        return true
      },
      'Tab': ({ editor }) => {
        if (!this.storage.visible || !this.storage.suggestion || this.storage.position === undefined) {
          return false
        }

        const suggestion = this.storage.suggestion
        const position = this.storage.position

        this.storage.clearSuggestion()
        editor.view.dispatch(editor.state.tr.setMeta('completionUpdate', true))
        editor.chain().focus().insertContentAt(position, suggestion).run()

        this.options.onAccept?.()
        return true
      },
      'Escape': ({ editor }) => {
        if (this.storage.visible) {
          this.storage.clearSuggestion()
          editor.view.dispatch(editor.state.tr.setMeta('completionUpdate', true))
          this.options.onDismiss?.()
          return true
        }
        return false
      }
    }
  },

  onUpdate({ editor }) {
    if (this.storage.visible) {
      this.storage.clearSuggestion()
      editor.view.dispatch(editor.state.tr.setMeta('completionUpdate', true))
      this.options.onDismiss?.()
    }

    if (this.options.autoTrigger) {
      this.storage.debouncedTrigger?.(editor as Editor)
    }
  },

  onSelectionUpdate({ editor }) {
    if (this.storage.visible) {
      this.storage.clearSuggestion()
      editor.view.dispatch(editor.state.tr.setMeta('completionUpdate', true))
      this.options.onDismiss?.()
    }
  },

  onCreate() {
    const storage = this.storage
    const options = this.options

    this.storage.debouncedTrigger = useDebounceFn((editor: Editor) => {
      if (!options.onTrigger) return

      const { state } = editor
      const { selection } = state
      const { $from } = selection

      const isAtEndOfBlock = $from.parentOffset === $from.parent.content.size
      const hasContent = $from.parent.textContent.trim().length > 0
      const textContent = $from.parent.textContent

      const endsWithPunctuation = /[.!?]\s*$/.test(textContent)
      const triggerChars = options.triggerCharacters || []
      const endsWithTrigger = triggerChars.some(char => textContent.endsWith(char))

      if (!isAtEndOfBlock || !hasContent || endsWithPunctuation || endsWithTrigger) {
        return
      }

      storage.position = selection.from
      storage.visible = true

      options.onTrigger(editor)
    }, options.debounce || 250)
  },

  onDestroy() {
    this.storage.debouncedTrigger = null
  }
})

export default Completion
```

:::
::

### Creating the completion composable

::code-tree-intersection
:::code-collapse

```ts [app/composables/useEditorCompletion.ts]
import { useCompletion } from '@ai-sdk/vue'
import type { Editor } from '@tiptap/vue-3'
import { Completion } from '~/extensions/Completion'
import type { CompletionStorage } from '~/extensions/Completion'

type CompletionMode = 'continue' | 'fix' | 'extend' | 'reduce' | 'simplify' | 'summarize' | 'translate'

export function useEditorCompletion(editorRef: Ref<{ editor: Editor | undefined } | null | undefined>) {
  const insertState = ref<{
    pos: number
    deleteRange?: { from: number, to: number }
  }>()
  const mode = ref<CompletionMode>('continue')
  const language = ref<string>()

  function getCompletionStorage() {
    const storage = editorRef.value?.editor?.storage as Record<string, CompletionStorage> | undefined
    return storage?.completion
  }

  const { completion, complete, isLoading, stop, setCompletion } = useCompletion({
    api: '/api/completion',
    streamProtocol: 'text',
    body: computed(() => ({
      mode: mode.value,
      language: language.value
    })),
    onFinish: (_prompt, completionText) => {
      const storage = getCompletionStorage()
      if (mode.value === 'continue' && storage?.visible) {
        return
      }

      const transformModes = ['fix', 'extend', 'reduce', 'simplify', 'summarize', 'translate']
      if (transformModes.includes(mode.value) && insertState.value && completionText) {
        const editor = editorRef.value?.editor
        if (editor) {
          if (insertState.value.deleteRange) {
            editor.chain().focus().deleteRange(insertState.value.deleteRange).run()
          }

          editor.chain()
            .focus()
            .insertContentAt(insertState.value.pos, completionText, { contentType: 'markdown' })
            .run()
        }
      }

      insertState.value = undefined
    },
    onError: (error) => {
      console.error('AI completion error:', error)
      insertState.value = undefined
      getCompletionStorage()?.clearSuggestion()
    }
  })

  watch(completion, (newCompletion, oldCompletion) => {
    const editor = editorRef.value?.editor
    if (!editor || !newCompletion) return

    const storage = getCompletionStorage()
    if (storage?.visible) {
      let suggestionText = newCompletion
      if (storage.position !== undefined) {
        const textBefore = editor.state.doc.textBetween(Math.max(0, storage.position - 1), storage.position)
        if (textBefore && !/\s/.test(textBefore) && !suggestionText.startsWith(' ')) {
          suggestionText = ' ' + suggestionText
        }
      }
      storage.setSuggestion(suggestionText)
      editor.view.dispatch(editor.state.tr.setMeta('completionUpdate', true))
    }
  })

  function triggerTransform(editor: Editor, transformMode: Exclude<CompletionMode, 'continue'>, lang?: string) {
    if (isLoading.value) return

    getCompletionStorage()?.clearSuggestion()

    const { state } = editor
    const { selection } = state

    if (selection.empty) return

    mode.value = transformMode
    language.value = lang
    const selectedText = state.doc.textBetween(selection.from, selection.to)

    insertState.value = { pos: selection.from, deleteRange: { from: selection.from, to: selection.to } }

    complete(selectedText)
  }

  function getMarkdownBefore(editor: Editor, pos: number): string {
    const { state } = editor
    const serializer = (editor.storage.markdown as { serializer?: { serialize: (content: unknown) => string } })?.serializer
    if (serializer) {
      const slice = state.doc.slice(0, pos)
      return serializer.serialize(slice.content)
    }
    return state.doc.textBetween(0, pos, '\n')
  }

  function triggerContinue(editor: Editor) {
    if (isLoading.value) return

    mode.value = 'continue'
    getCompletionStorage()?.clearSuggestion()
    const { state } = editor
    const { selection } = state

    if (selection.empty) {
      const textBefore = getMarkdownBefore(editor, selection.from)
      insertState.value = { pos: selection.from }
      complete(textBefore)
    } else {
      const textBefore = getMarkdownBefore(editor, selection.to)
      insertState.value = { pos: selection.to }
      complete(textBefore)
    }
  }

  const extension = Completion.configure({
    onTrigger: (editor) => {
      if (isLoading.value) return
      mode.value = 'continue'
      const textBefore = getMarkdownBefore(editor, editor.state.selection.from)
      complete(textBefore)
    },
    onAccept: () => {
      setCompletion('')
    },
    onDismiss: () => {
      stop()
      setCompletion('')
    }
  })

  const handlers = {
    aiContinue: {
      canExecute: () => !isLoading.value,
      execute: (editor: Editor) => {
        triggerContinue(editor)
        return editor.chain()
      },
      isActive: () => !!(isLoading.value && mode.value === 'continue'),
      isDisabled: () => !!isLoading.value
    },
    aiFix: {
      canExecute: (editor: Editor) => !editor.state.selection.empty && !isLoading.value,
      execute: (editor: Editor) => {
        triggerTransform(editor, 'fix')
        return editor.chain()
      },
      isActive: () => !!(isLoading.value && mode.value === 'fix'),
      isDisabled: (editor: Editor) => editor.state.selection.empty || !!isLoading.value
    },
    aiExtend: {
      canExecute: (editor: Editor) => !editor.state.selection.empty && !isLoading.value,
      execute: (editor: Editor) => {
        triggerTransform(editor, 'extend')
        return editor.chain()
      },
      isActive: () => !!(isLoading.value && mode.value === 'extend'),
      isDisabled: (editor: Editor) => editor.state.selection.empty || !!isLoading.value
    },
    aiSimplify: {
      canExecute: (editor: Editor) => !editor.state.selection.empty && !isLoading.value,
      execute: (editor: Editor) => {
        triggerTransform(editor, 'simplify')
        return editor.chain()
      },
      isActive: () => !!(isLoading.value && mode.value === 'simplify'),
      isDisabled: (editor: Editor) => editor.state.selection.empty || !!isLoading.value
    },
    aiTranslate: {
      canExecute: (editor: Editor) => !editor.state.selection.empty && !isLoading.value,
      execute: (editor: Editor, cmd: { language?: string } | undefined) => {
        triggerTransform(editor, 'translate', cmd?.language)
        return editor.chain()
      },
      isActive: (_editor: Editor, cmd: { language?: string } | undefined) => !!(isLoading.value && mode.value === 'translate' && language.value === cmd?.language),
      isDisabled: (editor: Editor) => editor.state.selection.empty || !!isLoading.value
    }
  }

  return {
    extension,
    handlers,
    isLoading,
    mode
  }
}
```

:::
::

### Creating the server endpoint

::code-tree-intersection
:::code-collapse

```ts [server/api/completion.post.ts]
import { streamText } from 'ai'
import { gateway } from '@ai-sdk/gateway'

export default defineEventHandler(async (event) => {
  const { prompt, mode, language } = await readBody(event)
  if (!prompt) {
    throw createError({ statusCode: 400, message: 'Prompt is required' })
  }

  let system: string
  let maxOutputTokens: number

  const preserveMarkdown = 'IMPORTANT: Preserve all markdown formatting (bold, italic, links, etc.) exactly as in the original.'

  switch (mode) {
    case 'fix':
      system = `You are a writing assistant. Fix all spelling and grammar errors in the given text. ${preserveMarkdown} Only output the corrected text, nothing else.`
      maxOutputTokens = 500
      break
    case 'extend':
      system = `You are a writing assistant. Extend the given text with more details, examples, and explanations while maintaining the same style. ${preserveMarkdown} Only output the extended text, nothing else.`
      maxOutputTokens = 500
      break
    case 'simplify':
      system = `You are a writing assistant. Simplify the given text to make it easier to understand, using simpler words and shorter sentences. ${preserveMarkdown} Only output the simplified text, nothing else.`
      maxOutputTokens = 400
      break
    case 'translate':
      system = `You are a writing assistant. Translate the given text to ${language || 'English'}. ${preserveMarkdown} Only output the translated text, nothing else.`
      maxOutputTokens = 500
      break
    case 'continue':
    default:
      system = `You are a writing assistant providing inline autocompletions.
CRITICAL RULES:
- Output ONLY the NEW text that comes AFTER the user's input
- NEVER repeat any words from the end of the user's text
- Keep completions short (1 sentence max)
- Match the tone and style of the existing text
- ${preserveMarkdown}`
      maxOutputTokens = 25
      break
  }

  return streamText({
    model: gateway('openai/gpt-4o-mini'),
    system,
    prompt,
    maxOutputTokens
  }).toTextStreamResponse()
})
```

:::
::

### Using AI in the bubble toolbar

Add AI actions to your bubble toolbar composable. Update `useBubbleToolbarItems.ts` to include an AI dropdown:

::code-tree-intersection
:::code-collapse

```ts [app/composables/useBubbleToolbarItems.ts]
import type { EditorToolbarItem } from '@nuxt/ui'

export function useBubbleToolbarItems(aiLoading?: Ref<boolean>) {
  const bubbleToolbarItems = computed<EditorToolbarItem[][]>(() => [[{
    icon: 'i-lucide-sparkles',
    label: 'Improve',
    activeColor: 'neutral',
    activeVariant: 'ghost',
    loading: aiLoading?.value,
    content: { align: 'start' },
    items: [{
      kind: 'aiFix',
      icon: 'i-lucide-spell-check',
      label: 'Fix spelling & grammar'
    }, {
      kind: 'aiExtend',
      icon: 'i-lucide-unfold-vertical',
      label: 'Extend text'
    }, {
      kind: 'aiSimplify',
      icon: 'i-lucide-lightbulb',
      label: 'Simplify text'
    }, {
      icon: 'i-lucide-languages',
      label: 'Translate',
      children: [{
        kind: 'aiTranslate',
        language: 'English',
        label: 'English'
      }, {
        kind: 'aiTranslate',
        language: 'French',
        label: 'French'
      }, {
        kind: 'aiTranslate',
        language: 'Spanish',
        label: 'Spanish'
      }]
    }]
  }, {
    label: 'Turn into',
    trailingIcon: 'i-lucide-chevron-down',
    // ... rest of the items
  }],
  // ... marks items
  ])

  return { bubbleToolbarItems }
}
```

:::
::

::note
The completion extension can be configured with `autoTrigger: true` to automatically suggest completions while typing (disabled by default). You can also manually trigger it with :kbd{value="meta"} :kbd{value="j" class="ms-px"}.
::

## Consolidating composables

For a cleaner production setup, you can consolidate your composables following the pattern used in the [Editor template](https://github.com/nuxt-ui-templates/editor). Here's a recommended structure:

::code-tree-intersection
:::code-collapse

```ts [app/composables/useEditorToolbar.ts]
import type { EditorToolbarItem, EditorCustomHandlers } from '@nuxt/ui'
import type { Editor } from '@tiptap/vue-3'

export function useEditorToolbar<T extends EditorCustomHandlers>(
  customHandlers: T,
  options?: { aiLoading?: Ref<boolean> }
) {
  const toolbarItems: EditorToolbarItem<T>[][] = [[{
    kind: 'undo',
    icon: 'i-lucide-undo',
    tooltip: { text: 'Undo' }
  }, {
    kind: 'redo',
    icon: 'i-lucide-redo',
    tooltip: { text: 'Redo' }
  }], [{
    icon: 'i-lucide-heading',
    tooltip: { text: 'Headings' },
    items: [
      { kind: 'heading', level: 1, icon: 'i-lucide-heading-1', label: 'Heading 1' },
      { kind: 'heading', level: 2, icon: 'i-lucide-heading-2', label: 'Heading 2' },
      { kind: 'heading', level: 3, icon: 'i-lucide-heading-3', label: 'Heading 3' }
    ]
  }, {
    icon: 'i-lucide-list',
    tooltip: { text: 'Lists' },
    items: [
      { kind: 'bulletList', icon: 'i-lucide-list', label: 'Bullet List' },
      { kind: 'orderedList', icon: 'i-lucide-list-ordered', label: 'Ordered List' },
      { kind: 'taskList', icon: 'i-lucide-list-checks', label: 'Task List' }
    ]
  }], [{
    kind: 'mark', mark: 'bold', icon: 'i-lucide-bold', tooltip: { text: 'Bold' }
  }, {
    kind: 'mark', mark: 'italic', icon: 'i-lucide-italic', tooltip: { text: 'Italic' }
  }, {
    kind: 'mark', mark: 'code', icon: 'i-lucide-code', tooltip: { text: 'Code' }
  }], [{
    slot: 'link', icon: 'i-lucide-link'
  }, {
    kind: 'imageUpload', icon: 'i-lucide-image', tooltip: { text: 'Image' }
  }, {
    kind: 'table', icon: 'i-lucide-table', tooltip: { text: 'Table' }
  }]]

  const bubbleToolbarItems = computed<EditorToolbarItem<T>[][]>(() => [[{
    icon: 'i-lucide-sparkles',
    label: 'Improve',
    loading: options?.aiLoading?.value,
    content: { align: 'start' },
    items: [
      { kind: 'aiFix', icon: 'i-lucide-spell-check', label: 'Fix spelling & grammar' },
      { kind: 'aiExtend', icon: 'i-lucide-unfold-vertical', label: 'Extend text' },
      { kind: 'aiSimplify', icon: 'i-lucide-lightbulb', label: 'Simplify text' }
    ]
  }], [{
    kind: 'mark', mark: 'bold', icon: 'i-lucide-bold', tooltip: { text: 'Bold' }
  }, {
    kind: 'mark', mark: 'italic', icon: 'i-lucide-italic', tooltip: { text: 'Italic' }
  }, {
    kind: 'mark', mark: 'code', icon: 'i-lucide-code', tooltip: { text: 'Code' }
  }], [{
    slot: 'link', icon: 'i-lucide-link'
  }]])

  const getImageToolbarItems = (editor: Editor): EditorToolbarItem[][] => {
    const node = editor.state.doc.nodeAt(editor.state.selection.from)
    return [[{
      icon: 'i-lucide-download',
      to: node?.attrs?.src,
      download: true,
      tooltip: { text: 'Download' }
    }], [{
      icon: 'i-lucide-trash',
      tooltip: { text: 'Delete' },
      onClick: () => {
        const pos = editor.state.selection.from
        const currentNode = editor.state.doc.nodeAt(pos)
        if (currentNode?.type.name === 'image') {
          editor.chain().focus().deleteRange({ from: pos, to: pos + currentNode.nodeSize }).run()
        }
      }
    }]]
  }

  const getTableToolbarItems = (editor: Editor): EditorToolbarItem[][] => [[{
    icon: 'i-lucide-plus',
    tooltip: { text: 'Add column' },
    onClick: () => editor.chain().focus().addColumnAfter().run()
  }, {
    icon: 'i-lucide-minus',
    tooltip: { text: 'Delete column' },
    onClick: () => editor.chain().focus().deleteColumn().run()
  }], [{
    icon: 'i-lucide-plus',
    tooltip: { text: 'Add row' },
    onClick: () => editor.chain().focus().addRowAfter().run()
  }, {
    icon: 'i-lucide-minus',
    tooltip: { text: 'Delete row' },
    onClick: () => editor.chain().focus().deleteRow().run()
  }], [{
    icon: 'i-lucide-trash',
    tooltip: { text: 'Delete table' },
    onClick: () => editor.chain().focus().deleteTable().run()
  }]]

  return { toolbarItems, bubbleToolbarItems, getImageToolbarItems, getTableToolbarItems }
}
```

:::
::

This consolidated approach keeps your page component clean:

::code-tree-intersection
:::code-collapse

```vue [app/pages/index.vue]
<script setup lang="ts">
import type { EditorCustomHandlers } from '@nuxt/ui'
import type { Editor } from '@tiptap/core'
import { Emoji } from '@tiptap/extension-emoji'
import { TaskList, TaskItem } from '@tiptap/extension-list'
import { TableKit } from '@tiptap/extension-table'
import { CodeBlockShiki } from 'tiptap-extension-code-block-shiki'
import { CellSelection } from 'prosemirror-tables'
import { ImageUpload } from '~/extensions/ImageUpload'

const editorRef = useTemplateRef('editorRef')

const { extension: Completion, handlers: aiHandlers, isLoading: aiLoading } = useEditorCompletion(editorRef)

const customHandlers = {
  imageUpload: {
    canExecute: (editor: Editor) => editor.can().insertContent({ type: 'imageUpload' }),
    execute: (editor: Editor) => editor.chain().focus().insertContent({ type: 'imageUpload' }),
    isActive: (editor: Editor) => editor.isActive('imageUpload'),
    isDisabled: undefined
  },
  table: {
    canExecute: (editor: Editor) => editor.can().insertTable({ rows: 3, cols: 3, withHeaderRow: true }),
    execute: (editor: Editor) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }),
    isActive: (editor: Editor) => editor.isActive('table'),
    isDisabled: undefined
  },
  ...aiHandlers
} satisfies EditorCustomHandlers

const { items: emojiItems } = useEditorEmojis()
const { items: mentionItems } = useEditorMentions()
const { items: suggestionItems } = useEditorSuggestions(customHandlers)
const { getItems: getDragHandleItems, onNodeChange } = useEditorDragHandle(customHandlers)
const { toolbarItems, bubbleToolbarItems, getImageToolbarItems, getTableToolbarItems } = useEditorToolbar(customHandlers, { aiLoading })

const content = ref(`# Welcome to the Editor

This is a **rich text** editor built with Nuxt UI and TipTap.

Try editing this content!`)

const extensions = computed(() => [
  CodeBlockShiki.configure({
    defaultTheme: 'material-theme',
    themes: { light: 'material-theme-lighter', dark: 'material-theme-palenight' }
  }),
  Completion,
  Emoji,
  ImageUpload,
  TableKit,
  TaskList,
  TaskItem
])
</script>

<template>
  <UEditor
    ref="editorRef"
    v-slot="{ editor, handlers }"
    v-model="content"
    content-type="markdown"
    :extensions="extensions"
    :handlers="customHandlers"
    autofocus
    placeholder="Write, type '/' for commands..."
    class="min-h-screen"
  >
    <UEditorToolbar
      :editor="editor"
      :items="toolbarItems"
      class="border-b border-default sticky top-0 px-4 py-2 bg-default"
    >
      <template #link>
        <EditorLinkPopover :editor="editor" />
      </template>
    </UEditorToolbar>

    <UEditorToolbar
      :editor="editor"
      :items="bubbleToolbarItems"
      layout="bubble"
      :should-show="({ editor, view, state }) => {
        if (editor.isActive('imageUpload') || editor.isActive('image') || state.selection instanceof CellSelection) {
          return false
        }
        return view.hasFocus() && !state.selection.empty
      }"
    >
      <template #link>
        <EditorLinkPopover :editor="editor" />
      </template>
    </UEditorToolbar>

    <UEditorToolbar
      :editor="editor"
      :items="getImageToolbarItems(editor)"
      layout="bubble"
      :should-show="({ editor, view }) => editor.isActive('image') && view.hasFocus()"
    />

    <UEditorToolbar
      :editor="editor"
      :items="getTableToolbarItems(editor)"
      layout="bubble"
      :should-show="({ editor, view }) => editor.state.selection instanceof CellSelection && view.hasFocus()"
    />

    <UEditorDragHandle v-slot="{ ui, onClick }" :editor="editor" @node-change="onNodeChange">
      <UButton
        icon="i-lucide-plus"
        color="neutral"
        variant="ghost"
        size="sm"
        :class="ui.handle()"
        @click="(e) => {
          e.stopPropagation()
          const node = onClick()
          handlers.suggestion?.execute(editor, { pos: node?.pos }).run()
        }"
      />

      <UDropdownMenu
        v-slot="{ open }"
        :modal="false"
        :items="getDragHandleItems(editor)"
        :content="{ side: 'left' }"
        :ui="{ content: 'w-48', label: 'text-xs' }"
        @update:open="editor.chain().setMeta('lockDragHandle', $event).run()"
      >
        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          icon="i-lucide-grip-vertical"
          :active="open"
          :class="ui.handle()"
        />
      </UDropdownMenu>
    </UEditorDragHandle>

    <UEditorEmojiMenu :editor="editor" :items="emojiItems" />
    <UEditorMentionMenu :editor="editor" :items="mentionItems" />
    <UEditorSuggestionMenu :editor="editor" :items="suggestionItems" />
  </UEditor>
</template>
```

:::
::

This structure matches the [official Editor template](https://github.com/nuxt-ui-templates/editor/blob/main/app/pages/index.vue) and provides a clean separation of concerns.

## Going further

You now have a fully functional Notion-like editor! To take it further, consider adding:

**Real-time Collaboration**

Integrate [Y.js](https://yjs.dev/) with TipTap's collaboration extension for multiplayer editing. The [Editor template](https://github.com/nuxt-ui-templates/editor) includes optional [PartyKit](https://partykit.io/) integration for real-time collaboration with cursor presence.

**Blob Storage**

Use [NuxtHub Blob](https://hub.nuxt.com/docs/features/blob) for image uploads with support for [Vercel Blob](https://vercel.com/docs/vercel-blob), Cloudflare R2, or Amazon S3.

**Export Options**

Add buttons to export content as HTML, Markdown, or PDF using TipTap's built-in serializers.

**Autosave**

Implement debounced autosave to persist content to a database or local storage.

::callout{icon="i-lucide-rocket" to="https://github.com/nuxt-ui-templates/editor" target="_blank"}
The official **Editor template** includes all features covered in this tutorial plus real-time collaboration. Get started instantly with `npx nuxi@latest init -t ui/editor my-editor-app`.
::

## Conclusion

You've built a complete Notion-like editor with:

- **Markdown support** for seamless content authoring
- **Multiple toolbars**: fixed, bubble, image, and table toolbars
- **Tables and task lists** for structured content
- **Syntax-highlighted code blocks** powered by Shiki
- **Slash commands** for quick insertions (type `/`)
- **Mentions and emojis** for rich interactions
- **Drag-and-drop** block reordering
- **Custom image upload** extension
- **AI-powered** text completion and transformation

The combination of Nuxt UI's purpose-built editor components and TipTap's extensible architecture makes building sophisticated Notion-like editing experiences straightforward and enjoyable.

**Resources:**

- [Nuxt UI Editor Components](https://ui.nuxt.com/docs/components/editor)
- [TipTap Documentation](https://tiptap.dev/docs)
- [AI SDK Documentation](https://ai-sdk.dev)
- [Editor Template](https://github.com/nuxt-ui-templates/editor)

We're excited to see what you'll build!
