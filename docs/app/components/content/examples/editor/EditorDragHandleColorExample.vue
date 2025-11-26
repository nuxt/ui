<script setup lang="ts">
const value = ref(`Hover over blocks to see the customized drag handle with primary color and soft variant.

Try dragging blocks to reorder them.

The handle uses your theme's primary color for better visibility.`)
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="value" content-type="markdown" placeholder="Start typing...">
    <UEditorDragHandle :editor="editor" color="primary" variant="soft" />
  </UEditor>
</template>
