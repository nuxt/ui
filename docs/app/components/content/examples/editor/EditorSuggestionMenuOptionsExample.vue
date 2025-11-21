<script setup lang="ts">
import type { EditorContent, EditorSuggestionMenuItem } from '@nuxt/ui'

const content = ref<EditorContent>(`Type / to see the suggestion menu with custom positioning (fixed strategy, bottom placement).

`)

const suggestionItems: EditorSuggestionMenuItem[][] = [[{
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
  kind: 'bulletList',
  label: 'Bullet List',
  icon: 'i-lucide-list'
}, {
  kind: 'orderedList',
  label: 'Numbered List',
  icon: 'i-lucide-list-ordered'
}]]
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="content" content-type="markdown" placeholder="Type / for commands...">
    <UEditorSuggestionMenu
      :editor="editor"
      :items="suggestionItems"
      :options="{
        strategy: 'fixed',
        placement: 'bottom-start',
        offset: 8
      }"
    />
  </UEditor>
</template>
