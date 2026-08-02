<script setup lang="ts">
/** A section header's fold-out toggle: ghost until on, tinted while open. */
defineProps<{
  icon: string
  tooltip: string
  ariaLabel?: string
}>()

const open = defineModel<boolean>({ default: false })
</script>

<template>
  <UTooltip :text="tooltip">
    <UButton
      :icon="icon"
      color="neutral"
      variant="ghost"
      size="sm"
      :active="open"
      active-color="primary"
      active-variant="subtle"
      :aria-label="ariaLabel"
      @click="open = !open"
    />
  </UTooltip>
</template>
