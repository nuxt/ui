<script setup lang="ts">
import type { EditorContent, EditorEmojiMenuItem } from '@nuxt/ui'
import { Emoji, gitHubEmojis } from '@tiptap/extension-emoji'

const content = ref<EditorContent>(`Type : to insert emojis like :smile: or :heart:

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
    <UEditorEmojiMenu :editor="editor" :items="emojiItems" />
  </UEditor>
</template>
