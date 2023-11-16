<template>
  <div>
    <Header :links="links" />

    <UContainer>
      <UMain>
        <UPage>
          <UPageError :error="error" />
        </UPage>
      </UMain>
    </UContainer>

    <ClientOnly>
      <LazyUDocsSearch :files="files" :navigation="navigation" :links="links" />
    </ClientOnly>

    <UNotifications />
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'
import type { ParsedContent } from '@nuxt/content/dist/runtime/types'

useSeoMeta({
  title: 'Page not found',
  description: 'We are sorry but this page could not be found.'
})

defineProps<{
  error: NuxtError
}>()

const { branch } = useContentSource()

const { data: nav } = await useAsyncData('navigation', () => fetchContentNavigation())
const { data: files } = useLazyFetch<ParsedContent[]>('/api/search.json', { default: () => [], server: false })

// Computed

const navigation = computed(() => {
  if (branch.value?.name === 'dev') {
    const dev = nav.value.find(item => item._path === '/dev')?.children
    const pro = nav.value.find(item => item._path === '/pro')

    return [
      ...(pro ? [pro] : []),
      ...dev
    ]
  }

  return nav.value.filter(item => item._path !== '/dev')
})

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
  }, !!navigation.value.find(item => item._path === '/pro') && {
    label: 'Pro',
    icon: 'i-heroicons-square-3-stack-3d',
    to: '/pro',
    children: [{
      label: 'Features',
      to: '/pro',
      exact: true,
      icon: 'i-heroicons-beaker',
      description: 'Discover all the features of Nuxt UI Pro.'
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
  }].filter(Boolean)
})

// Provide

provide('navigation', navigation)
provide('files', files)
</script>
