<script setup lang="ts">
import theme from '#build/ui/page-hero'

const orientations = Object.keys(theme.variants.orientation)

const orientation = ref('vertical' as keyof typeof theme.variants.orientation)
const reverse = ref(false)
</script>

<template>
  <Navbar>
    <USelect v-model="orientation" :items="orientations" />
    <USwitch v-model="reverse" label="Reverse" />
  </Navbar>

  <UPageHero
    title="The ultimate Vue UI library"
    description="A comprehensive, Nuxt-integrated UI library providing a rich set of fully-styled, accessible and highly customizable components for building modern web applications."
    headline="Nuxt UI v4 is here!"
    :orientation="orientation"
    :reverse="reverse"
    :links="[{ label: 'Get started', icon: 'i-lucide-square-play', to: 'https://ui.nuxt.com/docs/getting-started' }, { label: 'Explore components', trailingIcon: 'i-lucide-arrow-right', to: 'https://ui.nuxt.com/docs/components', color: 'neutral', variant: 'subtle' }]"
    class="min-h-0"
  >
    <Placeholder v-if="orientation === 'horizontal'" class="size-full min-h-96" />
  </UPageHero>
</template>
