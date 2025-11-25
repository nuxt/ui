<script setup lang="ts">
import type { EditorToolbarItem } from '@nuxt/ui'

const value = ref(`Click on an empty line below to see the floating menu.


`)

const toolbarItems: EditorToolbarItem[][] = [[{
  kind: 'heading',
  level: 1,
  icon: 'i-lucide-heading-1'
}, {
  kind: 'heading',
  level: 2,
  icon: 'i-lucide-heading-2'
}, {
  kind: 'bulletList',
  icon: 'i-lucide-list'
}, {
  kind: 'orderedList',
  icon: 'i-lucide-list-ordered'
}, {
  kind: 'blockquote',
  icon: 'i-lucide-text-quote'
}]]
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="value" content-type="markdown" placeholder="Start typing...">
    <UEditorToolbar
      :editor="editor"
      :items="toolbarItems"
      layout="floating"
    />
  </UEditor>
</template>
