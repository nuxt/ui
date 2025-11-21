<script setup lang="ts">
import type { EditorContent, EditorToolbarItem } from '@nuxt/ui'

const content = ref<EditorContent>(`Select some text to see the bubble menu appear with formatting options.

You can make text bold, italic, or apply other formatting options from the contextual menu.`)

const toolbarItems: EditorToolbarItem[][] = [[{
  kind: 'mark',
  mark: 'bold',
  icon: 'i-lucide-bold'
}, {
  kind: 'mark',
  mark: 'italic',
  icon: 'i-lucide-italic'
}, {
  kind: 'mark',
  mark: 'underline',
  icon: 'i-lucide-underline'
}, {
  kind: 'mark',
  mark: 'strike',
  icon: 'i-lucide-strikethrough'
}, {
  kind: 'mark',
  mark: 'code',
  icon: 'i-lucide-code'
}]]
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="content" content-type="markdown" placeholder="Start typing...">
    <UEditorToolbar
      :editor="editor"
      :items="toolbarItems"
      layout="bubble"
    />
  </UEditor>
</template>
