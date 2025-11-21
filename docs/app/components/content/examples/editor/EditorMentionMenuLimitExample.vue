<script setup lang="ts">
import type { EditorContent, EditorMentionMenuItem } from '@nuxt/ui'

const content = ref<EditorContent>({
  type: 'doc',
  content: [{
    type: 'paragraph',
    content: [{ type: 'text', text: 'Type @ to see only the first 3 mentions.' }]
  }]
})

const mentionItems: EditorMentionMenuItem[] = [{
  label: 'benjamincanac',
  avatar: { src: 'https://avatars.githubusercontent.com/u/739984?v=4' }
}, {
  label: 'atinux',
  avatar: { src: 'https://avatars.githubusercontent.com/u/904724?v=4' }
}, {
  label: 'danielroe',
  avatar: { src: 'https://avatars.githubusercontent.com/u/28706372?v=4' }
}, {
  label: 'pi0',
  avatar: { src: 'https://avatars.githubusercontent.com/u/5158436?v=4' }
}, {
  label: 'antfu',
  avatar: { src: 'https://avatars.githubusercontent.com/u/11247099?v=4' }
}, {
  label: 'pooya',
  avatar: { src: 'https://avatars.githubusercontent.com/u/18047369?v=4' }
}]
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="content" content-type="markdown" placeholder="Type @ to mention...">
    <UEditorMentionMenu :editor="editor" :items="mentionItems" :limit="3" />
  </UEditor>
</template>
