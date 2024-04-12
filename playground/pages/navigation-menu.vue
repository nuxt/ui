<script setup lang="ts">
const links = [
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
    target: '_blank'
  }, {
    label: 'Help',
    icon: 'i-heroicons-question-mark-circle',
    disabled: true
  }]
]
</script>

<template>
  <div class="flex flex-col gap-12 w-4xl">
    <UNavigationMenu :links="links" class="border-b border-gray-200 dark:border-gray-800" />

    <UNavigationMenu :links="links" orientation="vertical" class="w-48" />
  </div>
</template>
