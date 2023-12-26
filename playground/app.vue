<template>
  <UContainer class="min-h-screen flex items-center">
    <UVerticalNavigation :links="links" />
  </UContainer>
</template>

<script setup>
const links = [
  [
    {
      label: 'Profile',
      avatar: {
        src: 'https://avatars.githubusercontent.com/u/739984?v=4'
      },
      badge: 100
    }, {
      label: 'Installation',
      icon: 'i-heroicons-home',
      to: '/getting-started/installation'
    }, {
      label: 'Vertical Navigation',
      icon: 'i-heroicons-chart-bar',
      to: '/navigation/vertical-navigation'
    }, {
      label: 'Command Palette',
      icon: 'i-heroicons-command-line',
      to: '/navigation/command-palette'
    }
  ],
  [
    {
      label: 'Examples',
      icon: 'i-heroicons-light-bulb',
      to: '/getting-started/examples#verticalnavigation'
    },
    {
      label: 'Help',
      icon: 'i-heroicons-question-mark-circle',
      to: '/getting-started/examples'
    }
  ]
]
</script>

<style>
body {
  @apply antialiased font-sans text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900;
}
</style>
