<script setup>
const links = [{
  label: 'Vertical Navigation',
  to: '/navigation/vertical-navigation'
}, {
  label: 'Command Palette',
  to: '/navigation/command-palette'
}, {
  label: 'Table',
  to: '/data/table'
}]
</script>

<template>
  <UVerticalNavigation :links="links">
    <template #default="{ link }">
      <span class="group-hover:text-primary relative">{{ link.label }}</span>
    </template>
  </UVerticalNavigation>
</template>
