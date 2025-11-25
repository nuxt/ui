<script setup lang="ts">
import type { EditorSuggestionMenuItem } from '@nuxt/ui'

const value = ref({
  type: 'doc',
  content: [{
    type: 'paragraph',
    content: [{ type: 'text', text: 'Type / to see commands with helpful icons and descriptions.' }]
  }, {
    type: 'paragraph'
  }]
})

const suggestionItems: EditorSuggestionMenuItem[][] = [[{
  kind: 'paragraph',
  label: 'Paragraph',
  description: 'Regular text paragraph',
  icon: 'i-lucide-type'
}, {
  kind: 'heading',
  level: 1,
  label: 'Heading 1',
  description: 'Large section heading',
  icon: 'i-lucide-heading-1'
}, {
  kind: 'heading',
  level: 2,
  label: 'Heading 2',
  description: 'Medium section heading',
  icon: 'i-lucide-heading-2'
}, {
  kind: 'heading',
  level: 3,
  label: 'Heading 3',
  description: 'Small section heading',
  icon: 'i-lucide-heading-3'
}, {
  kind: 'bulletList',
  label: 'Bullet List',
  description: 'Create an unordered list',
  icon: 'i-lucide-list'
}, {
  kind: 'orderedList',
  label: 'Numbered List',
  description: 'Create an ordered list',
  icon: 'i-lucide-list-ordered'
}, {
  kind: 'blockquote',
  label: 'Quote',
  description: 'Add a blockquote',
  icon: 'i-lucide-text-quote'
}, {
  kind: 'codeBlock',
  label: 'Code Block',
  description: 'Insert code snippet',
  icon: 'i-lucide-square-code'
}, {
  kind: 'horizontalRule',
  label: 'Divider',
  description: 'Add a horizontal line',
  icon: 'i-lucide-separator-horizontal'
}]]
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="value" content-type="markdown" placeholder="Type / for commands...">
    <UEditorSuggestionMenu :editor="editor" :items="suggestionItems" />
  </UEditor>
</template>
