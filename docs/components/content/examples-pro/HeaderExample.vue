<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'

const navigation = inject<Ref<NavItem[]>>('navigation')

const links = [{
  label: 'Documentation',
  icon: 'i-heroicons-book-open-solid',
  to: '/getting-started'
}, {
  label: 'Playground',
  icon: 'i-simple-icons-stackblitz',
  to: '/playground'
}, {
  label: 'Roadmap',
  icon: 'i-heroicons-beaker',
  to: '/roadmap'
}, {
  label: 'Pro',
  icon: 'i-heroicons-square-3-stack-3d',
  to: '/pro',
  children: [{
    label: 'Features',
    to: '/pro#features',
    exactHash: true,
    icon: 'i-heroicons-beaker',
    description: 'Discover all the features of Nuxt UI Pro.'
  }, {
    label: 'Pricing',
    to: '/pro#pricing',
    exactHash: true,
    icon: 'i-heroicons-shopping-cart',
    description: 'A simple pricing, for solo developers or teams.'
  }, {
    label: 'Guide',
    to: '/pro/guide',
    icon: 'i-heroicons-book-open',
    description: 'Learn how to use Nuxt UI Pro in your app.'
  }, {
    label: 'Components',
    to: '/pro/components',
    icon: 'i-heroicons-cube-transparent',
    description: 'Discover all the components available in Nuxt UI Pro.'
  }]
}, {
  label: 'Releases',
  icon: 'i-heroicons-rocket-launch',
  to: 'https://github.com/nuxt/ui/releases',
  target: '_blank'
}]
</script>

<template>
  <UHeader :links="links">
    <template #logo>
      <Logo class="w-auto h-6" />
    </template>

    <template #right>
      <UDocsSearchButton :label="null" />

      <UColorModeButton />

      <UButton
        to="https://github.com/nuxt/ui"
        target="_blank"
        icon="i-simple-icons-github"
        aria-label="GitHub"
        class="hidden lg:inline-flex"
        v-bind="($ui.button.secondary as any)"
      />
    </template>

    <template #panel>
      <UNavigationTree :links="mapContentNavigation(navigation)" />
    </template>
  </UHeader>
</template>
