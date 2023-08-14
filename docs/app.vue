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
      <UDocsSearch :files="files" :navigation="navigation" />
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

const { data: navigation } = await useLazyAsyncData('navigation', () => fetchContentNavigation(), {
  default: () => [],
  transform: (navigation) => {
    navigation = navigation.find(link => link._path === prefix.value)?.children || []

    return prefix.value === '/main' ? removePrefixFromNavigation(navigation) : navigation
  },
  watch: [prefix]
})

const { data: files } = await useLazyAsyncData('files', () => queryContent().where({ _type: 'markdown', navigation: { $ne: false } }).find(), {
  default: () => [],
  transform: (files) => {
    files = files.filter(file => file._path.startsWith(prefix.value))

    return prefix.value === '/main' ? removePrefixFromFiles(files) : files
  },
  watch: [prefix]
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
