<script setup lang="ts">
import type { EditorToolbarItem } from '@nuxt/ui'

const value = ref('The toolbar items are grouped with separators between each group.')

const toolbarItems: EditorToolbarItem[][] = [
  // First group: text formatting
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
    mark: 'strike',
    icon: 'i-lucide-strikethrough'
  }],
  // Second group: headings dropdown
  [{
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
  }],
  // Third group: lists
  [{
    kind: 'bulletList',
    icon: 'i-lucide-list'
  }, {
    kind: 'orderedList',
    icon: 'i-lucide-list-ordered'
  }]
]
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="value" content-type="markdown" placeholder="Start typing...">
    <UEditorToolbar :editor="editor" :items="toolbarItems" />
  </UEditor>
</template>
