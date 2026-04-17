<script setup lang="ts">
const items = [
  {
    id: '/',
    label: 'Introduction',
    level: 1
  },
  {
    id: '/docs/getting-started#whats-new-in-v3',
    label: 'What\'s new in v3?',
    level: 2
  },
  {
    id: '/docs/getting-started#reka-ui',
    label: 'Reka UI',
    level: 3
  },
  {
    id: '/docs/getting-started#tailwind-css',
    label: 'Tailwind CSS',
    level: 3
  },
  {
    id: '/docs/getting-started#tailwind-variants',
    label: 'Tailwind Variants',
    level: 3
  },
  {
    id: '/docs/getting-started/installation',
    label: 'Installation',
    level: 1
  }
]

function postFilter(searchTerm: string, items: any[]) {
  // Filter only first level items if no searchTerm
  if (!searchTerm) {
    return items?.filter(item => item.level === 1)
  }

  return items
}
</script>

<template>
  <UCommandPalette :groups="[{ id: 'files', items, postFilter }]" class="flex-1" />
</template>
