<script setup lang="ts">
import type { EditorContent } from '@nuxt/ui'

const content = ref<EditorContent>({
  type: 'doc',
  content: [{
    type: 'paragraph',
    content: [{ type: 'text', text: 'The drag handle has custom color and variant styling.' }]
  }, {
    type: 'paragraph',
    content: [{ type: 'text', text: 'Hover to see the primary colored handle.' }]
  }]
})
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="content" content-type="markdown" placeholder="Start typing...">
    <UEditorDragHandle :editor="editor" color="primary" variant="soft" />
  </UEditor>
</template>
