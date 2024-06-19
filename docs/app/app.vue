<script setup lang="ts">
import { withoutTrailingSlash } from 'ufo'
// import { debounce } from 'perfect-debounce'
import type { ContentSearchFile } from '#ui-pro/types'

const route = useRoute()
// const colorMode = useColorMode()
const runtimeConfig = useRuntimeConfig()
const { integrity, api } = runtimeConfig.public.content

const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation(), { default: () => [] })
const { data: files } = await useLazyFetch<ContentSearchFile[]>(`${api.baseURL}/search${integrity ? '.' + integrity : ''}`, { default: () => [] })

const open = ref(false)
const searchTerm = ref('')

// watch(searchTerm, debounce((query: string) => {
//   if (!query) {
//     return
//   }

//   useTrackEvent('Search', { props: { query: `${query} - ${searchTerm.value?.commandPaletteRef.results.length} results` } })
// }, 500))

const links = computed(() => [{
  label: 'Docs',
  icon: 'i-heroicons-book-open',
  to: '/getting-started',
  active: route.path.startsWith('/getting-started')
}, {
  label: 'Components',
  icon: 'i-heroicons-cube-transparent',
  to: '/components',
  active: route.path.startsWith('/components')
}].filter(Boolean))

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

provide('open', open)
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

    <LazyUContentSearch v-model:open="open" v-model:search-term="searchTerm" :files="files" :navigation="navigation" :fuse="{ resultLimit: 42 }" />
  </UApp>
</template>
