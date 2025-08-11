<script setup lang="ts">
import colors from 'tailwindcss/colors'
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const route = useRoute()
const appConfig = useAppConfig()
const colorMode = useColorMode()

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs', ['framework']))
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs'), {
  server: false
})

const links = useHeaderLinks()
const searchLinks = useSearchLinks()
const color = computed(() => colorMode.value === 'dark' ? (colors as any)[appConfig.ui.colors.neutral][900] : 'white')
const radius = computed(() => `:root { --ui-radius: ${appConfig.theme.radius}rem; }`)
const blackAsPrimary = computed(() => appConfig.theme.blackAsPrimary ? `:root { --ui-primary: black; } .dark { --ui-primary: white; }` : ':root {}')

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    // { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' }
  ],
  style: [
    { innerHTML: radius, id: 'nuxt-ui-radius', tagPriority: -2 },
    { innerHTML: blackAsPrimary, id: 'nuxt-ui-black-as-primary', tagPriority: -2 }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  titleTemplate: '%s - Nuxt UI',
  title: String(props.error.statusCode)
})

useServerSeoMeta({
  ogSiteName: 'Nuxt UI',
  twitterCard: 'summary_large_image'
})

useFaviconFromTheme()

const { frameworks } = useSharedData()
const { mappedNavigation, filteredNavigation } = useContentNavigation(navigation)

provide('navigation', mappedNavigation)
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="#FFF" />

    <div :class="[route.path.startsWith('/docs/') && 'root']">
      <Banner />

      <Header :links="links" />

      <UError :error="error" />

      <Footer />

      <ClientOnly>
        <LazyUContentSearch
          :links="searchLinks"
          :files="files"
          :groups="[{
            id: 'framework',
            label: 'Framework',
            items: frameworks
          }]"
          :navigation="filteredNavigation"
          :fuse="{ resultLimit: 120 }"
        />
      </ClientOnly>
    </div>
  </UApp>
</template>
