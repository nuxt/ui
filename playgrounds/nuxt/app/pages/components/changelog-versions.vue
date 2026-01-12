<script setup lang="ts">
const container = ref<HTMLElement>()

const versions = ref([
  {
    title: 'Nuxt 3.17',
    description:
      'Nuxt 3.17 is out - bringing a major reworking of the async data layer, a new built-in component, better warnings, and performance improvements!',
    image: 'https://nuxt.com/assets/blog/v3.17.png',
    date: '2025-04-27',
    to: 'https://nuxt.com/blog/v3-17',
    target: '_blank',
    ui: {
      container: 'max-w-lg'
    }
  },
  {
    title: 'Nuxt 3.16',
    description:
      'Nuxt 3.16 is out - packed with features and performance improvements!',
    image: 'https://nuxt.com/assets/blog/v3.16.png',
    date: '2025-03-07',
    to: 'https://nuxt.com/blog/v3-16',
    target: '_blank',
    ui: {
      container: 'max-w-lg'
    }
  },
  {
    title: 'Nuxt 3.15',
    description:
      'Nuxt 3.15 is out - with Vite 6, better HMR and faster performance!',
    image: 'https://nuxt.com/assets/blog/v3.15.png',
    date: '2024-12-24',
    to: 'https://nuxt.com/blog/v3-15',
    target: '_blank',
    ui: {
      container: 'max-w-lg'
    }
  }
])
</script>

<template>
  <Navbar />

  <div ref="container" class="relative w-full h-96 overflow-auto">
    <UChangelogVersions
      v-if="container"
      :versions="versions"
      :indicator="{
        container
      }"
    />
  </div>
</template>
