<script setup lang="ts">
const links = [{
  label: 'Vertical Navigation',
  to: '/components/vertical-navigation'
}, {
  label: 'Command Palette',
  to: '/components/command-palette'
}, {
  label: 'Table',
  to: '/components/table'
}]
</script>

<template>
  <UVerticalNavigation :links="links">
    <template #default="{ link }">
      <span class="group-hover:text-primary relative">{{ link.label }}</span>
    </template>
  </UVerticalNavigation>
</template>
