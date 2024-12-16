<script setup lang="ts">
import { withoutTrailingSlash } from 'ufo'
import colors from 'tailwindcss/colors'
// import { debounce } from 'perfect-debounce'

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
    { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
    { rel: 'canonical', href: `https://ui.nuxt.com${withoutTrailingSlash(route.path)}` }
  ],
  style: [
    { innerHTML: radius, id: 'nuxt-ui-radius', tagPriority: -2 }
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
    <NuxtLoadingIndicator color="#FFF" />

    <template v-if="!route.path.startsWith('/examples')">
      <!-- <Banner /> -->

      <Header :links="links" />
    </template>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <template v-if="!route.path.startsWith('/examples')">
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
    </template>
  </UApp>
</template>

<style>
@import "tailwindcss";
@import "@nuxt/ui-pro";

@source "../content";

@theme {
  --container-8xl: 90rem;

  --font-sans: 'Public Sans', sans-serif;

  --color-green-50: #EFFDF5;
  --color-green-100: #D9FBE8;
  --color-green-200: #B3F5D1;
  --color-green-300: #75EDAE;
  --color-green-400: #00DC82;
  --color-green-500: #00C16A;
  --color-green-600: #00A155;
  --color-green-700: #007F45;
  --color-green-800: #016538;
  --color-green-900: #0A5331;
  --color-green-950: #052E16;
}

:root {
  --ui-container: var(--container-8xl);
}

html[data-framework="nuxt"] .vue-only,
html[data-framework="vue"] .nuxt-only,
html[data-module="ui-pro"] .ui-only,
html[data-module="ui"] .ui-pro-only {
  display: none;
}
</style>
