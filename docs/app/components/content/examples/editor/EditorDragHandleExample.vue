<script setup lang="ts">
const value = ref(`# Drag Handle

Hover over the left side of this block to see the drag handle appear and reorder blocks.`)
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="value"
    content-type="markdown"
    class="w-full min-h-21"
  >
    <UEditorDragHandle :editor="editor" />
  </UEditor>
</template>
