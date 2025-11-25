<script setup lang="ts">
import type { EditorToolbarItem } from '@nuxt/ui'

const value = ref(`Select text that is longer than 10 characters to see the bubble menu.

Short text won't trigger the menu.`)

const toolbarItems: EditorToolbarItem[][] = [[{
  kind: 'mark',
  mark: 'bold',
  icon: 'i-lucide-bold'
}, {
  kind: 'mark',
  mark: 'italic',
  icon: 'i-lucide-italic'
}]]
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="value" content-type="markdown" placeholder="Start typing...">
    <UEditorToolbar
      :editor="editor"
      :items="toolbarItems"
      layout="bubble"
      :should-show="({ view, state }) => {
        const { selection } = state
        const { from, to } = selection
        const text = state.doc.textBetween(from, to)
        return view.hasFocus() && !selection.empty && text.length > 10
      }"
    />
  </UEditor>
</template>
