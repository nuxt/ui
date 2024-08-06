<script setup lang="ts">
import theme from '#build/ui/dropdown-menu'

const items = [
  [{
    label: 'My account',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/739984?v=4'
    },
    type: 'label' as const
  }],
  [{
    label: 'Profile',
    icon: 'i-heroicons-user',
    slot: 'custom' as const,
    select(e: Event) {
      e.preventDefault()
      console.log('Profile clicked')
    }
  }, {
    label: 'Billing',
    icon: 'i-heroicons-credit-card',
    kbds: ['meta', 'b'],
    select() {
      console.log('Billing clicked')
    }
  }, {
    label: 'Settings',
    icon: 'i-heroicons-cog',
    kbds: ['?'],
    select() {
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
      select(e: Event) {
        e?.preventDefault()
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
        select(e: Event) {
          e.preventDefault()
          console.log('Import from Slack clicked')
        }
      }, {
        label: 'Import from Trello',
        icon: 'i-simple-icons-trello',
        select(e: Event) {
          e.preventDefault()
          console.log('Import from Trello clicked')
        }
      }, {
        label: 'Import from Asana',
        icon: 'i-simple-icons-asana',
        select(e: Event) {
          e.preventDefault()
          console.log('Import from Asana clicked')
        }
      }]
    }]]
  }, {
    label: 'New team',
    icon: 'i-heroicons-plus',
    kbds: ['meta', 'n'],
    select() {
      console.log('New team clicked')
    }
  }], [{
    label: 'GitHub',
    icon: 'i-simple-icons-github',
    to: 'https://github.com/nuxt/ui',
    target: '_blank',
    select(e: Event) {
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
    select() {
      console.log('Logout clicked')
    }
  }]
]

const sizes = Object.keys(theme.variants.size)

const size = ref('md' as const)

defineShortcuts(extractShortcuts(items))
</script>

<template>
  <div class="flex-1">
    <div class="flex flex-col items-center gap-8">
      <USelectMenu v-model="size" :items="sizes" placeholder="Size" />

      <UDropdownMenu :items="items" :size="size" arrow :content="{ side: 'bottom', align: 'start' }" class="min-w-48">
        <UButton label="Open" color="gray" variant="outline" icon="i-heroicons-bars-3" />

        <template #custom-trailing>
          <UIcon name="i-heroicons-check-badge" class="shrink-0 size-5 text-primary-500 dark:text-primary-400" />
        </template>
      </UDropdownMenu>
    </div>
  </div>
</template>
