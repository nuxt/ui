<template>
  <div class="grid gap-6 sm:grid-cols-2">
    <DocsPrevNextCard v-if="prev" :title="prev.navigation?.title || prev.title" :description="prev.navigation?.description || prev.description" :to="prev._path" icon="i-heroicons-arrow-left-20-solid" />
    <span v-else>&nbsp;</span>
    <DocsPrevNextCard
      v-if="next"
      :title="next.navigation?.title || next.title"
      :description="next.navigation?.description || next.description"
      :to="next._path"
      icon="i-heroicons-arrow-right-20-solid"
      class="text-right"
    />
  </div>
</template>

<script setup lang="ts">
const { prev, next } = useContent()
</script>
