<script setup lang="ts">
defineProps<{
  text: string
  icon?: string
  loading?: boolean
}>()
</script>

<template>
  <p data-slot="base" class="flex items-center gap-1.5 text-muted text-sm min-w-0">
    <UIcon v-if="icon" :name="icon" class="size-4 shrink-0" />

    <ChatShimmer v-if="loading" :text="text" class="truncate" />
    <span v-else class="truncate">{{ text }}</span>
  </p>
</template>
