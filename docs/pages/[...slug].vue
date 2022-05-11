<script setup lang="ts">
definePageMeta({
  /* Layout transitions creates layout shifts with defaults */
  layoutTransition: false,
  middleware: ['navigation', 'page']
})

const { page: document, theme } = useDocus()

useHead({
  title: page.value?.title,
  titleTemplate: theme.value?.title ? `%s | ${theme.value.title}` : '%s',
  meta: [
    { hid: 'description', name: 'description', content: page.value?.description || theme.value?.description },
    { hid: 'og:site_name', property: 'og:site_name', content: 'Nuxt' },
    { hid: 'og:type', property: 'og:type', content: 'website' }
  ]
})
</script>

<template>
  <div class="prose dark:prose-invert max-w-none">
    <Content v-if="document" :document="document" />
  </div>
</template>
