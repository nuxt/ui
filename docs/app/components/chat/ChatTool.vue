<script setup lang="ts">
withDefaults(defineProps<{
  text: string
  loading?: boolean
  icon?: string
}>(), {
  loading: false
})
</script>

<template>
  <p data-slot="tool" class="flex items-center gap-1.5 text-muted text-sm">
    <UIcon v-if="icon" :name="icon" class="size-4 shrink-0" />

    <ChatShimmer v-if="loading" :text="text" />
    <span v-else>{{ text }}</span>
  </p>
</template>
