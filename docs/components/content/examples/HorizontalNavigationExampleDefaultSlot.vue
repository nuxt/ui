<script setup lang="ts">
const links = [{
  label: 'Horizontal Navigation',
  to: '/components/horizontal-navigation'
}, {
  label: 'Command Palette',
  to: '/components/command-palette'
}, {
  label: 'Table',
  to: '/components/table'
}]
</script>

<template>
  <UHorizontalNavigation :links="links">
    <template #default="{ link }">
      <span class="group-hover:text-primary relative">{{ link.label }}</span>
    </template>
  </UHorizontalNavigation>
</template>
