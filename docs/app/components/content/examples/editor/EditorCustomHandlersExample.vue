<script setup lang="ts">
import type { EditorContent, EditorHandlers, EditorToolbarItem } from '@nuxt/ui'
import type { Editor } from '@tiptap/vue-3'

const content = ref<EditorContent>(`This editor has a custom handler for the bold command that also adds a notification.

Try clicking the bold button!`)

const toast = useToast()

const customHandlers: Partial<EditorHandlers> = {
  mark: {
    canExecute: (editor: Editor, item) => editor.can().toggleMark(item.mark),
    execute: (editor: Editor, item) => {
      if (item.mark === 'bold') {
        toast.add({
          title: 'Bold toggled!',
          description: 'Custom handler executed'
        })
      }
      return editor.chain().focus().toggleMark(item.mark)
    },
    isActive: (editor: Editor, item) => editor.isActive(item.mark),
    isDisabled: undefined
  }
}

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
  <UEditor
    v-slot="{ editor }"
    v-model="content"
    :handlers="customHandlers"
    content-type="markdown"
    placeholder="Start typing..."
  >
    <UEditorToolbar :editor="editor" :items="toolbarItems" class="mb-2" />
  </UEditor>
</template>
