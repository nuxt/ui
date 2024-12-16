<script setup lang="ts">
import colors from 'tailwindcss/colors'
// import { debounce } from 'perfect-debounce'
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const route = useRoute()
const appConfig = useAppConfig()
const colorMode = useColorMode()

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('content', ['framework', 'module']))
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('content'), {
  server: false
})

const searchTerm = ref('')

// watch(searchTerm, debounce((query: string) => {
//   if (!query) {
//     return
//   }

//   useTrackEvent('Search', { props: { query: `${query} - ${searchTerm.value?.commandPaletteRef.results.length} results` } })
// }, 500))

const links = computed(() => [{
  label: 'Docs',
  icon: 'i-lucide-square-play',
  to: '/getting-started',
  active: route.path.startsWith('/getting-started')
}, {
  label: 'Components',
  icon: 'i-lucide-square-code',
  to: '/components',
  active: route.path.startsWith('/components')
}, {
  label: 'Roadmap',
  icon: 'i-lucide-map',
  to: '/roadmap'
}, {
  label: 'Figma',
  icon: 'i-lucide-figma',
  to: 'https://www.figma.com/community/file/1288455405058138934',
  target: '_blank'
}, {
  label: 'Releases',
  icon: 'i-lucide-rocket',
  to: 'https://github.com/nuxt/ui/releases',
  target: '_blank'
}].filter(Boolean))

const color = computed(() => colorMode.value === 'dark' ? (colors as any)[appConfig.ui.colors.neutral][900] : 'white')
const radius = computed(() => `:root { --ui-radius: ${appConfig.theme.radius}rem; }`)

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' }
  ],
  style: [
    { innerHTML: radius, id: 'nuxt-ui-radius', tagPriority: -2 }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  titleTemplate: '%s - Nuxt UI v3',
  title: String(props.error.statusCode)
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
  <UApp>
    <NuxtLoadingIndicator color="#FFF" />

    <!-- <Banner /> -->

    <Header :links="links" />

    <UError :error="error" />

    <!-- <Footer /> -->

    <ClientOnly>
      <LazyUContentSearch
        v-model:search-term="searchTerm"
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
        :fuse="{ resultLimit: 42 }"
      />
    </ClientOnly>
  </UApp>
</template>
