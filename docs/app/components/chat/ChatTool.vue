<script setup lang="ts">
import type { ToolUIPart, DynamicToolUIPart } from 'ai'

const props = defineProps<{
  part: ToolUIPart | DynamicToolUIPart
  text: string
  icon?: string
}>()

const loading = computed(() => props.part.state !== 'output-available')
</script>

<template>
  <p data-slot="base" class="flex items-center gap-1.5 text-muted text-sm">
    <UIcon v-if="icon" :name="icon" class="size-4 shrink-0" />

    <ChatShimmer v-if="loading" :text="text" />
    <span v-else>{{ text }}</span>
  </p>
</template>
