<script setup lang="ts">
const rating = ref(3)
</script>

<template>
  <div>
    <URating v-model="rating" />
    <URating v-model="rating" orientation="vertical" />
  </div>
</template>
