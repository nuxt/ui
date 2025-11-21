<script setup lang="ts">
import type { EditorContent } from '@nuxt/ui'

const content = ref<EditorContent>({
  type: 'doc',
  content: [{
    type: 'heading',
    attrs: { level: 2 },
    content: [{ type: 'text', text: 'Drag and drop blocks' }]
  }, {
    type: 'paragraph',
    content: [{ type: 'text', text: 'Hover over the left side of any block to see the drag handle.' }]
  }, {
    type: 'paragraph',
    content: [{ type: 'text', text: 'Click to select the block or drag to reorder.' }]
  }, {
    type: 'paragraph',
    content: [{ type: 'text', text: 'Try dragging this paragraph above the previous one.' }]
  }]
})
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="content" content-type="markdown" placeholder="Start typing...">
    <UEditorDragHandle :editor="editor" />
  </UEditor>
</template>
