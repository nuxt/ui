<script setup>
const route = useRoute()

const links = [{
  label: 'Horizontal Navigation',
  to: `${route.path.startsWith('/dev') ? '/dev' : ''}/navigation/horizontal-navigation`
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
