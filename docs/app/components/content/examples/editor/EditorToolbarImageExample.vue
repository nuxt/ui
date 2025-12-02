<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import type { EditorToolbarItem } from '@nuxt/ui'

const value = ref(`Click on the image below to see the image-specific toolbar:

![Image Placeholder](/placeholder.jpeg)`)

const items = (editor: Editor): EditorToolbarItem[][] => {
  const node = editor.state.doc.nodeAt(editor.state.selection.from)

  return [[{
    icon: 'i-lucide-download',
    to: node?.attrs?.src,
    download: true,
    tooltip: { text: 'Download' }
  }], [{
    icon: 'i-lucide-trash',
    tooltip: { text: 'Delete' },
    onClick: () => {
      const { state } = editor
      const { selection } = state

      const pos = selection.from
      const node = state.doc.nodeAt(pos)

      if (node && node.type.name === 'image') {
        editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).run()
      }
    }
  }]]
}
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="value"
    content-type="markdown"
    class="w-full min-h-113"
  >
    <UEditorToolbar
      :editor="editor"
      :items="items(editor)"
      layout="bubble"
      :should-show="({ editor, view }) => {
        return editor.isActive('image') && view.hasFocus()
      }"
    />
  </UEditor>
</template>
