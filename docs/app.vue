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
        <ColorPicker />

        <UColorModeButton />

        <USocialButton to="https://twitter.com/nuxtlabs" icon="i-simple-icons-twitter" class="hidden lg:inline-flex" />
        <USocialButton to="https://github.com/nuxtlabs/ui" icon="i-simple-icons-github" class="hidden lg:inline-flex" />
      </template>

      <template #links>
        <UDocsAsideAnchors :links="anchors" />
        <UDocsAsideLinks :links="navigation" />
      </template>
    </UHeader>

    <UContainer>
      <UDocsLayout :links="navigation" :anchors="anchors">
        <NuxtPage />
      </UDocsLayout>
    </UContainer>

    <ClientOnly>
      <UDocsSearch :files="files" :links="navigation" />
    </ClientOnly>

    <UNotifications />
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation())
const { data: files } = await useLazyAsyncData('files', () => queryContent().where({ _type: 'markdown', navigation: { $ne: false } }).find(), { default: () => [] })

provide('navigation', navigation)

const anchors = [{
  label: 'Documentation',
  icon: 'i-heroicons-book-open-solid',
  to: '/getting-started'
}, {
  label: 'Playground',
  icon: 'i-simple-icons-stackblitz',
  to: 'https://stackblitz.com/edit/nuxtlabs-ui?file=app.config.ts,app.vue'
}, {
  label: 'Releases',
  icon: 'i-heroicons-rocket-launch-solid',
  to: 'https://github.com/nuxtlabs/ui/releases'
}]

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
