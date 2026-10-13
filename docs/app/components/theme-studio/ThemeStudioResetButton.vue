<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

withDefaults(defineProps<ButtonProps & {
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
