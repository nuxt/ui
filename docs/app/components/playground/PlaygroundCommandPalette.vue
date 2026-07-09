<script setup lang="ts">
import type { CommandPaletteGroup, CommandPaletteItem } from '@nuxt/ui'

const toast = useToast()

const groups = ref<CommandPaletteGroup<CommandPaletteItem>[]>([
  {
    id: 'users',
    label: 'Users',
    items: [
      {
        label: 'Benjamin Canac',
        suffix: 'benjamincanac',
        avatar: { src: 'https://github.com/benjamincanac.png', loading: 'lazy' }
      },
      {
        label: 'Romain Hamel',
        suffix: 'romhml',
        avatar: { src: 'https://github.com/romhml.png', loading: 'lazy' }
      },
      {
        label: 'Neil Richter',
        suffix: 'noook',
        avatar: { src: 'https://github.com/noook.png', loading: 'lazy' }
      }
    ]
  },
  {
    id: 'actions',
    items: [
      {
        label: 'Add new file',
        suffix: 'Create a new file in the current workspace.',
        icon: 'i-lucide-file-plus',
        kbds: ['meta', 'N'],
        onSelect() {
          toast.add({ title: 'Add new file' })
        }
      },
      {
        label: 'Add new folder',
        suffix: 'Create a new folder in the current workspace.',
        icon: 'i-lucide-folder-plus',
        kbds: ['meta', 'F'],
        onSelect() {
          toast.add({ title: 'Add new folder' })
        }
      },
      {
        label: 'Add label',
        suffix: 'Add a label to the current item.',
        icon: 'i-lucide-tag',
        kbds: ['meta', 'L'],
        onSelect() {
          toast.add({ title: 'Add label' })
        }
      }
    ]
  }
])
</script>

<template>
  <UCommandPalette :groups="groups" placeholder="Search users and actions..." class="h-80" />
</template>
