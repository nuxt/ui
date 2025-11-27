<script setup lang="ts">
const value = ref(`The drag handle uses a custom icon.

Hover to see the move icon.`)
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="value" content-type="markdown" placeholder="Start typing...">
    <UEditorDragHandle :editor="editor" icon="i-lucide-move" />
  </UEditor>
</template>
