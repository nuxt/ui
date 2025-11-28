<script setup lang="ts">
import type { EditorEmojiMenuItem } from '@nuxt/ui'
import { Emoji } from '@tiptap/extension-emoji'

const value = ref(`Type : to see popular emojis.`)

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
    v-model="value"
    :extensions="[Emoji]"
    placeholder="Type : to add emojis..."
    class="w-full min-h-21"
  >
    <UEditorEmojiMenu :editor="editor" :items="emojiItems" />
  </UEditor>
</template>
