<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <Header />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <Footer />

    <ClientOnly>
      <LazyUDocsSearch :files="files" :navigation="navigation" />
    </ClientOnly>

    <UNotifications>
      <template #title="{ title }">
        <span v-html="title" />
      </template>

      <template #description="{ description }">
        <span v-html="description" />
      </template>
    </UNotifications>
  </div>
</template>

<script setup lang="ts">
import { withoutTrailingSlash } from 'ufo'
const route = useRoute()
const colorMode = useColorMode()
const { prefix, removePrefixFromNavigation, removePrefixFromFiles } = useContentSource()

const { data: nav } = await useAsyncData('navigation', () => fetchContentNavigation())

const { data: search } = useLazyFetch('/api/search.json', {
  default: () => [],
  server: false
})

// Computed
const navigation = computed(() => {
  const navigation = nav.value.find(link => link._path === prefix.value)?.children || []

  return prefix.value === '/main' ? removePrefixFromNavigation(navigation) : navigation
})

const files = computed(() => {
  const files = search.value.filter(file => file._path.startsWith(prefix.value))

  return prefix.value === '/main' ? removePrefixFromFiles(files) : files
})

const color = computed(() => colorMode.value === 'dark' ? '#18181b' : 'white')

// Head
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
    { rel: 'canonical', href: `https://ui.nuxtlabs.com${withoutTrailingSlash(route.path)}` }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useServerSeoMeta({
  ogSiteName: 'Nuxt UI',
  twitterCard: 'summary_large_image'
})

// Provide
provide('navigation', navigation)
provide('files', files)
</script>
