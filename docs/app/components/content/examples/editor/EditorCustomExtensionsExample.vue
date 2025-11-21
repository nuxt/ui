<script setup lang="ts">
import type { EditorContent, EditorToolbarItem, EditorEmojiMenuItem } from '@nuxt/ui'
import { Emoji, gitHubEmojis } from '@tiptap/extension-emoji'
import TextAlign from '@tiptap/extension-text-align'

const content = ref<EditorContent>(`This editor includes custom extensions for emoji picker and text alignment.

Type : to add emojis or use the alignment buttons in the toolbar.`)

const toolbarItems: EditorToolbarItem[][] = [[{
  kind: 'mark',
  mark: 'bold',
  icon: 'i-lucide-bold'
}, {
  kind: 'mark',
  mark: 'italic',
  icon: 'i-lucide-italic'
}], [{
  kind: 'textAlign',
  align: 'left',
  icon: 'i-lucide-align-left'
}, {
  kind: 'textAlign',
  align: 'center',
  icon: 'i-lucide-align-center'
}, {
  kind: 'textAlign',
  align: 'right',
  icon: 'i-lucide-align-right'
}]]

const emojiItems: EditorEmojiMenuItem[] = gitHubEmojis.filter(emoji => !emoji.name.startsWith('regional_indicator_')).slice(0, 50)
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="content"
    :extensions="[
      Emoji,
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ]"
    content-type="markdown"
    placeholder="Start typing..."
  >
    <UEditorToolbar :editor="editor" :items="toolbarItems" class="mb-2" />
    <UEditorEmojiMenu :editor="editor" :items="emojiItems" />
  </UEditor>
</template>
