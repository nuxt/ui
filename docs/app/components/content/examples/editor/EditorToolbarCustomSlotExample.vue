<script setup lang="ts">
import type { EditorToolbarItem } from '@nuxt/ui'
import EditorLinkPopover from './EditorLinkPopover.vue'

const value = ref(`Select text and click the link button to add a link with the custom popover.

You can also edit existing links like [this one](https://ui.nuxt.com).`)

const toolbarItems = [[{
  kind: 'mark',
  mark: 'bold',
  icon: 'i-lucide-bold'
}, {
  kind: 'mark',
  mark: 'italic',
  icon: 'i-lucide-italic'
}, {
  slot: 'link' as const
}]] satisfies EditorToolbarItem[][]
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="value"
    content-type="markdown"
    class="w-full min-h-30 flex flex-col gap-4"
  >
    <UEditorToolbar :editor="editor" :items="toolbarItems" class="sm:px-8">
      <template #link>
        <EditorLinkPopover :editor="editor" auto-open />
      </template>
    </UEditorToolbar>
  </UEditor>
</template>
