<script setup lang="ts">
import { upperFirst } from 'scule'
import type { EditorContent, EditorHandlers, EditorToolbarItem, EditorSuggestionMenuItem, EditorMentionMenuItem, EditorEmojiMenuItem, Editor, DropdownMenuItem } from '@nuxt/ui'
import { mapEditorItems } from '@nuxt/ui/utils/editor'
import { Emoji, gitHubEmojis } from '@tiptap/extension-emoji'
import { ImageUpload } from '../../utils/editor/image-upload'

const content = ref<EditorContent>(`# Nuxt UI: A Modern UI Library

Welcome to **Nuxt UI**, a comprehensive UI library for *Nuxt 3* applications.
Built with [Tailwind CSS](https://tailwindcss.com) and [Reka UI](https://reka-ui.com), it provides a complete set of components for building beautiful interfaces.

![Image](https://ui.nuxt.com/assets/templates/nuxt/dashboard-dark.png)

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

const customHandlers: Partial<EditorHandlers> = {
  image: {
    canExecute: (editor: Editor) => (editor.can() as any).insertContent({ type: 'imageUpload' }),
    execute: (editor: Editor) => editor.chain().focus().insertContent({ type: 'imageUpload' }),
    isActive: (editor: Editor) => editor.isActive('imageUpload'),
    isDisabled: undefined
  }
}

const toolbarItems = [[{
  kind: 'undo',
  icon: 'i-lucide-undo'
}, {
  kind: 'redo',
  icon: 'i-lucide-redo'
}], [{
  icon: 'i-lucide-heading',
  ui: {
    label: 'text-xs'
  },
  items: [{
    type: 'label',
    label: 'Headings'
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
  }]
}, {
  icon: 'i-lucide-list',
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
  icon: 'i-lucide-text-quote'
}, {
  kind: 'codeBlock',
  icon: 'i-lucide-square-code'
}, {
  kind: 'horizontalRule',
  icon: 'i-lucide-separator-horizontal'
}, {
  kind: 'paragraph',
  icon: 'i-lucide-type'
}], [{
  kind: 'mark',
  mark: 'bold',
  icon: 'i-lucide-bold'
}, {
  kind: 'mark',
  mark: 'italic',
  icon: 'i-lucide-italic'
}, {
  kind: 'mark',
  mark: 'underline',
  icon: 'i-lucide-underline'
}, {
  kind: 'mark',
  mark: 'strike',
  icon: 'i-lucide-strikethrough'
}, {
  kind: 'mark',
  mark: 'code',
  icon: 'i-lucide-code'
}, {
  slot: 'link' as const
}, {
  kind: 'image',
  icon: 'i-lucide-image'
}], [{
  kind: 'textAlign',
  align: 'left',
  icon: 'i-lucide-align-left'
}, {
  kind: 'textAlign',
  align: 'center',
  icon: 'i-lucide-align-center'
}, {
  kind: 'textAlign',
  align: 'right',
  icon: 'i-lucide-align-right'
}, {
  kind: 'textAlign',
  align: 'justify',
  icon: 'i-lucide-align-justify'
}]] satisfies EditorToolbarItem[][]

const imageItems = (editor: Editor): EditorToolbarItem[][] => {
  const node = editor.state.doc.nodeAt(editor.state.selection.from)

  return [[{
    icon: 'i-lucide-download',
    to: node?.attrs?.src,
    download: true
  }, {
    icon: 'i-lucide-refresh-cw',
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

const selectedNode = ref<any>(null)

const handleItems = (editor: Editor): DropdownMenuItem[][] => {
  if (!selectedNode.value) {
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
  kind: 'image',
  label: 'Image',
  icon: 'i-lucide-image'
}, {
  kind: 'horizontalRule',
  label: 'Horizontal Rule',
  icon: 'i-lucide-separator-horizontal'
}]]

const mentionItems: EditorMentionMenuItem[] = [{
  label: 'benjamincanac',
  avatar: {
    src: 'https://avatars.githubusercontent.com/u/739984?v=4'
  }
}, {
  label: 'atinux',
  avatar: {
    src: 'https://avatars.githubusercontent.com/u/904724?v=4'
  }
}, {
  label: 'danielroe',
  avatar: {
    src: 'https://avatars.githubusercontent.com/u/28706372?v=4'
  }
}, {
  label: 'pi0',
  avatar: {
    src: 'https://avatars.githubusercontent.com/u/5158436?v=4'
  }
}, {
  label: 'antfu',
  avatar: {
    src: 'https://avatars.githubusercontent.com/u/11247099?v=4'
  }
}]

const emojiItems: EditorEmojiMenuItem[] = gitHubEmojis.filter(emoji => !emoji.name.startsWith('regional_indicator_'))
</script>

<template>
  <UEditor
    v-slot="{ editor, handlers }"
    v-model="content"
    :extensions="[
      Emoji,
      ImageUpload
    ]"
    :handlers="customHandlers"
    content-type="markdown"
    autofocus
    placeholder="Write, type '/' for commands..."
    class="min-h-0"
    :ui="{ content: 'max-w-2xl mx-auto', base: 'sm:px-14' }"
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
      :should-show="({ editor, state, view }) => {
        if (editor.isActive('imageUpload') || editor.isActive('image')) {
          return false
        }
        if (!view.hasFocus()) {
          return false
        }
        const { selection } = state
        const { empty } = selection
        return !empty
      }"
    >
      <template #link>
        <EditorLinkPopover :editor="editor" />
      </template>
    </UEditorToolbar>

    <UEditorToolbar
      :editor="editor"
      :items="imageItems(editor)"
      layout="bubble"
      :should-show="({ editor }) => editor.isActive('image')"
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
          const node = onClick(e)

          handlers.suggestion?.execute(editor, { pos: node?.pos }).run()
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
