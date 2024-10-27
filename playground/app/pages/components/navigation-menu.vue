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
    badge: 10,
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
      to: '/components/link'
    }, {
      label: 'Modal',
      icon: 'i-heroicons-document',
      description: 'Display a modal within your application.',
      to: '/components/modal'
    }, {
      label: 'NavigationMenu',
      icon: 'i-heroicons-document',
      description: 'Display a list of links.',
      to: '/components/navigation-menu'
    }, {
      label: 'Pagination',
      icon: 'i-heroicons-document',
      description: 'Display a list of pages.',
      to: '/components/pagination'
    }, {
      label: 'Popover',
      icon: 'i-heroicons-document',
      description: 'Display a non-modal dialog that floats around a trigger element.',
      to: '/components/popover'
    }, {
      label: 'Progress',
      icon: 'i-heroicons-document',
      description: 'Show a horizontal bar to indicate task progression.',
      to: '/components/progress'
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
  <div class="flex flex-col items-center gap-12 max-w-full">
    <div class="flex flex-wrap items-center gap-2">
      <USelect v-model="color" :items="colors" placeholder="Color" />
      <USelect v-model="variant" :items="variants" placeholder="Variant" />
      <USelect v-model="orientation" :items="orientations" placeholder="Orientation" />
      <USwitch v-model="highlight" label="Highlight" />
      <USelect v-model="highlightColor" :items="colors" placeholder="Highlight color" />
    </div>

    <UNavigationMenu
      arrow
      :items="items"
      :color="color"
      :variant="variant"
      :orientation="orientation"
      :highlight="highlight"
      :highlight-color="highlightColor"
      :ui="{
        base: highlight ? 'data-[orientation=horizontal]:border-b data-[orientation=vertical]:border-l border-[var(--ui-border)]' : ''
      }"
    />
  </div>
</template>
