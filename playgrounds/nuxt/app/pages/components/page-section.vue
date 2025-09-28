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

  <UPageSection
    icon="i-lucide-palette"
    headline="Theme"
    title="Flexible design system"
    description="Build faster with Nuxt UI's CSS-first design system powered by Tailwind CSS and its semantic color system combined with a runtime configuration."
    :links="[{ label: 'Customize design system', trailingIcon: 'i-lucide-arrow-right', to: 'https://ui.nuxt.com/docs/theme/design-system', color: 'neutral', variant: 'subtle' }]"
    :features="[{ title: 'CSS-first configuration', description: 'Define fonts, colors, and breakpoints with the @theme directive directly in your CSS. This makes your theme portable, maintainable and easy to customize.', icon: 'i-simple-icons-css' }, { title: 'Semantic color system', description: 'Configure 7 semantic color aliases (primary, secondary, success, info, warning, error, neutral) that describe the purpose of colors rather than specific values.', icon: 'i-lucide-palette' }, { title: 'Runtime color configuration', description: 'Change colors, icons and more at runtime through AppConfig without rebuilding your application, perfect for multi-tenant applications or dynamic theming.', icon: 'i-lucide-settings' }]"
    :orientation="orientation"
    :reverse="reverse"
    class="min-h-0"
  >
    <Placeholder v-if="orientation === 'horizontal'" class="size-full min-h-96" />
  </UPageSection>
</template>
