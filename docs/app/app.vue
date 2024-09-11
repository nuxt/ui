<script setup lang="ts">
import { withoutTrailingSlash } from 'ufo'
// import { debounce } from 'perfect-debounce'
import type { ContentSearchFile } from '@nuxt/ui-pro'

const route = useRoute()
// const colorMode = useColorMode()
const runtimeConfig = useRuntimeConfig()
const { integrity, api } = runtimeConfig.public.content

const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation(), { default: () => [] })
const { data: files } = await useLazyFetch<ContentSearchFile[]>(`${api.baseURL}/search${integrity ? '.' + integrity : ''}`, { default: () => [] })

const searchTerm = ref('')

// watch(searchTerm, debounce((query: string) => {
//   if (!query) {
//     return
//   }

//   useTrackEvent('Search', { props: { query: `${query} - ${searchTerm.value?.commandPaletteRef.results.length} results` } })
// }, 500))

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
        icon: 'i-heroicons-credit-card',
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

// const color = computed(() => colorMode.value === 'dark' ? '#18181b' : 'white')

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    // { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
    { rel: 'canonical', href: `https://ui.nuxt.com${withoutTrailingSlash(route.path)}` }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useServerSeoMeta({
  ogSiteName: 'Nuxt UI',
  twitterCard: 'summary_large_image'
})

provide('navigation', navigation)
provide('files', files)
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <Banner v-if="!route.path.startsWith('/examples')" />

    <Header v-if="!route.path.startsWith('/examples')" :links="links" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <Footer v-if="!route.path.startsWith('/examples')" />

    <LazyUContentSearch v-model:search-term="searchTerm" :files="files" :navigation="navigation" :fuse="{ resultLimit: 42 }" />
  </UApp>
</template>

<style>
@import "tailwindcss";
@import "@nuxt/ui-pro";

@source "../content/**/*.md";

@theme {
  --font-family-sans: 'Inter', sans-serif;
}
</style>
