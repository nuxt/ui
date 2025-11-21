<script setup lang="ts">
import type { EditorContent, EditorMentionMenuItem } from '@nuxt/ui'

const content = ref<EditorContent>('Type @ to mention someone, like ')

const mentionItems: EditorMentionMenuItem[] = [{
  label: 'benjamincanac',
  avatar: {
    src: 'https://avatars.githubusercontent.com/u/739984?v=4'
  }
}, {
  label: 'atinux',
  avatar: {
    src: 'https://avatars.githubusercontent.com/u/904724?v=4'
  }
}, {
  label: 'danielroe',
  avatar: {
    src: 'https://avatars.githubusercontent.com/u/28706372?v=4'
  }
}, {
  label: 'pi0',
  avatar: {
    src: 'https://avatars.githubusercontent.com/u/5158436?v=4'
  }
}]
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="content" content-type="markdown" placeholder="Type @ to mention someone...">
    <UEditorMentionMenu :editor="editor" :items="mentionItems" />
  </UEditor>
</template>
