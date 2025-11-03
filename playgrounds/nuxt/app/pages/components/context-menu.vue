<script setup lang="ts">
import theme from '#build/ui/context-menu'

const loading = ref(false)

const items = computed(() => [
  [{
    label: 'My account',
    type: 'label' as const,
    avatar: {
      src: 'https://github.com/benjamincanac.png'
    }
  }],
  [{
    label: 'Appearance',
    description: 'Change the appearance of the app',
    children: [{
      label: 'System',
      icon: 'i-lucide-monitor'
    }, {
      label: 'Light',
      icon: 'i-lucide-sun'
    }, {
      label: 'Dark',
      icon: 'i-lucide-moon'
    }]
  }],
  [{
    label: 'Show Sidebar',
    kbds: ['meta', 'S'],
    onSelect() {
      console.log('Show Sidebar clicked')
    }
  }, {
    label: 'Show Toolbar',
    kbds: ['shift', 'meta', 'D'],
    onSelect() {
      console.log('Show Toolbar clicked')
    }
  }, {
    label: 'Collapse Pinned Tabs',
    disabled: true
  }], [{
    label: 'Refresh the Page',
    loading: loading.value,
    onSelect(e: Event) {
      e.preventDefault()

      loading.value = true
      setTimeout(() => {
        loading.value = false
      }, 2000)
    }
  }, {
    label: 'Clear Cookies and Refresh',
    color: 'warning'
  }, {
    label: 'Clear Cache and Refresh',
    color: 'error'
  }, {
    type: 'separator' as const
  }, {
    label: 'Developer',
    children: [[{
      label: 'View Source',
      description: 'View the source code of the app',
      kbds: ['option', 'meta', 'U'],
      onSelect() {
        console.log('View Source clicked')
      }
    }, {
      label: 'Developer Tools',
      kbds: ['option', 'meta', 'I'],
      onSelect() {
        console.log('Developer Tools clicked')
      }
    }], [{
      label: 'Inspect Elements',
      kbds: ['option', 'meta', 'C'],
      onSelect() {
        console.log('Inspect Elements clicked')
      }
    }], [{
      label: 'JavaScript Console',
      kbds: ['option', 'meta', 'J'],
      onSelect() {
        console.log('JavaScript Console clicked')
      }
    }]]
  }]
])

const sizes = Object.keys(theme.variants.size)

const attrs = reactive({
  size: [theme.defaultVariants.size]
})

defineShortcuts(extractShortcuts(items.value))
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.size" :items="sizes" placeholder="Size" multiple />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <UContextMenu :items="items" v-bind="props">
      <div class="flex items-center justify-center rounded-md border border-dashed border-accented text-sm aspect-video w-72">
        Right click here
      </div>
    </UContextMenu>
  </Matrix>
</template>
