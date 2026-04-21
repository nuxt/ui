<script lang="ts">
import { type VNode, computed } from 'vue'
import { provideThemeContext } from '../composables/useComponentUI'
import type { ThemeUI, ThemeVariants } from '../composables/useComponentUI'

export interface ThemeProps {
  ui?: ThemeUI
  variants?: ThemeVariants
}

export interface ThemeSlots {
  default?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
const props = defineProps<ThemeProps>()

provideThemeContext({
  ui: computed(() => props.ui ?? {}),
  variants: computed(() => props.variants ?? {})
})
</script>

<template>
  <slot />
</template>
