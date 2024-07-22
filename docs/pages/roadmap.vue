<script setup lang="ts">
const title = 'Roadmap'
const description = 'Discover our Volta board for @nuxt/ui development status.'

useSeoMeta({
  titleTemplate: '%s - Nuxt UI',
  title,
  ogTitle: 'Nuxt UI Roadmap',
  description
})

defineOgImageComponent('Docs')

const appConfig = useAppConfig()
const colorMode = useColorMode()

const token = 'eyJ2aWV3IjoiYm9hcmQiLCJib2FyZFN0YXR1c2VzIjpbInRyaWFnZSIsImJhY2tsb2ciLCJ0b2RvIiwiaW5fcHJvZ3Jlc3MiLCJpbl9yZXZpZXciLCJkb25lIiwicmVsZWFzZWQiXSwiYm9hcmRMaW5rZWRQcnMiOmZhbHNlLCJsaXN0R3JvdXAiOiJzdGF0ZSIsImxpc3RPcmRlciI6ImNyZWF0ZWRfYXQiLCJ0aW1lbGluZVpvb20iOiJtb250aCIsInRpbWVsaW5lT3JkZXIiOiJzdGF0ZSIsInRpbWVsaW5lRGlzcGxheSI6ImFsbF9taWxlc3RvbmVzIiwiZmlsdGVycyI6e30sIm93bmVyIjoibnV4dCIsIm5hbWUiOiJ1aSJ9'

const src = computed(() => `https://volta.net/embed/${token}?theme=${colorMode.value}&gray=${appConfig.ui.gray}&primary=${appConfig.ui.primary}`)
</script>

<template>
  <div class="h-[calc(100vh-var(--header-height)-var(--header-height)-1px)]">
    <ClientOnly>
      <iframe :src="src" width="100%" height="100%" />
    </ClientOnly>
  </div>
</template>
