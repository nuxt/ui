<script setup lang="ts">
const title = 'Playground'
const description = 'Play online with our interactive Nuxt Image playground.'

useSeoMeta({
  titleTemplate: '%s - Nuxt UI',
  title,
  ogTitle: 'Nuxt UI Playground',
  description
})

defineOgImageComponent('Docs')
</script>

<template>
  <div class="h-[calc(100vh-var(--header-height)-var(--header-height)-1px)]">
    <ClientOnly>
      <iframe :src="`https://stackblitz.com/edit/nuxt-ui?embed=1&file=app.config.ts,app.vue&theme=${$colorMode.preference}`" width="100%" height="100%" />
    </ClientOnly>
  </div>
</template>
