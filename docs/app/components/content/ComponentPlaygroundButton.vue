<script setup lang="ts">
const { track } = useAnalytics()

const props = defineProps<{
  to: string
  component: string
}>()
</script>

<template>
  <UTooltip text="Open in playground" :content="{ side: 'right' }">
    <UButton
      :to="props.to"
      target="_blank"
      icon="i-lucide-play"
      color="neutral"
      variant="outline"
      size="sm"
      class="absolute bottom-[-13px] right-[-13px] z-1 rounded-full lg:opacity-0 lg:group-hover/component:opacity-100 ring-muted transition-opacity duration-200"
      aria-label="Open in playground"
      tabindex="-1"
      @click="track('Playground Opened', { component: props.component })"
    />
  </UTooltip>
</template>
