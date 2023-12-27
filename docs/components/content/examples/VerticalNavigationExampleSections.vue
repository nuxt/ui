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

<template>
  <UVerticalNavigation :links="links" />
</template>
