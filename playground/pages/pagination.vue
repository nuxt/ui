<script setup lang="ts">
const page = ref(5)
</script>

<template>
  <UPagination v-model:page="page" :total="100" :sibling-count="1" show-edges />
</template>
