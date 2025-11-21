<script setup lang="ts">
import type { EditorContent } from '@nuxt/ui'

const content = ref<EditorContent>({
  type: 'doc',
  content: [{
    type: 'paragraph',
    content: [{ type: 'text', text: 'The drag handle uses a custom icon.' }]
  }, {
    type: 'paragraph',
    content: [{ type: 'text', text: 'Hover to see the move icon.' }]
  }]
})
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="content" content-type="markdown" placeholder="Start typing...">
    <UEditorDragHandle :editor="editor" icon="i-lucide-move" />
  </UEditor>
</template>
