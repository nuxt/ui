<script lang="ts">
import { type VNode, computed } from 'vue'
import { provideThemeContext } from '../composables/useComponentUI'
import type { ThemeUI } from '../composables/useComponentUI'
import { provideVariantContext, type VariantUI } from '../composables/useComponentVariant'

export interface ThemeProps {
  ui?: ThemeUI
  variants?: VariantUI
}

export interface ThemeSlots {
  default?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
const props = defineProps<ThemeProps>()

provideThemeContext({
  ui: computed(() => props.ui ?? {}),
})

provideVariantContext({
  variant: computed(() => props.variants ?? {})
})
</script>

<template>
  <slot />
</template>
