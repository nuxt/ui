<template>
  <div>
    <Header />

    <UContainer>
      <UMain>
        <UPage>
          <UPageError :error="error" />
        </UPage>
      </UMain>
    </UContainer>

    <ClientOnly>
      <UDocsSearch :files="files" :navigation="navigation" />
    </ClientOnly>

    <UNotifications />
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const { prefix, removePrefixFromNavigation, removePrefixFromFiles } = useContentSource()

useSeoMeta({
  title: 'Page not found',
  description: 'We are sorry but this page could not be found.'
})

defineProps<{
  error: NuxtError
}>()

const { data: navigation } = await useLazyAsyncData('navigation', () => fetchContentNavigation(queryContent(prefix.value)), {
  default: () => [],
  transform: (navigation) => removePrefixFromNavigation(navigation[0]?.children || []),
  watch: [prefix]
})
const { data: files } = await useLazyAsyncData('files', () => queryContent(prefix.value).where({ _type: 'markdown', navigation: { $ne: false } }).find(), {
  default: () => [],
  transform: (files) => removePrefixFromFiles(files),
  watch: [prefix]
})

// Provide

provide('navigation', navigation)
provide('files', files)
</script>
