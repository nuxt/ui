<script setup>
const links = [{
  label: 'Installation',
  to: '/getting-started/installation'
}, {
  label: 'Vertical Navigation',
  to: '/navigation/vertical-navigation'
}, {
  label: 'Command Palette',
  to: '/navigation/command-palette'
}]
</script>

<template>
  <UVerticalNavigation
    :links="links"
    :ui="{
      wrapper: 'border-l border-gray-200 dark:border-gray-800 space-y-2',
      base: 'group block border-l -ml-px lg:leading-6',
      padding: 'pl-4',
      rounded: '',
      font: '',
      ring: '',
      active: 'text-primary-500 dark:text-primary-400 border-current font-semibold',
      inactive: 'border-transparent hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300'
    }"
  />
</template>
