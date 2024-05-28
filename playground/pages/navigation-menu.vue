<script setup lang="ts">
import theme from '#build/ui/navigation-menu'

const colors = Object.keys(theme.variants.color)
const variants = Object.keys(theme.variants.variant)
const orientations = Object.keys(theme.variants.orientation)

const color = ref(theme.defaultVariants.color)
const highlightColor = ref()
const variant = ref(theme.defaultVariants.variant)
const orientation = ref('horizontal' as const)
const highlight = ref(true)

const items = [
  [{
    label: 'Documentation',
    icon: 'i-heroicons-book-open',
    children: [{
      label: 'Introduction',
      description: 'Fully styled and customizable components for Nuxt.',
      icon: 'i-heroicons-home'
    }, {
      label: 'Installation',
      description: 'Learn how to install and configure Nuxt UI in your application.',
      icon: 'i-heroicons-cloud-arrow-down'
    }, {
      label: 'Theming',
      description: 'Learn how to customize the look and feel of the components.',
      icon: 'i-heroicons-swatch'
    }, {
      label: 'Shortcuts',
      description: 'Learn how to display and define keyboard shortcuts in your app.',
      icon: 'i-heroicons-computer-desktop'
    }]
  }, {
    label: 'Components',
    icon: 'i-heroicons-cube-transparent',
    active: true,
    children: [{
      label: 'Link',
      icon: 'i-heroicons-document',
      description: 'Use NuxtLink with superpowers.',
      to: '/link'
    }, {
      label: 'Modal',
      icon: 'i-heroicons-document',
      description: 'Display a modal within your application.',
      to: '/modal'
    }, {
      label: 'NavigationMenu',
      icon: 'i-heroicons-document',
      description: 'Display a list of links.',
      to: '/navigation-menu'
    }, {
      label: 'Pagination',
      icon: 'i-heroicons-document',
      description: 'Display a list of pages.',
      to: '/pagination'
    }, {
      label: 'Popover',
      icon: 'i-heroicons-document',
      description: 'Display a non-modal dialog that floats around a trigger element.',
      to: '/popover'
    }, {
      label: 'Progress',
      icon: 'i-heroicons-document',
      description: 'Show a horizontal bar to indicate task progression.',
      to: '/progress'
    }]
  }, {
    label: 'GitHub',
    icon: 'i-simple-icons-github',
    to: 'https://github.com/nuxt/ui',
    target: '_blank'
  }, {
    label: 'Help',
    icon: 'i-heroicons-question-mark-circle',
    disabled: true
  }]
]
</script>

<template>
  <div class="flex flex-col items-center gap-12">
    <div class="flex items-center gap-2">
      <USelect v-model="color" :items="colors" placeholder="Color" />
      <USelect v-model="variant" :items="variants" placeholder="Variant" />
      <USelect v-model="orientation" :items="orientations" placeholder="Orientation" />
      <USwitch v-model="highlight" label="Highlight" />
      <USelect v-model="highlightColor" :items="colors" placeholder="Highlight color" />
    </div>

    <UNavigationMenu
      :items="items"
      :color="color"
      :variant="variant"
      :orientation="orientation"
      :highlight="highlight"
      :highlight-color="highlightColor"
      arrow
      :class="highlight ? [
        'border-gray-200 dark:border-gray-800',
        orientation === 'vertical' as any ? 'border-l' : 'border-b'
      ] : undefined"
    />
  </div>
</template>
