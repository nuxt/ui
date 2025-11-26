<script setup lang="ts">
import type { EditorToolbarItem } from '@nuxt/ui'

defineProps<{
  layout: 'fixed' | 'bubble' | 'floating'
}>()

const value = ref(`Select this text to see the bubble menu appear.

Click on an empty line to see the floating menu.

`)

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
  mark: 'code',
  icon: 'i-lucide-code'
}]]
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="value" content-type="markdown" placeholder="Start typing...">
    <UEditorToolbar
      :editor="editor"
      :items="items"
      :layout="layout"
    />
  </UEditor>
</template>
