<script setup lang="ts">
import type { EditorContent, EditorToolbarItem } from '@nuxt/ui'
import EditorLinkPopover from './EditorLinkPopover.vue'

const content = ref<EditorContent>(`Select text and click the link button to add a link with the custom popover.

You can also edit existing links like [this one](https://ui.nuxt.com).`)

const toolbarItems: EditorToolbarItem[][] = [[{
  kind: 'mark',
  mark: 'bold',
  icon: 'i-lucide-bold'
}, {
  kind: 'mark',
  mark: 'italic',
  icon: 'i-lucide-italic'
}, {
  slot: 'link'
}]]
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="content" content-type="markdown" placeholder="Start typing...">
    <UEditorToolbar :editor="editor" :items="toolbarItems" class="mb-2">
      <template #link>
        <EditorLinkPopover :editor="editor" />
      </template>
    </UEditorToolbar>
  </UEditor>
</template>
