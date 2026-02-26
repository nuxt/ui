<script setup lang="ts">
defineProps<{
  text: string
  icon?: string
  loading?: boolean
}>()
</script>

<template>
  <p data-slot="base" class="flex items-center gap-1.5 text-muted text-sm">
    <UIcon v-if="icon" :name="icon" class="size-4 shrink-0" />

    <ChatShimmer v-if="loading" :text="text" />
    <span v-else>{{ text }}</span>
  </p>
</template>
