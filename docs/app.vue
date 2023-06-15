<template>
  <div>
    <Header />

    <UContainer class="grid lg:grid-cols-10 lg:gap-8">
      <DocsAside class="lg:col-span-2" />

      <div class="lg:col-span-8">
        <NuxtPage />
      </div>
    </UContainer>

    <ClientOnly>
      <DocsSearch />
    </ClientOnly>

    <UNotifications />
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation())

provide('navigation', navigation)

// Computed

const color = computed(() => colorMode.value === 'dark' ? '#18181b' : 'white')

// Head

useHead({
  titleTemplate: title => title && title.includes('NuxtLabs UI') ? title : `${title} - NuxtLabs UI`,
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css' },
    { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' }
  ],
  htmlAttrs: {
    lang: 'en'
  },
  bodyAttrs: {
    class: 'antialiased font-sans text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900'
  }
})

useSeoMeta({
  ogImage: '/social-preview.jpg',
  twitterImage: '/social-preview.jpg',
  twitterCard: 'summary_large_image'
})
</script>
