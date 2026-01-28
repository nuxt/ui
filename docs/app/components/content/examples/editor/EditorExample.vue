<script setup lang="ts">
import type { EditorCustomHandlers, EditorToolbarItem, EditorSuggestionMenuItem, EditorMentionMenuItem, EditorEmojiMenuItem, DropdownMenuItem } from '@nuxt/ui'
import type { Editor, JSONContent } from '@tiptap/vue-3'
import { upperFirst } from 'scule'
import { mapEditorItems } from '@nuxt/ui/utils/editor'
import { Emoji, gitHubEmojis } from '@tiptap/extension-emoji'
import { TextAlign } from '@tiptap/extension-text-align'
import { CodeBlockShiki } from 'tiptap-extension-code-block-shiki'
import { ImageUpload } from './EditorImageUploadExtension'
import { useEditorCompletion } from './EditorUseCompletion'
import EditorLinkPopover from './EditorLinkPopover.vue'

const editorRef = useTemplateRef('editorRef')

const value = ref(`# Building Modern Interfaces with Nuxt UI

Welcome to the **Nuxt UI Editor** — a powerful rich text editing experience built on [TipTap](https://tiptap.dev). This editor combines *flexibility* with ease of use, making content creation a breeze.

![Placeholder](/placeholder.jpeg)

## Rich Formatting Options

The editor supports all common text formatting including **bold**, *italic*, <u>underline</u>, ~~strikethrough~~, and \`inline code\`. You can also combine them for **_bold and italic_** text.

### Interactive Features

Try out these powerful capabilities:

- **Bubble Menu** — Select any text to see formatting options appear
- **Slash Commands** — Type \`/\` for quick access to blocks and formatting
- **Mentions** — Use \`@\` to tag people or entities
- **Emoji Picker** — Type \`:\` followed by an emoji name like :smile:
- **Drag & Drop** — Hover over any block to see the drag handle

> **Pro tip:** You can use keyboard shortcuts like Cmd/Ctrl + B for bold, Cmd/Ctrl + I for italic, and more!

### Advanced Capabilities

1. **Custom Extensions** — Add your own TipTap extensions seamlessly
2. **Multiple Content Types** — Support for JSON, HTML, and Markdown
3. **Customizable Toolbars** — Fixed, bubble, and floating layouts
4. **Theme Integration** — Fully styled with Nuxt UI theme system

#### Code Blocks

Perfect for technical documentation:

\`\`\`vue
<template>
  <UEditor v-model="value" content-type="markdown" />
</template>
\`\`\`

---

Whether you're building a blog, documentation site, or content management system, the Nuxt UI Editor provides everything you need for a professional editing experience. Visit [ui.nuxt.com](https://ui.nuxt.com) to explore more components.`)

const { extension: completionExtension, handlers: aiHandlers, isLoading: aiLoading } = useEditorCompletion(editorRef)

const customHandlers = {
  imageUpload: {
    canExecute: (editor: Editor) => editor.can().insertContent({ type: 'imageUpload' }),
    execute: (editor: Editor) => editor.chain().focus().insertContent({ type: 'imageUpload' }),
    isActive: (editor: Editor) => editor.isActive('imageUpload'),
    isDisabled: undefined
  },
  ...aiHandlers
} satisfies EditorCustomHandlers

const fixedToolbarItems = [[{
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
  content: {
    align: 'start'
  },
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
  }, {
    kind: 'heading',
    level: 4,
    icon: 'i-lucide-heading-4',
    label: 'Heading 4'
  }]
}, {
  icon: 'i-lucide-list',
  tooltip: { text: 'Lists' },
  content: {
    align: 'start'
  },
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
  slot: 'link' as const,
  icon: 'i-lucide-link'
}, {
  kind: 'imageUpload',
  icon: 'i-lucide-image',
  tooltip: { text: 'Image' }
}], [{
  icon: 'i-lucide-align-justify',
  tooltip: { text: 'Text Align' },
  content: {
    align: 'end'
  },
  items: [{
    kind: 'textAlign',
    align: 'left',
    icon: 'i-lucide-align-left',
    label: 'Align Left'
  }, {
    kind: 'textAlign',
    align: 'center',
    icon: 'i-lucide-align-center',
    label: 'Align Center'
  }, {
    kind: 'textAlign',
    align: 'right',
    icon: 'i-lucide-align-right',
    label: 'Align Right'
  }, {
    kind: 'textAlign',
    align: 'justify',
    icon: 'i-lucide-align-justify',
    label: 'Align Justify'
  }]
}]] satisfies EditorToolbarItem<typeof customHandlers>[][]

