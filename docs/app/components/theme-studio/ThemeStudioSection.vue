<script setup lang="ts">
/** One settings section: a plain header row above its always-visible controls. */
defineProps<{
  label: string
  /** Docs page the header's help icon links to */
  helpTo?: string
}>()

const slots = defineSlots<{
  default: () => any
  /** Right-aligned controls in the header row (edit/adjust toggles). */
  actions: () => any
}>()
</script>

<template>
  <div>
    <div class="flex items-center gap-1 mb-1.5">
      <span class="text-xs font-semibold text-highlighted select-none">{{ label }}</span>

      <UButton
        v-if="helpTo"
        :to="helpTo"
        size="xs"
        color="neutral"
        variant="ghost"
        icon="i-lucide-help-circle"
        :ui="{ leadingIcon: 'size-3' }"
      />

      <div v-if="!!slots.actions" class="ms-auto flex items-center gap-1.5">
        <slot name="actions" />
      </div>
    </div>

    <slot />
  </div>
</template>
