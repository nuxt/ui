<template>
  <div>
    <UHeader>
      <template #left>
        <NuxtLink to="/getting-started" class="flex items-end gap-1.5 font-bold text-xl text-gray-900 dark:text-white">
          <Logo class="w-8 h-8 text-primary-500 dark:text-primary-400" />

          <span class="hidden sm:block">NuxtLabs</span><span class="sm:text-primary-500 dark:sm:text-primary-400">UI</span>
        </NuxtLink>
      </template>

      <template #center>
        <UDocsSearchButton class="ml-1.5 flg:w-64 xl:w-96" />
      </template>

      <template #right>
        <ColorPickerButton />

        <UColorModeButton />

        <USocialButton to="https://twitter.com/nuxtlabs" icon="i-simple-icons-twitter" class="hidden lg:inline-flex" />
        <USocialButton to="https://github.com/nuxtlabs/ui" icon="i-simple-icons-github" class="hidden lg:inline-flex" />
      </template>
    </UHeader>

    <UContainer>
      <UDocsLayout :links="navigation">
        <NuxtPage />
      </UDocsLayout>
    </UContainer>

    <ClientOnly>
      <UDocsSearch />
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
    { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' }
  ],
  htmlAttrs: {
    lang: 'en'
  },
  bodyAttrs: {
    class: 'antialiased font-sans text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900'
  }
})

useSeoMeta({
  ogImage: '/social-preview.jpg',
  twitterImage: '/social-preview.jpg',
  twitterCard: 'summary_large_image'
})
</script>
