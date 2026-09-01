<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <NuxtLoadingIndicator />

    <Analytics :debug="false" />

    <Banner v-if="!$route.path.startsWith('/examples')" />

    <Header v-if="!$route.path.startsWith('/examples')" :links="links" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <Footer v-if="!$route.path.startsWith('/examples')" />

    <ClientOnly>
      <LazyUContentSearch ref="searchRef" :files="files" :navigation="navigation" :links="links" :fuse="{ resultLimit: 42 }" />
    </ClientOnly>

    <UNotifications>
      <template #title="{ title }">
        <span v-html="title" />
      </template>
    </UNotifications>
    <UModals />
    <USlideovers />
  </div>
</template>

<script setup lang="ts">
import { withoutTrailingSlash } from 'ufo'
import type { ParsedContent } from '@nuxt/content'
import { Analytics } from '@vercel/analytics/nuxt'

const searchRef = ref()

const route = useRoute()
const colorMode = useColorMode()

const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation())
const { data: files } = useLazyFetch<ParsedContent[]>('/api/search.json', { default: () => [], server: false })

// Computed

const color = computed(() => colorMode.value === 'dark' ? '#18181b' : 'white')

const links = computed(() => {
  return [{
    label: 'Docs',
    icon: 'i-heroicons-book-open',
    to: '/getting-started',
    active: route.path.startsWith('/getting-started') || route.path.startsWith('/components')
  }, ...(navigation.value.find(item => item._path === '/pro')
    ? [{
        label: 'Pro',
        icon: 'i-heroicons-square-3-stack-3d',
        to: '/pro/getting-started',
        active: route.path.startsWith('/pro')
      }]
    : [])]
})

// Head

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
    { rel: 'canonical', href: `https://ui2.nuxt.com${withoutTrailingSlash(route.path)}` }
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
