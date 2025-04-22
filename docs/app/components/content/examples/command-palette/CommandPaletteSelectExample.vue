<script setup lang="ts">
const toast = useToast()

const groups = ref([
  {
    id: 'users',
    label: 'Users',
    items: [
      {
        label: 'Benjamin Canac',
        suffix: 'benjamincanac',
        to: 'https://github.com/benjamincanac',
        target: '_blank',
        avatar: {
          src: 'https://github.com/benjamincanac.png'
        }
      },
      {
        label: 'Sylvain Marroufin',
        suffix: 'smarroufin',
        to: 'https://github.com/smarroufin',
        target: '_blank',
        avatar: {
          src: 'https://github.com/smarroufin.png'
        }
      },
      {
        label: 'Sébastien Chopin',
        suffix: 'atinux',
        to: 'https://github.com/atinux',
        target: '_blank',
        avatar: {
          src: 'https://github.com/atinux.png'
        }
      },
      {
        label: 'Romain Hamel',
        suffix: 'romhml',
        to: 'https://github.com/romhml',
        target: '_blank',
        avatar: {
          src: 'https://github.com/romhml.png'
        }
      },
      {
        label: 'Haytham A. Salama',
        suffix: 'Haythamasalama',
        to: 'https://github.com/Haythamasalama',
        target: '_blank',
        avatar: {
          src: 'https://github.com/Haythamasalama.png'
        }
      },
      {
        label: 'Daniel Roe',
        suffix: 'danielroe',
        to: 'https://github.com/danielroe',
        target: '_blank',
        avatar: {
          src: 'https://github.com/danielroe.png'
        }
      },
      {
        label: 'Neil Richter',
        suffix: 'noook',
        to: 'https://github.com/noook',
        target: '_blank',
        avatar: {
          src: 'https://github.com/noook.png'
        }
      }
    ]
  },
  {
    id: 'actions',
    items: [
      {
        label: 'Add new file',
        suffix: 'Create a new file in the current directory or workspace.',
        icon: 'i-lucide-file-plus',
        kbds: [
          'meta',
          'N'
        ],
        onSelect() {
          toast.add({ title: 'Add new file' })
        }
      },
      {
        label: 'Add new folder',
        suffix: 'Create a new folder in the current directory or workspace.',
        icon: 'i-lucide-folder-plus',
        kbds: [
          'meta',
          'F'
        ],
        onSelect() {
          toast.add({ title: 'Add new folder' })
        }
      },
      {
        label: 'Add hashtag',
        suffix: 'Add a hashtag to the current item.',
        icon: 'i-lucide-hash',
        kbds: [
          'meta',
          'H'
        ],
        onSelect() {
          toast.add({ title: 'Add hashtag' })
        }
      },
      {
        label: 'Add label',
        suffix: 'Add a label to the current item.',
        icon: 'i-lucide-tag',
        kbds: [
          'meta',
          'L'
        ],
        onSelect() {
          toast.add({ title: 'Add label' })
        }
      }
    ]
  }
])

function onSelect(item: any) {
  console.log(item)
}
</script>

<template>
  <UCommandPalette
    :groups="groups"
    class="flex-1 h-80"
    @update:model-value="onSelect"
  />
</template>
