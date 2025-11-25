<script setup lang="ts">
import type { EditorMentionMenuItem } from '@nuxt/ui'

const value = ref({
  type: 'doc',
  content: [{
    type: 'paragraph',
    content: [{ type: 'text', text: 'Mention a team member or channel: ' }]
  }]
})

const mentionItems: EditorMentionMenuItem[] = [{
  label: 'benjamincanac',
  description: 'Benjamin Canac',
  avatar: { src: 'https://avatars.githubusercontent.com/u/739984?v=4' }
}, {
  label: 'atinux',
  description: 'Sébastien Chopin',
  avatar: { src: 'https://avatars.githubusercontent.com/u/904724?v=4' }
}, {
  label: 'general',
  description: 'General channel',
  icon: 'i-lucide-hash'
}, {
  label: 'engineering',
  description: 'Engineering team',
  icon: 'i-lucide-users'
}]
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="value" content-type="markdown" placeholder="Type @ to mention...">
    <UEditorMentionMenu :editor="editor" :items="mentionItems" />
  </UEditor>
</template>
