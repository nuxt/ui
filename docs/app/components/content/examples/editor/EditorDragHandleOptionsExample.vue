<script setup lang="ts">
import type { EditorContent } from '@nuxt/ui'

const content = ref<EditorContent>(`The drag handle has custom positioning with extra offset.

Notice it appears further from the text.`)
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="content" content-type="markdown" placeholder="Start typing...">
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
