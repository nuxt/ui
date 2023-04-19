<script setup>
const links = [{
  label: 'Dashboard',
  icon: 'i-heroicons-home'
}, {
  label: 'Team',
  icon: 'i-heroicons-users'
}, {
  label: 'Projects',
  icon: 'i-heroicons-folder'
}, {
  label: 'Calendar',
  icon: 'i-heroicons-calendar'
}, {
  label: 'Documents',
  icon: 'i-heroicons-inbox'
}, {
  label: 'Reports',
  icon: 'i-heroicons-chart-bar'
}]
</script>

<template>
  <UVerticalNavigation :links="links" />
</template>
