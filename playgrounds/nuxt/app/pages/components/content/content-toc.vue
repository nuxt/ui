<script setup lang="ts">
const links = [
  {
    id: 'usage',
    depth: 2,
    text: 'Usage',
    children: [
      {
        id: 'title',
        depth: 3,
        text: 'Title'
      },
      {
        id: 'color',
        depth: 3,
        text: 'Color'
      },
      {
        id: 'highlight',
        depth: 3,
        text: 'Highlight'
      }
    ]
  },
  {
    id: 'api',
    depth: 2,
    text: 'API',
    children: [
      {
        id: 'props',
        depth: 3,
        text: 'Props'
      },
      {
        id: 'slots',
        depth: 3,
        text: 'Slots'
      }
    ]
  },
  {
    id: 'theme',
    depth: 2,
    text: 'Theme'
  }
]
</script>

<template>
  <Navbar />

  <UContentToc :links="links" class="w-full lg:w-64">
    <template #bottom>
      <USeparator type="dashed" />

      <Placeholder class="h-32" />
    </template>
  </UContentToc>
</template>
