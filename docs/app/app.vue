<script setup lang="ts">
import colors from 'tailwindcss/colors'

const route = useRoute()
const appConfig = useAppConfig()
const colorMode = useColorMode()
const { style, link } = useTheme()

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs', ['framework', 'category', 'description']))

const color = computed(() => colorMode.value === 'dark' ? (colors as any)[appConfig.ui.colors.neutral][900] : 'white')

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link,
  style,
  htmlAttrs: {
    lang: 'en'
  }
})

if (import.meta.server) {
  useSeoMeta({
    ogSiteName: 'Nuxt UI',
    twitterCard: 'summary_large_image'
  })

  useSchemaOrg([
    defineWebSite({
      name: useSiteConfig().name
    })
  ])
}

useFaviconFromTheme()

const { rootNavigation, navigationByFramework } = useNavigation(navigation)

provide('navigation', rootNavigation)
</script>

<template>
  <UApp :toaster="appConfig.toaster">
    <NuxtLoadingIndicator color="var(--ui-primary)" :height="2" />

    <div class="flex">
      <div class="flex-1 min-w-0" :class="[route.path.startsWith('/docs/') && 'root']">
        <template v-if="!route.path.startsWith('/examples')">
          <!-- <Banner /> -->

          <Header />
        </template>

        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>

        <template v-if="!route.path.startsWith('/examples')">
          <Footer />
        </template>
      </div>

      <template v-if="!route.path.startsWith('/examples')">
        <ClientOnly>
          <Chat />

          <Search :navigation="navigationByFramework" />
        </ClientOnly>
      </template>
    </div>
  </UApp>
</template>

<style>
/* Safelist (do not remove): [&>div]:*:my-0 [&>div]:*:w-full h-64 !px-0 !py-0 !pt-0 !pb-0 !p-0 !justify-start !justify-end !min-h-96 h-136 max-h-[341px] */

@media (min-width: 1024px) {
  .root {
    --ui-header-height: 112px;
  }
}
</style>
