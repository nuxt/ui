<script setup lang="ts">
const items = [
  [{
    label: 'Profile',
    active: true,
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/739984?v=4'
    },
    badge: 100,
    select() {
      console.log('Profile clicked')
    }
  }, {
    label: 'Modal',
    icon: 'i-heroicons-home',
    to: '/modal'
  }, {
    label: 'NavigationMenu',
    icon: 'i-heroicons-chart-bar',
    to: '/navigation-menu'
  }, {
    label: 'Popover',
    icon: 'i-heroicons-command-line',
    to: '/popover'
  }], [{
    label: 'Examples',
    icon: 'i-heroicons-light-bulb',
    to: 'https://ui.nuxt.com',
    target: '_blank',
    slot: 'custom' as const
  }, {
    label: 'Help',
    icon: 'i-heroicons-question-mark-circle',
    disabled: true
  }]
]
</script>

<template>
  <div class="flex flex-col gap-12 w-full max-w-4xl">
    <UNavigationMenu :items="items" class="border-b border-gray-200 dark:border-gray-800">
      <template #custom="{ item }">
        <UIcon :name="item.icon" class="size-5" />

        <span class="truncate text-primary-500 dark:text-primary-400">{{ item.label }}</span>
      </template>
    </UNavigationMenu>

    <UNavigationMenu :items="items" orientation="vertical" class="w-48" />
  </div>
</template>
