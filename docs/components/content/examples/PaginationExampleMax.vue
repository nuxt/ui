<script setup>
const page = ref(1)
const items = ref(Array(100))
</script>

<template>
  <UPagination v-model="page" :page-count="5" :total="items.length" :max="11" />
</template>
