<script setup lang="ts">
import type { EditorSuggestionMenuItem } from '@nuxt/ui'

const value = ref(`# Suggestion Menu

Type / to open the suggestion menu and browse available formatting commands.`)

const items: EditorSuggestionMenuItem[][] = [[{
  type: 'label',
  label: 'Text'
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
}], [{
  type: 'label',
  label: 'Lists'
}, {
  kind: 'bulletList',
  label: 'Bullet List',
  icon: 'i-lucide-list'
}, {
  kind: 'orderedList',
  label: 'Numbered List',
  icon: 'i-lucide-list-ordered'
}], [{
  type: 'label',
  label: 'Insert'
}, {
  kind: 'blockquote',
  label: 'Blockquote',
  icon: 'i-lucide-text-quote'
}, {
  kind: 'codeBlock',
  label: 'Code Block',
  icon: 'i-lucide-square-code'
}, {
  kind: 'horizontalRule',
  label: 'Divider',
  icon: 'i-lucide-separator-horizontal'
}]]

// SSR-safe function to append menus to body (avoids z-index issues in docs)
const appendToBody = import.meta.client ? () => document.body : undefined
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="value"
    content-type="markdown"
    placeholder="Type / for commands..."
    class="w-full min-h-21"
  >
    <UEditorSuggestionMenu :editor="editor" :items="items" :append-to="appendToBody" />
  </UEditor>
</template>
