<script setup lang="ts">
import theme from '#build/ui/dropdown-menu'

const loading = ref(false)

const items = computed(() => [
  [{
    label: 'My account',
    avatar: {
      src: 'https://github.com/benjamincanac.png'
    },
    type: 'label' as const
  }],
  [{
    label: 'Profile',
    icon: 'i-heroicons-user',
    slot: 'custom' as const,
    onSelect(e: Event) {
      e.preventDefault()
      console.log('Profile clicked')
    }
  }, {
    label: 'Billing',
    icon: 'i-heroicons-credit-card',
    kbds: ['meta', 'b'],
    onSelect() {
      console.log('Billing clicked')
    }
  }, {
    label: 'Settings',
    icon: 'i-heroicons-cog',
    kbds: ['?'],
    onSelect() {
      console.log('Settings clicked')
    }
  }], [{
    label: 'Team',
    icon: 'i-heroicons-users'
  }, {
    label: 'Invite users',
    icon: 'i-heroicons-user-plus',
    children: [[{
      label: 'Invite by email',
      icon: 'i-heroicons-paper-airplane'
    }, {
      label: 'Invite by link',
      icon: 'i-heroicons-link',
      kbds: ['meta', 'i'],
      onSelect(e: Event) {
        e.preventDefault()
        console.log('Invite by link clicked')
      }
    }], [{
      label: 'More',
      icon: 'i-heroicons-plus-circle',
      children: [{
        label: 'Import from Slack',
        icon: 'i-simple-icons-slack',
        to: 'https://slack.com',
        target: '_blank',
        onSelect(e: Event) {
          e.preventDefault()
          console.log('Import from Slack clicked')
        }
      }, {
        label: 'Import from Trello',
        icon: 'i-simple-icons-trello',
        onSelect(e: Event) {
          e.preventDefault()
          console.log('Import from Trello clicked')
        }
      }, {
        label: 'Import from Asana',
        icon: 'i-simple-icons-asana',
        onSelect(e: Event) {
          e.preventDefault()
          console.log('Import from Asana clicked')
        }
      }]
    }]]
  }, {
    label: 'New team',
    icon: 'i-heroicons-plus',
    kbds: ['meta', 'n'],
    loading: loading.value,
    onSelect(e: Event) {
      e.preventDefault()

      loading.value = true
      setTimeout(() => {
        loading.value = false
      }, 2000)
    }
  }], [{
    label: 'GitHub',
    icon: 'i-simple-icons-github',
    to: 'https://github.com/nuxt/ui',
    target: '_blank',
    onSelect(e: Event) {
      e.preventDefault()
    }
  }, {
    label: 'Support',
    icon: 'i-heroicons-lifebuoy',
    to: '/components/dropdown-menu'
  }, {
    type: 'separator' as const
  }, {
    label: 'Keyboard Shortcuts',
    icon: 'i-heroicons-key'
  }, {
    label: 'API',
    icon: 'i-heroicons-cube',
    disabled: true
  }], [{
    label: 'Logout',
    icon: 'i-heroicons-arrow-right-start-on-rectangle',
    kbds: ['shift', 'meta', 'q'],
    onSelect() {
      console.log('Logout clicked')
    }
  }]
])

const sizes = Object.keys(theme.variants.size)

const size = ref('md' as const)

defineShortcuts(extractShortcuts(items.value))
</script>

<template>
  <div class="flex-1">
    <div class="flex flex-col items-center gap-8">
      <USelectMenu v-model="size" :items="sizes" placeholder="Size" />

      <UDropdownMenu :items="items" :size="size" arrow :content="{ side: 'bottom', align: 'start' }" class="min-w-48">
        <UButton label="Open" color="neutral" variant="outline" icon="i-heroicons-bars-3" />

        <template #custom-trailing>
          <UIcon name="i-heroicons-check-badge" class="shrink-0 size-5 text-[var(--ui-primary)]" />
        </template>
      </UDropdownMenu>
    </div>
  </div>
</template>
