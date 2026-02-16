<script setup lang="ts">
import { upperFirst } from 'scule'
import { refDebounced } from '@vueuse/core'
import type { EditorToolbarItem, EditorEmojiMenuItem, DropdownMenuItem, EditorSuggestionMenuItem, EditorCustomHandlers } from '@nuxt/ui'
import type { JSONContent } from '@tiptap/vue-3'
import { mapEditorItems } from '@nuxt/ui/utils/editor'
import { Emoji, gitHubEmojis } from '@tiptap/extension-emoji'
import { TextAlign } from '@tiptap/extension-text-align'
import { ImageUpload } from '../../components/editor/EditorImageUploadExtension'

const editorRef = useTemplateRef('editorRef')

const content = ref(`# Nuxt UI: A Modern UI Library

Welcome to **Nuxt UI**, a comprehensive UI library for *Nuxt 3* applications.
Built with [Tailwind CSS](https://tailwindcss.com) and [Reka UI](https://reka-ui.com), it provides a complete set of components for building beautiful interfaces.

![Image](https://ui.nuxt.com/placeholder.jpeg)

## Key Features

Nuxt UI combines the best of modern web development

- **Fully typed** with TypeScript support
- *Customizable* theme system with semantic colors
- <u>Accessible</u> components following ARIA guidelines
- Built on top of \`Reka UI\` primitives
- Support for ~~legacy browsers~~ modern standards

### Getting Started

Install Nuxt UI in your project with the following command:

\`\`\`
npx nuxi@latest module add ui
\`\`\`

> *Nuxt UI is designed to be intuitive and easy to use, whether you're building a simple landing page or a complex application.*

### Component Categories

1. Layout components (Container, Card, Accordion)
2. Form components (Input, Select, Checkbox)
3. Navigation (Navbar, Sidebar, Breadcrumb)
4. Feedback (Alert, Toast, Modal)

#### Code Example

Here's a simple example using the \`Button\` component:

\`\`\`
<template>
  <UButton color="primary">
    Click me
  </UButton>
</template>
\`\`\`

---

## Advanced Features

Powerful capabilities for modern applications

- Dark mode support out of the box
- Keyboard shortcuts for improved accessibility
- Nested lists support:
  - With multiple levels
  - And proper spacing

Whether you're working on a personal project or building an enterprise application, Nuxt UI provides all the tools you need to create stunning user interfaces quickly and efficiently. The library is constantly evolving with new components and improvements based on community feedback.

Visit our [documentation](https://ui.nuxt.com) to learn more and explore all available components.
`)

const { extension: completionExtension, handlers: aiHandlers, isLoading: aiLoading } = useEditorCompletion(editorRef)

const customHandlers = {
  imageUpload: {
    canExecute: (editor: any) => editor.can().insertContent({ type: 'imageUpload' }),
    execute: (editor: any) => editor.chain().focus().insertContent({ type: 'imageUpload' }),
    isActive: (editor: any) => editor.isActive('imageUpload'),
    isDisabled: undefined
  },
  ...aiHandlers
} satisfies EditorCustomHandlers

const toolbarItems = computed(() => [[{
  kind: 'undo',
  icon: 'i-lucide-undo',
  tooltip: { text: 'Undo' }
}, {
  kind: 'redo',
  icon: 'i-lucide-redo',
  tooltip: { text: 'Redo' }
}], [{
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
  kind: 'suggestion',
  icon: 'i-lucide-square-slash'
}, {
  kind: 'mention',
  icon: 'i-lucide-at-sign'
}, {
  kind: 'emoji',
  icon: 'i-lucide-smile-plus'
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
  }, {
    kind: 'heading',
    level: 4,
    icon: 'i-lucide-heading-4',
    label: 'Heading 4'
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
}, {
  kind: 'horizontalRule',
  icon: 'i-lucide-separator-horizontal',
  tooltip: { text: 'Horizontal Rule' }
}, {
  kind: 'paragraph',
  icon: 'i-lucide-type',
  tooltip: { text: 'Paragraph' }
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

const imageToolbarItems = (editor: any): EditorToolbarItem<typeof customHandlers>[][] => {
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

const handleItems = (editor: any): DropdownMenuItem[][] => {
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

const searchTerm = ref('')
const searchTermDebounced = refDebounced(searchTerm, 200)

const { data: mentionItems } = await useFetch('https://dummyjson.com/users/search?limit=10', {
  params: { q: searchTermDebounced },
  transform: (data: { users: { id: number, firstName: string, lastName: string, image: string }[] }) => {
    return data.users?.map(user => ({ id: user.id, label: `${user.firstName} ${user.lastName}`, avatar: { src: user.image } })) || []
  },
  lazy: true
})

const emojiItems: EditorEmojiMenuItem[] = gitHubEmojis.filter(emoji => !emoji.name.startsWith('regional_indicator_'))
</script>

<template>
  <UEditor
    ref="editorRef"
    v-slot="{ editor, handlers }"
    v-model="content"
    :extensions="[
      Emoji,
      ImageUpload,
      completionExtension,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      })
    ]"
    :handlers="customHandlers"
    content-type="markdown"
    autofocus
    placeholder="Write, type '/' for commands..."
    class="min-h-0"
    :ui="{ base: 'sm:px-14', content: 'max-w-2xl mx-auto' }"
  >
    <Navbar>
      <UEditorToolbar :editor="editor" :items="toolbarItems">
        <template #link>
          <EditorLinkPopover :editor="editor" auto-open />
        </template>
      </UEditorToolbar>
    </Navbar>

    <UEditorToolbar
      :editor="editor"
      :items="toolbarItems"
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
    <UEditorMentionMenu v-model:search-term="searchTerm" :editor="editor" :items="mentionItems" ignore-filter />
    <UEditorEmojiMenu :editor="editor" :items="emojiItems" />
  </UEditor>
</template>
