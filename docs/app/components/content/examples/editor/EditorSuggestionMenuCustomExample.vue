<script setup lang="ts">
import type { EditorSuggestionMenuItem } from '@nuxt/ui'

const value = ref({
  type: 'doc',
  content: [{
    type: 'paragraph',
    content: [{ type: 'text', text: 'Type / to see a fully customized suggestion menu.' }]
  }, {
    type: 'paragraph'
  }]
})

const suggestionItems: EditorSuggestionMenuItem[][] = [[{
  type: 'label',
  label: '📝 Text Formatting'
}, {
  kind: 'paragraph',
  label: 'Normal Text',
  description: 'Standard paragraph text',
  icon: 'i-lucide-type'
}, {
  kind: 'heading',
  level: 1,
  label: 'Large Heading',
  description: 'Top level heading',
  icon: 'i-lucide-heading-1'
}, {
  kind: 'heading',
  level: 2,
  label: 'Medium Heading',
  description: 'Section heading',
  icon: 'i-lucide-heading-2'
}], [{
  type: 'separator'
}], [{
  type: 'label',
  label: '📋 Lists & Structure'
}, {
  kind: 'bulletList',
  label: 'Bullet List',
  description: 'Unordered list items',
  icon: 'i-lucide-list'
}, {
  kind: 'orderedList',
  label: 'Number List',
  description: 'Ordered list items',
  icon: 'i-lucide-list-ordered'
}], [{
  type: 'separator'
}], [{
  type: 'label',
  label: '🎨 Special Blocks'
}, {
  kind: 'blockquote',
  label: 'Quote',
  description: 'Highlight a quote',
  icon: 'i-lucide-text-quote'
}, {
  kind: 'codeBlock',
  label: 'Code',
  description: 'Code with syntax',
  icon: 'i-lucide-square-code'
}]]
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="value" content-type="markdown" placeholder="Type / for commands...">
    <UEditorSuggestionMenu :editor="editor" :items="suggestionItems" />
  </UEditor>
</template>
