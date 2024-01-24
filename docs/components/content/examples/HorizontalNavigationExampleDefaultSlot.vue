<script setup>
const links = [{
  label: 'Horizontal Navigation',
  to: '/navigation/horizontal-navigation'
}, {
  label: 'Command Palette',
  to: '/navigation/command-palette'
}, {
  label: 'Table',
  to: '/data/table'
}]
</script>

<template>
  <UHorizontalNavigation :links="links">
    <template #default="{ link }">
      <span class="group-hover:text-primary relative">{{ link.label }}</span>
    </template>
  </UHorizontalNavigation>
</template>
