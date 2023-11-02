<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <Header v-if="!$route.path.startsWith('/examples')" :links="links" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <Footer v-if="!$route.path.startsWith('/examples')" />

    <ClientOnly>
      <LazyUDocsSearch ref="searchRef" :files="files" :navigation="navigation" :groups="groups" :links="links" />
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
import { debounce } from 'perfect-debounce'
import type { ParsedContent } from '@nuxt/content/dist/runtime/types'

const searchRef = ref()

const route = useRoute()
const colorMode = useColorMode()
const { branch, branches } = useContentSource()

const { data: nav } = await useAsyncData('navigation', () => fetchContentNavigation())
const { data: files } = useLazyFetch<ParsedContent[]>('/api/search.json', { default: () => [], server: false })

// Computed

const navigation = computed(() => {
  if (branch.value?.name === 'dev') {
    const dev = nav.value.find(item => item._path === '/dev')?.children
    const pro = nav.value.find(item => item._path === '/pro')

    return [
      pro,
      ...dev
    ]
  }

  return nav.value.filter(item => item._path !== '/dev')
})

const groups = computed(() => {
  if (route.path === '/') {
    return []
  }

  return [{ key: 'branch', label: 'Branch', commands: branches.value }]
})

const color = computed(() => colorMode.value === 'dark' ? '#18181b' : 'white')

const links = computed(() => {
  return [{
    label: 'Documentation',
    icon: 'i-heroicons-book-open',
    to: `${branch.value?.name === 'dev' ? '/dev' : ''}/getting-started`
  }, {
    label: 'Playground',
    icon: 'i-simple-icons-stackblitz',
    to: '/playground'
  }, {
    label: 'Roadmap',
    icon: 'i-heroicons-academic-cap',
    to: '/roadmap'
  }, {
    label: 'Pro',
    icon: 'i-heroicons-square-3-stack-3d',
    to: '/pro',
    children: [{
      label: 'Features',
      to: '/pro#features',
      exactHash: true,
      icon: 'i-heroicons-beaker',
      description: 'Discover all the features of Nuxt UI Pro.'
    }, {
      label: 'Pricing',
      to: '/pro#pricing',
      exactHash: true,
      icon: 'i-heroicons-credit-card',
      description: 'A simple pricing, for solo developers or teams.'
    }, {
      label: 'Guide',
      to: '/pro/guide',
      icon: 'i-heroicons-book-open',
      description: 'Learn how to use Nuxt UI Pro in your app.'
    }, {
      label: 'Components',
      to: '/pro/components',
      icon: 'i-heroicons-cube-transparent',
      description: 'Discover all the components available in Nuxt UI Pro.'
    }]
  }, {
    label: 'Releases',
    icon: 'i-heroicons-rocket-launch',
    to: 'https://github.com/nuxt/ui/releases',
    target: '_blank'
  }]
})

// Watch

watch(() => searchRef.value?.commandPaletteRef?.query, debounce((query: string) => {
  if (!query) {
    return
  }

  useTrackEvent('Search', { props: { query: `${query} - ${searchRef.value?.commandPaletteRef.results.length} results` } })
}, 500))

// Head

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
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

// Provide

provide('navigation', navigation)
provide('files', files)
</script>
