<script setup lang="ts">
const items = ['One', 'Two', 'Three']

const rows = [
  { id: 1, name: 'Row 1' },
  { id: 2, name: 'Row 2' }
]
</script>

<template>
  <UApp>
    <UButton label="Button" />

    <UEditor content="<p>Hello</p>" />

    <UCarousel v-slot="{ item }" :items="items">
      <div>{{ item }}</div>
    </UCarousel>

    <UTable :data="rows" />
  </UApp>
</template>
