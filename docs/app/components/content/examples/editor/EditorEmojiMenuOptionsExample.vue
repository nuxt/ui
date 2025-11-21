<script setup lang="ts">
import type { EditorContent, EditorEmojiMenuItem } from '@nuxt/ui'
import { Emoji, gitHubEmojis } from '@tiptap/extension-emoji'

const content = ref<EditorContent>(`Type : to see the emoji menu with custom positioning (fixed strategy, top placement).

`)

const emojiItems: EditorEmojiMenuItem[] = gitHubEmojis.filter(emoji => !emoji.name.startsWith('regional_indicator_'))
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="content"
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
