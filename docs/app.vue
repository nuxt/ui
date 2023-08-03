<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <UHeader>
      <template #left>
        <NuxtLink to="/getting-started" class="flex items-end gap-1.5 font-bold text-xl text-gray-900 dark:text-white">
          <Logo class="w-8 h-8 text-primary" />

          <span class="hidden sm:block">NuxtLabs</span><span class="sm:text-primary">UI</span>
        </NuxtLink>
      </template>

      <template #center>
        <UDocsSearchButton class="ml-1.5 flg:w-64 xl:w-96" />
      </template>

      <template #right>
        <ColorPicker />

        <UColorModeButton />

        <USocialButton to="https://twitter.com/nuxtlabs" target="_blank" icon="i-simple-icons-twitter" class="hidden lg:inline-flex" />
        <USocialButton to="https://github.com/nuxtlabs/ui" target="_blank" icon="i-simple-icons-github" class="hidden lg:inline-flex" />
      </template>

      <template #links>
        <UAsideAnchors :links="anchors" />
        <UAsideLinks :links="links" />
      </template>
    </UHeader>

    <UMain>
      <UContainer>
        <UPage>
          <template #left>
            <UAside :links="links" :anchors="anchors" />
          </template>

          <NuxtPage />
        </UPage>
      </UContainer>
    </UMain>

    <ClientOnly>
      <UDocsSearch :files="files" :links="links" />
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

const { data: links } = await useAsyncData('navigation', () => fetchContentNavigation(), {
  transform: (navigation) => mapContentLinks(navigation)
})

const { data: files } = await useLazyAsyncData('files', () => queryContent().where({ _type: 'markdown', navigation: { $ne: false } }).find(), { default: () => [] })

provide('links', links)

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
  }
})

useSeoMeta({
  ogImage: '/social-preview.jpg',
  twitterImage: '/social-preview.jpg',
  twitterCard: 'summary_large_image'
})
</script>
