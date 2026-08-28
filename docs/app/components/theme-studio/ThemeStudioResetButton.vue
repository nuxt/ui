<script setup lang="ts">
/**
 * The studio's two-stage reset: edits go back to the preset, a second press
 * clears the preset back to stock. The label names whichever is next.
 */
withDefaults(defineProps<{
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'ghost' | 'subtle' | 'outline'
  /** A full-width labelled row, for the mobile menu where the other controls stack. */
  vertical?: boolean
}>(), {
  variant: 'ghost'
})

const studioIcons = useStudioIcons()
const { canReset, resetLabel, resetToBaseline } = useThemeStudioToolbar()
</script>

<template>
  <UTooltip :text="resetLabel" :disabled="vertical">
    <UButton
      :icon="studioIcons.reset"
      :label="vertical ? resetLabel : undefined"
      color="neutral"
      :variant="vertical ? 'outline' : variant"
      :size="size"
      :block="vertical"
      :disabled="!canReset"
      :aria-label="resetLabel"
      :ui="{ leadingIcon: vertical && 'text-dimmed' }"
      @click="resetToBaseline"
    />
  </UTooltip>
</template>
