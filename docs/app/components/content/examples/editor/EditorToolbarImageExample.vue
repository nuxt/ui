<script setup lang="ts">
import type { EditorContent, EditorToolbarItem } from '@nuxt/ui'

const content = ref<EditorContent>(`Click on the image below to see the image-specific toolbar:

![Nuxt UI Dashboard](https://ui.nuxt.com/assets/templates/nuxt/dashboard-dark.png)

The toolbar only appears when an image is selected.`)

const imageToolbarItems: EditorToolbarItem[][] = [[{
  icon: 'i-lucide-download',
  label: 'Download'
}, {
  icon: 'i-lucide-trash',
  label: 'Delete'
}]]
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="content"
    content-type="markdown"
    placeholder="Start typing..."
  >
    <UEditorToolbar
      :editor="editor"
      :items="imageToolbarItems"
      layout="bubble"
      :should-show="({ editor, view }) => {
        return editor.isActive('image') && view.hasFocus()
      }"
    />
  </UEditor>
</template>
