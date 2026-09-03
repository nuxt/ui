<script setup lang="ts">
const route = useRoute()

const { open: chatOpen } = useChat()
const chatSeen = ref(false)
watch(chatOpen, (value) => {
  if (value) chatSeen.value = true
}, { immediate: true })

// ⌘I lives here rather than in Chat.vue: the chat only mounts once it has been
// opened, so a binding inside it would never exist on the fresh load where the
// command palette still advertises the shortcut.
const { open: searchOpen } = useContentSearch()

defineShortcuts({
  meta_i: {
    handler: () => {
      if (searchOpen.value) {
        searchOpen.value = false
        chatOpen.value = true
      } else {
        chatOpen.value = !chatOpen.value
      }
    },
    usingInput: true
  }
})

const appConfig = useAppConfig()
const { style, link, color } = useTheme()

const colorMode = useColorMode()

// Bare `d`, site-wide since the color mode button sits in the header on every
// page. defineShortcuts disables single-key bindings while an input or a
// contenteditable is focused, so it never eats a typed 'd'. Reads `.value`,
// not `.preference`, so toggling out of `system` flips away from what's
// currently on screen rather than to it.
// Not in the example iframes: those pin their mode from ?theme= to match
// the page embedding them.
defineShortcuts({
  d: () => {
    if (route.path.startsWith('/examples')) return
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

const { data: navigation } = await useFetch('/api/navigation.json')

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link,
  style
})

if (import.meta.server) {
  useSeoMeta({
    ogSiteName: 'Nuxt UI',
    ogType: 'website',
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

const showLayout = computed(() => !route.path.startsWith('/examples') && route.path !== '/theme')
</script>

<template>
  <UApp :toaster="appConfig.toaster">
    <NuxtLoadingIndicator color="var(--ui-primary)" :height="2" />

    <div class="flex">
      <div class="flex-1 min-w-0" :class="[route.path.startsWith('/docs/') && 'root']">
        <template v-if="showLayout">
          <!-- <Banner /> -->

          <Header />
        </template>

        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>

        <template v-if="showLayout">
          <Footer />
        </template>
      </div>

      <template v-if="!route.path.startsWith('/examples')">
        <ClientOnly>
          <!-- mounted on first open (state persists, so a kept-open chat
               remounts on load): the chat pulls the studio engine with it,
               which every plain docs visit can skip downloading -->
          <LazyChat v-if="chatSeen" />

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
