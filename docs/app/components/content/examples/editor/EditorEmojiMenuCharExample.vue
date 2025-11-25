<script setup lang="ts">
import type { EditorEmojiMenuItem } from '@nuxt/ui'
import { Emoji, gitHubEmojis } from '@tiptap/extension-emoji'

const value = ref({
  type: 'doc',
  content: [{
    type: 'paragraph',
    content: [{ type: 'text', text: 'Type . (period) to insert emojis instead of :' }]
  }, {
    type: 'paragraph'
  }]
})

const emojiItems: EditorEmojiMenuItem[] = gitHubEmojis.filter(emoji => !emoji.name.startsWith('regional_indicator_'))
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="value"
    :extensions="[Emoji]"
    content-type="markdown"
    placeholder="Type . to add emojis..."
  >
    <UEditorEmojiMenu :editor="editor" :items="emojiItems" char="." />
  </UEditor>
</template>
