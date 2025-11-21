<script setup lang="ts">
import type { EditorContent, EditorToolbarItem } from '@nuxt/ui'

const content = ref<EditorContent>(`# Document Title

The toolbar is fixed in the navbar above, providing consistent access to formatting tools.`)

const toolbarItems: EditorToolbarItem[][] = [[{
  kind: 'undo',
  icon: 'i-lucide-undo'
}, {
  kind: 'redo',
  icon: 'i-lucide-redo'
}], [{
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
    <div class="border border-[var(--ui-border)] rounded-lg overflow-hidden">
      <div class="bg-[var(--ui-bg-elevated)] border-b border-[var(--ui-border)] p-2">
        <UEditorToolbar :editor="editor" :items="toolbarItems" />
      </div>
      <div class="p-4" />
    </div>
  </UEditor>
</template>
