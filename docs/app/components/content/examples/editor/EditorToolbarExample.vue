<script setup lang="ts">
import type { EditorContent, EditorToolbarItem } from '@nuxt/ui'

const content = ref<EditorContent>(`# Welcome to the Editor

This is a **rich text** editor with a fixed toolbar. Try selecting text and using the formatting buttons.`)

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
  mark: 'strike',
  icon: 'i-lucide-strikethrough'
}, {
  kind: 'mark',
  mark: 'code',
  icon: 'i-lucide-code'
}], [{
  kind: 'heading',
  level: 2,
  icon: 'i-lucide-heading-2'
}, {
  kind: 'bulletList',
  icon: 'i-lucide-list'
}, {
  kind: 'orderedList',
  icon: 'i-lucide-list-ordered'
}]]
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="content" content-type="markdown" placeholder="Start typing...">
    <UEditorToolbar :editor="editor" :items="toolbarItems" class="mb-2" />
  </UEditor>
</template>
