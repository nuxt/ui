<script lang="ts">
import type * as theme from '#build/ui'
import type { TVConfig } from '../types/tv'
import { computed } from 'vue'
import { provideThemeContext } from '../composables/useComponentUI'

type UIConfig = TVConfig<typeof theme>

export interface ThemeProps {
  ui: UIConfig
}

export interface ThemeSlots {
  default(props?: {}): any
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
