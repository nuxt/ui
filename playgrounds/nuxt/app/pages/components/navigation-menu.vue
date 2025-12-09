<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import theme from '#build/ui/navigation-menu'

const colors = Object.keys(theme.variants.color)
const variants = Object.keys(theme.variants.variant)
const orientations = Object.keys(theme.variants.orientation)
const contentOrientations = Object.keys(theme.variants.contentOrientation)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  variant: [theme.defaultVariants.variant]
})

const highlight = ref(true)
const highlightColor = ref()
const orientation = ref('horizontal' as keyof typeof theme.variants.orientation)
const contentOrientation = ref('horizontal' as keyof typeof theme.variants.contentOrientation)
const collapsed = ref(false)
const arrow = ref(false)

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
    to: '/components/navigation-menu',
    type: 'trigger',
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
] satisfies NavigationMenuItem[][]
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" placeholder="Color" multiple />
    <USelect v-model="attrs.variant" :items="variants" placeholder="Variant" multiple />
    <USelect v-model="orientation" :items="orientations" placeholder="Orientation" />
    <USelect v-model="contentOrientation" :items="contentOrientations" placeholder="Content orientation" />
    <USwitch v-model="highlight" label="Highlight" />
    <USelect v-model="highlightColor" :items="colors" placeholder="Highlight color" />
    <USwitch v-model="collapsed" label="Collapsed" />
    <USwitch v-model="arrow" label="Arrow" />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs" :class="orientation === 'horizontal' ? 'flex-col' : ''">
    <UNavigationMenu
      :arrow="arrow"
      tooltip
      popover
      :collapsed="collapsed"
      :items="items"
      :orientation="orientation"
      :content-orientation="contentOrientation"
      :highlight="highlight"
      :highlight-color="highlightColor"
      v-bind="props"
      :class="highlight && 'data-[orientation=horizontal]:border-b border-default'"
      class="data-[orientation=vertical]:data-[collapsed=false]:w-48"
    />
  </Matrix>
</template>
