<template>
  <div class="flex items-center justify-between">
    <UButton v-if="prev" :label="prev.navigation?.title || prev.title" :to="prev._path" icon="i-heroicons-arrow-small-left-20-solid" color="white" />
    <span v-else>&nbsp;</span>
    <UButton v-if="next" :label="next.navigation?.title || next.title" :to="next._path" trailing-icon="i-heroicons-arrow-small-right-20-solid" color="white" />
  </div>
</template>

<script setup lang="ts">
const { prev, next } = useContent()
</script>
