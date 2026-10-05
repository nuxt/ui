<script setup lang="ts">
import type { CommandPaletteGroup, CommandPaletteItem } from '@nuxt/ui'

const studioIcons = useStudioIcons()

const toast = useToast()

const groups = computed<CommandPaletteGroup<CommandPaletteItem>[]>(() => [
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
        label: 'Hugo Richard',
        suffix: 'HugoRCD',
        avatar: { src: 'https://github.com/HugoRCD.png', loading: 'lazy' }
      },
      {
        label: 'Sébastien Chopin',
        suffix: 'atinux',
        avatar: { src: 'https://github.com/atinux.png', loading: 'lazy' }
      }
    ]
  },
  {
    id: 'actions',
    items: [
      {
        label: 'Add new file',
        suffix: 'Create a new file in the current workspace.',
        icon: studioIcons.filePlus,
        kbds: ['meta', 'N'],
        onSelect() {
          toast.add({ title: 'Add new file' })
        }
      },
      {
        label: 'Add new folder',
        suffix: 'Create a new folder in the current workspace.',
        icon: studioIcons.folderPlus,
        kbds: ['meta', 'F'],
        onSelect() {
          toast.add({ title: 'Add new folder' })
        }
      },
      {
        label: 'Add label',
        suffix: 'Add a label to the current item.',
        icon: studioIcons.tag,
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
  <UCommandPalette :groups="groups" placeholder="Search users and actions..." :autofocus="false" class="h-71.5" />
</template>
