<script setup lang="ts">
import type { EditorContent, EditorEmojiMenuItem } from '@nuxt/ui'
import { Emoji } from '@tiptap/extension-emoji'

const content = ref<EditorContent>({
  type: 'doc',
  content: [{
    type: 'paragraph',
    content: [{ type: 'text', text: 'Type : to see popular emojis.' }]
  }, {
    type: 'paragraph'
  }]
})

const emojiItems: EditorEmojiMenuItem[] = [{
  name: 'smile',
  emoji: '😄',
  shortcodes: ['smile'],
  tags: ['happy', 'joy', 'pleased']
}, {
  name: 'heart',
  emoji: '❤️',
  shortcodes: ['heart'],
  tags: ['love', 'like']
}, {
  name: 'thumbsup',
  emoji: '👍',
  shortcodes: ['thumbsup', '+1'],
  tags: ['approve', 'ok']
}, {
  name: 'fire',
  emoji: '🔥',
  shortcodes: ['fire'],
  tags: ['hot', 'burn']
}, {
  name: 'rocket',
  emoji: '🚀',
  shortcodes: ['rocket'],
  tags: ['ship', 'launch']
}, {
  name: 'eyes',
  emoji: '👀',
  shortcodes: ['eyes'],
  tags: ['look', 'watch']
}, {
  name: 'tada',
  emoji: '🎉',
  shortcodes: ['tada'],
  tags: ['party', 'celebration']
}, {
  name: 'thinking',
  emoji: '🤔',
  shortcodes: ['thinking'],
  tags: ['hmm', 'think', 'consider']
}]
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="content"
    :extensions="[Emoji]"
    content-type="markdown" placeholder="Type : to add emojis..."
  >
    <UEditorEmojiMenu :editor="editor" :items="emojiItems" />
  </UEditor>
</template>
