<script setup lang="ts">
import { refDebounced } from '@vueuse/core'

const value = ref(`# Async Mention Menu

Type @ to mention someone. Results are fetched from an API as you type.`)

const searchTerm = ref('')
const searchTermDebounced = refDebounced(searchTerm, 200)

const { data: items } = await useFetch('https://dummyjson.com/users/search?limit=10', {
  params: { q: searchTermDebounced },
  transform: (data: { users: { id: number, firstName: string, lastName: string, image: string }[] }) => {
    return data.users?.map(user => ({ id: user.id, label: `${user.firstName} ${user.lastName}`, avatar: { src: user.image } })) || []
  },
  lazy: true
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
      v-model:search-term="searchTerm"
      :editor="editor"
      :items="items"
      :append-to="appendToBody"
      ignore-filter
    />
  </UEditor>
</template>
