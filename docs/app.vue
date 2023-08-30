<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <Header />

    <UMain>
      <UContainer>
        <UPage>
          <template #left>
            <UAside :links="anchors">
              <BranchSelect />
              <UNavigationTree :links="mapContentNavigation(navigation)" />
            </UAside>
          </template>

          <NuxtPage />
        </UPage>
      </UContainer>
    </UMain>

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
const colorMode = useColorMode()
const { prefix, removePrefixFromNavigation, removePrefixFromFiles } = useContentSource()
const { mapContentNavigation } = useElementsHelpers()

const { data: nav } = await useAsyncData('navigation', () => fetchContentNavigation())

const { data: search } = useLazyFetch('/api/search.json', {
  default: () => [],
  server: false
})

const anchors = [{
  label: 'Documentation',
  icon: 'i-heroicons-book-open-solid',
  to: '/getting-started'
}, {
  label: 'Playground',
  icon: 'i-simple-icons-stackblitz',
  to: 'https://stackblitz.com/edit/nuxtlabs-ui?file=app.config.ts,app.vue',
  target: '_blank'
}, {
  label: 'Releases',
  icon: 'i-heroicons-rocket-launch-solid',
  to: 'https://github.com/nuxtlabs/ui/releases',
  target: '_blank'
}]

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
  titleTemplate: title => title && title.includes('Nuxt UI') ? title : `${title} - Nuxt UI`,
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  ogImage: '/social-preview.jpg',
  twitterImage: '/social-preview.jpg',
  twitterCard: 'summary_large_image'
})

// Provide

provide('navigation', navigation)
provide('files', files)
</script>
