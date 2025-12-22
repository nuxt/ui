<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

interface ContentSearchFile {
  id: string
  title: string
  titles: string[]
  level: number
  content: string
}

defineProps<{
  files?: ContentSearchFile[]
  navigation?: ContentNavigationItem[]
}>()

const { links, groups, fullscreen, chat, searchTerm, messages } = useSearch()
const { track } = useAnalytics()

watchDebounced(searchTerm, (term) => {
  if (term) {
    track('Search Performed', { term })
  }
}, { debounce: 500 })

function onClose() {
  chat.value = false

  fullscreen.value = false
}
</script>

<template>
  <UContentSearch
    v-model:search-term="searchTerm"
    :links="links"
    :files="files"
    :groups="groups"
    :navigation="navigation"
    :fullscreen="fullscreen"
    :fuse="{ resultLimit: 115 }"
  >
    <template v-if="chat" #content>
      <SearchChat v-model:messages="messages" v-model:fullscreen="fullscreen" @close="onClose" />
    </template>
  </UContentSearch>
</template>
