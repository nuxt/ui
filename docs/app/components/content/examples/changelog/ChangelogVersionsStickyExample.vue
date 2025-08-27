<script setup lang="ts">
const versions = [{
  title: 'Nuxt 3.17',
  description: 'Nuxt 3.17 is out - bringing a major reworking of the async data layer, a new built-in component, better warnings, and performance improvements!',
  date: '2025-04-27T00:00:00.000Z',
  image: 'https://nuxt.com/assets/blog/v3.17.png',
  badge: 'v3.17.0',
  to: 'https://nuxt.com/blog/nuxt-3-17',
  target: '_blank',
  authors: [{
    name: 'Daniel Roe',
    avatar: {
      src: 'https://github.com/danielroe.png',
      alt: 'Daniel Roe'
    },
    to: 'https://github.com/danielroe',
    target: '_blank'
  }]
}, {
  title: 'Nuxt 3.16',
  description: 'Nuxt 3.16 is out - packed with features and performance improvements!',
  date: '2024-03-07T00:00:00.000Z',
  image: 'https://nuxt.com/assets/blog/v3.16.png',
  badge: 'v3.16.0',
  to: 'https://nuxt.com/blog/v3-16',
  target: '_blank',
  authors: [{
    name: 'Daniel Roe',
    avatar: {
      src: 'https://github.com/danielroe.png',
      alt: 'Daniel Roe'
    },
    to: 'https://github.com/danielroe',
    target: '_blank'
  }]
}, {
  title: 'Nuxt 3.15',
  description: 'Nuxt 3.15 is out - with Vite 6, better HMR and faster performance!',
  date: '2024-12-24T00:00:00.000Z',
  image: 'https://nuxt.com/assets/blog/v3.15.png',
  badge: 'v3.15.0',
  to: 'https://nuxt.com/blog/v3-15',
  target: '_blank',
  authors: [{
    name: 'Daniel Roe',
    avatar: {
      src: 'https://github.com/danielroe.png',
      alt: 'Daniel Roe'
    },
    to: 'https://github.com/danielroe',
    target: '_blank'
  }]
}]
</script>

<template>
  <UChangelogVersions :indicator="false">
    <UChangelogVersion
      v-for="version in versions"
      :key="version.title"
      v-bind="version"
      :badge="undefined"
      class="flex items-start"
      :ui="{
        container: 'max-w-lg me-0',
        indicator: 'sticky top-(--ui-header-height) pt-4 -mt-4 flex flex-col items-end'
      }"
    >
      <template #indicator>
        <UBadge :label="version.badge" variant="soft" />

        <span class="text-sm text-muted">{{ new Date(version.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }}</span>
      </template>
    </UChangelogVersion>
  </UChangelogVersions>
</template>
