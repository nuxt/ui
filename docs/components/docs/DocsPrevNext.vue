<template>
  <div class="grid gap-6 sm:grid-cols-2">
    <DocsPrevNextCard
      v-if="prev"
      :title="prev.title"
      :description="prev.description"
      :to="prev._path"
      icon="i-heroicons-arrow-left-20-solid"
    />
    <span v-else class="hidden sm:block">&nbsp;</span>
    <DocsPrevNextCard
      v-if="next"
      :title="next.title"
      :description="next.description"
      :to="next._path"
      icon="i-heroicons-arrow-right-20-solid"
      class="text-right"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  prev: {
    type: Object,
    default: null
  },
  next: {
    type: Object,
    default: null
  }
})
</script>
