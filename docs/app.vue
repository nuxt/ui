<template>
  <div>
    <Header />

    <UContainer>
      <NuxtPage />
    </UContainer>

    <DocsSearch />

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
  titleTemplate: title => title && title !== 'nuxthq/ui' ? `${title} - nuxthq/ui` : 'nuxthq/ui',
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
</script>
