<script setup lang="ts">
const route = useRoute()

/** The theme studio's UI-hiding fullscreen also hides the site chrome. */
const studioFullscreen = useState('theme-studio-fullscreen', () => false)
const appConfig = useAppConfig()
const { data: navigation } = await useFetch('/api/navigation.json')

// theme style/link/theme-color head entries come from the theme-studio layer's plugin
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
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
        <template v-if="!route.path.startsWith('/examples') && !(route.path === '/theme' && studioFullscreen)">
          <!-- <Banner /> -->

          <Header />
        </template>

        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>

        <template v-if="!route.path.startsWith('/examples') && route.path !== '/theme'">
          <Footer />
        </template>
        <!-- footer stays off /theme: the studio is a fixed-height app page -->
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
