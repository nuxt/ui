<script setup lang="ts">
import type { EditorMentionMenuItem } from '@nuxt/ui'

const value = ref(`Type @ to mention a user.

You can customize the items with avatars, icons, and descriptions.`)

const items: EditorMentionMenuItem[] = [{
  label: 'benjamincanac',
  avatar: { src: 'https://avatars.githubusercontent.com/u/739984?v=4' }
}, {
  label: 'HugoRCD',
  avatar: { src: 'https://avatars.githubusercontent.com/u/71938701?v=4' }
}, {
  label: 'romhml',
  avatar: { src: 'https://avatars.githubusercontent.com/u/25613751?v=4' }
}, {
  label: 'sandros94',
  avatar: { src: 'https://avatars.githubusercontent.com/u/13056429?v=4' }
}, {
  label: 'hywax',
  avatar: { src: 'https://avatars.githubusercontent.com/u/149865959?v=4' }
}, {
  label: 'J-Michalek',
  avatar: { src: 'https://avatars.githubusercontent.com/u/71264422?v=4' }
}, {
  label: 'genu',
  avatar: { src: 'https://avatars.githubusercontent.com/u/928780?v=4' }
}]
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="value"
    content-type="markdown"
    placeholder="Type @ to mention..."
    class="w-full min-h-19"
  >
    <UEditorMentionMenu :editor="editor" :items="items" />
  </UEditor>
</template>
