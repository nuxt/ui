<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import type { EditorMentionMenuItem } from '@nuxt/ui'

const value = ref(`# Async Mention Menu

Type @ to mention someone. Results are fetched from an API as you type.`)

type User = {
  firstName: string
  lastName: string
  image: string
}

const query = ref('')
const results = ref<User[]>([])

watchDebounced(query, async (query: string) => {
  if (!query) {
    results.value = []
    return
  }

  try {
    const response = await $fetch<{ users: User[] }>(`https://dummyjson.com/users/search?q=${query}&limit=10`)
    results.value = response.users || []
  } catch {
    results.value = []
  }
}, { debounce: 300 })

const defaultItems: EditorMentionMenuItem[] = [{
  label: 'Emily Johnson',
  avatar: { src: 'https://dummyjson.com/icon/emilys/128' }
}, {
  label: 'Michael Williams',
  avatar: { src: 'https://dummyjson.com/icon/michaelw/128' }
}, {
  label: 'Sophia Brown',
  avatar: { src: 'https://dummyjson.com/icon/sophiab/128' }
}]

const items = computed<EditorMentionMenuItem[]>(() => {
  if (!query.value || !results.value.length) {
    return defaultItems
  }

  return results.value.map(user => ({
    label: `${user.firstName} ${user.lastName}`,
    avatar: { src: user.image }
  }))
})

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
    <UEditorMentionMenu
      v-model:query="query"
      :editor="editor"
      :items="items"
      :append-to="appendToBody"
      ignore-filter
    />
  </UEditor>
</template>
