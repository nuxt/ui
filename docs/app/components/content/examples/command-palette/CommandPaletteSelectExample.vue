<script setup lang="ts">
const router = useRouter()

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
          src: 'https://github.com/benjamincanac.png',
          alt: 'benjamincanac'
        }
      },
      {
        label: 'Sylvain Marroufin',
        suffix: 'smarroufin',
        to: 'https://github.com/smarroufin',
        target: '_blank',
        avatar: {
          src: 'https://github.com/smarroufin.png',
          alt: 'smarroufin'
        }
      },
      {
        label: 'Sébastien Chopin',
        suffix: 'atinux',
        to: 'https://github.com/atinux',
        target: '_blank',
        avatar: {
          src: 'https://github.com/atinux.png',
          alt: 'atinux'
        }
      },
      {
        label: 'Romain Hamel',
        suffix: 'romhml',
        to: 'https://github.com/romhml',
        target: '_blank',
        avatar: {
          src: 'https://github.com/romhml.png',
          alt: 'romhml'
        }
      },
      {
        label: 'Haytham A. Salama',
        suffix: 'Haythamasalama',
        to: 'https://github.com/Haythamasalama',
        target: '_blank',
        avatar: {
          src: 'https://github.com/Haythamasalama.png',
          alt: 'Haythamasalama'
        }
      },
      {
        label: 'Daniel Roe',
        suffix: 'danielroe',
        to: 'https://github.com/danielroe',
        target: '_blank',
        avatar: {
          src: 'https://github.com/danielroe.png',
          alt: 'danielroe'
        }
      },
      {
        label: 'Neil Richter',
        suffix: 'noook',
        to: 'https://github.com/noook',
        target: '_blank',
        avatar: {
          src: 'https://github.com/noook.png',
          alt: 'noook'
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
          console.log('Add new file')
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
          console.log('Add new folder')
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
          console.log('Add hashtag')
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
          console.log('Add label')
        }
      }
    ]
  }
])

function onSelect(item: any) {
  if (item.onSelect) {
    item.onSelect()
  } else if (item.to) {
    if (typeof item.to === 'string' && (item.target === '_blank' || item.to.startsWith('http'))) {
      window.open(item.to, item.target || '_blank')
    } else {
      router.push(item.to)
    }
  }
}
</script>

<template>
  <UCommandPalette
    :groups="groups"
    class="flex-1 h-80"
    @update:model-value="onSelect"
  />
</template>
