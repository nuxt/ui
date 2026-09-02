<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const route = useRoute()
const { style, link, color } = useTheme()

// same lazy mount as app.vue: a static mount here would defeat the
// dynamic import and pull the studio engine back into the entry chunk
const { open: chatOpen } = useChat()
const chatSeen = ref(false)
watch(chatOpen, (value) => {
  if (value) chatSeen.value = true
}, { immediate: true })

const { data: navigation } = await useFetch('/api/navigation.json')

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link,
  style
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
        <LazyChat v-if="chatSeen" />

        <Search :navigation="navigationByFramework" />
      </ClientOnly>
    </div>
  </UApp>
</template>
