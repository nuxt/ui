<script setup lang="ts">
import type { EditorContent } from '@nuxt/ui'

const content = ref<EditorContent>(`## Drag and drop

Hover over the left side to see the drag handle appear.

Click the handle to select the block.

Drag the handle to reorder blocks.`)
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="content" content-type="markdown" placeholder="Start typing...">
    <UEditorDragHandle :editor="editor" />
  </UEditor>
</template>
