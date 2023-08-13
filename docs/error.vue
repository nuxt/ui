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

const { data: navigation } = await useLazyAsyncData('navigation', () => fetchContentNavigation(), {
  default: () => [],
  transform: (navigation) => {
    navigation = navigation.find(link => link._path === prefix.value)?.children || []

    return prefix.value === '/main' ? removePrefixFromNavigation(navigation) : navigation
  }
})

const { data: files } = await useLazyAsyncData('files', () => queryContent().where({ _type: 'markdown', navigation: { $ne: false } }).find(), {
  default: () => [],
  transform: (files) => {
    files = files.filter(file => file._path.startsWith(prefix.value))

    return prefix.value === '/main' ? removePrefixFromFiles(files) : files
  }
})

// Provide

provide('navigation', navigation)
provide('files', files)
</script>
