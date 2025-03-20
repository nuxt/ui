<script setup lang="ts">
import { withoutTrailingSlash } from 'ufo'
import colors from 'tailwindcss/colors'

const route = useRoute()
const appConfig = useAppConfig()
const colorMode = useColorMode()

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('content', ['framework', 'module']))
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('content'), {
  server: false
})

const links = useLinks()
const color = computed(() => colorMode.value === 'dark' ? (colors as any)[appConfig.ui.colors.neutral][900] : 'white')
const radius = computed(() => `:root { --ui-radius: ${appConfig.theme.radius}rem; }`)
const blackAsPrimary = computed(() => appConfig.theme.blackAsPrimary ? `:root { --ui-primary: black; } .dark { --ui-primary: white; }` : ':root {}')

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
    { rel: 'canonical', href: `https://ui.nuxt.com${withoutTrailingSlash(route.path)}` }
  ],
  style: [
    { innerHTML: radius, id: 'nuxt-ui-radius', tagPriority: -2 },
    { innerHTML: blackAsPrimary, id: 'nuxt-ui-black-as-primary', tagPriority: -2 }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useServerSeoMeta({
  ogSiteName: 'Nuxt UI',
  twitterCard: 'summary_large_image'
})

const { frameworks, modules } = useSharedData()
const { mappedNavigation, filteredNavigation } = useContentNavigation(navigation)

provide('navigation', mappedNavigation)
</script>

<template>
  <UApp :toaster="appConfig.toaster">
    <NuxtLoadingIndicator color="var(--ui-primary)" :height="2" />

    <template v-if="!route.path.startsWith('/examples')">
      <Banner />

      <Header :links="links" />
    </template>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <template v-if="!route.path.startsWith('/examples')">
      <Footer />

      <ClientOnly>
        <LazyUContentSearch
          :files="files"
          :groups="[{
            id: 'framework',
            label: 'Framework',
            items: frameworks
          }, {
            id: 'module',
            label: 'Module',
            items: modules
          }]"
          :navigation="filteredNavigation"
          :fuse="{ resultLimit: 100 }"
        />
      </ClientOnly>
    </template>
  </UApp>
</template>

<style>
/* Safelist (do not remove): [&>div]:*:my-0 [&>div]:*:w-full h-64 !px-0 !py-0 !pt-0 !pb-0 !p-0 !justify-start !justify-end !min-h-96 h-136 */
</style>
