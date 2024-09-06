<script setup lang="ts">
const items = [
  {
    label: 'Guide',
    icon: 'i-heroicons-book-open',
    children: [
      {
        label: 'Introduction',
        description: 'Fully styled and customizable components for Nuxt.',
        icon: 'i-heroicons-home'
      },
      {
        label: 'Installation',
        description: 'Learn how to install and configure Nuxt UI in your application.',
        icon: 'i-heroicons-cloud-arrow-down'
      },
      {
        label: 'Icons',
        icon: 'i-heroicons-face-smile',
        description: 'You have nothing to do, @nuxt/icon will handle it automatically.'
      },
      {
        label: 'Colors',
        icon: 'i-heroicons-swatch',
        description: 'Choose a primary and a gray color from your Tailwind CSS theme.'
      },
      {
        label: 'Theme',
        icon: 'i-heroicons-cog',
        description: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.'
      }
    ]
  },
  {
    label: 'Composables',
    icon: 'i-heroicons-circle-stack',
    children: [
      {
        label: 'defineShortcuts',
        icon: 'i-heroicons-document-text-20-solid',
        description: 'Define shortcuts for your application.'
      },
      {
        label: 'useModal',
        icon: 'i-heroicons-document-text-20-solid',
        description: 'Display a modal within your application.'
      },
      {
        label: 'useSlideover',
        icon: 'i-heroicons-document-text-20-solid',
        description: 'Display a slideover within your application.'
      },
      {
        label: 'useToast',
        icon: 'i-heroicons-document-text-20-solid',
        description: 'Display a toast within your application.'
      }
    ]
  },
  {
    label: 'Components',
    icon: 'i-heroicons-cube-transparent',
    children: [
      {
        label: 'Link',
        icon: 'i-heroicons-document-text-20-solid',
        description: 'Use NuxtLink with superpowers.'
      },
      {
        label: 'Modal',
        icon: 'i-heroicons-document-text-20-solid',
        description: 'Display a modal within your application.'
      },
      {
        label: 'NavigationMenu',
        icon: 'i-heroicons-document-text-20-solid',
        description: 'Display a list of links.'
      },
      {
        label: 'Pagination',
        icon: 'i-heroicons-document-text-20-solid',
        description: 'Display a list of pages.'
      },
      {
        label: 'Popover',
        icon: 'i-heroicons-document-text-20-solid',
        description: 'Display a non-modal dialog that floats around a trigger element.'
      },
      {
        label: 'Progress',
        icon: 'i-heroicons-document-text-20-solid',
        description: 'Show a horizontal bar to indicate task progression.'
      }
    ]
  }
]

const active = ref('0')

// Note: This is for demonstration purposes only. Don't do this at home.
onMounted(() => {
  setInterval(() => {
    active.value = String((Number(active.value) + 1) % items.length)
  }, 2000)
})
</script>

<template>
  <UNavigationMenu v-model="active" :items="items" class="justify-center" />
</template>
