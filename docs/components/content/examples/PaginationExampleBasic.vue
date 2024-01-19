<script setup lang="ts">
const page = ref(1)
const items = ref(Array(55))
</script>

<template>
  <UPagination v-model="page" :page-count="5" :total="items.length" />
</template>
