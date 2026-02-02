<script setup lang="ts">
const title = 'Roadmap'
const description = 'Discover our Volta board for @nuxt/ui development status.'

useSeoMeta({
  titleTemplate: '%s - Nuxt UI',
  title,
  description,
  ogTitle: `${title} - Nuxt UI`,
  ogDescription: description
})

defineOgImageComponent('Docs', {
  headline: 'Community'
})
</script>

<template>
  <div class="h-[calc(100vh-var(--ui-header-height))]" />
</template>
