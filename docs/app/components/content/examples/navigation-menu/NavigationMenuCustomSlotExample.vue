<script setup lang="ts">
const items = [
  {
    label: 'Guide',
    icon: 'i-heroicons-book-open'

  },
  {
    label: 'Composables',
    icon: 'i-heroicons-circle-stack'

  },
  {
    label: 'Components',
    icon: 'i-heroicons-cube-transparent',
    slot: 'components'
  }
]
</script>

<template>
  <UNavigationMenu :items="items" class="justify-center">
    <template #components-trailing>
      <UBadge label="44" variant="subtle" size="sm" />
    </template>
  </UNavigationMenu>
</template>
