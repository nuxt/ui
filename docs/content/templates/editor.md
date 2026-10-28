---
title: How to Build a Notion-like Editor with Nuxt and Tiptap
description: Learn how to build a Notion-like editor with slash commands, a drag handle, image uploads, AI completions and real-time collaboration using Nuxt, Nuxt UI and Tiptap.
navigation: false
date: 2026-10-27T10:00:00.000Z
---

## What we're building

By the end of this tutorial, you'll have a Notion-like editor with:

- **Markdown content** edited as rich text with the [`UEditor`](/docs/components/editor) component, built on [Tiptap](https://tiptap.dev)
- **Fixed and bubble toolbars** to format text and turn blocks into headings, lists or quotes
- **Mentions and emojis** with `@` and `:`
- **Slash commands and a drag handle** to insert, reorder, duplicate and delete blocks
- **Image uploads** stored with [NuxtHub Blob](https://hub.nuxt.com/docs/blob)
- **AI completions** and text transformations powered by the [AI SDK](https://ai-sdk.dev)
- **Real-time collaboration** with [Y.js](https://yjs.dev) and [PartyKit](https://www.partykit.io)

::callout{icon="i-simple-icons-github"}
Check out the [`Editor`](https://github.com/nuxt-ui-templates/editor) template on GitHub for a production-ready implementation with tables, code highlighting and more.
::

## Prerequisites

Before we start, make sure you have:

- Node.js 22.19+ or 24.11+ installed
- A [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) API key for the AI features
- A [PartyKit](https://www.partykit.io) account to deploy the collaboration server, only needed in production

## Project setup

Start by creating a new Nuxt project:

```bash
npm create nuxt@latest nuxt-editor
cd nuxt-editor
```

### Installing dependencies

Install Nuxt UI and the Tiptap packages:

::code-group{sync="pm"}
```bash [pnpm]
pnpm add @nuxt/ui tailwindcss @tiptap/core @tiptap/vue-3 @tiptap/pm @tiptap/extension-emoji
```

```bash [yarn]
yarn add @nuxt/ui tailwindcss @tiptap/core @tiptap/vue-3 @tiptap/pm @tiptap/extension-emoji
```

```bash [npm]
npm install @nuxt/ui tailwindcss @tiptap/core @tiptap/vue-3 @tiptap/pm @tiptap/extension-emoji
```

```bash [bun]
bun add @nuxt/ui tailwindcss @tiptap/core @tiptap/vue-3 @tiptap/pm @tiptap/extension-emoji
```
::

The `UEditor` component already comes with Tiptap and its [StarterKit](https://tiptap.dev/docs/editor/extensions/functionality/starterkit). The Tiptap packages are installed so your own code can import from them.

### Configuration

Register the Nuxt UI module in your `nuxt.config.ts`:

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

Nuxt UI requires wrapping your app with `UApp` for tooltips, toasts and overlays to work properly:

::code-tree-intersection
```vue [app/app.vue]
<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
```
::

## Creating the editor

The [`UEditor`](/docs/components/editor) component turns its `v-model` into rich text. With `content-type="markdown"`, the content goes in and comes out as Markdown:

::code-tree-intersection
```vue [app/pages/index.vue]
<script setup lang="ts">
const content = ref(`# Welcome to your editor

Start writing here. Everything you type is kept as **Markdown**, from *emphasis* to [links](https://ui.nuxt.com).

- Headings, lists and quotes
- **Bold**, *italic* and \`inline code\``)
</script>

<template>
  <UEditor
    v-model="content"
    content-type="markdown"
    placeholder="Start writing..."
    autofocus
    class="min-h-screen"
    :ui="{ base: 'p-4 sm:p-14', content: 'max-w-4xl mx-auto' }"
  />
</template>
```
::

The StarterKit already handles headings, lists, quotes, code blocks, links and the usual marks. The `ui` prop centers the content and gives it some room.

::tip{to="/docs/components/editor#content-type"}
The `content-type` prop also accepts `html` and `json`.
::

## Adding toolbars

The [`UEditorToolbar`](/docs/components/editor-toolbar) component displays buttons and dropdown menus that act on the editor. Each item with a `kind` runs one of the editor's [handlers](/docs/components/editor#handlers), which also tell the button when it's active or disabled.

### Defining the toolbar items

Keep the items in a composable so the page stays readable. The fixed toolbar holds undo and redo, while the bubble toolbar formats the selected text:

::code-tree-intersection
:::code-collapse

```ts [app/composables/useEditorToolbar.ts]
import type { EditorToolbarItem } from '@nuxt/ui'

export function useEditorToolbar() {
  const toolbarItems: EditorToolbarItem[][] = [[{
    kind: 'undo',
    icon: 'i-lucide-undo',
    tooltip: { text: 'Undo' }
  }, {
    kind: 'redo',
    icon: 'i-lucide-redo',
    tooltip: { text: 'Redo' }
  }]]

  const bubbleToolbarItems: EditorToolbarItem[][] = [[{
    label: 'Turn into',
    trailingIcon: 'i-lucide-chevron-down',
    activeColor: 'neutral',
    activeVariant: 'ghost',
    content: {
      align: 'start'
    },
    items: [{
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
  }, {
    kind: 'link',
    icon: 'i-lucide-link',
    tooltip: { text: 'Link' }
  }]]

  return {
    toolbarItems,
    bubbleToolbarItems
  }
}
```

:::
::

The `link` handler prompts for a URL, and the `Turn into` dropdown converts the current block with the `paragraph`, `heading`, list, `blockquote` and `codeBlock` handlers.

### Displaying the toolbars

The default slot of `UEditor` exposes the `editor` instance, which every toolbar and menu needs:

::code-tree-intersection
```vue [app/pages/index.vue] {2,14,21-24,26-32}
<script setup lang="ts">
const { toolbarItems, bubbleToolbarItems } = useEditorToolbar()

const content = ref(`# Welcome to your editor

Start writing here. Everything you type is kept as **Markdown**, from *emphasis* to [links](https://ui.nuxt.com).

- Headings, lists and quotes
- **Bold**, *italic* and \`inline code\``)
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="content"
    content-type="markdown"
    placeholder="Start writing..."
    autofocus
    class="min-h-screen"
    :ui="{ base: 'p-4 sm:p-14', content: 'max-w-4xl mx-auto' }"
  >
    <div class="sticky top-0 z-10 flex items-center justify-end gap-2 px-4 sm:px-14 py-2 border-b border-default bg-default">
      <UEditorToolbar :editor="editor" :items="toolbarItems" />
    </div>

    <UEditorToolbar
      :editor="editor"
      :items="bubbleToolbarItems"
      layout="bubble"
      :should-show="({ view, state }) => view.hasFocus() && !state.selection.empty && !editor.isActive('image')"
    />
  </UEditor>
</template>
```
::

The fixed toolbar sits in a sticky header at the top of the editor. With `layout="bubble"`, the second toolbar floats above the selection. Its `should-show` prop shows it only when some text is selected, not when an image is.

## Adding mentions and emojis

The [`UEditorMentionMenu`](/docs/components/editor-mention-menu) and [`UEditorEmojiMenu`](/docs/components/editor-emoji-menu) components open when you type `@` or `:` and insert the item you pick.

### Mentions

The mention menu needs a list of people to mention. Start with a fixed list, it gets replaced by the people editing the document in the [collaboration](#adding-real-time-collaboration) section:

::code-tree-intersection
```ts [app/composables/useEditorMentions.ts]
import type { EditorMentionMenuItem } from '@nuxt/ui'

export function useEditorMentions() {
  const items: EditorMentionMenuItem[] = [{
    label: 'benjamincanac',
    avatar: { src: 'https://avatars.githubusercontent.com/u/739984?v=4' }
  }, {
    label: 'atinux',
    avatar: { src: 'https://avatars.githubusercontent.com/u/904724?v=4' }
  }, {
    label: 'danielroe',
    avatar: { src: 'https://avatars.githubusercontent.com/u/28706372?v=4' }
  }]

  return {
    items
  }
}
```
::

### Emojis

The emoji menu uses the `Emoji` extension from Tiptap and its list of GitHub emojis:

::code-tree-intersection
:::code-collapse

```ts [app/composables/useEditorEmojis.ts]
import type { EditorEmojiMenuItem } from '@nuxt/ui'
import { Emoji, gitHubEmojis, shortcodeToEmoji } from '@tiptap/extension-emoji'

export function useEditorEmojis() {
  const items: EditorEmojiMenuItem[] = gitHubEmojis.filter(
    emoji => !emoji.name.startsWith('regional_indicator_')
  )

  // Read `:shortcode:` from Markdown content and write the emoji back
  const extension = Emoji.extend({
    markdownTokenName: 'emoji',
    markdownTokenizer: {
      name: 'emoji',
      level: 'inline',
      start: ':',
      tokenize(src) {
        const match = src.match(/^:([a-zA-Z0-9_+-]+):/)
        if (!match?.[1] || !shortcodeToEmoji(match[1], gitHubEmojis)) {
          return undefined
        }

        return { type: 'emoji', raw: match[0], name: match[1] }
      }
    },
    parseMarkdown(token, { createNode }) {
      return createNode('emoji', { name: token.name })
    },
    renderMarkdown(node) {
      const emoji = node.attrs?.name ? shortcodeToEmoji(node.attrs.name, gitHubEmojis) : undefined

      return emoji?.emoji || ''
    }
  })

  return {
    items,
    extension
  }
}
```

:::
::

Extending the extension with a Markdown tokenizer makes a `:sparkles:` shortcode in the Markdown content show as an emoji, and writes the emoji back when the content is saved.

### Displaying the mention and emoji menus

Add both menus to the editor, and the emoji extension with the `extensions` prop, which adds Tiptap extensions on top of the StarterKit:

::code-tree-intersection
```vue [app/pages/index.vue] {3-4,8,19,36,38}
<script setup lang="ts">
const { toolbarItems, bubbleToolbarItems } = useEditorToolbar()
const { items: mentionItems } = useEditorMentions()
const { items: emojiItems, extension: Emoji } = useEditorEmojis()

const content = ref(`# Welcome to your editor

Start writing here. Everything you type is kept as **Markdown**, from *emphasis* to [links](https://ui.nuxt.com) :sparkles:

- Headings, lists and quotes
- **Bold**, *italic* and \`inline code\``)
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="content"
    content-type="markdown"
    :extensions="[Emoji]"
    placeholder="Start writing..."
    autofocus
    class="min-h-screen"
    :ui="{ base: 'p-4 sm:p-14', content: 'max-w-4xl mx-auto' }"
  >
    <div class="sticky top-0 z-10 flex items-center justify-end gap-2 px-4 sm:px-14 py-2 border-b border-default bg-default">
      <UEditorToolbar :editor="editor" :items="toolbarItems" />
    </div>

    <UEditorToolbar
      :editor="editor"
      :items="bubbleToolbarItems"
      layout="bubble"
      :should-show="({ view, state }) => view.hasFocus() && !state.selection.empty && !editor.isActive('image')"
    />

    <UEditorMentionMenu :editor="editor" :items="mentionItems" />

    <UEditorEmojiMenu :editor="editor" :items="emojiItems" />
  </UEditor>
</template>
```
::

## Adding slash commands and a drag handle

The [`UEditorSuggestionMenu`](/docs/components/editor-suggestion-menu) component opens a list of blocks to insert when you type `/`. The [`UEditorDragHandle`](/docs/components/editor-drag-handle) component shows a handle next to the block under the cursor, to drag it somewhere else.

### Slash commands

The suggestion menu items use the same handlers as the toolbar. The `mention` and `emoji` handlers type `@` or `:` to open their menu:

::code-tree-intersection
:::code-collapse

```ts [app/composables/useEditorSuggestions.ts]
import type { EditorSuggestionMenuItem } from '@nuxt/ui'

export function useEditorSuggestions() {
  const items: EditorSuggestionMenuItem[][] = [[{
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

  return {
    items
  }
}
```

:::
::

### Block actions

Clicking the drag handle can also open a menu of actions on the block. The `mapEditorItems` utility turns the `kind` of each item into an `onSelect` that runs its handler on the block at `pos`:

::code-tree-intersection
:::code-collapse

```ts [app/composables/useEditorDragHandle.ts]
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Editor, JSONContent } from '@tiptap/vue-3'
import { mapEditorItems } from '@nuxt/ui/utils/editor'

export function useEditorDragHandle() {
  // The block the drag handle is next to
  const selectedNode = ref<{ node: JSONContent | null, pos: number }>()

  function getItems(editor: Editor): DropdownMenuItem[][] {
    const pos = selectedNode.value?.pos
    if (pos === undefined) {
      return []
    }

    // Turns the `kind` of each item into an `onSelect` that runs its handler
    return mapEditorItems(editor, [[{
      label: 'Turn into',
      icon: 'i-lucide-repeat-2',
      children: [
        { kind: 'paragraph', label: 'Paragraph', icon: 'i-lucide-type' },
        { kind: 'heading', level: 1, label: 'Heading 1', icon: 'i-lucide-heading-1' },
        { kind: 'heading', level: 2, label: 'Heading 2', icon: 'i-lucide-heading-2' },
        { kind: 'heading', level: 3, label: 'Heading 3', icon: 'i-lucide-heading-3' },
        { kind: 'bulletList', label: 'Bullet List', icon: 'i-lucide-list' },
        { kind: 'orderedList', label: 'Numbered List', icon: 'i-lucide-list-ordered' },
        { kind: 'blockquote', label: 'Blockquote', icon: 'i-lucide-text-quote' },
        { kind: 'codeBlock', label: 'Code Block', icon: 'i-lucide-square-code' }
      ]
    }, {
      kind: 'clearFormatting',
      pos,
      label: 'Reset formatting',
      icon: 'i-lucide-rotate-ccw'
    }], [{
      kind: 'duplicate',
      pos,
      label: 'Duplicate',
      icon: 'i-lucide-copy'
    }, {
      kind: 'moveUp',
      pos,
      label: 'Move up',
      icon: 'i-lucide-arrow-up'
    }, {
      kind: 'moveDown',
      pos,
      label: 'Move down',
      icon: 'i-lucide-arrow-down'
    }], [{
      kind: 'delete',
      pos,
      label: 'Delete',
      icon: 'i-lucide-trash',
      color: 'error'
    }]]) as DropdownMenuItem[][]
  }

  function onNodeChange(event: { node: JSONContent | null, pos: number }) {
    selectedNode.value = event
  }

  return {
    getItems,
    onNodeChange
  }
}
```

:::
::

### Displaying the slash commands and drag handle

Add the suggestion menu and the drag handle to the editor:

::code-tree-intersection
:::code-collapse

```vue [app/pages/index.vue] {5-6,18,22,42,44-53,55-58,60-79}
<script setup lang="ts">
const { toolbarItems, bubbleToolbarItems } = useEditorToolbar()
const { items: mentionItems } = useEditorMentions()
const { items: emojiItems, extension: Emoji } = useEditorEmojis()
const { items: suggestionItems } = useEditorSuggestions()
const { getItems: getDragHandleItems, onNodeChange } = useEditorDragHandle()

const content = ref(`# Welcome to your editor

Start writing here. Everything you type is kept as **Markdown**, from *emphasis* to [links](https://ui.nuxt.com) :sparkles:

- Headings, lists and quotes
- **Bold**, *italic* and \`inline code\``)
</script>

<template>
  <UEditor
    v-slot="{ editor, handlers }"
    v-model="content"
    content-type="markdown"
    :extensions="[Emoji]"
    placeholder="Write, type '/' for commands..."
    autofocus
    class="min-h-screen"
    :ui="{ base: 'p-4 sm:p-14', content: 'max-w-4xl mx-auto' }"
  >
    <div class="sticky top-0 z-10 flex items-center justify-end gap-2 px-4 sm:px-14 py-2 border-b border-default bg-default">
      <UEditorToolbar :editor="editor" :items="toolbarItems" />
    </div>

    <UEditorToolbar
      :editor="editor"
      :items="bubbleToolbarItems"
      layout="bubble"
      :should-show="({ view, state }) => view.hasFocus() && !state.selection.empty && !editor.isActive('image')"
    />

    <UEditorMentionMenu :editor="editor" :items="mentionItems" />

    <UEditorEmojiMenu :editor="editor" :items="emojiItems" />

    <UEditorSuggestionMenu :editor="editor" :items="suggestionItems" />

    <UEditorDragHandle v-slot="{ ui, onClick }" :editor="editor" @node-change="onNodeChange">
      <UButton
        icon="i-lucide-plus"
        color="neutral"
        variant="ghost"
        size="sm"
        aria-label="Add a block"
        :class="ui.handle()"
        @click="(e: MouseEvent) => {
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
        :ui="{ content: 'w-48' }"
        @update:open="editor.chain().setMeta('lockDragHandle', $event).run()"
      >
        <UButton
          icon="i-lucide-grip-vertical"
          color="neutral"
          variant="ghost"
          active-variant="soft"
          size="sm"
          aria-label="Block actions"
          :active="open"
          :class="ui.handle()"
        />
      </UDropdownMenu>
    </UEditorDragHandle>
  </UEditor>
</template>
```

:::
::

Here's how the drag handle works:

**The default slot**

Replacing the default handle with your own buttons gives you the `ui` classes to style them like the handle, and an `onClick` function that selects the block and returns it.

**The plus button**

The `suggestion` handler, from the `handlers` exposed by the `UEditor` slot, opens the slash commands on a new line after the block.

**The block actions**

The `node-change` event tells the composable which block the handle is next to. While the dropdown menu is open, the `lockDragHandle` meta keeps the handle on that block instead of following the cursor.

## Uploading images

Images are uploaded to a blob storage with [NuxtHub](https://hub.nuxt.com). It stores them on the filesystem in development, and in [Vercel Blob](https://vercel.com/docs/vercel-blob), [Cloudflare R2](https://hub.nuxt.com/docs/blob#set-a-driver) or [Amazon S3](https://hub.nuxt.com/docs/blob#set-a-driver) in production.

### Installing NuxtHub

::code-group{sync="pm"}
```bash [pnpm]
pnpm add @nuxthub/core
```

```bash [yarn]
yarn add @nuxthub/core
```

```bash [npm]
npm install @nuxthub/core
```

```bash [bun]
bun add @nuxthub/core
```
::

Register the module and enable the blob storage:

::code-tree-intersection
```ts [nuxt.config.ts] {2,4,6-8}
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxthub/core'],

  css: ['~/assets/css/main.css'],

  hub: {
    blob: true
  }
})
```
::

### Creating the server routes

Create an endpoint that validates and stores the uploaded image with `blob.handleUpload`:

::code-tree-intersection
```ts [server/api/upload.post.ts]
import { defineEventHandler } from 'nuxt/server'
import { blob } from 'hub:blob'

export default defineEventHandler((event) => {
  return blob.handleUpload(event, {
    formKey: 'file',
    multiple: false,
    ensure: {
      maxSize: '2MB',
      types: ['image']
    },
    put: {
      addRandomSuffix: true
    }
  })
})
```
::

Then a route that serves the stored images. The `Content-Security-Policy` header stops an uploaded SVG from running scripts when it's opened on its own:

::code-tree-intersection
```ts [server/routes/images/[...pathname].ts]
import { defineEventHandler, getRouterParam } from 'nuxt/server'
import { blob } from 'hub:blob'

export default defineEventHandler((event) => {
  const pathname = getRouterParam(event, 'pathname')!

  // An uploaded SVG can't run scripts when opened on its own
  event.res.headers.set('Content-Security-Policy', 'default-src \'none\';')

  return blob.serve(event, pathname)
})
```
::

### Creating the upload block

The upload happens in a block of the document, displayed with the [`UFileUpload`](/docs/components/file-upload) component. Once the image is uploaded with NuxtHub's `useUpload` composable, the block replaces itself with the image:

::code-tree-intersection
:::code-collapse

```vue [app/components/editor/ImageUploadNode.vue]
<script setup lang="ts">
import type { NodeViewProps } from '@tiptap/vue-3'
import { NodeViewWrapper } from '@tiptap/vue-3'

const props = defineProps<NodeViewProps>()

const loading = ref(false)
const error = ref<string>()

const upload = useUpload('/api/upload', { formKey: 'file', multiple: false })

async function onUpload(file: File | null | undefined) {
  if (!file) {
    return
  }

  loading.value = true
  error.value = undefined

  try {
    const result = await upload(file)

    const pos = props.getPos()
    if (typeof pos !== 'number') {
      return
    }

    // Replace the upload block with the uploaded image
    props.editor
      .chain()
      .focus()
      .deleteRange({ from: pos, to: pos + 1 })
      .setImage({ src: result.url || `/images/${result.pathname}` })
      .run()
  } catch (e) {
    error.value = (e as { data?: { message?: string } }).data?.message || 'The image could not be uploaded'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <NodeViewWrapper>
    <UFileUpload
      accept="image/*"
      label="Upload an image"
      :description="error || 'SVG, PNG, JPG or GIF (max. 2MB)'"
      :preview="false"
      class="min-h-48"
      :ui="{ description: error ? 'text-error' : '' }"
      @update:model-value="onUpload"
    >
      <template #leading>
        <UAvatar
          :icon="error ? 'i-lucide-alert-circle' : loading ? 'i-lucide-loader-circle' : 'i-lucide-image'"
          size="xl"
          :ui="{ icon: [loading && 'animate-spin', error && 'text-error'] }"
        />
      </template>
    </UFileUpload>
  </NodeViewWrapper>
</template>
```

:::
::

A custom Tiptap node renders this component in the editor:

::code-tree-intersection
:::code-collapse

```ts [app/components/editor/ImageUploadExtension.ts]
import { Node, mergeAttributes } from '@tiptap/core'
import type { CommandProps, NodeViewRenderer } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ImageUploadNodeComponent from './ImageUploadNode.vue'

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
      insertImageUpload: () => ({ commands }: CommandProps) => {
        return commands.insertContent({ type: this.name })
      }
    }
  }
})

export default ImageUpload
```

:::
::

::callout{icon="i-custom-tiptap" to="https://tiptap.dev/docs/editor/extensions/custom-extensions" target="_blank"}
Learn more about creating custom extensions in the Tiptap documentation.
::

### Inserting the upload block

Add an `imageUpload` item to the fixed toolbar:

::code-tree-intersection
:::code-collapse

```ts [app/composables/useEditorToolbar.ts] {1,3-5,13-17,20}
import type { EditorCustomHandlers, EditorToolbarItem } from '@nuxt/ui'

// The handlers type the custom `kind` of the items, like `imageUpload`
export function useEditorToolbar<T extends EditorCustomHandlers>(_customHandlers?: T) {
  const toolbarItems: EditorToolbarItem<T>[][] = [[{
    kind: 'undo',
    icon: 'i-lucide-undo',
    tooltip: { text: 'Undo' }
  }, {
    kind: 'redo',
    icon: 'i-lucide-redo',
    tooltip: { text: 'Redo' }
  }], [{
    kind: 'imageUpload',
    label: 'Add',
    icon: 'i-lucide-image',
    tooltip: { text: 'Add image' }
  }]]

  const bubbleToolbarItems: EditorToolbarItem<T>[][] = [[{
    label: 'Turn into',
    trailingIcon: 'i-lucide-chevron-down',
    activeColor: 'neutral',
    activeVariant: 'ghost',
    content: {
      align: 'start'
    },
    items: [{
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
  }, {
    kind: 'link',
    icon: 'i-lucide-link',
    tooltip: { text: 'Link' }
  }]]

  return {
    toolbarItems,
    bubbleToolbarItems
  }
}
```

:::
::

And to the slash commands:

::code-tree-intersection
:::code-collapse

```ts [app/composables/useEditorSuggestions.ts] {1,3-5,55-58}
import type { EditorCustomHandlers, EditorSuggestionMenuItem } from '@nuxt/ui'

// The handlers type the custom `kind` of the items, like `imageUpload`
export function useEditorSuggestions<T extends EditorCustomHandlers>(_customHandlers?: T) {
  const items: EditorSuggestionMenuItem<T>[][] = [[{
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
    kind: 'imageUpload',
    label: 'Image',
    icon: 'i-lucide-image'
  }, {
    kind: 'horizontalRule',
    label: 'Horizontal Rule',
    icon: 'i-lucide-separator-horizontal'
  }]]

  return {
    items
  }
}
```

:::
::

The editor doesn't know the `imageUpload` kind yet, so the page defines it with a custom handler and passes it to the `handlers` prop:

::code-tree-intersection
:::code-collapse

```vue [app/pages/index.vue] {2-4,6-13,15,18,34-35,49}
<script setup lang="ts">
import type { EditorCustomHandlers } from '@nuxt/ui'
import type { Editor } from '@tiptap/vue-3'
import { ImageUpload } from '~/components/editor/ImageUploadExtension'

const customHandlers = {
  imageUpload: {
    canExecute: (editor: Editor) => editor.can().insertContent({ type: 'imageUpload' }),
    execute: (editor: Editor) => editor.chain().focus().insertContent({ type: 'imageUpload' }),
    isActive: (editor: Editor) => editor.isActive('imageUpload'),
    isDisabled: undefined
  }
} satisfies EditorCustomHandlers

const { toolbarItems, bubbleToolbarItems } = useEditorToolbar(customHandlers)
const { items: mentionItems } = useEditorMentions()
const { items: emojiItems, extension: Emoji } = useEditorEmojis()
const { items: suggestionItems } = useEditorSuggestions(customHandlers)
const { getItems: getDragHandleItems, onNodeChange } = useEditorDragHandle()

const content = ref(`# Welcome to your editor

Start writing here. Everything you type is kept as **Markdown**, from *emphasis* to [links](https://ui.nuxt.com) :sparkles:

- Headings, lists and quotes
- **Bold**, *italic* and \`inline code\``)
</script>

<template>
  <UEditor
    v-slot="{ editor, handlers }"
    v-model="content"
    content-type="markdown"
    :extensions="[Emoji, ImageUpload]"
    :handlers="customHandlers"
    placeholder="Write, type '/' for commands..."
    autofocus
    class="min-h-screen"
    :ui="{ base: 'p-4 sm:p-14', content: 'max-w-4xl mx-auto' }"
  >
    <div class="sticky top-0 z-10 flex items-center justify-end gap-2 px-4 sm:px-14 py-2 border-b border-default bg-default">
      <UEditorToolbar :editor="editor" :items="toolbarItems" />
    </div>

    <UEditorToolbar
      :editor="editor"
      :items="bubbleToolbarItems"
      layout="bubble"
      :should-show="({ view, state }) => view.hasFocus() && !state.selection.empty && !editor.isActive('image') && !editor.isActive('imageUpload')"
    />

    <UEditorMentionMenu :editor="editor" :items="mentionItems" />

    <UEditorEmojiMenu :editor="editor" :items="emojiItems" />

    <UEditorSuggestionMenu :editor="editor" :items="suggestionItems" />

    <UEditorDragHandle v-slot="{ ui, onClick }" :editor="editor" @node-change="onNodeChange">
      <UButton
        icon="i-lucide-plus"
        color="neutral"
        variant="ghost"
        size="sm"
        aria-label="Add a block"
        :class="ui.handle()"
        @click="(e: MouseEvent) => {
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
        :ui="{ content: 'w-48' }"
        @update:open="editor.chain().setMeta('lockDragHandle', $event).run()"
      >
        <UButton
          icon="i-lucide-grip-vertical"
          color="neutral"
          variant="ghost"
          active-variant="soft"
          size="sm"
          aria-label="Block actions"
          :active="open"
          :class="ui.handle()"
        />
      </UDropdownMenu>
    </UEditorDragHandle>
  </UEditor>
</template>
```

:::
::

Both composables receive the custom handlers so TypeScript accepts the `imageUpload` kind in their items. The bubble toolbar also stays hidden on the upload block.

## Adding AI completions

The AI features use the [`useCompletion`](https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-completion) composable from the [AI SDK](https://ai-sdk.dev) to stream text from a server endpoint. They come in two forms:

- **Ghost text** that continues your sentence, accepted with :kbd{value="tab"}
- **Text transformations** that fix, extend, reduce, simplify, summarize or translate the selected text

### Installing the AI SDK

::code-group{sync="pm"}
```bash [pnpm]
pnpm add ai @ai-sdk/vue @vueuse/core
```

```bash [yarn]
yarn add ai @ai-sdk/vue @vueuse/core
```

```bash [npm]
npm install ai @ai-sdk/vue @vueuse/core
```

```bash [bun]
bun add ai @ai-sdk/vue @vueuse/core
```
::

Create a `.env` file with your AI Gateway API key:

::code-tree-intersection
```bash [.env]
AI_GATEWAY_API_KEY=your-api-key-here
```
::

::note
With [Vercel AI Gateway](https://vercel.com/docs/ai-gateway), you don't need individual API keys for OpenAI, Anthropic, or Google. The AI Gateway provides a unified API to access hundreds of models through a single endpoint.
::

### Creating the completion endpoint

The endpoint picks the instructions for the requested `mode` and streams the result as plain text with [`streamText`](https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text):

::code-tree-intersection
:::code-collapse

```ts [server/api/completion.post.ts]
import { createError, defineEventHandler, readBody } from 'nuxt/server'
import { streamText, createTextStreamResponse } from 'ai'

export default defineEventHandler(async (event) => {
  const { prompt, mode, language } = await readBody<{ prompt?: string, mode?: string, language?: string }>(event)
  if (!prompt) {
    throw createError({ status: 400, message: 'Prompt is required' })
  }
  if (prompt.length > 10_000) {
    throw createError({ status: 413, message: 'Prompt is too long' })
  }

  let instructions: string
  let maxOutputTokens: number

  const preserveMarkdown = 'IMPORTANT: Preserve all markdown formatting (bold, italic, links, etc.) exactly as in the original.'

  switch (mode) {
    case 'fix':
      instructions = `You are a writing assistant. Fix all spelling and grammar errors in the given text. ${preserveMarkdown} Only output the corrected text, nothing else.`
      maxOutputTokens = 500
      break
    case 'extend':
      instructions = `You are a writing assistant. Extend the given text with more details, examples, and explanations while maintaining the same style. ${preserveMarkdown} Only output the extended text, nothing else.`
      maxOutputTokens = 500
      break
    case 'reduce':
      instructions = `You are a writing assistant. Make the given text more concise by removing unnecessary words while keeping the meaning. ${preserveMarkdown} Only output the reduced text, nothing else.`
      maxOutputTokens = 300
      break
    case 'simplify':
      instructions = `You are a writing assistant. Simplify the given text to make it easier to understand, using simpler words and shorter sentences. ${preserveMarkdown} Only output the simplified text, nothing else.`
      maxOutputTokens = 400
      break
    case 'summarize':
      instructions = 'You are a writing assistant. Summarize the given text concisely while keeping the key points. Only output the summary, nothing else.'
      maxOutputTokens = 200
      break
    case 'translate':
      instructions = `You are a writing assistant. Translate the given text to ${language || 'English'}. ${preserveMarkdown} Only output the translated text, nothing else.`
      maxOutputTokens = 500
      break
    case 'continue':
    default:
      instructions = `You are a writing assistant providing inline autocompletions.
CRITICAL RULES:
- Output ONLY the NEW text that comes AFTER the user's input
- NEVER repeat any words from the end of the user's text
- Keep completions short (1 sentence max)
- Match the tone and style of the existing text
- Output plain text only, never use markdown syntax`
      maxOutputTokens = 25
      break
  }

  const result = streamText({
    model: 'deepseek/deepseek-v4.1-flash',
    instructions,
    prompt,
    maxOutputTokens,
    reasoning: 'none',
    providerOptions: {
      gateway: {
        order: ['baseten'],
        zeroDataRetention: true,
        disallowPromptTraining: true
      }
    }
  })

  return createTextStreamResponse({ stream: result.textStream })
})
```

:::
::

With `reasoning: 'none'`, the model answers without a thinking step so suggestions come back fast. The gateway options prefer Baseten and only use providers with zero data retention and no prompt training. Request-level zero data retention is only available on Vercel Pro and Enterprise plans. Prompts over 10,000 characters are rejected.

### Creating the ghost text extension

This Tiptap extension displays the suggestion after the cursor as a decoration, which isn't part of the document until you accept it:

::code-tree-intersection
:::code-collapse

```ts [app/components/editor/CompletionExtension.ts]
import { Extension } from '@tiptap/core'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import type { Editor } from '@tiptap/vue-3'
import { useDebounceFn } from '@vueuse/core'

export interface CompletionOptions {
  /**
   * Debounce delay in ms before triggering completion
   * @defaultValue 250
   */
  debounce?: number
  /**
   * Whether to automatically trigger completion while typing
   * @defaultValue true
   */
  autoTrigger?: boolean
  /**
   * Characters that prevent completion while typing the word they start (slash commands, emojis, mentions)
   * @defaultValue ['/', ':', '@']
   */
  triggerCharacters?: string[]
  /**
   * Called when completion should be triggered, receives the editor instance.
   * Return `false` to skip showing a suggestion.
   */
  onTrigger?: (editor: Editor) => boolean | undefined
  /**
   * Called when suggestion is accepted
   */
  onAccept?: () => void
  /**
   * Called when suggestion is dismissed
   */
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

function dismiss(editor: Editor, storage: CompletionStorage, options: CompletionOptions) {
  storage.clearSuggestion()
  // Force decoration update
  editor.view.dispatch(editor.state.tr.setMeta('completionUpdate', true))
  options.onDismiss?.()
}

export const Completion = Extension.create<CompletionOptions, CompletionStorage>({
  name: 'completion',

  addOptions() {
    return {
      debounce: 250,
      autoTrigger: true,
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
      Tab: ({ editor }) => {
        if (!this.storage.visible || !this.storage.suggestion || this.storage.position === undefined) {
          return false
        }

        // Store values before clearing
        const suggestion = this.storage.suggestion
        const position = this.storage.position

        // Clear suggestion first
        this.storage.clearSuggestion()

        // Force decoration update
        editor.view.dispatch(editor.state.tr.setMeta('completionUpdate', true))

        // Insert the suggestion text
        editor.chain().focus().insertContentAt(position, suggestion).run()

        this.options.onAccept?.()
        return true
      },
      Escape: ({ editor }) => {
        if (!this.storage.visible) {
          return false
        }

        dismiss(editor as Editor, this.storage, this.options)
        return true
      }
    }
  },

  onUpdate({ editor }) {
    // Clear suggestion on any edit
    if (this.storage.visible) {
      dismiss(editor as Editor, this.storage, this.options)
    }

    if (this.options.autoTrigger) {
      this.storage.debouncedTrigger?.(editor as Editor)
    }
  },

  onSelectionUpdate({ editor }) {
    if (this.storage.visible) {
      dismiss(editor as Editor, this.storage, this.options)
    }
  },

  onCreate() {
    const storage = this.storage
    const options = this.options

    // Create debounced trigger function for this instance
    this.storage.debouncedTrigger = useDebounceFn((editor: Editor) => {
      if (!options.onTrigger) return

      const { state } = editor
      const { selection } = state
      const { $from } = selection

      // Only suggest at end of block with content
      const isAtEndOfBlock = $from.parentOffset === $from.parent.content.size
      const hasContent = $from.parent.textContent.trim().length > 0
      const textContent = $from.parent.textContent

      // Don't trigger if sentence is complete (ends with punctuation)
      const endsWithPunctuation = /[.!?]\s*$/.test(textContent)

      // Don't trigger while typing a word that starts with a trigger character
      const lastWord = textContent.split(/\s/).pop() || ''
      const endsWithTrigger = (options.triggerCharacters || []).some(char => lastWord.startsWith(char))

      if (!isAtEndOfBlock || !hasContent || endsWithPunctuation || endsWithTrigger) {
        return
      }

      // Pass editor to let the handler extract content (e.g., as markdown)
      if (options.onTrigger(editor) === false) {
        return
      }

      // Set position and mark as visible
      storage.position = selection.from
      storage.visible = true
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

It asks for a suggestion while you type, accepts it with :kbd{value="tab"} and dismisses it with :kbd{value="escape"}. Set its `autoTrigger` option to `false` to turn it off.

### Creating the completion composable

The composable connects the extension to `useCompletion`, and exposes a handler for each AI action:

::code-tree-intersection
:::code-collapse

```ts [app/composables/useEditorCompletion.ts]
import { useCompletion } from '@ai-sdk/vue'
import type { MappablePosition } from '@tiptap/core'
import type { Editor } from '@tiptap/vue-3'
import { Completion } from '~/components/editor/CompletionExtension'
import type { CompletionStorage } from '~/components/editor/CompletionExtension'

type TransformMode = 'fix' | 'extend' | 'reduce' | 'simplify' | 'summarize' | 'translate'
type CompletionMode = 'continue' | TransformMode

// Only the end of the document is sent as context to continue writing
const MAX_CONTEXT_LENGTH = 2000

export interface UseEditorCompletionOptions {
  api?: string
}

export function useEditorCompletion(editorRef: Ref<{ editor: Editor | undefined } | null | undefined>, options: UseEditorCompletionOptions = {}) {
  // Range toolbar actions replace with their result, kept in sync with edits made while the request runs
  let target: { from: MappablePosition, to: MappablePosition } | undefined
  const mode = ref<CompletionMode>('continue')
  const language = ref<string>()

  function getCompletionStorage() {
    const storage = editorRef.value?.editor?.storage as Record<string, CompletionStorage> | undefined
    return storage?.completion
  }

  const { completion, complete, isLoading, stop, setCompletion } = useCompletion({
    api: options.api || '/api/completion',
    streamProtocol: 'text',
    body: computed(() => ({
      mode: mode.value,
      language: language.value
    })),
    onFinish: (_prompt, completionText) => {
      const editor = editorRef.value?.editor

      // Transform modes replace the selection with the full result
      if (mode.value !== 'continue' && target && completionText && editor) {
        const range = { from: target.from.position, to: target.to.position }
        editor.chain()
          .focus()
          .insertContentAt(range, parseResult(editor, range, completionText))
          .run()
      }

      target = undefined
    },
    onError: (error) => {
      console.error('AI completion error:', error)
      target = undefined
      getCompletionStorage()?.clearSuggestion()
    }
  })

  // Stream "continue" results into the inline suggestion, or into the document for the toolbar action
  watch(completion, (newCompletion, oldCompletion) => {
    const editor = editorRef.value?.editor
    if (!editor || !newCompletion || mode.value !== 'continue') return

    const storage = getCompletionStorage()
    if (storage?.visible && storage.position !== undefined) {
      storage.setSuggestion(withLeadingSpace(editor, storage.position, newCompletion))
      editor.view.dispatch(editor.state.tr.setMeta('completionUpdate', true))
    } else if (target) {
      // The target moves past each inserted chunk
      const pos = target.to.position
      let delta = newCompletion.slice(oldCompletion?.length || 0)
      if (!oldCompletion) {
        delta = withLeadingSpace(editor, pos, delta)
      }

      editor.chain().focus().command(({ tr }) => {
        tr.insertText(delta, pos)
        return true
      }).run()
    }
  })

  // Map the target through every transaction, `editor.utils` handles collaborators' edits too.
  // Positions are recreated each time since the Yjs relative position isn't updated by local edits.
  watch(() => editorRef.value?.editor, (editor) => {
    editor?.on('transaction', ({ transaction }) => {
      if (!target) return
      setTarget(
        editor,
        editor.utils.getUpdatedPosition(target.from, transaction).position.position,
        editor.utils.getUpdatedPosition(target.to, transaction).position.position
      )
    })
  }, { immediate: true })

  function setTarget(editor: Editor, from: number, to: number) {
    target = {
      from: editor.utils.createMappablePosition(from),
      to: editor.utils.createMappablePosition(to)
    }
  }

  // Add a space before the text if it would stick to the previous word
  function withLeadingSpace(editor: Editor, pos: number, text: string) {
    const charBefore = editor.state.doc.textBetween(Math.max(0, pos - 1), pos)
    return charBefore && !/\s/.test(charBefore) && !/^\s/.test(text) ? ` ${text}` : text
  }

  function getMarkdown(editor: Editor, from: number, to: number) {
    const { doc } = editor.state
    if (editor.markdown) {
      return editor.markdown.serialize(doc.cut(from, to).toJSON())
    }
    // Fallback to plain text
    return doc.textBetween(from, to, '\n')
  }

  // Parse the result as markdown. Inside a single block, only insert its inline content so the block keeps its type.
  function parseResult(editor: Editor, { from, to }: { from: number, to: number }, text: string) {
    const textblock = getTextblock(editor, from, to)
    // Code is inserted as is
    if (textblock?.type.spec.code) {
      return [{ type: 'text', text }]
    }

    const blocks = editor.markdown?.parse(text).content
    if (!blocks) return text

    if (textblock && blocks.length === 1 && blocks[0]?.type === 'paragraph') {
      return blocks[0].content ?? []
    }
    return blocks
  }

  // Within a single block, only send its inline content so list or quote markers aren't inserted again
  function getSelectionMarkdown(editor: Editor) {
    const { $from, $to, from, to } = editor.state.selection
    const textblock = getTextblock(editor, from, to)
    if (!editor.markdown || !textblock) {
      return getMarkdown(editor, from, to)
    }
    if (textblock.type.spec.code) {
      return editor.state.doc.textBetween(from, to)
    }

    const content = textblock.cut($from.parentOffset, $to.parentOffset).content.toJSON()
    return editor.markdown.serialize({ type: 'doc', content: [{ type: 'paragraph', content }] })
  }

  // The text block containing the whole range, if any
  function getTextblock(editor: Editor, from: number, to: number) {
    const { doc } = editor.state
    const $from = doc.resolve(from)
    return $from.parent.isTextblock && $from.sameParent(doc.resolve(to)) ? $from.parent : undefined
  }

  function completeContinue(editor: Editor, pos: number) {
    mode.value = 'continue'
    complete(getMarkdown(editor, 0, pos).slice(-MAX_CONTEXT_LENGTH))
  }

  function triggerContinue(editor: Editor) {
    if (isLoading.value) return

    getCompletionStorage()?.clearSuggestion()

    // Continue after the selection, or from the cursor
    const { to } = editor.state.selection
    setTarget(editor, to, to)
    completeContinue(editor, to)
  }

  function triggerTransform(editor: Editor, transformMode: TransformMode, lang?: string) {
    const { from, to, empty } = editor.state.selection
    if (isLoading.value || empty) return

    getCompletionStorage()?.clearSuggestion()

    mode.value = transformMode
    language.value = lang
    setTarget(editor, from, to)
    complete(getSelectionMarkdown(editor))
  }

  // Configure Completion extension
  const extension = Completion.configure({
    onTrigger: (editor) => {
      if (isLoading.value) return false
      completeContinue(editor, editor.state.selection.from)
    },
    onAccept: () => {
      setCompletion('')
    },
    onDismiss: () => {
      stop()
      setCompletion('')
    }
  })

  function createTransformHandler(transformMode: TransformMode) {
    return {
      canExecute: (editor: Editor) => !editor.state.selection.empty && !isLoading.value,
      execute: (editor: Editor, cmd?: { language?: string }) => {
        triggerTransform(editor, transformMode, cmd?.language)
        return editor.chain()
      },
      isActive: (_editor: Editor, cmd?: { language?: string }) => !!(isLoading.value && mode.value === transformMode && language.value === cmd?.language),
      isDisabled: (editor: Editor) => editor.state.selection.empty || !!isLoading.value
    }
  }

  // Create handlers for toolbar
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
    aiFix: createTransformHandler('fix'),
    aiExtend: createTransformHandler('extend'),
    aiReduce: createTransformHandler('reduce'),
    aiSimplify: createTransformHandler('simplify'),
    aiSummarize: createTransformHandler('summarize'),
    aiTranslate: createTransformHandler('translate')
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

The ghost text streams into the extension, while the text transformations replace the selection once the full answer has arrived. Both send Markdown so the model sees the structure, up to the last 2,000 characters before the cursor to continue writing. A transformation inside a single block only replaces its inline content, so lists, quotes and headings keep their type, and code blocks get plain text. The range to replace is tracked with the mappable positions of `editor.utils`, so edits made while the model answers don't shift it.

### Displaying the AI actions

Add an `Improve` dropdown to the bubble toolbar, with a loading state while the model answers:

::code-tree-intersection
:::code-collapse

```ts [app/composables/useEditorToolbar.ts] {4,20-74,147}
import type { EditorCustomHandlers, EditorToolbarItem } from '@nuxt/ui'

// The handlers type the custom `kind` of the items, like `imageUpload`
export function useEditorToolbar<T extends EditorCustomHandlers>(_customHandlers?: T, options: { aiLoading?: Ref<boolean | undefined> } = {}) {
  const toolbarItems: EditorToolbarItem<T>[][] = [[{
    kind: 'undo',
    icon: 'i-lucide-undo',
    tooltip: { text: 'Undo' }
  }, {
    kind: 'redo',
    icon: 'i-lucide-redo',
    tooltip: { text: 'Redo' }
  }], [{
    kind: 'imageUpload',
    label: 'Add',
    icon: 'i-lucide-image',
    tooltip: { text: 'Add image' }
  }]]

  const bubbleToolbarItems = computed(() => [[{
    icon: 'i-lucide-sparkles',
    label: 'Improve',
    activeColor: 'neutral',
    activeVariant: 'ghost',
    loading: options.aiLoading?.value,
    content: {
      align: 'start'
    },
    items: [{
      kind: 'aiFix',
      label: 'Fix spelling & grammar',
      icon: 'i-lucide-spell-check'
    }, {
      kind: 'aiExtend',
      label: 'Extend text',
      icon: 'i-lucide-unfold-vertical'
    }, {
      kind: 'aiReduce',
      label: 'Reduce text',
      icon: 'i-lucide-fold-vertical'
    }, {
      kind: 'aiSimplify',
      label: 'Simplify text',
      icon: 'i-lucide-lightbulb'
    }, {
      kind: 'aiContinue',
      label: 'Continue sentence',
      icon: 'i-lucide-text'
    }, {
      kind: 'aiSummarize',
      label: 'Summarize',
      icon: 'i-lucide-list'
    }, {
      label: 'Translate',
      icon: 'i-lucide-languages',
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
      }, {
        kind: 'aiTranslate',
        language: 'German',
        label: 'German'
      }]
    }]
  }], [{
    label: 'Turn into',
    trailingIcon: 'i-lucide-chevron-down',
    activeColor: 'neutral',
    activeVariant: 'ghost',
    content: {
      align: 'start'
    },
    items: [{
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
  }, {
    kind: 'link',
    icon: 'i-lucide-link',
    tooltip: { text: 'Link' }
  }]] satisfies EditorToolbarItem<T>[][])

  return {
    toolbarItems,
    bubbleToolbarItems
  }
}
```

:::
::

And a `Continue writing` command to the slash commands:

::code-tree-intersection
:::code-collapse

```ts [app/composables/useEditorSuggestions.ts] {6-12}
import type { EditorCustomHandlers, EditorSuggestionMenuItem } from '@nuxt/ui'

// The handlers type the custom `kind` of the items, like `imageUpload`
export function useEditorSuggestions<T extends EditorCustomHandlers>(_customHandlers?: T) {
  const items: EditorSuggestionMenuItem<T>[][] = [[{
    type: 'label',
    label: 'AI'
  }, {
    kind: 'aiContinue',
    label: 'Continue writing',
    icon: 'i-lucide-sparkles'
  }], [{
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
    kind: 'imageUpload',
    label: 'Image',
    icon: 'i-lucide-image'
  }, {
    kind: 'horizontalRule',
    label: 'Horizontal Rule',
    icon: 'i-lucide-separator-horizontal'
  }]]

  return {
    items
  }
}
```

:::
::

Then register the extension and the AI handlers in the page. The composable reads the editor from a template ref:

::code-tree-intersection
:::code-collapse

```vue [app/pages/index.vue] {6,8,16-17,20,36,40}
<script setup lang="ts">
import type { EditorCustomHandlers } from '@nuxt/ui'
import type { Editor } from '@tiptap/vue-3'
import { ImageUpload } from '~/components/editor/ImageUploadExtension'

const editorRef = useTemplateRef('editorRef')

const { extension: Completion, handlers: aiHandlers, isLoading: aiLoading } = useEditorCompletion(editorRef)

const customHandlers = {
  imageUpload: {
    canExecute: (editor: Editor) => editor.can().insertContent({ type: 'imageUpload' }),
    execute: (editor: Editor) => editor.chain().focus().insertContent({ type: 'imageUpload' }),
    isActive: (editor: Editor) => editor.isActive('imageUpload'),
    isDisabled: undefined
  },
  ...aiHandlers
} satisfies EditorCustomHandlers

const { toolbarItems, bubbleToolbarItems } = useEditorToolbar(customHandlers, { aiLoading })
const { items: mentionItems } = useEditorMentions()
const { items: emojiItems, extension: Emoji } = useEditorEmojis()
const { items: suggestionItems } = useEditorSuggestions(customHandlers)
const { getItems: getDragHandleItems, onNodeChange } = useEditorDragHandle()

const content = ref(`# Welcome to your editor

Start writing here. Everything you type is kept as **Markdown**, from *emphasis* to [links](https://ui.nuxt.com) :sparkles:

- Headings, lists and quotes
- **Bold**, *italic* and \`inline code\``)
</script>

<template>
  <UEditor
    ref="editorRef"
    v-slot="{ editor, handlers }"
    v-model="content"
    content-type="markdown"
    :extensions="[Completion, Emoji, ImageUpload]"
    :handlers="customHandlers"
    placeholder="Write, type '/' for commands..."
    autofocus
    class="min-h-screen"
    :ui="{ base: 'p-4 sm:p-14', content: 'max-w-4xl mx-auto' }"
  >
    <div class="sticky top-0 z-10 flex items-center justify-end gap-2 px-4 sm:px-14 py-2 border-b border-default bg-default">
      <UEditorToolbar :editor="editor" :items="toolbarItems" />
    </div>

    <UEditorToolbar
      :editor="editor"
      :items="bubbleToolbarItems"
      layout="bubble"
      :should-show="({ view, state }) => view.hasFocus() && !state.selection.empty && !editor.isActive('image') && !editor.isActive('imageUpload')"
    />

    <UEditorMentionMenu :editor="editor" :items="mentionItems" />

    <UEditorEmojiMenu :editor="editor" :items="emojiItems" />

    <UEditorSuggestionMenu :editor="editor" :items="suggestionItems" />

    <UEditorDragHandle v-slot="{ ui, onClick }" :editor="editor" @node-change="onNodeChange">
      <UButton
        icon="i-lucide-plus"
        color="neutral"
        variant="ghost"
        size="sm"
        aria-label="Add a block"
        :class="ui.handle()"
        @click="(e: MouseEvent) => {
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
        :ui="{ content: 'w-48' }"
        @update:open="editor.chain().setMeta('lockDragHandle', $event).run()"
      >
        <UButton
          icon="i-lucide-grip-vertical"
          color="neutral"
          variant="ghost"
          active-variant="soft"
          size="sm"
          aria-label="Block actions"
          :active="open"
          :class="ui.handle()"
        />
      </UDropdownMenu>
    </UEditorDragHandle>
  </UEditor>
</template>
```

:::
::

## Adding real-time collaboration

Collaboration relies on [Y.js](https://yjs.dev), a CRDT library that merges the changes of everyone editing the same document. Tiptap's collaboration extensions keep the editor in sync with a Y.js document, and a [PartyKit](https://www.partykit.io) server relays the changes between collaborators.

### Installing the dependencies

::code-group{sync="pm"}
```bash [pnpm]
pnpm add yjs y-partykit @tiptap/extension-collaboration @tiptap/extension-collaboration-caret
```

```bash [yarn]
yarn add yjs y-partykit @tiptap/extension-collaboration @tiptap/extension-collaboration-caret
```

```bash [npm]
npm install yjs y-partykit @tiptap/extension-collaboration @tiptap/extension-collaboration-caret
```

```bash [bun]
bun add yjs y-partykit @tiptap/extension-collaboration @tiptap/extension-collaboration-caret
```
::

And the PartyKit CLI to run the server:

::code-group{sync="pm"}
```bash [pnpm]
pnpm add -D partykit
```

```bash [yarn]
yarn add -D partykit
```

```bash [npm]
npm install -D partykit
```

```bash [bun]
bun add -d partykit
```
::

### Creating the PartyKit server

The server hands each WebSocket connection to `y-partykit`, which syncs the document of the room:

::code-tree-intersection
```ts [party/server.ts]
import type * as Party from 'partykit/server'
import { onConnect } from 'y-partykit'

export default class EditorServer implements Party.Server {
  constructor(readonly room: Party.Room) {}

  onConnect(connection: Party.Connection) {
    // Keep the document in the room storage once the last collaborator leaves
    return onConnect(connection, this.room, {
      persist: { mode: 'snapshot' }
    })
  }
}
```
::

Configure the PartyKit project:

::code-tree-intersection
```json [partykit.json]
{
  "$schema": "https://www.partykit.io/schema.json",
  "name": "nuxt-editor",
  "main": "party/server.ts",
  "compatibilityDate": "2026-10-27"
}
```
::

Start the server on `localhost:1999` next to your Nuxt dev server:

```bash
npx partykit dev
```

Then add its host to your `.env` file:

::code-tree-intersection
```bash [.env] {2}
AI_GATEWAY_API_KEY=your-api-key-here
NUXT_PUBLIC_PARTYKIT_HOST=localhost:1999
```
::

### Creating the collaboration composable

The composable connects to the PartyKit room and returns the Tiptap extensions that sync the editor with it:

::code-tree-intersection
:::code-collapse

```ts [app/composables/useEditorCollaboration.ts]
import * as Y from 'yjs'
import YPartyKitProvider from 'y-partykit/provider'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCaret from '@tiptap/extension-collaboration-caret'
import type { Extensions } from '@tiptap/core'

export interface CollaborationUser {
  name: string
  color: string
}

// Tailwind CSS colors, each collaborator gets one as their primary color
export const COLORS: Record<string, string> = {
  orange: '#fb923c',
  amber: '#fbbf24',
  lime: '#a3e635',
  emerald: '#34d399',
  cyan: '#22d3ee',
  sky: '#38bdf8',
  violet: '#a78bfa',
  fuchsia: '#e879f9',
  rose: '#fb7185'
}

const ADJECTIVES = ['Swift', 'Clever', 'Bright', 'Bold', 'Calm', 'Brave', 'Wise', 'Lucky']
const ANIMALS = ['Fox', 'Owl', 'Bear', 'Wolf', 'Eagle', 'Otter', 'Lynx', 'Raven']

function pick<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)]!
}

export const getRandomName = () => `${pick(ADJECTIVES)} ${pick(ANIMALS)}`
export const getRandomColor = () => pick(Object.keys(COLORS))

export function useEditorCollaboration({ room, host, user }: { room?: string, host?: string, user: CollaborationUser }) {
  const extensions = shallowRef<Extensions>([])
  const connectedUsers = ref<CollaborationUser[]>([])
  const synced = ref(false)

  // Without a room and a host, the editor works on its own
  if (!room || !host) {
    return { enabled: false, ready: ref(true), extensions, connectedUsers, synced }
  }

  // The Y.js document every collaborator edits
  const ydoc = new Y.Doc()
  const ready = ref(false)

  let provider: YPartyKitProvider | undefined

  // The provider opens a WebSocket, so it only connects in the browser
  onMounted(() => {
    const connection = new YPartyKitProvider(host, room, ydoc)
    provider = connection

    // Share our name and color with the other collaborators
    connection.awareness.setLocalStateField('user', user)
    connection.awareness.on('change', () => {
      connectedUsers.value = Array.from(connection.awareness.getStates().values())
        .map(state => state.user as CollaborationUser | undefined)
        .filter((user): user is CollaborationUser => !!user)
    })

    connection.on('sync', (isSynced: boolean) => {
      synced.value = isSynced
    })

    extensions.value = [
      Collaboration.configure({ document: ydoc }),
      CollaborationCaret.configure({ provider: connection, user })
    ]

    // The editor waits for the extensions before it renders
    ready.value = true
  })

  onUnmounted(() => {
    provider?.destroy()
    ydoc.destroy()
  })

  return { enabled: true, ready, extensions, connectedUsers, synced }
}
```

:::
::

Here's what it does:

**Without a room**

Collaboration only starts with both a room and a host. Otherwise the editor works on its own, like in the previous sections.

**The provider**

`YPartyKitProvider` syncs the Y.js document with the room over a WebSocket. It's created in `onMounted`, so the editor waits for `ready` before it renders.

**Awareness**

Each collaborator shares their name and color through the provider's awareness, which also gives the list of people in the room. The `CollaborationCaret` extension uses it to display their cursors.

Display the people in the room next to the toolbar:

::code-tree-intersection
```vue [app/components/editor/CollaborationUsers.vue]
<script setup lang="ts">
import type { CollaborationUser } from '~/composables/useEditorCollaboration'

defineProps<{
  users: CollaborationUser[]
}>()
</script>

<template>
  <UAvatarGroup v-if="users.length" class="me-auto">
    <UTooltip v-for="user in users" :key="user.name" :text="user.name">
      <UAvatar :alt="user.name" size="sm" :style="{ color: user.color }" />
    </UTooltip>
  </UAvatarGroup>
</template>
```
::

### Updating the configuration

Expose the PartyKit host to the browser through the runtime config:

::code-tree-intersection
```ts [nuxt.config.ts] {8,10-15,17-21}
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxthub/core'],

  css: ['~/assets/css/main.css'],

  hub: {
    blob: true
  },

  runtimeConfig: {
    public: {
      // Set with the `NUXT_PUBLIC_PARTYKIT_HOST` environment variable
      partykitHost: ''
    }
  },

  vite: {
    optimizeDeps: {
      // Pre-bundled so the dev server never loads a second copy of Y.js
      include: ['yjs', 'y-partykit/provider']
    }
  }
})
```
::

Style the cursors of the other collaborators:

::code-tree-intersection
:::code-collapse

```css [app/assets/css/main.css] {4-13,15-27}
@import "tailwindcss";
@import "@nuxt/ui";

/* The carets and names of the other collaborators */
.collaboration-carets__caret {
  border-left: 1px solid #0d0d0d;
  border-right: 1px solid #0d0d0d;
  margin-left: -1px;
  margin-right: -1px;
  pointer-events: none;
  position: relative;
  word-break: normal;
}

.collaboration-carets__label {
  border-radius: 3px 3px 3px 0;
  color: #0d0d0d;
  font-size: 12px;
  font-weight: 600;
  left: -1px;
  line-height: normal;
  padding: 0.1rem 0.3rem;
  position: absolute;
  top: -1.4em;
  user-select: none;
  white-space: nowrap;
}
```

:::
::

Mention the people in the room instead of the fixed list:

::code-tree-intersection
```ts [app/composables/useEditorMentions.ts] {2,4-13,15-20,22-26}
import type { EditorMentionMenuItem } from '@nuxt/ui'
import type { CollaborationUser } from './useEditorCollaboration'

const USERS: EditorMentionMenuItem[] = [{
  label: 'benjamincanac',
  avatar: { src: 'https://avatars.githubusercontent.com/u/739984?v=4' }
}, {
  label: 'atinux',
  avatar: { src: 'https://avatars.githubusercontent.com/u/904724?v=4' }
}, {
  label: 'danielroe',
  avatar: { src: 'https://avatars.githubusercontent.com/u/28706372?v=4' }
}]

// Mention the people in the room, or a fixed list when editing alone
export function useEditorMentions(users?: Ref<CollaborationUser[]>) {
  const items = computed<EditorMentionMenuItem[]>(() => {
    if (!users?.value.length) {
      return USERS
    }

    return users.value.map(user => ({
      label: user.name,
      avatar: { alt: user.name, style: { color: user.color } }
    }))
  })

  return {
    items
  }
}
```
::

### Joining a room

Connect the page to the room from the `?room=` query parameter:

::code-tree-intersection
:::code-collapse

```vue [app/pages/index.vue] {6-8,12-13,15-19,21-23,38,50-51,53-58,60-65,70,73,75-76,82,85}
<script setup lang="ts">
import type { EditorCustomHandlers } from '@nuxt/ui'
import type { Editor } from '@tiptap/vue-3'
import { ImageUpload } from '~/components/editor/ImageUploadExtension'

const route = useRoute()
const appConfig = useAppConfig()
const runtimeConfig = useRuntimeConfig()

const editorRef = useTemplateRef('editorRef')

// A random name and color, created on the server so both renders agree
const user = useState('user', () => ({ name: getRandomName(), color: getRandomColor() }))

const { enabled: collaborationEnabled, ready, extensions: collaborationExtensions, connectedUsers, synced } = useEditorCollaboration({
  room: route.query.room as string | undefined,
  host: runtimeConfig.public.partykitHost,
  user: { name: user.value.name, color: COLORS[user.value.color]! }
})

if (collaborationEnabled) {
  appConfig.ui.colors.primary = user.value.color
}

const { extension: Completion, handlers: aiHandlers, isLoading: aiLoading } = useEditorCompletion(editorRef)

const customHandlers = {
  imageUpload: {
    canExecute: (editor: Editor) => editor.can().insertContent({ type: 'imageUpload' }),
    execute: (editor: Editor) => editor.chain().focus().insertContent({ type: 'imageUpload' }),
    isActive: (editor: Editor) => editor.isActive('imageUpload'),
    isDisabled: undefined
  },
  ...aiHandlers
} satisfies EditorCustomHandlers

const { toolbarItems, bubbleToolbarItems } = useEditorToolbar(customHandlers, { aiLoading })
const { items: mentionItems } = useEditorMentions(connectedUsers)
const { items: emojiItems, extension: Emoji } = useEditorEmojis()
const { items: suggestionItems } = useEditorSuggestions(customHandlers)
const { getItems: getDragHandleItems, onNodeChange } = useEditorDragHandle()

const content = ref(`# Welcome to your editor

Start writing here. Everything you type is kept as **Markdown**, from *emphasis* to [links](https://ui.nuxt.com) :sparkles:

- Headings, lists and quotes
- **Bold**, *italic* and \`inline code\``)

// The extensions are reactive, the collaboration ones load in the browser
const extensions = computed(() => [Completion, Emoji, ImageUpload, ...collaborationExtensions.value])

// With collaboration, the content lives in the Y.js document instead
function onUpdate(value: string) {
  if (!collaborationEnabled) {
    content.value = value
  }
}

// A new room starts empty, it gets the default content once it has synced
watch(() => synced.value && editorRef.value?.editor, (editor) => {
  if (editor && editor.isEmpty) {
    editor.commands.setContent(content.value, { contentType: 'markdown' })
  }
})
</script>

<template>
  <UEditor
    v-if="ready"
    ref="editorRef"
    v-slot="{ editor, handlers }"
    :model-value="collaborationEnabled ? undefined : content"
    content-type="markdown"
    :extensions="extensions"
    :starter-kit="collaborationEnabled ? { undoRedo: false } : undefined"
    :handlers="customHandlers"
    placeholder="Write, type '/' for commands..."
    autofocus
    class="min-h-screen"
    :ui="{ base: 'p-4 sm:p-14', content: 'max-w-4xl mx-auto' }"
    @update:model-value="onUpdate"
  >
    <div class="sticky top-0 z-10 flex items-center justify-end gap-2 px-4 sm:px-14 py-2 border-b border-default bg-default">
      <EditorCollaborationUsers :users="connectedUsers" />

      <UEditorToolbar :editor="editor" :items="toolbarItems" />
    </div>

    <UEditorToolbar
      :editor="editor"
      :items="bubbleToolbarItems"
      layout="bubble"
      :should-show="({ view, state }) => view.hasFocus() && !state.selection.empty && !editor.isActive('image') && !editor.isActive('imageUpload')"
    />

    <UEditorMentionMenu :editor="editor" :items="mentionItems" />

    <UEditorEmojiMenu :editor="editor" :items="emojiItems" />

    <UEditorSuggestionMenu :editor="editor" :items="suggestionItems" />

    <UEditorDragHandle v-slot="{ ui, onClick }" :editor="editor" @node-change="onNodeChange">
      <UButton
        icon="i-lucide-plus"
        color="neutral"
        variant="ghost"
        size="sm"
        aria-label="Add a block"
        :class="ui.handle()"
        @click="(e: MouseEvent) => {
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
        :ui="{ content: 'w-48' }"
        @update:open="editor.chain().setMeta('lockDragHandle', $event).run()"
      >
        <UButton
          icon="i-lucide-grip-vertical"
          color="neutral"
          variant="ghost"
          active-variant="soft"
          size="sm"
          aria-label="Block actions"
          :active="open"
          :class="ui.handle()"
        />
      </UDropdownMenu>
    </UEditorDragHandle>
  </UEditor>
</template>
```

:::
::

Here's what changes with collaboration:

**The content**

The document now lives in Y.js, so the editor doesn't receive a `model-value`. A new room starts empty and gets the default content once it has synced.

**Undo and redo**

The StarterKit's history would undo the other collaborators' changes too, so it's turned off with the `starter-kit` prop. The collaboration extension adds undo and redo commands that only undo your own changes.

**The colors**

Each collaborator gets a random name and color. The color draws their cursor and avatar for the others, and becomes the primary color of their own page.

Open [`localhost:3000/?room=my-room`](http://localhost:3000/?room=my-room) in two windows and start typing in one of them.

### Ignoring collaborators' edits

Remote changes fire the editor's `update` event too, so every keystroke from a collaborator would ask for a completion and dismiss yours. Update the completion extension to skip them with `isChangeOrigin`:

::code-tree-intersection
:::code-collapse

```ts [app/components/editor/CompletionExtension.ts] {2,90,95-111,167-170,181-184}
import { Extension } from '@tiptap/core'
import { isChangeOrigin } from '@tiptap/extension-collaboration'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import type { Editor } from '@tiptap/vue-3'
import { useDebounceFn } from '@vueuse/core'

export interface CompletionOptions {
  /**
   * Debounce delay in ms before triggering completion
   * @defaultValue 250
   */
  debounce?: number
  /**
   * Whether to automatically trigger completion while typing
   * @defaultValue true
   */
  autoTrigger?: boolean
  /**
   * Characters that prevent completion while typing the word they start (slash commands, emojis, mentions)
   * @defaultValue ['/', ':', '@']
   */
  triggerCharacters?: string[]
  /**
   * Called when completion should be triggered, receives the editor instance.
   * Return `false` to skip showing a suggestion.
   */
  onTrigger?: (editor: Editor) => boolean | undefined
  /**
   * Called when suggestion is accepted
   */
  onAccept?: () => void
  /**
   * Called when suggestion is dismissed
   */
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

function dismiss(editor: Editor, storage: CompletionStorage, options: CompletionOptions) {
  storage.clearSuggestion()
  // Force decoration update
  editor.view.dispatch(editor.state.tr.setMeta('completionUpdate', true))
  options.onDismiss?.()
}

export const Completion = Extension.create<CompletionOptions, CompletionStorage>({
  name: 'completion',

  addOptions() {
    return {
      debounce: 250,
      autoTrigger: true,
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
    const options = this.options

    return [
      new Plugin({
        key: completionPluginKey,
        state: {
          init: () => null,
          apply(tr, _value, oldState, newState) {
            // Yjs replaces the whole document on remote changes, so the position can't be mapped. The suggestion
            // sits at the cursor, so follow it, and drop the suggestion if a collaborator changed its paragraph.
            if (isChangeOrigin(tr) && storage.position !== undefined) {
              const { $from } = newState.selection
              if ($from.parent.eq(oldState.doc.resolve(storage.position).parent)) {
                storage.position = $from.pos
              } else {
                storage.clearSuggestion()
                options.onDismiss?.()
              }
            }
            return null
          }
        },
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
      Tab: ({ editor }) => {
        if (!this.storage.visible || !this.storage.suggestion || this.storage.position === undefined) {
          return false
        }

        // Store values before clearing
        const suggestion = this.storage.suggestion
        const position = this.storage.position

        // Clear suggestion first
        this.storage.clearSuggestion()

        // Force decoration update
        editor.view.dispatch(editor.state.tr.setMeta('completionUpdate', true))

        // Insert the suggestion text
        editor.chain().focus().insertContentAt(position, suggestion).run()

        this.options.onAccept?.()
        return true
      },
      Escape: ({ editor }) => {
        if (!this.storage.visible) {
          return false
        }

        dismiss(editor as Editor, this.storage, this.options)
        return true
      }
    }
  },

  onUpdate({ editor, transaction }) {
    // Ignore edits from collaborators
    if (isChangeOrigin(transaction)) return

    // Clear suggestion on any edit
    if (this.storage.visible) {
      dismiss(editor as Editor, this.storage, this.options)
    }

    if (this.options.autoTrigger) {
      this.storage.debouncedTrigger?.(editor as Editor)
    }
  },

  onSelectionUpdate({ editor, transaction }) {
    // Collaborator edits move the selection too
    if (isChangeOrigin(transaction)) return

    if (this.storage.visible) {
      dismiss(editor as Editor, this.storage, this.options)
    }
  },

  onCreate() {
    const storage = this.storage
    const options = this.options

    // Create debounced trigger function for this instance
    this.storage.debouncedTrigger = useDebounceFn((editor: Editor) => {
      if (!options.onTrigger) return

      const { state } = editor
      const { selection } = state
      const { $from } = selection

      // Only suggest at end of block with content
      const isAtEndOfBlock = $from.parentOffset === $from.parent.content.size
      const hasContent = $from.parent.textContent.trim().length > 0
      const textContent = $from.parent.textContent

      // Don't trigger if sentence is complete (ends with punctuation)
      const endsWithPunctuation = /[.!?]\s*$/.test(textContent)

      // Don't trigger while typing a word that starts with a trigger character
      const lastWord = textContent.split(/\s/).pop() || ''
      const endsWithTrigger = (options.triggerCharacters || []).some(char => lastWord.startsWith(char))

      if (!isAtEndOfBlock || !hasContent || endsWithPunctuation || endsWithTrigger) {
        return
      }

      // Pass editor to let the handler extract content (e.g., as markdown)
      if (options.onTrigger(editor) === false) {
        return
      }

      // Set position and mark as visible
      storage.position = selection.from
      storage.visible = true
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

Y.js replaces the whole document on remote changes, so the position of the suggestion can't be mapped. It sits at the cursor, so it follows the cursor instead, and is dropped if a collaborator changes its paragraph.

## Going further

You now have a working Notion-like editor. To take it further, consider adding:

**Tables and code highlighting**

The [Editor template](https://github.com/nuxt-ui-templates/editor) adds tables with `@tiptap/extension-table`, syntax highlighting in code blocks with Shiki, and dedicated toolbars for images and tables.

**Document storage**

The PartyKit server keeps each room in its storage. Use the `load` and `callback` options of `y-partykit` to load and save the documents in your own database.

**Authentication**

The upload and completion routes accept requests from anyone, and anyone who knows a room name can join it. Protect them before you deploy, for example with [nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils), and limit how much each user can upload or generate.

**Another collaboration backend**

Y.js works with other providers, like [Liveblocks](https://liveblocks.io) or [Tiptap Collaboration](https://tiptap.dev/product/collaboration), if you'd rather not host the server yourself.

## Deploying to Vercel

Install the Vercel Blob SDK, which NuxtHub uses to store the images on Vercel:

::code-group{sync="pm"}
```bash [pnpm]
pnpm add @vercel/blob
```

```bash [yarn]
yarn add @vercel/blob
```

```bash [npm]
npm install @vercel/blob
```

```bash [bun]
bun add @vercel/blob
```
::

Deploy your editor to Vercel with zero configuration:

```bash
npx vercel deploy
```

Then, in the Vercel dashboard:

- Enable **AI Gateway** and add credits so requests can be processed.
- Create a **Blob** store in the Storage tab and connect it to your project.

Deploy the PartyKit server and set its host, like `nuxt-editor.username.partykit.dev`, as the `NUXT_PUBLIC_PARTYKIT_HOST` environment variable of your Vercel project:

```bash
npx partykit deploy
```

::note
On Vercel you don't need to manually add `AI_GATEWAY_API_KEY`. Vercel handles the gateway configuration for deployments. Keep using `.env` locally for development.
::

## Conclusion

You've built a Notion-like editor with:

- **Rich text editing** of Markdown content with Nuxt UI's `UEditor`
- **Toolbars, menus and a drag handle** driven by the editor's handlers
- **Image uploads** with NuxtHub Blob
- **AI completions** with the AI SDK and AI Gateway
- **Real-time collaboration** with Y.js and PartyKit

**Resources:**

- [Nuxt UI Editor Component](/docs/components/editor)
- [Tiptap Documentation](https://tiptap.dev/docs)
- [NuxtHub Blob](https://hub.nuxt.com/docs/blob)
- [AI SDK Documentation](https://ai-sdk.dev)
- [PartyKit Documentation](https://docs.partykit.io)
- [Nuxt Editor Template](https://github.com/nuxt-ui-templates/editor)
