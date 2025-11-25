<script setup lang="ts">
import type { EditorCustomHandlers, EditorToolbarItem } from '@nuxt/ui'
import type { Editor } from '@tiptap/vue-3'
import { ImageUpload } from '~/utils/editor/image-upload'

const value = ref(`This editor includes a custom ImageUpload extension with custom handlers.

Click the image button to upload a file. The extension uses a custom Vue component to handle the file upload process.`)

const customHandlers = {
  imageUpload: {
    canExecute: (editor: Editor) => editor.can().insertContent({ type: 'imageUpload' }),
    execute: (editor: Editor) => editor.chain().focus().insertImageUpload().run(),
    isActive: (editor: Editor) => editor.isActive('imageUpload'),
    isDisabled: undefined
  }
} satisfies EditorCustomHandlers

const toolbarItems = [[{
  kind: 'mark',
  mark: 'bold',
  icon: 'i-lucide-bold'
}, {
  kind: 'mark',
  mark: 'italic',
  icon: 'i-lucide-italic'
}], [{
  kind: 'imageUpload',
  icon: 'i-lucide-image'
}]] satisfies EditorToolbarItem<typeof customHandlers>[][]
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="value"
    :extensions="[ImageUpload]"
    :handlers="customHandlers"
    content-type="markdown"
    placeholder="Start typing..."
    class="min-h-80"
  >
    <UEditorToolbar :editor="editor" :items="toolbarItems" class="mb-2" />
  </UEditor>
</template>
