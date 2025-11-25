<script setup lang="ts">
import type { EditorToolbarItem } from '@nuxt/ui'

const value = ref(`Select this text to see the bubble menu appear.

Click on an empty line to see the floating menu.

`)

const bubbleItems: EditorToolbarItem[][] = [[{
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

const floatingItems: EditorToolbarItem[][] = [[{
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
}]]
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="value" content-type="markdown" placeholder="Start typing...">
    <UEditorToolbar
      :editor="editor"
      :items="bubbleItems"
      layout="bubble"
    />

    <UEditorToolbar
      :editor="editor"
      :items="floatingItems"
      layout="floating"
    />
  </UEditor>
</template>
