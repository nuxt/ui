<script setup lang="ts">
const value = ref(`The drag handle has custom positioning with extra offset.

Notice it appears further from the text.`)
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="value" content-type="markdown" placeholder="Start typing...">
    <UEditorDragHandle
      :editor="editor"
      :options="{
        offset: ({ rects }) => ({
          alignmentAxis: 0,
          mainAxis: 16
        })
      }"
    />
  </UEditor>
</template>
