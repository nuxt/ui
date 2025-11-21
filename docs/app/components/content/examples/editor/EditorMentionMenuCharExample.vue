<script setup lang="ts">
import type { EditorContent, EditorMentionMenuItem } from '@nuxt/ui'

const content = ref<EditorContent>({
  type: 'doc',
  content: [{
    type: 'paragraph',
    content: [{ type: 'text', text: 'Type # to mention a channel or topic.' }]
  }]
})

const mentionItems: EditorMentionMenuItem[] = [{
  label: 'general',
  description: 'General discussions',
  icon: 'i-lucide-hash'
}, {
  label: 'announcements',
  description: 'Important updates',
  icon: 'i-lucide-megaphone'
}, {
  label: 'engineering',
  description: 'Engineering team',
  icon: 'i-lucide-code'
}, {
  label: 'design',
  description: 'Design team',
  icon: 'i-lucide-palette'
}]
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="content" content-type="markdown" placeholder="Type # to mention a channel...">
    <UEditorMentionMenu :editor="editor" :items="mentionItems" char="#" />
  </UEditor>
</template>
