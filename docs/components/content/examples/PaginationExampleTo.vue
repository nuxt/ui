<script setup lang="ts">
const page = ref(1)
const items = ref(Array(50))
</script>

<template>
  <UPagination
    v-model="page"
    :page-count="5"
    :total="items.length"
    :to="(page: number) => ({
      query: { page },
      // Hash is specified here to prevent the page from scrolling to the top
      hash: '#links'
    })"
  />
</template>
