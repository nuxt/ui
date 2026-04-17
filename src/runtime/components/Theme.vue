<script lang="ts">
import { type VNode, computed } from 'vue'
import { provideThemeContext } from '../composables/useComponentUI'
import type { ThemeUI } from '../composables/useComponentUI'

export interface ThemeProps {
  ui: ThemeUI
}

export interface ThemeSlots {
  default?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
const props = defineProps<ThemeProps>()

provideThemeContext({
  ui: computed(() => props.ui)
})
</script>

<template>
  <slot />
</template>
