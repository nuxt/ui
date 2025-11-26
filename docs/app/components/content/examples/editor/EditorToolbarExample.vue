<script setup lang="ts">
import type { EditorToolbarItem } from '@nuxt/ui'

const value = ref(`# Toolbar

Select some text to see the formatting toolbar appear above your selection.`)

const items: EditorToolbarItem[][] = [[{
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
}]]
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="value"
    content-type="markdown"
    placeholder="Start typing..."
    class="w-full min-h-21"
  >
    <UEditorToolbar :editor="editor" :items="items" layout="bubble" />
  </UEditor>
</template>
