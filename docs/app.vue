<template>
  <div>
    <Header />

    <UContainer>
      <div class="relative grid lg:grid-cols-10 lg:gap-8">
        <DocsAside class="lg:col-span-2" />

        <div class="relative lg:col-span-6 pt-8 pb-16">
          <DocsPageHeader />

          <NuxtPage />

          <hr class="border-gray-200 dark:border-gray-800 my-12">

          <DocsPrevNext />
        </div>

        <DocsToc class="lg:col-span-2 order-first lg:order-last" />
      </div>
    </UContainer>

    <ClientOnly>
      <DocsSearch />
    </ClientOnly>

    <UNotifications />
  </div>
</template>

<script setup lang="ts">
const colorScheme = usePreferredColorScheme()
const colorMode = useColorMode()

// Computed

const href = computed(() => colorScheme.value === 'dark' ? '/icon-dark.svg' : '/icon-light.svg')
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
    { rel: 'icon', type: 'image/svg+xml', href }
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
