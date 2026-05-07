<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

defineProps<{
  navigation?: ContentNavigationItem[]
}>()

const { status, search, init } = useSearchCollection('docs', {
  immediate: false,
  ignoredTags: ['style']
})

const { links, groups, searchTerm } = useSearch()
const { open } = useContentSearch()
const { track } = useAnalytics()

watch(open, (value) => {
  if (value && status.value === 'idle') {
    init()
  }
})

watchDebounced(searchTerm, (term) => {
  if (term) {
    track('Search Performed', { term })
  }
}, { debounce: 500 })
</script>

<template>
  <UContentSearch
    v-model:search-term="searchTerm"
    :links="links"
    :groups="groups"
    :navigation="navigation"
    :search="search"
    :fuse="{ resultLimit: 30 }"
  />
</template>
