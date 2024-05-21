<script setup lang="ts">
const page = ref(5)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <p>With buttons (default)</p>
      <UPagination v-model:page="page" :total="100" :sibling-count="1" show-edges />
    </div>

    <div class="flex flex-col gap-2">
      <p>With links</p>
      <UPagination v-model:page="page" :total="100" :to="page => ({ query: { page } })" :sibling-count="1" show-edges />
    </div>
  </div>
</template>
