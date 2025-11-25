<script setup lang="ts">
import type { EditorToolbarItem } from '@nuxt/ui'

const value = ref(`Select this text to see the bubble menu with custom positioning options.

The menu appears below the selection with extra offset and fixed strategy.`)

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
        return view.hasFocus() && !selection.empty
      }"
      :options="{
        strategy: 'fixed',
        placement: 'bottom',
        offset: 16
      }"
    />
  </UEditor>
</template>
