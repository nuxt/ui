<script setup lang="ts">
const { metaSymbol } = useShortcuts()

const items = computed(() => [
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
    select(e: Event) {
      e.preventDefault()
      console.log('Profile clicked')
    }
  }, {
    label: 'Billing',
    icon: 'i-heroicons-credit-card',
    shortcuts: [metaSymbol.value, 'B']
  }, {
    label: 'Settings',
    icon: 'i-heroicons-cog',
    shortcuts: [metaSymbol.value, ',']
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
      shortcuts: [metaSymbol.value, 'I'],
      select(e: Event) {
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
    shortcuts: [metaSymbol.value, 'N']
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
    to: '/dropdown-menu'
  }, {
    label: 'Shortcuts',
    icon: 'i-heroicons-key'
  }, {
    label: 'API',
    icon: 'i-heroicons-cube',
    disabled: true
  }], [{
    label: 'Logout',
    icon: 'i-heroicons-arrow-right-start-on-rectangle',
    shortcuts: ['⇧', '⌘', 'Q']
  }]
])
</script>

<template>
  <div class="flex-1">
    <UDropdownMenu :items="items" arrow :content="{ side: 'bottom' }" class="min-w-48">
      <UButton label="Open" color="white" />
    </UDropdownMenu>
  </div>
</template>
