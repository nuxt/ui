<script setup lang="ts">
const items = [
  {
    label: 'Guide',
    icon: 'i-lucide-book-open'

  },
  {
    label: 'Composables',
    icon: 'i-lucide-database'

  },
  {
    label: 'Components',
    icon: 'i-lucide-box',
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
