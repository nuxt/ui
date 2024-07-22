<script setup lang="ts">
import theme from '#build/ui/context-menu'

const items = [
  [{
    label: 'My account',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/739984?v=4'
    }
  }],
  [{
    label: 'Appearance',
    children: [{
      label: 'System',
      icon: 'i-heroicons-computer-desktop'
    }, {
      label: 'Light',
      icon: 'i-heroicons-sun'
    }, {
      label: 'Dark',
      icon: 'i-heroicons-moon'
    }]
  }],
  [{
    label: 'Show Sidebar',
    kbds: ['meta', 'S'],
    select() {
      console.log('Show Sidebar clicked')
    }
  }, {
    label: 'Show Toolbar',
    kbds: ['shift', 'meta', 'D'],
    select() {
      console.log('Show Toolbar clicked')
    }
  }, {
    label: 'Collapse Pinned Tabs',
    disabled: true
  }], [{
    label: 'Refresh the Page'
  }, {
    label: 'Clear Cookies and Refresh'
  }, {
    label: 'Clear Cache and Refresh'
  }, {
    type: 'separator' as const
  }, {
    label: 'Developer',
    children: [[{
      label: 'View Source',
      kbds: ['option', 'meta', 'U'],
      select() {
        console.log('View Source clicked')
      }
    }, {
      label: 'Developer Tools',
      kbds: ['option', 'meta', 'I'],
      select() {
        console.log('Developer Tools clicked')
      }
    }], [{
      label: 'Inspect Elements',
      kbds: ['option', 'meta', 'C'],
      select() {
        console.log('Inspect Elements clicked')
      }
    }], [{
      label: 'JavaScript Console',
      kbds: ['option', 'meta', 'J'],
      select() {
        console.log('JavaScript Console clicked')
      }
    }]]
  }]
]

const sizes = Object.keys(theme.variants.size)

const size = ref('md' as const)

defineShortcuts(extractShortcuts(items))
</script>

<template>
  <div class="flex flex-col items-center gap-8">
    <div class="flex items-center gap-2">
      <USelect v-model="size" :items="sizes" placeholder="Size" />
    </div>

    <UContextMenu :items="items" class="min-w-48" :size="size">
      <div class="flex items-center justify-center rounded-md border border-dashed border-gray-300 dark:border-gray-700 text-sm aspect-video w-72">
        Right click here
      </div>
    </UContextMenu>
  </div>
</template>
