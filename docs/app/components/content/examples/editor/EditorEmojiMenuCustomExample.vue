<script setup lang="ts">
import type { EditorContent, EditorEmojiMenuItem } from '@nuxt/ui'
import { Emoji } from '@tiptap/extension-emoji'

const content = ref<EditorContent>({
  type: 'doc',
  content: [{
    type: 'paragraph',
    content: [{ type: 'text', text: 'This editor has a custom set of work-related emojis.' }]
  }, {
    type: 'paragraph'
  }]
})

const emojiItems: EditorEmojiMenuItem[] = [{
  name: 'approved',
  emoji: '✅',
  shortcodes: ['check', 'approved'],
  tags: ['done', 'complete', 'yes'],
  group: 'status'
}, {
  name: 'in_progress',
  emoji: '⏳',
  shortcodes: ['hourglass', 'waiting'],
  tags: ['progress', 'pending'],
  group: 'status'
}, {
  name: 'blocked',
  emoji: '🚫',
  shortcodes: ['blocked', 'no'],
  tags: ['stop', 'forbidden'],
  group: 'status'
}, {
  name: 'bug',
  emoji: '🐛',
  shortcodes: ['bug'],
  tags: ['error', 'issue'],
  group: 'work'
}, {
  name: 'feature',
  emoji: '✨',
  shortcodes: ['sparkles', 'new'],
  tags: ['feature', 'enhancement'],
  group: 'work'
}, {
  name: 'docs',
  emoji: '📚',
  shortcodes: ['books', 'documentation'],
  tags: ['docs', 'readme'],
  group: 'work'
}, {
  name: 'meeting',
  emoji: '📅',
  shortcodes: ['calendar', 'meeting'],
  tags: ['schedule', 'appointment'],
  group: 'schedule'
}, {
  name: 'deadline',
  emoji: '⏰',
  shortcodes: ['clock', 'alarm'],
  tags: ['deadline', 'urgent'],
  group: 'schedule'
}]
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="content"
    :extensions="[Emoji]"
    content-type="markdown" placeholder="Type : to add work emojis..."
  >
    <UEditorEmojiMenu :editor="editor" :items="emojiItems" />
  </UEditor>
</template>
