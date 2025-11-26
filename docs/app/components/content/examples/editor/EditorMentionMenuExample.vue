<script setup lang="ts">
import type { EditorMentionMenuItem } from '@nuxt/ui'

const value = ref(`# Mention Menu

Type @ to mention someone and select from the list of available users.`)

const items: EditorMentionMenuItem[] = [{
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

// SSR-safe function to append menus to body (avoids z-index issues in docs)
const appendToBody = import.meta.client ? () => document.body : undefined
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="value"
    content-type="markdown"
    placeholder="Type @ to mention someone..."
    class="w-full min-h-21"
  >
    <UEditorMentionMenu :editor="editor" :items="items" :append-to="appendToBody" />
  </UEditor>
</template>
