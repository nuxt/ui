<script setup lang="ts">
import type { EditorContent, EditorToolbarItem } from '@nuxt/ui'

const content = ref<EditorContent>('Use the toolbar above to format your text.')

const toolbarItems: EditorToolbarItem[][] = [[{
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
}]]
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="content" content-type="markdown" placeholder="Start typing...">
    <UEditorToolbar :editor="editor" :items="toolbarItems" class="mb-2" />
  </UEditor>
</template>
