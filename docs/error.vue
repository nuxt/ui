<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <NuxtLoadingIndicator />

    <Header :links="links" />

    <UContainer>
      <UMain>
        <UPage>
          <UPageError :error="error" />
        </UPage>
      </UMain>
    </UContainer>

    <Footer />

    <ClientOnly>
      <LazyUContentSearch :files="files" :navigation="navigation" :links="links" :fuse="{ resultLimit: 42 }" />
    </ClientOnly>

    <UNotifications>
      <template #title="{ title }">
        <span v-html="title" />
      </template>
    </UNotifications>
    <UModals />
  </div>
</template>

<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content'
import type { NuxtError } from '#app'

useSeoMeta({
  title: 'Page not found',
  description: 'We are sorry but this page could not be found.'
})

defineProps<{
  error: NuxtError
}>()

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
        to: '/pro',
        active: route.path.startsWith('/pro/getting-started') || route.path.startsWith('/pro/components') || route.path.startsWith('/pro/prose')
      }, {
        label: 'Pricing',
        icon: 'i-heroicons-ticket',
        to: '/pro/pricing'
      }, {
        label: 'Templates',
        icon: 'i-heroicons-computer-desktop',
        to: '/pro/templates'
      }]
    : []), {
    label: 'Releases',
    icon: 'i-heroicons-rocket-launch',
    to: '/releases'
  }].filter(Boolean)
})

// Head

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

// Provide

provide('navigation', navigation)
provide('files', files)
</script>
