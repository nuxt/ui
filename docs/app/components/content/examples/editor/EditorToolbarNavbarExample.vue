<script setup lang="ts">
import type { EditorToolbarItem } from '@nuxt/ui'

const value = ref(`# Document Title

The toolbar is placed inside a card header, providing a document-style editing interface.

Try selecting text and using the formatting buttons above.`)

const toolbarItems: EditorToolbarItem[][] = [[{
  kind: 'undo',
  icon: 'i-lucide-undo'
}, {
  kind: 'redo',
  icon: 'i-lucide-redo'
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
}], [{
  icon: 'i-lucide-heading',
  items: [{
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
  }]
}, {
  kind: 'bulletList',
  icon: 'i-lucide-list'
}, {
  kind: 'orderedList',
  icon: 'i-lucide-list-ordered'
}, {
  kind: 'blockquote',
  icon: 'i-lucide-text-quote'
}]]
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="value" content-type="markdown" placeholder="Start typing...">
    <div class="border border-[var(--ui-border)] rounded-[calc(var(--ui-radius)*2)] overflow-hidden">
      <div class="bg-[var(--ui-bg-elevated)] border-b border-[var(--ui-border)] px-3 py-2">
        <UEditorToolbar :editor="editor" :items="toolbarItems" />
      </div>
      <div class="p-4" />
    </div>
  </UEditor>
</template>
