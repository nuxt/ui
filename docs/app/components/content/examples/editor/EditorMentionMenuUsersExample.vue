<script setup lang="ts">
import type { EditorContent, EditorMentionMenuItem } from '@nuxt/ui'

const content = ref<EditorContent>({
  type: 'doc',
  content: [{
    type: 'paragraph',
    content: [{ type: 'text', text: 'Tag team members: ' }]
  }]
})

const mentionItems: EditorMentionMenuItem[] = [{
  label: 'benjamincanac',
  description: 'Co-founder',
  avatar: { src: 'https://avatars.githubusercontent.com/u/739984?v=4' }
}, {
  label: 'atinux',
  description: 'Co-founder',
  avatar: { src: 'https://avatars.githubusercontent.com/u/904724?v=4' }
}, {
  label: 'danielroe',
  description: 'Framework Lead',
  avatar: { src: 'https://avatars.githubusercontent.com/u/28706372?v=4' }
}, {
  label: 'pi0',
  description: 'UnJS Lead',
  avatar: { src: 'https://avatars.githubusercontent.com/u/5158436?v=4' }
}, {
  label: 'antfu',
  description: 'Core Team',
  avatar: { src: 'https://avatars.githubusercontent.com/u/11247099?v=4' }
}]
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="content" content-type="markdown" placeholder="Type @ to mention someone...">
    <UEditorMentionMenu :editor="editor" :items="mentionItems" />
  </UEditor>
</template>
