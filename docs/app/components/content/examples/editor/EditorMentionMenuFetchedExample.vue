<script setup lang="ts">
import type { EditorContent, EditorMentionMenuItem } from '@nuxt/ui'

const content = ref<EditorContent>({
  type: 'doc',
  content: [{
    type: 'paragraph',
    content: [{ type: 'text', text: 'Type @ to mention a GitHub user (simulated fetch).' }]
  }]
})

// Simulate fetched data
const allUsers: EditorMentionMenuItem[] = [{
  label: 'benjamincanac',
  description: 'Benjamin Canac',
  avatar: { src: 'https://avatars.githubusercontent.com/u/739984?v=4' }
}, {
  label: 'atinux',
  description: 'Sébastien Chopin',
  avatar: { src: 'https://avatars.githubusercontent.com/u/904724?v=4' }
}, {
  label: 'danielroe',
  description: 'Daniel Roe',
  avatar: { src: 'https://avatars.githubusercontent.com/u/28706372?v=4' }
}, {
  label: 'pi0',
  description: 'Pooya Parsa',
  avatar: { src: 'https://avatars.githubusercontent.com/u/5158436?v=4' }
}, {
  label: 'antfu',
  description: 'Anthony Fu',
  avatar: { src: 'https://avatars.githubusercontent.com/u/11247099?v=4' }
}, {
  label: 'romhml',
  description: 'Romain Hamel',
  avatar: { src: 'https://avatars.githubusercontent.com/u/4546096?v=4' }
}]

const mentionItems = ref<EditorMentionMenuItem[]>(allUsers)
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="content" content-type="markdown" placeholder="Type @ to mention...">
    <UEditorMentionMenu :editor="editor" :items="mentionItems" />
  </UEditor>
</template>
