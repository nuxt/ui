<script setup lang="ts">
import type { EditorToolbarItem } from '@nuxt/ui'
import TextAlign from '@tiptap/extension-text-align'

const value = ref(`This toolbar showcases **all available formatting options** using built-in handlers. Try the different controls to see them in action!

You can apply **bold**, *italic*, <u>underline</u>, ~~strikethrough~~, and \`inline code\` formatting to your text.
`)

const items: EditorToolbarItem[][] = [
  // History controls
  [{
    kind: 'undo',
    icon: 'i-lucide-undo'
  }, {
    kind: 'redo',
    icon: 'i-lucide-redo'
  }],
  // Block types
  [{
    icon: 'i-lucide-heading',
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
    icon: 'i-lucide-text-quote'
  }, {
    kind: 'codeBlock',
    icon: 'i-lucide-square-code'
  }, {
    kind: 'horizontalRule',
    icon: 'i-lucide-separator-horizontal'
  }],
  // Text formatting
  [{
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
  }],
  // Link
  [{
    kind: 'link',
    icon: 'i-lucide-link'
  }],
  // Text alignment
  [{
    icon: 'i-lucide-align-justify',
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
  }]
]
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="value"
    content-type="markdown"
    :extensions="[TextAlign.configure({ types: ['heading', 'paragraph'] })]"
    class="w-full min-h-37 flex flex-col gap-4"
  >
    <UEditorToolbar :editor="editor" :items="items" class="sm:px-8 overflow-x-auto" />
  </UEditor>
</template>