const bubbleToolbarItems = computed(() => [[{
  icon: 'i-lucide-sparkles',
  label: 'Improve',
  activeColor: 'neutral',
  activeVariant: 'ghost',
  loading: aiLoading.value,
  content: {
    align: 'start'
  },
  items: [{
    kind: 'aiFix',
    icon: 'i-lucide-spell-check',
    label: 'Fix spelling & grammar'
  }, {
    kind: 'aiExtend',
    icon: 'i-lucide-unfold-vertical',
    label: 'Extend text'
  }, {
    kind: 'aiReduce',
    icon: 'i-lucide-fold-vertical',
    label: 'Reduce text'
  }, {
    kind: 'aiSimplify',
    icon: 'i-lucide-lightbulb',
    label: 'Simplify text'
  }, {
    kind: 'aiContinue',
    icon: 'i-lucide-text',
    label: 'Continue sentence'
  }, {
    kind: 'aiSummarize',
    icon: 'i-lucide-list',
    label: 'Summarize'
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
  tooltip: { text: 'Turn into' },
  content: {
    align: 'start'
  },
  ui: {
    label: 'text-xs'
  },
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
    kind: 'heading',
    level: 4,
    icon: 'i-lucide-heading-4',
    label: 'Heading 4'
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
  slot: 'link' as const,
  icon: 'i-lucide-link'
}, {
  kind: 'imageUpload',
  icon: 'i-lucide-image',
  tooltip: { text: 'Image' }
}], [{
  icon: 'i-lucide-align-justify',
  tooltip: { text: 'Text Align' },
  content: {
    align: 'end'
  },
  items: [{
    kind: 'textAlign',
    align: 'left',
    icon: 'i-lucide-align-left',
    label: 'Align Left'
  }, {
    kind: 'textAlign',
    align: 'center',
    icon: 'i-lucide-align-center',
    label: 'Align Center'
  }, {
    kind: 'textAlign',
    align: 'right',
    icon: 'i-lucide-align-right',
    label: 'Align Right'
  }, {
    kind: 'textAlign',
    align: 'justify',
    icon: 'i-lucide-align-justify',
    label: 'Align Justify'
  }]
}]] satisfies EditorToolbarItem<typeof customHandlers>[][])

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
      const { selection } = state

      const pos = selection.from
      const node = state.doc.nodeAt(pos)

      if (node && node.type.name === 'image') {
        editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).insertContentAt(pos, { type: 'imageUpload' }).run()
      }
    }
  }], [{
    icon: 'i-lucide-trash',
    tooltip: { text: 'Delete' },
    onClick: () => {
      const { state } = editor
      const { selection } = state

      const pos = selection.from
      const node = state.doc.nodeAt(pos)

      if (node && node.type.name === 'image') {
        editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).run()
      }
    }
  }]]
}

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
        { kind: 'heading', level: 4, label: 'Heading 4', icon: 'i-lucide-heading-4' },
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
    },
    {
      label: 'Copy to clipboard',
      icon: 'i-lucide-clipboard',
      onSelect: async () => {
        if (!selectedNode.value) return

        const pos = selectedNode.value.pos
        const node = editor.state.doc.nodeAt(pos)
        if (node) {
          await navigator.clipboard.writeText(node.textContent)
        }
      }
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
  ]], customHandlers) as DropdownMenuItem[][]
}

const suggestionItems = [[{
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
}]] satisfies EditorSuggestionMenuItem<typeof customHandlers>[][]

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
}, {
  label: 'J-Michalek',
  avatar: { src: 'https://avatars.githubusercontent.com/u/71264422?v=4' }
}, {
  label: 'genu',
  avatar: { src: 'https://avatars.githubusercontent.com/u/928780?v=4' }
}]

const emojiItems: EditorEmojiMenuItem[] = gitHubEmojis.filter(emoji => !emoji.name.startsWith('regional_indicator_'))
</script>

<template>
  <UEditor
    ref="editorRef"
    v-slot="{ editor, handlers }"
    v-model="value"
    content-type="markdown"
    :extensions="[
      Emoji,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      ImageUpload,
      CodeBlockShiki.configure({
        defaultTheme: 'material-theme',
        themes: {
          light: 'material-theme-lighter',
          dark: 'material-theme-palenight'
        }
      }),
      completionExtension
    ]"
    :handlers="customHandlers"
    placeholder="Write, type '/' for commands..."
    :ui="{ base: 'p-8 sm:px-16 py-13.5' }"
    class="w-full"
  >
    <UEditorToolbar :editor="editor" :items="fixedToolbarItems" class="border-b border-muted sticky top-0 inset-x-0 px-8 sm:px-16 py-2 z-50 bg-default overflow-x-auto">
      <template #link>
        <EditorLinkPopover :editor="editor" auto-open />
      </template>
    </UEditorToolbar>

    <UEditorToolbar
      :editor="editor"
      :items="bubbleToolbarItems"
      layout="bubble"
      :should-show="({ editor, view, state }) => {
        if (editor.isActive('imageUpload') || editor.isActive('image')) {
          return false
        }
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
      :should-show="({ editor, view }) => {
        return editor.isActive('image') && view.hasFocus()
      }"
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
          active-variant="soft"
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

<style>
html.dark .tiptap .shiki,
html.dark .tiptap .shiki span {
  color: var(--shiki-dark) !important;
  background-color: var(--ui-bg-muted) !important;
}
</style>
