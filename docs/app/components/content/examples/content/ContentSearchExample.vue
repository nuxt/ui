<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs'), {
  server: false
})

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const searchTerm = ref('')
</script>

<template>
  <ClientOnly>
    <LazyUContentSearch
      v-model:search-term="searchTerm"
      open
      :autofocus="false"
      :files="files"
      :navigation="navigation"
      :fuse="{ resultLimit: 42 }"
    />
  </ClientOnly>
</template>
