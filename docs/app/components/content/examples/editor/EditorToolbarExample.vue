<script setup lang="ts">
import type { EditorToolbarItem } from '@nuxt/ui'

const value = ref(`## Toolbar

Select some text to see the formatting toolbar appear above your selection.`)

const items: EditorToolbarItem[][] = [[{
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
  <UEditor v-slot="{ editor }" v-model="value" content-type="markdown" placeholder="Start typing..." class="w-full">
    <UEditorToolbar :editor="editor" :items="items" layout="bubble" />
  </UEditor>
</template>
