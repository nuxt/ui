<script setup lang="ts">
import theme from '#build/ui/navigation-menu'

const colors = Object.keys(theme.variants.color)
const variants = Object.keys(theme.variants.variant)
const orientations = Object.keys(theme.variants.orientation)
const contentOrientations = Object.keys(theme.variants.contentOrientation)

const color = ref(theme.defaultVariants.color)
const highlightColor = ref()
const variant = ref(theme.defaultVariants.variant)
const orientation = ref('horizontal' as const)
const contentOrientation = ref('horizontal' as const)
const highlight = ref(true)
const collapsed = ref(false)

const items = [
  [{
    label: 'Link',
    type: 'label' as const
  }, {
    label: 'Documentation',
    icon: 'i-lucide-book-open',
    badge: 10,
    children: [{
      label: 'Introduction',
      description: 'Fully styled and customizable components for Nuxt.',
      icon: 'i-lucide-house'
    }, {
      label: 'Installation',
      description: 'Learn how to install and configure Nuxt UI in your application.',
      icon: 'i-lucide-cloud-download'
    }, {
      label: 'Theming',
      description: 'Learn how to customize the look and feel of the components.',
      icon: 'i-lucide-swatch-book'
    }, {
      label: 'Shortcuts',
      description: 'Learn how to display and define keyboard shortcuts in your app.',
      icon: 'i-lucide-monitor'
    }]
  }, {
    label: 'Components',
    icon: 'i-lucide-box',
    to: '/components',
    active: true,
    defaultOpen: true,
    children: [{
      label: 'Link',
      icon: 'i-lucide-link',
      description: 'Use NuxtLink with superpowers.',
      to: '/components/link'
    }, {
      label: 'Modal',
      icon: 'i-lucide-square',
      description: 'Display a modal dialog overlay for important content.',
      to: '/components/modal'
    }, {
      label: 'NavigationMenu',
      icon: 'i-lucide-list',
      description: 'Display a list of links.',
      to: '/components/navigation-menu',
      trailingIcon: 'i-lucide-check'
    }, {
      label: 'Pagination',
      icon: 'i-lucide-parking-meter',
      description: 'Display a list of pages.',
      to: '/components/pagination'
    }, {
      label: 'Popover',
      icon: 'i-lucide-message-circle',
      description: 'Display a non-modal dialog that floats around a trigger element.',
      to: '/components/popover'
    }, {
      label: 'Progress',
      icon: 'i-lucide-loader',
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
    icon: 'i-lucide-circle-help',
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
      <USelect v-model="contentOrientation" :items="contentOrientations" placeholder="Content orientation" />
      <USwitch v-model="collapsed" label="Collapsed" />
      <USwitch v-model="highlight" label="Highlight" />
      <USelect v-model="highlightColor" :items="colors" placeholder="Highlight color" />
    </div>

    <UNavigationMenu
      arrow
      :collapsed="collapsed"
      :items="items"
      :color="color"
      :variant="variant"
      :orientation="orientation"
      :content-orientation="contentOrientation"
      :highlight="highlight"
      :highlight-color="highlightColor"
      :class="highlight && 'data-[orientation=horizontal]:border-b border-(--ui-border)'"
      class="data-[orientation=vertical]:data-[collapsed=false]:w-48"
    />
  </div>
</template>
