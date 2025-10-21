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
    description: 'View your profile',
    icon: 'i-lucide-user',
    slot: 'custom' as const,
    onSelect(e: Event) {
      e.preventDefault()
      console.log('Profile clicked')
    }
  }, {
    label: 'Billing',
    description: 'Manage billing',
    icon: 'i-lucide-credit-card',
    kbds: ['meta', 'b'],
    onSelect() {
      console.log('Billing clicked')
    }
  }, {
    label: 'Settings',
    icon: 'i-lucide-cog',
    kbds: ['?'],
    onSelect() {
      console.log('Settings clicked')
    }
  }], [{
    label: 'Team',
    icon: 'i-lucide-users'
  }, {
    label: 'Invite users',
    icon: 'i-lucide-user-plus',
    children: [[{
      label: 'Invite by email',
      icon: 'i-lucide-send-horizontal'
    }, {
      label: 'Invite by link',
      icon: 'i-lucide-link',
      kbds: ['meta', 'i'],
      onSelect(e: Event) {
        e.preventDefault()
        console.log('Invite by link clicked')
      }
    }], [{
      label: 'More',
      description: 'Import from more sources',
      icon: 'i-lucide-circle-plus',
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
    icon: 'i-lucide-plus',
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
    icon: 'i-lucide-life-buoy',
    to: '/components/dropdown-menu'
  }, {
    type: 'separator' as const
  }, {
    label: 'Keyboard Shortcuts',
    icon: 'i-lucide-key-round'
  }, {
    label: 'API',
    icon: 'i-lucide-box',
    disabled: true
  }], [{
    label: 'Logout',
    icon: 'i-lucide-log-out',
    color: 'error',
    kbds: ['shift', 'meta', 'q'],
    onSelect() {
      console.log('Logout clicked')
    }
  }]
])

const sizes = Object.keys(theme.variants.size)

const attrs = reactive({
  size: [theme.defaultVariants.size]
})

const arrow = ref(false)

defineShortcuts(extractShortcuts(items.value))
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.size" :items="sizes" multiple placeholder="Size" />
    <USwitch v-model="arrow" label="Arrow" />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <UDropdownMenu :items="items" :arrow="arrow" :content="{ side: 'bottom', align: 'start' }" v-bind="props">
      <UButton label="Open" color="neutral" variant="outline" icon="i-lucide-menu" />

      <template #custom-trailing>
        <UIcon name="i-lucide-badge-check" class="shrink-0 size-5 text-primary" />
      </template>
    </UDropdownMenu>
  </Matrix>
</template>
