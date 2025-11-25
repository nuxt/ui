<script setup lang="ts">
import type { EditorEmojiMenuItem } from '@nuxt/ui'
import { Emoji, gitHubEmojis } from '@tiptap/extension-emoji'

const value = ref(`Type : to see the emoji menu with custom positioning (fixed strategy, top placement).

`)

const emojiItems: EditorEmojiMenuItem[] = gitHubEmojis.filter(emoji => !emoji.name.startsWith('regional_indicator_'))
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="value"
    :extensions="[Emoji]"
    content-type="markdown"
    placeholder="Type : to add emojis..."
  >
    <UEditorEmojiMenu
      :editor="editor"
      :items="emojiItems"
      :options="{
        strategy: 'fixed',
        placement: 'top-start',
        offset: 8
      }"
    />
  </UEditor>
</template>
