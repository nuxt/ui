<template>
  <div class="grid gap-8 sm:grid-cols-2">
    <DocsPrevNextCard v-if="prev" :to="prev._path" :title="prev.navigation?.title || prev.title" :icon="prev.icon || 'i-heroicons-arrow-small-left'">
      {{ prev.description }}
    </DocsPrevNextCard>
    <span v-else>&nbsp;</span>

    <DocsPrevNextCard v-if="next" :to="next._path" :title="next.navigation?.title || next.title" :icon="next.icon || 'i-heroicons-arrow-small-right'" class="text-right">
      {{ next.description }}
    </DocsPrevNextCard>
  </div>
</template>

<script setup lang="ts">
const { prev, next } = useContent()
</script>
