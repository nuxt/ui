<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const route = useRoute()
const { data: navigation } = await useFetch('/api/navigation.json')

// theme style/link/theme-color head entries come from the theme-studio layer's plugin
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})

useSeoMeta({
  titleTemplate: '%s - Nuxt UI',
  title: String(props.error.statusCode)
})

if (import.meta.server) {
  useSeoMeta({
    ogSiteName: 'Nuxt UI',
    twitterCard: 'summary_large_image'
  })
}

useFaviconFromTheme()

const { rootNavigation, navigationByFramework } = useNavigation(navigation)

provide('navigation', rootNavigation)
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="var(--ui-primary)" :height="2" />

    <div class="flex">
      <div class="flex-1 min-w-0" :class="[route.path.startsWith('/docs/') && 'root']">
        <!-- <Banner /> -->

        <Header />

        <UError :error="error" />

        <Footer />
      </div>

      <ClientOnly>
        <Chat />

        <Search :navigation="navigationByFramework" />
      </ClientOnly>
    </div>
  </UApp>
</template>
