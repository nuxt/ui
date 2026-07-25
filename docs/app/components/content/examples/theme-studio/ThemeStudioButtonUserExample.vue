<script setup lang="ts">
import type { ThemePreset } from '@nuxt/ui-theme-studio/engine'

// The themes your product signs off on — appended after the stock list.
const brand: ThemePreset[] = [{
  id: 'midnight',
  name: 'Midnight',
  description: 'The low-light company theme',
  icon: 'i-lucide-moon-star',
  doc: {
    version: 1,
    colors: { primary: 'violet', neutral: 'zinc' },
    font: { sans: 'Inter' },
    radius: 0.5
  }
}]
</script>

<template>
  <ThemeStudioButton
    mode="user"
    :presets="['nuxt-ui', 'shadcn', 'neo-brutalist']"
    :custom-presets="brand"
    :sections="['colors', 'general']"
  />
</template>
