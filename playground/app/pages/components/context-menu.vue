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

const itemsWithColor = computed(() => Object.keys(theme.variants.color).map(color => ({
  color: (color as keyof typeof theme.variants.color),
  icon: 'i-lucide-swatch-book',
  label: color
})))

const sizes = Object.keys(theme.variants.size)

const size = ref('md' as const)

defineShortcuts(extractShortcuts(items.value))
</script>

<template>
  <div class="flex flex-col items-center gap-8">
    <div class="flex items-center gap-2">
      <USelect v-model="size" :items="sizes" placeholder="Size" />
    </div>

    <UContextMenu :items="items" :ui="{ content: 'w-48' }" :size="size">
      <div class="flex items-center justify-center rounded-md border border-dashed border-[var(--ui-border-accented)] text-sm aspect-video w-72">
        Right click here
      </div>
    </UContextMenu>

    <UContextMenu :items="itemsWithColor" :ui="{ content: 'w-48' }" :size="size">
      <div class="flex items-center justify-center rounded-md border border-dashed border-[var(--ui-border-accented)] text-sm aspect-video w-72">
        Color right click here
      </div>
    </UContextMenu>
  </div>
</template>
