<script lang="ts">
import type * as buildUI from '#build/ui'
import type { TVConfig } from '../types/tv'
import { computed } from 'vue'
import { provideUTheme } from '../composables/useComponentUI'

type UIConfig = TVConfig<typeof buildUI>

export interface ThemeProps {
  ui: UIConfig
}

export interface ThemeSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
const props = defineProps<ThemeProps>()

const rootContext = computed(() => props.ui)
provideUTheme({
  ui: rootContext
})
</script>

<template>
  <slot />
</template>
