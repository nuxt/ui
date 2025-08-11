<script setup lang="ts">
const cards = ref([
  {
    title: 'Theme',
    description: 'Learn how to customize Nuxt UI components using Tailwind CSS v4.',
    icon: 'i-lucide-swatch-book',
    to: '/docs/getting-started/theme',
    class: 'lg:col-span-2',
    image: {
      path: 'https://ui2.nuxt.com/illustrations/color-palette',
      width: 363,
      height: 152
    },
    orientation: 'horizontal' as const
  },
  {
    title: 'Fonts',
    description: 'Nuxt UI integrates with Nuxt Fonts to provide plug-and-play font optimization.',
    icon: 'i-lucide-a-large-small',
    to: '/docs/getting-started/fonts',
    variant: 'soft' as const
  },
  {
    title: 'Color Mode',
    description: 'Nuxt UI integrates with Nuxt Color Mode to switch between light and dark.',
    icon: 'i-lucide-sun-moon',
    to: '/docs/getting-started/color-mode',
    variant: 'soft' as const
  },
  {
    title: 'Icons',
    description: 'Nuxt UI integrates with Nuxt Icon to access over 200,000+ icons from Iconify.',
    icon: 'i-lucide-smile',
    to: '/docs/getting-started/icons',
    image: {
      path: 'https://ui2.nuxt.com/illustrations/icon-library',
      width: 362,
      height: 184
    },
    class: 'lg:col-span-2',
    orientation: 'horizontal' as const,
    reverse: true
  }
])
</script>

<template>
  <UPageGrid>
    <UPageCard
      v-for="(card, index) in cards"
      :key="index"
      v-bind="card"
    >
      <UColorModeImage
        v-if="card.image"
        :light="`${card.image.path}-light.svg`"
        :dark="`${card.image.path}-dark.svg`"
        :width="card.image.width"
        :height="card.image.height"
        :alt="card.title"
        loading="lazy"
        class="w-full"
      />
    </UPageCard>
  </UPageGrid>
</template>
