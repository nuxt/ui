<script setup lang="ts">
import colors from 'tailwindcss/colors'
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const route = useRoute()
const appConfig = useAppConfig()
const colorMode = useColorMode()

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('content'))
const { data: files } = await useAsyncData('files', () => queryCollectionSearchSections('content', { ignoredTags: ['style'] }))

const links = computed(() => {
  return [{
    label: 'Docs',
    icon: 'i-lucide-book-open',
    to: '/getting-started',
    active: route.path.startsWith('/getting-started') || route.path.startsWith('/components')
  }, ...(navigation.value?.find(item => item.path === '/pro')
    ? [{
        label: 'Pro',
        icon: 'i-lucide-layers-3',
        to: '/pro',
        active: route.path.startsWith('/pro/getting-started') || route.path.startsWith('/pro/components') || route.path.startsWith('/pro/prose')
      }, {
        label: 'Pricing',
        icon: 'i-lucide-credit-card',
        to: '/pro/pricing'
      }, {
        label: 'Templates',
        icon: 'i-lucide-monitor',
        to: '/pro/templates'
      }]
    : []), {
    label: 'Releases',
    icon: 'i-lucide-rocket',
    to: '/releases'
  }].filter(Boolean)
})

const color = computed(() => colorMode.value === 'dark' ? (colors as any)[appConfig.ui.colors.neutral][900] : 'white')
const radius = computed(() => `:root { --ui-radius: ${appConfig.theme.radius}rem; }`)

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' }
  ],
  style: [
    { innerHTML: radius, id: 'nuxt-ui-radius', tagPriority: -2 }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  titleTemplate: '%s - Nuxt UI v3',
  title: String(props.error.statusCode)
})

useServerSeoMeta({
  ogSiteName: 'Nuxt UI',
  twitterCard: 'summary_large_image'
})

provide('navigation', navigation)
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="#FFF" />

    <Banner />

    <Header :links="links" />

    <UError :error="error" />

    <Footer />

    <ClientOnly>
      <LazyUContentSearch :files="files" :navigation="navigation" :fuse="{ resultLimit: 42 }" />
    </ClientOnly>
  </UApp>
</template>
