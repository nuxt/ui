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

    <ClientOnly>
      <LazyUDocsSearch :files="files" :navigation="navigation" :links="links" :fuse="{ resultLimit: 1000 }" />
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
      ...dev,
      ...(pro ? [pro] : [])
    ]
  }

  return nav.value.filter(item => item._path !== '/dev')
})

const links = computed(() => {
  return [{
    label: 'Docs',
    icon: 'i-heroicons-book-open',
    to: `${branch.value?.name === 'dev' ? '/dev' : ''}/getting-started`
  }, !!navigation.value.find(item => item._path === '/pro') && {
    label: 'Pro',
    icon: 'i-heroicons-square-3-stack-3d',
    to: '/pro/getting-started'
  }, {
    label: 'Templates',
    icon: 'i-heroicons-computer-desktop',
    to: '/pro/getting-started/templates'
  }, {
    label: 'Roadmap',
    icon: 'i-heroicons-academic-cap',
    to: '/roadmap'
  }, {
    label: 'Releases',
    icon: 'i-heroicons-rocket-launch',
    to: '/releases'
  }].filter(Boolean)
})

// Provide

provide('navigation', navigation)
provide('files', files)
</script>
