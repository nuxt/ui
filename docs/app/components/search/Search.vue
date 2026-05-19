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

const fuse = {
  resultLimit: 20,
  fuseOptions: {
    useTokenSearch: false,
    threshold: 0
  }
}

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
    :search-status="status"
    :fuse="fuse"
  />
</template>
