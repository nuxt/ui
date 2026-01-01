<script setup lang="ts">
import theme from '#build/ui/page-feature'

const orientations = Object.keys(theme.variants.orientation)

const orientation = ref('horizontal' as keyof typeof theme.variants.orientation)
</script>

<template>
  <Navbar>
    <USelect v-model="orientation" :items="orientations" />
  </Navbar>

  <UPageFeature
    title="Theme"
    description="Customize Nuxt UI with your own colors, fonts, and more."
    icon="i-lucide-swatch-book"
    :orientation="orientation"
    to="https://ui.nuxt.com/docs/getting-started/theme/design-system"
    target="_blank"
  />
</template>
